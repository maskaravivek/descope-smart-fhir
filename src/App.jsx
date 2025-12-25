import React, { useState, useEffect } from 'react';
import FHIR from 'fhirclient';
import DiabetesMonitor from './components/DiabetesMonitor';
import './App.css';

function App() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fhirClient, setFhirClient] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    initializeFHIRClient();
  }, []);

  const initializeFHIRClient = async () => {
    try {
      // Check if we're coming back from SMART OAuth flow
      const client = await FHIR.oauth2.ready();

      setFhirClient(client);

      // Get patient info for display
      const patient = await client.patient.read();
      const patientName = getPatientName(patient);
      setUser({ name: patientName, id: patient.id });

      setLoading(false);
    } catch (err) {
      console.error('FHIR initialization error:', err);
      setError('Unable to connect to FHIR server. Please start from your EHR system.');
      setLoading(false);
    }
  };

  const getPatientName = (patient) => {
    if (!patient.name || patient.name.length === 0) {
      return 'Patient';
    }
    const name = patient.name[0];
    const given = name.given ? name.given.join(' ') : '';
    const family = name.family || '';
    return `${given} ${family}`.trim() || 'Patient';
  };

  const handleLogout = () => {
    // Clear FHIR session and redirect to launch page
    sessionStorage.clear();
    localStorage.clear();
    window.location.href = '/launch.html';
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (error || !fhirClient) {
    return (
      <div className="app-container">
        <div className="login-container">
          <div className="login-card">
            <h1>Diabetes Monitoring</h1>
            <p className="subtitle" style={{ color: '#e53e3e' }}>
              {error || 'Not connected to EHR system'}
            </p>
            <p style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
              This app must be launched from your EHR system using SMART on FHIR.
            </p>
            <a
              href="/launch.html?iss=https://launch.smarthealthit.org/v/r4/fhir&launch=test-launch"
              style={{
                marginTop: '20px',
                display: 'inline-block',
                padding: '10px 20px',
                backgroundColor: '#667eea',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '6px'
              }}
            >
              Test with SMART Launcher
            </a>
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
              Welcome, {user?.name || 'Patient'}
            </span>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </div>
        </div>
      </header>
      <main className="app-main">
        <DiabetesMonitor fhirClient={fhirClient} />
      </main>
    </div>
  );
}

export default App;
