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

    /**
     * 1) Get all orders assigned to this agent (excluding delivered)
     */
    @GetMapping("/orders")
    public ResponseEntity<List<Order>> getMyOrders(Authentication auth) {
        DeliveryAgent agent = agentRepo.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("Agent not found"));
        List<Order> orders = orderRepo.findByDeliveryAgent(agent);
        return ResponseEntity.ok(orders);
    }

    /**
     * 2) Mark an order as SHIPPED or DELIVERED
     */
    @PutMapping("/orders/{orderId}/status")
    public ResponseEntity<String> updateStatus(
            @PathVariable("orderId") Long orderId,
            @RequestParam String status,
            Authentication auth) {

        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        String normalized = status.toUpperCase();
        order.setDeliveryStatus(normalized);
        orderRepo.save(order);
        return ResponseEntity.ok("Status updated to " + normalized);
    }

    /**
     * 3) Delivered-order history
     */
    @GetMapping("/orders/history")
    public ResponseEntity<List<Order>> getHistory(Authentication auth) {
        DeliveryAgent agent = agentRepo.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("Agent not found"));
        // Use uppercase to match stored status
        List<Order> history = orderRepo.findByDeliveryAgentAndDeliveryStatus(agent, "DELIVERED");
        return ResponseEntity.ok(history);
    }

    /**
     * 4) Mark payment status (e.g. PAID)
     */
    @PutMapping("/orders/{orderId}/payment-status")
    public ResponseEntity<String> updatePaymentStatus(
            @PathVariable("orderId") Long orderId,
            @RequestParam String status,
            Authentication auth) {

        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        String normalized = status.toUpperCase();
        order.setPaymentStatus(normalized);
        orderRepo.save(order);
        return ResponseEntity.ok("Payment status updated to " + normalized);
    }
}
