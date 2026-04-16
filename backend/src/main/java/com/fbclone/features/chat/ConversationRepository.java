package com.fbclone.features.chat;

import com.fbclone.features.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ConversationRepository extends JpaRepository<Conversation, UUID> {
    
    // Tìm danh sách hội thoại của 1 user (được sắp xếp theo thời gian cập nhật mới nhất)
    @Query("SELECT c FROM Conversation c JOIN c.participants p WHERE p.id = :userId ORDER BY c.updatedAt DESC")
    List<Conversation> findByUser(@Param("userId") UUID userId);

    // Tìm hội thoại giữa đúng 2 user (dành cho chat 1-1)
    @Query("SELECT c FROM Conversation c " +
           "WHERE SIZE(c.participants) = 2 " +
           "AND EXISTS (SELECT p FROM c.participants p WHERE p.id = :user1Id) " +
           "AND EXISTS (SELECT p FROM c.participants p WHERE p.id = :user2Id)")
    Optional<Conversation> findBetweenTwoUsers(@Param("user1Id") UUID user1Id, @Param("user2Id") UUID user2Id);
}
