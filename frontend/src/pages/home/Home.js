import React, { useState, useEffect } from 'react';
import axios from '../../api/axiosInstance';
import Navbar from '../../components/Navbar';
import Modal from 'react-modal';
import { toast } from 'react-toastify';

Modal.setAppElement('#root');

function Home() {
  const [products, setProducts] = useState([]);
  const [filterCategory, setFilterCategory] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [stockStatus, setStockStatus] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [favorites, setFavorites] = useState([]);
  const [cartQuantities, setCartQuantities] = useState({});
  
  useEffect(() => {
    fetchProducts();
    fetchFavorites();     // ✅ Add this
    fetchCartData();      // ✅ Add this
  }, []);
  

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/public/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products', error);
    }
  };

  const fetchFavorites = async () => {
    try {
      const res = await axios.get('/customer/favorites');
      setFavorites(res.data.map(item => item.product.id));
    } catch (err) {
      console.error('Error fetching favorites:', err);
    }
  };

  const fetchCartData = async () => {
    try {
      const res = await axios.get('/customer/cart');
      const quantities = {};
      res.data.forEach(item => {
        quantities[item.product.id] = item.quantity;
      });
      setCartQuantities(quantities);
    } catch (error) {
      console.error('Error fetching cart data:', error);
    }
  };

  const handleAddCart = async (productId) => {
    try {
      await axios.post(`/customer/cart/add`, null, {
        params: { productId, quantity: selectedQuantity },
      });
      fetchCartData();
      toast.success('Product added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add to cart');
    }
  };

  const handleAddToFavorites = async (productId) => {
    const isFav = favorites.includes(productId);
    try {
      if (isFav) {
        const res = await axios.get('/customer/favorites');
        const fav = res.data.find(f => f.product.id === productId);
        if (fav) await axios.delete(`/customer/favorites/${fav.id}`);
        setFavorites(favorites.filter(id => id !== productId));
        toast.info('Removed from favorites');
      } else {
        await axios.post(`/customer/favorites/add`, null, { params: { productId } });
        setFavorites([...favorites, productId]);
        toast.success('Added to favorites');
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error('Error updating favorites');
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

  const increaseQuantity = () => {
    setSelectedQuantity(prev => prev + 1);
  };

  const decreaseQuantity = () => {
    setSelectedQuantity(prev => (prev > 1 ? prev - 1 : 1));
  };















  return (
    <>
      <Navbar />
      <div style={{ display: 'flex', padding: '20px' }}>
        <div style={{ width: '20%', padding: '1rem' }}>
          <h2>Filters</h2>
          <div>
            <label>Sort by Price:</label><br />
            <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
              <option value="">None</option>
              <option value="lowToHigh">Low to High</option>
              <option value="highToLow">High to Low</option>
            </select>
          </div>
          <div style={{ marginTop: '1rem' }}>
            <label>Category:</label><br />
            <input
              type="text"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              placeholder="Eg: Electronics"
            />
          </div>
          <div style={{ marginTop: '1rem' }}>
            <label>Stock Status:</label><br />
            <select value={stockStatus} onChange={(e) => setStockStatus(e.target.value)}>
              <option value="All">All</option>
              <option value="In Stock">In Stock</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
          </div>
        </div>

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
              // onClick={() => setSelectedProduct(product)}
              onClick={() => {
                setSelectedProduct(product);
                setSelectedQuantity(1);
              }}
              
            >
              <img src={product.imageUrl || 'https://via.placeholder.com/250'} alt={product.name} style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
              <h3>{product.name}</h3>
              <p>₹ {product.price}</p>
              <p>{product.stockQuantity > 0 ? 'In Stock' : 'Out of Stock'}</p>
            </div>
          ))}
        </div>
      </div>

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

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '1rem' }}>
              <button onClick={decreaseQuantity}>−</button>
              <span>{selectedQuantity}</span>
              <button onClick={increaseQuantity}>+</button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
              <button
                onClick={() => handleAddCart(selectedProduct.id)}
                style={{
                  background: '#28a745',
                  color: 'white',
                  padding: '8px 12px',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                Add to Cart
              </button>

              <button
                onClick={() => handleAddToFavorites(selectedProduct.id)}
                style={{
                  background: favorites.includes(selectedProduct.id) ? '#ff4081' : '#aaa',
                  color: 'white',
                  padding: '8px 12px',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                {favorites.includes(selectedProduct.id) ? '❤️ Remove' : '🤍 Favorite'}
              </button>

              <button
                onClick={() => setSelectedProduct(null)}
                style={{
                  background: '#ccc',
                  padding: '8px 12px',
                  borderRadius: '5px',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
            </div>
          </>
        )}
      </Modal>
    </>
  );
}

export default Home;
