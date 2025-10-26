import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API_BASE from '../../config/api';

function RetailerRegister({ showNotification }) {
  const [form, setForm] = useState({
    username: '',
    password: '',
    confirm: '',
    contactEmail: '',
    storeName: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const register = async () => {
    if (loading) return;

    const { username, password, confirm, contactEmail, storeName } = form;
    const trimmed = {
      username: username.trim(),
      password: password.trim(),
      confirm: confirm.trim(),
      contactEmail: contactEmail.trim(),
      storeName: storeName.trim()
    };

    // ✅ Validation
    if (!trimmed.username || !trimmed.password || !trimmed.confirm || !trimmed.contactEmail || !trimmed.storeName) {
      showNotification('All fields are required.', true);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed.contactEmail)) {
      showNotification('Please enter a valid email address.', true);
      return;
    }

    if (trimmed.password.length < 6) {
      showNotification('Password must be at least 6 characters.', true);
      return;
    }

    if (trimmed.password !== trimmed.confirm) {
      showNotification('Passwords do not match.', true);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/register/retailer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: trimmed.username,
          password: trimmed.password,
          contactEmail: trimmed.contactEmail,
          storeName: trimmed.storeName
        })
      });

      let data;
      try {
        data = await res.json();
      } catch {
        const raw = await res.text();
        console.error('⚠️ Raw response:', raw);
        showNotification('Unexpected server response.', true);
        return;
      }

      if (res.ok) {
        showNotification(data.message || 'Retailer registered successfully!');
        navigate('/retailer/login');
      } else {
        showNotification(data.error || 'Registration failed.', true);
      }
    } catch (err) {
      console.error('❌ Retailer registration error:', err);
      showNotification('Network error. Please try again.', true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4" style={{ maxWidth: '500px' }}>
      <div className="card shadow-sm border-0">
        <div className="card-body">
          <h3 className="text-center text-success mb-4">
            <i className="fas fa-store me-2"></i>Retailer Registration
          </h3>

          <input
            type="text"
            className="form-control mb-3"
            placeholder="Store Name"
            value={form.storeName}
            onChange={(e) => setForm({ ...form, storeName: e.target.value })}
            disabled={loading}
          />

          <input
            type="email"
            className="form-control mb-3"
            placeholder="Contact Email"
            value={form.contactEmail}
            onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
            disabled={loading}
          />

          <input
            type="text"
            className="form-control mb-3"
            placeholder="Username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            disabled={loading}
          />

          <input
            type="password"
            className="form-control mb-3"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            disabled={loading}
          />

          <input
            type="password"
            className="form-control mb-4"
            placeholder="Confirm Password"
            value={form.confirm}
            onChange={(e) => setForm({ ...form, confirm: e.target.value })}
            disabled={loading}
          />

          <button
            className="btn btn-success w-100"
            onClick={register}
            disabled={loading}
          >
            <i className="fas fa-user-plus me-2"></i>
            {loading ? 'Registering...' : 'Register'}
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
