package com.fbclone.features.friendship;

import com.fbclone.features.user.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface FriendshipRepository extends JpaRepository<Friendship, UUID> {

    @Query("SELECT f FROM Friendship f WHERE (f.requester = :u1 AND f.addressee = :u2) OR (f.requester = :u2 AND f.addressee = :u1)")
    Optional<Friendship> findBetween(@Param("u1") User u1, @Param("u2") User u2);

    @Query("SELECT f FROM Friendship f WHERE f.addressee.email = :email AND f.status = 'PENDING' ORDER BY f.createdAt DESC")
    Page<Friendship> findPendingRequestsByEmail(@Param("email") String email, Pageable pageable);

    @Query("SELECT f FROM Friendship f WHERE (f.requester.email = :email OR f.addressee.email = :email) AND f.status = 'ACCEPTED'")
    Page<Friendship> findFriendsByEmail(@Param("email") String email, Pageable pageable);

    boolean existsByRequesterAndAddressee(User requester, User addressee);
}
