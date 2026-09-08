package me.giangnguyen.backend.auth.oauth2;

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
@Table(name = "oauth_accounts")
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class OauthAccount {
    @Id @Generated(event = EventType.INSERT) private UUID id;

    @Column(name = "provider", nullable = false, length = 50) private String provider;

    @Column(name = "provider_user_id", nullable = false) private String providerUserId;

    @Column(name = "created_at", nullable = false) @Generated(event = EventType.INSERT)
    private OffsetDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;
}