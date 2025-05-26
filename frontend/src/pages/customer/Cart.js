import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../../api/axiosInstance';
import Navbar from '../../components/Navbar';
import Modal from 'react-modal';
import { toast } from 'react-toastify';

Modal.setAppElement('#root');

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [orderData, setOrderData] = useState({
    item: null,
    address: '',
    phone: '',
    paymentMethod: 'CREDIT_CARD'
  });
  const navigate = useNavigate();

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const res = await axios.get('/customer/cart');
      setCartItems(res.data.sort((a, b) => a.id - b.id));
    } catch {
      toast.error('Failed to load cart');
    }
  };

  const changeQty = async (item, delta) => {
    const newQty = Math.max(1, item.quantity + delta);
    try {
      await axios.put(`/customer/cart/${item.id}`, null, { params: { quantity: newQty } });
      setCartItems(list =>
        list.map(i => i.id === item.id ? { ...i, quantity: newQty } : i)
      );
      toast.success('Quantity updated');
    } catch {
      toast.error('Could not update quantity');
    }
  };

  const removeItem = async (id) => {
    try {
      await axios.delete(`/customer/cart/${id}`);
      setCartItems(list => list.filter(i => i.id !== id));
      toast.info('Item removed');
    } catch {
      toast.error('Failed to remove item');
    }
  };

  const openOrderModal = (item) => {
    setOrderData({ item, address: '', phone: '', paymentMethod: 'CREDIT_CARD' });
    setShowModal(true);
  };

  const submitOrder = async () => {
    const { item, address, phone, paymentMethod } = orderData;
    if (!address.trim() || !phone.trim()) {
      return toast.info('Address and phone are required.');
    }
    try {
      await axios.post(
        '/customer/orders/place',
        null,
        {
          params: {
            productId: item.product.id,
            quantity: item.quantity,
            address,
            phone,
            paymentMethod
          }
        }
      );
      await axios.delete(`/customer/cart/${item.id}`);
      setCartItems(list => list.filter(i => i.id !== item.id));
      toast.success('Order placed!');
      setShowModal(false);
      navigate('/customer/orders');
    } catch {
      toast.error('Order failed');
    }
  };

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <h2 style={styles.heading}>🛒 My Cart</h2>
        <Link to="/customer/orders" style={styles.historyLink}>
          View Order History
        </Link>

        {cartItems.length === 0 ? (
          <p style={styles.empty}>Your cart is empty.</p>
        ) : cartItems.map(item => (
          <div key={item.id} style={styles.card}>
            <p style={styles.productName}>{item.product.name}</p>
            <p style={styles.price}>₹{item.product.price.toFixed(2)}</p>
            <div style={styles.qtyControls}>
              <button
                onClick={() => changeQty(item, -1)}
                style={styles.qtyBtn}
                disabled={item.quantity <= 1}
              >
                −
              </button>
              <span style={styles.qty}>{item.quantity}</span>
              <button
                onClick={() => changeQty(item, 1)}
                style={styles.qtyBtn}
              >
                +
              </button>
            </div>
            <div style={styles.actions}>
              <button
                onClick={() => openOrderModal(item)}
                style={styles.orderBtn}
              >
                Order Now
              </button>
              <button
                onClick={() => removeItem(item.id)}
                style={styles.removeBtn}
              >
                Remove
              </button>
            </div>
          </div>
        ))}

        <Modal
          isOpen={showModal}
          onRequestClose={() => setShowModal(false)}
          contentLabel="Place Order"
          style={{
            overlay: {
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(2px)',
              zIndex: 1000,
            },
            content: {
              maxWidth: '460px',
              margin: 'auto',
              padding: '28px 30px',
              // maxWidth: '90vw',
              overflowX: 'hidden',

              borderRadius: '14px',
              background: '#fff',
              border: 'none',
              boxShadow: '0 12px 32px rgba(0,0,0,0.25)',
              // fontFamily: `'Segoe UI', sans-serif`,
              display: 'flex',
              flexDirection: 'column',
              animation: 'fadeIn 0.3s ease-in-out'
            }
          }}
        >
          <h3 style={{ ...styles.modalHeading, fontSize: '20px', fontWeight: '600', textAlign: 'center' }}>
            Delivery & Payment
          </h3>

          <textarea
            placeholder="Enter Delivery Address"
            value={orderData.address}
            onChange={e => setOrderData(d => ({ ...d, address: e.target.value }))}
            style={{ ...styles.input, height: '90px' }}
          />

          <input
            type="text"
            placeholder="Enter your Phone Number"
            value={orderData.phone}
            onChange={e => setOrderData(d => ({ ...d, phone: e.target.value }))}
            style={styles.input}
          />

          <select
            value={orderData.paymentMethod}
            
            onChange={e => setOrderData(d => ({ ...d, paymentMethod: e.target.value }))}
            style={{ ...styles.input, cursor: 'pointer' }}
          >
            <option value="CREDIT_CARD">Credit Card</option>
            <option value="CASH_ON_DELIVERY">Cash on Delivery</option>
            <option value="UPI">UPI</option>
          </select>

          <div style={styles.modalActions}>
            <button onClick={() => setShowModal(false)} style={styles.cancelBtn} className="modal-cancel-btn">
              Cancel
            </button>
            <button onClick={submitOrder} style={styles.confirmBtn} className="modal-confirm-btn">
              Confirm
            </button>
          </div>

          <style>
            {`
      .modal-confirm-btn:hover {
        background-color: #218838 !important;
      }
      .modal-cancel-btn:hover {
        background-color: #b5b5b5 !important;
      }
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `}
          </style>
        </Modal>

      </div>
    </>
  );
}

const actionBtn = {
  // flex: 1,
  padding: '10px',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  fontSize: '14px',
};

const styles = {
  container: {
    maxWidth: '75%',
    margin: '40px auto',
    padding: '20px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
  },
  heading: {
    fontSize: '24px',
    fontWeight: '600',
    marginBottom: '10px',
    color: '#333'
  },
  historyLink: {
    display: 'inline-block',
    marginBottom: '20px',
    color: '#007bff',
    textDecoration: 'none'
  },
  empty: {
    fontSize: '16px',
    color: '#777',
    textAlign: 'center'
  },
  card: {
    backgroundColor: '#f9f9f9',
    padding: '16px',
    // width: '50%'
    borderRadius: '6px',
    marginBottom: '16px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
  },
  productName: {
    fontSize: '18px',
    margin: '0 0 6px',
    color: '#222'
  },
  price: {
    fontSize: '16px',
    margin: '0 0 12px',
    color: '#2a9d8f'
  },
  qtyControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '12px'
  },
  qtyBtn: {
    background: '#ddd',
    border: 'none',
    borderRadius: '4px',
    padding: '6px 10px',
    cursor: 'pointer',
    fontSize: '16px'
  },
  qty: {
    fontSize: '16px',
    width: '24px',
    textAlign: 'center'
  },
  actions: {
    display: 'flex',
    gap: '10px'
  },
  orderBtn: {
    ...actionBtn,
    // width: '80%',
    backgroundColor: '#007bff',
    color: '#fff'
  },
  removeBtn: {
    ...actionBtn,
    backgroundColor: '#e60000',
    color: '#fff'
  },
  modalHeading: {
    marginBottom: '16px',
    color: '#333'
  },
  input: {
    // width: '100%',
    padding: '10px',
    marginBottom: '12px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '14px'
  },
  modalActions: {
    textAlign: 'right',
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    marginTop: '20px'
  },
  cancelBtn: {
    ...actionBtn,
    backgroundColor: '#ccc',
    color: '#333'
  },
  confirmBtn: {
    ...actionBtn,
    backgroundColor: '#28a745',
    color: '#fff'
  }
};

const modalStyles = {
  content: {
    maxWidth: '400px',
    margin: 'auto',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
  }
};
