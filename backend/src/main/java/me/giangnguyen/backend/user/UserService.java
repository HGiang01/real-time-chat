package me.giangnguyen.backend.user;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import me.giangnguyen.backend.common.util.ImageUtils;
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

    @Transactional
    public void changePassword(UUID id, String newHashPassword) {
        repository.changePassword(id, newHashPassword);
    }
}

