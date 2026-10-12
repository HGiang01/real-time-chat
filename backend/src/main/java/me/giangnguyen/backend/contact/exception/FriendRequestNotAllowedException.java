package me.giangnguyen.backend.contact.exception;

import me.giangnguyen.backend.common.exception.ApplicationException;
import org.springframework.http.HttpStatus;

public class FriendRequestNotAllowedException extends ApplicationException {
    public FriendRequestNotAllowedException(String message) {
        super(HttpStatus.FORBIDDEN, "FRIEND_REQUEST_NOT_ALLOWED", message);
    }
}
