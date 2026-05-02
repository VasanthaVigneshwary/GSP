import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import eventService from '../services/eventService';
import '../styles/eventDiscovery.css';

const EventDiscovery = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const response = await eventService.getEvents();
        setEvents(response.data.events || []);
      } catch (err) {
        setError(err.message || 'Failed to load events');
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  const handleRegister = async (eventId) => {
    try {
      const response = await eventService.registerForEvent(eventId);
      alert(response.message || 'Registered successfully');
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Registration failed');
    }
  };

  return (
    <div className="event-discovery-container">
      <div className="header">
        <button className="btn-back" onClick={() => navigate('/dashboard')}>
          ‹
        </button>
        <h1>Discover Events</h1>
        <button className="btn-notifications">🔔</button>
      </div>

      <div className="search-bar">
        <input type="text" placeholder="Search events" disabled />
        <button className="btn-filters">⚙️ Filters</button>
      </div>

      <div className="events-list">
        {loading && <p>Loading events...</p>}
        {error && <p className="error-text">{error}</p>}
        {!loading && !error && events.length === 0 && <p>No events available yet.</p>}
        {events.map((event) => (
          <div key={event._id} className="event-card">
            <div className="event-card-header">
              <h2>{event.title}</h2>
              <span className="event-category">{event.category}</span>
            </div>
            <p>{event.description}</p>
            <div className="event-meta">
              <span>📍 {event.location}</span>
              <span>📅 {new Date(event.date).toLocaleDateString()}</span>
              <span>⏰ {event.time}</span>
            </div>
            <div className="event-actions">
              <button className="btn btn-primary" onClick={() => handleRegister(event._id)}>
                Register
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="footer">
        <button className="btn" onClick={() => navigate('/dashboard')}>
          🏠
        </button>
        <button className="btn">🔎</button>
        <button className="btn">🏆</button>
        <button className="btn">💬</button>
        <button className="btn">👤</button>
      </div>
    </div>
  );
};

export default EventDiscovery;