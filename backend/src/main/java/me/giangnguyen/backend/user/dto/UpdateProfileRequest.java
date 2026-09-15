package me.giangnguyen.backend.user.dto;

import jakarta.annotation.Nullable;
import org.springframework.web.multipart.MultipartFile;

public record UpdateProfileRequest(@Nullable String username, @Nullable String bio, @Nullable MultipartFile avatar) {
}
