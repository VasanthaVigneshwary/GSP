import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/aiRoadmap.css';

const AiRoadmap = () => {
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);

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
          <div key={index} className={`roadmap-step ${step.status.toLowerCase().replace(' ', '-')}`}>
            <div className="step-number">{index + 1}</div>
            <div className="step-content">
              <h3>{step.title}</h3>
              <p>{step.description}</p>
              <span className={`status-pill ${step.status.toLowerCase().replace(' ', '-')}`}>
                {step.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AiRoadmap;
