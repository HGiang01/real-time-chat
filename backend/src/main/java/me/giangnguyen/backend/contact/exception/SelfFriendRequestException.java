package me.giangnguyen.backend.contact.exception;

import me.giangnguyen.backend.common.exception.ApplicationException;
import org.springframework.http.HttpStatus;

public class SelfFriendRequestException extends ApplicationException {
    public SelfFriendRequestException(String message) {
        super(HttpStatus.BAD_REQUEST, "SELF_FRIEND_REQUEST", message);
    }
}
