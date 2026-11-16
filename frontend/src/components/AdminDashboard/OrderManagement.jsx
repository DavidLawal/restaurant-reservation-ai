import React from 'react';

const OrderManagement = ({ orders, onUpdateOrderStatus }) => {
  return (
    <div className="admin-section">
      <h3>Order Management</h3>
      <div className="orders-list">
        {orders.length === 0 ? (
          <p>No orders yet</p>
        ) : (
          orders.map(order => (
            <div key={order.id} className="order-item">
              <div className="order-header">
                <h4>Order #{order.id}</h4>
                <span className={`status ${order.status}`}>{order.status}</span>
              </div>
              <div className="order-details">
                <p><strong>Items:</strong> {order.items.map(i => i.name).join(', ')}</p>
                <p><strong>Total:</strong> ${order.total.toFixed(2)}</p>
                <p><strong>Date:</strong> {order.date}</p>
              </div>
              <div className="order-actions">
                <select
                  value={order.status}
                  onChange={(e) => onUpdateOrderStatus(order.id, e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="preparing">Preparing</option>
                  <option value="ready">Ready</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OrderManagement;