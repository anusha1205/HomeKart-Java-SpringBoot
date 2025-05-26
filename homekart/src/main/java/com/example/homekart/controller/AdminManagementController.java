package com.example.homekart.controller;

import com.example.homekart.entity.Customer;
import com.example.homekart.entity.Seller;
import com.example.homekart.entity.Product;
import com.example.homekart.repository.CustomerRepository;
import com.example.homekart.repository.SellerRepository;
import com.example.homekart.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/manage")
public class AdminManagementController {

    @Autowired
    private SellerRepository sellerRepository;

    @Autowired
    private CustomerRepository customerRepository;

    // (optional) if you also want product-management:
    @Autowired
    private ProductRepository productRepository;

    // —— Get all sellers —————————————————————————
    @GetMapping("/sellers")
    public ResponseEntity<List<Seller>> getAllSellers() {
        return ResponseEntity.ok(sellerRepository.findAll());
    }

    // —— Delete a seller —————————————————————————
    @DeleteMapping("/sellers/{id}")
    public ResponseEntity<Void> deleteSeller(@PathVariable Long id) {
        if (!sellerRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        sellerRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // —— Get all customers ————————————————————————
    @GetMapping("/customers")
    public ResponseEntity<List<Customer>> getAllCustomers() {
        return ResponseEntity.ok(customerRepository.findAll());
    }

    // —— Delete a customer ———————————————————————
    @DeleteMapping("/customers/{id}")
    public ResponseEntity<Void> deleteCustomer(@PathVariable Long id) {
        if (!customerRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        customerRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // —— (Optional) product list & delete ——————————
    @GetMapping("/products")
    public ResponseEntity<List<Product>> getAllProducts() {
        return ResponseEntity.ok(productRepository.findAll());
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        if (!productRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        productRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
