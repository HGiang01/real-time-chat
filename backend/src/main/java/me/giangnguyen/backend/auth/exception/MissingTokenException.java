package me.giangnguyen.backend.auth.exception;

import me.giangnguyen.backend.common.exception.ApplicationException;
import org.springframework.http.HttpStatus;

public class MissingTokenException extends ApplicationException {
    public MissingTokenException(String message) {
        super(HttpStatus.UNAUTHORIZED, "MISSING_TOKEN", message);
    }
}
