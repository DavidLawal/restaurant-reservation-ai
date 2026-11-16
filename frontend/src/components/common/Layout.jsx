import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';

const Layout = () => {
  const location = useLocation();

  return (
    <div className="app">
      <header className="header">
        <div className="container">
          <h1>🍽️ Fine Dining Restaurant</h1>
          <nav className="nav">
            <Link 
              to="/" 
              className={location.pathname === '/' ? 'nav-link active' : 'nav-link'}
            >
              Home
            </Link>
            <Link 
              to="/customer" 
              className={location.pathname === '/customer' ? 'nav-link active' : 'nav-link'}
            >
              Customer Portal
            </Link>
            <Link 
              to="/admin" 
              className={location.pathname === '/admin' ? 'nav-link active' : 'nav-link'}
            >
              Admin Dashboard
            </Link>
          </nav>
        </div>
      </header>
      
      <main className="main">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;