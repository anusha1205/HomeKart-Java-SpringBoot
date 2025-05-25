package com.example.homekart.service;

import com.example.homekart.entity.DeliveryAgent;
import com.example.homekart.entity.Order;
import com.example.homekart.repository.OrderRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class DeliveryOrderServiceImpl implements DeliveryOrderService {

    private final OrderRepository orderRepo;

    public DeliveryOrderServiceImpl(OrderRepository orderRepo) {
        this.orderRepo = orderRepo;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Order> getAssignedOrders(DeliveryAgent agent) {
        // reuse your repository method to exclude already delivered
        return orderRepo.findByDeliveryAgentAndDeliveryStatusNot(agent, "DELIVERED");
    }

    @Override
    @Transactional
    public void updateDeliveryStatus(Long orderId, String status) {
        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));
        order.setDeliveryStatus(status.toUpperCase());
        orderRepo.save(order);
    }

    @Override
    @Transactional
    public void markPaymentStatus(Long orderId, String status) {
        Order order = orderRepo.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));
        order.setPaymentStatus(status.toUpperCase());
        orderRepo.save(order);
    }
}
