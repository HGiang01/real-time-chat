package me.giangnguyen.backend.request.dto;

import jakarta.annotation.Nullable;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import me.giangnguyen.backend.chat.ConversationType;

import java.util.UUID;

public record SendRequest(@NotNull UUID receiverId,
                          @NotNull ConversationType type,
                          @Nullable @Size(max = 255) String message) {
}
