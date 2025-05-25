// ViewOrders.js
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
      <div style={containerStyle}>
        <h2 style={headingStyle}>📦 Seller Orders</h2>
        {orders.length === 0 ? (
          <p style={emptyStyle}>No orders found.</p>
        ) : (
          <table style={tableStyle}>
            <thead>
              <tr style={headerRowStyle}>
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
                <tr key={o.id} style={rowStyle}>
                  <td style={tdStyle}>{o.id}</td>
                  <td style={tdStyle}>{o.product.name}</td>
                  <td style={tdStyle}>{o.customer.name}</td>
                  <td style={tdStyle}>{o.quantity}</td>
                  <td style={tdStyle}>{new Date(o.orderDate).toLocaleString()}</td>
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

const containerStyle = {
  maxWidth: '900px',
  margin: '40px auto',
  padding: '30px',
  backgroundColor: '#fff',
  borderRadius: '8px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
};

const headingStyle = {
  fontSize: '24px',
  fontWeight: '600',
  marginBottom: '20px',
  color: '#333',
};

const emptyStyle = {
  fontSize: '16px',
  color: '#666',
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
};

const headerRowStyle = {
  backgroundColor: '#f7f7f7',
};

const thStyle = {
  padding: '12px',
  textAlign: 'left',
  borderBottom: '2px solid #ddd',
  color: '#555',
};

const tdStyle = {
  padding: '12px',
  borderBottom: '1px solid #eee',
  color: '#444',
};

const rowStyle = {
  transition: 'background 0.2s',
};

