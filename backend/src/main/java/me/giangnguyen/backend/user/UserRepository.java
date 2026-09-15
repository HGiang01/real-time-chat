package me.giangnguyen.backend.user;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findUserByEmail(String email);

    Optional<User> findUserByEmailAndIsActive(String email, Boolean isActive);

    @Query(value = "select avatar_url from users where email = :email", nativeQuery = true)
    Optional<String> findAvatarUrlByEmail(@Param("email") String email);

    @Modifying
    @Query(value = "update users set is_active = :isActive where email = :email", nativeQuery = true)
    void updateIsActiveByEmail(@Param("email") String email, @Param("isActive") boolean isActive);

    @Modifying
    @Query(value = """
            delete from users where email = :email and is_active = false;
            """, nativeQuery = true)
    void deleteByEmailAndNotActive(@Param("email") String email);
}
