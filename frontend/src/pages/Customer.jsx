import React, { useState, useMemo } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import MockAIAssistant from '../components/AIAssistant/AIAssistant';
import { MenuSection, ShoppingCart, ReservationForm } from '../components/CustomerPortal';
import { menuData } from '../data/menuData';

const Customer = () => {
  const [cart, setCart] = useLocalStorage('cart', []);
  const [reservations, setReservations] = useLocalStorage('reservations', []);
  const [orders, setOrders] = useLocalStorage('orders', []);
  const [activeTab, setActiveTab] = useState('menu');
  const [filters, setFilters] = useState({
    category: 'all',
    dietary: 'all',
    search: ''
  });

  const filteredMenu = useMemo(() => {
    return menuData.filter(item => {
      const categoryMatch = filters.category === 'all' || item.category === filters.category;
      const dietaryMatch = filters.dietary === 'all' || item.dietary.includes(filters.dietary);
      const searchMatch = item.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                         item.description.toLowerCase().includes(filters.search.toLowerCase());
      
      return categoryMatch && dietaryMatch && searchMatch;
    });
  }, [filters]);

  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(cartItem => cartItem.id === item.id);
      if (existing) {
        return prev.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(itemId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeFromCart = (itemId) => {
    setCart(prev => prev.filter(item => item.id !== itemId));
  };

  const handleCheckout = (orderData) => {
    const order = {
      id: Date.now(),
      ...orderData,
      orderNumber: `ORD-${Date.now()}`,
      estimatedTime: orderData.orderType === 'delivery' ? '30-45 minutes' : '15-20 minutes'
    };
    
    setOrders(prev => [...prev, order]);
    setCart([]);
    setActiveTab('orders');
    
    alert(`Order placed successfully! Your order number is ${order.orderNumber}. ${order.orderType === 'delivery' ? 'Estimated delivery time: 30-45 minutes.' : 'Ready for pickup in 15-20 minutes.'}`);
  };

  const handleReservation = (reservation) => {
    setReservations(prev => [...prev, reservation]);
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };

  return (
    <div className="customer-portal">
      <div className="container">
        <h2>Customer Portal</h2>
        
        <div className="customer-layout">
          <div className="ai-sidebar">
            <MockAIAssistant />
          </div>

          <div className="main-content">
            <div className="tabs">
              <button 
                className={activeTab === 'menu' ? 'tab active' : 'tab'}
                onClick={() => setActiveTab('menu')}
              >
                Menu
              </button>
              <button 
                className={activeTab === 'cart' ? 'tab active' : 'tab'}
                onClick={() => setActiveTab('cart')}
              >
                Cart ({cart.length})
              </button>
              <button 
                className={activeTab === 'orders' ? 'tab active' : 'tab'}
                onClick={() => setActiveTab('orders')}
              >
                My Orders ({orders.length})
              </button>
              <button 
                className={activeTab === 'reservations' ? 'tab active' : 'tab'}
                onClick={() => setActiveTab('reservations')}
              >
                Reservations
              </button>
            </div>

            {activeTab === 'menu' && (
              <MenuSection 
                menuItems={filteredMenu}
                filters={filters}
                onFilterChange={handleFilterChange}
                onAddToCart={addToCart}
              />
            )}

            {activeTab === 'cart' && (
              <ShoppingCart 
                cart={cart}
                onUpdateQuantity={updateQuantity}
                onRemoveFromCart={removeFromCart}
                onCheckout={handleCheckout}
              />
            )}

            {activeTab === 'orders' && (
              <div className="orders-section">
                <h3>My Orders</h3>
                {orders.length === 0 ? (
                  <p>No orders yet</p>
                ) : (
                  <div className="orders-list">
                    {orders.map(order => (
                      <div key={order.id} className="order-card">
                        <div className="order-header">
                          <h4>Order #{order.orderNumber}</h4>
                          <span className={`order-type ${order.orderType}`}>
                            {order.orderType.toUpperCase()}
                          </span>
                        </div>
                        <div className="order-details">
                          <p><strong>Status:</strong> {order.status}</p>
                          <p><strong>Type:</strong> {order.orderType}</p>
                          {order.deliveryAddress && (
                            <p><strong>Delivery to:</strong> {order.deliveryAddress}</p>
                          )}
                          <p><strong>Estimated Time:</strong> {order.estimatedTime}</p>
                          <p><strong>Total:</strong> ${order.total.toFixed(2)}</p>
                          <p><strong>Items:</strong> {order.items.map(item => `${item.name} (x${item.quantity})`).join(', ')}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'reservations' && (
              <ReservationForm 
                reservations={reservations}
                onSubmit={handleReservation}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Customer;