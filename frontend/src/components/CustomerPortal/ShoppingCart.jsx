import React, { useState } from 'react';

const ShoppingCart = ({ cart, onUpdateQuantity, onRemoveFromCart, onCheckout }) => {
  const [orderType, setOrderType] = useState('pickup');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  
  const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const deliveryFee = orderType === 'delivery' ? 3.99 : 0;
  const finalTotal = cartTotal + deliveryFee;

  const handleCheckout = () => {
    if (orderType === 'delivery' && !deliveryAddress.trim()) {
      alert('Please enter delivery address');
      return;
    }
    
    const orderData = {
      items: cart,
      orderType,
      deliveryAddress: orderType === 'delivery' ? deliveryAddress : null,
      subtotal: cartTotal,
      deliveryFee,
      total: finalTotal,
      status: 'pending',
      date: new Date().toISOString()
    };
    
    onCheckout(orderData);
  };

  return (
    <div className="cart-section">
      <h3>Shopping Cart</h3>
      {cart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          <div className="cart-items">
            {cart.map(item => (
              <div key={item.id} className="cart-item">
                <div className="item-info">
                  <h5>{item.name}</h5>
                  <p>${item.price.toFixed(2)} each</p>
                </div>
                <div className="quantity-controls">
                  <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}>
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}>
                    +
                  </button>
                </div>
                <div className="item-total">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
                <button 
                  onClick={() => onRemoveFromCart(item.id)}
                  className="btn btn-danger"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {/* Delivery/Pickup Section */}
          <div className="order-type-section">
            <h4>Order Type</h4>
            <div className="order-type-options">
              <label className="order-type-option">
                <input
                  type="radio"
                  value="pickup"
                  checked={orderType === 'pickup'}
                  onChange={(e) => setOrderType(e.target.value)}
                />
                <div className="option-content">
                  <span className="option-title">🛵 Pickup</span>
                  <span className="option-description">Pick up your order at the restaurant</span>
                  <span className="option-price">Free</span>
                </div>
              </label>
              
              <label className="order-type-option">
                <input
                  type="radio"
                  value="delivery"
                  checked={orderType === 'delivery'}
                  onChange={(e) => setOrderType(e.target.value)}
                />
                <div className="option-content">
                  <span className="option-title">🚚 Delivery</span>
                  <span className="option-description">We'll deliver to your address</span>
                  <span className="option-price">+$3.99</span>
                </div>
              </label>
            </div>

            {orderType === 'delivery' && (
              <div className="delivery-address">
                <label>Delivery Address:</label>
                <textarea
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="Enter your full delivery address..."
                  rows="3"
                />
                <p className="delivery-note">Delivery available within 5 miles. Estimated time: 30-45 minutes.</p>
              </div>
            )}
          </div>

          <div className="order-summary">
            <h4>Order Summary</h4>
            <div className="summary-line">
              <span>Subtotal:</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            {orderType === 'delivery' && (
              <div className="summary-line">
                <span>Delivery Fee:</span>
                <span>${deliveryFee.toFixed(2)}</span>
              </div>
            )}
            <div className="summary-line total">
              <span>Total:</span>
              <span>${finalTotal.toFixed(2)}</span>
            </div>
          </div>

          <div className="cart-actions">
            <button onClick={handleCheckout} className="btn btn-primary">
              Place {orderType === 'delivery' ? 'Delivery' : 'Pickup'} Order
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ShoppingCart;