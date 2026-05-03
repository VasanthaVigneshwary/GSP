import React, { useState, useEffect } from 'react';
import './AIAssistant.css';

const AIAssistant = ({ user }) => {
  const [insight, setInsight] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const typingIntervalRef = React.useRef(null);

  const generateSmartInsight = () => {
    // Clear any existing interval to prevent scrambled text
    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
    }

    setIsTyping(true);
    setInsight('');
    
    const prompts = [
      `Based on your ${user?.points || 0} XP and ${user?.department} background, you should aim for the upcoming Tech Symposium to boost your leadership rank.`,
      `I see you have ${user?.certificates?.length || 0} certificates. Your growth in technical skills is impressive! Try a cultural event next to balance your profile.`,
      `Your ${user?.streak || 0}-day streak is legendary! Keep it up for 3 more days to unlock the 'Consistency King' badge.`,
      `Future of AI looks bright for a ${user?.year} like you. Focus on Full-Stack projects this month.`
    ];

    const randomInsight = prompts[Math.floor(Math.random() * prompts.length)];
    
    let i = 0;
    typingIntervalRef.current = setInterval(() => {
      setInsight(prev => prev + randomInsight.charAt(i));
      i++;
      if (i >= randomInsight.length) {
        clearInterval(typingIntervalRef.current);
        setIsTyping(false);
      }
    }, 30);
  };

  useEffect(() => {
    generateSmartInsight();
    return () => {
      if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.points]);

  return (
    <div className="ai-assistant-card">
      <div className="ai-header">
        <div className="ai-icon-wrapper">
          <span className="ai-icon">✨</span>
          <div className="ai-pulse"></div>
        </div>
        <div className="ai-title">
          <h4>GSP Smart Mentor</h4>
          <p className="ai-status">{isTyping ? 'Analysing your progress...' : 'AI Analysis Ready'}</p>
        </div>
        <button className="ai-refresh" onClick={generateSmartInsight} title="Regenerate Insight">
          🔄
        </button>
      </div>
      
      <div className="ai-content">
        <p className="ai-text">
          {insight}
          {isTyping && <span className="typing-cursor">|</span>}
        </p>
      </div>
      
      <div className="ai-footer">
        <span className="ai-tag">Custom Transformer Model v1.0</span>
      </div>
    </div>
  );
};

export default AIAssistant;
