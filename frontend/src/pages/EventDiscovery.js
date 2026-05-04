import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import eventService from '../services/eventService';
import '../styles/eventDiscovery.css';

const categories = ['All', 'Hackathon', 'Technical', 'Cultural', 'Sports', 'Workshop', 'Seminar', 'Other'];

const EventDiscovery = () => {
  // Production-ready Event Hub
  const navigate = useNavigate();
  const location = useLocation();
  const { user, updateUser } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Use URL search param if available
  const queryParams = new URLSearchParams(location.search);
  const initialQuery = queryParams.get('search') || '';
  
  const [query, setQuery] = useState(initialQuery);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('All');
  const [sortBy, setSortBy] = useState('Date'); // New: Sorting state

  const getCategoryIcon = (cat) => {
    switch(cat) {
      case 'Hackathon': return '⚡';
      case 'Technical': return '💻';
      case 'Workshop': return '🛠️';
      case 'Cultural': return '🎨';
      case 'Sports': return '🏆';
      case 'Seminar': return '📢';
      default: return '📍';
    }
  };

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const response = await eventService.getEvents();
        const fetchedEvents = response.data.data?.events || response.data.events || [];
        
        if (fetchedEvents.length === 0) {
           throw new Error('No events found');
        }
        setEvents(fetchedEvents);
      } catch (err) {
        console.warn('Using local fallback events due to:', err.message);
        setEvents([
          {
            _id: 'fallback-1',
            title: 'Technical Symposium 2026',
            description: 'The biggest annual tech fest featuring paper presentations and project expos.',
            category: 'Technical',
            location: 'Main Auditorium',
            date: new Date('2026-05-10'),
            time: '09:00 AM',
            points: 40,
            isExternal: true,
            source: 'Knowafest',
            externalLink: 'https://www.knowafest.com',
            registeredUsers: []
          },
          {
            _id: 'fallback-2',
            title: 'AI & ML Boot Camp',
            description: '3-day intensive training on building real-world AI applications.',
            category: 'Workshop',
            location: 'Lab 5, IT Block',
            date: new Date('2026-05-12'),
            time: '10:00 AM',
            points: 50,
            isExternal: false,
            registeredUsers: []
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  const handleRegister = async (eventId) => {
    try {
      const response = await eventService.registerForEvent(eventId);
      if (response.data.status === 'waitlisted') {
        alert('Event is full. You have been added to the waitlist!');
      } else {
        alert(response.message || 'Registered successfully');
      }
      
      // Update local state if needed (re-fetch events to get updated counts)
      const updatedEvents = await eventService.getEvents();
      setEvents(updatedEvents.data.events);
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

  const filteredEvents = events.filter((event) => {
    const categoryMatch = categoryFilter === 'All' || event.category === categoryFilter;
    
    // Date Filtering Logic
    let dateMatch = true;
    const eventDate = new Date(event.date);
    const now = new Date();
    
    if (dateFilter === 'Today') {
      dateMatch = eventDate.toDateString() === now.toDateString();
    } else if (dateFilter === 'This Week') {
      const nextWeek = new Date();
      nextWeek.setDate(now.getDate() + 7);
      dateMatch = eventDate >= now && eventDate <= nextWeek;
    } else if (dateFilter === 'This Month') {
      dateMatch = eventDate.getMonth() === now.getMonth() && eventDate.getFullYear() === now.getFullYear();
    }

    const lowerQuery = query.toLowerCase();
    const eventText = `${event.title} ${event.description} ${event.location} ${event.organizer}`.toLowerCase();

    return categoryMatch && dateMatch && eventText.includes(lowerQuery);
  });

  // New: Smart Sorting Logic
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    if (sortBy === 'XP') return (b.points || 0) - (a.points || 0);
    return new Date(a.date) - new Date(b.date);
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
          <button className="btn-filters" type="button" onClick={() => { setCategoryFilter('All'); setDateFilter('All'); setQuery(''); }}>
            Reset All
          </button>
        </div>
        <div className="filter-group">
          <label>Category</label>
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
        <div className="filter-group">
          <label>Date</label>
          <div className="category-chips">
            {['All', 'Today', 'This Week', 'This Month'].map((date) => (
              <button
                key={date}
                type="button"
                className={`category-chip ${dateFilter === date ? 'active' : ''}`}
                onClick={() => setDateFilter(date)}
              >
                {date}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-group">
          <label>Sort By</label>
          <div className="category-chips">
            {['Date', 'XP'].map((sort) => (
              <button
                key={sort}
                type="button"
                className={`category-chip ${sortBy === sort ? 'active' : ''}`}
                onClick={() => setSortBy(sort)}
              >
                {sort === 'Date' ? '📅 Soonest' : '💎 Highest XP'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="events-list">
        {loading && <p>Loading events...</p>}
        {!loading && sortedEvents.length === 0 && (
          <p className="error-text">No events match your search criteria.</p>
        )}
        {sortedEvents.map((event) => (
          <div key={event._id} className={`event-card ${event.points >= 50 ? 'premium-card' : ''}`}>
            <div className="event-card-header">
              <h2>{getCategoryIcon(event.category)} {event.title}</h2>
              <span className="event-category">{event.category}</span>
            </div>
            <p>{event.description}</p>
            <div className="event-meta">
              <span>📍 {event.location}</span>
              <span>
                📅 {new Date(event.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              </span>
              <span>⏰ {event.time}</span>
              <span className="xp-badge">+{event.points} XP</span>
              {event.isExternal && <span className="source-badge">Source: {event.source}</span>}
            </div>
            <div className="event-actions">
              {event.isExternal ? (
                <a 
                  href={event.externalLink} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="btn btn-primary"
                >
                  View Details ↗
                </a>
              ) : (
                <button 
                  className={`btn ${event.registeredUsers?.length >= event.capacity ? 'btn-waitlist' : 'btn-primary'}`}
                  onClick={() => handleRegister(event._id)}
                  disabled={event.registeredUsers?.includes(user?._id) || event.waitlist?.includes(user?._id)}
                >
                  {event.registeredUsers?.includes(user?._id) 
                    ? 'Registered' 
                    : event.waitlist?.includes(user?._id)
                      ? 'Waitlisted'
                      : event.registeredUsers?.length >= event.capacity 
                        ? 'Join Waitlist' 
                        : 'Register'}
                </button>
              )}

              <button
                className={`btn btn-secondary ${new Set((user?.eventsSaved || []).map(String)).has(String(event._id)) ? 'saved' : ''}`}
                onClick={() => handleSave(event._id)}
              >
                {new Set((user?.eventsSaved || []).map(String)).has(String(event._id)) ? 'Saved' : 'Save'}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="footer-spacer"></div>
    </div>
  );
};

export default EventDiscovery;