package me.giangnguyen.backend.block.dto;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public record GetBlockResponse(@NotNull UUID userId, @NotNull String username, String avatarUrl) {
}
