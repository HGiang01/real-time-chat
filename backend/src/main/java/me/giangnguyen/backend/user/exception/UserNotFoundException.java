package me.giangnguyen.backend.user.exception;

import me.giangnguyen.backend.common.exception.ApplicationException;
import org.springframework.http.HttpStatus;

public class UserNotFoundException extends ApplicationException {
    public UserNotFoundException(String message) {
        super(HttpStatus.NOT_FOUND, "USER_NOT_FOUND", message);
    }
}
