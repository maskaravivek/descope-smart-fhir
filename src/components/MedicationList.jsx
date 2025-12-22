import React from 'react';
import './MedicationList.css';

function MedicationList({ medications }) {
  if (!medications || medications.length === 0) {
    return (
      <div className="no-data">
        <p>No active medications found</p>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return '#4caf50';
      case 'completed':
        return '#2196f3';
      case 'stopped':
        return '#f44336';
      default:
        return '#9e9e9e';
    }
  };

  return (
    <div className="medication-list">
      {medications.map((medication, index) => (
        <div key={medication.id || index} className="medication-card">
          <div className="medication-header">
            <h4 className="medication-name">{medication.name}</h4>
            <span
              className="medication-status"
              style={{ backgroundColor: getStatusColor(medication.status) }}
            >
              {medication.status}
            </span>
          </div>

          <div className="medication-details">
            <div className="detail-row">
              <span className="detail-label">Dosage:</span>
              <span className="detail-value">{medication.dosageInstruction}</span>
            </div>

            <div className="detail-row">
              <span className="detail-label">Prescribed:</span>
              <span className="detail-value">{formatDate(medication.authoredOn)}</span>
            </div>
          </div>
        </div>
      ))}

      <div className="medication-disclaimer">
        <p>
          Always consult with your healthcare provider before making any changes to your
          medication regimen.
        </p>
      </div>
    </div>
  );
}

export default MedicationList;
