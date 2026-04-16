package com.fbclone.features.notification;

import com.fbclone.features.user.UserResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationResponse {
    private UUID id;
    private String type;
    private UserResponse actor;
    private UUID targetId;
    private boolean isRead;
    private LocalDateTime createdAt;
    private String message;

    public static NotificationResponse fromEntity(Notification notification) {
        String message = "";
        switch (notification.getType()) {
            case LIKE_POST -> message = "đã thích bài viết của bạn.";
            case COMMENT_POST -> message = "đã bình luận bài viết của bạn.";
            case FRIEND_REQUEST -> message = "đã gửi cho bạn một lời mời kết bạn.";
            case FRIEND_ACCEPT -> message = "đã chấp nhận lời mời kết bạn của bạn.";
        }

        return NotificationResponse.builder()
                .id(notification.getId())
                .type(notification.getType().name())
                .actor(UserResponse.fromEntity(notification.getActor()))
                .targetId(notification.getTargetId())
                .isRead(notification.isRead())
                .createdAt(notification.getCreatedAt())
                .message(message)
                .build();
    }
}
