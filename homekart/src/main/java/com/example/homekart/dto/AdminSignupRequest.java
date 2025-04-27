package com.example.homekart.dto;

import lombok.Data;

@Data
public class AdminSignupRequest {
    private String name;
    private String email;
    private String password;
}
