package me.giangnguyen.backend.auth.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record SignupRequest(@NotBlank @Size(min = 2, max = 50) @Pattern(regexp = "^[a-zA-Z0-9_]+$") String username,
                            @NotBlank @Email String email,
                            @NotBlank @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[\\W_])\\S{6,}$") String password) {
}
