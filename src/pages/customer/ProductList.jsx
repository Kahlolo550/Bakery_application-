import React, { useState, useEffect } from 'react';
import API_BASE from '../../config/api';

function CustomerProductList({ token, refreshCart, showNotification }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/api/products/all`);
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || 'Failed to fetch products');
        }
        const data = await res.json();
        setProducts(data.products || []);
      } catch (err) {
        console.error('Product fetch error:', err);
        showNotification(err.message || 'Failed to fetch products', true);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [showNotification]);

  const formatCurrency = (amount) => {
    const formatted = new Intl.NumberFormat('en-LS', {
      style: 'currency',
      currency: 'LSL',
      minimumFractionDigits: 2,
    }).format(amount);
    return formatted.replace('LSL', 'M');
  };

  const addToCart = async (product) => {
    if (!token) {
      showNotification('You must be logged in to add items to the cart.', true);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId: product.id, quantity: 1 }),
      });

      const data = await res.json();
      if (res.ok) {
        showNotification(`${product.name} added to cart!`);
        refreshCart();
      } else {
        showNotification(data.error || 'Failed to add to cart.', true);
      }
    } catch (err) {
      console.error('Add to cart error:', err);
      showNotification('Something went wrong while adding to cart.', true);
    }
  };

  return (
    <div className="container py-4">
      <h2 className="text-center text-success mb-4">
        <i className="fas fa-store me-2"></i>Available Products
      </h2>

      {loading ? (
        <div className="text-center text-muted">
          <i className="fas fa-spinner fa-spin me-2"></i>Loading products...
        </div>
      ) : (
        <div className="row">
          {products.length === 0 ? (
            <div className="col-12 text-center text-muted mt-5">
              <i className="fas fa-box-open fa-2x mb-2"></i>
              <p>No products available at the moment.</p>
            </div>
          ) : (
            products.map((p) => {
              // ✅ Ensure correct image URL for both local and deployed
              const imageUrl = p.photo?.startsWith('http')
                ? p.photo
                : `${API_BASE}${p.photo}`;

              return (
                <div key={p.id} className="col-md-6 col-lg-4 mb-4">
                  <div className="card h-100 shadow-sm border-0">
                    <img
                      src={imageUrl}
                      alt={p.name}
                      className="card-img-top"
                      style={{ height: '200px', objectFit: 'cover' }}
                    />
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title">{p.name}</h5>
                      <p className="card-text fw-bold text-success">
                        {formatCurrency(p.price)}
                      </p>
                      <p className="card-text text-muted small">
                        <i className="fas fa-user me-1"></i>Sold by: {p.retailerName}
                      </p>
                      <p className="card-text small">{p.description}</p>
                      <button
                        className="btn btn-outline-success mt-auto"
                        onClick={() => addToCart(p)}
                      >
                        <i className="fas fa-cart-plus me-2"></i>Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

export default CustomerProductList;
