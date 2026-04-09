package com.fbclone.controller;

import com.fbclone.config.JwtProvider;
import com.fbclone.dto.AuthRequest;
import com.fbclone.dto.AuthResponse;
import com.fbclone.dto.RegisterRequest;
import com.fbclone.dto.UserResponse;
import com.fbclone.entity.User;
import com.fbclone.repository.UserRepository;
import com.fbclone.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final JwtProvider jwtProvider;
    private final UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        User user = User.builder()
                .email(request.getEmail())
                .password(request.getPassword())
                .fullName(request.getFullName())
                .username(request.getUsername())
                .build();

        User savedUser = authService.register(user);
        String token = jwtProvider.generateToken(savedUser.getEmail());

        return ResponseEntity.ok(AuthResponse.builder()
                .token(token)
                .type("Bearer")
                .user(UserResponse.fromEntity(savedUser))
                .build());
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        return authService.authenticate(request.getEmail(), request.getPassword())
                .map(user -> {
                    String token = jwtProvider.generateToken(user.getEmail());
                    return ResponseEntity.ok(AuthResponse.builder()
                            .token(token)
                            .type("Bearer")
                            .user(UserResponse.fromEntity(user))
                            .build());
                })
                .orElse(ResponseEntity.status(400).build());
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getMe(Authentication authentication) {
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .map(user -> ResponseEntity.ok(UserResponse.fromEntity(user)))
                .orElse(ResponseEntity.status(404).build());
    }

    @GetMapping("/hello")
    public ResponseEntity<String> hello() {
        return ResponseEntity.ok("Backend is running!");
    }
}
