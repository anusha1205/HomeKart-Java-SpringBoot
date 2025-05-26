import React, { useEffect, useState } from 'react';
import axios from '../../api/axiosInstance';
import Navbar from '../../components/Navbar';
import { toast } from 'react-toastify';

export default function ManageUsers() {
  const [sellers, setSellers] = useState([]);
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    fetchAll();
  }, []);

  async function fetchAll() {
    try {
      const [sRes, cRes] = await Promise.all([
        axios.get('/admin/manage/sellers'),
        axios.get('/admin/manage/customers'),
      ]);
      setSellers(sRes.data);
      setCustomers(cRes.data);
    } catch (e) {
      console.error(e);
      toast.error('Failed to load users');
    }
  }

  async function handleDelete(type, id) {
    if (!window.confirm(`Delete ${type.slice(0, -1)} #${id}?`)) return;
    try {
      await axios.delete(`/admin/manage/${type}/${id}`);
      toast.success(`${type.slice(0, -1)} deleted`);
      fetchAll();
    } catch {
      toast.error('Delete failed');
    }
  }

  return (
    <>
      <Navbar />
      <div style={styles.page}>
        <h1 style={styles.heading}>Manage Users</h1>

        <section>
          <h2 style={styles.subheading}>Sellers</h2>
          {sellers.length === 0 ? (
            <p style={styles.emptyText}>No sellers found</p>
          ) : (
            <ul style={styles.list}>
              {sellers.map(s => (
                <li key={s.id} style={styles.listItem}>
                  <div>
                    <p style={styles.userName}>{s.name}</p>
                    <p style={styles.userEmail}>{s.email}</p>
                  </div>
                  <button
                    style={styles.deleteBtn}
                    onClick={() => handleDelete('sellers', s.id)}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section style={{ marginTop: '3rem' }}>
          <h2 style={styles.subheading}>Customers</h2>
          {customers.length === 0 ? (
            <p style={styles.emptyText}>No customers found</p>
          ) : (
            <ul style={styles.list}>
              {customers.map(c => (
                <li key={c.id} style={styles.listItem}>
                  <div>
                    <p style={styles.userName}>{c.name}</p>
                    <p style={styles.userEmail}>{c.email}</p>
                  </div>
                  <button
                    style={styles.deleteBtn}
                    onClick={() => handleDelete('customers', c.id)}
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    backgroundColor: '#f3f4f6',
    padding: '2rem',
  },
  heading: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: '2rem',
  },
  subheading: {
    fontSize: '1.75rem',
    color: '#374151',
    marginBottom: '1rem',
  },
  emptyText: {
    fontStyle: 'italic',
    color: '#6b7280',
  },
  list: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-evenly',
    gap: '20px',
    // flexWr
    listStyle: 'none',
    padding: 0,
  },
  listItem: {
    width: '50%',
    backgroundColor: '#ffffff',
    borderRadius: '3rem',
    padding: '1rem 1.5rem',
    marginBottom: '1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  userName: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#111827',
    margin: 0,
  },
  userEmail: {
    fontSize: '0.875rem',
    color: '#6b7280',
    margin: 0,
  },
  deleteBtn: {
    backgroundColor: '#dc2626',
    color: '#ffffff',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '0.25rem',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
};