package com.projet.anotrack.modules.admin.dto;

import lombok.Data;

@Data
public class CreateUserRequest {
    private String username;
    private String password;
    private String role;  // "TECH" or "OPERATOR"
}