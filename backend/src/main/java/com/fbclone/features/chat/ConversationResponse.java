package com.fbclone.features.chat;

import com.fbclone.features.user.UserResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ConversationResponse {
    private UUID id;
    private List<UserResponse> participants;
    private ChatMessageResponse lastMessage;
    private LocalDateTime updatedAt;
    private long unreadCount;

    public static ConversationResponse fromEntity(Conversation conversation, UUID currentUserId) {
        return ConversationResponse.builder()
                .id(conversation.getId())
                .participants(conversation.getParticipants().stream()
                        .filter(u -> !u.getId().equals(currentUserId)) // Lọc bỏ chính mình
                        .map(UserResponse::fromEntity)
                        .collect(Collectors.toList()))
                .lastMessage(conversation.getLastMessage() != null ? 
                        ChatMessageResponse.fromEntity(conversation.getLastMessage()) : null)
                .updatedAt(conversation.getUpdatedAt())
                .unreadCount(0) // Tạm thời để 0, có thể tính toán sau
                .build();
    }
}
