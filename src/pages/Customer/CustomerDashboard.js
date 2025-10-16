import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import './CustomerDashboard.css';

const CustomerDashboard = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({
    orders: 0,
    pending: 0,
    completed: 0
  });

  useEffect(() => {
    // Fetch customer dashboard stats
    // This would be replaced with actual API call
    setStats({
      orders: 12,
      pending: 3,
      completed: 9
    });
  }, []);

  const handleLogout = async () => {
    await logout();
    window.location.href = '/login';
  };

  return (
    <div className="customer-dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Welcome, {user?.name || 'Customer'}!</h1>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📦</div>
            <div className="stat-info">
              <h3>{stats.orders}</h3>
              <p>Total Orders</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">⏳</div>
            <div className="stat-info">
              <h3>{stats.pending}</h3>
              <p>Pending Orders</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-info">
              <h3>{stats.completed}</h3>
              <p>Completed Orders</p>
            </div>
          </div>
        </div>

        <div className="dashboard-sections">
          <section className="dashboard-section">
            <h2>Quick Actions</h2>
            <div className="action-grid">
              <button className="action-card">
                <span className="action-icon">🛍️</span>
                <span>Browse Products</span>
              </button>
              <button className="action-card">
                <span className="action-icon">📋</span>
                <span>View Orders</span>
              </button>
              <button className="action-card">
                <span className="action-icon">👤</span>
                <span>My Profile</span>
              </button>
              <button className="action-card">
                <span className="action-icon">💬</span>
                <span>Support</span>
              </button>
            </div>
          </section>

          <section className="dashboard-section">
            <h2>Recent Orders</h2>
            <div className="orders-list">
              <p className="placeholder-text">No recent orders to display</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
