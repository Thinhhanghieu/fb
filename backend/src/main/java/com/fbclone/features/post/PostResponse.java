package com.fbclone.features.post;

import com.fbclone.features.user.UserResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PostResponse {
    private UUID id;
    private String content;
    private List<String> images;
    private int likesCount;
    private int commentsCount;
    private int sharesCount;
    private boolean isLiked;
    private LocalDateTime createdAt;
    private UserResponse author;
}
