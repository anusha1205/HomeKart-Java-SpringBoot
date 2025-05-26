// src/main/java/com/example/homekart/controller/AdminAnalyticsController.java
package com.example.homekart.controller;

import com.example.homekart.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/analytics")
public class AdminAnalyticsController {

    @Autowired private SellerRepository sellerRepo;
    @Autowired private CustomerRepository customerRepo;
    @Autowired private ProductRepository productRepo;
    @Autowired private OrderRepository orderRepo;  

    @GetMapping("/counts")
    public Map<String, Long> counts() {
        return Map.of(
            "totalSellers", sellerRepo.count(),
            "totalCustomers", customerRepo.count(),
            "totalProducts", productRepo.count(),
            "totalOrders",   orderRepo.count()
        );
    }
}
