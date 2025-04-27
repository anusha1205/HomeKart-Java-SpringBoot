package com.example.homekart.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.example.homekart.dto.LoginRequest;
import com.example.homekart.dto.SignupRequest;
import com.example.homekart.entity.Seller;
import com.example.homekart.repository.SellerRepository;
import com.example.homekart.security.JwtUtil;

@RestController
@RequestMapping("/api/seller/auth")
public class SellerAuthController {

    @Autowired
    private SellerRepository sellerRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AuthenticationManager authenticationManager;

    @PostMapping("/signup")
    public ResponseEntity<?> registerSeller(@RequestBody SignupRequest request) {
        if (sellerRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already exists!");
        }

        Seller seller = new Seller();
        seller.setName(request.getName());
        seller.setEmail(request.getEmail());
        seller.setPassword(passwordEncoder.encode(request.getPassword()));

        sellerRepository.save(seller);
        return ResponseEntity.ok("Seller registered successfully.");
    }

    // @PostMapping("/login")
    // public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {

    //     Authentication authentication = authenticationManager.authenticate(
    //             new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

    //     String token = jwtUtil.generateToken(loginRequest.getEmail());
    //     return ResponseEntity.ok(Collections.singletonMap("token", token));
    // }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        Seller seller = sellerRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (!passwordEncoder.matches(request.getPassword(), seller.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        String token = jwtUtil.generateToken(seller.getEmail());

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("name", seller.getName());
        response.put("email", seller.getEmail());
        response.put("role", "seller");

        return ResponseEntity.ok(response);
    }

    @Autowired
    public SellerAuthController(AuthenticationManager authenticationManager) {
        this.authenticationManager = authenticationManager;
    }

}
