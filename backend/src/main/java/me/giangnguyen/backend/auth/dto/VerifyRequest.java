package me.giangnguyen.backend.auth.dto;

import jakarta.validation.constraints.NotBlank;

public record VerifyRequest(@NotBlank String otp, @NotBlank String email) {
}
