import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import CustomerLogin from './pages/customer/CustomerLogin';
import RetailerLogin from './pages/seller/RetailerLogin';
import ProductList from './pages/seller/ProductList';
import CustomerProductList from './pages/customer/ProductList';
import OrdersPage from './pages/seller/OrdersPage';
import AddProduct from './pages/seller/AddProduct';
import CustomerRegister from './pages/customer/Register';
import RetailerRegister from './pages/seller/Register';
import CartPage from './pages/customer/CartPage';
import CheckoutPage from './pages/customer/CheckoutPage';
import RetailerDashboard from './pages/seller/RetailerDashboard';
import CustomerOrders from './pages/customer/CustomerOrders';

import NavbarCustomer from './components/NavbarCustomer';
import NavbarRetailer from './components/NavbarRetailer';
import Notification from './components/Notification';
import Footer from './components/Footer';

function App() {
  const [token, setToken] = useState(null);
  const [userType, setUserType] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [notification, setNotification] = useState({ message: '', isError: false });

  const refreshCart = useCallback(() => {
    if (!token) return;
    fetch('http://localhost:5000/api/cart', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setCartItems(data))
      .catch((err) => console.error('Cart fetch error:', err));
  }, [token]);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedType = localStorage.getItem('userType');
    if (savedToken && savedType) {
      setToken(savedToken);
      setUserType(savedType);
      refreshCart();
    }
  }, [refreshCart]);

  const handleLogin = (token, type) => {
    setToken(token);
    setUserType(type);
    localStorage.setItem('token', token);
    localStorage.setItem('userType', type);
    refreshCart();
  };

  const handleLogout = () => {
    setToken(null);
    setUserType(null);
    setCartItems([]);
    localStorage.removeItem('token');
    localStorage.removeItem('userType');
  };

  const showNotification = (message, isError = false) => {
    setNotification({ message, isError });
    setTimeout(() => setNotification({ message: '', isError: false }), 3000);
  };

  return (
    <Router>
      <div className="d-flex flex-column min-vh-100">
        <div className="container mt-4 flex-grow-1" style={{ position: 'relative' }}>
          <Notification message={notification.message} isError={notification.isError} />

          {token && userType === 'retailer' && (
            <NavbarRetailer onLogout={handleLogout} />
          )}

          {token && userType === 'customer' && (
            <NavbarCustomer cartItems={cartItems} onLogout={handleLogout} />
          )}

          <Routes>
            {/* Auth */}
            <Route path="/customer/login" element={<CustomerLogin onLogin={handleLogin} showNotification={showNotification} />} />
            <Route path="/retailer/login" element={<RetailerLogin onLogin={handleLogin} showNotification={showNotification} />} />
            <Route path="/customer/register" element={<CustomerRegister showNotification={showNotification} />} />
            <Route path="/retailer/register" element={<RetailerRegister showNotification={showNotification} />} />

            {/* Customer */}
            <Route path="/customer/dashboard" element={token && userType === 'customer' ? (
              <CustomerProductList token={token} refreshCart={refreshCart} showNotification={showNotification} />
            ) : (
              <Navigate to="/customer/login" />
            )} />
            <Route path="/customer/cart" element={token && userType === 'customer' ? (
              <CartPage token={token} refreshCart={refreshCart} showNotification={showNotification} />
            ) : (
              <Navigate to="/customer/login" />
            )} />
            <Route path="/customer/checkout" element={token && userType === 'customer' ? (
              <CheckoutPage token={token} refreshCart={refreshCart} showNotification={showNotification} />
            ) : (
              <Navigate to="/customer/login" />
            )} />
            <Route path="/customer/orders" element={token && userType === 'customer' ? (
              <CustomerOrders token={token} showNotification={showNotification} />
            ) : (
              <Navigate to="/customer/login" />
            )} />

            {/* Retailer */}
            <Route path="/retailer/dashboard" element={token && userType === 'retailer' ? (
              <RetailerDashboard token={token} showNotification={showNotification} />
            ) : (
              <Navigate to="/retailer/login" />
            )} />
            <Route path="/retailer/add-product" element={token && userType === 'retailer' ? (
              <AddProduct token={token} showNotification={showNotification} />
            ) : (
              <Navigate to="/retailer/login" />
            )} />
            <Route path="/retailer/products" element={token && userType === 'retailer' ? (
              <ProductList token={token} retailerOnly={true} showNotification={showNotification} />
            ) : (
              <Navigate to="/retailer/login" />
            )} />
            <Route path="/retailer/orders" element={token && userType === 'retailer' ? (
              <OrdersPage token={token} showNotification={showNotification} />
            ) : (
              <Navigate to="/retailer/login" />
            )} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to={token ? `/${userType}/dashboard` : '/customer/login'} />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
