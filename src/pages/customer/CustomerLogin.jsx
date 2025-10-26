import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API_BASE from '../../config/api';

function CustomerLogin({ onLogin, showNotification }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const login = async () => {
    if (!email.trim() || !password.trim()) {
      showNotification('Email and password are required.', true);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password: password.trim() }),
      });

      let data;
      try {
        data = await res.json();
      } catch {
        showNotification('Unexpected server response.', true);
        return;
      }

      if (res.ok && data.token && data.user.role === 'customer') {
        localStorage.setItem('token', data.token);
        onLogin(data.token, 'customer');
        showNotification('Login successful!');
        navigate('/customer/dashboard');
      } else {
        showNotification(data.error || 'Login failed.', true);
      }
    } catch (err) {
      console.error('Login fetch error:', err);
      showNotification(`Network error: ${err.message}`, true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4" style={{ maxWidth: '500px' }}>
      <div className="card shadow-sm border-0">
        <div className="card-body">
          <h3 className="text-center text-primary mb-4">
            <i className="fas fa-sign-in-alt me-2"></i>Customer Login
          </h3>
          <input
            type="email"
            className="form-control mb-3"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
          <input
            type="password"
            className="form-control mb-4"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
          <button className="btn btn-primary w-100" onClick={login} disabled={loading}>
            <i className="fas fa-lock me-2"></i>{loading ? 'Logging in...' : 'Login'}
          </button>
          <div className="text-center mt-3">
            <small>Don’t have an account? <Link to="/customer/register">Register here</Link></small>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomerLogin;
