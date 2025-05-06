package com.example.homekart.controller;

import com.example.homekart.dto.ProductDTO;
import com.example.homekart.dto.ProductResponseDTO;
import com.example.homekart.entity.Product;
import com.example.homekart.entity.Seller;
import com.example.homekart.repository.ProductRepository;
import com.example.homekart.repository.SellerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/seller/products") // protected route
public class ProductController {

    @Autowired
    private ProductRepository productRepo;

    @Autowired
    private SellerRepository sellerRepo;
 

    @GetMapping
    public ResponseEntity<List<ProductResponseDTO>> getMyProducts(Authentication authentication) {
        String email = authentication.getName(); // JWT se seller email nikala
        Seller seller = sellerRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Seller not found"));

        List<Product> products = productRepo.findBySellerId(seller.getId());

        List<ProductResponseDTO> response = products.stream().map(product -> {
            ProductResponseDTO dto = new ProductResponseDTO();
            dto.setId(product.getId());
            dto.setName(product.getName());
            dto.setDescription(product.getDescription());
            dto.setPrice(product.getPrice());
            dto.setCategory(product.getCategory());
            dto.setImageUrl(product.getImageUrl());
            dto.setStockQuantity(product.getStockQuantity());
            dto.setIsAvailable(product.getIsAvailable());
            dto.setSellerName(seller.getName()); // only name of seller
            return dto;
        }).toList();

        return ResponseEntity.ok(response);
    }

    // GET single product by ID (only if it belongs to the logged-in seller)
    @GetMapping("/{productId}")
    public ResponseEntity<?> getProductById(@PathVariable Long productId, Authentication authentication) {
        String email = authentication.getName(); // Get seller email from JWT
        Seller seller = sellerRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Seller not found"));

        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (!product.getSeller().getId().equals(seller.getId())) {
            return ResponseEntity.status(403).body("Unauthorized to access this product");
        }

        return ResponseEntity.ok(product);
    }

    // CREATE
    @PostMapping
    public ResponseEntity<Product> createProduct(@RequestBody ProductDTO dto, Authentication authentication) {
        String email = authentication.getName();
        Seller seller = sellerRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Seller not found"));

        Product product = new Product();
        product.setName(dto.getName());
        product.setDescription(dto.getDescription());
        product.setPrice(dto.getPrice());
        product.setCategory(dto.getCategory());
        product.setImageUrl(dto.getImageUrl());
        product.setStockQuantity(dto.getStockQuantity());
        product.setIsAvailable(dto.getIsAvailable());
        product.setSeller(seller);

        return ResponseEntity.ok(productRepo.save(product));
    }

    // UPDATE
    @PutMapping("/{productId}")
    public ResponseEntity<Product> updateProduct(
            @PathVariable Long productId,
            @RequestBody ProductDTO dto,
            Authentication authentication) {

        String email = authentication.getName();
        Seller seller = sellerRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Seller not found"));

        // String email = authentication.getName();


        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (!product.getSeller().getId().equals(seller.getId())) {
            return ResponseEntity.status(403).build();
        }

        product.setName(dto.getName());
        product.setDescription(dto.getDescription());
        product.setPrice(dto.getPrice());
        product.setCategory(dto.getCategory());
        product.setImageUrl(dto.getImageUrl());
        product.setStockQuantity(dto.getStockQuantity());
        product.setIsAvailable(dto.getIsAvailable());

        return ResponseEntity.ok(productRepo.save(product));
    }

    // DELETE
    @DeleteMapping("/{productId}")
    public ResponseEntity<String> deleteProduct(@PathVariable Long productId, Authentication authentication) {
        String email = authentication.getName();
        Seller seller = sellerRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Seller not found"));

        Product product = productRepo.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // if (!product.getSeller().getId().equals(seller.getId())) {
        // return ResponseEntity.status(403).body("Unauthorized");
        // }

        productRepo.deleteById(productId);
        return ResponseEntity.ok("Product deleted");
    }

}
