package me.giangnguyen.backend.request;

import me.giangnguyen.backend.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface ContactRequestRepository extends JpaRepository<ContactRequest, UUID> {

    List<ContactRequest> getByReceiver(User receiver);

    List<ContactRequest> getBySender(User sender);

    @Query(value = """
            select exists(
                select 1
                from contact_requests cr
                WHERE (cr.sender_id = :senderId AND cr.receiver_id = :receiverId)
                OR (cr.sender_id = :receiverId AND cr.receiver_id = :senderId)
            )
            """, nativeQuery = true)
    boolean isRequestExists(@Param("senderId") UUID senderId,@Param("receiverId") UUID receiverId);
}
