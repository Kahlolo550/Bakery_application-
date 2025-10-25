import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function RetailerRegister() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [storeName, setStoreName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const register = async () => {
    setError('');

    if (password !== confirm) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/auth/register/retailer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, contactEmail, storeName })
      });

      if (res.ok) {
        alert('Retailer registered!');
        navigate('/retailer/login');
      } else {
        const data = await res.json();
        setError(data.error || 'Registration failed.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '500px' }}>
      <div className="card shadow-sm border-0">
        <div className="card-body">
          <h3 className="text-center text-success mb-4">
            <i className="fas fa-store me-2"></i>Retailer Registration
          </h3>

          {error && (
            <div className="alert alert-danger text-center py-2">{error}</div>
          )}

          <div className="mb-3">
            <label className="form-label">Store Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Sweet Crumbs Bakery"
              value={storeName}
              onChange={e => setStoreName(e.target.value)}
            />
          </div>

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

          <div className="mb-3">
            <label className="form-label">Username</label>
            <input
              type="text"
              className="form-control"
              placeholder="Choose a username"
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Create a password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Re-enter password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
            />
          </div>

          <button className="btn btn-success w-100" onClick={register}>
            <i className="fas fa-user-plus me-2"></i>Register
          </button>

          <div className="text-center mt-3">
            <small>
              Already have an account?{' '}
              <Link to="/retailer/login" className="text-decoration-none">
                Log in here
              </Link>
            </small>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RetailerRegister;
