package com.example.homekart.controller;

import com.example.homekart.entity.Customer;
import com.example.homekart.entity.Product;
import com.example.homekart.entity.Seller;
import com.example.homekart.repository.CustomerRepository;
import com.example.homekart.repository.ProductRepository;
import com.example.homekart.repository.SellerRepository;
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

    @Autowired
    private ProductRepository productRepository;

    // ✅ View all sellers
    @GetMapping("/sellers")
    public ResponseEntity<List<Seller>> getAllSellers() {
        return ResponseEntity.ok(sellerRepository.findAll());
    }

    // ✅ View all customers
    @GetMapping("/customers")
    public ResponseEntity<List<Customer>> getAllCustomers() {
        return ResponseEntity.ok(customerRepository.findAll());
    }

    // ✅ View all products
    @GetMapping("/products")
    public ResponseEntity<List<Product>> getAllProducts() {
        return ResponseEntity.ok(productRepository.findAll());
    }

    // ✅ Delete seller
    @DeleteMapping("/seller/{id}")
    public ResponseEntity<String> deleteSeller(@PathVariable Long id) {
        sellerRepository.deleteById(id);
        return ResponseEntity.ok("Seller deleted successfully");
    }

    // ✅ Delete customer
    @DeleteMapping("/customer/{id}")
    public ResponseEntity<String> deleteCustomer(@PathVariable Long id) {
        customerRepository.deleteById(id);
        return ResponseEntity.ok("Customer deleted successfully");
    }

    // ✅ Delete product
    @DeleteMapping("/product/{id}")
    public ResponseEntity<String> deleteProduct(@PathVariable Long id) {
        productRepository.deleteById(id);
        return ResponseEntity.ok("Product deleted successfully");
    }
}
