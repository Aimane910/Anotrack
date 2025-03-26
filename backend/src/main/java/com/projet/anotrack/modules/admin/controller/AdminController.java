package com.projet.anotrack.modules.admin.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.projet.anotrack.modules.utilisateur.repository.UtilisateurRepository;
import com.projet.anotrack.modules.utilisateur.repository.RoleRepository;
import com.projet.anotrack.modules.utilisateur.domain.Utilisateur;
import com.projet.anotrack.modules.utilisateur.domain.RoleEntity;
import com.projet.anotrack.modules.utilisateur.domain.ERole;
import com.projet.anotrack.modules.bloc.domain.Bloc;
import com.projet.anotrack.modules.bloc.domain.Machine;
import org.springframework.data.repository.CrudRepository;
import com.projet.anotrack.modules.bloc.repository.BlocRepository;
import com.projet.anotrack.modules.bloc.repository.MachineRepository;
import com.projet.anotrack.modules.admin.dto.CreateUserRequest;

import java.util.HashSet;
import java.util.Set;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private UtilisateurRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private BlocRepository blocRepository;

    @Autowired
    private MachineRepository machineRepository;

    @Autowired
    private PasswordEncoder encoder;

    @PostMapping("/users")
    public ResponseEntity<?> createUser(@RequestBody CreateUserRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            return ResponseEntity
                .badRequest()
                .body("Error: Username is already taken!");
        }

        // Create new user
        Utilisateur user = new Utilisateur();
        user.setUsername(request.getUsername());
        user.setPassword(encoder.encode(request.getPassword()));

        // Set role
        Set<RoleEntity> roles = new HashSet<>();
        ERole roleEnum;
        
        try {
            roleEnum = ERole.valueOf("ROLE_" + request.getRole().toUpperCase());
        } catch (IllegalArgumentException e) {
            return ResponseEntity
                .badRequest()
                .body("Error: Invalid role specified!");
        }

        RoleEntity role = roleRepository.findByName(roleEnum)
            .orElseThrow(() -> new RuntimeException("Error: Role not found."));
        roles.add(role);
        user.setRoles(roles);

        userRepository.save(user);
        return ResponseEntity.ok("User created successfully!");
    }

    @PostMapping("/blocs")
    public ResponseEntity<?> createBloc(@RequestBody Bloc bloc) {
        try {
            Bloc savedBloc = blocRepository.save(bloc);
            return ResponseEntity.ok(savedBloc);
        } catch (Exception e) {
            return ResponseEntity
                .badRequest()
                .body("Error creating bloc: " + e.getMessage());
        }
    }

    @PostMapping("/blocs/{blocId}/machines")
    public ResponseEntity<?> addMachine(@PathVariable Long blocId, @RequestBody Machine machine) {
        return blocRepository.findById(blocId)
            .map(bloc -> {
                machine.setBloc(bloc);
                Machine savedMachine = machineRepository.save(machine);
                return ResponseEntity.ok(savedMachine);
            })
            .orElse(ResponseEntity
                .badRequest()
                .body("Error: Bloc not found!"));
    }
}