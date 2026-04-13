package com.fbclone.service;

import com.fbclone.dto.*;
import com.fbclone.entity.Comment;
import com.fbclone.entity.Like;
import com.fbclone.entity.Post;
import com.fbclone.entity.User;
import com.fbclone.repository.CommentRepository;
import com.fbclone.repository.LikeRepository;
import com.fbclone.repository.PostRepository;
import com.fbclone.repository.UserRepository;
import com.fbclone.exception.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final LikeRepository likeRepository;
    private final CommentRepository commentRepository;

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

    public PaginatedResponse<PostResponse> getFeed(int page, int limit, String currentUserEmail) {
        Page<Post> postPage = postRepository.findAllByOrderByCreatedAtDesc(PageRequest.of(page - 1, limit));

        return PaginatedResponse.<PostResponse>builder()
                .data(postPage.getContent().stream().map(post -> mapToResponse(post, currentUserEmail)).collect(Collectors.toList()))
                .total(postPage.getTotalElements())
                .page(page)
                .limit(limit)
                .hasMore(postPage.hasNext())
                .build();
    }

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
        }

        Post savedPost = postRepository.save(post);
        return mapToResponse(savedPost, email);
    }

    @Transactional
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
        return mapToResponse(savedPost, email);
    }

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
        User author = post.getAuthor();
        UserResponse authorResponse = UserResponse.fromEntity(author);

        boolean isLiked = false;
        if (currentUserEmail != null) {
            User currentUser = userRepository.findByEmail(currentUserEmail).orElse(null);
            if (currentUser != null) {
                isLiked = likeRepository.existsByUserAndPost(currentUser, post);
            }
        }

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
