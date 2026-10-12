package me.giangnguyen.backend.block;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import me.giangnguyen.backend.block.dto.GetBlockResponse;
import me.giangnguyen.backend.user.User;
import me.giangnguyen.backend.user.UserService;
import me.giangnguyen.backend.user.exception.UserNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BlockService {
    private final BlockRepository repository;
    private final UserService userService;

    public List<GetBlockResponse> getBlocked(UUID userId) {
        Optional<User> user = userService.findById(userId);

        if (user.isEmpty()) {
            throw new UserNotFoundException("User not found");
        }

        List<Block> blockedList = repository.findByBlocker(user.get());
        return blockedList.stream()
                          .map((block -> new GetBlockResponse(block.getBlocked().getId(),
                                                              block.getBlocked().getUsername(),
                                                              block.getBlocked().getAvatarUrl())))
                          .collect(Collectors.toList());
    }

    @Transactional
    public void block(UUID blockerId, UUID blockedId) {
        boolean isBlocked = isBlockedBy(blockerId, blockedId);
        if (!isBlocked) repository.block(blockerId, blockedId);
    }

    @Transactional
    public void unblock(UUID blockerId, UUID blockedId) {
        boolean isBlocked = isBlockedBy(blockerId, blockedId);
        if (isBlocked) repository.unblock(blockerId, blockedId);
    }

    public boolean isBlockedBy(UUID blockerId, UUID blockedId) {
        return repository.isBlockedBy(blockerId, blockedId);
    }
}
