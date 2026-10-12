package me.giangnguyen.backend.contact.dto;

import jakarta.annotation.Nullable;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import me.giangnguyen.backend.chat.ConversationType;

import java.util.UUID;

public record ContactRequest(@NotNull UUID receiverId,
                             @NotNull ConversationType type,
                             @Nullable @Size(max = 255) String message) {
}
