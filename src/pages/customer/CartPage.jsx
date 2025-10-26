import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000';

function CartPage({ token, refreshCart, showNotification }) {
  const [cartItems, setCartItems] = useState([]);
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

  const updateQuantity = async (id, qty) => {
    if (qty < 1) return;
    try {
      await fetch(`${API_BASE}/api/cart/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity: qty }),
      });
      setCartItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, quantity: qty } : item))
      );
      refreshCart();
      showNotification('Quantity updated successfully.');
    } catch (err) {
      console.error(err);
      showNotification('Failed to update quantity.', true);
    }
  };

  const removeItem = async (id) => {
    try {
      await fetch(`${API_BASE}/api/cart/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems((prev) => prev.filter((item) => item.id !== id));
      refreshCart();
      showNotification('Item removed from cart.');
    } catch (err) {
      console.error(err);
      showNotification('Failed to remove item.', true);
    }
  };

  const goToCheckout = () => navigate('/customer/checkout');

  return (
    <div className="container py-4">
      <h3 className="text-success mb-4">
        <i className="fas fa-shopping-cart me-2"></i>Your Cart
      </h3>

      {cartItems.length === 0 ? (
        <div className="text-center text-muted">
          <i className="fas fa-box-open fa-2x mb-2"></i>
          <p>Your cart is empty.</p>
        </div>
      ) : (
        <div className="row">
          {cartItems.map((item) => (
            <div key={item.id} className="col-md-6 col-lg-4 mb-4">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-body">
                  <h5 className="card-title">{item.productName}</h5>
                  <div className="mb-3">
                    <label className="form-label">Quantity</label>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        updateQuantity(item.id, parseInt(e.target.value))
                      }
                      className="form-control"
                    />
                  </div>
                  <button
                    className="btn btn-sm btn-outline-danger w-100"
                    onClick={() => removeItem(item.id)}
                  >
                    <i className="fas fa-trash me-2"></i>Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
          <div className="col-12 text-center mt-4">
            <button className="btn btn-success btn-lg" onClick={goToCheckout}>
              <i className="fas fa-credit-card me-2"></i>Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CartPage;
