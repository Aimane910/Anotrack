package com.projet.anotrack.modules.anomalie.domain;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

import com.projet.anotrack.modules.Machine.domain.Machine;
import com.projet.anotrack.modules.utilisateur.domain.Utilisateur;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "anomalies")
@Data
@Getter
@Setter
public class Anomalie {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(length = 1000)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EStatus status = EStatus.TODO;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "photo_url")
    private String photoUrl;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "machine_id", nullable = false)
    private Machine machine;

    @Getter
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_to")
    private Utilisateur assignedTo;

    @Column(name = "assignment_date")
    private LocalDateTime assignmentDate;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}