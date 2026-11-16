import React, { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { menuData as initialMenuData } from '../data/menuData';

const Admin = () => {
  const [menuItems, setMenuItems] = useLocalStorage('adminMenu', initialMenuData);
  const [orders, setOrders] = useLocalStorage('orders', []);
  const [reservations, setReservations] = useLocalStorage('reservations', []);
  const [activeTab, setActiveTab] = useState('menu');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [newItem, setNewItem] = useState({
    name: '',
    category: 'starters',
    price: '',
    ingredients: '',
    description: '',
    dietary: []
  });

  const stats = {
    totalOrders: orders.length,
    todayOrders: orders.filter(order => order.date === new Date().toISOString().split('T')[0]).length,
    totalRevenue: orders.reduce((total, order) => total + order.total, 0),
    popularItem: menuItems.length > 0 ? 
      menuItems.reduce((prev, current) => 
        (orders.flatMap(o => o.items).filter(i => i.id === prev.id).length > 
         orders.flatMap(o => o.items).filter(i => i.id === current.id).length) ? prev : current
      ).name : 'No data'
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    const item = {
      id: editingItem ? editingItem.id : Date.now(),
      name: newItem.name,
      category: newItem.category,
      price: parseFloat(newItem.price),
      ingredients: newItem.ingredients.split(',').map(i => i.trim()),
      description: newItem.description,
      dietary: newItem.dietary
    };

    if (editingItem) {
      setMenuItems(prev => prev.map(i => i.id === editingItem.id ? item : i));
    } else {
      setMenuItems(prev => [...prev, item]);
    }

    setNewItem({
      name: '',
      category: 'starters',
      price: '',
      ingredients: '',
      description: '',
      dietary: []
    });
    setShowAddForm(false);
    setEditingItem(null);
  };

  const handleEditItem = (item) => {
    setEditingItem(item);
    setNewItem({
      name: item.name,
      category: item.category,
      price: item.price.toString(),
      ingredients: item.ingredients.join(', '),
      description: item.description,
      dietary: item.dietary
    });
    setShowAddForm(true);
  };

  const handleDeleteItem = (itemId) => {
    if (confirm('Are you sure you want to delete this item?')) {
      setMenuItems(prev => prev.filter(item => item.id !== itemId));
    }
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(order =>
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const updateReservationStatus = (reservationId, newStatus) => {
    setReservations(prev => prev.map(reservation =>
      reservation.id === reservationId ? { ...reservation, status: newStatus } : reservation
    ));
  };

  return (
    <div className="admin-dashboard">
      <div className="container">
        <h2>Admin Dashboard</h2>

        {/* Stats Overview */}
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Today's Orders</h3>
            <p className="stat-number">{stats.todayOrders}</p>
          </div>
          <div className="stat-card">
            <h3>Total Revenue</h3>
            <p className="stat-number">${stats.totalRevenue.toFixed(2)}</p>
          </div>
          <div className="stat-card">
            <h3>Total Orders</h3>
            <p className="stat-number">{stats.totalOrders}</p>
          </div>
          <div className="stat-card">
            <h3>Popular Item</h3>
            <p className="stat-number">{stats.popularItem}</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="tabs">
          <button 
            className={activeTab === 'menu' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('menu')}
          >
            Menu Management
          </button>
          <button 
            className={activeTab === 'orders' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('orders')}
          >
            Order Management
          </button>
          <button 
            className={activeTab === 'reservations' ? 'tab active' : 'tab'}
            onClick={() => setActiveTab('reservations')}
          >
            Reservation Management
          </button>
        </div>

        {/* Menu Management */}
        {activeTab === 'menu' && (
          <div className="admin-section">
            <div className="section-header">
              <h3>Menu Items</h3>
              <button 
                onClick={() => setShowAddForm(true)}
                className="btn btn-primary"
              >
                Add New Item
              </button>
            </div>

            {showAddForm && (
              <div className="modal-overlay">
                <div className="modal">
                  <h4>{editingItem ? 'Edit' : 'Add'} Menu Item</h4>
                  <form onSubmit={handleAddItem}>
                    <div className="form-group">
                      <label>Name:</label>
                      <input
                        type="text"
                        value={newItem.name}
                        onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Category:</label>
                      <select
                        value={newItem.category}
                        onChange={(e) => setNewItem(prev => ({ ...prev, category: e.target.value }))}
                      >
                        <option value="starters">Starters</option>
                        <option value="mains">Main Courses</option>
                        <option value="desserts">Desserts</option>
                        <option value="beverages">Beverages</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Price:</label>
                      <input
                        type="number"
                        step="0.01"
                        value={newItem.price}
                        onChange={(e) => setNewItem(prev => ({ ...prev, price: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Ingredients (comma separated):</label>
                      <input
                        type="text"
                        value={newItem.ingredients}
                        onChange={(e) => setNewItem(prev => ({ ...prev, ingredients: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Description:</label>
                      <textarea
                        value={newItem.description}
                        onChange={(e) => setNewItem(prev => ({ ...prev, description: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Dietary:</label>
                      <div>
                        {['vegetarian', 'vegan', 'gluten-free'].map(diet => (
                          <label key={diet}>
                            <input
                              type="checkbox"
                              checked={newItem.dietary.includes(diet)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setNewItem(prev => ({ ...prev, dietary: [...prev.dietary, diet] }));
                                } else {
                                  setNewItem(prev => ({ ...prev, dietary: prev.dietary.filter(d => d !== diet) }));
                                }
                              }}
                            />
                            {diet}
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className="form-actions">
                      <button type="submit" className="btn btn-primary">
                        {editingItem ? 'Update' : 'Add'} Item
                      </button>
                      <button 
                        type="button" 
                        onClick={() => {
                          setShowAddForm(false);
                          setEditingItem(null);
                          setNewItem({
                            name: '',
                            category: 'starters',
                            price: '',
                            ingredients: '',
                            description: '',
                            dietary: []
                          });
                        }}
                        className="btn btn-secondary"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            <div className="menu-items-admin">
              {menuItems.map(item => (
                <div key={item.id} className="admin-menu-item">
                  <div className="item-info">
                    <h4>{item.name}</h4>
                    <p>${item.price.toFixed(2)} • {item.category}</p>
                    <p>{item.description}</p>
                    <div className="dietary-tags">
                      {item.dietary.map(tag => (
                        <span key={tag} className="dietary-tag">{tag}</span>
                      ))}
                    </div>
                  </div>
                  <div className="item-actions">
                    <button 
                      onClick={() => handleEditItem(item)}
                      className="btn btn-secondary"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDeleteItem(item.id)}
                      className="btn btn-danger"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Order Management */}
        {activeTab === 'orders' && (
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
                        onChange={(e) => updateOrderStatus(order.id, e.target.value)}
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
        )}

        {/* Reservation Management */}
        {activeTab === 'reservations' && (
          <div className="admin-section">
            <h3>Reservation Management</h3>
            <div className="reservations-list">
              {reservations.length === 0 ? (
                <p>No reservations yet</p>
              ) : (
                reservations.map(reservation => (
                  <div key={reservation.id} className="reservation-item">
                    <div className="reservation-info">
                      <h4>Reservation #{reservation.id}</h4>
                      <p><strong>Date:</strong> {reservation.date}</p>
                      <p><strong>Time:</strong> {reservation.time}</p>
                      <p><strong>Guests:</strong> {reservation.guests}</p>
                      <p><strong>Requests:</strong> {reservation.specialRequests || 'None'}</p>
                    </div>
                    <div className="reservation-actions">
                      <select
                        value={reservation.status}
                        onChange={(e) => updateReservationStatus(reservation.id, e.target.value)}
                      >
                        <option value="confirmed">Confirmed</option>
                        <option value="seated">Seated</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;