// AddProduct.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosPrivate from '../../api/axiosInstance';
import Navbar from '../../components/Navbar';

function AddProduct() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    imageUrl: '',
    stockQuantity: '',
    isAvailable: 'true',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosPrivate.post('/seller/products', {
        ...formData,
        price: parseFloat(formData.price),
        stockQuantity: parseInt(formData.stockQuantity),
        isAvailable: formData.isAvailable === 'true',
      });
      alert('Product added successfully!');
      navigate('/seller/dashboard');
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Failed to add product. Please try again.');
    }
  };

  return (
    <>
      <Navbar />
      <div style={containerStyle}>
        <h2 style={headingStyle}>Add New Product</h2>
        <form onSubmit={handleSubmit} style={formStyle}>
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={formData.name}
            onChange={handleChange}
            required
            style={inputStyle}
          />
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            required
            style={{ ...inputStyle, height: '100px' }}
          />
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={formData.price}
            onChange={handleChange}
            required
            style={inputStyle}
          />
          <input
            type="text"
            name="category"
            placeholder="Category (e.g. Electronics)"
            value={formData.category}
            onChange={handleChange}
            required
            style={inputStyle}
          />
          {/* <input
            type="text"
            name="imageUrl"
            placeholder="Image URL"
            value={formData.imageUrl}
            onChange={handleChange}
            required
            style={inputStyle}
          /> */}
          <input
            type="number"
            name="stockQuantity"
            placeholder="Stock Quantity"
            value={formData.stockQuantity}
            onChange={handleChange}
            required
            style={inputStyle}
          />
          <select
            name="isAvailable"
            value={formData.isAvailable}
            onChange={handleChange}
            style={inputStyle}
          >
            <option value="true">Available</option>
            <option value="false">Not Available</option>
          </select>
          <button type="submit" style={buttonStyle}>Add Product</button>
        </form>
      </div>
    </>
  );
}

export default AddProduct;

const containerStyle = {
  maxWidth: '600px',
  margin: '40px auto',
  padding: '30px',
  backgroundColor: '#fff',
  borderRadius: '8px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
};

const headingStyle = {
  textAlign: 'center',
  marginBottom: '20px',
  fontSize: '22px',
  color: '#333',
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '15px',
};

const inputStyle = {
  padding: '12px',
  fontSize: '16px',
  borderRadius: '6px',
  border: '1px solid #ccc',
};

const buttonStyle = {
  padding: '14px',
  backgroundColor: '#4CAF50',
  color: '#fff',
  border: 'none',
  borderRadius: '6px',
  fontSize: '16px',
  cursor: 'pointer',
  transition: 'background 0.2s',
};
