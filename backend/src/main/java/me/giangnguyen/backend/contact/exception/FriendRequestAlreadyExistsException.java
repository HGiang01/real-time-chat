package me.giangnguyen.backend.contact.exception;

import me.giangnguyen.backend.common.exception.ApplicationException;
import org.springframework.http.HttpStatus;

public class FriendRequestAlreadyExistsException extends ApplicationException {
    public FriendRequestAlreadyExistsException(String message) {
        super(HttpStatus.CONFLICT, "FRIEND_REQUEST_ALREADY_EXISTS", message);
    }
}
