package me.giangnguyen.backend.block;

import lombok.RequiredArgsConstructor;
import me.giangnguyen.backend.block.dto.GetBlockResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/blocks")
@RequiredArgsConstructor
public class BlockController {
    private final BlockService service;

    @GetMapping
    public ResponseEntity<List<GetBlockResponse>> getBlockedList(
            @AuthenticationPrincipal UUID userId
    ) {
        return ResponseEntity.ok(service.getBlocked(userId));
    }

    @PostMapping("/{blockedId}")
    public ResponseEntity<Void> blockUser(
            @AuthenticationPrincipal UUID blockerId,
            @PathVariable(name = "blockedId") UUID blockedId
    ) {
        service.block(blockerId, blockedId);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{blockedId}")
    public ResponseEntity<Void> unblockUser(
            @AuthenticationPrincipal UUID blockerId,
            @PathVariable(name = "blockedId") UUID blockedId
    ) {
        service.unblock(blockerId, blockedId);
        return ResponseEntity.noContent().build();
    }
}
