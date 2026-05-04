import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import clubService from '../services/clubService';
import '../styles/clubs.css';

const Clubs = () => {
  const { user, updateUser } = useAuth();
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '', category: 'Technical' });

  const getGuildLevel = (points) => {
    if (points >= 10000) return { name: 'Platinum', color: '#e5e7eb', level: 5 };
    if (points >= 5000) return { name: 'Gold', color: '#fcd34d', level: 4 };
    if (points >= 2500) return { name: 'Silver', color: '#94a3b8', level: 3 };
    if (points >= 1000) return { name: 'Bronze', color: '#d97706', level: 2 };
    return { name: 'Novice', color: '#a8a29e', level: 1 };
  };

  const getCategoryIcon = (cat) => {
    switch(cat) {
      case 'Technical': return '🛡️';
      case 'Cultural': return '🎭';
      case 'Sports': return '⚔️';
      case 'Social': return '🤝';
      default: return '🚩';
    }
  };

  const fetchClubs = async () => {
    try {
      const response = await clubService.getClubs();
      setClubs(response.data.clubs || []);
    } catch (err) {
      console.error('Failed to fetch clubs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClubs();
  }, []);

  const handleJoin = async (clubId) => {
    try {
      const response = await clubService.joinClub(clubId);
      updateUser({ ...user, club: response.data.club._id });
      fetchClubs();
      alert('Joined club successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to join club');
    }
  };

  const handleLeave = async () => {
    try {
      await clubService.leaveClub();
      updateUser({ ...user, club: null });
      fetchClubs();
      alert('Left club successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to leave club');
    }
  };

  const handleCreateClub = async (e) => {
    e.preventDefault();
    try {
      const response = await clubService.createClub(formData);
      updateUser({ ...user, club: response.data.club._id });
      setShowCreateModal(false);
      fetchClubs();
      alert('Club created successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create club');
    }
  };

  return (
    <div className="clubs-container">
      <div className="clubs-header">
        <div className="header-content">
          <h1>Club Battles</h1>
          <p>Compete as a team and dominate the campus leaderboard.</p>
        </div>
        {!user?.club ? (
          <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>
            + Create a Club
          </button>
        ) : (
          <button className="btn btn-secondary" onClick={handleLeave}>
            Leave Current Club
          </button>
        )}
      </div>

      <div className="clubs-grid">
        <div className="leaderboard-card card">
          <h2>Club Rankings</h2>
          {loading ? (
            <p>Loading...</p>
          ) : clubs.length > 0 ? (
            <div className="club-rank-list">
              {clubs.map((club, index) => {
                const guild = getGuildLevel(club.points);
                return (
                  <div key={club._id} className={`club-rank-item ${user?.club === club._id ? 'my-club' : ''}`}>
                    <div className="rank-num">#{index + 1}</div>
                    <div className="guild-shield" style={{ borderColor: guild.color }}>
                      {getCategoryIcon(club.category)}
                    </div>
                    <div className="club-info">
                      <h3>{club.name}</h3>
                      <div className="guild-level-tag" style={{ background: guild.color }}>
                        Level {guild.level} {guild.name}
                      </div>
                    </div>
                    <div className="guild-stats">
                      <div className="member-count">👥 {club.members.length}</div>
                      <div className="club-score">{club.points} XP</div>
                      <div className="xp-bar-mini">
                        <div 
                          className="xp-fill" 
                          style={{ width: `${(club.points % 1000) / 10}%`, background: guild.color }}
                        ></div>
                      </div>
                    </div>
                    {!user?.club && (
                      <button className="btn btn-sm btn-primary" onClick={() => handleJoin(club._id)}>Join Guild</button>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="empty">No clubs found. Be the first to start one!</p>
          )}
        </div>

        <div className="clubs-about">
          <div className="card">
            <h2>How it works</h2>
            <ul className="info-list">
              <li>
                <strong>Summed Points:</strong> Your club's score is the total of all its members' individual points.
              </li>
              <li>
                <strong>Dominance:</strong> High-ranking clubs get featured on the campus hall of fame.
              </li>
              <li>
                <strong>Exclusivity:</strong> You can only belong to one club at a time. Choose wisely!
              </li>
            </ul>
          </div>
        </div>
      </div>

      {showCreateModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Start Your Own Club</h2>
              <button className="close-btn" onClick={() => setShowCreateModal(false)}>×</button>
            </div>
            <form onSubmit={handleCreateClub} className="modal-body">
              <div className="input-group">
                <label>Club Name</label>
                <input 
                  type="text" 
                  value={formData.name} 
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required 
                />
              </div>
              <div className="input-group">
                <label>Category</label>
                <select 
                  value={formData.category} 
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="Technical">Technical</option>
                  <option value="Cultural">Cultural</option>
                  <option value="Sports">Sports</option>
                  <option value="Social">Social</option>
                  <option value="Professional">Professional</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="input-group">
                <label>Description</label>
                <textarea 
                  value={formData.description} 
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="3"
                  required
                ></textarea>
              </div>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
                Create Club
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clubs;
