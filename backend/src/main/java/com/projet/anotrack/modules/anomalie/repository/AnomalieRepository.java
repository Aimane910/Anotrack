package com.projet.anotrack.modules.anomalie.repository;

import com.projet.anotrack.modules.anomalie.domain.Anomalie;
import com.projet.anotrack.modules.anomalie.domain.EStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnomalieRepository extends JpaRepository<Anomalie, Long> {
    List<Anomalie> findByAssignedToIsNullAndStatus(EStatus status);
    List<Anomalie> findByAssignedToId(Long technicienId);
}