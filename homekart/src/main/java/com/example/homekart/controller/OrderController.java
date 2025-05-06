package com.example.homekart.controller;

import com.example.homekart.entity.Customer;
import com.example.homekart.entity.Order;
import com.example.homekart.entity.Product; 
import com.example.homekart.repository.DeliveryAgentRepository;
import com.example.homekart.entity.DeliveryAgent;
import org.springframework.http.HttpStatus;
import java.util.Random;

import com.example.homekart.repository.DeliveryAgentRepository;
import com.example.homekart.repository.OrderRepository;
import com.example.homekart.repository.ProductRepository;
import com.example.homekart.repository.CustomerRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/customer/orders")
public class OrderController {

    @Autowired
    private OrderRepository orderRepo;

    @Autowired
    private CustomerRepository customerRepo;

    @Autowired
    private ProductRepository productRepo;

    @Autowired
    private DeliveryAgentRepository agentRepo;

    @PostMapping("/place")
    public ResponseEntity<String> placeOrder(
            @RequestParam Long productId,
            @RequestParam int quantity,
            Authentication authentication) {

        String email = authentication.getName();
        Customer customer = customerRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (product.getStockQuantity() < quantity) {
            return ResponseEntity.badRequest().body("Insufficient stock available");
        }

        Order order = new Order();
        order.setCustomer(customer);
        order.setProduct(product);
        order.setQuantity(quantity);
        order.setOrderDate(LocalDateTime.now());
        order.setStatus("PLACED");

        List<DeliveryAgent> agents = agentRepo.findAll();
        if (agents.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body("No delivery agents available");
        }
        DeliveryAgent picked = agents.get(new Random().nextInt(agents.size()));
        order.setDeliveryAgent(picked);

        orderRepo.save(order);

        product.setStockQuantity(product.getStockQuantity() - quantity);
        productRepo.save(product);

        return ResponseEntity.ok("Order placed successfully!");
    }

    @GetMapping
    public ResponseEntity<List<Order>> getCustomerOrders(Authentication authentication) {
        String email = authentication.getName();
        Customer customer = customerRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        List<Order> orders = orderRepo.findByCustomerId(customer.getId());
        return ResponseEntity.ok(orders);
    }
}
