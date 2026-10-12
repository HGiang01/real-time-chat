package me.giangnguyen.backend.contact.exception;

import me.giangnguyen.backend.common.exception.ApplicationException;
import org.springframework.http.HttpStatus;

public class UserBlockedException extends ApplicationException {
    public UserBlockedException(String message) {
        super(HttpStatus.CONFLICT, "USER_BLOCKED", message);
    }
}
