import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import eventService from '../services/eventService';
import userService from '../services/userService';
import notificationService from '../services/notificationService';
import QRScanner from '../components/QRScanner';
import NotificationCenter from '../components/NotificationCenter';
import XPProgressBar from '../components/XPProgressBar';
import ActivityCalendar from '../components/ActivityCalendar';
import CertificateGallery from '../components/CertificateGallery';
import AIAssistant from '../components/AIAssistant'; // Restored
import AiRoadmap from '../components/AiRoadmap';
import { FederatedStore } from '../services/FederatedStore';
import '../styles/dashboard.css';

const Dashboard = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [showScanner, setShowScanner] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [checkInStatus, setCheckInStatus] = useState({ loading: false, message: '', type: '' });
  const [activity, setActivity] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [activityRes, notifRes, statsRes] = await Promise.all([
          userService.getActivityFeed(),
          notificationService.getNotifications(),
          userService.getUserStats()
        ]);
        setActivity(activityRes.data.activity || []);
        setUnreadCount(notifRes.data.unreadCount || 0);
        
        // Sync user stats (points, streak, activityLog) with the context
        if (statsRes.data) {
          updateUser({
            ...user,
            points: statsRes.data.points,
            streak: statsRes.data.streak,
            activityLog: statsRes.data.activityLog,
            badges: statsRes.data.badges,
            rank: statsRes.data.rank,
          });
        }
      } catch (err) {
        console.error('Failed to fetch dashboard data');
      }
    };
    if (user) {
      fetchDashboardData();
      FederatedStore.logInteraction('Dashboard View', { timestamp: new Date() });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);



  const handleScanSuccess = async (decodedText) => {
    setCheckInStatus({ loading: true, message: 'Verifying QR code...', type: 'info' });
    try {
      const response = await eventService.checkIn(decodedText);
      setCheckInStatus({
        loading: false,
        message: response.message || 'Check-in successful!',
        type: 'success',
      });
      
      // Update local user state with new points and badges
      if (response.data) {
        updateUser({
          ...user,
          points: response.data.points || user.points,
          badges: response.data.badgeEarned 
            ? [...(user.badges || []), response.data.badgeEarned] 
            : user.badges,
        });
      }

      // Close scanner after 3 seconds on success
      setTimeout(() => {
        setShowScanner(false);
        setCheckInStatus({ loading: false, message: '', type: '' });
      }, 3000);
    } catch (err) {
      setCheckInStatus({
        loading: false,
        message: err.response?.data?.message || 'Check-in failed. Invalid QR code.',
        type: 'error',
      });
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-shell">
        <div className="dashboard-hero">
          <div className="dashboard-hero-content">
            <p className="eyebrow">Student Hub</p>
            <h1>Welcome back, {user?.name || 'Student'}!</h1>
            <p>
              Manage your campus activity stream, explore upcoming events, and earn points with every
              event you attend.
            </p>
            <XPProgressBar points={user?.points || 0} />
          </div>
          <div className="hero-metrics">
            <div className="stat-box">
              <h3>{user?.points || 0}</h3>
              <p>Total Points</p>
            </div>
            <div className="stat-box">
              <h3>#{user?.rank || '—'}</h3>
              <p>Leaderboard rank</p>
            </div>
          </div>
        </div>

        {showScanner && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h2>Scan Event QR Code</h2>
                <button className="close-btn" onClick={() => setShowScanner(false)}>×</button>
              </div>
              <div className="modal-body">
                {!checkInStatus.message || checkInStatus.type === 'info' ? (
                  <QRScanner onScanSuccess={handleScanSuccess} />
                ) : (
                  <div className={`status-message ${checkInStatus.type}`}>
                    {checkInStatus.type === 'success' ? '✅' : '❌'} {checkInStatus.message}
                  </div>
                )}
                {checkInStatus.loading && <p className="loading-text">Processing...</p>}
              </div>
              <p className="scanner-hint">Point your camera at the event's QR code provided by the organizer.</p>
            </div>
          </div>
        )}

        <div className="dashboard-grid">
          <div className="dashboard-main">
            <span className="section-label">🎯 Career Strategy</span>
            <AiRoadmap />
            <AIAssistant user={user} />
            
            <div className="card">
              <span className="section-label">🌐 Campus Social</span>
              <h2>Recent Activity</h2>
              <div className="activity-feed">
                {activity.length > 0 ? (
                  activity.map((item) => (
                    <div key={item._id} className="activity-item">
                      <div className="activity-avatar">{item.name.charAt(0)}</div>
                      <div className="activity-content">
                        <p>
                          <strong>{item.name}</strong> attended{' '}
                          <strong>{item.eventsAttended[0]?.title || 'an event'}</strong>
                        </p>
                        <span className="activity-time">
                          {item.eventsAttended[0] ? new Date(item.eventsAttended[0].date).toLocaleDateString() : 'Just now'}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="empty-feed">Follow friends to see their activity here!</p>
                )}
              </div>
              <button className="btn btn-secondary" style={{ marginTop: '1rem' }} onClick={() => navigate('/leaderboard')}>
                Find Friends
              </button>
            </div>

            <div className="card">

              <h2>Your Stats</h2>
              <div className="stats">
                <div className="stat-box">
                  <h3>{user?.points || 0}</h3>
                  <p>Points earned</p>
                </div>
                <div className="stat-box">
                  <h3>{user?.year || 'Freshman'}</h3>
                  <p>Current year</p>
                </div>
                <div className="stat-box">
                  <h3>{user?.department || 'Computer Science'}</h3>
                  <p>Department</p>
                </div>
              </div>
              
              <div className="activity-section">
                <h3>Activity Insight</h3>
                <ActivityCalendar activityLog={user?.activityLog || []} />
                <div className="streak-info">
                  <span className="streak-badge">🔥 {user?.streak || 0} Day Streak</span>
                </div>
              </div>
              
              <p>Attend one more event to level up your campus leaderboard status.</p>
            </div>

            <div className="card showcase-section">
              <h2>Achievement Showcase</h2>
              <CertificateGallery certificates={user?.certificates || []} />
            </div>
          </div>

          <div className="dashboard-side">
            <span className="section-label">👤 Identity & Stats</span>
            <div className="card">
              <h2>Profile details</h2>
              <div className="profile-info">
                <p>
                  <span>Name</span>
                  <strong>{user?.name || 'Student'}</strong>
                </p>
                <p>
                  <span>Email</span>
                  <strong>{user?.email || 'student@example.com'}</strong>
                </p>
                <p>
                  <span>Department</span>
                  <strong>{user?.department || 'Computer Science'}</strong>
                </p>
                <p>
                  <span>Year</span>
                  <strong>{user?.year || 'Freshman'}</strong>
                </p>
                {user?.bio && (
                  <p className="profile-bio">
                    <span>Bio</span>
                    <strong>{user.bio}</strong>
                  </p>
                )}
                {user?.interests && user.interests.length > 0 && (
                  <div className="profile-interests">
                    <span>Interests</span>
                    <div className="interest-tags">
                      {user.interests.map(i => <span key={i} className="tag">{i}</span>)}
                    </div>
                  </div>
                )}
              </div>
              <button className="btn btn-secondary" style={{ width: '100%', marginTop: '1rem' }} onClick={() => navigate('/profile/settings')}>
                Edit Profile
              </button>
            </div>


            <span className="section-label">🏅 Achievements</span>
            <div className="card">
              <h2>Badges</h2>
              {user?.badges && user.badges.length > 0 ? (
                <div className="badges-container">
                  {user.badges.map((badge) => (
                    <div key={badge} className="badge">
                      {badge}
                    </div>
                  ))}
                </div>
              ) : (
                <p>No badges yet. Join events to unlock achievements.</p>
              )}
            </div>
          </div>
        </div>

        {showNotifications && (
          <NotificationCenter onClose={() => {
            setShowNotifications(false);
            setUnreadCount(0); // Reset count after viewing
          }} />
        )}
      </div>
    </div>

  );
};

export default Dashboard;

