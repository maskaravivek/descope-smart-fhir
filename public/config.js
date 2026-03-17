// Descope Configuration
// Replace these values with your own from the Descope console
window.DESCOPE_CONFIG = {
    projectId: 'P37BEmQx2pLjHwU6TPDepmQsdGum',

    // Client ID from Inbound App (base64 encoded credentials)
    // Used for both Descope OAuth authorize and SMART OAuth flows
    clientId: 'UDM3QkVtUXgycExqSHdVNlRQRGVwbVFzZEd1bTpUUEEzN0xrVWVubWlZUzRtV0JWM1RXUHBqWUdpMWw=',

    // SMART on FHIR scopes to request (displayed on consent screen)
    scopes: [
        'openid',
        'patient/Observation.read',
        'launch',
        'patient/MedicationRequest.read'
    ]
};
