import React, { useEffect, useState } from 'react';
import axios from '../../api/axiosInstance';
import Navbar from '../../components/Navbar';
function Favourites() {
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
        
        <><Navbar></Navbar><div style={{ padding: '2rem' }}>
            <h2>❤️ My Favorites</h2>
            {favourites.length === 0 ? (
                <p>No favorites yet.</p>
            ) : (
                favourites.map(item => (
                    <div key={item.id} style={cardStyle}>
                        <p><strong>{item.product.name}</strong></p>
                        <p>Price: ₹{item.product.price}</p>
                        <button onClick={() => handleDelete(item.id)} style={deleteBtn}>Remove</button>
                    </div>
                ))
            )}
        </div></>
    );
}

const cardStyle = {
    border: '1px solid #ccc',
    padding: '1rem',
    borderRadius: '8px',
    marginBottom: '1rem',
    backgroundColor: '#fff5f8'
};

const deleteBtn = {
    background: '#e60000',
    color: 'white',
    padding: '6px 10px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
};

export default Favourites;
