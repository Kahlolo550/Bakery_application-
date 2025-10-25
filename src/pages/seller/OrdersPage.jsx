import React, { useEffect, useState, useCallback } from 'react';

function OrdersPage({ token, showNotification }) {
  const [orders, setOrders] = useState([]);

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch('http://localhost:5000/api/orders', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error('Error fetching orders:', err);
      showNotification('Failed to fetch orders', true);
    }
  }, [token, showNotification]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const updateProductStatus = async (orderId, productId, newStatus) => {
    try {
      const res = await fetch(`http://localhost:5000/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, status: newStatus }),
      });

      if (!res.ok) throw new Error('Failed to update status');

      setOrders(prev =>
        prev.map(order => {
          if (order.id === orderId) {
            const updatedProducts = order.products.map(p =>
              p.id === productId ? { ...p, status: newStatus } : p
            );
            const orderStatus =
              updatedProducts.every(p => p.status === 'completed') ? 'completed' : 'pending';
            return { ...order, products: updatedProducts, status: orderStatus };
          }
          return order;
        })
      );

      showNotification('Status updated successfully');
    } catch (err) {
      console.error(err);
      showNotification('Failed to update status', true);
    }
  };

  const customers = {};
  orders.forEach(order => {
    if (!customers[order.customerName]) customers[order.customerName] = [];
    customers[order.customerName].push(order);
  });

  return (
    <div className="container py-4">
      <h3 className="text-success mb-4">
        <i className="fas fa-clipboard-list me-2"></i>Orders by Customer
      </h3>

      {Object.keys(customers).length === 0 ? (
        <div className="text-center text-muted">
          <i className="fas fa-box-open fa-2x mb-2"></i>
          <p>No orders found.</p>
        </div>
      ) : (
        Object.entries(customers).map(([customerName, customerOrders]) => (
          <div key={customerName} className="mb-5">
            <h5 className="text-primary mb-3">
              <i className="fas fa-user me-2"></i>{customerName}
            </h5>
            <div className="row">
              {customerOrders.map(order => (
                <div key={order.id} className="col-md-6 col-lg-4 mb-4">
                  <div className="card shadow-sm border-0 h-100">
                    <div className="card-body">
                      <p className="mb-2 small text-muted">
                        <strong>Order #{order.id}</strong><br />
                        <strong>Status:</strong>{' '}
                        <span className={`badge ${order.status === 'completed' ? 'bg-success' : 'bg-warning text-dark'}`}>
                          {order.status}
                        </span><br />
                        <strong>Date:</strong> {new Date(order.orderDate).toLocaleString()}<br />
                        <strong>Address:</strong> {order.address}<br />
                        <strong>Phone:</strong> {order.phone}
                      </p>
                      <div className="row">
                        {order.products.map(product => (
                          <div key={product.id} className="col-6 text-center mb-3">
                            <img
                              src={product.photo.startsWith('http') ? product.photo : `http://localhost:5000${product.photo}`}
                              alt={product.name}
                              className="img-fluid rounded"
                              style={{ height: '60px', objectFit: 'cover' }}
                            />
                            <p className="mt-2 mb-1 fw-semibold small">{product.name}</p>
                            <p className="mb-1 small text-muted">Qty: {product.quantity}</p>
                            {product.status === 'completed' ? (
                              <span className="badge bg-success small">Completed</span>
                            ) : (
                              <button
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => updateProductStatus(order.id, product.id, 'completed')}
                              >
                                <i className="fas fa-check me-1"></i>Complete
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default OrdersPage;
