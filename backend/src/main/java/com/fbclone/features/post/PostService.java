package com.fbclone.features.post;

import com.fbclone.core.dto.PaginatedResponse;
import java.util.UUID;

public interface PostService {
    PostResponse createPost(CreatePostRequest request, String email);
    PaginatedResponse<PostResponse> getFeed(int page, int limit, String currentUserEmail);
    PostResponse toggleLike(UUID postId, String email);
    PostResponse addComment(UUID postId, String content, String email);
    PaginatedResponse<CommentResponse> getComments(UUID postId, int page, int limit);
}
