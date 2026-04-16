package com.fbclone.features.chat;

import com.fbclone.core.exception.NotFoundException;
import com.fbclone.features.user.User;
import com.fbclone.features.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatServiceImpl implements ChatService {

    private final ConversationRepository conversationRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final UserRepository userRepository;

    @Override
    public List<ConversationResponse> getConversations(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new NotFoundException("User not found"));

        return conversationRepository.findByUser(user.getId()).stream()
                .map(c -> ConversationResponse.fromEntity(c, user.getId()))
                .collect(Collectors.toList());
    }

    @Override
    public List<ChatMessageResponse> getMessages(UUID conversationId) {
        return chatMessageRepository.findByConversationIdOrderByCreatedAtAsc(conversationId).stream()
                .map(ChatMessageResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ChatMessageResponse saveMessage(UUID conversationId, String content, String senderEmail) {
        User sender = userRepository.findByEmail(senderEmail)
                .orElseThrow(() -> new NotFoundException("Sender not found"));

        Conversation conversation = conversationRepository.findById(conversationId)
                .orElseThrow(() -> new NotFoundException("Conversation not found"));

        ChatMessage message = ChatMessage.builder()
                .conversation(conversation)
                .sender(sender)
                .content(content)
                .build();

        ChatMessage savedMessage = chatMessageRepository.save(message);

        // Cập nhật tin nhắn cuối cùng cho cuộc hội thoại
        conversation.setLastMessage(savedMessage);
        conversation.setUpdatedAt(LocalDateTime.now());
        conversationRepository.save(conversation);

        return ChatMessageResponse.fromEntity(savedMessage);
    }

    @Override
    @Transactional
    public Conversation getOrCreateConversation(User user1, User user2) {
        return conversationRepository.findBetweenTwoUsers(user1.getId(), user2.getId())
                .orElseGet(() -> {
                    Conversation conversation = Conversation.builder()
                            .participants(Set.of(user1, user2))
                            .build();
                    return conversationRepository.save(conversation);
                });
    }
}
