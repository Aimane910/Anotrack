package com.projet.anotrack.modules.bloc.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.projet.anotrack.modules.bloc.domain.Bloc;

import java.util.Optional;

@Repository
public interface BlocRepository extends JpaRepository<Bloc, Long> {
    Optional<Bloc> findByName(String name);
}