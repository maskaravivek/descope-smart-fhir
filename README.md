# Diabetes Monitoring Dashboard

A simple React application for monitoring diabetes health metrics, including glucose readings and medication tracking.

## Quick Start

### Prerequisites

- Node.js 18+

### Setup

1. **Install dependencies**

```bash
npm install
```

2. **Run the app**

```bash
npm run dev
```

3. **Open in browser**

Navigate to `http://localhost:5173`

The app will display a demo patient dashboard with sample glucose readings and medications.

## Features

- 📊 **Glucose Tracking** - Visual chart of blood glucose readings over time
- 💊 **Medication List** - Active medications with dosage instructions
- 📈 **Statistics** - Average, min, and max glucose values
- 🎨 **Clean UI** - Modern, responsive design

## Project Structure

```
├── src/
│   ├── components/
│   │   ├── DiabetesMonitor.jsx    # Main dashboard component
│   │   ├── GlucoseChart.jsx       # Glucose visualization
│   │   └── MedicationList.jsx     # Medication display
│   ├── services/
│   │   └── fhirClient.js          # FHIR service (for future integration)
│   └── App.jsx                     # Root component
└── package.json
```

## Demo Data

The app currently uses mock data for demonstration:
- 10 days of glucose readings
- 3 active medications
- Sample patient information

This makes it easy to test and understand the UI before integrating with real data sources.

## License

MIT
