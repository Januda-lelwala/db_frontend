import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import ProfileDropdown from '../../components/ProfileDropdown';
import './DriverDashboard.css';

const DriverDashboard = () => {
  const { user } = useAuth();

  // UI state
  const [activeTab, setActiveTab] = useState('assignments'); // 'assignments' | 'overview' | 'notifications'
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(null); // 'issue' | 'support' | null
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  // Domain state
  const [driverStats, setDriverStats] = useState({
    totalDeliveries: 0,
    completedToday: 0,
    pendingDeliveries: 0,
    rating: 0,
    earnings: 0,
    hoursWorked: 0,
  });
  const [assignments, setAssignments] = useState([]);
  const [currentRoute, setCurrentRoute] = useState(null);
  const [isOnline, setIsOnline] = useState(true);
  const [deliveryStatus, setDeliveryStatus] = useState('available'); // 'available' | 'on-route' | 'break'
  const [notifications, setNotifications] = useState([]);

  // Fetch driver assignments from backend
  const fetchDriverAssignments = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.warn('No auth token found for driver assignments');
      setAssignments([]);
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:3000/api/portal/driver/assignments', {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (response.ok) {
        const data = await response.json();
        // Handle various response formats
        let assignmentsArray = [];
        
        if (Array.isArray(data)) {
          assignmentsArray = data;
        } else if (data.data) {
          assignmentsArray = Array.isArray(data.data) ? data.data : [];
        } else if (data.assignments) {
          assignmentsArray = Array.isArray(data.assignments) ? data.assignments : [];
        }
        
        console.log('✅ Loaded', assignmentsArray.length, 'driver assignments');
        setAssignments(assignmentsArray);
      } else {
        console.error('Failed to fetch assignments:', response.status);
        setAssignments([]);
      }
    } catch (error) {
      console.error('Error fetching driver assignments:', error);
      setAssignments([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDriverStats = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.warn('No auth token found for driver stats');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/portal/driver/stats', {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (response.ok) {
        const data = await response.json();
        // Handle various response formats
        const statsData = data.data || data;
        
        setDriverStats({
          totalDeliveries: Number(statsData.totalDeliveries || 0),
          completedToday: Number(statsData.completedToday || 0),
          pendingDeliveries: Number(statsData.pendingDeliveries || 0),
          rating: Number(statsData.rating || 0),
          earnings: Number(statsData.earnings || 0),
          hoursWorked: Number(statsData.hoursWorked || 0),
        });
        console.log('✅ Loaded driver stats');
      } else {
        console.error('Failed to fetch driver stats:', response.status);
      }
    } catch (error) {
      console.error('Error fetching driver stats:', error);
    }
  };

  useEffect(() => {
    // Fetch initial data
    fetchDriverAssignments();
    fetchDriverStats();

    // Set up auto-refresh every 30 seconds when online
    const refreshInterval = setInterval(() => {
      if (isOnline) {
        console.log('🔄 Auto-refreshing driver data...');
        fetchDriverAssignments();
        fetchDriverStats();
      }
    }, 30000); // 30 seconds

    // Cleanup interval on unmount
    return () => clearInterval(refreshInterval);
  }, [isOnline]);

  // Actions
  const showNotification = (message, type = 'info') => {
    const n = { id: Date.now(), type, message, timestamp: 'Just now' };
    setNotifications(prev => [n, ...prev].slice(0, 50));
  };

  const updateDeliveryStatus = async (assignmentId, newStatus) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      showNotification('Authentication required', 'warning');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/portal/driver/update-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ assignmentId, status: newStatus }),
      });

      if (response.ok) {
        showNotification('Status updated successfully!', 'success');
        
        // Update local state
        setAssignments(prev =>
          prev.map(a => (a.id === assignmentId ? { ...a, status: newStatus } : a))
        );

        if (newStatus === 'completed') {
          setCurrentRoute(null);
          setDeliveryStatus('available');
          setDriverStats(prev => ({
            ...prev,
            completedToday: prev.completedToday + 1,
            pendingDeliveries: Math.max(0, prev.pendingDeliveries - 1),
          }));
        }
        
        // Refresh data to get updated stats
        fetchDriverStats();
        fetchDriverAssignments();
      } else {
        const errorData = await response.json().catch(() => ({}));
        showNotification(errorData.message || 'Failed to update status', 'warning');
      }
    } catch (error) {
      console.error('Error updating delivery status:', error);
      showNotification('Failed to update status. Please try again.', 'warning');
    }
  };

  const startDelivery = assignment => {
    setCurrentRoute(assignment);
    setDeliveryStatus('on-route');
    updateDeliveryStatus(assignment.id, 'in-progress');
  };

  const completeDelivery = assignment => {
    updateDeliveryStatus(assignment.id, 'completed');
  };

  const reportIssue = () => setShowModal('issue');
  const openSupport = () => setShowModal('support');
  const closeModal = () => setShowModal(null);

  // Derived
  const greeting = useMemo(() => {
    const name = user?.name || user?.fullName || user?.username || 'Driver';
    const hour = new Date().getHours();
    const dayPart = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
    return `${dayPart}, ${name}`;
  }, [user]);

  // Render helpers
  const renderHeader = () => (
    <header className="driver-header">
      <div className="driver-header-left">
        <h1>{greeting}</h1>
        <p className="muted">Status: {isOnline ? 'Online' : 'Offline'} • {deliveryStatus}</p>
      </div>
      <div className="driver-header-right">
        <ProfileDropdown />
      </div>
    </header>
  );

  const renderNav = () => (
    <nav className="driver-nav">
      {['assignments', 'overview', 'notifications'].map(tab => (
        <button
          key={tab}
          className={`nav-btn ${activeTab === tab ? 'active' : ''}`}
          onClick={() => setActiveTab(tab)}
        >
          {tab.charAt(0).toUpperCase() + tab.slice(1)}
        </button>
      ))}
      <div className="spacer" />
      <button className={`status-toggle ${isOnline ? 'on' : 'off'}`} onClick={() => setIsOnline(v => !v)}>
        {isOnline ? 'Go Offline' : 'Go Online'}
      </button>
    </nav>
  );

  const renderStats = () => (
    <section className="driver-stats-grid">
      <div className="stat-card">
        <div className="stat-title">Total Deliveries</div>
        <div className="stat-value">{driverStats.totalDeliveries}</div>
      </div>
      <div className="stat-card">
        <div className="stat-title">Completed Today</div>
        <div className="stat-value">{driverStats.completedToday}</div>
      </div>
      <div className="stat-card">
        <div className="stat-title">Pending</div>
        <div className="stat-value">{driverStats.pendingDeliveries}</div>
      </div>
      <div className="stat-card">
        <div className="stat-title">Rating</div>
        <div className="stat-value">{driverStats.rating.toFixed(1)}</div>
      </div>
      <div className="stat-card">
        <div className="stat-title">Earnings (LKR)</div>
        <div className="stat-value">{driverStats.earnings.toLocaleString()}</div>
      </div>
      <div className="stat-card">
        <div className="stat-title">Hours Worked</div>
        <div className="stat-value">{driverStats.hoursWorked}</div>
      </div>
    </section>
  );

  const renderQuickActions = () => (
    <div className="quick-actions">
      <button className="action-btn primary" onClick={() => { fetchDriverAssignments(); fetchDriverStats(); }} disabled={isLoading}>
        {isLoading ? '🔄 Refreshing…' : '🔄 Refresh Now'}
      </button>
      <button className="action-btn" onClick={reportIssue}>Report Issue</button>
      <button className="action-btn" onClick={openSupport}>Contact Support</button>
    </div>
  );

  const renderAssignments = () => (
    <section className="assignments-section">
      <div className="section-header">
        <h3>My Assignments</h3>
        <div className="section-actions">
          {currentRoute ? (
            <span className="badge in-route">On Route: {currentRoute.id}</span>
          ) : (
            <span className="badge available">Available</span>
          )}
        </div>
      </div>

      <div className="assignments-table-wrapper">
        <table className="assignments-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Address</th>
              <th>Priority</th>
              <th>Status</th>
              <th>ETA</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {assignments.length === 0 && (
              <tr>
                <td colSpan={7} className="empty">No assignments</td>
              </tr>
            )}
            {assignments.map(a => (
              <tr key={a.id} className={`priority-${a.priority} status-${a.status}`}>
                <td className="mono strong">{a.id}</td>
                <td>
                  <div className="stack">
                    <span className="strong">{a.customerName}</span>
                    <span className="muted small">{a.customerPhone}</span>
                  </div>
                </td>
                <td>{a.address}</td>
                <td><span className={`chip ${a.priority}`}>{a.priority}</span></td>
                <td><span className={`chip ${a.status}`}>{a.status}</span></td>
                <td>{a.estimatedTime}</td>
                <td>
                  <div className="row-actions">
                    {a.status === 'pending' && (
                      <button className="btn-sm primary" onClick={() => startDelivery(a)}>Start</button>
                    )}
                    {a.status === 'in-progress' && (
                      <button className="btn-sm success" onClick={() => completeDelivery(a)}>Complete</button>
                    )}
                    <button className="btn-sm" onClick={() => setSelectedAssignment(a)}>View</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );

  const renderNotifications = () => (
    <section className="notifications-section">
      <div className="section-header">
        <h3>Notifications</h3>
        <button className="btn" onClick={() => setNotifications([])}>Clear all</button>
      </div>
      <div className="notifications-list">
        {notifications.length === 0 && <div className="empty">You're all caught up</div>}
        {notifications.map(n => (
          <div key={n.id} className={`notification ${n.type}`}>
            <div className="notification-content">
              <div className="message">{n.message}</div>
              <div className="time muted small">{n.timestamp}</div>
            </div>
            <button className="icon-btn" onClick={() => setNotifications(prev => prev.filter(x => x.id !== n.id))}>×</button>
          </div>
        ))}
      </div>
    </section>
  );

  const renderModals = () => (
    <>
      {showModal === 'issue' && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Report an Issue</h2>
              <button className="icon-btn" onClick={closeModal}>×</button>
            </div>
            <div className="modal-body">
              <label className="field">
                <span className="label">Description</span>
                <textarea rows={5} placeholder="Describe the issue…" />
              </label>
              <div className="modal-actions">
                <button className="btn" onClick={closeModal}>Cancel</button>
                <button className="btn primary" onClick={() => { showNotification('Issue submitted', 'info'); closeModal(); }}>Submit</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showModal === 'support' && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Contact Support</h2>
              <button className="icon-btn" onClick={closeModal}>×</button>
            </div>
            <div className="modal-body">
              <p className="muted">Call: +94 11 234 5678 • Email: support@kandypack.lk</p>
              <div className="modal-actions">
                <button className="btn" onClick={closeModal}>Close</button>
                <button className="btn primary" onClick={() => { showNotification('Support ticket created', 'success'); closeModal(); }}>Create Ticket</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );

  return (
    <div className="driver-dashboard">
      {renderHeader()}
      {renderNav()}

      {activeTab === 'overview' && (
        <div className="panel">
          {renderStats()}
          <div className="panel-actions">{renderQuickActions()}</div>
        </div>
      )}

      {activeTab === 'assignments' && (
        <div className="panel">
          {renderStats()}
          {renderQuickActions()}
          {renderAssignments()}
        </div>
      )}

      {activeTab === 'notifications' && (
        <div className="panel">{renderNotifications()}</div>
      )}

      {selectedAssignment && (
        <div className="modal-overlay" onClick={() => setSelectedAssignment(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Assignment {selectedAssignment.id}</h2>
              <button className="icon-btn" onClick={() => setSelectedAssignment(null)}>×</button>
            </div>
            <div className="modal-body">
              <div className="detail">
                <div className="label">Customer</div>
                <div className="value">{selectedAssignment.customerName} ({selectedAssignment.customerPhone})</div>
              </div>
              <div className="detail">
                <div className="label">Address</div>
                <div className="value">{selectedAssignment.address}</div>
              </div>
              <div className="detail-grid">
                <div>
                  <div className="label">Priority</div>
                  <div className={`chip ${selectedAssignment.priority}`}>{selectedAssignment.priority}</div>
                </div>
                <div>
                  <div className="label">Status</div>
                  <div className={`chip ${selectedAssignment.status}`}>{selectedAssignment.status}</div>
                </div>
                <div>
                  <div className="label">ETA</div>
                  <div className="value">{selectedAssignment.estimatedTime}</div>
                </div>
                <div>
                  <div className="label">Distance</div>
                  <div className="value">{selectedAssignment.distance}</div>
                </div>
              </div>
              <div className="modal-actions">
                {selectedAssignment.status === 'pending' && (
                  <button className="btn primary" onClick={() => { startDelivery(selectedAssignment); setSelectedAssignment(null); }}>Start</button>
                )}
                {selectedAssignment.status === 'in-progress' && (
                  <button className="btn success" onClick={() => { completeDelivery(selectedAssignment); setSelectedAssignment(null); }}>Complete</button>
                )}
                <button className="btn" onClick={() => setSelectedAssignment(null)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {renderModals()}
    </div>
  );
};

export default DriverDashboard;