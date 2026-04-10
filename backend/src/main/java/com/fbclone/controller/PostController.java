package com.fbclone.controller;

import com.fbclone.dto.CreatePostRequest;
import com.fbclone.dto.PaginatedResponse;
import com.fbclone.dto.PostResponse;
import com.fbclone.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    @PostMapping
    public ResponseEntity<PostResponse> createPost(
            @RequestBody CreatePostRequest request,
            Authentication authentication) {
        
        // MOCK: Nếu chưa login mà đang test, tạm lấy email mặc định hoặc báo lỗi.
        // Thực tế Spring Security chặn nếu ko có token, nhưng nếu bạn set permitAll() thì auth null.
        String email = authentication != null ? authentication.getName() : "test@example.com";
        
        return ResponseEntity.ok(postService.createPost(request, email));
    }

    @GetMapping
    public ResponseEntity<PaginatedResponse<PostResponse>> getFeed(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit) {

        return ResponseEntity.ok(postService.getFeed(page, limit));
    }
}
