# Diabetes Monitoring App with SMART on FHIR and Descope

A modern diabetes monitoring application that demonstrates how to integrate SMART on FHIR with Descope authentication. This app allows patients to authenticate using magic links and SSO, then securely access their glucose readings and medication data from an EHR system.

## Features

- **Descope Authentication**: Secure authentication with magic links and SSO support
- **SMART on FHIR Integration**: Access patient data from EHR systems using FHIR standards
- **Glucose Monitoring**: View and track blood glucose readings with visual charts
- **Medication Management**: Display active medications and dosage instructions
- **Responsive Design**: Modern, mobile-friendly interface
- **Mock Data Support**: Fallback to demonstration data when FHIR server is unavailable

## Prerequisites

- Node.js 16+ and npm
- A Descope account (free tier available)
- Access to a FHIR-compliant EHR system or test server

## Setup Instructions

### 1. Set Up Descope Project

1. Go to [Descope Console](https://app.descope.com/) and create a new project
2. Note your **Project ID** from the project settings
3. If the OAuth token endpoint component is under feature flag, contact Descope support with your Project ID to request access

### 2. Create an Inbound App for SMART on FHIR

1. In the Descope Console, navigate to **Applications** > **Inbound Apps**
2. Click **Create New App**
3. Configure the app:
   - **Name**: SMART on FHIR App
   - **Type**: OAuth 2.0
   - **Redirect URIs**: Add your application URLs (e.g., `http://localhost:3000/callback`)
   - **Scopes**: Configure SMART scopes like `patient/*.read`, `openid`, `fhirUser`

### 3. Create and Customize the User Consent Flow

1. Navigate to **Flows** in the Descope Console
2. Click **Create New Flow**
3. Select the **User Consent** template from the Flow Library
4. Customize the flow:
   - Add screens for FHIR data access consent
   - Configure scope selection
   - Customize branding and messaging

### 4. Add SSO to the Flow

1. In your flow editor, add an **SSO** component
2. Configure SSO providers (Google, Microsoft, etc.):
   - Go to **Authentication Methods** > **SSO**
   - Enable desired providers
   - Configure OAuth credentials for each provider
3. Update your flow to include SSO as an authentication option alongside magic links

### 5. Install Dependencies

```bash
npm install
```

### 6. Configure Environment Variables

1. Copy the example environment file:

```bash
cp .env.example .env
```

2. Edit `.env` and add your configuration:

```env
VITE_DESCOPE_PROJECT_ID=your_descope_project_id_here
VITE_DESCOPE_FLOW_ID=your_flow_id_here
VITE_FHIR_SERVER_URL=https://launch.smarthealthit.org/v/r4/fhir
```

Replace the values with:
- Your Descope Project ID
- Your custom flow ID (or use `sign-up-or-in` for the default)
- Your FHIR server URL (use the SMART Health IT sandbox for testing)

### 7. Run the Application

Start the development server:

```bash
npm run dev
```

The app will open at [http://localhost:3000](http://localhost:3000)

## Usage

### Authentication Flow

1. Open the application in your browser
2. Choose your authentication method:
   - **Magic Link**: Enter your email to receive a passwordless login link
   - **SSO**: Sign in with Google, Microsoft, or other configured providers
3. Complete the authentication process
4. Grant consent for the app to access your health data

### Viewing Diabetes Data

Once authenticated, you'll see:

- **Patient Information**: Name, date of birth, and patient ID
- **Glucose Statistics**: Average, minimum, maximum, and total readings
- **Glucose Chart**: Visual representation of blood glucose levels over time
- **Glucose Table**: Detailed list of all readings with dates and status
- **Active Medications**: List of current diabetes medications with dosage instructions

### Color-Coded Glucose Levels

- **Green**: Normal range (70-180 mg/dL)
- **Red**: Low (&lt;70 mg/dL)
- **Orange**: High (&gt;180 mg/dL)

## FHIR Server Configuration

### Using SMART Health IT Sandbox

For testing, you can use the public SMART Health IT sandbox:

```env
VITE_FHIR_SERVER_URL=https://launch.smarthealthit.org/v/r4/fhir
```

### Connecting to Your EHR System

To connect to a real EHR system:

1. Obtain FHIR endpoint URL from your EHR provider
2. Register your application with the EHR system
3. Configure OAuth client credentials in Descope
4. Update the FHIR server URL in your `.env` file

### Required FHIR Scopes

The application requests these SMART on FHIR scopes:

- `patient/*.read`: Read all patient data
- `openid`: OpenID Connect authentication
- `fhirUser`: User identity information
- `launch`: Launch context
- `launch/patient`: Patient context

## Project Structure

```
descope-smart-fhir-app/
├── src/
│   ├── components/
│   │   ├── DiabetesMonitor.jsx       # Main dashboard component
│   │   ├── DiabetesMonitor.css
│   │   ├── GlucoseChart.jsx          # Glucose visualization
│   │   ├── GlucoseChart.css
│   │   ├── MedicationList.jsx        # Medication display
│   │   └── MedicationList.css
│   ├── services/
│   │   └── fhirClient.js             # FHIR API integration
│   ├── App.jsx                       # Main application component
│   ├── App.css
│   ├── main.jsx                      # Application entry point
│   └── index.css
├── index.html
├── vite.config.js
├── package.json
├── .env.example
└── README.md
```

## Key Components

### App.jsx

Main application component that handles:
- Descope authentication state
- User session management
- Conditional rendering based on auth status

### DiabetesMonitor.jsx

Dashboard component that:
- Fetches patient data from FHIR server
- Calculates glucose statistics
- Coordinates data display components
- Handles errors and loading states

### GlucoseChart.jsx

Visualization component featuring:
- Bar chart of glucose readings
- Color-coded status indicators
- Detailed data table
- Legend with normal ranges

### MedicationList.jsx

Displays active medications with:
- Medication names and status
- Dosage instructions
- Prescription dates
- Healthcare disclaimer

### fhirClient.js

FHIR integration service that:
- Handles OAuth authorization
- Fetches glucose observations (LOINC code 2339-0)
- Retrieves medication requests
- Parses FHIR resources

## Descope Flow Configuration

Your Descope flow should include:

1. **Sign-in Screen**
   - Magic link input
   - SSO buttons (Google, Microsoft, etc.)
   - Signup/login toggle

2. **Consent Screen**
   - List of requested FHIR scopes
   - Clear explanation of data access
   - Accept/Deny buttons

3. **Profile Completion** (optional)
   - Collect additional user information
   - Link to patient record

## Security Considerations

- **OAuth 2.0**: Industry-standard authentication protocol
- **PKCE**: Proof Key for Code Exchange for enhanced security
- **Scoped Access**: Request only necessary FHIR permissions
- **Token Management**: Secure storage and refresh of access tokens
- **HTTPS**: Always use HTTPS in production
- **Data Encryption**: Ensure FHIR data is encrypted in transit

## Troubleshooting

### Authentication Issues

- Verify your Descope Project ID is correct
- Check that your flow ID matches the configured flow
- Ensure redirect URLs are properly configured in Descope

### FHIR Connection Issues

- Verify the FHIR server URL is accessible
- Check that required scopes are configured
- Confirm OAuth credentials are valid
- Review browser console for detailed error messages

### Mock Data Fallback

If the app shows "Using mock data", it means:
- FHIR server connection failed
- OAuth authorization was not completed
- The app is running in demo mode

To use real data, ensure proper FHIR server configuration and complete the SMART launch sequence.

## Building for Production

Create an optimized production build:

```bash
npm run build
```

The build artifacts will be in the `dist/` directory.

Preview the production build:

```bash
npm run preview
```

## Additional Resources

- [Descope Documentation](https://docs.descope.com/)
- [SMART on FHIR Documentation](https://docs.smarthealthit.org/)
- [FHIR Specification](https://www.hl7.org/fhir/)
- [SMART Health IT Sandbox](https://launch.smarthealthit.org/)

## Support

For issues or questions:
- Descope: Contact support through the Descope Console
- FHIR Integration: Refer to your EHR system documentation
- App Issues: Check browser console for error messages

## License

MIT License - feel free to use this as a starting point for your own SMART on FHIR applications.
