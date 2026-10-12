package me.giangnguyen.backend.contact.exception;

import me.giangnguyen.backend.common.exception.ApplicationException;
import org.springframework.http.HttpStatus;

public class AlreadyFriendsException extends ApplicationException {
    public AlreadyFriendsException(String message) {
        super(HttpStatus.CONFLICT, "ALREADY_FRIENDS", message);
    }
}
