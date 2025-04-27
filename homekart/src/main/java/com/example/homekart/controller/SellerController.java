package com.example.homekart.controller;

import com.example.homekart.entity.Seller;
import com.example.homekart.repository.SellerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@CrossOrigin(origins = "http://localhost:3000") // allow your React app
@RestController
@RequestMapping("/api/sellers")
public class SellerController {

    @Autowired
    private SellerRepository sellerRepository;

    @PostMapping
    public Seller createSeller(@RequestBody Seller seller) {
        return sellerRepository.save(seller);
    }

    @GetMapping
    public List<Seller> getAll() {
        return sellerRepository.findAll();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Seller> updateSeller(@PathVariable Long id, @RequestBody Seller updatedSeller) {
        Seller existingSeller = sellerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Seller not found"));

        existingSeller.setName(updatedSeller.getName());
        existingSeller.setEmail(updatedSeller.getEmail());
        existingSeller.setPassword(updatedSeller.getPassword());

        return ResponseEntity.ok(sellerRepository.save(existingSeller));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSeller(@PathVariable Long id) {
        if (!sellerRepository.existsById(id)) {
            throw new RuntimeException("Seller not found");
        }
        sellerRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/dashboard")
    public String getDashboard() {
        return "Welcome to Seller Dashboard! You are authenticated.";
    }

}
