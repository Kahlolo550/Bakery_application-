import React from 'react';
import { Link } from 'react-router-dom';

function NavbarRetailer({ onLogout }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4 rounded">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/retailer/dashboard">
          <i className="fas fa-store me-2"></i>Retailer Panel
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#retailerNavbar">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="retailerNavbar">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/retailer/products">
                <i className="fas fa-boxes me-2"></i>My Products
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/retailer/orders">
                <i className="fas fa-clipboard-list me-2"></i>Orders
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/retailer/add-product">
                <i className="fas fa-plus-circle me-2"></i>Add Product
              </Link>
            </li>
          </ul>
          <button className="btn btn-outline-light" onClick={onLogout}>
            <i className="fas fa-sign-out-alt me-2"></i>Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default NavbarRetailer;
