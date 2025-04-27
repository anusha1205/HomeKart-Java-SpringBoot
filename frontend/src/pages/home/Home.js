import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import Navbar from '../../components/Navbar';
import Modal from 'react-modal';

Modal.setAppElement('#root');

function Home() {
  const [products, setProducts] = useState([]);
  const [filterCategory, setFilterCategory] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [stockStatus, setStockStatus] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/public/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products', error);
    }
  };

  const filteredProducts = products
    .filter(product => 
      (!filterCategory || product.category.toLowerCase().includes(filterCategory.toLowerCase())) &&
      (stockStatus === 'All' ||
        (stockStatus === 'In Stock' && product.stockQuantity > 0) ||
        (stockStatus === 'Out of Stock' && product.stockQuantity <= 0))
    )
    .sort((a, b) => {
      if (sortOrder === 'lowToHigh') return a.price - b.price;
      if (sortOrder === 'highToLow') return b.price - a.price;
      return 0;
    });

  return (
    <>
      <Navbar />
      <div style={{ display: 'flex', padding: '20px' }}>
        
        {/* Filters */}
        <div style={{ width: '20%', padding: '1rem' }}>
          <h2>Filters</h2>

          <div>
            <label>Sort by Price:</label><br/>
            <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
              <option value="">None</option>
              <option value="lowToHigh">Low to High</option>
              <option value="highToLow">High to Low</option>
            </select>
          </div>

          <div style={{ marginTop: '1rem' }}>
            <label>Category:</label><br/>
            <input
              type="text"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              placeholder="Eg: Electronics"
            />
          </div>

          <div style={{ marginTop: '1rem' }}>
            <label>Stock Status:</label><br/>
            <select value={stockStatus} onChange={(e) => setStockStatus(e.target.value)}>
              <option value="All">All</option>
              <option value="In Stock">In Stock</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
          </div>
        </div>

        {/* Product Cards */}
        <div style={{ width: '80%', display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
          {filteredProducts.map(product => (
            <div key={product.id}
              style={{
                border: '1px solid #ccc',
                padding: '1rem',
                borderRadius: '8px',
                width: '250px',
                cursor: 'pointer'
              }}
              onClick={() => setSelectedProduct(product)}
            >
              <img src={product.imageUrl || 'https://via.placeholder.com/250'} alt={product.name} style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
              <h3>{product.name}</h3>
              <p>₹ {product.price}</p>
              <p>{product.stockQuantity > 0 ? 'In Stock' : 'Out of Stock'}</p>
            </div>
          ))}
        </div>

      </div>

      {/* Modal */}
      <Modal
        isOpen={!!selectedProduct}
        onRequestClose={() => setSelectedProduct(null)}
        contentLabel="Product Details"
        style={{
          content: {
            width: '400px',
            margin: 'auto',
            padding: '20px',
            borderRadius: '10px'
          }
        }}
      >
        {selectedProduct && (
          <>
            <h2>{selectedProduct.name}</h2>
            <img src={selectedProduct.imageUrl || 'https://via.placeholder.com/250'} alt={selectedProduct.name} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
            <p><strong>Description:</strong> {selectedProduct.description}</p>
            <p><strong>Price:</strong> ₹{selectedProduct.price}</p>
            <p><strong>Category:</strong> {selectedProduct.category}</p>
            <p><strong>Stock:</strong> {selectedProduct.stockQuantity}</p>
            <button onClick={() => setSelectedProduct(null)} style={{ marginTop: '10px' }}>Close</button>
          </>
        )}
      </Modal>
    </>
  );
}

export default Home;
