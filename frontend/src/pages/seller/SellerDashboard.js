import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import axiosInstance from '../../api/axiosInstance';
import { useNavigate } from 'react-router-dom';

function SellerDashboard() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stockQuantity: '',
    imageUrl: '',
    isAvailable: true,
  });

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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/seller/products', {
        ...newProduct,
        price: parseFloat(newProduct.price),
        stockQuantity: parseInt(newProduct.stockQuantity),
        isAvailable: newProduct.isAvailable === 'true' ? true : false,
      });
      alert('Product added successfully!');
      fetchSellerProducts(); // Refresh products
      setNewProduct({
        name: '',
        description: '',
        price: '',
        category: '',
        stockQuantity: '',
        imageUrl: '',
        isAvailable: true,
      });
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Error adding product: ' + (error.response?.data || error.message));
    }
  };

  const handleEdit = (id) => {
    navigate(`/seller/edit/${id}`);
  };

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
      <div style={{ padding: '2rem' }}>
        <h2>Seller Dashboard</h2>

        {/* Add New Product Form */}
        <form onSubmit={handleAddProduct} style={{ marginBottom: '2rem', maxWidth: '500px' }}>
          <h3>Add New Product</h3>
          <input type="text" name="name" placeholder="Name" value={newProduct.name} onChange={handleInputChange} required style={inputStyle} />
          <input type="text" name="description" placeholder="Description" value={newProduct.description} onChange={handleInputChange} required style={inputStyle} />
          <input type="number" name="price" placeholder="Price" value={newProduct.price} onChange={handleInputChange} required style={inputStyle} />
          <input type="text" name="category" placeholder="Category" value={newProduct.category} onChange={handleInputChange} required style={inputStyle} />
          <input type="text" name="stockQuantity" placeholder="Stock Quantity" value={newProduct.stockQuantity} onChange={handleInputChange} required style={inputStyle} />
          <input type="text" name="imageUrl" placeholder="Image URL" value={newProduct.imageUrl} onChange={handleInputChange} style={inputStyle} />
          <select name="isAvailable" value={newProduct.isAvailable} onChange={handleInputChange} style={inputStyle}>
            <option value="true">Available</option>
            <option value="false">Not Available</option>
          </select>
          <button type="submit" style={buttonStyle}>Add Product</button>
        </form>

        {/* Your Products List */}
        <h3>Your Products</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
          {products.length > 0 ? (
            products.map((product) => (
              <div key={product.id} style={cardStyle}>
                <img src={product.imageUrl} alt={product.name} style={imageStyle} />
                <h4>{product.name}</h4>
                <p>₹ {product.price}</p>
                <p>{product.description}</p>
                <p>Stock: {product.stockQuantity}</p>
                <div style={{ marginTop: '10px' }}>
                  <button onClick={() => handleEdit(product.id)} style={editButtonStyle}>Edit</button>
                  <button onClick={() => handleDelete(product.id)} style={deleteButtonStyle}>Delete</button>
                </div>
              </div>
            ))
          ) : (
            <p>No products found.</p>
          )}
        </div>
      </div>
    </>
  );
}

const inputStyle = { display: 'block', marginBottom: '10px', width: '100%', padding: '8px', borderRadius: '5px', border: '1px solid #ccc' };
const buttonStyle = { background: '#28a745', color: 'white', padding: '10px', border: 'none', borderRadius: '5px', marginTop: '10px' };
const cardStyle = { width: '250px', border: '1px solid #ccc', padding: '10px', borderRadius: '8px', textAlign: 'center' };
const imageStyle = { width: '100%', height: '150px', objectFit: 'cover', borderRadius: '5px' };
const editButtonStyle = { background: '#2196F3', color: 'white', padding: '8px 12px', marginRight: '10px', border: 'none', borderRadius: '5px', cursor: 'pointer' };
const deleteButtonStyle = { background: '#f44336', color: 'white', padding: '8px 12px', border: 'none', borderRadius: '5px', cursor: 'pointer' };

export default SellerDashboard;
