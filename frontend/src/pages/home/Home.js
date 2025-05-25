import React, { useEffect, useState, useMemo } from 'react';
import axios from '../../api/axiosInstance';
import Navbar from '../../components/Navbar';
import Modal from 'react-modal';
import { toast } from 'react-toastify';
import {
  FaHeart,
  FaRegHeart,
  FaShoppingCart,
  FaStar,
  FaStarHalfAlt,
  FaRegStar
} from 'react-icons/fa';

Modal.setAppElement('#root');

export default function Home() {
  const [products, setProducts] = useState([]);
  const [filterCategory, setFilterCategory] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [stockStatus, setStockStatus] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [favorites, setFavorites] = useState([]);
  const [cartQuantities, setCartQuantities] = useState({});
  const [reviews, setReviews] = useState([]);
  // const [filterRating, setFilterRating] = useState('');
  // const [orders, setOrders] = useState([]);
  const [filterRating, setFilterRating] = useState('');

  // Fetch reviews when opening a product
  useEffect(() => {
    if (selectedProduct) {
      axios
        .get(`/products/${selectedProduct.id}/reviews`)
        .then((r) => setReviews(r.data))
        .catch(() => setReviews([]));
    }
  }, [selectedProduct]);

  // derive categories dropdown
  const categories = useMemo(() => {
    const s = new Set(products.map((p) => p.category));
    return ['', ...s];
  }, [products]);


  const filtered = products
    .filter(p => {
      // Category
      if (filterCategory && p.category !== filterCategory) {
        return false;
      }
 
      if (
        (stockStatus === 'In Stock' && p.stockQuantity <= 0) ||
        (stockStatus === 'Out of Stock' && p.stockQuantity > 0)
      ) {
        return false;
      }

      // Rating (strictly above)
      if (filterRating) {
        const avg = Number(p.averageRating) || 0;
        const min = Number(filterRating);
        if (!(avg > min)) {
          return false;
        }
      }

      return true;
    })
    .sort((a, b) => {
      if (sortOrder === 'lowToHigh') return a.price - b.price;
      if (sortOrder === 'highToLow') return b.price - a.price;
      return 0;
    });



  useEffect(() => {
    fetchProducts();
    fetchFavorites();
    fetchCartData();
  }, []);

  async function fetchProducts() {
    try {
      const { data } = await axios.get('/public/products');
      setProducts(data);
    } catch (e) {
      console.error(e);
    }
  }
  async function fetchFavorites() {
    try {
      const { data } = await axios.get('/customer/favorites');
      setFavorites(data.map((f) => f.product.id));
    } catch { }
  }
  async function fetchCartData() {
    try {
      const { data } = await axios.get('/customer/cart');
      const map = {};
      data.forEach((i) => (map[i.product.id] = i.quantity));
      setCartQuantities(map);
    } catch { }
  }

  async function quickAddCart(id) {
    try {
      await axios.post(
        '/customer/cart/add',
        null,
        { params: { productId: id, quantity: 1 } }
      );
      fetchCartData();
      toast.success('Added to cart');
    } catch {
      toast.error('Failed to add to cart');
    }
  }
  async function toggleFav(id) {
    try {
      if (favorites.includes(id)) {
        const { data } = await axios.get('/customer/favorites');
        const f = data.find((x) => x.product.id === id);
        if (f) await axios.delete(`/customer/favorites/${f.id}`);
        setFavorites((favs) => favs.filter((x) => x !== id));
        toast.info('Removed from favorites');
      } else {
        await axios.post(
          '/customer/favorites/add',
          null,
          { params: { productId: id } }
        );
        setFavorites((f) => [...f, id]);
        toast.success('Added to favorites');
      }
    } catch {
      toast.error('Error updating favorites');
    }
  }

  function StarRating({ rating, maxStars = 5 }) {
    const stars = [];
    let rem = rating;
    for (let i = 0; i < maxStars; i++) {
      if (rem >= 1) {
        stars.push(<FaStar key={i} />);
        rem -= 1;
      } else if (rem >= 0.5) {
        stars.push(<FaStarHalfAlt key={i} />);
        rem = 0;
      } else {
        stars.push(<FaRegStar key={i} />);
      }
    }
    return (
      <div style={{ color: '#ffc107', display: 'inline-flex', gap: '2px' }}>
        {stars}
      </div>
    );
  }

  // // filtered + sorted
  // const filtered = products
  //   .filter(
  //     (p) =>
  //       (!filterCategory || p.category === filterCategory) &&
  //       (stockStatus === 'All' ||
  //         (stockStatus === 'In Stock' && p.stockQuantity > 0) ||
  //         (stockStatus === 'Out of Stock' && p.stockQuantity <= 0))
  //   )
  //   .sort((a, b) => {
  //     if (sortOrder === 'lowToHigh') return a.price - b.price;
  //     if (sortOrder === 'highToLow') return b.price - a.price;
  //     return 0;
  //   });

  // modal qty handlers
  const inc = () => setSelectedQuantity((q) => q + 1);
  const dec = () => setSelectedQuantity((q) => Math.max(1, q - 1));

  async function addToCartModal() {
    try {
      await axios.post(
        '/customer/cart/add',
        null,
        {
          params: {
            productId: selectedProduct.id,
            quantity: selectedQuantity
          }
        }
      );
      fetchCartData();
      toast.success('Added to cart');
      setSelectedProduct(null);
    } catch {
      toast.error('Failed to add');
    }
  }

  return (
    <>
      <Navbar />

      <div style={styles.filterBar}>
        <div style={styles.filterGroup}>
          <label style={styles.label}>Sort:</label>
          <select
            style={styles.select}
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="">None</option>
            <option value="lowToHigh">Price ↑</option>
            <option value="highToLow">Price ↓</option>
          </select>
        </div>

        <div style={styles.filterGroup}>
          <label style={styles.label}>Category:</label>
          <select
            style={styles.select}
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat || 'all'} value={cat}>
                {cat || 'All Categories'}
              </option>
            ))}
          </select>
        </div>
        <div style={styles.filterGroup}>
          <label style={styles.label}>Min Rating:</label>
          <select
            style={styles.select}
            value={filterRating}
            onChange={e => setFilterRating(e.target.value)}
          >
            <option value="">All Ratings</option>
            <option value="3">3 ★ & up</option>
            <option value="4">4 ★ & up</option>
            <option value="5">5 ★ only</option>
          </select>
        </div>


        <div style={styles.filterGroup}>
          <label style={styles.label}>Stock:</label>
          <select
            style={styles.select}
            value={stockStatus}
            onChange={(e) => setStockStatus(e.target.value)}
          >
            <option>All</option>
            <option>In Stock</option>
            <option>Out of Stock</option>
          </select>
        </div>
      </div>

      <section style={styles.grid}>
        {filtered.map((p) => (
          <div
            key={p.id}
            style={styles.card}
            onClick={() => {
              setSelectedProduct(p);
              setSelectedQuantity(1);
            }}
          >
            <div style={styles.cardHeader}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  quickAddCart(p.id);
                }}
                style={styles.iconBtn}
              >
                <FaShoppingCart />
                {cartQuantities[p.id] > 0 && (
                  <span style={styles.badge}>{cartQuantities[p.id]}</span>
                )}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFav(p.id);
                }}
                style={styles.iconBtn}
              >
                {favorites.includes(p.id) ? (
                  <FaHeart color="#e91e63" />
                ) : (
                  <FaRegHeart />
                )}
              </button>
            </div>
            {p.imageUrl ? (
              <img src={p.imageUrl} alt={p.name} style={styles.image} />
            ) : (
              <div style={styles.emptyImageGap} />
            )}
            <div style={styles.cardBody}>
              <h4 style={styles.name}>{p.name}</h4>
              <p style={styles.price}>₹ {p.price.toFixed(2)}</p>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px',
                  marginBottom: '8px'
                }}
              >
                <StarRating rating={p.averageRating} />
                <span style={{ fontSize: '13px', color: '#555' }}>
                  ({p.reviewCount})
                </span>
              </div>
              <p
                style={{
                  ...styles.stock,
                  color: p.stockQuantity > 0 ? '#2a9d8f' : '#e91e63'
                }}
              >
                {p.stockQuantity > 0 ? 'In Stock' : 'Out of Stock'}
              </p>
            </div>
          </div>
        ))}
      </section>

      <Modal
        isOpen={!!selectedProduct}
        onRequestClose={() => setSelectedProduct(null)}
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(3px)',
            zIndex: 1000
          },
          content: {
            maxWidth: '500px',
            margin: 'auto',
            borderRadius: '16px',
            padding: '24px 28px',
            background: '#fff',
            border: 'none',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            fontFamily: `'Segoe UI', sans-serif`
          }
        }}
      >
        {selectedProduct && (
          <>
            <img
              src={selectedProduct.imageUrl}
              alt={selectedProduct.name}
              style={{
                width: '100%',
                height: '220px',
                objectFit: 'cover',
                borderRadius: '10px',
                marginBottom: '16px'
              }}
            />
            <h2 style={{ fontSize: '22px', marginBottom: '4px', fontWeight: '600' }}>
              {selectedProduct.name}
            </h2>
            <p style={{ margin: 0, fontSize: '15px', color: '#666' }}>
              <strong>Category:</strong> {selectedProduct.category}
            </p>
            <p style={{ fontSize: '14px', color: '#555' }}>
              {selectedProduct.description}
            </p>
            <p style={{ fontWeight: 'bold', fontSize: '16px' }}>
              ₹ {selectedProduct.price.toFixed(2)}
            </p>

            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '12px',
                alignItems: 'center',
                marginTop: '10px'
              }}
            >
              <button style={styles.qtyBtn} onClick={dec}>
                −
              </button>
              <span style={{ fontSize: '16px', fontWeight: '600' }}>{selectedQuantity}</span>
              <button style={styles.qtyBtn} onClick={inc}>
                +
              </button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button
                onClick={addToCartModal}
                style={styles.modalAddBtn}
                className="modal-add-btn"
              >
                Add {selectedQuantity} to Cart
              </button>
              <button
                onClick={() => setSelectedProduct(null)}
                style={styles.modalCloseBtn}
                className="modal-close-btn"
              >
                Close
              </button>
            </div>


            {/* Reviews panel */}
            <div
              style={{
                // maxHeight: '180px',
                // overflowY: 'auto',
                marginTop: '5px',
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                background: '#fafafa'
              }}
            >
              <h4 style={{ marginTop: '0%' }}>Reviews & Ratings</h4>
              {reviews.length ? (
                reviews.map((r) => (
                  <div key={r.id} style={{ marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <StarRating rating={r.rating} />
                      <span style={{ fontSize: '12px', color: '#333' }}>
                        {r.reviewer}
                      </span>
                      <span
                        style={{
                          marginLeft: 'auto',
                          fontSize: '11px',
                          color: '#888'
                        }}
                      >
                        {new Date(r.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {r.comment && (
                      <p style={{ fontSize: '13px', margin: '4px 0 0 24px', color: '#555' }}>
                        {r.comment}
                      </p>
                    )}
                  </div>
                ))
              ) : (
                <p style={{ textAlign: 'center', color: '#777' }}>No reviews yet.</p>
              )}
            </div>
          </>
        )}
      </Modal>
    </>
  );
}

const styles = {
  filterGroup: {
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  label: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#333',
  },
  select: {
    padding: '6px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '14px',
  },

  filterBar: {
    position: 'sticky',
    top: 0,
    zIndex: 10,
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '24px',
    padding: '16px 24px',
    background: '#ffffff',
    borderBottom: '1px solid #e0e0e0',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.05)',
    overflowX: 'auto',
    boxSizing: 'border-box'
  },
  filterGroup: {
    display: 'flex',
    flexDirection: 'column',
    minWidth: '150px',
    fontFamily: `'Segoe UI', sans-serif`
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '6px'
  },
  select: {
    padding: '8px 12px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '14px',
    fontFamily: `'Segoe UI', sans-serif`,
    outline: 'none',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
    backgroundColor: '#fff',
    boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
    cursor: 'pointer'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill,minmax(240px,1fr))',
    gap: '24px',
    padding: '32px',
    background: '#fdfdfd'
  },
  card: {
    position: 'relative',
    background: '#fff',
    borderRadius: '10px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    cursor: 'pointer',
    overflow: 'hidden',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease'
  },
  cardHeader: {
    position: 'absolute',
    top: '8px',
    right: '8px',
    display: 'flex',
    gap: '10px',
    zIndex: 2
  },
  iconBtn: {
    background: '#fff',
    border: '1px solid #ddd',
    borderRadius: '50%',
    padding: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
  },
  badge: {
    position: 'absolute',
    top: '-4px',
    right: '-4px',
    background: '#dc3545',
    color: '#fff',
    borderRadius: '50%',
    padding: '2px 6px',
    fontSize: '10px',
    fontWeight: 'bold'
  },
  image: {
    width: '100%',
    height: '180px',
    objectFit: 'cover'
  },
  emptyImageGap: {
    width: '100%',
    height: '180px',
    background: '#e0e0e0'
  },
  cardBody: {
    padding: '16px',
    textAlign: 'center'
  },
  name: {
    fontSize: '17px',
    fontWeight: '600',
    color: '#333',
    marginBottom: '8px'
  },
  price: {
    fontSize: '15px',
    color: '#007bff',
    fontWeight: '500',
    marginBottom: '6px'
  },
  stock: {
    fontSize: '13px',
    fontWeight: '500',
    marginTop: '4px'
  },
  qtyBtn: {
    padding: '8px 14px',
    fontSize: '18px',
    border: '1px solid #ccc',
    borderRadius: '6px',
    background: '#f9f9f9',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'background 0.2s ease'
  },
  modalAddBtn: {
    // marginTop: '16px',
    width: '28%',
    padding: '12px',
    background: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '600',
    transition: 'background 0.3s ease'
  },
  modalCloseBtn: {
    width: '25%',
    padding: '12px',
    background: '#6c757d',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '500'
  }
};
