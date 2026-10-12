package me.giangnguyen.backend.block;

import me.giangnguyen.backend.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface BlockRepository extends JpaRepository<Block, UUID> {

    List<Block> findByBlocker(User blocker);

    @Query(value = """
            select exists(
                select 1
                from blocks
                where blocker_id = :blockerId and blocked_id = :blockedId
            )
            """, nativeQuery = true)
    boolean isBlockedBy(@Param("blockerId") UUID blockerId, @Param("blockedId") UUID blockedId);

    @Modifying
    @Query(value = """
            insert into blocks (blocker_id, blocked_id) values (:blockerId, :blockedId)
            """, nativeQuery = true)
    void block(@Param("blockerId") UUID blockerId, @Param("blockedId") UUID blockedId);

    @Modifying
    @Query(value = """
            delete from blocks where (blocker_id = :blockerId and blocked_id = :blockedId)
            """, nativeQuery = true)
    void unblock(@Param("blockerId") UUID blockerId, @Param("blockedId") UUID blockedId);
}
