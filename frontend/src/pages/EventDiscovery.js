import React from 'react';
import '../styles/eventDiscovery.css';

const EventDiscovery = () => {
  return (
    <div className="event-discovery-container">
      <div className="header">
        <button className="btn-back">‹</button>
        <h1>Discover Events</h1>
        <button className="btn-notifications">🔔</button>
      </div>

      <div className="search-bar">
        <input type="text" placeholder="Search..." />
        <button className="btn-filters">⚙️ Filters</button>
      </div>

      <div className="filters">
        <div className="filter-category">
          <button>All</button>
          <button>Tech</button>
          <button>Sports</button>
          <button>Social</button>
          <button>Culture</button>
          <button>Career</button>
          <button>Wellness</button>
        </div>
        <div className="filter-date">
          <button>This Week</button>
          <button>This Month</button>
          <button>All</button>
        </div>
        <div className="filter-distance">
          <button>&lt; 5 min walk</button>
          <button>&lt; 10 min</button>
        </div>
      </div>

      <div className="events">
        <div className="event">
          <h3>🔥 Featured Event</h3>
          <h2>Startup Hackathon 2026</h2>
          <p>📍 Innovation Hub</p>
          <p>📅 May 10 - May 11 @ 9 AM</p>
          <p>👥 234 attending</p>
          <p>+15 bonus points</p>
          <button className="btn-learn-more">Learn More</button>
        </div>

        <div className="event">
          <h2>Book Club Meeting</h2>
          <p>📍 Library 3rd Floor</p>
          <p>📅 May 4 @ 5:00 PM</p>
          <p>👥 12 attending</p>
          <p>⭐ 4.7</p>
          <button className="btn-register">Register</button>
        </div>

        <div className="event">
          <h2>Basketball Tournament</h2>
          <p>📍 Sports Complex</p>
          <p>📅 May 6 @ 3:00 PM</p>
          <p>👥 85 attending</p>
          <p>⭐ 4.9</p>
          <button className="btn-register">Register</button>
        </div>

        <button className="btn-load-more">Load More</button>
      </div>

      <div className="footer">
        <button className="btn">🏠</button>
        <button className="btn">🔎</button>
        <button className="btn">🏆</button>
        <button className="btn">💬</button>
        <button className="btn">👤</button>
      </div>
    </div>
  );
};

export default EventDiscovery;