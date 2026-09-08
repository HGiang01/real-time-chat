package me.giangnguyen.backend.user;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import me.giangnguyen.backend.auth.refreshtoken.RefreshToken;
import org.hibernate.annotations.Generated;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.generator.EventType;
import org.hibernate.type.SqlTypes;

import java.time.OffsetDateTime;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "users")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class User {
    @Id @Generated(event = EventType.INSERT) private UUID id;

    @Column(nullable = false, length = 50) private String username;

    @Column(name = "hash_password") private String hashPassword;

    @Column(nullable = false, unique = true) private String email;

    @Column(length = Integer.MAX_VALUE) private String bio;

    @Column(name = "avatar_url") private String avatarUrl;

    @Enumerated(EnumType.STRING) @JdbcTypeCode(SqlTypes.NAMED_ENUM) @Column(nullable = false) @Builder.Default
    private UserStatus status = UserStatus.online;

    @Column(name = "is_active", nullable = false) @Builder.Default private Boolean isActive = true;

    @Column(name = "created_at", nullable = false, updatable = false) @Generated(event = EventType.INSERT)
    private OffsetDateTime createdAt;

    @Column(name = "updated_at", nullable = false) @Generated(event = EventType.INSERT)
    private OffsetDateTime updatedAt;

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private Set<RefreshToken> refreshTokens;
}
