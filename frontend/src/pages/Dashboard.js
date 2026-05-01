import React from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/dashboard.css';

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome, {user?.name}!</h1>
        <button onClick={logout} className="btn btn-secondary">
          Logout
        </button>
      </div>

      <div className="dashboard-content">
        <div className="card">
          <h2>Upcoming Events</h2>
          <div className="event">
            <h3>Tech Talk 2026</h3>
            <p>📍 Building B, Room 102</p>
            <p>📅 May 5 @ 2:00 PM</p>
            <p>⭐ 4.8 (320 reviews)</p>
            <button className="btn btn-primary">Register</button>
          </div>
          <div className="event">
            <h3>Career Fair 2026</h3>
            <p>📍 Student Center</p>
            <p>📅 May 8 @ 10:00 AM</p>
            <p>⭐ 4.9 (156 reviews)</p>
            <button className="btn btn-secondary">Already Registered</button>
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
          <p>"Attend 1 more event this week to reach top 40!"</p>
          <button className="btn btn-primary">Discover Events</button>
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
            <p>No badges earned yet. Start attending events!</p>
          )}
        </div>
      </div>

      <div className="dashboard-footer">
        <button className="btn">🏠</button>
        <button className="btn">🔎</button>
        <button className="btn">🏆</button>
        <button className="btn">💬</button>
        <button className="btn">👤</button>
      </div>
    </div>
  );
};

export default Dashboard;
