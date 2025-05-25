import React, { useEffect, useState } from 'react';
import axios from '../../api/axiosInstance';
import Navbar from '../../components/Navbar';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import { toast } from 'react-toastify';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [drafts, setDrafts] = useState({}); // { orderId: { rating, comment } }

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    try {
      const res = await axios.get('/customer/orders');
      setOrders(res.data);
    } catch (err) {
      console.error('Error fetching orders:', err);
    }
  }

  function updateDraft(orderId, fields) {
    setDrafts(d => ({
      ...d,
      [orderId]: { ...d[orderId], ...fields },
    }));
  }

  async function submitReview(order) {
    const draft = drafts[order.id];
    if (!draft?.rating) {
      toast.error('Please select a rating');
      return;
    }
    const userEmail = localStorage.getItem('email') || '';
    try {
      await axios.post(
        `/products/${order.product.id}/reviews`,
        {
          rating: draft.rating,
          comment: draft.comment || '',
          reviewer: userEmail,
        }
      );
      toast.success('Review submitted!');
      setDrafts(d => {
        const copy = { ...d };
        delete copy[order.id];
        return copy;
      });
      fetchOrders();
    } catch {
      toast.error('Failed to submit review');
    }
  }

  function StarInput({ orderId }) {
    const { rating = 0 } = drafts[orderId] || {};
    const icons = [];

    for (let i = 1; i <= 5; i++) {
      const Icon =
        i <= rating
          ? FaStar
          : i - 0.5 <= rating
            ? FaStarHalfAlt
            : FaRegStar;

      icons.push(
        <Icon
          key={i}
          style={styles.starIcon}
          onClick={() => updateDraft(orderId, { rating: i })}
        />
      );
    }

    return <div style={styles.starRow}>{icons}</div>;
  }

  function StarRating({ rating, maxStars = 5 }) {
    const stars = [];
    let rem = rating;

    for (let i = 0; i < maxStars; i++) {
      if (rem >= 1) {
        stars.push(<FaStar key={i} />);
        rem--;
      } else if (rem >= 0.5) {
        stars.push(<FaStarHalfAlt key={i} />);
        rem = 0;
      } else {
        stars.push(<FaRegStar key={i} />);
      }
    }

    return <div style={styles.starRow}>{stars}</div>;
  }

  return (
    <>
      <Navbar />
      <div style={styles.container}>
        <h2 style={styles.heading}>📦 My Orders</h2>

        {orders.length === 0 ? (
          <p style={styles.empty}>You haven’t placed any orders yet.</p>
        ) : (
          <div style={styles.list}>
            {orders.map(order => (
              <div key={order.id} style={styles.card}>
                <p style={styles.productName}>{order.product.name}</p>
                <p style={styles.detail}>Qty: {order.quantity}</p>
                <p style={styles.detail}>
                  Total: ₹{(order.quantity * order.product.price).toFixed(2)}
                </p>
                <p style={styles.detail}>
                  Status: <strong style={styles.status}>{order.status}</strong>
                </p>
                <p style={styles.detail}>
                  Ordered On: {new Date(order.orderDate).toLocaleDateString()}
                </p>
                <p style={styles.detail}>
                  Delivery: <strong style={styles.status}>{order.deliveryStatus}</strong>
                </p>

                <div style={styles.reviewSection}>
                  <span style={styles.reviewLabel}>Avg Rating:</span>
                  <StarRating rating={order.product.averageRating || 0} />
                  <span style={styles.reviewCount}>
                    ({order.product.reviewCount || 0})
                  </span>
                </div>

                {(!order.product.reviewCount || !order.productReviewed) ? (
                  <div style={styles.draftSection}>
                    <span style={styles.draftLabel}>Add Reviews & Ratings</span>
                    <StarInput orderId={order.id} />
                    <textarea
                      rows={3}
                      placeholder="Write a comment..."
                      style={styles.textarea}
                      value={drafts[order.id]?.comment || ''}
                      onChange={(e) =>
                        updateDraft(order.id, { comment: e.target.value })
                      }
                    />

                    <button
                      style={styles.submitBtn}
                      onClick={() => submitReview(order)}
                    >
                      Submit Review
                    </button>
                  </div>
                ) : (
                  <p style={styles.thanks}>Thanks for your review!</p>
                )}
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
    maxWidth: '1000px',
    margin: '40px auto',
    padding: '20px',
    backgroundColor: '#fafafa',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
  },
  heading: {
    marginBottom: '24px',
    fontSize: '24px',
    textAlign: 'center',
    color: '#333',
  },
  empty: {
    textAlign: 'center',
    fontStyle: 'italic',
    color: '#777',
  },
  list: {
    display: 'grid',
    gap: '20px',
  },
  card: {
    padding: '16px',
    background: '#fff',
    borderRadius: '6px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
  },
  productName: {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '8px',
    color: '#222',
  },
  detail: {
    margin: '4px 0',
    fontSize: '14px',
    color: '#555',
  },
  status: {
    color: '#2a9d8f',
  },
  reviewSection: {
    marginTop: '16px',
    paddingTop: '12px',
    borderTop: '1px solid #eee',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  reviewLabel: {
    fontSize: '14px',
    fontWeight: '500',
  },
  starRow: {
    display: 'inline-flex',
    gap: '4px',
    color: '#ffc107',
  },
  starIcon: {
    cursor: 'pointer',
    fontSize: '20px',
  },
  reviewCount: {
    fontSize: '13px',
    color: '#555',
  },
  draftSection: {
    marginTop: '12px',
    padding: '12px',
    background: '#fff8e1',
    borderRadius: '6px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  draftLabel: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#333',
  },
  textarea: {
    width: '90%',
    // textAlign: 'center',
    borderRadius: '4px',
    border: '1px solid #ccc',
    padding: '8px',
    fontSize: '14px',
    resize: 'vertical',
  },
  submitBtn: {
    alignSelf: 'flex-end',
    padding: '8px 16px',
    background: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  thanks: {
    marginTop: '12px',
    fontStyle: 'italic',
    color: '#2a9d8f',
  },
};
