package me.giangnguyen.backend.auth;

import me.giangnguyen.backend.auth.dto.*;
import me.giangnguyen.backend.auth.exception.InvalidRefreshTokenException;
import me.giangnguyen.backend.auth.jwt.JwtService;
import me.giangnguyen.backend.auth.refreshtoken.RefreshTokenService;
import me.giangnguyen.backend.user.User;
import me.giangnguyen.backend.user.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ValueOperations;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.Duration;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.assertj.core.api.AssertionsForClassTypes.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;


@ExtendWith(MockitoExtension.class)
public class AuthServiceTest {
    @Mock private UserService userService;
    @Mock private JwtService jwtService;
    @Mock private RefreshTokenService refreshTokenService;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private RedisTemplate<String, String> redisTemplate;
    @Mock private JavaMailSender javaMailSender;
    @Mock private ValueOperations<String, String> valueOperations;
    @InjectMocks private AuthService authService;

    private User activeUser;

    @BeforeEach
    void setUp() {
        activeUser = User.builder()
                         .id(UUID.randomUUID())
                         .username("user01")
                         .email("user@example.com")
                         .hashPassword("hashPassword")
                         .isActive(true)
                         .build();
    }

    @Test
    void signup_withNewEmail_returnsSuccessMessage() {
        SignupRequest request = new SignupRequest("username01", "newuser@example.com", "password");

        when(userService.findByEmailAndActivated(request.email())).thenReturn(Optional.empty());
        when(passwordEncoder.encode(request.password())).thenReturn("encodedPassword");
        when(redisTemplate.opsForValue()).thenReturn(valueOperations);

        String result = authService.signup(request);
        assertThat(result).isEqualTo("Temporary user registration successful. Please verify your email via OTP");

        // Verify methods of mock objects
        verify(userService).save(any(User.class));
        verify(javaMailSender).send(any(SimpleMailMessage.class));
        verify(valueOperations).set(eq("auth:otp:newuser@example.com"), anyString(), any(Duration.class));
    }

    @Test
    void login_withWrongPassword_throwBadCredentialsException() {
        LoginRequest request = new LoginRequest("user@example.com", "wrongPassword", false);

        when(userService.findByEmail(request.email())).thenReturn(Optional.of(activeUser));
        when(passwordEncoder.matches(request.password(), activeUser.getHashPassword())).thenReturn(false);

        assertThatThrownBy(() -> authService.login(request)).isInstanceOf(BadCredentialsException.class)
                                                            .hasMessage("Invalid credential");
    }

    @Test
    void login_withInactiveUser_throwBadCredentialsException() {
        User inactiveUser = User.builder()
                                .id(UUID.randomUUID())
                                .username("user02")
                                .email("user02@example.com")
                                .hashPassword("hashPassword")
                                .isActive(false)
                                .build();

        LoginRequest request = new LoginRequest("user@example.com", "password", false);

        when(userService.findByEmail(request.email())).thenReturn(Optional.of(inactiveUser));

        assertThatThrownBy(() -> authService.login(request)).isInstanceOf(BadCredentialsException.class)
                                                            .hasMessage("Invalid credential");
    }

    @Test
    void login_withNotRememberMe_returnAT() {
        LoginRequest request = new LoginRequest("user@example.com", "password", false);

        when(userService.findByEmail(request.email())).thenReturn(Optional.of(activeUser));
        when(passwordEncoder.matches(request.password(), activeUser.getHashPassword())).thenReturn(true);
        when(jwtService.generateAccessToken(activeUser)).thenReturn("accessToken");

        TokenResponse result = authService.login(request);
        assertThat(result.accessToken()).isNotNull();
        assertThat(result.refreshToken()).isNull();

        verify(refreshTokenService, never()).save(any(), any(), any());
    }

    @Test
    void login_withRememberMe_returnATAndRT() {
        LoginRequest request = new LoginRequest("user@example.com", "password", true);

        when(userService.findByEmail(request.email())).thenReturn(Optional.of(activeUser));
        when(passwordEncoder.matches(request.password(), activeUser.getHashPassword())).thenReturn(true);
        when(jwtService.generateAccessToken(activeUser)).thenReturn("accessToken");
        when(jwtService.generateRefreshToken(activeUser)).thenReturn("refreshToken");

        TokenResponse result = authService.login(request);
        assertThat(result.accessToken()).isNotNull();
        assertThat(result.refreshToken()).isNotNull();

        verify(refreshTokenService).save(eq(activeUser), eq("refreshToken"), any());
    }

    @Test
    void refresh_withValidRefreshToken_returnNewAccessToken() {
        String refreshToken = "validRefreshToken";
        UUID userId = activeUser.getId();

        when(jwtService.isValidToken(refreshToken)).thenReturn(true);
        when(jwtService.extractUserId(refreshToken)).thenReturn(userId.toString());
        when(userService.findById(userId.toString())).thenReturn(Optional.of(activeUser));
        when(jwtService.generateAccessToken(activeUser)).thenReturn("newAccessToken");

        TokenResponse result = authService.refresh(refreshToken);
        assertThat(result.accessToken()).isEqualTo("newAccessToken");
        assertThat(result.refreshToken()).isNull();
    }

    @Test
    void verify_withValidOtp_returnSuccessMessage() {
        VerifyRequest request = new VerifyRequest("123456", "user@example.com");

        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
        when(valueOperations.get("auth:otp:user@example.com")).thenReturn("123456");

        String result = authService.verify(request);
        assertThat(result).isEqualTo("Verification successfully");

        verify(userService).setActive(request.email());
        verify(redisTemplate).delete("auth:otp:" + request.email());
    }

    @Test
    void verify_withInvalidOtp_throwBadCredentialsException() {
        VerifyRequest request = new VerifyRequest("000000", "user@example.com");

        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
        when(valueOperations.get("auth:otp:user@example.com")).thenReturn("111111");

        assertThatThrownBy(() -> authService.verify(request)).isInstanceOf(BadCredentialsException.class)
                                                             .hasMessage("Incorrect otp for email verification");
    }

    @Test
    void changePassword_withValidCurrentPassword_returnsSuccessMessage() {
        UUID userId = activeUser.getId();
        ChangePasswordRequest request = new ChangePasswordRequest("currentPassword", "newPassword");

        when(userService.findById(userId)).thenReturn(Optional.of(activeUser));
        when(passwordEncoder.matches(request.currentPassword(), activeUser.getHashPassword())).thenReturn(true);
        when(passwordEncoder.encode(request.newPassword())).thenReturn("encodedNewPassword");

        String result = authService.changePassword(request, userId);

        assertThat(result).isEqualTo("Change password successfully");
        assertThat(activeUser.getHashPassword()).isEqualTo("encodedNewPassword");
        verify(refreshTokenService).revokeAll(activeUser);
    }

    @Test
    void logout_withInvalidRefreshToken_throwInvalidRefreshTokenException() {
        String refreshToken = "refreshToken";
        UUID userId = activeUser.getId();

        when(jwtService.extractUserId(refreshToken)).thenReturn(userId.toString());
        when(userService.findById(userId)).thenReturn(Optional.of(activeUser));
        when(refreshTokenService.findByUserAndRefreshToken(activeUser, refreshToken)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> authService.logout(refreshToken)).isInstanceOf(InvalidRefreshTokenException.class)
                                                                  .hasMessage("Invalid refresh token");
    }
}
