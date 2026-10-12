package me.giangnguyen.backend.contact.dto;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record GetContactResponse(
        @NotNull UUID userId,
        @NotNull String username,
        String avatarUrl
) {
}
