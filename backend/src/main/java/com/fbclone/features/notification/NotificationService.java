package com.fbclone.features.notification;

import com.fbclone.core.dto.PaginatedResponse;
import com.fbclone.features.user.User;

import java.util.UUID;

public interface NotificationService {
    void createNotification(User recipient, User actor, NotificationType type, UUID targetId);
    PaginatedResponse<NotificationResponse> getUserNotifications(String email, int page, int limit);
    long getUnreadCount(String email);
    void markAsRead(UUID notificationId, String email);
    void markAllAsRead(String email);
}
