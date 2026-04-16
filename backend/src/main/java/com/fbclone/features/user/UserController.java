package com.fbclone.features.user;

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

    @GetMapping("/{userId}")
    public ResponseEntity<UserResponse> getProfile(@PathVariable UUID userId, Authentication authentication) {
        String currentUserEmail = authentication != null ? authentication.getName() : null;
        return ResponseEntity.ok(userService.getProfile(userId, currentUserEmail));
    }
}
