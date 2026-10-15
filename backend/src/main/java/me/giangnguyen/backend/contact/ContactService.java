package me.giangnguyen.backend.contact;

import lombok.RequiredArgsConstructor;
import me.giangnguyen.backend.contact.dto.GetContactResponse;
import me.giangnguyen.backend.user.User;
import me.giangnguyen.backend.user.UserService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ContactService {
    private final ContactRepository repository;
    private final UserService userService;

    public Contact save(User owner, User contactor) {
        return repository.save(Contact.builder().owner(owner).contact(contactor).build());
    }

    public boolean isFriend(UUID ownerId, UUID contactId) {
        return repository.isFriend(ownerId, contactId);
    }

    public List<GetContactResponse> getContacts(UUID userId) {
        List<Contact> contacts = repository.getAllByOwner(userId);

        return contacts.stream()
                       .map(contact -> new GetContactResponse(contact.getContact().getId(),
                                                              contact.getContact().getUsername(),
                                                              contact.getContact().getAvatarUrl()))
                       .collect(Collectors.toList());
    }

    @Transactional
    public void deleteContact(UUID userId, UUID contactId) {
        repository.deleteByIdAndContactId(userId, contactId);
        repository.deleteByIdAndContactId(contactId, userId);
    }
}
