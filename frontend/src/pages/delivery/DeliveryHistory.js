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
      <div style={{ padding: '2rem' }}>
        <h2>📦 Delivered Orders</h2>

        {loading ? (
          <p>Loading…</p>
        ) : history.length === 0 ? (
          <p>No delivered orders yet.</p>
        ) : (
          history.map(o => (
            <div key={o.id} style={cardStyle}>
              <p>
                <strong>{o.product.name}</strong> (Qty: {o.quantity})
              </p>
              <p>
                Delivered on: {new Date(o.orderDate).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </>
  );
}

const cardStyle = {
  border: '1px solid #ccc',
  padding: '1rem',
  borderRadius: '8px',
  marginBottom: '1rem'
};
