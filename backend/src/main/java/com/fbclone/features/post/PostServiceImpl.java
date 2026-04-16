package com.fbclone.features.post;

import com.fbclone.core.dto.PaginatedResponse;
import com.fbclone.features.notification.NotificationService;
import com.fbclone.features.notification.NotificationType;
import com.fbclone.core.exception.NotFoundException;
import com.fbclone.features.user.User;
import com.fbclone.features.user.UserRepository;
import com.fbclone.features.user.UserResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostServiceImpl implements PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final LikeRepository likeRepository;
    private final CommentRepository commentRepository;
    private final NotificationService notificationService;

    @Override
    public PostResponse createPost(CreatePostRequest request, String email) {
        User author = userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("User not found"));

        Post post = Post.builder()
                .content(request.getContent())
                .images(request.getImages() != null ? request.getImages() : new ArrayList<>())
                .author(author)
                .build();

        Post savedPost = postRepository.save(post);
        return mapToResponse(savedPost, email);
    }

    @Override
    public PaginatedResponse<PostResponse> getFeed(int page, int limit, String currentUserEmail) {
        Page<Post> postPage = postRepository.findAllByOrderByCreatedAtDesc(PageRequest.of(page - 1, limit));
        List<Post> posts = postPage.getContent();
        
        Set<UUID> likedPostIds = new HashSet<>();
        if (currentUserEmail != null) {
            userRepository.findByEmail(currentUserEmail).ifPresent(user -> {
                List<UUID> postIds = posts.stream().map(Post::getId).collect(Collectors.toList());
                likedPostIds.addAll(likeRepository.findLikedPostIdsByUserIdAndPostIds(user.getId(), postIds));
            });
        }

        final Set<UUID> finalLikedPostIds = likedPostIds;
        return PaginatedResponse.<PostResponse>builder()
                .data(posts.stream()
                        .map(post -> mapToResponseWithLikedInfo(post, finalLikedPostIds.contains(post.getId())))
                        .collect(Collectors.toList()))
                .total(postPage.getTotalElements())
                .page(page)
                .limit(limit)
                .hasMore(postPage.hasNext())
                .build();
    }

    @Override
    @Transactional
    public PostResponse toggleLike(UUID postId, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("User not found"));
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new NotFoundException("Post not found"));

        Optional<Like> existingLike = likeRepository.findByUserAndPost(user, post);

        if (existingLike.isPresent()) {
            likeRepository.delete(existingLike.get());
            post.setLikesCount(Math.max(0, post.getLikesCount() - 1));
        } else {
            Like like = Like.builder()
                    .user(user)
                    .post(post)
                    .build();
            likeRepository.save(like);
            post.setLikesCount(post.getLikesCount() + 1);

            // Trigger notification
            notificationService.createNotification(post.getAuthor(), user, NotificationType.LIKE_POST, post.getId());
        }

        Post savedPost = postRepository.save(post);
        boolean isLiked = !existingLike.isPresent();
        return mapToResponseWithLikedInfo(savedPost, isLiked);
    }

    @Override
    @Transactional
    @CacheEvict(value = "comments", key = "#postId")
    public PostResponse addComment(UUID postId, String content, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("User not found"));
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new NotFoundException("Post not found"));

        Comment comment = Comment.builder()
                .author(user)
                .post(post)
                .content(content)
                .build();

        commentRepository.save(comment);
        post.setCommentsCount(post.getCommentsCount() + 1);
        
        Post savedPost = postRepository.save(post);

        // Trigger notification
        notificationService.createNotification(post.getAuthor(), user, NotificationType.COMMENT_POST, post.getId());

        boolean isLiked = likeRepository.existsByUserAndPost(user, post);
        return mapToResponseWithLikedInfo(savedPost, isLiked);
    }

    @Override
    @Cacheable(value = "comments", key = "#postId + '-' + #page + '-' + #limit")
    public PaginatedResponse<CommentResponse> getComments(UUID postId, int page, int limit) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new NotFoundException("Post not found"));
        
        Page<Comment> commentPage = commentRepository.findByPostOrderByCreatedAtDesc(post, PageRequest.of(page - 1, limit));

        return PaginatedResponse.<CommentResponse>builder()
                .data(commentPage.getContent().stream().map(CommentResponse::fromEntity).collect(Collectors.toList()))
                .total(commentPage.getTotalElements())
                .page(page)
                .limit(limit)
                .hasMore(commentPage.hasNext())
                .build();
    }

    private PostResponse mapToResponse(Post post, String currentUserEmail) {
        boolean isLiked = false;
        if (currentUserEmail != null) {
            isLiked = userRepository.findByEmail(currentUserEmail)
                    .map(user -> likeRepository.existsByUserAndPost(user, post))
                    .orElse(false);
        }
        return mapToResponseWithLikedInfo(post, isLiked);
    }

    private PostResponse mapToResponseWithLikedInfo(Post post, boolean isLiked) {
        User author = post.getAuthor();
        UserResponse authorResponse = UserResponse.fromEntity(author);

        return PostResponse.builder()
                .id(post.getId())
                .content(post.getContent())
                .images(post.getImages())
                .likesCount(post.getLikesCount())
                .commentsCount(post.getCommentsCount())
                .sharesCount(post.getSharesCount())
                .isLiked(isLiked)
                .createdAt(post.getCreatedAt() != null ? post.getCreatedAt() : LocalDateTime.now())
                .author(authorResponse)
                .build();
    }
}
