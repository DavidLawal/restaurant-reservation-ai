import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home-page">
      <div className="hero-section">
        <div className="container">
          <h2>Welcome to Our Restaurant</h2>
          <p>Experience fine dining with our exquisite menu and exceptional service</p>
          <div className="cta-buttons">
            <Link to="/customer" className="btn btn-primary">
              Browse Menu & Order
            </Link>
            <Link to="/admin" className="btn btn-secondary">
              Admin Access
            </Link>
          </div>
        </div>
      </div>
      
      <div className="features-section">
        <div className="container">
          <div className="features-grid">
            <div className="feature-card">
              <h3>🍽️ Menu</h3>
              <p>Browse our carefully crafted menu with dietary options</p>
            </div>
            <div className="feature-card">
              <h3>🛒 Order Online</h3>
              <p>Place orders for delivery or pickup</p>
            </div>
            <div className="feature-card">
              <h3>📅 Reservations</h3>
              <p>Book your table for any occasion</p>
            </div>
            <div className="feature-card">
              <h3>🤖 AI Assistant</h3>
              <p>Get personalized recommendations</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;