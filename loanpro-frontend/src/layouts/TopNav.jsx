import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { apiGet, apiPut } from '../api/apiClient';
import './TopNav.css';

const TopNav = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // Load notifications (used for both the badge count and the dropdown list).
  // Fails silently — a notifications hiccup shouldn't break the whole shell.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await apiGet('/notifications');
        if (!cancelled) setNotifications(Array.isArray(data) ? data : []);
      } catch {
        if (!cancelled) setNotifications([]);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const unreadCount = notifications.filter((n) => n.unread).length;

  const handleMarkAllRead = async () => {
    try {
      await apiPut('/notifications/read-all');
      setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
    } catch {
      // ignore — leave state as-is
    }
  };

  return (
    <header className="loanpro-topnav">
      <div className="nav-left">
        <h2>Welcome back, {user?.name ? user.name.split(' ')[0] : 'User'} 👋</h2>
        <p>Here is what's happening with your account today.</p>
      </div>

      <div className="nav-right">
        {/* Notification Bell Wrapper */}
        <div className="notification-wrapper">
          <button
            className="icon-btn"
            onClick={() => setIsNotifOpen(!isNotifOpen)}
          >
            🔔
            {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
          </button>

          {/* The Dropdown Panel */}
          {isNotifOpen && (
            <div className="notification-dropdown">
              <div className="dropdown-header">
                <h4>Notifications</h4>
                <button className="mark-read-btn" onClick={handleMarkAllRead}>Mark all read</button>
              </div>

              <div className="dropdown-body">
                {notifications.length === 0 ? (
                  <div className="notif-item"><div className="notif-content"><p>No notifications yet.</p></div></div>
                ) : (
                  notifications.map((notif) => (
                    <div key={notif.id} className={`notif-item ${notif.unread ? 'unread' : ''}`}>
                      <div className={`notif-dot bg-${String(notif.type).toLowerCase()}`}></div>
                      <div className="notif-content">
                        <h5>{notif.title}</h5>
                        <p>{notif.message}</p>
                        <span className="notif-time">{notif.time}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="dropdown-footer">
                <button
                  className="link-btn"
                  onClick={() => { setIsNotifOpen(false); navigate('/notifications'); }}
                >
                  View All Notifications
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="user-profile-sm">
          <div className="avatar-sm">{user?.name ? user.name.charAt(0) : 'U'}</div>
        </div>
      </div>
    </header>
  );
};

export default TopNav;
