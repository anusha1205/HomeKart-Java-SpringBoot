package com.example.homekart.controller;

import com.example.homekart.entity.Order;
import com.example.homekart.entity.Seller;
import com.example.homekart.repository.OrderRepository;
import com.example.homekart.repository.SellerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/seller/orders")
public class SellerOrderController {

    @Autowired private OrderRepository orderRepo;
    @Autowired private SellerRepository sellerRepo;

    @GetMapping
    public ResponseEntity<List<Order>> getSellerOrders(Authentication auth) {
        String email = auth.getName();
        Seller seller = sellerRepo.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Seller not found"));
        List<Order> orders = orderRepo.findByProduct_Seller_Id(seller.getId());
        return ResponseEntity.ok(orders);
    }
}
