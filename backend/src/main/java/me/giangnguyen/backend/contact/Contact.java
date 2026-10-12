package me.giangnguyen.backend.contact;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import me.giangnguyen.backend.user.User;
import org.hibernate.annotations.Generated;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.hibernate.generator.EventType;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "contacts")
@Data
@Builder
@AllArgsConstructor
@RequiredArgsConstructor
public class Contact {
    @Id @Generated(event = EventType.INSERT) private UUID id;

    @Column(name = "created_at", nullable = false, updatable = false) @Generated(event = EventType.INSERT)
    private OffsetDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY, optional = false) @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "owner_id", nullable = false) private User owner;

    @ManyToOne(fetch = FetchType.LAZY, optional = false) @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "contact_id", nullable = false) private User contact;
}