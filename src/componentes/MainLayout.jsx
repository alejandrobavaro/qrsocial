import React from 'react';
import Header from './Header';
import Footer from './Footer';
import NotificationBar from './NotificationBar';
import '../assets/scss/_03-Componentes/_MainLayout.scss';

const MainLayout = ({ children }) => {
  return (
    <div className="qrsocial-app">
      <NotificationBar />
      <Header />
      
      <main className="main-content">
        <div className="content-container">
          {children}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default MainLayout;