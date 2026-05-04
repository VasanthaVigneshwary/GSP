import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon, LogOut } from 'lucide-react';
import './Sidebar.css';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: '🏠' },
    { name: 'Event Hub', path: '/events', icon: '🔎' },
    { name: 'Guild Battles', path: '/clubs', icon: '🛡️' },
    { name: 'Leaderboards', path: '/leaderboard', icon: '🏆' },
    { name: 'My Wishlist', path: '/wishlist', icon: '❤️' },
    { name: 'My Profile', path: '/profile/settings', icon: '👤' },
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
          <p className="user-name">{user?.username || 'Student'}</p>
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
        <button className="theme-toggle-btn" onClick={toggleTheme} title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}>
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          <span className="nav-text">{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
        </button>
        <button className="logout-btn" onClick={logout}>
          <LogOut size={20} className="nav-icon" />
          <span className="nav-text">Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
