package com.fbclone.features.friendship;

import com.fbclone.core.dto.PaginatedResponse;
import com.fbclone.features.user.UserResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/friends")
@RequiredArgsConstructor
public class FriendshipController {

    private final FriendshipService friendshipService;

    @PostMapping("/request/{userId}")
    public ResponseEntity<Void> sendRequest(@PathVariable UUID userId, Authentication authentication) {
        friendshipService.sendFriendRequest(authentication.getName(), userId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/accept/{requestId}")
    public ResponseEntity<Void> acceptRequest(@PathVariable UUID requestId, Authentication authentication) {
        friendshipService.acceptFriendRequest(authentication.getName(), requestId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/decline/{requestId}")
    public ResponseEntity<Void> declineRequest(@PathVariable UUID requestId, Authentication authentication) {
        friendshipService.declineFriendRequest(authentication.getName(), requestId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/remove/{friendId}")
    public ResponseEntity<Void> removeFriend(@PathVariable UUID friendId, Authentication authentication) {
        friendshipService.removeFriend(authentication.getName(), friendId);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<PaginatedResponse<UserResponse>> getFriends(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit,
            Authentication authentication) {
        return ResponseEntity.ok(friendshipService.getFriends(authentication.getName(), page, limit));
    }

    @GetMapping("/requests")
    public ResponseEntity<PaginatedResponse<UserResponse>> getPendingRequests(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit,
            Authentication authentication) {
        return ResponseEntity.ok(friendshipService.getPendingRequests(authentication.getName(), page, limit));
    }
}
