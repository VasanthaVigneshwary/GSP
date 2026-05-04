import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="app-footer glass-panel">
      <div className="footer-content">
        <p>&copy; {new Date().getFullYear()} Gamified Student Platform (GSP). All rights reserved.</p>
        <div className="footer-links">
          <a href="#privacy">Privacy Policy</a>
          <a href="#terms">Terms of Service</a>
          <a href="#support">Support</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
