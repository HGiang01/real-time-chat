package me.giangnguyen.backend.auth;

import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import me.giangnguyen.backend.auth.dto.*;
import me.giangnguyen.backend.common.util.CookieUtils;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@AllArgsConstructor
public class AuthController {
    private final AuthService service;
    private final CookieUtils cookieUtils;

    @PostMapping("/signup")
    public ResponseEntity<String> signup(@Valid @RequestBody SignupRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.signup(request));
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        TokenResponse tokenResponse = service.login(request);

        ResponseEntity.BodyBuilder builder = ResponseEntity.ok();

        if (request.rememberMe()) {
            String cookie = cookieUtils.createRefreshTokenCookie(tokenResponse.refreshToken());
            builder.header(HttpHeaders.SET_COOKIE, cookie);
        }

        return builder.body(new LoginResponse(tokenResponse.accessToken()));
    }

    @PostMapping("/verify")
    public ResponseEntity<String> verify(@Valid @RequestBody VerifyRequest request) {
        return ResponseEntity.ok(service.verify(request));
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(@CookieValue(name = "refresh_token") String refreshToken) {
        return ResponseEntity.ok(service.logout(refreshToken));
    }

    @PostMapping("/refresh")
    public ResponseEntity<RefreshResponse> refresh(@CookieValue(name = "refresh_token") String refreshToken) {
        TokenResponse tokenResponse = service.refresh(refreshToken);
        return ResponseEntity.ok(new RefreshResponse(tokenResponse.accessToken()));
    }

    @PostMapping("/change-password")
    public ResponseEntity<String> changePassword(
            @Valid @RequestBody ChangePasswordRequest request,
            @AuthenticationPrincipal UUID userId
    ) {
        return ResponseEntity.ok(service.changePassword(request, userId));
    }
}
