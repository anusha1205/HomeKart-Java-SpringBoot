package com.example.homekart.service;

import com.example.homekart.entity.DeliveryAgent;
import com.example.homekart.entity.Order;
import java.util.List;

public interface DeliveryOrderService {
    /** Fetch active (not yet delivered) orders for a given agent */
    List<Order> getAssignedOrders(DeliveryAgent agent);

    /** Update the delivery status (e.g. SHIPPED or DELIVERED) */
    void updateDeliveryStatus(Long orderId, String status);

    /** Update the payment status (e.g. PAID) */
    void markPaymentStatus(Long orderId, String status);
}
