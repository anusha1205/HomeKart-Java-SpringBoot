import React, { useEffect, useState } from 'react';
import axios from '../../api/axiosInstance';
import Navbar from '../../components/Navbar';
function Orders() {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await axios.get('/customer/orders');
            setOrders(res.data);
        } catch (err) {
            console.error('Error fetching orders:', err);
        }
    };

    return (
        <><Navbar></Navbar><div style={{ padding: '2rem' }}>
            <h2>📦 My Orders</h2>
            {orders.length === 0 ? (
                <p>No orders placed yet.</p>
            ) : (
                orders.map(order => (
                    <div key={order.id} style={cardStyle}>
                        <p><strong>{order.product.name}</strong></p>
                        <p>Qty: {order.quantity}</p>
                        <p>Total: ₹{order.quantity * order.product.price}</p>
                        <p>Status: <strong>{order.status}</strong></p>
                        <p>Ordered On: {new Date(order.orderDate).toLocaleDateString()}</p>
                    </div>
 
                ))
            )}
        </div></>
    );
}

const cardStyle = {
    border: '1px solid #ccc',
    padding: '1rem',
    borderRadius: '8px',
    marginBottom: '1rem',
    backgroundColor: '#e8f5e9'
};

export default Orders;
