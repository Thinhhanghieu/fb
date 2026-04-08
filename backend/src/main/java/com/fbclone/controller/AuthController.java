package com.fbclone.controller;

import com.fbclone.config.JwtProvider;
import com.fbclone.dto.AuthRequest;
import com.fbclone.dto.AuthResponse;
import com.fbclone.dto.RegisterRequest;
import com.fbclone.entity.User;
import com.fbclone.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final JwtProvider jwtProvider;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        User user = User.builder()
                .email(request.getEmail())
                .password(request.getPassword())
                .fullName(request.getFullName())
                .username(request.getUsername())
                .build();
        
        authService.register(user);
        String token = jwtProvider.generateToken(user.getEmail());
        
        return ResponseEntity.ok(AuthResponse.builder().token(token).build());
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        return authService.authenticate(request.getEmail(), request.getPassword())
                .map(user -> {
                    String token = jwtProvider.generateToken(user.getEmail());
                    return ResponseEntity.ok(AuthResponse.builder().token(token).build());
                })
                .orElse(ResponseEntity.status(401).build());
    }

    @GetMapping("/hello")
    public ResponseEntity<String> hello() {
        return ResponseEntity.ok("Backend is running! 🚀");
    }
}
