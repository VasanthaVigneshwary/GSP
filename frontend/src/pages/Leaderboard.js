import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import userService from '../services/userService';
import '../styles/leaderboard.css';

const Leaderboard = () => {
  const navigate = useNavigate();
  const [leaders, setLeaders] = useState([]);
  const [deptLeaders, setDeptLeaders] = useState([]); // New: Department data
  const [activeTab, setActiveTab] = useState('Students'); // New: Tab state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [studentRes, deptRes] = await Promise.all([
          userService.getLeaderboard(),
          userService.getDepartmentLeaderboard()
        ]);
        setLeaders(studentRes.data.leaderboard || []);
        setDeptLeaders(deptRes.data.leaderboard || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load rankings');
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  return (
    <div className="leaderboard-container">
      <div className="leaderboard-shell">
        <div className="header">
          <button className="back-btn" onClick={() => navigate('/dashboard')}>←</button>
          <h1>Campus Leaderboard</h1>
          <p>Compete with fellow students and reach the top of the rankings.</p>
        </div>

        <div className="tab-switcher">
          <button 
            className={`tab-btn ${activeTab === 'Students' ? 'active' : ''}`}
            onClick={() => setActiveTab('Students')}
          >
            👤 Students
          </button>
          <button 
            className={`tab-btn ${activeTab === 'Departments' ? 'active' : ''}`}
            onClick={() => setActiveTab('Departments')}
          >
            🏢 Departments
          </button>
        </div>

        {activeTab === 'Students' && (
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
        )}

        <div className="leaderboard-table-card">
          {loading ? (
            <div className="loading">Loading rankings...</div>
          ) : error ? (
            <div className="error">{error}</div>
          ) : activeTab === 'Students' ? (
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
          ) : (
            <table className="leaderboard-table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Department</th>
                  <th>Student Count</th>
                  <th>Avg XP</th>
                  <th>Total XP</th>
                </tr>
              </thead>
              <tbody>
                {deptLeaders.map((dept, index) => (
                  <tr key={dept.name} className={index < 3 ? 'top-three' : ''}>
                    <td className="rank-cell">#{index + 1}</td>
                    <td className="user-cell">
                      <div className="user-info">
                        <span className="user-name">{dept.name}</span>
                      </div>
                    </td>
                    <td>{dept.studentCount} Students</td>
                    <td>{dept.avgPoints} XP</td>
                    <td className="points-cell">{dept.totalPoints}</td>
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
