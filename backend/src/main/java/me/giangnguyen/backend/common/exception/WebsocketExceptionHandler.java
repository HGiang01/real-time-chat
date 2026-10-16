package me.giangnguyen.backend.common.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.messaging.handler.annotation.MessageExceptionHandler;
import org.springframework.messaging.handler.annotation.support.MethodArgumentNotValidException;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.ControllerAdvice;

import java.time.Instant;
import java.util.stream.Collectors;

@ControllerAdvice
public class WebsocketExceptionHandler {
    @MessageExceptionHandler(ApplicationException.class)
    @SendToUser("/queue/errors")
    public ProblemDetail handleApplicationException(ApplicationException ex) {
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(ex.getStatus(), ex.getMessage());
        problem.setProperty("errorCode", ex.getErrorCode());
        problem.setProperty("timestamp", Instant.now());
        return problem;
    }

    @MessageExceptionHandler(MethodArgumentNotValidException.class)
    @SendToUser("/queue/errors")
    public ProblemDetail handleValidation(MethodArgumentNotValidException ex) {
        BindingResult result = ex.getBindingResult();

        String detail = result == null ? "Invalid request payload" : result.getFieldErrors()
                                                                           .stream()
                                                                           .map(e -> e.getField() + ": " + e.getDefaultMessage())
                                                                           .collect(Collectors.joining(", "));

        ProblemDetail problem = ProblemDetail.forStatusAndDetail(HttpStatus.BAD_REQUEST, detail);
        problem.setProperty("errorCode", "VALIDATION_ERROR");
        problem.setProperty("timestamp", Instant.now());
        return problem;
    }

    @MessageExceptionHandler(Exception.class)
    @SendToUser("/queue/errors")
    public ProblemDetail handleAll(Exception ex) {
        ProblemDetail problem = ProblemDetail.forStatusAndDetail(HttpStatus.INTERNAL_SERVER_ERROR,
                                                                 "Internal server error");
        problem.setProperty("errorCode", "INTERNAL_ERROR");
        problem.setProperty("timestamp", Instant.now());
        return problem;
    }
}
