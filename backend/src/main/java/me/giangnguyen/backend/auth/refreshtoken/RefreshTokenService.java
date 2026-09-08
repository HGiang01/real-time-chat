package me.giangnguyen.backend.auth.refreshtoken;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import me.giangnguyen.backend.auth.exception.InvalidRefreshTokenException;
import me.giangnguyen.backend.user.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {
    private final RefreshTokenRepository repository;

    @Value("${app.security.jwt.max-refresh-token-per-user}")
    private int maxRefreshTokenPerUser;

    public Optional<RefreshToken> findByRefreshToken(String refreshToken) {
        return repository.findByRefreshToken(refreshToken);
    }

    public Optional<RefreshToken> findByUserAndRefreshToken(User user, String refreshToken) {
        return repository.findByUserAndRefreshToken(user, refreshToken);
    }

    @Transactional
    public void save(User user, String refreshToken, OffsetDateTime expirationDate) {
        deleteOldestRefreshToken(user);
        repository.save(RefreshToken.builder().refreshToken(refreshToken).expiresAt(expirationDate).user(user).build());
    }

    @Transactional
    public void revokeAll(User user) {
        repository.revokeAll(user.getId());
    }

    private void deleteOldestRefreshToken(User user) {
        int numberOfRefreshTokens = repository.countByUserId(user.getId());
        if (numberOfRefreshTokens >= maxRefreshTokenPerUser) {
            repository.deleteOldestRefreshToken(user.getId());
        }
    }


}
