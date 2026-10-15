package me.giangnguyen.backend.auth.jwt;

import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import me.giangnguyen.backend.auth.exception.InvalidTokenException;
import me.giangnguyen.backend.auth.exception.MissingTokenException;
import me.giangnguyen.backend.user.User;
import me.giangnguyen.backend.user.UserService;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.servlet.HandlerExceptionResolver;

import java.io.IOException;
import java.util.Collections;
import java.util.Optional;
import java.util.UUID;

import static me.giangnguyen.backend.common.config.SecurityConfig.PUBLIC_MATCHER;

@Component
@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {
    private final JwtService jwtService;
    private final UserService userService;

    private final HandlerExceptionResolver handlerExceptionResolver;

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        return PUBLIC_MATCHER.matches(request);
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {
        try {
            String authHeader = request.getHeader("Authorization");

            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                throw new MissingTokenException("Missing bearer token");
            }

            String accessToken = authHeader.substring(7);
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
            SecurityContextHolder.getContext().setAuthentication(authToken);
        } catch (Exception e) {
            handlerExceptionResolver.resolveException(request, response, null, e);
            return;
        }

        filterChain.doFilter(request, response);
    }
}
