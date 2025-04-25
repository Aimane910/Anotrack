package com.projet.anotrack.modules.Machine.domain;

import java.util.HashSet;
import java.util.Set;

import com.projet.anotrack.modules.anomalie.domain.Anomalie;
import com.projet.anotrack.modules.bloc.domain.Bloc;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "machines")
@Data
public class Machine {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column
    private String description;

    @ManyToOne
    @JoinColumn(name = "bloc_id", nullable = false) // Renommer la colonne pour qu'elle corresponde à 'blocs_id'
    private Bloc bloc; // Remplacer 'Bloc' par 'Blocs'


    @Getter
    @Setter
    @OneToMany(mappedBy = "machine")
    private Set<Anomalie> anomalies = new HashSet<>();
    
}