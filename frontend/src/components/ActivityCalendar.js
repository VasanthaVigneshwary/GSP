import React from 'react';
import './ActivityCalendar.css';

const ActivityCalendar = ({ activityLog }) => {
  // Generate days for the last 6 months (approx 180 days)
  const generateDays = () => {
    const days = [];
    const today = new Date();
    for (let i = 180; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      
      const logEntry = (activityLog || []).find(log => log.date === dateString);
      const count = logEntry ? logEntry.count : 0;
      
      days.push({
        date: dateString,
        count: count,
        level: count === 0 ? 0 : Math.min(count, 4) // 0 to 4 levels of green
      });
    }
    return days;
  };

  const days = generateDays();
  
  return (
    <div className="activity-calendar-wrapper">
      <div className="calendar-header">
        {(activityLog || []).length} contributions in the last 6 months
      </div>
      <div className="calendar-grid">
        {days.map((day, index) => (
          <div 
            key={index} 
            className={`calendar-day level-${day.level}`}
            title={`${day.count} activities on ${day.date}`}
          ></div>
        ))}
      </div>
      <div className="calendar-footer">
        <span>Less</span>
        <div className="legend">
          <div className="calendar-day level-0"></div>
          <div className="calendar-day level-1"></div>
          <div className="calendar-day level-2"></div>
          <div className="calendar-day level-3"></div>
          <div className="calendar-day level-4"></div>
        </div>
        <span>More</span>
      </div>
    </div>
  );
};

export default ActivityCalendar;
