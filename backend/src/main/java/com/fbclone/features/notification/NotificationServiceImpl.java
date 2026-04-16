package com.fbclone.features.notification;

import com.fbclone.core.dto.PaginatedResponse;
import com.fbclone.core.exception.NotFoundException;
import com.fbclone.core.exception.UnauthorizedException;
import com.fbclone.features.user.User;
import com.fbclone.features.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final org.springframework.messaging.simp.SimpMessagingTemplate messagingTemplate;

    @Override
    @Transactional
    public void createNotification(User recipient, User actor, NotificationType type, UUID targetId) {
        // Don't notify if the actor is the recipient
        if (recipient.getId().equals(actor.getId())) {
            return;
        }

        Notification notification = Notification.builder()
                .recipient(recipient)
                .actor(actor)
                .type(type)
                .targetId(targetId)
                .build();

        Notification savedNotification = notificationRepository.save(notification);
        
        // Gửi thông báo qua WebSocket đến recipient
        messagingTemplate.convertAndSendToUser(
                recipient.getEmail(),
                "/topic/notifications",
                NotificationResponse.fromEntity(savedNotification)
        );
    }

    @Override
    public PaginatedResponse<NotificationResponse> getUserNotifications(String email, int page, int limit) {
        User recipient = userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("User not found"));

        Page<Notification> notificationPage = notificationRepository.findByRecipientOrderByCreatedAtDesc(
                recipient, PageRequest.of(page - 1, limit));

        return PaginatedResponse.<NotificationResponse>builder()
                .data(notificationPage.getContent().stream()
                        .map(NotificationResponse::fromEntity)
                        .collect(Collectors.toList()))
                .total(notificationPage.getTotalElements())
                .page(page)
                .limit(limit)
                .hasMore(notificationPage.hasNext())
                .build();
    }

    @Override
    public long getUnreadCount(String email) {
        User recipient = userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("User not found"));
        return notificationRepository.countByRecipientAndIsReadFalse(recipient);
    }

    @Override
    @Transactional
    public void markAsRead(UUID notificationId, String email) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new NotFoundException("Notification not found"));

        if (!notification.getRecipient().getEmail().equals(email)) {
            throw new UnauthorizedException("Unauthorized action");
        }

        notification.setRead(true);
        notificationRepository.save(notification);
    }

    @Override
    @Transactional
    public void markAllAsRead(String email) {
        User recipient = userRepository.findByEmail(email)
                .orElseThrow(() -> new NotFoundException("User not found"));
        notificationRepository.markAllAsRead(recipient);
    }
}
