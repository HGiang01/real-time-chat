package me.giangnguyen.backend.auth;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import me.giangnguyen.backend.auth.dto.*;
import me.giangnguyen.backend.auth.exception.EmailAlreadyExistsException;
import me.giangnguyen.backend.auth.exception.InvalidRefreshTokenException;
import me.giangnguyen.backend.auth.jwt.JwtService;
import me.giangnguyen.backend.auth.oauth2.OauthAccountService;
import me.giangnguyen.backend.auth.refreshtoken.RefreshToken;
import me.giangnguyen.backend.auth.refreshtoken.RefreshTokenService;
import me.giangnguyen.backend.user.User;
import me.giangnguyen.backend.user.UserService;
import me.giangnguyen.backend.user.exception.UserNotFoundException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Duration;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final JwtService jwtService;
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;
    private final RefreshTokenService refreshTokenService;
    private final OauthAccountService oauthAccountService;
    private final RedisTemplate<String, String> redisTemplate;
    private final JavaMailSender javaMailSender;

    private final SecureRandom RANDOM = new SecureRandom();

    @Value("${app.security.otp.otp-expiration-ms}") private int otpExpirationMs;

    @Transactional
    public String signup(SignupRequest request) {
        if (userService.findByEmailAndActivated(request.email()).isPresent()) {
            throw new EmailAlreadyExistsException("Email is already registered");
        }

        userService.deleteByEmailAndInactive(request.email());

        // Save user
        User user = User.builder()
                        .username(request.username())
                        .hashPassword(passwordEncoder.encode(request.password()))
                        .email(request.email())
                        .isActive(false) // for email validation
                        .build();
        userService.save(user);

        // Generate otp code
        String otp = generateOtp(6);
        redisTemplate.opsForValue().set("auth:otp:" + request.email(), otp, Duration.ofMillis(otpExpirationMs));

        // Send otp code
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(request.email());
        message.setSubject("[Real-time chat application] Your otp verification code");
        message.setText("Your OTP code is: " + otp);
        javaMailSender.send(message);

        return "Temporary user registration successful. Please verify your email via OTP";
    }

    public TokenResponse login(LoginRequest request) {
        Optional<User> user = userService.findByEmail(request.email());

        if (user.isEmpty()) {
            throw new BadCredentialsException("Invalid credential");
        }

        if (!user.get().getIsActive()) {
            throw new BadCredentialsException("Invalid credential");
        }

        if (user.get().getHashPassword() == null || !passwordEncoder.matches(request.password(),
                                                                             user.get().getHashPassword())) {
            throw new BadCredentialsException("Invalid credential");
        }

        String accessToken = jwtService.generateAccessToken(user.get());

        if (request.rememberMe()) {
            String refreshToken = jwtService.generateRefreshToken(user.get());
            refreshTokenService.save(user.get(), refreshToken, jwtService.extractExpirationDate(refreshToken));

            return new TokenResponse(accessToken, refreshToken);
        }

        return new TokenResponse(accessToken, null);
    }

    @Transactional
    public TokenResponse oauth2Login(OAuth2LoginRequest request) {

        User user = userService.findByEmailAndActivated(request.email()).map(existingUser -> {
            boolean existsOAuthAccount = oauthAccountService.existsByProviderAndProviderUserId(request.provider(),
                                                                                               request.providerUserId());
            if (!existsOAuthAccount) {
                oauthAccountService.save(request.provider(), request.providerUserId(), existingUser);
            }
            return existingUser;
        }).orElseGet(() -> {
            userService.deleteByEmailAndInactive(request.email());
            User newUser = userService.save(User.builder().email(request.email()).username(request.username()).build());
            oauthAccountService.save(request.provider(), request.providerUserId(), newUser);
            return newUser;
        });

        String refreshToken = jwtService.generateRefreshToken(user);
        refreshTokenService.save(user, refreshToken, jwtService.extractExpirationDate(refreshToken));

        return new TokenResponse(null, refreshToken);
    }

    public String verify(VerifyRequest request) {
        String correctOtp = redisTemplate.opsForValue().get("auth:otp:" + request.email());

        if (correctOtp == null || !correctOtp.equals(request.otp())) {
            throw new BadCredentialsException("Incorrect otp for email verification");
        }

        userService.setActive(request.email());
        redisTemplate.delete("auth:otp:" + request.email());

        return "Verification successfully";
    }

    @Transactional
    public String logout(String refreshTokenRequest) {
        UUID userId = UUID.fromString(jwtService.extractUserId(refreshTokenRequest));
        Optional<User> user = userService.findById(userId);

        if (user.isEmpty()) {
            throw new UserNotFoundException("User not found");
        }

        Optional<RefreshToken> refreshToken = refreshTokenService.findByUserAndRefreshToken(user.get(),
                                                                                            refreshTokenRequest);
        if (refreshToken.isEmpty()) {
            throw new InvalidRefreshTokenException("Invalid refresh token");
        }

        refreshToken.get().setRevoke(true);

        return "Logout successfully";
    }

    public TokenResponse refresh(String refreshToken) {
        if (!jwtService.isValidRefreshToken(refreshToken)) {
            throw new InvalidRefreshTokenException("Invalid refresh token");
        }

        Optional<User> user = userService.findById(jwtService.extractUserId(refreshToken));

        if (user.isEmpty()) {
            throw new InvalidRefreshTokenException("User not found");
        }

        String accessToken = jwtService.generateAccessToken(user.get());

        return new TokenResponse(accessToken, null);
    }

    @Transactional
    public String changePassword(ChangePasswordRequest request, UUID userId) {
        Optional<User> user = userService.findById(userId);

        if (user.isEmpty()) {
            throw new UserNotFoundException("User not found");
        }

        if (request.currentPassword() == null || !passwordEncoder.matches(request.currentPassword(),
                                                                          user.get().getHashPassword())) {
            throw new BadCredentialsException("Invalid credential");
        }

        String newHashPassword = passwordEncoder.encode(request.newPassword());
        user.get().setHashPassword(newHashPassword);
        refreshTokenService.revokeAll(user.get());

        return "Change password successfully";
    }

    private String generateOtp(int length) {
        StringBuilder otp = new StringBuilder(length);

        for (int i = 0; i < length; i++) {
            otp.append(RANDOM.nextInt(10));
        }

        return otp.toString();
    }
}
