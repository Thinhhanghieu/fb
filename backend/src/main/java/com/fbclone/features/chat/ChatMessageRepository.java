package com.fbclone.features.chat;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, UUID> {
    
    // Lấy tin nhắn theo hội thoại (sắp xếp theo thời gian tăng dần)
    List<ChatMessage> findByConversationIdOrderByCreatedAtAsc(UUID conversationId);
}
