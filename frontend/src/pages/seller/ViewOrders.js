import React, { useEffect, useState } from 'react';
import axios from '../../api/axiosInstance';
import Navbar from '../../components/Navbar';
import { toast } from 'react-toastify';

export default function ViewOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get('/seller/orders');
      setOrders(res.data);
    } catch (err) {
      console.error('Error fetching seller orders:', err);
      toast.error('Could not load orders');
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ padding: '2rem' }}>
        <h2>📦 Seller Orders</h2>
        {orders.length === 0 ? (
          <p>No orders found.</p>
        ) : (
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Order ID</th>
                <th style={thStyle}>Product</th>
                <th style={thStyle}>Customer</th>
                <th style={thStyle}>Quantity</th>
                <th style={thStyle}>Date</th>
                <th style={thStyle}>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id}>
                  <td style={tdStyle}>{o.id}</td>
                  <td style={tdStyle}>{o.product.name}</td>
                  <td style={tdStyle}>{o.customer.name}</td>
                  <td style={tdStyle}>{o.quantity}</td>
                  <td style={tdStyle}>
                    {new Date(o.orderDate).toLocaleString()}
                  </td>
                  <td style={tdStyle}>{o.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
};

const thStyle = {
  borderBottom: '2px solid #ddd',
  padding: '0.75rem',
  textAlign: 'left',
};

const tdStyle = {
  borderBottom: '1px solid #eee',
  padding: '0.75rem',
};
