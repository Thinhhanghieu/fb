package com.fbclone.features.user;

import com.fbclone.core.dto.PaginatedResponse;
import com.fbclone.features.friendship.Friendship;
import com.fbclone.features.friendship.FriendshipRepository;
import com.fbclone.core.exception.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final FriendshipRepository friendshipRepository;

    public PaginatedResponse<UserResponse> searchUsers(String query, int page, int limit, String currentUserEmail) {
        Page<User> userPage = userRepository.searchUsers(query, PageRequest.of(page - 1, limit));
        
        User currentUser = currentUserEmail != null ? 
                userRepository.findByEmail(currentUserEmail).orElse(null) : null;

        return PaginatedResponse.<UserResponse>builder()
                .data(userPage.getContent().stream()
                        .map(user -> {
                            if (currentUser == null || user.getId().equals(currentUser.getId())) {
                                return UserResponse.fromEntity(user);
                            }
                            
                            Optional<Friendship> friendship = friendshipRepository.findBetween(currentUser, user);
                            if (friendship.isPresent()) {
                                Friendship f = friendship.get();
                                String status = f.getStatus().toString();
                                String requestId = (f.getStatus() == Friendship.FriendshipStatus.PENDING && f.getAddressee().getId().equals(currentUser.getId())) 
                                                    ? f.getId().toString() : null;
                                return UserResponse.fromEntity(user, status, requestId);
                            }
                            return UserResponse.fromEntity(user, "NONE", null);
                        })
                        .collect(Collectors.toList()))
                .total(userPage.getTotalElements())
                .page(page)
                .limit(limit)
                .hasMore(userPage.hasNext())
                .build();
    }

    public UserResponse getProfile(UUID userId, String currentUserEmail) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("User not found"));

        if (currentUserEmail == null) {
            return UserResponse.fromEntity(user);
        }

        User currentUser = userRepository.findByEmail(currentUserEmail)
                .orElseThrow(() -> new NotFoundException("Current user not found"));

        if (user.getId().equals(currentUser.getId())) {
            return UserResponse.fromEntity(user);
        }

        Optional<Friendship> friendship = friendshipRepository.findBetween(currentUser, user);

        if (friendship.isPresent()) {
            Friendship f = friendship.get();
            String status = f.getStatus().toString();
            String requestId = (f.getStatus() == Friendship.FriendshipStatus.PENDING && f.getAddressee().getId().equals(currentUser.getId())) 
                                ? f.getId().toString() : null;
            return UserResponse.fromEntity(user, status, requestId);
        }

        return UserResponse.fromEntity(user, "NONE", null);
    }
}
