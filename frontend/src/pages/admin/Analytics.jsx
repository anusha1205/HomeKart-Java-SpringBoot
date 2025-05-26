// src/pages/admin/Analytics.jsx
import React, { useEffect, useState } from 'react';
import axios from '../../api/axiosInstance';
import Navbar from '../../components/Navbar';

export default function Analytics() {
  const [counts, setCounts] = useState(null);

  useEffect(() => {
    axios.get('/admin/analytics/counts')
      .then(r => setCounts(r.data))
      .catch(console.error);
  }, []);

  if (!counts) return <p>Loading analytics…</p>;

  return (
    <>
      <Navbar />
      <div style={{ padding:'2rem' }}>
        <h1>Admin Analytics</h1>
        <div style={{
          display:'grid',
          gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))',
          gap:'1rem',
          marginTop:'1rem'
        }}>
          <Card label="Sellers"   value={counts.totalSellers} />
          <Card label="Customers" value={counts.totalCustomers} />
          <Card label="Products"  value={counts.totalProducts} />
          <Card label="Orders"    value={counts.totalOrders} />
        </div>
      </div>
    </>
  );
}

function Card({ label, value }) {
  return (
    <div style={{
      padding:'1rem',
      border:'1px solid #ddd',
      borderRadius:'6px',
      textAlign:'center'
    }}>
      <h3 style={{margin:0, fontSize:'2rem'}}>{value}</h3>
      <p style={{margin:0, color:'#666'}}>{label}</p>
    </div>
  );
}
