import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function CustomerRegister({ showNotification }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const navigate = useNavigate();

  const register = async () => {
    if (password !== confirm) {
      showNotification('Passwords do not match.', true);
      return;
    }

    try {
      const res = await fetch('http://localhost:5000/api/auth/register/customer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, email, fullName }),
      });

      if (res.ok) {
        showNotification('Customer registered successfully!');
        navigate('/customer/login');
      } else {
        const data = await res.json();
        showNotification(data.error || 'Registration failed.', true);
      }
    } catch (err) {
      showNotification('Network error. Please try again.', true);
    }
  };

  return (
    <div className="container py-4" style={{ maxWidth: '500px' }}>
      <div className="card shadow-sm border-0">
        <div className="card-body">
          <h3 className="text-center text-primary mb-4">
            <i className="fas fa-user-plus me-2"></i>Customer Registration
          </h3>

          <div className="mb-3">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Kahlolo Mokoena"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

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

          <div className="mb-3">
            <label className="form-label">Username</label>
            <input
              type="text"
              className="form-control"
              placeholder="Choose a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="form-label">Confirm Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Re-enter password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
          </div>

          <button className="btn btn-primary w-100" onClick={register}>
            <i className="fas fa-check-circle me-2"></i>Register
          </button>

          <div className="text-center mt-3">
            <small>
              Already have an account?{' '}
              <Link to="/customer/login" className="text-decoration-none">
                Log in here
              </Link>
            </small>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomerRegister;
