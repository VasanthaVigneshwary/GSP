import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/aiRoadmap.css';

const AiRoadmap = () => {
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        const token = localStorage.getItem('token');
        const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
        const response = await axios.get(`${API_BASE_URL}/ai/roadmap`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setRoadmap(response.data.data.roadmap);
      } catch (err) {
        console.error('Failed to load roadmap');
      } finally {
        setLoading(false);
      }
    };
    fetchRoadmap();
  }, []);

  const handleStepClick = (title) => {
    // Navigate to events page and search for the step title
    navigate(`/events?search=${encodeURIComponent(title)}`);
  };

  if (loading) return <div className="roadmap-loader">Generating your AI Career Path...</div>;
  if (!roadmap) return null;

  return (
    <div className="card roadmap-card">
      <div className="roadmap-header">
        <span className="ai-badge">AI ADVISOR</span>
        <h2>Your Personalized Roadmap</h2>
        <p className="target-role">Target: {roadmap.role}</p>
      </div>

      <div className="roadmap-timeline">
        {roadmap.steps.map((step, index) => (
          <div 
            key={index} 
            className={`roadmap-step ${step.status.toLowerCase().replace(' ', '-')}`}
            onClick={() => handleStepClick(step.title)}
            style={{ cursor: 'pointer' }}
          >
            <div className="step-number">{index + 1}</div>
            <div className="step-content">
              <h3>{step.title} ↗</h3>
              <p>{step.description}</p>
              <div className="step-footer">
                <span className={`status-pill ${step.status.toLowerCase().replace(' ', '-')}`}>
                  {step.status}
                </span>
                <span className="action-hint">Find Events →</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AiRoadmap;
