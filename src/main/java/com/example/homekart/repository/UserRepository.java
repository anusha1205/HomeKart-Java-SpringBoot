package com.example.homekart.repository;

import org.springframework.data.jpa.repository.JpaRepository;
// 👇 REMOVE this wrong import
// import org.apache.catalina.User;

import com.example.homekart.entity.User; // ✅ This should be YOUR entity

public interface UserRepository extends JpaRepository<User, Long> {
    // your custom queries here if any
}
