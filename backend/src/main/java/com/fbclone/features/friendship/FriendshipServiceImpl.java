package com.fbclone.features.friendship;

import com.fbclone.features.notification.NotificationService;
import com.fbclone.features.notification.NotificationType;
import com.fbclone.core.dto.PaginatedResponse;
import com.fbclone.core.exception.BadRequestException;
import com.fbclone.core.exception.NotFoundException;
import com.fbclone.features.user.User;
import com.fbclone.features.user.UserRepository;
import com.fbclone.features.user.UserResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FriendshipServiceImpl implements FriendshipService {

    private final FriendshipRepository friendshipRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    @Override
    @Transactional
    public void sendFriendRequest(String senderEmail, UUID receiverId) {
        User requester = userRepository.findByEmail(senderEmail)
                .orElseThrow(() -> new NotFoundException("User not found"));
        User addressee = userRepository.findById(receiverId)
                .orElseThrow(() -> new NotFoundException("Receiver not found"));

        if (requester.getId().equals(receiverId)) {
            throw new BadRequestException("You cannot send a friend request to yourself");
        }

        friendshipRepository.findBetween(requester, addressee).ifPresent(f -> {
            throw new BadRequestException("A friendship or request already exists between these users");
        });

        Friendship friendship = Friendship.builder()
                .requester(requester)
                .addressee(addressee)
                .status(Friendship.FriendshipStatus.PENDING)
                .build();

        Friendship savedFriendship = friendshipRepository.save(friendship);

        // Trigger notification
        notificationService.createNotification(addressee, requester, NotificationType.FRIEND_REQUEST, savedFriendship.getId());
    }

    @Override
    @Transactional
    public void acceptFriendRequest(String userEmail, UUID requestId) {
        Friendship friendship = friendshipRepository.findById(requestId)
                .orElseThrow(() -> new NotFoundException("Friend request not found"));

        if (!friendship.getAddressee().getEmail().equals(userEmail)) {
            throw new BadRequestException("You can only accept requests sent to you");
        }

        if (friendship.getStatus() != Friendship.FriendshipStatus.PENDING) {
            throw new BadRequestException("Request is not in PENDING status");
        }

        friendship.setStatus(Friendship.FriendshipStatus.ACCEPTED);
        friendship.setUpdatedAt(LocalDateTime.now());

        // Increment friend counts
        User u1 = friendship.getRequester();
        User u2 = friendship.getAddressee();
        u1.setFriendsCount(u1.getFriendsCount() + 1);
        u2.setFriendsCount(u2.getFriendsCount() + 1);

        userRepository.save(u1);
        userRepository.save(u2);
        friendshipRepository.save(friendship);

        // Trigger notification (Notify the requester that the request was accepted)
        notificationService.createNotification(u1, u2, NotificationType.FRIEND_ACCEPT, friendship.getId());
    }

    @Override
    @Transactional
    public void declineFriendRequest(String userEmail, UUID requestId) {
        Friendship friendship = friendshipRepository.findById(requestId)
                .orElseThrow(() -> new NotFoundException("Friend request not found"));

        if (!friendship.getAddressee().getEmail().equals(userEmail) && !friendship.getRequester().getEmail().equals(userEmail)) {
            throw new BadRequestException("Unauthorized action");
        }

        friendshipRepository.delete(friendship);
    }

    @Override
    @Transactional
    public void removeFriend(String userEmail, UUID friendId) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new NotFoundException("User not found"));
        User friend = userRepository.findById(friendId)
                .orElseThrow(() -> new NotFoundException("Friend not found"));

        Friendship friendship = friendshipRepository.findBetween(user, friend)
                .orElseThrow(() -> new NotFoundException("Friendship not found"));

        if (friendship.getStatus() != Friendship.FriendshipStatus.ACCEPTED) {
            throw new BadRequestException("Not friends");
        }

        user.setFriendsCount(Math.max(0, user.getFriendsCount() - 1));
        friend.setFriendsCount(Math.max(0, friend.getFriendsCount() - 1));

        userRepository.save(user);
        userRepository.save(friend);
        friendshipRepository.delete(friendship);
    }

    @Override
    public PaginatedResponse<UserResponse> getFriends(String userEmail, int page, int limit) {
        Page<Friendship> friendshipPage = friendshipRepository.findFriendsByEmail(userEmail, PageRequest.of(page - 1, limit));

        return PaginatedResponse.<UserResponse>builder()
                .data(friendshipPage.getContent().stream()
                        .map(f -> {
                            User friend = f.getRequester().getEmail().equals(userEmail) ? f.getAddressee() : f.getRequester();
                            return UserResponse.fromEntity(friend);
                        })
                        .collect(Collectors.toList()))
                .total(friendshipPage.getTotalElements())
                .page(page)
                .limit(limit)
                .hasMore(friendshipPage.hasNext())
                .build();
    }

    @Override
    public PaginatedResponse<UserResponse> getPendingRequests(String userEmail, int page, int limit) {
        Page<Friendship> requestPage = friendshipRepository.findPendingRequestsByEmail(userEmail, PageRequest.of(page - 1, limit));

        return PaginatedResponse.<UserResponse>builder()
                .data(requestPage.getContent().stream()
                        .map(f -> UserResponse.fromEntity(f.getRequester()))
                        .collect(Collectors.toList()))
                .total(requestPage.getTotalElements())
                .page(page)
                .limit(limit)
                .hasMore(requestPage.hasNext())
                .build();
    }
}
