package me.giangnguyen.backend.auth.oauth2;

import lombok.RequiredArgsConstructor;
import me.giangnguyen.backend.user.User;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class OauthAccountService {
    private final OauthAccountRepository repository;

    public OauthAccount save(String provider, String providerUserId, User user) {
        return repository.save(OauthAccount.builder()
                                           .provider(provider)
                                           .providerUserId(providerUserId)
                                           .user(user)
                                           .build());
    }

    public boolean existsByProviderAndProviderUserId(String provider, String providerUserId) {
        return repository.existsByProviderAndProviderUserId(provider, providerUserId);
    }
}
