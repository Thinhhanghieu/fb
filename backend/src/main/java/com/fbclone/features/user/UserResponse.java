package com.fbclone.features.user;

import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserResponse {
    private String id;
    private String name;
    private String username;
    private String email;
    private String avatar;
    private String coverPhoto;
    private String bio;
    private String location;
    private LocalDateTime joinedAt;
    private int friendsCount;
    private boolean isOnline;

    public static UserResponse fromEntity(User user) {
        return UserResponse.builder()
                .id(user.getId().toString())
                .name(user.getFullName())
                .username(user.getUsername())
                .email(user.getEmail())
                .avatar(user.getAvatarUrl())
                .coverPhoto(user.getCoverUrl())
                .bio(user.getBio())
                .location(user.getLocation())
                .joinedAt(user.getCreatedAt())
                .friendsCount(user.getFriendsCount())
                .isOnline(user.isOnline())
                .build();
    }
}
