package com.example.homekart.dto;

import lombok.Data;

@Data
public class DeliveryAgentSignupRequest {
    private String name;
    private String email;
    private String password;
    private String phone;
    
}
