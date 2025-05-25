import React from 'react';
import Navbar from '../../components/Navbar';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const navigate = useNavigate();
  const name = localStorage.getItem('name');
  const email = localStorage.getItem('email');
  const role = localStorage.getItem('role');

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <>
      <Navbar />
      <div style={{
        maxWidth: '500px',
        margin: '60px auto',
        padding: '40px',
        backgroundColor: '#fff',
        borderRadius: '10px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        textAlign: 'center',
      }}>
        <h2 style={{
          marginBottom: '20px',
          fontSize: '26px',
          fontWeight: '600',
          color: '#333',
        }}>
          Profile
        </h2>
        <p style={{ fontSize: '18px', margin: '10px 0' }}>
          <strong>Name:</strong> {name || 'Not available'}
        </p>
        <p style={{ fontSize: '18px', margin: '10px 0' }}>
          <strong>Email:</strong> {email || 'Not available'}
        </p>
        <p style={{ fontSize: '18px', margin: '10px 0' }}>
          <strong>Role:</strong> {role || 'Not available'}
        </p>

        <button
          onClick={handleLogout}
          style={{
            marginTop: '30px',
            padding: '12px 24px',
            fontSize: '16px',
            backgroundColor: '#e60000',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            transition: 'background 0.2s ease',
          }}
          onMouseEnter={e => e.currentTarget.style.background='#cc0000'}
          onMouseLeave={e => e.currentTarget.style.background='#e60000'}
        >
          Logout
        </button>
      </div>
    </>
  );
}

export default Profile;
