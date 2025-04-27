package com.example.homekart.controller;

import com.example.homekart.dto.AdminSignupRequest;
import com.example.homekart.dto.LoginRequest;
import com.example.homekart.dto.AdminLoginRequest;
import com.example.homekart.entity.Admin;
import com.example.homekart.entity.Seller;
import com.example.homekart.repository.AdminRepository;
import com.example.homekart.security.JwtUtil;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/auth")
public class AdminAuthController {

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    

    @Autowired
    private JwtUtil jwtTokenUtil; // ✅ CORRECT now!

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody AdminSignupRequest request) {
        if (adminRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already registered!");
        }

        Admin admin = Admin.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .build();

        adminRepository.save(admin);
        return ResponseEntity.ok("Admin registered successfully");
    }

    // @PostMapping("/login")
    // public ResponseEntity<?> login(@RequestBody AdminLoginRequest request) {
    // Admin admin = adminRepository.findByEmail(request.getEmail())
    // .orElseThrow(() -> new RuntimeException("Invalid email or password"));

    // if (!passwordEncoder.matches(request.getPassword(), admin.getPassword())) {
    // throw new RuntimeException("Invalid email or password");
    // }

    // String token = jwtTokenUtil.generateToken(admin.getEmail());
    // return ResponseEntity.ok(Map.of("token", token));
    // }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        Admin admin = adminRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), admin.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        String token = jwtTokenUtil.generateToken(admin.getEmail());

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("name", admin.getName());
        response.put("email", admin.getEmail());
        response.put("role", "admin");

        return ResponseEntity.ok(response);
    }

}
