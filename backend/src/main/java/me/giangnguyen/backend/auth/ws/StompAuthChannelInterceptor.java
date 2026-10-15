package me.giangnguyen.backend.auth.ws;

import io.jsonwebtoken.Claims;
import lombok.RequiredArgsConstructor;
import me.giangnguyen.backend.auth.exception.InvalidTokenException;
import me.giangnguyen.backend.auth.exception.MissingTokenException;
import me.giangnguyen.backend.auth.jwt.JwtService;
import me.giangnguyen.backend.user.User;
import me.giangnguyen.backend.user.UserService;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.MessageDeliveryException;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.Date;
import java.util.Optional;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class StompAuthChannelInterceptor implements ChannelInterceptor {
    private static final String EXP_ATTR = "exp";
    private final UserService userService;
    private final JwtService jwtService;

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);
        if (accessor == null || accessor.getCommand() == null) return message;

        switch (accessor.getCommand()) {
            case CONNECT -> {
                String header = accessor.getFirstNativeHeader("Authorization");
                if (header == null || !header.startsWith("Bearer ")) {
                    throw new MissingTokenException("Missing bearer token");
                }

                String accessToken = header.substring(7);
                if (!jwtService.isValidAccessToken(accessToken)) {
                    throw new InvalidTokenException("Invalid or expired token");
                }

                Claims claims = jwtService.extractAllClaims(accessToken);
                UUID userId = UUID.fromString(claims.getSubject());
                Optional<User> user = userService.findById(userId);

                if (user.isEmpty()) {
                    throw new InvalidTokenException("Invalid or expired token");
                }

                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(userId,
                                                                                                        null,
                                                                                                        Collections.emptyList());
                accessor.setUser(authToken);
                accessor.getSessionAttributes().put(EXP_ATTR, claims.getExpiration());
            }
            case SUBSCRIBE, SEND -> {
                Date exp = (Date) accessor.getSessionAttributes().get(EXP_ATTR);
                if (exp == null || new Date().after(exp)) {
                    throw new MessageDeliveryException("Token expired");
                }
            }
        }

        return message;
    }
}
