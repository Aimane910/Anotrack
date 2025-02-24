package com.projet.anotrack.modules.utilisateur.repository;

import com.projet.anotrack.modules.utilisateur.domain.ERole;
import com.projet.anotrack.modules.utilisateur.domain.RoleEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<RoleEntity, Long> {
    Optional<RoleEntity> findByName(ERole name);
    boolean existsByName(ERole name);
}