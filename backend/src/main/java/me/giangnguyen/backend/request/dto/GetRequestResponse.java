package me.giangnguyen.backend.request.dto;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record GetRequestResponse(@NotNull UUID requestId, String message, @NotNull String username, String avatarUrl) {
}
