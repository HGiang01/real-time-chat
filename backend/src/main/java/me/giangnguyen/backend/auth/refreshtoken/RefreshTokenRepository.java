package me.giangnguyen.backend.auth.refreshtoken;

import me.giangnguyen.backend.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.UUID;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, UUID> {
    Optional<RefreshToken> findByRefreshToken(String refreshToken);

    Optional<RefreshToken> findByUserAndRefreshToken(User user, String refreshToken);

    boolean existsByUserAndRefreshToken(User user, String refreshToken);

    @Query(value = """
                select count(*) from refresh_tokens where user_id = :userId
            """, nativeQuery = true)
    int countByUserId(@Param("userId") UUID userId);

    @Modifying
    @Query(value = """
            update refresh_tokens
            set is_revoke = true
            where user_id = :userId
            """, nativeQuery = true)
    void revokeAll(@Param("userId") UUID userId);

    @Modifying
    @Query(value = """
            delete from refresh_tokens
            where id = (
                select id 
                from refresh_tokens 
                where user_id = :userId 
                order by created_at limit 1
            )
            """, nativeQuery = true)
    void deleteOldestRefreshToken(@Param("userId") UUID userId);
}