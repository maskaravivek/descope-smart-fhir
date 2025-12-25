class FHIRService {
  constructor(client) {
    this.client = client;
  }

  async getGlucoseObservations(patientId) {
    if (!this.client) {
      throw new Error('FHIR client not initialized');
    }

    try {
      const observations = await this.client.request(
        `Observation?patient=${patientId}&code=http://loinc.org|2339-0&_sort=-date&_count=20`,
        {
          resolveReferences: ['subject'],
          graph: false,
        }
      );

      return this.parseGlucoseObservations(observations);
    } catch (error) {
      console.error('Error fetching glucose observations:', error);
      return [];
    }
  }

  parseGlucoseObservations(data) {
    if (!data || !data.entry) {
      return [];
    }

    return data.entry.map((entry) => {
      const observation = entry.resource;
      return {
        id: observation.id,
        date: observation.effectiveDateTime || observation.effectivePeriod?.start,
        value: observation.valueQuantity?.value,
        unit: observation.valueQuantity?.unit || 'mg/dL',
        status: observation.status,
      };
    });
  }

  async getMedicationRequests(patientId) {
    if (!this.client) {
      throw new Error('FHIR client not initialized');
    }

    try {
      const medications = await this.client.request(
        `MedicationRequest?patient=${patientId}&status=active&_sort=-authoredon&_count=20`,
        {
          resolveReferences: ['medicationReference'],
          graph: false,
        }
      );

      return this.parseMedicationRequests(medications);
    } catch (error) {
      console.error('Error fetching medications:', error);
      return [];
    }
  }

  parseMedicationRequests(data) {
    if (!data || !data.entry) {
      return [];
    }

    return data.entry.map((entry) => {
      const medication = entry.resource;
      const medicationName =
        medication.medicationCodeableConcept?.text ||
        medication.medicationCodeableConcept?.coding?.[0]?.display ||
        medication.medicationReference?.display ||
        'Unknown Medication';

      return {
        id: medication.id,
        name: medicationName,
        status: medication.status,
        authoredOn: medication.authoredOn,
        dosageInstruction: medication.dosageInstruction?.[0]?.text || 'See prescription',
      };
    });
  }

  async getPatient() {
    if (!this.client) {
      throw new Error('FHIR client not initialized');
    }

    try {
      const patient = await this.client.patient.read();
      return {
        id: patient.id,
        name: this.getPatientName(patient),
        birthDate: patient.birthDate,
        gender: patient.gender,
      };
    } catch (error) {
      console.error('Error fetching patient data:', error);
      return null;
    }
  }

  getPatientName(patient) {
    if (!patient.name || patient.name.length === 0) {
      return 'Unknown Patient';
    }

    const name = patient.name[0];
    const given = name.given ? name.given.join(' ') : '';
    const family = name.family || '';
    return `${given} ${family}`.trim();
  }
}

export default FHIRService;
