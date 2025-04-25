package com.projet.anotrack.modules.utilisateur.config;

import com.projet.anotrack.modules.utilisateur.domain.ERole;
import com.projet.anotrack.modules.utilisateur.domain.RoleEntity;
import com.projet.anotrack.modules.utilisateur.domain.Utilisateur;
import com.projet.anotrack.modules.utilisateur.repository.RoleRepository;
import com.projet.anotrack.modules.utilisateur.repository.UtilisateurRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.HashSet;
import java.util.Set;

@Component
public class RoleInitializer implements CommandLineRunner {

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UtilisateurRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Initialize roles if they don't exist
        createRoleIfNotFound(ERole.ROLE_ADMIN);
        createRoleIfNotFound(ERole.ROLE_tech);
        createRoleIfNotFound(ERole.ROLE_OPERATOR);

        // Create default admin if not exists
        if (!userRepository.existsByUsername("admin")) {
            Utilisateur admin = new Utilisateur();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin123")); // Change this password

            Set<RoleEntity> roles = new HashSet<>();
            RoleEntity adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
                .orElseThrow(() -> new RuntimeException("Error: Admin Role not found."));
            roles.add(adminRole);
            admin.setRoles(roles);

            userRepository.save(admin);
        }
    }

    private void createRoleIfNotFound(ERole name) {
        if (!roleRepository.existsByName(name)) {
            roleRepository.save(new RoleEntity(name));
        }
    }
}