import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('seller');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`/${role}/auth/login`, { email, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('name',  response.data.name);
      localStorage.setItem('email', response.data.email);
      localStorage.setItem('role',  role);
      alert('Login Successful!');
      if (role === 'delivery') navigate('/delivery/orders');
      else navigate('/profile');
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed: ' + (error.response?.data || error.message));
    }
  };

  const commonInputStyle = {
    padding: '14px',
    fontSize: '16px',
    border: '2px solid #ccc',
    borderRadius: '8px',
    transition: 'all 0.2s',
    outline: 'none',
    boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
    cursor: 'pointer'
  };

  return (
    <>
      <Navbar />
      <div style={{
        maxWidth: '420px',
        margin: '80px auto',
        padding: '40px',
        background: 'linear-gradient(135deg, #f0f4f8, #ffffff)',
        borderLeft: '6px solid #4CAF50',
        borderRadius: '12px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
      }}>
        <h2 style={{
          textAlign: 'center',
          marginBottom: '30px',
          fontSize: '26px',
          fontWeight: '700',
          color: '#333',
          textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
        }}>
          🔐 Login
        </h2>
        <form onSubmit={handleLogin} style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          <select
            value={role}
            onChange={e => setRole(e.target.value)}
            required
            style={{
              ...commonInputStyle,
              backgroundColor: '#f9f9f9',
              color: '#333',
            }}
            onFocus={e => e.currentTarget.style.borderColor = '#4CAF50'}
            onBlur={e => e.currentTarget.style.borderColor = '#ccc'}
          >
            <option value="seller">🛍️ Seller</option>
            <option value="customer">👤 Customer</option>
            <option value="admin">🛡️ Admin</option>
            <option value="delivery">🚚 Delivery Agent</option>
          </select>

          <input
            type="email"
            placeholder="✉️ Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={commonInputStyle}
            onFocus={e => {
              e.currentTarget.style.borderColor = '#4CAF50';
              e.currentTarget.style.boxShadow = '0 0 8px rgba(76,175,80,0.3)';
            }}
            onBlur={e => {
              e.currentTarget.style.borderColor = '#ccc';
              e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.05)';
            }}
          />

          <input
            type="password"
            placeholder="🔒 Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={commonInputStyle}
            onFocus={e => {
              e.currentTarget.style.borderColor = '#4CAF50';
              e.currentTarget.style.boxShadow = '0 0 8px rgba(76,175,80,0.3)';
            }}
            onBlur={e => {
              e.currentTarget.style.borderColor = '#ccc';
              e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.05)';
            }}
          />

          <button
            type="submit"
            style={{
              padding: '14px',
              fontSize: '18px',
              fontWeight: '600',
              background: 'linear-gradient(90deg, #4CAF50, #81C784)',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'scale(1.02)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.2)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            👉 Login
          </button>
        </form>
      </div>
    </>
  );
}

export default Login;
