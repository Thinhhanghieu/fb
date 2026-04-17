package com.fbclone.features.chat;

import com.fbclone.features.user.User;

import java.util.List;
import java.util.UUID;

public interface ChatService {
    List<ConversationResponse> getConversations(String userEmail);
    List<ChatMessageResponse> getMessages(UUID conversationId);
    ChatMessageResponse saveMessage(UUID conversationId, String content, String senderEmail, MessageType type, String attachmentUrl);
    Conversation getOrCreateConversation(User user1, User user2);
}
