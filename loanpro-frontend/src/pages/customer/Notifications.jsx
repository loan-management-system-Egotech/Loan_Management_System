import { userNotifications } from '../../data/mockData';
import './Notifications.css';

const Notifications = () => {
  return (
    <div className="notifications-container">
      <div className="page-header">
        <h2>Notifications</h2>
        <p>Stay updated on your account activity and alerts</p>
      </div>

      <div className="notif-page-card">
        <div className="notif-page-header">
          <h3>All Notifications</h3>
          <button className="mark-all-btn">Mark all as read</button>
        </div>

        <div className="notif-list">
          {userNotifications.map(notif => (
            <div key={notif.id} className={`notif-row ${notif.unread ? 'unread' : ''}`}>
              <div className={`notif-icon-dot bg-${notif.type}`}></div>
              <div className="notif-body">
                <h4>{notif.title}</h4>
                <p>{notif.message}</p>
              </div>
              <span className="notif-timestamp">{notif.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
