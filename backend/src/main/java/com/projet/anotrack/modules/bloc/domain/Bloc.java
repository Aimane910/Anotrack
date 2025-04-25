package com.projet.anotrack.modules.bloc.domain;

import jakarta.persistence.*;
import lombok.Data;
import java.util.Set;

import com.projet.anotrack.modules.Machine.domain.Machine;

@Entity
@Table(name = "bloc")
@Data
public class Bloc {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column
    private String description;

    @OneToMany(mappedBy = "bloc", cascade = CascadeType.ALL) // Remplacer 'bloc' par 'blocs'
    private Set<Machine> machines;
}