import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';

function ProductList({ token, showNotification }) {
  const [products, setProducts] = useState([]);

  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch('http://localhost:5000/api/products/mine', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error(err);
      showNotification('Failed to fetch products', true);
    }
  }, [token, showNotification]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const formatCurrency = (amount) => {
    const formatted = new Intl.NumberFormat('en-LS', {
      style: 'currency',
      currency: 'LSL',
      minimumFractionDigits: 2,
    }).format(amount);
    return formatted.replace('LSL', 'M');
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      const res = await fetch(`http://localhost:5000/api/products/${productId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      showNotification(data.message || 'Product deleted');
      fetchProducts();
    } catch (err) {
      console.error('Delete error:', err);
      showNotification('Failed to delete product', true);
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="text-success">
          <i className="fas fa-bread-slice me-2"></i>My Products
        </h3>
        <Link to="/retailer/add-product" className="btn btn-primary btn-sm">
          <i className="fas fa-plus me-1"></i> Add Product
        </Link>
      </div>

      <div className="row">
        {products.length === 0 ? (
          <div className="col-12 text-center text-muted">
            <i className="fas fa-box-open fa-2x mb-2"></i>
            <p>No products found.</p>
          </div>
        ) : (
          products.map(product => (
            <div key={product.id} className="col-6 col-sm-4 col-md-3 mb-4">
              <div className="card h-100 shadow-sm border-0">
                <img
                  src={
                    product.photo.startsWith('http')
                      ? product.photo
                      : `http://localhost:5000${product.photo}`
                  }
                  alt={product.name}
                  className="card-img-top"
                  style={{
                    height: '160px',
                    objectFit: 'cover',
                    borderTopLeftRadius: '0.5rem',
                    borderTopRightRadius: '0.5rem',
                  }}
                />
                <div className="card-body text-center">
                  <h6 className="card-title mb-1">
                    <i className="fas fa-tag me-1 text-secondary"></i>{product.name}
                  </h6>
                  <p className="mb-1 text-success fw-bold">
                    <i className="fas fa-money-bill-wave me-1"></i>{formatCurrency(product.price)}
                  </p>
                  <p className="mb-2 text-muted small">
                    <i className="fas fa-layer-group me-1"></i>{product.category}
                  </p>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDelete(product.id)}
                  >
                    <i className="fas fa-trash-alt me-1"></i> Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ProductList;
