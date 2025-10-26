import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000';

function CheckoutPage({ token, refreshCart, showNotification }) {
  const [cartItems, setCartItems] = useState([]);
  const [formData, setFormData] = useState({ address: '', phone: '', note: '' });
  const navigate = useNavigate();

  const fetchCart = useCallback(() => {
    if (!token) return;
    fetch(`${API_BASE}/api/cart`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setCartItems(data))
      .catch((err) => console.error('Cart fetch error:', err));
  }, [token]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const placeOrder = async () => {
    if (!formData.address || !formData.phone) {
      showNotification('Address and phone are required.', true);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        showNotification(data.message || 'Order placed successfully!');
        refreshCart();
        navigate('/customer/dashboard');
      } else {
        showNotification(data.error || 'Failed to place order.', true);
      }
    } catch (err) {
      console.error('Checkout error:', err);
      showNotification('Failed to place order.', true);
    }
  };

  return (
    <div className="container py-4" style={{ maxWidth: '600px' }}>
      <div className="card shadow-sm border-0">
        <div className="card-body">
          <h3 className="text-success mb-4 text-center">
            <i className="fas fa-credit-card me-2"></i>Checkout
          </h3>

          {cartItems.length === 0 ? (
            <div className="text-center text-muted">
              <i className="fas fa-box-open fa-2x mb-2"></i>
              <p>Your cart is empty.</p>
            </div>
          ) : (
            <>
              <h5 className="mb-3">Order Summary</h5>
              <ul className="list-group mb-4">
                {cartItems.map((item) => (
                  <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
                    {item.productName}
                    <span className="badge bg-secondary">Qty: {item.quantity}</span>
                  </li>
                ))}
              </ul>

              <div className="mb-3">
                <label className="form-label">Delivery Address</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. House #12, Maseru East"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Phone Number</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. +266 5800 1234"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div className="mb-4">
                <label className="form-label">Note (optional)</label>
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="Any special instructions?"
                  value={formData.note}
                  onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                />
              </div>

              <button className="btn btn-success w-100" onClick={placeOrder}>
                <i className="fas fa-check-circle me-2"></i>Place Order
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;
