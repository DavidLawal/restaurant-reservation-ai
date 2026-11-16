import React from 'react';

const Analytics = ({ stats }) => {
  return (
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
  );
};

export default Analytics;