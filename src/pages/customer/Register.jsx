import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API_BASE from '../../config/api';

function CustomerRegister({ showNotification }) {
  const [form, setForm] = useState({
    username: '',
    password: '',
    confirm: '',
    email: '',
    fullName: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const register = async () => {
    if (form.password.trim() !== form.confirm.trim()) {
      showNotification('Passwords do not match.', true);
      return;
    }

    if (!form.username.trim() || !form.email.trim() || !form.fullName.trim()) {
      showNotification('All fields are required.', true);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/register/customer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: form.username.trim(),
          password: form.password.trim(),
          email: form.email.trim(),
          fullName: form.fullName.trim()
        })
      });

      if (res.ok) {
        showNotification('Customer registered successfully!');
        navigate('/customer/login');
      } else {
        const data = await res.json();
        showNotification(data.error || 'Registration failed.', true);
      }
    } catch {
      showNotification('Network error. Please try again.', true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4" style={{ maxWidth: '500px' }}>
      <div className="card shadow-sm border-0">
        <div className="card-body">
          <h3 className="text-center text-primary mb-4">
            <i className="fas fa-user-plus me-2"></i>Customer Registration
          </h3>
          <input type="text" className="form-control mb-3" placeholder="Full Name"
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            disabled={loading}
          />
          <input type="email" className="form-control mb-3" placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            disabled={loading}
          />
          <input type="text" className="form-control mb-3" placeholder="Username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            disabled={loading}
          />
          <input type="password" className="form-control mb-3" placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            disabled={loading}
          />
          <input type="password" className="form-control mb-4" placeholder="Confirm Password"
            value={form.confirm}
            onChange={(e) => setForm({ ...form, confirm: e.target.value })}
            disabled={loading}
          />
          <button className="btn btn-primary w-100" onClick={register} disabled={loading}>
            <i className="fas fa-check-circle me-2"></i>{loading ? 'Registering...' : 'Register'}
          </button>
          <div className="text-center mt-3">
            <small>Already have an account? <Link to="/customer/login">Log in here</Link></small>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomerRegister;
