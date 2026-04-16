package com.fbclone.features.auth;

import com.fbclone.config.JwtProvider;
import com.fbclone.features.user.User;
import com.fbclone.features.user.UserRepository;
import com.fbclone.features.user.UserResponse;
import com.fbclone.core.exception.NotFoundException;
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
    public ResponseEntity<AuthResponse> register(@jakarta.validation.Valid @RequestBody RegisterRequest request) {
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
        User user = authService.authenticate(request.getEmail(), request.getPassword());
        String token = jwtProvider.generateToken(user.getEmail());
        
        return ResponseEntity.ok(AuthResponse.builder()
                .token(token)
                .type("Bearer")
                .user(UserResponse.fromEntity(user))
                .build());
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getMe(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("User profile not found"));
        
        return ResponseEntity.ok(UserResponse.fromEntity(user));
    }

    @GetMapping("/hello")
    public ResponseEntity<String> hello() {
        return ResponseEntity.ok("Backend is running!");
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout() {
        // Since we are using stateless JWT, we can just return success.
        // In more complex scenarios, you might want to blacklist the token.
        return ResponseEntity.ok().build();
    }
}
