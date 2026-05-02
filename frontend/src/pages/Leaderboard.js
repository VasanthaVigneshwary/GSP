import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import userService from '../services/userService';
import '../styles/leaderboard.css';

const Leaderboard = () => {
  const navigate = useNavigate();
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await userService.getLeaderboard();
        setLeaders(response.data.leaderboard || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load leaderboard');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="leaderboard-container">
      <div className="leaderboard-shell">
        <div className="header">
          <button className="back-btn" onClick={() => navigate('/dashboard')}>←</button>
          <h1>Campus Leaderboard</h1>
          <p>Compete with fellow students and reach the top of the rankings.</p>
        </div>

        <div className="podium">
          {leaders.slice(0, 3).map((leader, index) => (
            <div key={leader._id} className={`podium-spot spot-${index + 1}`}>
              <div className="rank-badge">{index + 1}</div>
              <div className="avatar-placeholder">{leader.name.charAt(0)}</div>
              <h3>{leader.name}</h3>
              <p className="points">{leader.points} pts</p>
              <p className="dept">{leader.department}</p>
            </div>
          ))}
        </div>

        <div className="leaderboard-table-card">
          {loading ? (
            <div className="loading">Loading rankings...</div>
          ) : error ? (
            <div className="error">{error}</div>
          ) : (
            <table className="leaderboard-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Student</th>
                  <th>Department</th>
                  <th>Badges</th>
                  <th>Points</th>
                </tr>
              </thead>
              <tbody>
                {leaders.map((leader, index) => (
                  <tr key={leader._id} className={index < 3 ? 'top-three' : ''}>
                    <td className="rank-cell">#{index + 1}</td>
                    <td className="user-cell">
                      <div className="user-info">
                        <span className="user-name">{leader.name}</span>
                        <span className="user-year">{leader.year}</span>
                      </div>
                    </td>
                    <td>{leader.department}</td>
                    <td>
                      <div className="badge-count">
                        🏆 {leader.badges?.length || 0}
                      </div>
                    </td>
                    <td className="points-cell">{leader.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="dashboard-footer">
          <button className="btn" onClick={() => navigate('/dashboard')}>🏠</button>
          <button className="btn" onClick={() => navigate('/events')}>🔎</button>
          <button className="btn active" onClick={() => navigate('/leaderboard')}>🏆</button>
          <button className="btn" onClick={() => alert('Coming soon')}>👤</button>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
