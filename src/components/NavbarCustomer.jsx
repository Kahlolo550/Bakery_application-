import React from 'react';
import { Link } from 'react-router-dom';

function NavbarCustomer({ cartItems, onLogout }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light mb-4 rounded">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/customer/dashboard">
          <i className="fas fa-shopping-bag me-2"></i>Customer Panel
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#customerNavbar"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="customerNavbar">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/customer/dashboard">
                <i className="fas fa-store me-2"></i>Browse Products
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/customer/orders">
                <i className="fas fa-receipt me-2"></i>My Orders
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
              <ul
                className="dropdown-menu dropdown-menu-end p-2"
                style={{ minWidth: '250px' }}
              >
                {cartItems.length === 0 ? (
                  <li className="dropdown-item text-muted">
                    Cart is empty
                    <div className="mt-2">
                      <Link
                        to="/customer/dashboard"
                        className="btn btn-sm btn-outline-primary w-100"
                      >
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
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <Link className="dropdown-item text-center" to="/customer/cart">
                    View Full Cart
                  </Link>
                </li>
              </ul>
            </li>
          </ul>

          {/* Logout Button */}
          <button className="btn btn-outline-dark" onClick={onLogout}>
            <i className="fas fa-sign-out-alt me-2"></i>Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default NavbarCustomer;
