package me.giangnguyen.backend.auth.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import me.giangnguyen.backend.auth.refreshtoken.RefreshTokenService;
import me.giangnguyen.backend.user.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.Date;

@Service
@RequiredArgsConstructor
public class JwtService {
    private final RefreshTokenService refreshTokenService;

    @Value("${app.security.jwt.secret}") private String secretKey;

    @Value("${app.security.jwt.access-token-expiration-ms}") private int accessTokenExpiration;

    @Value("${app.security.jwt.refresh-token-expiration-ms}") private int refreshTokenExpiration;

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(secretKey));
    }

    public String generateAccessToken(User user) {
        return Jwts.builder()
                   .subject(user.getId().toString())
                   .claim("email", user.getEmail())
                   .claim("type", "access")
                   .issuedAt(new Date())
                   .expiration(new Date(System.currentTimeMillis() + accessTokenExpiration))
                   .signWith(getSigningKey())
                   .compact();
    }

    public String generateRefreshToken(User user) {
        return Jwts.builder()
                   .subject(user.getId().toString())
                   .claim("email", user.getEmail())
                   .claim("type", "refresh")
                   .issuedAt(new Date())
                   .expiration(new Date(System.currentTimeMillis() + refreshTokenExpiration))
                   .signWith(getSigningKey())
                   .compact();
    }

    public Claims extractAllClaims(String token) {
        return Jwts.parser().verifyWith(getSigningKey()).build().parseSignedClaims(token).getPayload();
    }

    public String extractUserId(String refreshToken) {
        return extractAllClaims(refreshToken).getSubject();
    }

    public OffsetDateTime extractExpirationDate(String token) {
        return extractAllClaims(token).getExpiration().toInstant().atOffset(ZoneOffset.UTC);
    }

    public boolean isValidAccessToken(String token) throws JwtException {
        Claims claims = extractAllClaims(token);

        return "access".equals(claims.get("type"));
    }

    public boolean isValidRefreshToken(String token) throws JwtException {
        Claims claims = extractAllClaims(token);

        if (!"refresh".equals(claims.get("type"))) {
            return false;
        }

        return refreshTokenService.findByRefreshToken(token)
                                  .filter(rt -> rt.getExpiresAt().isAfter(OffsetDateTime.now()) && !rt.isRevoke())
                                  .isPresent();
    }
}
