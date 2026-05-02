import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/dashboard.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

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
            <div className="hero-actions">
              <button className="btn btn-primary" onClick={() => navigate('/events')}>
                Discover events
              </button>
              <button className="btn btn-secondary" onClick={() => navigate('/wishlist')}>
                View wishlist
              </button>
              <button className="btn btn-secondary" onClick={logout}>
                Logout
              </button>
            </div>
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

        <div className="dashboard-grid">
          <div className="dashboard-main">
            <div className="card">
              <h2>What’s next</h2>
              <div className="event-summary">
                <p>
                  Explore the best student-led events on campus, from workshops to cultural meetups.
                  Save the ones that matter most.
                </p>
                <button className="btn btn-primary" onClick={() => navigate('/events')}>
                  Browse events
                </button>
              </div>
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
              <p>Attend one more event to level up your campus leaderboard status.</p>
            </div>
          </div>

          <div className="dashboard-side">
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
              </div>
            </div>

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

        <div className="dashboard-footer">
          <button className="btn" onClick={() => navigate('/dashboard')}>
            🏠
          </button>
          <button className="btn" onClick={() => navigate('/events')}>
            🔎
          </button>
          <button className="btn" onClick={() => navigate('/wishlist')}>
            ❤️
          </button>
          <button className="btn" onClick={() => alert('Coming soon')}>
            💬
          </button>
          <button className="btn" onClick={() => alert('Coming soon')}>
            👤
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
