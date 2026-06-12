import { useState } from 'react';
import { useAuth } from '../context/useAuth';
import { userNotifications } from '../data/mockData';
import './TopNav.css';

const TopNav = () => {
  const { user } = useAuth();
  // State to control the dropdown visibility
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  // Count how many unread notifications we have
  const unreadCount = userNotifications.filter(n => n.unread).length;

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
                <button className="mark-read-btn">Mark all read</button>
              </div>
              
              <div className="dropdown-body">
                {userNotifications.map(notif => (
                  <div key={notif.id} className={`notif-item ${notif.unread ? 'unread' : ''}`}>
                    <div className={`notif-dot bg-${notif.type}`}></div>
                    <div className="notif-content">
                      <h5>{notif.title}</h5>
                      <p>{notif.message}</p>
                      <span className="notif-time">{notif.time}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="dropdown-footer">
                <a href="#all">View All Notifications</a>
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