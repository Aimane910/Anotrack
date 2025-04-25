package com.projet.anotrack.modules.bloc.Controller;

import com.projet.anotrack.modules.bloc.domain.Bloc;
import com.projet.anotrack.modules.bloc.repository.BlocRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/blocs")
public class BlocController {

    @Autowired
    private BlocRepository blocRepository;

    @GetMapping
    public ResponseEntity<?> getAllBlocs() {
        return ResponseEntity.ok(blocRepository.findAll());
    }

    @GetMapping("/{blocId}")
    public ResponseEntity<?> getBlocById(@PathVariable Long blocId) {
        return blocRepository.findById(blocId)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{blocId}/machines")
    public ResponseEntity<?> getMachinesInBloc(@PathVariable Long blocId) {
        return blocRepository.findById(blocId)
            .map(bloc -> ResponseEntity.ok(bloc.getMachines()))
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createBloc(@RequestBody Bloc bloc) {
        try {
            Bloc savedBloc = blocRepository.save(bloc);
            return ResponseEntity.ok(savedBloc);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body("Error creating bloc: " + e.getMessage());
        }
    }

    @PutMapping("/{blocId}")
    public ResponseEntity<?> updateBloc(@PathVariable Long blocId, @RequestBody Bloc blocDetails) {
        return blocRepository.findById(blocId)
            .map(bloc -> {
                bloc.setName(blocDetails.getName());
                bloc.setDescription(blocDetails.getDescription());
                return ResponseEntity.ok(blocRepository.save(bloc));
            })
            .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{blocId}")
    public ResponseEntity<?> deleteBloc(@PathVariable Long blocId) {
        return blocRepository.findById(blocId)
            .map(bloc -> {
                blocRepository.delete(bloc);
                return ResponseEntity.ok().build();
            })
            .orElse(ResponseEntity.notFound().build());
    }
}
