import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';
import AiMentor from './AiMentor';
import './Layout.css';

const Layout = ({ children }) => {
  return (
    <div className="layout-container">
      <Sidebar />
      <main className="layout-content">
        <div className="content-inner">
          <Header />
          {children}
          <Footer />
        </div>
      </main>
      <AiMentor /> 
    </div>
  );
};

export default Layout;
