package me.giangnguyen.backend.contact;

import lombok.RequiredArgsConstructor;
import me.giangnguyen.backend.contact.dto.ContactRequest;
import me.giangnguyen.backend.contact.dto.GetContactResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/contacts")
@RequiredArgsConstructor
@Validated
public class ContactController {
    private final ContactService service;

    @GetMapping
    public ResponseEntity<List<GetContactResponse>> getContacts(
            @AuthenticationPrincipal UUID userId
    ) {
        return ResponseEntity.ok(service.getContacts(userId));
    }

    @DeleteMapping("/{contactId}")
    public ResponseEntity<Void> deleteContact(
            @AuthenticationPrincipal UUID userId,
            @PathVariable("contactId") UUID contactId
    ) {
        service.deleteContact(userId, contactId);
        return ResponseEntity.noContent().build();
    }
}
