package com.example.homekart.controller;

import com.example.homekart.entity.FavoriteItem;
import com.example.homekart.entity.Customer;
import com.example.homekart.entity.Product;
import com.example.homekart.repository.FavoriteItemRepository;
import com.example.homekart.repository.CustomerRepository;
import com.example.homekart.repository.ProductRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/customer/favorites")
public class FavoriteItemController {

    @Autowired
    private FavoriteItemRepository favoriteItemRepo;

    @Autowired
    private CustomerRepository customerRepo;

    @Autowired
    private ProductRepository productRepo;

    // ✅ 1. Add Product to Favorites
    @PostMapping("/add")
    public ResponseEntity<String> addFavorite(@RequestParam Long productId, Authentication authentication) {
        String email = authentication.getName();
        Customer customer = customerRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // Check if already favorited
        if (favoriteItemRepo.findByCustomerIdAndProductId(customer.getId(), product.getId()).isPresent()) {
            return ResponseEntity.badRequest().body("Product already in favorites!");
        }

        FavoriteItem favorite = new FavoriteItem();
        favorite.setCustomer(customer);
        favorite.setProduct(product);

        favoriteItemRepo.save(favorite);
        return ResponseEntity.ok("Product added to favorites!");
    }

    // ✅ 2. View Favorites
    @GetMapping
    public ResponseEntity<List<FavoriteItem>> getFavorites(Authentication authentication) {
        String email = authentication.getName();
        Customer customer = customerRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        List<FavoriteItem> favorites = favoriteItemRepo.findByCustomerId(customer.getId());
        return ResponseEntity.ok(favorites);
    }

    // ✅ 3. Remove Product from Favorites
    @DeleteMapping("/{favoriteId}")
    public ResponseEntity<String> removeFavorite(@PathVariable Long favoriteId, Authentication authentication) {
        FavoriteItem favoriteItem = favoriteItemRepo.findById(favoriteId)
                .orElseThrow(() -> new RuntimeException("Favorite item not found"));

        favoriteItemRepo.delete(favoriteItem);
        return ResponseEntity.ok("Product removed from favorites!");
    }
}
