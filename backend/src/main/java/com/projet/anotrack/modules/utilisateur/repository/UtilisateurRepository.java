package com.projet.anotrack.modules.utilisateur.repository;

import com.projet.anotrack.modules.utilisateur.domain.ERole;
import com.projet.anotrack.modules.utilisateur.domain.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.Set;

@Repository
public interface UtilisateurRepository extends JpaRepository<Utilisateur, Long> {
    Optional<Utilisateur> findByUsername(String username);
    Boolean existsByUsername(String username);
    Set<Utilisateur> findByRolesName(ERole name);
}