package me.giangnguyen.backend.contact;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface ContactRepository extends JpaRepository<Contact, UUID> {
    @Query(value = """
            select * from contacts where owner_id = :userId
            """, nativeQuery = true)
    List<Contact> getAllByOwner(@Param("userId") UUID userId);

    @Query(value = """
            select exists (
                select 1
                from contacts
                where owner_id = :ownerId and contact_id = :contactId
            )
            """, nativeQuery = true)
    boolean isFriend(@Param("ownerId") UUID ownerId, @Param("contactId") UUID contactId);

    @Modifying
    @Query(value = """
            delete from contacts where owner_id = :userId and contact_id = :contactId
            """, nativeQuery = true)
    void deleteByIdAndContactId(@Param("userId") UUID userId, @Param("contactId") UUID contactId);


}
