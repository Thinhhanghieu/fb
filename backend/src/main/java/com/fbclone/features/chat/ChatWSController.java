package com.fbclone.features.chat;

import com.fbclone.features.user.User;
import com.fbclone.features.user.UserRepository;
import lombok.Data;
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
        log.info("Received WebSocket message from {}: {}", senderEmail, request.getContent());
        
        // 1. Lưu tin nhắn vào DB
        ChatMessageResponse savedMessage = chatService.saveMessage(
                request.getConversationId(), 
                request.getContent(), 
                senderEmail
        );

        // 2. Gửi tin nhắn tới Topic chung của cuộc hội thoại
        // Topic: /topic/messages.{conversationId}
        log.info("Broadcasting message to topic: /topic/messages.{}", request.getConversationId());
        messagingTemplate.convertAndSend(
                "/topic/messages." + request.getConversationId(),
                savedMessage
        );
    }

    @MessageMapping("/chat.typing")
    public void handleTyping(@Payload TypingRequest request, Principal principal) {
        if (principal == null) return;
        
        // Gửi tín hiệu typing tới topic cuộc hội thoại
        // Payload chỉ chứa userId và trạng thái isTyping để cực kỳ nhẹ
        messagingTemplate.convertAndSend(
                "/topic/typing." + request.getConversationId(),
                new TypingResponse(principal.getName(), request.isTyping())
        );
    }

    @Data
    public static class ChatMessageRequest {
        private UUID conversationId;
        private String content;
    }

    @Data
    public static class TypingRequest {
        private UUID conversationId;
        private boolean isTyping;
    }

    @Data
    @AllArgsConstructor
    public static class TypingResponse {
        private String email;
        private boolean isTyping;
    }
}
