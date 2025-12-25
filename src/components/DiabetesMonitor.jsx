import React, { useState, useEffect } from 'react';
import FHIRService from '../services/fhirClient';
import GlucoseChart from './GlucoseChart';
import MedicationList from './MedicationList';
import './DiabetesMonitor.css';

function DiabetesMonitor({ fhirClient }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [patient, setPatient] = useState(null);
  const [glucoseData, setGlucoseData] = useState([]);
  const [medications, setMedications] = useState([]);
  const [useMockData, setUseMockData] = useState(false);

  useEffect(() => {
    loadPatientData();
  }, [fhirClient, useMockData]);

  const loadPatientData = async () => {
    setLoading(true);
    setError(null);

    try {
      if (useMockData) {
        loadMockData();
      } else {
        await loadFHIRData();
      }
    } catch (err) {
      console.error('Error loading patient data:', err);
      setError('Unable to load FHIR data. Using mock data instead.');
      setUseMockData(true);
    } finally {
      setLoading(false);
    }
  };

  const loadFHIRData = async () => {
    if (!fhirClient) {
      throw new Error('FHIR client not available');
    }

    // Initialize the service with the authenticated FHIR client
    const fhirService = new FHIRService(fhirClient);

    const patientData = await fhirService.getPatient();
    setPatient(patientData);

    if (patientData) {
      const glucose = await fhirService.getGlucoseObservations(patientData.id);
      const meds = await fhirService.getMedicationRequests(patientData.id);

      setGlucoseData(glucose);
      setMedications(meds);
    }
  };

  const loadMockData = () => {
    setPatient({
      id: 'demo-patient-001',
      name: 'Demo Patient',
      birthDate: '1975-05-15',
      gender: 'female',
    });

    const mockGlucose = [
      { id: '1', date: '2025-12-21T08:00:00Z', value: 120, unit: 'mg/dL', status: 'final' },
      { id: '2', date: '2025-12-20T08:00:00Z', value: 135, unit: 'mg/dL', status: 'final' },
      { id: '3', date: '2025-12-19T08:00:00Z', value: 110, unit: 'mg/dL', status: 'final' },
      { id: '4', date: '2025-12-18T08:00:00Z', value: 145, unit: 'mg/dL', status: 'final' },
      { id: '5', date: '2025-12-17T08:00:00Z', value: 125, unit: 'mg/dL', status: 'final' },
      { id: '6', date: '2025-12-16T08:00:00Z', value: 118, unit: 'mg/dL', status: 'final' },
      { id: '7', date: '2025-12-15T08:00:00Z', value: 132, unit: 'mg/dL', status: 'final' },
      { id: '8', date: '2025-12-14T08:00:00Z', value: 128, unit: 'mg/dL', status: 'final' },
      { id: '9', date: '2025-12-13T08:00:00Z', value: 115, unit: 'mg/dL', status: 'final' },
      { id: '10', date: '2025-12-12T08:00:00Z', value: 140, unit: 'mg/dL', status: 'final' },
    ];

    const mockMedications = [
      {
        id: 'med-1',
        name: 'Metformin 500mg',
        status: 'active',
        authoredOn: '2025-01-15',
        dosageInstruction: 'Take 1 tablet twice daily with meals',
      },
      {
        id: 'med-2',
        name: 'Insulin Glargine 100 units/mL',
        status: 'active',
        authoredOn: '2025-01-15',
        dosageInstruction: 'Inject 20 units subcutaneously once daily at bedtime',
      },
      {
        id: 'med-3',
        name: 'Lisinopril 10mg',
        status: 'active',
        authoredOn: '2025-02-01',
        dosageInstruction: 'Take 1 tablet once daily',
      },
    ];

    setGlucoseData(mockGlucose);
    setMedications(mockMedications);
  };

  const calculateStats = () => {
    if (glucoseData.length === 0) {
      return { average: 0, min: 0, max: 0, count: 0 };
    }

    const values = glucoseData.map((d) => d.value);
    const average = (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1);
    const min = Math.min(...values);
    const max = Math.max(...values);

    return { average, min, max, count: values.length };
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading patient data...</p>
      </div>
    );
  }

  const stats = calculateStats();

  return (
    <div className="diabetes-monitor">
      {error && (
        <div className="alert alert-warning">
          <p>{error}</p>
        </div>
      )}

      {patient && (
        <div className="patient-info">
          <h2>{patient.name}</h2>
          <div className="patient-details">
            <span>DOB: {patient.birthDate}</span>
            <span>Gender: {patient.gender}</span>
            <span>Patient ID: {patient.id}</span>
          </div>
        </div>
      )}

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{stats.average}</div>
          <div className="stat-label">Average Glucose (mg/dL)</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.min}</div>
          <div className="stat-label">Minimum</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.max}</div>
          <div className="stat-label">Maximum</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.count}</div>
          <div className="stat-label">Readings</div>
        </div>
      </div>

      <div className="data-grid">
        <div className="data-section">
          <h3>Glucose Readings</h3>
          <GlucoseChart data={glucoseData} />
        </div>

        <div className="data-section">
          <h3>Active Medications</h3>
          <MedicationList medications={medications} />
        </div>
      </div>

      {useMockData && (
        <div className="mock-data-notice">
          Using mock data for demonstration purposes
        </div>
      )}
    </div>
  );
}

export default DiabetesMonitor;
