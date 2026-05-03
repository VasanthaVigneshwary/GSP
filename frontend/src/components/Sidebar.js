import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: '🏠' },
    { name: 'Events', path: '/events', icon: '🔎' },
    { name: 'Clubs', path: '/clubs', icon: '🏆' },
    { name: 'Leaderboard', path: '/leaderboard', icon: '🏅' },
    { name: 'Wishlist', path: '/wishlist', icon: '❤️' },
    { name: 'Profile', path: '/profile/settings', icon: '👤' },
    { name: 'Notifications', path: '/dashboard', icon: '🔔' }, // We'll handle this click specially in a real app, for now it navigates to dashboard
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-brand" onClick={() => navigate('/dashboard')}>
        <div className="brand-logo">G</div>
        <span className="brand-name">GSP Hub</span>
      </div>

      <div className="sidebar-user">
        <div className="user-avatar">{user?.name?.charAt(0) || 'S'}</div>
        <div className="user-info">
          <p className="user-name">{user?.name || 'Student'}</p>
          <p className="user-level">Lvl {Math.floor((user?.points || 0) / 100) + 1}</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink 
            key={item.path} 
            to={item.path} 
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-text">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="logout-btn" onClick={logout}>
          <span className="nav-icon">🚪</span>
          <span className="nav-text">Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
