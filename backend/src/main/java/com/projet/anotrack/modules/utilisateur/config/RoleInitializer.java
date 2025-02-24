package com.projet.anotrack.modules.utilisateur.config;

import com.projet.anotrack.modules.utilisateur.domain.ERole;
import com.projet.anotrack.modules.utilisateur.domain.RoleEntity;
import com.projet.anotrack.modules.utilisateur.repository.RoleRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class RoleInitializer implements CommandLineRunner {

    @Autowired
        RoleRepository roleRepository;

        @Override
        public void run(String... args) throws Exception {

            if (!roleRepository.existsByName(ERole.ROLE_OPERATOR)) {
                roleRepository.save(new RoleEntity(ERole.ROLE_OPERATOR));
            }

            if (!roleRepository.existsByName(ERole.ROLE_tech)) {
                roleRepository.save(new RoleEntity(ERole.ROLE_tech));
            }
        }
}