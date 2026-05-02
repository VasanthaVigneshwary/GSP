import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/dashboard.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome, {user?.name || 'Student'}!</h1>
        <button onClick={logout} className="btn btn-secondary">
          Logout
        </button>
      </div>

      <div className="dashboard-content">
        <div className="card">
          <h2>Upcoming Events</h2>
          <div className="event-summary">
            <p>Find events tailored for your interests, points, and campus schedule.</p>
            <button className="btn btn-primary" onClick={() => navigate('/events')}>
              Discover Events
            </button>
          </div>
        </div>

        <div className="card">
          <h2>Your Points & Rank</h2>
          <div className="stats">
            <div className="stat-box">
              <h3>{user?.points || 0}</h3>
              <p>Total Points</p>
            </div>
            <div className="stat-box">
              <h3>#{user?.rank || 'N/A'}</h3>
              <p>Rank</p>
            </div>
          </div>
          <p>Attend one more event this week to move up the leaderboard.</p>
        </div>

        <div className="card">
          <h2>Your Badges</h2>
          {user?.badges && user.badges.length > 0 ? (
            <div className="badges-container">
              {user.badges.map((badge) => (
                <div key={badge} className="badge">
                  {badge}
                </div>
              ))}
            </div>
          ) : (
            <p>No badges earned yet. Start attending events to unlock rewards.</p>
          )}
        </div>
      </div>

      <div className="dashboard-footer">
        <button className="btn" onClick={() => navigate('/dashboard')}>
          🏠
        </button>
        <button className="btn" onClick={() => navigate('/events')}>
          🔎
        </button>
        <button className="btn">🏆</button>
        <button className="btn">💬</button>
        <button className="btn">👤</button>
      </div>
    </div>
  );
};

export default Dashboard;
