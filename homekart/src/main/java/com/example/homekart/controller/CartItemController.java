package com.example.homekart.controller;

import com.example.homekart.entity.CartItem;
import com.example.homekart.entity.Customer;
import com.example.homekart.repository.CartItemRepository;
import com.example.homekart.repository.CustomerRepository;
import com.example.homekart.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customer/cart")
public class CartItemController {

    @Autowired
    private CartItemRepository cartItemRepo;
    @Autowired
    private CustomerRepository customerRepo;
    @Autowired
    private ProductRepository productRepo;

    @GetMapping
    public ResponseEntity<List<CartItem>> getCustomerCart(Authentication auth) {
        String email = auth.getName();
        Customer customer = customerRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        return ResponseEntity.ok(cartItemRepo.findByCustomerId(customer.getId()));
    }

    @PostMapping("/add")
    public ResponseEntity<String> addToCart(@RequestParam Long productId,
            @RequestParam int quantity,
            Authentication auth) {
        String email = auth.getName();
        Customer customer = customerRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        CartItem existing = cartItemRepo
                .findByCustomerIdAndProductId(customer.getId(), productId)
                .orElse(null);

        if (existing != null) {
            existing.setQuantity(existing.getQuantity() + quantity);
            cartItemRepo.save(existing);
        } else {
            CartItem ci = new CartItem();
            ci.setCustomer(customer);
            ci.setProduct(productRepo.findById(productId)
                    .orElseThrow(() -> new RuntimeException("Product not found")));
            ci.setQuantity(quantity);
            cartItemRepo.save(ci);
        }
        return ResponseEntity.ok("Item added");
    }

    @DeleteMapping("/{itemId}")
    public ResponseEntity<String> removeCartItem(@PathVariable Long itemId,
            Authentication auth) {
        cartItemRepo.deleteById(itemId);
        return ResponseEntity.ok("Cart item removed");
    }

    // ← THIS IS THE FIX: update quantity in place
    @PutMapping("/{itemId}")
    public ResponseEntity<String> updateCartItemQuantity(
            @PathVariable Long itemId,
            @RequestParam int quantity,
            Authentication auth) {

        CartItem cartItem = cartItemRepo.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));
        // optional: check auth matches owner
        if (!cartItem.getCustomer().getEmail().equals(auth.getName())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Not allowed");
        }
        if (quantity < 1) {
            return ResponseEntity.badRequest().body("Quantity must be ≥ 1");
        }

        cartItem.setQuantity(quantity);
        cartItemRepo.save(cartItem);
        return ResponseEntity.ok("Quantity updated");
    }
}
