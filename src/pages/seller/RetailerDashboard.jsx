import React from 'react';
import { Link } from 'react-router-dom';
import ProductList from './ProductList';

function RetailerDashboard({ token, showNotification }) {
  return (
    <div className="container py-4">
      {/* Header */}
      <div className="mb-4 text-center">
        <h2 className="fw-bold text-success">
          <i className="fas fa-store me-2"></i>Bakery Retailer Dashboard
        </h2>
        <p className="text-muted fs-6" style={{ maxWidth: '800px', margin: '0 auto', lineHeight: '1.8' }}>
          Welcome to your bakery management dashboard — the central hub for running your online bakery store with ease and confidence. This system is built specifically for small and medium-sized bakeries in Lesotho, helping you digitize your operations and serve customers more efficiently.
          <br /><br />
          Whether you're selling fresh bread, muffins, scones, or custom cakes, this dashboard gives you full control over your product catalog. You can upload product images, set prices in Lesotho loti (<strong>M</strong>), assign categories, and manage your inventory in real time. The platform is mobile-friendly and optimized for quick updates, so you can make changes from your shop, your phone, or even while prepping for a busy morning.
        </p>
      </div>

      {/* Quick Guide */}
      <div className="card shadow-sm border-0 mb-5">
        <div className="card-body">
          <h5 className="fw-semibold mb-3">
            <i className="fas fa-lightbulb text-warning me-2"></i>Getting Started
          </h5>
          <ul className="list-unstyled">
            <li className="mb-3">
              <i className="fas fa-plus-circle text-primary me-2"></i>
              <strong>Add New Products</strong> — Upload images, set prices, and describe your baked goods.
            </li>
            <li className="mb-3">
              <i className="fas fa-boxes text-dark me-2"></i>
              <strong>Manage Listings</strong> — Edit, delete, or update your product catalog anytime.
            </li>
            <li className="mb-3">
              <i className="fas fa-clipboard-check text-success me-2"></i>
              <strong>Track Orders</strong> — View incoming customer orders and prepare them for delivery or pickup.
            </li>
          </ul>
        </div>
      </div>

      {/* Quick Links */}
      <div className="row text-center mb-5">
        <div className="col-md-4 mb-3">
          <Link to="/retailer/add-product" className="btn btn-lg btn-outline-primary w-100">
            <i className="fas fa-plus me-2"></i>Add Product
          </Link>
        </div>
        <div className="col-md-4 mb-3">
          <Link to="/retailer/orders" className="btn btn-lg btn-outline-success w-100">
            <i className="fas fa-clipboard-list me-2"></i>View Orders
          </Link>
        </div>
        <div className="col-md-4 mb-3">
          <Link to="/retailer/products" className="btn btn-lg btn-outline-dark w-100">
            <i className="fas fa-boxes me-2"></i>Manage Products
          </Link>
        </div>
      </div>

      {/* Product List */}
      <ProductList token={token} retailerOnly={true} showNotification={showNotification} />
    </div>
  );
}

export default RetailerDashboard;
