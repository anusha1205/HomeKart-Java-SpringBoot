import React, { useEffect, useState } from 'react';
import axios from '../../api/axiosInstance';
import Navbar from '../../components/Navbar';

export default function SellerOrderHistory() {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetchDeliveredOrders();
    }, []);

    async function fetchDeliveredOrders() {
        try {
            const { data } = await axios.get('/api/seller/orders');
            const deliveredOrders = data.filter(order => order.delivery_status === 'DELIVERED');
            setOrders(deliveredOrders);
        } catch (err) {
            console.error('Failed to fetch order history:', err);
        }
    }

    return (
        <>
            <Navbar />
            <div style={{ padding: '24px' }}>
                <h2 style={{ marginBottom: '16px' }}>Order History (Delivered)</h2>
                {orders.length === 0 ? (
                    <p>No delivered orders yet.</p>
                ) : (
                    <ul>
                        {orders.map(order => (
                            <li key={order.id} style={{ marginBottom: '12px' }}>
                                <strong>Product:</strong> {order.product.name} <br />
                                <strong>Customer:</strong> {order.customer.name} <br />
                                <strong>Qty:</strong> {order.quantity} <br />
                                <strong>Delivered on:</strong> {new Date(order.deliveryDate).toLocaleDateString()}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </>

    );
}
