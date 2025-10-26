import React, { useEffect, useState, useCallback } from 'react';

function CustomerOrders({ token, showNotification }) {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');

  // 🔗 Hardcoded Railway backend URL
  const BACKEND_URL = 'https://bakeryapplication-production.up.railway.app';

  const fetchOrders = useCallback(() => {
    fetch(`${BACKEND_URL}/api/orders/customer`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setOrders(data || []))
      .catch((err) => {
        console.error('Order fetch error:', err);
        showNotification('Failed to load orders.', true);
      });
  }, [token, showNotification]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const deleteOrder = async (orderId) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/orders/${orderId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setOrders((prev) => prev.filter((o) => o.id !== orderId));
        showNotification('Order deleted successfully.');
      } else {
        const data = await res.json();
        showNotification(data.error || 'Failed to delete order.', true);
      }
    } catch (err) {
      console.error('Delete error:', err);
      showNotification('Network error while deleting order.', true);
    }
  };

  const filteredOrders = statusFilter === 'all'
    ? orders
    : orders.filter(order => order.status === statusFilter);

  return (
    <div className="container py-4">
      <h3 className="text-primary mb-4">
        <i className="fas fa-receipt me-2"></i>My Orders
      </h3>

      <div className="mb-4">
        <label className="form-label">Filter by Status</label>
        <select
          className="form-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="text-center text-muted">
          <i className="fas fa-box-open fa-2x mb-2"></i>
          <p>No orders match this filter.</p>
        </div>
      ) : (
        <div className="row">
          {filteredOrders.map((order) => (
            <div key={order.id} className="col-md-6 col-lg-4 mb-4">
              <div className="card shadow-sm border-0 h-100">
                <div className="card-body">
                  <h5 className="card-title">Order #{order.id}</h5>
                  <p className="card-text small text-muted">
                    <strong>Status:</strong>{' '}
                    <span className={`badge ${order.status === 'completed' ? 'bg-success' : 'bg-warning text-dark'}`}>
                      {order.status}
                    </span>
                    <br />
                    <strong>Date:</strong> {new Date(order.orderDate).toLocaleString()}
                    <br />
                    <strong>Address:</strong> {order.address}
                    <br />
                    <strong>Phone:</strong> {order.phone}
                  </p>

                  <ul className="list-group mb-3">
                    {order.products.map((p) => (
                      <li key={p.id} className="list-group-item d-flex justify-content-between align-items-center">
                        {p.name}
                        <span className="badge bg-secondary">Qty: {p.quantity}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    className="btn btn-outline-danger w-100"
                    onClick={() => deleteOrder(order.id)}
                  >
                    <i className="fas fa-trash me-2"></i>Delete Order
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CustomerOrders;
