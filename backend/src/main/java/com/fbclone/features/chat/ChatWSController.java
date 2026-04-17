package com.fbclone.features.chat;

import com.fbclone.features.user.User;
import com.fbclone.features.user.UserRepository;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.security.Principal;
import java.util.UUID;

@Controller
@RequiredArgsConstructor
@lombok.extern.slf4j.Slf4j
public class ChatWSController {

    private final ChatService chatService;
    private final SimpMessagingTemplate messagingTemplate;
    private final ConversationRepository conversationRepository;
    private final UserRepository userRepository;

    /**
     * Client gửi tin nhắn tới: /app/chat.sendMessage
     */
    @org.springframework.transaction.annotation.Transactional
    @MessageMapping("/chat.sendMessage")
    public void sendMessage(@Payload ChatMessageRequest request, Principal principal) {
        if (principal == null) {
            log.error("WebSocket sendMessage error: Principal is null");
            return;
        }
        
        String senderEmail = principal.getName();
        log.info("Received WebSocket message from {}: type={}, content={}", 
                senderEmail, request.getType(), request.getContent());
        
        // 1. Lưu tin nhắn vào DB với thông tin media
        ChatMessageResponse savedMessage = chatService.saveMessage(
                request.getConversationId(), 
                request.getContent(), 
                senderEmail,
                request.getType(),
                request.getAttachmentUrl()
        );

        // 2. Gửi tin nhắn tới Topic chung của cuộc hội thoại
        String destination = "/topic/messages/" + request.getConversationId();
        log.info("Broadcasting message to topic: {}", destination);
        messagingTemplate.convertAndSend(
                destination,
                savedMessage
        );
    }

    @MessageMapping("/chat.typing")
    public void handleTyping(@Payload TypingRequest request, Principal principal) {
        if (principal == null) {
            log.error("[WS-Typing] Principal is null");
            return;
        }
        
        String senderEmail = principal.getName();
        log.info("[WS-Typing] Received signal: From={}, Conv={}, isTyping={}", 
                senderEmail, request.getConversationId(), request.isTyping());
        
        // Đổi sang dấu / để topic ổn định hơn
        String destination = "/topic/typing/" + request.getConversationId();
        log.info("[WS-Typing] Broadcasting to: {}", destination);
        
        messagingTemplate.convertAndSend(
                destination,
                new TypingResponse(senderEmail, request.getConversationId(), request.isTyping())
        );
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ChatMessageRequest {
        private UUID conversationId;
        private String content;
        private MessageType type;
        private String attachmentUrl;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TypingRequest {
        private UUID conversationId;
        
        @com.fasterxml.jackson.annotation.JsonProperty("isTyping")
        private boolean isTyping;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class TypingResponse {
        private String email;
        private UUID conversationId;
        
        @com.fasterxml.jackson.annotation.JsonProperty("isTyping")
        private boolean isTyping;
    }
}
