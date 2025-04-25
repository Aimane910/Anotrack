package com.projet.anotrack.modules.Machine.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.projet.anotrack.modules.Machine.domain.Machine;
import com.projet.anotrack.modules.bloc.domain.Bloc;


@Repository
public interface MachineRepository extends JpaRepository<Machine, Long> {
    List<Machine> findByBloc(Bloc bloc);
}