import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../api/axiosInstance';

function Navbar() {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const name = localStorage.getItem('name');
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

  const hoverLink = e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
  const leaveLink = e => e.currentTarget.style.background = 'transparent';

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0.75rem 2rem',
      background: '#1E1E2F',
      color: '#E0E0E0',
      boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      {/* Left: Brand + Links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <Link
          to="/"
          style={{
            color: '#F8F8F2',
            fontSize: '1.5rem',
            fontWeight: '700',
            textDecoration: 'none',
            padding: '4px 8px'
          }}
          onMouseEnter={hoverLink}
          onMouseLeave={leaveLink}
        >
          HomeKart
        </Link>

        {token && role === 'seller' && (
          <>
            <Link to="/seller/dashboard" style={linkStyle} onMouseEnter={hoverLink} onMouseLeave={leaveLink}>
              View Products
            </Link>
            <Link to="/seller/add" style={linkStyle} onMouseEnter={hoverLink} onMouseLeave={leaveLink}>
              Add Product
            </Link>
            <Link to="/seller/orders" style={linkStyle} onMouseEnter={hoverLink} onMouseLeave={leaveLink}>
              Orders
            </Link> 
          </>
        )}
       
        {role === 'admin' && (
          <>
            <Link style={linkStyle} onMouseEnter={hoverLink} onMouseLeave={leaveLink} to="/admin/manage">Manage Users</Link>
            <Link style={linkStyle} onMouseEnter={hoverLink} onMouseLeave={leaveLink} to="/admin/analytics">Analytics</Link>
          </>
        )}

        {token && role === 'customer' && (
          <>
            <Link to="/customer/cart" style={linkStyle} onMouseEnter={hoverLink} onMouseLeave={leaveLink}>
              🛒 My Cart
              {cartCount > 0 && (
                <span style={{
                  marginLeft: '4px',
                  background: '#FF5555',
                  borderRadius: '50%',
                  padding: '2px 6px',
                  fontSize: '0.8rem',
                  color: '#FFF'
                }}>{cartCount}</span>
              )}
            </Link>
            <Link to="/customer/favourites" style={linkStyle} onMouseEnter={hoverLink} onMouseLeave={leaveLink}>
              ❤️ Favorites
            </Link>
            <Link to="/customer/orders" style={linkStyle} onMouseEnter={hoverLink} onMouseLeave={leaveLink}>
              📦 My Orders
            </Link>
          </>
        )}

        {token && role === 'delivery' && (
          <>
            <Link to="/delivery/orders" style={linkStyle} onMouseEnter={hoverLink} onMouseLeave={leaveLink}>
              Assigned
            </Link>
            <Link to="/delivery/history" style={linkStyle} onMouseEnter={hoverLink} onMouseLeave={leaveLink}>
              History
            </Link>
          </>
        )}
      </div>

      {/* Right: Auth / Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {!token ? (
          <>
            <Link to="/login" style={linkStyle} onMouseEnter={hoverLink} onMouseLeave={leaveLink}>
              Login
            </Link>
            <Link to="/signup" style={linkStyle} onMouseEnter={hoverLink} onMouseLeave={leaveLink}>
              Signup
            </Link>
          </>
        ) : (
          <>
            {/* Profile Block */}
            <Link
              to="/profile"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                background: '#2a2a3d',
                padding: '6px 12px',
                borderRadius: '6px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                textDecoration: 'none',
                color: 'inherit'
              }}
              onMouseEnter={hoverLink}
              onMouseLeave={leaveLink}
            >
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: '#6c63ff',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '0.9rem'
              }}>
                {name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                fontSize: '0.85rem',
                color: '#eee',
                lineHeight: '1.4'
              }}>
                <div><strong>Name:</strong> {name || 'User'}</div>
                <div><strong>Role:</strong> {role?.charAt(0).toUpperCase() + role?.slice(1)}</div>
              </div>
            </Link>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              style={{
                background: '#FF5555',
                color: '#FFF',
                border: 'none',
                padding: '6px 12px',
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'background 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#E04444'}
              onMouseLeave={e => e.currentTarget.style.background = '#FF5555'}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

const linkStyle = {
  color: '#E0E0E0',
  marginRight: '1rem',
  textDecoration: 'none',
  fontSize: '1rem',
  padding: '4px 8px',
  borderRadius: '4px'
};

export default Navbar;
