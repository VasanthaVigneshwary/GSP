import React from 'react';
import Sidebar from './Sidebar';
import './Layout.css';

const Layout = ({ children }) => {
  return (
    <div className="layout-container">
      <Sidebar />
      <main className="layout-content">
        <div className="content-inner">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
