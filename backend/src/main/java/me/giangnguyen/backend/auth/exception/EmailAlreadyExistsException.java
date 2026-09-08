package me.giangnguyen.backend.auth.exception;

import me.giangnguyen.backend.common.exception.ApplicationException;
import org.springframework.http.HttpStatus;

public class EmailAlreadyExistsException extends ApplicationException {
    public EmailAlreadyExistsException(String message) {
        super(HttpStatus.CONFLICT, "EMAIL_ALREADY_EXISTS", message);
    }
}
