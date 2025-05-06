import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../api/axiosInstance';

function Navbar() {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    if (token && role === 'customer') {
      fetchCartCount();
    }
  }, []);

  const fetchCartCount = async () => {
    try {
      const res = await axios.get('/customer/cart');
      setCartCount(res.data.length);
    } catch (err) {
      console.error('Error fetching cart count:', err);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem 2rem',
      background: '#333',
      color: 'white'
    }}>
      <div>
        <Link to="/" style={{ color: 'white', marginRight: '2rem', textDecoration: 'none', fontSize: '20px', fontWeight: 'bold' }}>
          HomeKart
        </Link>

        {token && role === 'seller' && (
          <>
            <Link to="/seller/dashboard" style={linkStyle}>View Products</Link>
            <Link to="/seller/add" style={linkStyle}>Add Product</Link>
            <Link to="/seller/orders" style={linkStyle}>View Orders</Link>
          </>
        )}

        {token && role === 'customer' && (
          <>
            <Link to="/customer/cart" style={linkStyle}>My Cart 🛒 {cartCount > 0 && <span style={{ color: 'yellow' }}>({cartCount})</span>}</Link>
            <Link to="/customer/favourites" style={linkStyle}>❤️ My Favorites</Link>
            <Link to="/customer/orders" style={linkStyle}>📦 My Orders</Link>
          </>
        )}

        {token && role === 'delivery' && (
          <>
            <Link to="/delivery/orders" style={linkStyle}>Orders</Link>
            <Link to="/delivery/history" style={linkStyle}>Order History</Link>
          </>
        )}
      </div>

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        {!token ? (
          <>
            <Link to="/login" style={linkStyle}>Login</Link>
            <Link to="/signup" style={linkStyle}>Signup</Link>
          </>
        ) : (
          <>
            <Link to="/profile" style={linkStyle}>Profile ({role})</Link>
            <button onClick={handleLogout} style={logoutBtn}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}

const linkStyle = {
  color: 'white',
  marginRight: '1rem',
  textDecoration: 'none'
};

const logoutBtn = {
  background: '#e60000',
  color: 'white',
  border: 'none',
  padding: '5px 10px',
  borderRadius: '5px',
  cursor: 'pointer'
};

export default Navbar;
