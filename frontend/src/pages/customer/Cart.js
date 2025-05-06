import React, { useEffect, useState } from 'react';
import axios from '../../api/axiosInstance';
import Navbar from '../../components/Navbar';
import { toast } from 'react-toastify';

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [quantities, setQuantities] = useState({});

  // 1) Initial load
  useEffect(() => {
    fetchCartItems();
  }, []);

  // 2) Fetch and sort once, then set both items and quantities
  const fetchCartItems = async () => {
    try {
      const res = await axios.get('/customer/cart');
      const items = res.data.sort((a, b) => a.id - b.id);
      setCartItems(items);

      const q = {};
      items.forEach(item => (q[item.id] = item.quantity));
      setQuantities(q);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load cart');
    }
  };

  // 3) Remove an item
  const handleDelete = async (itemId) => {
    try {
      await axios.delete(`/customer/cart/${itemId}`);
      toast.info('Item removed');
      fetchCartItems();
    } catch {
      toast.error('Failed to remove item');
    }
  };

  // 4) Place order for one item (sync quantity first)
  const handleOrder = async (item) => {
    const qty = quantities[item.id] || item.quantity;
    try {
      // sync quantity
      await axios.delete(`/customer/cart/${item.id}`);
      await axios.post('/customer/cart/add', null, {
        params: { productId: item.product.id, quantity: qty }
      });
      // place order
      await axios.post('/customer/orders/place', null, {
        params: { productId: item.product.id, quantity: qty }
      });
      toast.success('Order placed!');
      fetchCartItems();
    } catch {
      toast.error('Order failed');
    }
  };

  const handleQuantityChange = async (itemId, delta) => {
    // 1. compute the new quantity
    const currentQty = quantities[itemId] || 1;
    const newQty = Math.max(1, currentQty + delta);

    // 2. find the full item so we can grab its productId
    const item = cartItems.find(i => i.id === itemId);
    if (!item) return;

    try {
      // 3. call your updateQuantity endpoint (no delete/re-add!)
      await axios.put(
        '/customer/cart/updateQuantity',
        null,
        { params: { productId: item.product.id, quantity: newQty } }
      );


      // 4. update local state for immediate UI feedback
      setQuantities(prev => ({ ...prev, [itemId]: newQty }));
      setCartItems(prev =>
        prev.map(i =>
          i.id === itemId
            ? { ...i, quantity: newQty }
            : i
        )
      );

      toast.success('Quantity updated');
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error('Could not update quantity');
    }
  };


  const qtyBtn = {
    background: '#ddd',
    padding: '4px 10px',
    fontWeight: 'bold',
    border: '1px solid #999',
    borderRadius: '4px',
    cursor: 'pointer'
  };
  const cardStyle = {
    border: '1px solid #ccc',
    padding: '1rem',
    borderRadius: '8px',
    marginBottom: '1rem',
    backgroundColor: '#f9f9f9'
  };
  const deleteBtn = {
    background: '#e60000',
    color: 'white',
    padding: '6px 10px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginLeft: '1rem'
  };
  const orderBtn = {
    background: '#007bff',
    color: 'white',
    padding: '6px 12px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  };

  return (
    <>
      <Navbar />
      <div style={{ padding: '2rem' }}>
        <h2>🛒 My Cart</h2>
        {cartItems.length === 0 ? (
          <p>No items in cart.</p>
        ) : (
          cartItems.map(item => (
            <div key={item.id} style={cardStyle}>
              <p><strong>{item.product.name}</strong></p>
              <p>Price: ₹{item.product.price}</p>

              {/* quantity controls */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button
                  onClick={() => handleQuantityChange(item.id, -1)}
                  style={qtyBtn}
                  disabled={quantities[item.id] <= 1}
                >−</button>
                <span>{quantities[item.id]}</span>
                <button
                  onClick={() => handleQuantityChange(item.id, 1)}
                  style={qtyBtn}
                >+</button>
              </div>

              {/* order & remove */}
              <div style={{ marginTop: '1rem' }}>
                <button onClick={() => handleOrder(item)} style={orderBtn}>
                  Order Now
                </button>
                <button onClick={() => handleDelete(item.id)} style={deleteBtn}>
                  Remove
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}

export default Cart;
