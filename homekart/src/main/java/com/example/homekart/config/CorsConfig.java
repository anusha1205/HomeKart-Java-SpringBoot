package com.example.homekart.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**") // allow all /api/ routes
                        .allowedOrigins("http://localhost:3000") // allow frontend
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // allow these methods
                        .allowedHeaders("*") // allow all headers
                        .allowCredentials(true); // important if using cookies or Authorization header
            }
        };
    }
}
