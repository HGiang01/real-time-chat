package me.giangnguyen.backend.auth.ws;

import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import me.giangnguyen.backend.auth.jwt.JwtService;
import me.giangnguyen.backend.user.User;
import me.giangnguyen.backend.user.UserService;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.MessageDeliveryException;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.InsufficientAuthenticationException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.Optional;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class StompAuthChannelInterceptor implements ChannelInterceptor {
    private final UserService userService;
    private final JwtService jwtService;

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        try {
            StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

            if (accessor == null || !StompCommand.CONNECT.equals(accessor.getCommand())) {
                return message;
            }

            String header = accessor.getFirstNativeHeader("Authorization");
            if (header == null || !header.startsWith("Bearer ")) {
                throw new InsufficientAuthenticationException("Missing bearer token");
            }

            String accessToken = header.substring(7);
            if (!jwtService.isValidAccessToken(accessToken)) {
                throw new IllegalArgumentException("Invalid token");
            }

            Claims claims = jwtService.extractAllClaims(accessToken);
            UUID userId = UUID.fromString(claims.getSubject());
            Optional<User> user = userService.findById(userId);

            if (user.isEmpty()) {
                throw new BadCredentialsException("Invalid credentials");
            }

            UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(userId,
                                                                                                    null,
                                                                                                    Collections.emptyList());
            accessor.setUser(authToken);

            return message;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
