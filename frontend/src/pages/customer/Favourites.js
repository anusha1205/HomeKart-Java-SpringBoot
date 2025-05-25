import React, { useEffect, useState } from 'react';
import axios from '../../api/axiosInstance';
import Navbar from '../../components/Navbar';

export default function Favourites() {
  const [favourites, setFavourites] = useState([]);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const res = await axios.get('/customer/favorites');
      setFavourites(res.data);
    } catch (err) {
      console.error('Error fetching favorites:', err);
    }
  };

  const handleDelete = async (favoriteId) => {
    try {
      await axios.delete(`/customer/favorites/${favoriteId}`);
      fetchFavorites();
    } catch (err) {
      console.error('Error deleting favorite:', err);
    }
  };

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <h2 style={styles.heading}>❤️ My Favorites</h2>

        {favourites.length === 0 ? (
          <p style={styles.empty}>You haven't added any favorites yet.</p>
        ) : (
          <div style={styles.list}>
            {favourites.map(item => (
              <div key={item.id} style={styles.card}>
                <p style={styles.productName}>{item.product.name}</p>
                <p style={styles.price}>₹{item.product.price.toFixed(2)}</p>
                <button
                  onClick={() => handleDelete(item.id)}
                  style={styles.deleteBtn}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

const styles = {
  container: {
    maxWidth: '800px',
    margin: '40px auto',
    padding: '20px',
    backgroundColor: '#fafafa',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
  },
  heading: {
    fontSize: '24px',
    fontWeight: '600',
    marginBottom: '20px',
    color: '#333'
  },
  empty: {
    textAlign: 'center',
    color: '#777',
    fontSize: '16px'
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  card: {
    backgroundColor: '#fff5f8',
    padding: '16px',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
    transition: 'box-shadow 0.2s'
  },
  productName: {
    fontSize: '18px',
    color: '#222',
    margin: 0
  },
  price: {
    fontSize: '16px',
    color: '#e91e63',
    margin: '0 20px'
  },
  deleteBtn: {
    backgroundColor: '#e60000',
    color: '#fff',
    border: 'none',
    padding: '8px 12px',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background 0.2s'
  }
};
