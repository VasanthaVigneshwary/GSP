import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/profileSettings.css';

const departments = [
  'Computer Science',
  'Engineering',
  'Business',
  'Arts & Sciences',
  'Education',
  'Health & Medicine',
  'Law',
  'Other',
];

const years = ['Freshman', 'Sophomore', 'Junior', 'Senior', 'Other'];
const interestsList = ['Technical', 'Cultural', 'Sports', 'Workshop', 'Seminar', 'Other'];

const ProfileSettings = () => {
  const { user, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    department: user?.department || 'Computer Science',
    year: user?.year || 'Freshman',
    interests: user?.interests || [],
    privacySettings: user?.privacySettings || {
      profileVisibility: 'Public',
      showPoints: true,
      showBadges: true,
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('privacy.')) {
      const field = name.split('.')[1];
      setFormData({
        ...formData,
        privacySettings: { ...formData.privacySettings, [field]: value === 'true' || value === 'false' ? value === 'true' : value }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleInterestToggle = (interest) => {
    const updatedInterests = formData.interests.includes(interest)
      ? formData.interests.filter(i => i !== interest)
      : [...formData.interests, interest];
    setFormData({ ...formData, interests: updatedInterests });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    try {
      const res = await updateProfile(formData);
      if (res.success) {
        setSuccess('Profile updated successfully!');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      alert(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-settings-container">
      <div className="settings-shell">
        <div className="header">
          <button className="back-btn" onClick={() => navigate('/dashboard')}>←</button>
          <h1>Profile Settings</h1>
          <p>Manage your public identity and privacy preferences.</p>
        </div>

        <form onSubmit={handleSubmit} className="settings-form">
          <div className="settings-card card">
            <h2>Public Profile</h2>
            <div className="input-group">
              <label>Full Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="input-group">
              <label>Bio</label>
              <textarea 
                name="bio" 
                value={formData.bio} 
                onChange={handleChange} 
                placeholder="Tell others about yourself..."
                rows="4"
              ></textarea>
            </div>
            <div className="grid-inputs">
              <div className="input-group">
                <label>Department</label>
                <select name="department" value={formData.department} onChange={handleChange}>
                  {departments.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div className="input-group">
                <label>Year</label>
                <select name="year" value={formData.year} onChange={handleChange}>
                  {years.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="settings-card card">
            <h2>Interests</h2>
            <p className="hint">Select categories you're interested in to get better recommendations.</p>
            <div className="interests-grid">
              {interestsList.map(interest => (
                <button
                  key={interest}
                  type="button"
                  className={`interest-chip ${formData.interests.includes(interest) ? 'active' : ''}`}
                  onClick={() => handleInterestToggle(interest)}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>

          <div className="settings-card card">
            <h2>Privacy Settings</h2>
            <div className="input-group">
              <label>Profile Visibility</label>
              <select 
                name="privacy.profileVisibility" 
                value={formData.privacySettings.profileVisibility} 
                onChange={handleChange}
              >
                <option value="Public">Public (Anyone can see your profile)</option>
                <option value="Friends-Only">Friends Only (Only people you follow can see)</option>
                <option value="Private">Private (Only you can see your profile)</option>
              </select>
            </div>
            <div className="checkbox-group">
              <label className="switch-label">
                <span>Show Total Points on Profile</span>
                <input 
                  type="checkbox" 
                  checked={formData.privacySettings.showPoints} 
                  onChange={(e) => setFormData({
                    ...formData, 
                    privacySettings: { ...formData.privacySettings, showPoints: e.target.checked }
                  })}
                />
              </label>
              <label className="switch-label">
                <span>Show Badges on Profile</span>
                <input 
                  type="checkbox" 
                  checked={formData.privacySettings.showBadges} 
                  onChange={(e) => setFormData({
                    ...formData, 
                    privacySettings: { ...formData.privacySettings, showBadges: e.target.checked }
                  })}
                />
              </label>
            </div>
          </div>

          <div className="form-actions">
            {success && <div className="success-banner">{success}</div>}
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving Changes...' : 'Save All Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileSettings;
