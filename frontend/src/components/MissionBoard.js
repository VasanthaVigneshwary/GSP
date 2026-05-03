import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const MissionBoard = () => {
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, updateUser } = useAuth();

  useEffect(() => {
    const fetchMissions = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('/api/missions/daily', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMissions(response.data.data.missions);
      } catch (err) {
        console.error('Failed to fetch missions');
      } finally {
        setLoading(false);
      }
    };

    fetchMissions();
  }, []);

  const handleComplete = async (missionId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`/api/missions/complete/${missionId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Update local missions state
      setMissions(missions.map(m => 
        m._id === missionId ? { ...m, isCompleted: true } : m
      ));

      // Update global user points
      if (response.data.data.newPoints) {
        updateUser({ ...user, points: response.data.data.newPoints });
      }
      
      alert(response.data.message);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to complete mission');
    }
  };

  const getIcon = (cat) => {
    switch(cat) {
      case 'Discovery': return '🔍';
      case 'Social': return '🤝';
      case 'Learning': return '🧠';
      case 'Event': return '🏆';
      default: return '🎯';
    }
  };

  if (loading) return <p>Loading your daily missions...</p>;

  return (
    <div className="mission-hub">
      <div className="mission-list">
        {missions.length > 0 ? (
          missions.map((mission) => (
            <div 
              key={mission._id} 
              className={`mission-item ${mission.isCompleted ? 'completed' : ''}`}
            >
              <div className="mission-icon">{getIcon(mission.category)}</div>
              <div className="mission-info">
                <h4>{mission.title}</h4>
                <p>{mission.description}</p>
              </div>
              <div className="mission-reward">
                {mission.isCompleted ? (
                  <span style={{ color: '#10b981' }}>✅ DONE</span>
                ) : (
                  <button 
                    className="btn btn-sm btn-primary"
                    onClick={() => handleComplete(mission._id)}
                  >
                    +{mission.xpReward} XP
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="empty-state">Check back tomorrow for new missions!</p>
        )}
      </div>
    </div>
  );
};

export default MissionBoard;
