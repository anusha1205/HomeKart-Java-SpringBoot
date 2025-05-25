import React, { useEffect, useState } from 'react';
import axios from '../../api/axiosInstance';
import Navbar from '../../components/Navbar';
import { toast } from 'react-toastify';
// import './DeliveryOrder.'
export default function DeliveryOrders() {
  const [orders, setOrders] = useState([]);
  const [expanded, setExpanded] = useState({}); // { [orderId]: true }

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get('/delivery/orders');
      setOrders(res.data.filter(o => o.deliveryStatus !== 'DELIVERED'));
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

  const markPaid = async (orderId) => {
    try {
      await axios.put(`/delivery/orders/${orderId}/payment-status`, null, {
        params: { status: 'PAID' }
      });
      toast.success('Payment marked as PAID');
      fetchOrders();
    } catch {
      toast.error('Failed to update payment status');
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
                {[
                  'Order ID',
                  'Product',
                  'Customer',
                  'Qty',
                  'Date',
                  'Current Status',
                  'Actions'
                ].map(h => (
                  <th key={h} style={th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <React.Fragment key={o.id}>
                  <tr>
                    <td style={td}>{o.id}</td>
                    <td style={td}>{o.product.name}</td>
                    <td style={td}>{o.customer.name}</td>
                    <td style={td}>{o.quantity}</td>
                    <td style={td}>{new Date(o.orderDate).toLocaleString()}</td>
                    <td style={td}>{o.deliveryStatus || 'Pending'}</td>
                    <td style={td}>
                      {o.deliveryStatus !== 'SHIPPED' && (
                        <button onClick={() => changeStatus(o.id, 'SHIPPED')} style={btn}>
                          Mark Shipped
                        </button>
                      )}
                      {o.deliveryStatus === 'SHIPPED' && (
                        <button onClick={() => changeStatus(o.id, 'DELIVERED')} style={btn}>
                          Mark Delivered
                        </button>
                      )}
                      <button
                        onClick={() =>
                          setExpanded(exp => ({ ...exp, [o.id]: !exp[o.id] }))
                        }
                        style={{ ...btn, background: '#129990' }}
                      >
                        {expanded[o.id] ? 'Hide Details' : 'Customer Details'}
                      </button>
                    </td>
                  </tr>

                  {expanded[o.id] && (
                    <tr>
                      <td colSpan={7} style={{ ...td, background: '#f9f9f9' }}>
                        <div style={{ padding: '1rem' }}>
                          <p><strong>Name:</strong> {o.customer.name}</p>
                          <p><strong>Address:</strong> {o.deliveryAddress}</p>
                          <p><strong>Phone:</strong> {o.deliveryPhone}</p>
                          <p><strong>Payment Method:</strong> {o.paymentMethod}</p>
                          <p>
                            <strong>Payment Status:</strong> {o.paymentStatus}
                            {o.paymentStatus !== 'PAID' && (
                              <button
                                onClick={() => markPaid(o.id)}
                                style={{ ...btn, marginLeft: '1rem', background: '#28a745' }}
                              >
                                Mark Paid
                              </button>
                            )}
                          </p>

                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

const th = {
  borderBottom: '2px solid #ccc',
  padding: '0.5rem',
  textAlign: 'left',
  backgroundColor: '#f2f2f2',
  fontWeight: '600',
  fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif'
};

const td = {
  borderBottom: '1px solid #eee',
  padding: '0.5rem',
  verticalAlign: 'top',
  fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif'
};

const btn = {
  marginRight: '0.5rem',
  padding: '6px 12px',
  cursor: 'pointer',
  border: 'none',
  borderRadius: '4px',
  backgroundColor: '#007bff',
  color: '#fff',
  fontSize: '0.9rem',
  transition: 'background-color 0.3s ease'
};

// Optional: For additional button variations inside JSX
const infoBtn = {
  ...btn,
  backgroundColor: '#17a2b8'
};

const successBtn = {
  ...btn,
  backgroundColor: '#28a745'
};
