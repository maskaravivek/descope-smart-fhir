import DiabetesMonitor from './components/DiabetesMonitor';
import './App.css';

function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <h1>Diabetes Monitoring Dashboard</h1>
          <div className="user-section">
            <span className="welcome-text">
              Demo Application
            </span>
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
