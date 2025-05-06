package com.example.homekart.repository;

import com.example.homekart.entity.DeliveryAgent;
import com.example.homekart.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.sql.Date;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByCustomerId(Long customerId);
    List<Order> findByProductId(Long productId);
    List<Order> findByOrderDateBetween(Date startDate, Date endDate);
    // List<Order> findByDeliveryAgentId(Long deliveryAgentId);
    List<Order> findByDeliveryAgent(DeliveryAgent deliveryAgent);
    List<Order> findByProduct_Seller_Id(Long sellerId);


    // active (not yet delivered) orders
    List<Order> findByDeliveryAgentAndDeliveryStatusNot(DeliveryAgent agent, String status);
    // history (only delivered)
    List<Order> findByDeliveryAgentAndDeliveryStatus(DeliveryAgent agent, String status);
}
