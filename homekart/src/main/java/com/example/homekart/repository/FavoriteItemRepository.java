package com.example.homekart.repository;

import com.example.homekart.entity.FavoriteItem;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface FavoriteItemRepository extends JpaRepository<FavoriteItem, Long> {
    List<FavoriteItem> findByCustomerId(Long customerId);

    Optional<FavoriteItem> findByCustomerIdAndProductId(Long customerId, Long productId);
}
