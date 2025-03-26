package com.projet.anotrack.modules.anomalie.controller;

import org.springframework.http.MediaType;
import com.projet.anotrack.modules.anomalie.domain.Anomalie;
import com.projet.anotrack.modules.anomalie.service.AnomalieService;
import com.projet.anotrack.modules.utilisateur.domain.Utilisateur;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/api/anomalies")
public class AnomalieController {
    private final AnomalieService anomalieService;

    public AnomalieController(AnomalieService anomalieService) {
        this.anomalieService = anomalieService;
    }

    @GetMapping("/unassigned")
    public ResponseEntity<?> getUnassignedAnomalies() {
        return ResponseEntity.ok(anomalieService.getAllUnassignedAnomalies());
    }

    @PostMapping("/{anomalieId}/assign")
    public ResponseEntity<?> assignAnomalie(
            @PathVariable Long anomalieId,
            @RequestAttribute("currentUser") Utilisateur technicien) {
        return ResponseEntity.ok(anomalieService.assignToTechnician(anomalieId, technicien));
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Anomalie> createAnomalie(
            @RequestParam("title") String title,
            @RequestParam("description") String description,
            @RequestParam("photo") MultipartFile photo) {
        
        Anomalie newAnomalie = anomalieService.createAnomalie(title, description, photo);
        return ResponseEntity.ok(newAnomalie);
    }
}