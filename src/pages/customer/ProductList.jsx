import React, { useState, useEffect } from 'react';
import API_BASE from '../../config/api';

function CustomerProductList({ token, refreshCart, showNotification }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE}/api/products/all`)
      .then(res => res.json())
      .then(data => setProducts(data.products || []))
      .catch(err => console.error('Product fetch error:', err));
  }, []);

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
    } catch {
      showNotification('Something went wrong while adding to cart.', true);
    }
  };

  return (
    <div className="container py-4">
      <h2 className="text-center text-success mb-4">
        <i className="fas fa-store me-2"></i>Available Products
      </h2>
      <div className="row">
        {products.map((p) => {
          const imageUrl = p.photo?.startsWith('http') ? p.photo : `${API_BASE}${p.photo}`;
          return (
            <div key={p.id} className="col-md-6 col-lg-4 mb-4">
              <div className="card h-100 shadow-sm border-0">
                <img src={imageUrl} alt={p.name} className="card-img-top" style={{ height: '200px', objectFit: 'cover' }} />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{p.name}</h5>
                  <p className="card-text fw-bold text-success">R{p.price}</p>
                  <p className="card-text text-muted small"><i className="fas fa-user me-1"></i>Sold by: {p.retailerName}</p>
                  <p className="card-text small">{p.description}</p>
                  <button className="btn btn-outline-success mt-auto" onClick={() => addToCart(p)}>
                    <i className="fas fa-cart-plus me-2"></i>Add to Cart
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {products.length === 0 && (
        <div className="text-center text-muted mt-5">
          <i className="fas fa-box-open fa-2x mb-2"></i>
          <p>No products available at the moment.</p>
        </div>
      )}
    </div>
  );
}

export default CustomerProductList;
