import React, { useEffect, useState } from 'react';
import axios from '../../api/axiosInstance';
import Navbar from '../../components/Navbar';
import { toast } from 'react-toastify';

export default function DeliveryOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get('/delivery/orders');
      setOrders(res.data);
    } catch (err) {
      console.error(err);
      toast.error('Cannot load orders');
    }
  };

  const changeStatus = async (orderId, newStatus) => {
    try {
      await axios.put(`/delivery/orders/${orderId}/status`, null, {
        params: { status: newStatus }
      });
      toast.success('Status updated');
      fetchOrders();
    } catch {
      toast.error('Update failed');
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ padding: '2rem' }}>
        <h2>🚚 My Delivery Orders</h2>
        {orders.length === 0 ? (
          <p>No orders assigned.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                {['Order ID','Product','Customer','Qty','Date','Current Status','Actions'].map(h => (
                  <th key={h} style={th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o.id}>
                  <td style={td}>{o.id}</td>
                  <td style={td}>{o.product.name}</td>
                  <td style={td}>{o.customer.name}</td>
                  <td style={td}>{o.quantity}</td>
                  <td style={td}>{new Date(o.orderDate).toLocaleString()}</td>
                  <td style={td}>{o.deliveryStatus || 'Pending'}</td>
                  <td style={td}>
                    {o.deliveryStatus !== 'Shipped' && (
                      <button onClick={() => changeStatus(o.id, 'Shipped')} style={btn}>
                        Mark Shipped
                      </button>
                    )}
                    {o.deliveryStatus === 'Shipped' && (
                      <button onClick={() => changeStatus(o.id, 'Delivered')} style={btn}>
                        Mark Delivered
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

const th = { borderBottom: '2px solid #ccc', padding: '0.5rem', textAlign: 'left' };
const td = { borderBottom: '1px solid #eee', padding: '0.5rem' };
const btn = {
  marginRight: '0.5rem',
  padding: '4px 8px',
  cursor: 'pointer',
  border: 'none',
  borderRadius: '4px',
  background: '#007bff',
  color: 'white'
};
