package com.projet.anotrack.modules.anomalie.service;

import com.projet.anotrack.modules.anomalie.domain.Anomalie;
import com.projet.anotrack.modules.anomalie.domain.EStatus;
import com.projet.anotrack.modules.anomalie.repository.AnomalieRepository;
import com.projet.anotrack.modules.utilisateur.domain.Utilisateur;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class AnomalieService {
    private final AnomalieRepository anomalieRepository;

    public AnomalieService(AnomalieRepository anomalieRepository) {
        this.anomalieRepository = anomalieRepository;
    }

    public List<Anomalie> getAllUnassignedAnomalies() {
        return anomalieRepository.findByAssignedToIsNullAndStatus(EStatus.TODO);
    }

    public Anomalie assignToTechnician(Long anomalieId, Utilisateur technicien) {
        Anomalie anomalie = anomalieRepository.findById(anomalieId)
            .orElseThrow(() -> new RuntimeException("Anomalie not found"));
        
        if (anomalie.getAssignedTo()!= null) {
            throw new RuntimeException("Anomalie already assigned");
        }

        anomalie.setAssignedTo(technicien);
        anomalie.setStatus(EStatus.IN_PROGRESS);
        anomalie.setAssignmentDate(LocalDateTime.now());
        
        return anomalieRepository.save(anomalie);
    }
}