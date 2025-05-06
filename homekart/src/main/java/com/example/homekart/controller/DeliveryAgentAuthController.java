package com.example.homekart.controller;

import com.example.homekart.dto.DeliveryAgentSignupRequest;
import com.example.homekart.dto.LoginRequest;
import com.example.homekart.dto.DeliveryAgentLoginRequest;
import com.example.homekart.entity.DeliveryAgent;
import com.example.homekart.repository.DeliveryAgentRepository;
import com.example.homekart.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/delivery/auth")
public class DeliveryAgentAuthController {

    @Autowired
    private DeliveryAgentRepository deliveryAgentRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody DeliveryAgentSignupRequest request) {
        if (deliveryAgentRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already registered!");
        }

        DeliveryAgent agent = DeliveryAgent.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .build();

        deliveryAgentRepository.save(agent);
        return ResponseEntity.ok("Delivery agent registered successfully!");
    }

 

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        DeliveryAgent delivery = deliveryAgentRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), delivery.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        String token = jwtUtil.generateToken(delivery.getEmail());

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("name", delivery.getName());
        response.put("email", delivery.getEmail());
        response.put("role", "delivery");

        return ResponseEntity.ok(response);
    }
}
