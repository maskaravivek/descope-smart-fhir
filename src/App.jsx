import React, { useState, useEffect } from 'react';
import { useDescope, useSession, useUser } from '@descope/react-sdk';
import { Descope } from '@descope/react-sdk';
import DiabetesMonitor from './components/DiabetesMonitor';
import './App.css';

function App() {
  const { isAuthenticated, isSessionLoading } = useSession();
  const { user } = useUser();
  const { logout } = useDescope();

  const handleLogout = () => {
    logout();
  };

  if (isSessionLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="app-container">
        <div className="login-container">
          <div className="login-card">
            <h1>Diabetes Monitoring</h1>
            <p className="subtitle">
              Access your glucose readings and medication data
            </p>
            <div className="descope-wrapper">
              <Descope
                flowId={import.meta.env.VITE_DESCOPE_FLOW_ID || 'sign-up-or-in'}
                theme="light"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <h1>Diabetes Monitoring Dashboard</h1>
          <div className="user-section">
            <span className="welcome-text">
              Welcome, {user?.name || user?.email || 'Patient'}
            </span>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </div>
        </div>
      </header>
      <main className="app-main">
        <DiabetesMonitor />
      </main>
    </div>
  );
}

export default App;
