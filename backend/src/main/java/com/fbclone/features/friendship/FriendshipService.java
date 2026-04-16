package com.fbclone.features.friendship;

import com.fbclone.core.dto.PaginatedResponse;
import com.fbclone.features.user.UserResponse;

import java.util.UUID;

public interface FriendshipService {
    void sendFriendRequest(String senderEmail, UUID receiverId);
    void acceptFriendRequest(String userEmail, UUID requestId);
    void declineFriendRequest(String userEmail, UUID requestId);
    void removeFriend(String userEmail, UUID friendId);
    PaginatedResponse<UserResponse> getFriends(String userEmail, int page, int limit);
    PaginatedResponse<UserResponse> getPendingRequests(String userEmail, int page, int limit);
}
