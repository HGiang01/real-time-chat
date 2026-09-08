package me.giangnguyen.backend.common.util;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

@Component
public class CookieUtils {
    @Value("${app.security.jwt.refresh-token-expiration-ms}") private int refreshTokenExpirationMs;

    @Value("${app.security.cookie.secure}") private boolean isSecure;

    @Value("${app.security.cookie.same-site}") private String sameSite;

    public String createRefreshTokenCookie(String refreshToken) {
        return ResponseCookie.from("refresh_token", refreshToken)
                             .httpOnly(true)
                             .secure(isSecure)
                             .sameSite(sameSite)
                             .path("/api/auth/refresh")
                             .maxAge(refreshTokenExpirationMs / 1000)
                             .build()
                             .toString();
    }

    public String clearRefreshTokenCookie() {
        return ResponseCookie.from("refresh_token", "")
                             .httpOnly(true)
                             .secure(isSecure)
                             .sameSite(sameSite)
                             .path("/api/auth/refresh")
                             .maxAge(0)
                             .build()
                             .toString();
    }
}
