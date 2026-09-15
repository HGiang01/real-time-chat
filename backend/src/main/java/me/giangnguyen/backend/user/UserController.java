package me.giangnguyen.backend.user;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import me.giangnguyen.backend.user.dto.GetMeResponse;
import me.giangnguyen.backend.user.dto.UpdateProfileRequest;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService service;

    @GetMapping("/me")
    public ResponseEntity<GetMeResponse> getMe(@AuthenticationPrincipal UUID userId) {
        return ResponseEntity.ok(service.getMe(userId));
    }

    @PatchMapping(value = "/me", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<GetMeResponse> updateProfile(
            @AuthenticationPrincipal UUID userId,
            @Valid @ModelAttribute UpdateProfileRequest request
    ) {
        return ResponseEntity.ok(service.updateProfile(userId, request));
    }
}
