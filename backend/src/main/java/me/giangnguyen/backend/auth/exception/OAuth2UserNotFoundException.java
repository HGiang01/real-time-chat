package me.giangnguyen.backend.auth.exception;

import me.giangnguyen.backend.common.exception.ApplicationException;
import org.springframework.http.HttpStatus;

public class OAuth2UserNotFoundException extends ApplicationException {
    public OAuth2UserNotFoundException(String message) {
        super(HttpStatus.NOT_FOUND, "OAUTH2_USER_NOT_FOUND", message);
    }
}
