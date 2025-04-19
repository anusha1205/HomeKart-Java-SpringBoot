package com.example.homekart.controller;

import com.example.homekart.entity.Seller;
import com.example.homekart.repository.SellerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/api/sellers")
public class SellerController {

    @Autowired
    private SellerRepository sellerRepo;

    @PostMapping
    public Seller createSeller(@RequestBody Seller seller) {
        return sellerRepo.save(seller);
    }

    @GetMapping
    public List<Seller> getAll() {
        return sellerRepo.findAll();
    }
}
