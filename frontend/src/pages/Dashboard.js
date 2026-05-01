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
          <h2>Your Profile</h2>
          <div className="profile-info">
            <p><strong>Name:</strong> {user?.name}</p>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>Department:</strong> {user?.department}</p>
            <p><strong>Year:</strong> {user?.year}</p>
          </div>
        </div>

        <div className="card">
          <h2>Gamification Stats</h2>
          <div className="stats">
            <div className="stat-box">
              <h3>{user?.points || 0}</h3>
              <p>Total Points</p>
            </div>
            <div className="stat-box">
              <h3>#{user?.rank || 'N/A'}</h3>
              <p>Rank</p>
            </div>
            <div className="stat-box">
              <h3>{user?.badges?.length || 0}</h3>
              <p>Badges</p>
            </div>
          </div>
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
    </div>
  );
};

export default Dashboard;
