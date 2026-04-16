package com.fbclone.features.user;

import com.fbclone.core.dto.PaginatedResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/search")
    public ResponseEntity<PaginatedResponse<UserResponse>> searchUsers(
            @RequestParam(name = "q", required = false, defaultValue = "") String query,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit,
            Authentication authentication) {
        String currentUserEmail = authentication != null ? authentication.getName() : null;
        return ResponseEntity.ok(userService.searchUsers(query, page, limit, currentUserEmail));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<UserResponse> getProfile(@PathVariable UUID userId, Authentication authentication) {
        String currentUserEmail = authentication != null ? authentication.getName() : null;
        return ResponseEntity.ok(userService.getProfile(userId, currentUserEmail));
    }
}
