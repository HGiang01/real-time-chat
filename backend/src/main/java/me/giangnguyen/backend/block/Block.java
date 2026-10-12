package me.giangnguyen.backend.block;

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
@Table(name = "blocks")
@Data
@Builder
@AllArgsConstructor
@RequiredArgsConstructor
public class Block {
    @Id @Generated(event = EventType.INSERT) private UUID id;

    @Column(name = "created_at", nullable = false, updatable = false) @Generated(event = EventType.INSERT)
    private OffsetDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY, optional = false) @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "blocker_id", nullable = false) private User blocker;

    @ManyToOne(fetch = FetchType.LAZY, optional = false) @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "blocked_id", nullable = false) private User blocked;

}