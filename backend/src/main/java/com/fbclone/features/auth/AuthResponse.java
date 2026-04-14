package com.fbclone.features.auth;

import com.fbclone.features.user.UserResponse;
import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponse {
    private String token;
    @Builder.Default
    private String type = "Bearer";
    private UserResponse user;
}
