package com.fbclone.controller;

import com.fbclone.dto.CreatePostRequest;
import com.fbclone.dto.PaginatedResponse;
import com.fbclone.dto.PostResponse;
import com.fbclone.dto.CommentRequest;
import com.fbclone.dto.CommentResponse;
import com.fbclone.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    @PostMapping
    public ResponseEntity<PostResponse> createPost(
            @RequestBody CreatePostRequest request,
            Authentication authentication) {
        
        String email = authentication != null ? authentication.getName() : null;
        return ResponseEntity.ok(postService.createPost(request, email));
    }

    @GetMapping
    public ResponseEntity<PaginatedResponse<PostResponse>> getFeed(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit,
            Authentication authentication) {

        String email = authentication != null ? authentication.getName() : null;
        return ResponseEntity.ok(postService.getFeed(page, limit, email));
    }

    @PostMapping("/{postId}/like")
    public ResponseEntity<PostResponse> toggleLike(
            @PathVariable UUID postId,
            Authentication authentication) {
        
        String email = authentication != null ? authentication.getName() : null;
        if (email == null) return ResponseEntity.status(401).build();
        
        return ResponseEntity.ok(postService.toggleLike(postId, email));
    }

    @PostMapping("/{postId}/comments")
    public ResponseEntity<PostResponse> addComment(
            @PathVariable UUID postId,
            @RequestBody CommentRequest request,
            Authentication authentication) {
        
        String email = authentication != null ? authentication.getName() : null;
        if (email == null) return ResponseEntity.status(401).build();
        
        return ResponseEntity.ok(postService.addComment(postId, request.getContent(), email));
    }

    @GetMapping("/{postId}/comments")
    public ResponseEntity<PaginatedResponse<CommentResponse>> getComments(
            @PathVariable UUID postId,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit) {

        return ResponseEntity.ok(postService.getComments(postId, page, limit));
    }
}
