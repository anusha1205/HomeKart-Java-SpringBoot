import React, { useEffect, useState } from 'react';
import axios from '../../api/axiosInstance';
import Navbar from '../../components/Navbar';
import { toast } from 'react-toastify';

export default function DeliveryHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get('/delivery/orders/history');
        setHistory(res.data);
      } catch (err) {
        console.error(err);
        toast.error('Could not load delivery history');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <>
      <Navbar />
      <div style={containerStyle}>
        <h2 style={headingStyle}>📦 Delivered Orders</h2>

        {loading ? (
          <p style={loadingStyle}>Loading…</p>
        ) : history.length === 0 ? (
          <p style={emptyStyle}>No delivered orders yet.</p>
        ) : (
          <div style={listStyle}>
            {history.map(o => (
              <div key={o.id} style={cardStyle}>
                <p style={productNameStyle}>
                  <strong>{o.product.name}</strong> (Qty: {o.quantity})
                </p>
                <p style={dateStyle}>
                  Delivered on: {new Date(o.orderDate).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

const containerStyle = {
  maxWidth: '800px',
  margin: '40px auto',
  padding: '20px',
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

const loadingStyle = {
  fontSize: '16px',
  color: '#555',
  textAlign: 'center',
};

const emptyStyle = {
  fontSize: '16px',
  color: '#777',
  textAlign: 'center',
};

const listStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '15px',
};

const cardStyle = {
  backgroundColor: '#fafafa',
  borderRadius: '6px',
  padding: '15px',
  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  transition: 'box-shadow 0.2s',
};

const productNameStyle = {
  fontSize: '18px',
  margin: '0 0 8px',
  color: '#222',
};

const dateStyle = {
  fontSize: '14px',
  color: '#555',
  margin: 0,
};
