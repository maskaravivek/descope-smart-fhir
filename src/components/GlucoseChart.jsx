import React from 'react';
import './GlucoseChart.css';

function GlucoseChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="no-data">
        <p>No glucose readings available</p>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getGlucoseStatus = (value) => {
    if (value < 70) return 'low';
    if (value > 180) return 'high';
    return 'normal';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'low':
        return '#f44336';
      case 'high':
        return '#ff9800';
      default:
        return '#4caf50';
    }
  };

  const maxValue = Math.max(...data.map((d) => d.value), 200);

  return (
    <div className="glucose-chart">
      <div className="chart-container">
        {data.map((reading, index) => {
          const status = getGlucoseStatus(reading.value);
          const height = (reading.value / maxValue) * 100;
          const color = getStatusColor(status);

          return (
            <div key={reading.id || index} className="chart-bar-wrapper">
              <div className="chart-bar-container">
                <div
                  className="chart-bar"
                  style={{
                    height: `${height}%`,
                    backgroundColor: color,
                  }}
                >
                  <span className="bar-value">{reading.value}</span>
                </div>
              </div>
              <div className="chart-label">{formatDate(reading.date)}</div>
            </div>
          );
        })}
      </div>

      <div className="glucose-table">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Value</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {data.map((reading, index) => {
              const status = getGlucoseStatus(reading.value);
              return (
                <tr key={reading.id || index}>
                  <td>{formatDate(reading.date)}</td>
                  <td>
                    {reading.value} {reading.unit}
                  </td>
                  <td>
                    <span
                      className="status-badge"
                      style={{ backgroundColor: getStatusColor(status) }}
                    >
                      {status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="glucose-legend">
        <div className="legend-item">
          <span className="legend-color" style={{ backgroundColor: '#4caf50' }}></span>
          <span>Normal (70-180 mg/dL)</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ backgroundColor: '#f44336' }}></span>
          <span>Low (&lt;70 mg/dL)</span>
        </div>
        <div className="legend-item">
          <span className="legend-color" style={{ backgroundColor: '#ff9800' }}></span>
          <span>High (&gt;180 mg/dL)</span>
        </div>
      </div>
    </div>
  );
}

export default GlucoseChart;
