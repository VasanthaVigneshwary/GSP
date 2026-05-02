import React, { useState, useEffect } from 'react';
import notificationService from '../services/notificationService';
import '../styles/notificationCenter.css';

const NotificationCenter = ({ onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await notificationService.getNotifications();
        setNotifications(response.data.notifications || []);
      } catch (err) {
        console.error('Failed to fetch notifications');
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch (err) {
      console.error('Failed to mark notification as read');
    }
  };

  return (
    <div className="notification-overlay" onClick={onClose}>
      <div className="notification-panel" onClick={e => e.stopPropagation()}>
        <div className="notification-header">
          <h3>Notifications</h3>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="notification-list">
          {loading ? (
            <p className="loading">Loading...</p>
          ) : notifications.length > 0 ? (
            notifications.map(n => (
              <div 
                key={n._id} 
                className={`notification-item ${n.isRead ? 'read' : 'unread'}`}
                onClick={() => !n.isRead && handleMarkAsRead(n._id)}
              >
                <div className="notification-type-icon">
                  {n.type === 'Achievement' ? '🏆' : n.type === 'Check-in Success' ? '✅' : '📢'}
                </div>
                <div className="notification-body">
                  <h4>{n.title}</h4>
                  <p>{n.message}</p>
                  <span className="notification-time">{new Date(n.createdAt).toLocaleString()}</span>
                </div>
                {!n.isRead && <div className="unread-dot"></div>}
              </div>
            ))
          ) : (
            <p className="empty">No notifications yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationCenter;
