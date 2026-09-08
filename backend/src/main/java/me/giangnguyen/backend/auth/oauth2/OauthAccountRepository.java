package me.giangnguyen.backend.auth.oauth2;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface OauthAccountRepository extends JpaRepository<OauthAccount, UUID> {
    boolean existsByProviderAndProviderUserId(String provider, String providerUserId);
}
