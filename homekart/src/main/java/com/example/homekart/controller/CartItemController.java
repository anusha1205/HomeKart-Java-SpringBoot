package com.example.homekart.controller;

import com.example.homekart.entity.CartItem;
import com.example.homekart.entity.Customer;
import com.example.homekart.entity.Product;
import com.example.homekart.repository.CartItemRepository;
import com.example.homekart.repository.CustomerRepository;
import com.example.homekart.repository.ProductRepository;

import org.springframework.beans.factory.annotation.Autowired;
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

    @PostMapping("/add")
    public ResponseEntity<?> addToCart(@RequestParam Long productId, @RequestParam int quantity,
            Authentication authentication) {
        String email = authentication.getName();
        Customer customer = customerRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        CartItem existingItem = cartItemRepo.findByCustomerIdAndProductId(customer.getId(), product.getId())
                .orElse(null);

        if (existingItem != null) {
            existingItem.setQuantity(existingItem.getQuantity() + quantity);
            cartItemRepo.save(existingItem);
        } else {
            CartItem newItem = new CartItem();
            newItem.setCustomer(customer);
            newItem.setProduct(product);
            newItem.setQuantity(quantity);
            cartItemRepo.save(newItem);
        }

        return ResponseEntity.ok("Item added to cart!");
    }

    @GetMapping
    public ResponseEntity<List<CartItem>> getCustomerCart(Authentication authentication) {
        String email = authentication.getName();
        Customer customer = customerRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        List<CartItem> cartItems = cartItemRepo.findByCustomerId(customer.getId());
        return ResponseEntity.ok(cartItems);
    }

    @DeleteMapping("/{itemId}")
    public ResponseEntity<String> removeCartItem(@PathVariable Long itemId, Authentication authentication) {
        cartItemRepo.deleteById(itemId);
        return ResponseEntity.ok("Cart item removed");
    }
}
