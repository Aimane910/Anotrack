package com.projet.anotrack.modules.Machine.Controller;

import com.projet.anotrack.modules.Machine.domain.Machine;
import com.projet.anotrack.modules.Machine.repository.MachineRepository;
import com.projet.anotrack.modules.bloc.repository.BlocRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/machines")
public class MachineController {

    @Autowired
    private MachineRepository machineRepository;

    @Autowired
    private BlocRepository blocRepository;

    @GetMapping
    public ResponseEntity<?> getAllMachines() {
        return ResponseEntity.ok(machineRepository.findAll());
    }

    @GetMapping("/{machineId}")
    public ResponseEntity<?> getMachineById(@PathVariable Long machineId) {
        return machineRepository.findById(machineId)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    

    @PutMapping("/{machineId}")
    public ResponseEntity<?> updateMachine(
            @PathVariable Long machineId,
            @RequestBody Machine machineDetails) {
        return machineRepository.findById(machineId)
            .map(machine -> {
                machine.setName(machineDetails.getName());
                machine.setDescription(machineDetails.getDescription());
                if (machineDetails.getBloc() != null) {
                    machine.setBloc(machineDetails.getBloc());
                }
                return ResponseEntity.ok(machineRepository.save(machine));
            })
            .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{machineId}")
    public ResponseEntity<?> deleteMachine(@PathVariable Long machineId) {
        return machineRepository.findById(machineId)
            .map(machine -> {
                machineRepository.delete(machine);
                return ResponseEntity.ok().build();
            })
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/bloc/{blocId}")
    public ResponseEntity<?> getMachinesByBloc(@PathVariable Long blocId) {
        return blocRepository.findById(blocId)
            .map(bloc -> ResponseEntity.ok(machineRepository.findByBloc(bloc)))
            .orElse(ResponseEntity.notFound().build());
    }
}
