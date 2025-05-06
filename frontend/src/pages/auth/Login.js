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
      localStorage.setItem('name',   response.data.name);
      localStorage.setItem('email',  response.data.email);
      // keep the dropdown role, not the returned one:
      localStorage.setItem('role', role);     

      alert('Login Successful!');
      if (role === 'delivery') {
        navigate('/delivery/orders');
      } else {
        navigate('/profile');
      }
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed: ' + (error.response?.data || error.message));
    }
  };


  return (
    <>
      <Navbar />
      <div style={{ maxWidth: '400px', margin: '50px auto' }}>
        <h2 style={{ textAlign: 'center' }}>Login</h2>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <select value={role} onChange={(e) => setRole(e.target.value)} required>
            <option value="seller">Seller</option>
            <option value="customer">Customer</option>
            <option value="admin">Admin</option>
            <option value="delivery">Delivery Agent</option>
          </select>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" style={{ padding: '10px', background: '#007bff', color: 'white', border: 'none', borderRadius: '5px' }}>
            Login
          </button>
        </form>
      </div>
    </>
  );
}

export default Login;
