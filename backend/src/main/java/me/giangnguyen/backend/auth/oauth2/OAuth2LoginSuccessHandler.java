package me.giangnguyen.backend.auth.oauth2;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import me.giangnguyen.backend.auth.AuthService;
import me.giangnguyen.backend.auth.dto.OAuth2LoginRequest;
import me.giangnguyen.backend.auth.exception.OAuth2UserNotFoundException;
import me.giangnguyen.backend.auth.jwt.JwtService;
import me.giangnguyen.backend.auth.refreshtoken.RefreshTokenService;
import me.giangnguyen.backend.common.util.CookieUtils;
import me.giangnguyen.backend.user.UserService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {
    private final AuthService authService;
    private final CookieUtils cookieUtils;

    @Value("${app.frontend.oauth2-redirect-url}") private String redirectUri;

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) throws IOException, ServletException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
        String registrationId = ((OAuth2AuthenticationToken) authentication).getAuthorizedClientRegistrationId();

        if (oAuth2User == null) {
            throw new OAuth2UserNotFoundException("OAuth2User not found");
        }

        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");
        String providerId = oAuth2User.getAttribute("sub");
        String refreshToken = authService.oauth2Login(new OAuth2LoginRequest(email, name, registrationId, providerId))
                                         .refreshToken();
        String cookie = cookieUtils.createRefreshTokenCookie(refreshToken);
        String targetUrl = UriComponentsBuilder.fromUriString(redirectUri).build().toUriString();

        response.addHeader("Set-Cookie", cookie);
        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }
}
