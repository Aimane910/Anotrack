package com.projet.anotrack.modules.security.controllers;

import com.projet.anotrack.modules.security.jwt.JwtUtils;
import com.projet.anotrack.modules.security.payload.request.LoginRequest;
import com.projet.anotrack.modules.security.payload.request.SignupRequest;
import com.projet.anotrack.modules.security.payload.response.JwtResponse;
import com.projet.anotrack.modules.security.payload.response.MessageResponse;
import com.projet.anotrack.modules.security.services.UserDetailsImpl;
import com.projet.anotrack.modules.utilisateur.domain.ERole;
import com.projet.anotrack.modules.utilisateur.domain.RoleEntity;
import com.projet.anotrack.modules.utilisateur.domain.Utilisateur;
import com.projet.anotrack.modules.utilisateur.repository.RoleRepository;
import com.projet.anotrack.modules.utilisateur.repository.UtilisateurRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UtilisateurRepository utilisateurRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<String> roles = userDetails.getAuthorities().stream()
            .map(item -> item.getAuthority())
            .collect(Collectors.toList());

        return ResponseEntity.ok(new JwtResponse(
            jwt,
            userDetails.getId(),
            userDetails.getUsername(),
            roles));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        if (utilisateurRepository.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity
                .badRequest()
                .body(new MessageResponse("Error: Username is already taken!"));
        }

        // Create new user account
        Utilisateur user = new Utilisateur();
        user.setUsername(signUpRequest.getUsername());
        user.setPassword(encoder.encode(signUpRequest.getPassword()));

        Set<String> strRoles = signUpRequest.getRole();
        Set<RoleEntity> roles = new HashSet<>();

        if (strRoles == null) {
            RoleEntity userRole = roleRepository.findByName(ERole.ROLE_tech)
                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
            roles.add(userRole);
        } else {
            strRoles.forEach(role -> {
                switch (role.toLowerCase()) {
                    case "admin":
                        RoleEntity adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
                            .orElseThrow(() -> new RuntimeException("Error: Admin Role is not found."));
                        roles.add(adminRole);
                        break;
                    case "operator":
                        RoleEntity operRole = roleRepository.findByName(ERole.ROLE_OPERATOR)
                            .orElseThrow(() -> new RuntimeException("Error: Operator Role is not found."));
                        roles.add(operRole);
                        break;
                    case "tech":
                    default:
                        RoleEntity techRole = roleRepository.findByName(ERole.ROLE_tech)
                            .orElseThrow(() -> new RuntimeException("Error: Tech Role is not found."));
                        roles.add(techRole);
                }
            });
        }

        user.setRoles(roles);
        utilisateurRepository.save(user);

        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }
}