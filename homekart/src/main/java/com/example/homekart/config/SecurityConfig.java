package com.example.homekart.config;

import com.example.homekart.security.CustomCustomerDetailsService;
import com.example.homekart.security.CustomUserDetailsService;
import com.example.homekart.security.JwtAuthenticationFilter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.util.List;

@Configuration
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthFilter;

    @Autowired
    private CustomCustomerDetailsService customerDetailsService;

    @Autowired
    private CustomUserDetailsService userDetailsService; // 🔥 for Seller

    @Bean
    public DaoAuthenticationProvider customerAuthenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(customerDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public DaoAuthenticationProvider sellerAuthenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return new ProviderManager(List.of(
                customerAuthenticationProvider(),
                sellerAuthenticationProvider()));
    }

    // @Bean
    // public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    // http
    // .csrf(csrf -> csrf.disable())
    // .cors(cors -> cors.disable()) // ⭐ If not handling CORS separately
    // .authorizeHttpRequests(auth -> auth
    // .requestMatchers(
    // "/api/customer/auth/**",
    // "/api/admin/auth/**",
    // "/api/seller/auth/**",
    // "/api/delivery/auth/**",
    // "/api/public/**",
    // "/api/seller/products",
    // "/api/**",
    // "/",
    // "/home",
    // "/error")
    // .permitAll()
    // .requestMatchers(org.springframework.http.HttpMethod.OPTIONS,
    // "/**").permitAll()

    // .anyRequest().authenticated())
    // .sessionManagement(session ->
    // session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
    // .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

    // return http.build();
    // }
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/api/customer/auth/**",
                                "/api/admin/auth/**",
                                "/api/seller/auth/**",
                                "/api/delivery/auth/**",
                                "/api/public/**",
                                "/",
                                "/home",
                                "/error")
                        .permitAll()
                        .requestMatchers(org.springframework.http.HttpMethod.OPTIONS, "/**").permitAll()
                        .anyRequest().authenticated())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
