import React from 'react';
import Sidebar from './Sidebar';
import AiMentor from './AiMentor'; // New Import
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
      <AiMentor /> 
    </div>
  );
};

export default Layout;
