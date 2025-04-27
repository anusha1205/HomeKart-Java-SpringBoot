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
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h2>Profile</h2>
        <p><strong>Name:</strong> {name || 'Not available'}</p>
        <p><strong>Email:</strong> {email || 'Not available'}</p>
        <p><strong>Role:</strong> {role || 'Not available'}</p>

        <button onClick={handleLogout} style={{
          marginTop: '20px',
          padding: '10px 20px',
          backgroundColor: '#e60000',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}>
          Logout
        </button>
      </div>
    </>
  );
}

export default Profile;
