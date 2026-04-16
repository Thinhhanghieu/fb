package com.fbclone.features.chat;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/messages")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    private final com.fbclone.features.user.UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<ConversationResponse>> getConversations(Authentication authentication) {
        return ResponseEntity.ok(chatService.getConversations(authentication.getName()));
    }

    @GetMapping("/{conversationId}")
    public ResponseEntity<List<ChatMessageResponse>> getMessages(@PathVariable UUID conversationId) {
        return ResponseEntity.ok(chatService.getMessages(conversationId));
    }

    @PostMapping("/conversation/user/{userId}")
    public ResponseEntity<ConversationResponse> getOrCreateConversation(
            @PathVariable UUID userId, 
            Authentication authentication) {
        com.fbclone.features.user.User currentUser = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new com.fbclone.core.exception.NotFoundException("Current user not found"));
        
        com.fbclone.features.user.User otherUser = userRepository.findById(userId)
                .orElseThrow(() -> new com.fbclone.core.exception.NotFoundException("Recipient user not found"));
        
        Conversation conversation = chatService.getOrCreateConversation(currentUser, otherUser);
        return ResponseEntity.ok(ConversationResponse.fromEntity(conversation, currentUser.getId()));
    }
}
