package com.fbclone.service;

import com.fbclone.dto.CreatePostRequest;
import com.fbclone.dto.PaginatedResponse;
import com.fbclone.dto.PostResponse;
import com.fbclone.dto.UserResponse;
import com.fbclone.entity.Post;
import com.fbclone.entity.User;
import com.fbclone.repository.PostRepository;
import com.fbclone.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;

    public PostResponse createPost(CreatePostRequest request, String email) {
        User author = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Post post = Post.builder()
                .content(request.getContent())
                .images(request.getImages() != null ? request.getImages() : new ArrayList<>())
                .author(author)
                .build();

        Post savedPost = postRepository.save(post);
        return mapToResponse(savedPost);
    }

    public PaginatedResponse<PostResponse> getFeed(int page, int limit) {
        Page<Post> postPage = postRepository.findAllByOrderByCreatedAtDesc(PageRequest.of(page - 1, limit));

        return PaginatedResponse.<PostResponse>builder()
                .data(postPage.getContent().stream().map(this::mapToResponse).collect(Collectors.toList()))
                .total(postPage.getTotalElements())
                .page(page)
                .limit(limit)
                .hasMore(postPage.hasNext())
                .build();
    }

    private PostResponse mapToResponse(Post post) {
        User author = post.getAuthor();
        UserResponse authorResponse = UserResponse.fromEntity(author);

        return PostResponse.builder()
                .id(post.getId())
                .content(post.getContent())
                .images(post.getImages())
                .likesCount(post.getLikesCount())
                .commentsCount(post.getCommentsCount())
                .sharesCount(post.getSharesCount())
                .createdAt(post.getCreatedAt() != null ? post.getCreatedAt() : LocalDateTime.now())
                .author(authorResponse)
                .build();
    }
}
