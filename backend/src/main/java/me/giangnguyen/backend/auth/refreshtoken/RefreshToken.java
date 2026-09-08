package me.giangnguyen.backend.auth.refreshtoken;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import me.giangnguyen.backend.user.User;
import org.hibernate.annotations.Generated;
import org.hibernate.generator.EventType;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "refresh_tokens")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RefreshToken {
    @Id @Generated(event = EventType.INSERT) private UUID id;

    @Column(name = "refresh_token", nullable = false, length = 255) private String refreshToken;

    @Column(name = "is_revoke", nullable = false) @Builder.Default private boolean isRevoke = false;

    @Column(name = "expires_at", nullable = false) private OffsetDateTime expiresAt;

    @Column(name = "created_at", nullable = false, updatable = false) @Generated(event = EventType.INSERT)
    private OffsetDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "user_id") private User user;
}
