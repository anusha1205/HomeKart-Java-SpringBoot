import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';

function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('seller'); // Default role

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`/${role}/auth/signup`, { name, email, password });
      alert('Signup Successful! Now please login.');
      navigate('/login');
    } catch (error) {
      console.error('Signup failed:', error);
      alert('Signup failed: ' + (error.response?.data || error.message));
    }
  };

  return (
    <>
      <Navbar />
      <div style={{
        maxWidth: '400px',
        margin: '60px auto',
        padding: '40px',
        backgroundColor: '#fff',
        borderRadius: '10px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{
          textAlign: 'center',
          marginBottom: '30px',
          fontSize: '24px',
          fontWeight: '600',
          color: '#333'
        }}>
          Signup
        </h2>
        <form onSubmit={handleSignup} style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
            style={{
              padding: '12px',
              fontSize: '16px',
              border: '1px solid #ccc',
              borderRadius: '6px',
              backgroundColor: '#f9f9f9'
            }}
          >
            <option value="seller">Seller</option>
            <option value="customer">Customer</option>
            {/* <option value="admin">Admin</option> */}
            <option value="delivery">Delivery Agent</option>
          </select>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{
              padding: '12px',
              fontSize: '16px',
              border: '1px solid #ccc',
              borderRadius: '6px'
            }}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              padding: '12px',
              fontSize: '16px',
              border: '1px solid #ccc',
              borderRadius: '6px'
            }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              padding: '12px',
              fontSize: '16px',
              border: '1px solid #ccc',
              borderRadius: '6px'
            }}
          />
          <button
            type="submit"
            style={{
              padding: '12px',
              fontSize: '18px',
              background: '#28a745',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'background 0.2s ease'
            }}
            onMouseEnter={e => e.currentTarget.style.background='#218838'}
            onMouseLeave={e => e.currentTarget.style.background='#28a745'}
          >
            Signup
          </button>
        </form>
      </div>
    </>
  );
}

export default Signup;
