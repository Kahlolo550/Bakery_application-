import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function CustomerLogin({ onLogin, showNotification }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 🔗 Hardcoded Railway backend URL
  const BACKEND_URL = 'https://bakeryapplication-production.up.railway.app';

  const login = async () => {
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      showNotification('Email and password are required.', true);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/login/customer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmedEmail, password: trimmedPassword }),
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
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') login();
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
              onKeyDown={handleKeyDown}
              disabled={loading}
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
              onKeyDown={handleKeyDown}
              disabled={loading}
            />
          </div>

          <button className="btn btn-primary w-100" onClick={login} disabled={loading}>
            <i className="fas fa-lock me-2"></i>
            {loading ? 'Logging in...' : 'Login'}
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
