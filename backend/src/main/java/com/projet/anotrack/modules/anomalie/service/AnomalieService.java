package com.projet.anotrack.modules.anomalie.service;

import com.projet.anotrack.modules.Machine.domain.Machine;
import com.projet.anotrack.modules.Machine.repository.MachineRepository;
import com.projet.anotrack.modules.anomalie.domain.Anomalie;
import com.projet.anotrack.modules.anomalie.domain.EStatus;
import com.projet.anotrack.modules.anomalie.repository.AnomalieRepository;
import com.projet.anotrack.modules.utilisateur.domain.Utilisateur;

import org.apache.velocity.exception.ResourceNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;

@Service
@Transactional
public class AnomalieService {
    private final AnomalieRepository anomalieRepository;
    private final MachineRepository machineRepository;
    public AnomalieService(AnomalieRepository anomalieRepository, MachineRepository machineRepository) {
        this.anomalieRepository = anomalieRepository;
        this.machineRepository = machineRepository;
    }

    public List<Anomalie> getAllUnassignedAnomalies() {
        return anomalieRepository.findByAssignedToIsNullAndStatus(EStatus.TODO);
    }

    @Autowired
    private FileStorageService fileStorageService;

    public Anomalie createAnomalie(String title, String description, MultipartFile photo, Long machineId) {
        Machine machine = machineRepository.findById(machineId)
            .orElseThrow(() -> new ResourceNotFoundException("Machine not found with id: " + machineId));

        String photoUrl = fileStorageService.uploadFile(photo);

        Anomalie anomalie = new Anomalie();
        anomalie.setTitle(title);
        anomalie.setDescription(description);
        anomalie.setPhotoUrl(photoUrl);
        anomalie.setMachine(machine);
        anomalie.setStatus(EStatus.TODO);

        return anomalieRepository.save(anomalie);
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