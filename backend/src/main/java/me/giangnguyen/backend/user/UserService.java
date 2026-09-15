package me.giangnguyen.backend.user;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import me.giangnguyen.backend.common.util.ImageUtils;
import me.giangnguyen.backend.user.dto.GetMeResponse;
import me.giangnguyen.backend.user.dto.UpdateProfileRequest;
import me.giangnguyen.backend.user.exception.UserNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;


@Service
@RequiredArgsConstructor
public class UserService {
    private final ImageUtils imageUtils;
    private final UserRepository repository;

    public Optional<User> findById(UUID id) {
        return repository.findById(id);
    }

    public Optional<User> findById(String id) {
        return repository.findById(UUID.fromString(id));
    }

    public Optional<User> findByEmail(String email) {
        return repository.findUserByEmail(email);
    }

    public Optional<User> findByEmailAndActivated(String email) {
        return repository.findUserByEmailAndIsActive(email, true);
    }

    public User save(User user) {
        return repository.save(user);
    }

    @Transactional
    public void setActive(String email) {
        repository.updateIsActiveByEmail(email, true);
    }

    @Transactional
    public void deleteByEmailAndInactive(String email) {
        repository.findAvatarUrlByEmail(email).ifPresent(imageUtils::deleteImage);
        repository.deleteByEmailAndNotActive(email);
    }

    public GetMeResponse getMe(UUID userId) {
        Optional<User> user = repository.findById(userId);

        if (user.isEmpty()) {
            throw new UserNotFoundException("User not found");
        }

        return new GetMeResponse(user.get().getUsername(),
                                 user.get().getBio(),
                                 imageUtils.getThumbnailUrl(user.get().getAvatarUrl()));
    }

    @Transactional
    public GetMeResponse updateProfile(UUID userId, UpdateProfileRequest request) {
        Optional<User> user = repository.findById(userId);

        if (user.isEmpty()) {
            throw new UserNotFoundException("User not found");
        }

        if (request.username() != null) {
            user.get().setUsername(request.username());
        }

        if (request.bio() != null) {
            user.get().setBio(request.bio());
        }

        if (request.avatar() != null) {
            String oldAvatarUrl = user.get().getAvatarUrl();
            if (oldAvatarUrl != null) {
                imageUtils.deleteImage(user.get().getAvatarUrl());
            }

            String newAvatarUrl = imageUtils.upload(request.avatar());
            user.get().setAvatarUrl(newAvatarUrl);
        }

        return new GetMeResponse(user.get().getUsername(),
                                 user.get().getBio(),
                                 imageUtils.getThumbnailUrl(user.get().getAvatarUrl()));
    }
}

