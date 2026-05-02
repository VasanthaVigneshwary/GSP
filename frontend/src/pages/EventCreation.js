import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import eventService from '../services/eventService';
import QRGenerator from '../components/QRGenerator';
import '../styles/eventCreation.css';

const categories = ['Technical', 'Cultural', 'Sports', 'Workshop', 'Seminar', 'Other'];

const EventCreation = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [createdEvent, setCreatedEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Technical',
    organizer: '',
    date: '',
    time: '',
    location: '',
    description: '',
    capacity: 100,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await eventService.createEvent(formData);
      setCreatedEvent(response.data.event);
      setStep(4);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  return (
    <div className="event-creation-container">
      <div className="creation-shell">
        <div className="header">
          <button className="back-btn" onClick={() => navigate('/dashboard')}>←</button>
          <h1>Host an Event</h1>
          <p>Create a new experience and earn points for your leadership.</p>
        </div>

        <div className="stepper">
          {[1, 2, 3].map((s) => (
            <div key={s} className={`step ${step >= s ? 'active' : ''} ${step === s ? 'current' : ''}`}>
              {s}
            </div>
          ))}
        </div>

        <div className="creation-card card">
          {step === 1 && (
            <div className="form-step">
              <h2>Basic Information</h2>
              <div className="input-group">
                <label>Event Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Tech Summit 2026"
                  required
                />
              </div>
              <div className="input-group">
                <label>Category</label>
                <select name="category" value={formData.category} onChange={handleChange}>
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="input-group">
                <label>Organizer Name</label>
                <input
                  type="text"
                  name="organizer"
                  value={formData.organizer}
                  onChange={handleChange}
                  placeholder="Club or Department name"
                  required
                />
              </div>
              <button className="btn btn-primary" onClick={nextStep} disabled={!formData.title || !formData.organizer}>
                Next: Date & Location
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="form-step">
              <h2>When & Where</h2>
              <div className="input-group">
                <label>Date</label>
                <input type="date" name="date" value={formData.date} onChange={handleChange} required />
              </div>
              <div className="input-group">
                <label>Time</label>
                <input type="time" name="time" value={formData.time} onChange={handleChange} required />
              </div>
              <div className="input-group">
                <label>Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Building, Room Number or URL"
                  required
                />
              </div>
              <div className="action-buttons">
                <button className="btn btn-secondary" onClick={prevStep}>Back</button>
                <button className="btn btn-primary" onClick={nextStep} disabled={!formData.date || !formData.time || !formData.location}>
                  Next: Details
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="form-step">
              <h2>Event Details</h2>
              <div className="input-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Tell students what to expect..."
                  rows="4"
                  required
                ></textarea>
              </div>
              <div className="input-group">
                <label>Capacity</label>
                <input
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleChange}
                  min="1"
                  required
                />
              </div>
              <div className="action-buttons">
                <button className="btn btn-secondary" onClick={prevStep}>Back</button>
                <button className="btn btn-primary" onClick={handleSubmit} disabled={loading || !formData.description}>
                  {loading ? 'Creating...' : 'Create Event & Generate QR'}
                </button>
              </div>
            </div>
          )}

          {step === 4 && createdEvent && (
            <div className="success-step">
              <div className="success-icon">✅</div>
              <h2>Event Created!</h2>
              <p>Your event is now live on the platform. +50 points added to your profile.</p>
              
              <div className="qr-box">
                <h3>Event QR Code</h3>
                <QRGenerator value={createdEvent.qrCode} size={200} />
                <p className="qr-hint">Show this code at the event for students to check-in.</p>
              </div>

              <div className="event-summary-mini">
                <p><strong>{createdEvent.title}</strong></p>
                <p>{new Date(createdEvent.date).toLocaleDateString()} at {createdEvent.time}</p>
                <p>📍 {createdEvent.location}</p>
              </div>

              <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>
                Return to Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventCreation;
