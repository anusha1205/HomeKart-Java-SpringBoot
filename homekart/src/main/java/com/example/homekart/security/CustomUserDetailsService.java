package com.example.homekart.security;

import com.example.homekart.entity.Admin;
import com.example.homekart.entity.Customer;
import com.example.homekart.entity.DeliveryAgent;
import com.example.homekart.entity.Seller;
import com.example.homekart.repository.AdminRepository;
import com.example.homekart.repository.CustomerRepository;
import com.example.homekart.repository.DeliveryAgentRepository;
import com.example.homekart.repository.SellerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private SellerRepository sellerRepo;

    @Autowired
    private CustomerRepository customerRepo;

    @Autowired
    private AdminRepository adminRepo;

    @Autowired
    private DeliveryAgentRepository deliveryAgentRepo;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Seller seller = sellerRepo.findByEmail(email).orElse(null);
        if (seller != null) {
            return new User(seller.getEmail(), seller.getPassword(), Collections.emptyList());
        }
 
        Customer customer = customerRepo.findByEmail(email).orElse(null);
        if (customer != null) {
            return new User(customer.getEmail(), customer.getPassword(), Collections.emptyList());
        }
 
        Admin admin = adminRepo.findByEmail(email).orElse(null);
        if (admin != null) {
            return new User(admin.getEmail(), admin.getPassword(), Collections.emptyList());
        }
 
        DeliveryAgent deliveryAgent = deliveryAgentRepo.findByEmail(email).orElse(null);
        if (deliveryAgent != null) {
            return new User(deliveryAgent.getEmail(), deliveryAgent.getPassword(), Collections.emptyList());
        }
        
        throw new UsernameNotFoundException("User not found with email: " + email);
    }
}
