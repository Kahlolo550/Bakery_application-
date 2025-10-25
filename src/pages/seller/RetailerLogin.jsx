import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function RetailerLogin({ onLogin }) {
  const [contactEmail, setContactEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const login = async () => {
    setError('');
    if (!contactEmail || !password) {
      setError('Email and password are required.');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/auth/login/retailer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contactEmail, password })
      });

      const data = await res.json();

      if (res.ok && data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userType', 'retailer');
        onLogin(data.token, 'retailer');
        navigate('/retailer/dashboard');
      } else {
        setError(data.error || 'Login failed. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please check your connection.');
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '500px' }}>
      <div className="card shadow-sm border-0">
        <div className="card-body">
          <h3 className="text-center text-success mb-4">
            <i className="fas fa-sign-in-alt me-2"></i>Retailer Login
          </h3>

          {error && (
            <div className="alert alert-danger text-center py-2">{error}</div>
          )}

          <div className="mb-3">
            <label className="form-label">Contact Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="e.g. sweetcrumbs@gmail.com"
              value={contactEmail}
              onChange={e => setContactEmail(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          <button className="btn btn-success w-100" onClick={login}>
            <i className="fas fa-lock me-2"></i>Login
          </button>

          <div className="text-center mt-3">
            <small>
              Don’t have an account?{' '}
              <Link to="/retailer/register" className="text-decoration-none">
                Register here
              </Link>
            </small>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RetailerLogin;
