package com.example.homekart.controller;

import com.example.homekart.entity.DeliveryAgent;
import com.example.homekart.entity.Order;
import com.example.homekart.repository.DeliveryAgentRepository;
import com.example.homekart.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/delivery")
public class DeliveryAgentController {

    @Autowired
    private OrderRepository orderRepo;

    @Autowired
    private DeliveryAgentRepository agentRepo;

    // 1) Active orders (not yet delivered)
    @GetMapping("/orders")
    public ResponseEntity<List<Order>> getMyOrders(Authentication auth) {
        DeliveryAgent agent = agentRepo.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("Agent not found"));
        List<Order> orders = orderRepo.findByDeliveryAgentAndDeliveryStatusNot(agent, "DELIVERED");
        return ResponseEntity.ok(orders);
    }

    // 2) Mark an order shipped or delivered
    @PutMapping("/orders/{orderId}/status")
    public ResponseEntity<String> updateStatus(
            @PathVariable Long orderId,
            @RequestParam String status,
            Authentication auth) {

        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        // you could verify order.getDeliveryAgent().getId() == agent.getId() here
        String normalized = status.toUpperCase();
        order.setDeliveryStatus(normalized);
        orderRepo.save(order);
        return ResponseEntity.ok("Status updated to " + normalized);
    }

    // 3) Delivered‐order history
    @GetMapping("/orders/history")
    public ResponseEntity<List<Order>> getHistory(Authentication auth) {
        DeliveryAgent agent = agentRepo.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("Agent not found"));
        List<Order> history = orderRepo.findByDeliveryAgentAndDeliveryStatus(agent, "Delivered");
        return ResponseEntity.ok(history);
    }
}
