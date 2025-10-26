import React from 'react';
import { Link } from 'react-router-dom';

function NavbarCustomer({ cartItems, onLogout }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light mb-4 rounded shadow-sm">
      <div className="container-fluid">
        {/* Brand */}
        <Link className="navbar-brand fw-semibold text-success" to="/customer/dashboard">
          <i className="fas fa-shopping-bag me-2"></i>
          Customer Panel
        </Link>

        {/* Toggler for mobile */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#customerNavbar"
          aria-controls="customerNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Collapsible content */}
        <div className="collapse navbar-collapse" id="customerNavbar">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {/* Browse Products */}
            <li className="nav-item">
              <Link className="nav-link" to="/customer/dashboard">
                <i className="fas fa-store me-2"></i>
                Browse Products
              </Link>
            </li>

            {/* My Orders */}
            <li className="nav-item">
              <Link className="nav-link" to="/customer/orders">
                <i className="fas fa-receipt me-2"></i>
                My Orders
              </Link>
            </li>

            {/* Cart Dropdown */}
            <li className="nav-item dropdown">
              <button
                className="nav-link dropdown-toggle btn btn-link"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i className="fas fa-shopping-cart me-2"></i>
                Cart ({cartItems.length})
              </button>
              <ul className="dropdown-menu dropdown-menu-end p-2" style={{ minWidth: '260px' }}>
                {cartItems.length === 0 ? (
                  <li className="dropdown-item text-muted">
                    Cart is empty
                    <div className="mt-2">
                      <Link to="/customer/dashboard" className="btn btn-sm btn-outline-primary w-100">
                        Browse Products
                      </Link>
                    </div>
                  </li>
                ) : (
                  cartItems.map((item) => (
                    <li
                      key={item.id}
                      className="dropdown-item d-flex justify-content-between align-items-center"
                    >
                      <span>{item.productName}</span>
                      <span className="badge bg-secondary">{item.quantity}</span>
                    </li>
                  ))
                )}
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <Link className="dropdown-item text-center" to="/customer/cart">
                    View Full Cart
                  </Link>
                </li>
              </ul>
            </li>
          </ul>

          <button className="btn btn-outline-dark" onClick={onLogout}>
            <i className="fas fa-sign-out-alt me-2"></i>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default NavbarCustomer;
