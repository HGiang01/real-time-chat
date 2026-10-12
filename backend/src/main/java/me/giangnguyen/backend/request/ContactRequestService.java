package me.giangnguyen.backend.request;

import lombok.RequiredArgsConstructor;
import me.giangnguyen.backend.block.BlockService;
import me.giangnguyen.backend.chat.ConversationType;
import me.giangnguyen.backend.contact.ContactService;
import me.giangnguyen.backend.contact.dto.GetContactResponse;
import me.giangnguyen.backend.contact.exception.*;
import me.giangnguyen.backend.request.dto.GetRequestResponse;
import me.giangnguyen.backend.request.dto.RequestDirection;
import me.giangnguyen.backend.request.dto.SendRequest;
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
public class ContactRequestService {
    private final ContactRequestRepository repository;
    private final UserService userService;
    private final ContactService contactService;
    private final BlockService blockService;

    public ContactRequest save(User senderId, User receiverId, ConversationType type, String message) {
        return repository.save(ContactRequest.builder()
                                             .sender(senderId)
                                             .receiver(receiverId)
                                             .type(type)
                                             .message(message)
                                             .build());
    }

    public void deleteRequest(UUID requestId) {
        repository.deleteById(requestId);
    }

    public Optional<GetContactResponse> findUser(String email) {
        return userService.findByEmailAndActivated(email)
                          .map(user -> new GetContactResponse(user.getId(), user.getUsername(), user.getAvatarUrl()));
    }

    public List<GetRequestResponse> getRequests(UUID userId, RequestDirection direction) {
        Optional<User> user = userService.findById(userId);

        if (user.isEmpty()) {
            throw new UserNotFoundException("User not found");
        }

        if (direction.equals(RequestDirection.incoming)) {
            List<ContactRequest> requests = repository.getByReceiver(user.get());
            return requests.stream().map((request) -> {
                User sender = request.getSender();
                return new GetRequestResponse(request.getId(),
                                              request.getMessage(),
                                              sender.getUsername(),
                                              sender.getAvatarUrl());
            }).collect(Collectors.toList());
        }

        if (direction.equals(RequestDirection.outgoing)) {
            List<ContactRequest> requests = repository.getBySender(user.get());
            return requests.stream().map((request) -> {
                User receiver = request.getReceiver();
                return new GetRequestResponse(request.getId(),
                                              request.getMessage(),
                                              receiver.getUsername(),
                                              receiver.getAvatarUrl());
            }).collect(Collectors.toList());
        }

        return List.of();
    }

    public boolean isRequestExists(UUID senderId, UUID receiverId) {
        return repository.isRequestExists(senderId, receiverId);
    }


    public void createRequest(UUID userId, SendRequest payload) {
        Optional<User> sender = userService.findById(userId);

        if (sender.isEmpty()) {
            throw new UserNotFoundException("Sender not found");
        }

        Optional<User> receiver = userService.findActiveUserById(payload.receiverId());

        if (receiver.isEmpty()) {
            throw new UserNotFoundException("Receiver not found");
        }

        UUID senderId = sender.get().getId();
        UUID receiverId = receiver.get().getId();

        if (senderId.equals(receiverId)) {
            throw new SelfFriendRequestException("You cannot send a friend request to yourself");
        }

        if (contactService.isFriend(senderId, receiverId)) {
            throw new AlreadyFriendsException("You are already friends with this user");
        }

        if (isRequestExists(senderId, receiverId)) {
            throw new FriendRequestAlreadyExistsException("A friend request between you and this you is already pending");
        }

        if (blockService.isBlockedBy(senderId, receiverId)) {
            throw new UserBlockedException(
                    "You have blocked this user, unblock them to send a message or friend request");
        } else if (blockService.isBlockedBy(receiverId, senderId)) {
            throw new FriendRequestNotAllowedException("Unable to send a friend request to this user");
        }

        save(sender.get(), receiver.get(), payload.type(), payload.message());
    }

    public void acceptRequest(UUID requestId) {
        repository.findById(requestId).ifPresent(contact -> {
            contactService.save(contact.getSender(), contact.getReceiver());
            contactService.save(contact.getReceiver(), contact.getSender());
            deleteRequest(contact.getId());
        });
    }

    public void rejectRequest(UUID requestId) {
        repository.findById(requestId).ifPresent(contact -> deleteRequest(contact.getId()));
    }

    public void restoreRequest(UUID requestId) {
        repository.deleteById(requestId);
    }
}
