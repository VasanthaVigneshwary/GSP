import React from 'react';
import './XPProgressBar.css';

const XPProgressBar = ({ points }) => {
  const pointsPerLevel = 100;
  const level = Math.floor(points / pointsPerLevel) + 1;
  const currentXP = points % pointsPerLevel;
  const percentage = (currentXP / pointsPerLevel) * 100;
  const xpToNextLevel = pointsPerLevel - currentXP;

  return (
    <div className="xp-container">
      <div className="xp-header">
        <span className="xp-level">Level {level}</span>
        <span className="xp-status">{currentXP} / {pointsPerLevel} XP</span>
      </div>
      <div className="xp-bar-bg">
        <div 
          className="xp-bar-fill" 
          style={{ width: `${percentage}%` }}
        >
          <div className="xp-bar-shimmer"></div>
        </div>
      </div>
      <div className="xp-footer">
        <span>{xpToNextLevel} XP until Level {level + 1}</span>
      </div>
    </div>
  );
};

export default XPProgressBar;
