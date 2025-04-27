// src/pages/seller/EditProduct.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosPrivate from '../../api/axiosInstance';
import Navbar from '../../components/Navbar';

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    imageUrl: '',
    stockQuantity: '',
    isAvailable: true,
  });

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    try {
      const response = await axiosPrivate.get(`/api/seller/products/${id}`);
      const data = response.data;
      setFormData({
        name: data.name,
        description: data.description,
        price: data.price,
        category: data.category,
        imageUrl: data.imageUrl,
        stockQuantity: data.stockQuantity,
        isAvailable: data.isAvailable,
      });
    } catch (error) {
      console.error('Error fetching product:', error);
      alert('Error fetching product details');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: name === 'isAvailable' ? value === 'true' : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosPrivate.put(`/api/seller/products/${id}`, {
        ...formData,
        price: parseFloat(formData.price),
        stockQuantity: parseInt(formData.stockQuantity),
      });
      alert('Product updated successfully!');
      navigate('/seller/dashboard');
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product');
    }
  };

  return (
    <>
      <Navbar />
      <div style={containerStyle}>
        <h2 style={headingStyle}>Edit Product</h2>
        <form onSubmit={handleSubmit} style={formStyle}>
          <input type="text" name="name" placeholder="Product Name" value={formData.name} onChange={handleChange} required style={inputStyle} />
          <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} required style={{ ...inputStyle, height: '100px' }} />
          <input type="number" name="price" placeholder="Price" value={formData.price} onChange={handleChange} required style={inputStyle} />
          <input type="text" name="category" placeholder="Category" value={formData.category} onChange={handleChange} required style={inputStyle} />
          <input type="text" name="imageUrl" placeholder="Image URL" value={formData.imageUrl} onChange={handleChange} required style={inputStyle} />
          <input type="number" name="stockQuantity" placeholder="Stock Quantity" value={formData.stockQuantity} onChange={handleChange} required style={inputStyle} />
          <select name="isAvailable" value={formData.isAvailable} onChange={handleChange} style={inputStyle}>
            <option value="true">Available</option>
            <option value="false">Not Available</option>
          </select>
          <button type="submit" style={buttonStyle}>Update Product</button>
        </form>
      </div>
    </>
  );
}

const containerStyle = {
  maxWidth: '500px',
  margin: '50px auto',
  padding: '20px',
  border: '1px solid #ccc',
  borderRadius: '10px',
  boxShadow: '0px 0px 10px rgba(0,0,0,0.1)'
};

const headingStyle = {
  textAlign: 'center',
  marginBottom: '20px',
  color: '#333'
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
};

const inputStyle = {
  padding: '10px',
  marginBottom: '15px',
  borderRadius: '5px',
  border: '1px solid #ccc',
  fontSize: '16px',
};

const buttonStyle = {
  padding: '12px',
  backgroundColor: '#4CAF50',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  fontSize: '16px',
  cursor: 'pointer'
};

export default EditProduct;
