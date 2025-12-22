import React from 'react';
import ReactDOM from 'react-dom/client';
import { AuthProvider } from '@descope/react-sdk';
import App from './App';
import './index.css';

const descopeProjectId = import.meta.env.VITE_DESCOPE_PROJECT_ID;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider projectId={descopeProjectId}>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
