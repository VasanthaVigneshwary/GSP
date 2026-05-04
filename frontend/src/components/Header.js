import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Bell, Search } from 'lucide-react';
import './Header.css';

const Header = () => {
  const { user } = useAuth();
  
  // Environment-based UI check
  const isDevMode = process.env.REACT_APP_ENV === 'development' || process.env.NODE_ENV === 'development';

  return (
    <header className="app-header glass-panel">
      <div className="header-left">
        <div className="search-bar">
          <Search size={18} />
          <input type="text" placeholder="Search events, clubs, or members..." />
        </div>
      </div>
      
      <div className="header-right">
        {isDevMode && (
          <span className="dev-mode-badge" title="Environment: Development">
            DEV MODE
          </span>
        )}
        <button className="icon-btn">
          <Bell size={20} />
        </button>
        <div className="user-profile-sm">
          <div className="avatar">{user?.name ? user.name.charAt(0) : 'U'}</div>
        </div>
      </div>
    </header>
  );
};

export default Header;
