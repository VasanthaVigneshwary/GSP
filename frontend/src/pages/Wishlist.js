import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import eventService from '../services/eventService';
import '../styles/eventDiscovery.css';

const Wishlist = () => {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadWishlist = async () => {
      try {
        const response = await eventService.getSavedEvents();
        setEvents(response.data.events || []);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to load wishlist');
      } finally {
        setLoading(false);
      }
    };

    loadWishlist();
  }, []);

  const handleRemove = async (eventId) => {
    try {
      const response = await eventService.toggleSaveEvent(eventId);
      const updatedSaved = (user?.eventsSaved || []).map(String).filter((savedId) => savedId !== eventId);
      updateUser({
        ...user,
        eventsSaved: updatedSaved,
      });
      setEvents((currentEvents) => currentEvents.filter((event) => String(event._id) !== eventId));
      alert(response.message || 'Removed from wishlist');
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to remove from wishlist');
    }
  };

  return (
    <div className="event-discovery-container">
      <div className="header">
        <div className="page-title">
          <h1>Wishlist</h1>
          <p>Keep track of events you want to revisit before they start.</p>
        </div>
        <div className="actions-row">
          <div className="action-pill">{events.length} saved events</div>
          <button className="btn btn-secondary" onClick={() => navigate('/events')}>
            Browse more events
          </button>
        </div>
      </div>

      <div className="events-list">
        {loading && <p>Loading your wishlist...</p>}
        {error && <p className="error-text">{error}</p>}
        {!loading && !error && events.length === 0 && (
          <p className="error-text">Your wishlist is empty. Save events while browsing to keep them here.</p>
        )}
        {events.map((event) => (
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
              <button className="btn btn-secondary" onClick={() => handleRemove(String(event._id))}>
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="footer">
        <button className="btn" onClick={() => navigate('/dashboard')}>
          🏠
        </button>
        <button className="btn" onClick={() => navigate('/events')}>
          🔎
        </button>
        <button className="btn" onClick={() => navigate('/wishlist')}>
          ❤️
        </button>
      </div>
    </div>
  );
};

export default Wishlist;
