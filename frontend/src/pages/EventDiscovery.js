import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import eventService from '../services/eventService';
import '../styles/eventDiscovery.css';

const categories = ['All', 'Technical', 'Cultural', 'Sports', 'Workshop', 'Seminar', 'Other'];

const EventDiscovery = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const response = await eventService.getEvents();
        setEvents(response.data.events || []);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to load events');
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

  const handleSave = async (eventId) => {
    try {
      const response = await eventService.toggleSaveEvent(eventId);
      const saved = response.data?.data?.saved;
      const currentSaved = (user?.eventsSaved || []).map(String);
      const updatedSaved = saved
        ? Array.from(new Set([...currentSaved, eventId]))
        : currentSaved.filter((savedId) => savedId !== eventId);

      updateUser({
        ...user,
        eventsSaved: updatedSaved,
      });

      alert(response.message || (saved ? 'Saved to wishlist' : 'Removed from wishlist'));
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Unable to update wishlist');
    }
  };

  const savedEventIds = new Set((user?.eventsSaved || []).map(String));

  const filteredEvents = events.filter((event) => {
    const categoryMatch = categoryFilter === 'All' || event.category === categoryFilter;
    const lowerQuery = query.toLowerCase();
    const eventText = `${event.title} ${event.description} ${event.location} ${event.organizer}`.toLowerCase();

    return categoryMatch && eventText.includes(lowerQuery);
  });

  return (
    <div className="event-discovery-container">
      <div className="header">
        <div className="page-title">
          <h1>Discover Events</h1>
          <p>Browse curated campus experiences and join activities that earn you points.</p>
        </div>
        <div className="actions-row">
          <div className="action-pill">{filteredEvents.length} events</div>
          <button className="btn btn-secondary" onClick={() => navigate('/wishlist')}>
            ❤️ View wishlist
          </button>
          <button className="btn-notifications" onClick={() => alert('Notifications are coming soon')}>
            🔔
          </button>
        </div>
      </div>

      <div className="search-bar">
        <div className="search-field">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search events by title, location, or organizer"
          />
          <button className="btn-filters" type="button" onClick={() => setCategoryFilter('All')}>
            Reset
          </button>
        </div>
        <div className="category-chips">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={`category-chip ${categoryFilter === category ? 'active' : ''}`}
              onClick={() => setCategoryFilter(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="events-list">
        {loading && <p>Loading events...</p>}
        {error && <p className="error-text">{error}</p>}
        {!loading && !error && filteredEvents.length === 0 && (
          <p className="error-text">No events match your search criteria.</p>
        )}
        {filteredEvents.map((event) => (
          <div key={event._id} className="event-card">
            <div className="event-card-header">
              <h2>{event.title}</h2>
              <span className="event-category">{event.category}</span>
            </div>
            <p>{event.description}</p>
            <div className="event-meta">
              <span>📍 {event.location}</span>
              <span>
                📅 {new Date(event.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              </span>
              <span>⏰ {event.time}</span>
            </div>
            <div className="event-actions">
              <button className="btn btn-primary" onClick={() => handleRegister(event._id)}>
                Register
              </button>
              <button
                className={`btn btn-secondary ${savedEventIds.has(String(event._id)) ? 'saved' : ''}`}
                onClick={() => handleSave(event._id)}
              >
                {savedEventIds.has(String(event._id)) ? 'Saved' : 'Save'}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="footer">
        <button className="btn" onClick={() => navigate('/dashboard')}>
          🏠
        </button>
        <button className="btn" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          🔼
        </button>
        <button className="btn" onClick={() => alert('Coming soon')}>
          🏆
        </button>
        <button className="btn" onClick={() => alert('Coming soon')}>
          💬
        </button>
        <button className="btn" onClick={() => alert('Coming soon')}>
          👤
        </button>
      </div>
    </div>
  );
};

export default EventDiscovery;