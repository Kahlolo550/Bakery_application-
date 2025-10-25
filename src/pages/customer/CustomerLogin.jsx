import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function CustomerLogin({ onLogin, showNotification }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const login = async () => {
    if (!email || !password) {
      showNotification('Email and password are required.', true);
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/auth/login/customer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.token) {
        onLogin(data.token, 'customer');
        showNotification('Login successful!');
        navigate('/customer/dashboard');
      } else {
        showNotification(data.error || 'Login failed. Please try again.', true);
      }
    } catch (err) {
      showNotification('Network error. Please check your connection.', true);
    }
  };

  return (
    <div className="container py-4" style={{ maxWidth: '500px' }}>
      <div className="card shadow-sm border-0">
        <div className="card-body">
          <h3 className="text-center text-primary mb-4">
            <i className="fas fa-sign-in-alt me-2"></i>Customer Login
          </h3>

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="e.g. kahlolo@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className="btn btn-primary w-100" onClick={login}>
            <i className="fas fa-lock me-2"></i>Login
          </button>

          <div className="text-center mt-3">
            <small>
              Don’t have an account?{' '}
              <Link to="/customer/register" className="text-decoration-none">
                Register here
              </Link>
            </small>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomerLogin;
