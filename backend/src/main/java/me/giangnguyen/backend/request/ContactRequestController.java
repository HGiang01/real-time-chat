package me.giangnguyen.backend.request;

import jakarta.validation.constraints.Email;
import lombok.RequiredArgsConstructor;
import me.giangnguyen.backend.contact.dto.GetContactResponse;
import me.giangnguyen.backend.request.dto.GetRequestResponse;
import me.giangnguyen.backend.request.dto.RequestDirection;
import me.giangnguyen.backend.request.dto.SendRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/requests")
@RequiredArgsConstructor
public class ContactRequestController {
    private final ContactRequestService service;

    @GetMapping
    public ResponseEntity<List<GetRequestResponse>> getRequests(
            @AuthenticationPrincipal UUID userId,
            @RequestParam(name = "direction", required = true) RequestDirection direction
    ) {
        return ResponseEntity.ok(service.getRequests(userId, direction));
    }

    @GetMapping("/find")
    public ResponseEntity<Optional<GetContactResponse>> findUser(
            @RequestParam("email") @Email String email
    ) {
        return ResponseEntity.ok(service.findUser(email));
    }

    @PostMapping
    public ResponseEntity<Void> createRequest(
            @AuthenticationPrincipal UUID userId,
            @RequestBody SendRequest payload
    ) {
        service.createRequest(userId, payload);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PostMapping("/{requestId}/accept")
    public ResponseEntity<Void> acceptRequest(@PathVariable(name = "requestId") UUID requestId) {
        service.acceptRequest(requestId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{requestId}/reject")
    public ResponseEntity<Void> rejectRequest(@PathVariable(name = "requestId") UUID requestId) {
        service.rejectRequest(requestId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{requestId}")
    public ResponseEntity<Void> restoreRequest(@PathVariable(name = "requestId") UUID requestId) {
        service.restoreRequest(requestId);
        return ResponseEntity.noContent().build();
    }
}
