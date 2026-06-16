import { useState, useEffect } from 'react';
import { apiGet, apiPut } from '../../api/apiClient';
import { errorMessage } from '../../utils/format';
import './Notifications.css';

const Notifications = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await apiGet('/notifications');
        if (!cancelled) { setItems(Array.isArray(data) ? data : []); setError(''); }
      } catch (e) {
        if (!cancelled) setError(errorMessage(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const markRead = async (id) => {
    try {
      await apiPut(`/notifications/${id}/read`);
      setItems((prev) => prev.map((n) => (n.id === id ? { ...n, unread: false } : n)));
    } catch { /* leave as-is on failure */ }
  };

  const markAll = async () => {
    try {
      await apiPut('/notifications/read-all');
      setItems((prev) => prev.map((n) => ({ ...n, unread: false })));
    } catch { /* leave as-is on failure */ }
  };

  return (
    <div className="notifications-container">
      <div className="page-header">
        <h2>Notifications</h2>
        <p>Stay updated on your account activity and alerts</p>
      </div>

      <div className="notif-page-card">
        <div className="notif-page-header">
          <h3>All Notifications</h3>
          <button className="mark-all-btn" onClick={markAll}>Mark all as read</button>
        </div>

        {loading ? (
          <div className="page-loading">Loading notifications…</div>
        ) : error ? (
          <div className="page-error">{error}</div>
        ) : items.length === 0 ? (
          <div className="page-loading">No notifications yet.</div>
        ) : (
          <div className="notif-list">
            {items.map((notif) => (
              <div
                key={notif.id}
                className={`notif-row ${notif.unread ? 'unread' : ''}`}
                onClick={() => notif.unread && markRead(notif.id)}
                style={{ cursor: notif.unread ? 'pointer' : 'default' }}
              >
                <div className={`notif-icon-dot bg-${String(notif.type).toLowerCase()}`}></div>
                <div className="notif-body">
                  <h4>{notif.title}</h4>
                  <p>{notif.message}</p>
                </div>
                <span className="notif-timestamp">{notif.time}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
