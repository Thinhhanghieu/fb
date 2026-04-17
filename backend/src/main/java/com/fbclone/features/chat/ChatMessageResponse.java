package com.fbclone.features.chat;

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
public class ChatMessageResponse {
    private UUID id;
    private UUID conversationId;
    private UserResponse sender;
    private String content;
    private MessageType type;
    private String attachmentUrl;
    private LocalDateTime createdAt;
    private boolean isRead;

    public static ChatMessageResponse fromEntity(ChatMessage message) {
        return ChatMessageResponse.builder()
                .id(message.getId())
                .conversationId(message.getConversation().getId())
                .sender(UserResponse.fromEntity(message.getSender()))
                .content(message.getContent())
                .type(message.getType())
                .attachmentUrl(message.getAttachmentUrl())
                .createdAt(message.getCreatedAt())
                .isRead(message.isRead())
                .build();
    }
}
