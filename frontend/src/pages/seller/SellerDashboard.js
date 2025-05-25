// SellerDashboard.js
import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import axiosInstance from '../../api/axiosInstance';
import { useNavigate } from 'react-router-dom';

function SellerDashboard() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchSellerProducts();
  }, []);

  const fetchSellerProducts = async () => {
    try {
      const response = await axiosInstance.get('/seller/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching seller products:', error);
      alert('Error fetching products: ' + (error.response?.data || error.message));
    }
  };

  const handleEdit = (id) => navigate(`/seller/edit/${id}`);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axiosInstance.delete(`/seller/products/${id}`);
        alert('Product deleted successfully!');
        fetchSellerProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Error deleting product: ' + (error.response?.data || error.message));
      }
    }
  };

  return (
    <>
      <Navbar />
      <div style={containerStyle}>
        <h2 style={headingStyle}>Seller Dashboard</h2>
        <h3 style={subheadingStyle}>Your Products</h3>
        <div style={gridStyle}>
          {products.length > 0 ? (
            products.map(product => (
              <div
                key={product.id}
                style={cardStyle}
                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.15)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'}
              >
                <img src={product.imageUrl} alt={product.name} style={imageStyle} />
                <h4 style={titleStyle}>{product.name}</h4>
                <p style={priceStyle}>₹ {product.price.toFixed(2)}</p>
                <p style={descStyle}>{product.description}</p>
                <p style={stockStyle}>Stock: {product.stockQuantity}</p>
                <div style={buttonGroupStyle}>
                  <button onClick={() => handleEdit(product.id)} style={editButtonStyle}>Edit</button>
                  <button onClick={() => handleDelete(product.id)} style={deleteButtonStyle}>Delete</button>
                </div>
              </div>
            ))
          ) : (
            <p style={emptyStyle}>No products found.</p>
          )}
        </div>
      </div>
    </>
  );
}

export default SellerDashboard;

const containerStyle = {
  maxWidth: '1100px',
  margin: '40px auto',
  padding: '30px',
  backgroundColor: '#fff',
  borderRadius: '8px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
};

const headingStyle = {
  fontSize: '26px',
  fontWeight: '700',
  marginBottom: '10px',
  color: '#333',
};

const subheadingStyle = {
  fontSize: '20px',
  fontWeight: '500',
  margin: '20px 0 10px',
  color: '#555',
};

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
  gap: '20px',
};

const cardStyle = {
  backgroundColor: '#fff',
  borderRadius: '8px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  padding: '15px',
  textAlign: 'center',
  transition: 'box-shadow 0.2s',
};

const imageStyle = {
  width: '100%',
  height: '150px',
  objectFit: 'cover',
  borderRadius: '5px',
  marginBottom: '10px',
};

const titleStyle = {
  fontSize: '18px',
  fontWeight: '600',
  color: '#333',
  margin: '8px 0',
};

const priceStyle = {
  fontSize: '16px',
  fontWeight: '500',
  color: '#2a9d8f',
  margin: '4px 0',
};

const descStyle = {
  fontSize: '14px',
  color: '#666',
  margin: '4px 0 8px',
};

const stockStyle = {
  fontSize: '14px',
  color: '#888',
};

const buttonGroupStyle = {
  marginTop: '12px',
  display: 'flex',
  justifyContent: 'center',
  gap: '10px',
};

const editButtonStyle = {
  background: '#2196F3',
  color: '#fff',
  padding: '8px 12px',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};

const deleteButtonStyle = {
  background: '#f44336',
  color: '#fff',
  padding: '8px 12px',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};

const emptyStyle = {
  fontSize: '16px',
  color: '#666',
};
