import { buildModule } from './moduleBuilderHelper';

export const modulesDomain13_14 = [
  // ==========================================
  // DOMAIN 13: HEALTHCARE & CLINICAL (161-190)
  // ==========================================
  buildModule({
    id: 161,
    name: 'Electronic Health Records (EHR)',
    slug: 'ehr-records',
    category: 'Healthcare & Clinical',
    phase: 2,
    iconName: 'FileHeart',
    purpose: 'HL7 FHIR compliant patient medical charts, clinical encounter documentation, SOAP notes, and allergy alerts.',
    responsibilities: [
      'Maintain longitudinal clinical patient health records conforming to US Core FHIR profiles',
      'Provide rapid structured SOAP encounter note entry with ICD-10 and SNOMED-CT auto-suggest',
      'Trigger real-time clinical drug-allergy and drug-condition adverse interaction warnings'
    ],
    tableName: 'patient_health_records',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'patient_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'encounter_id', type: 'BIGINT UNSIGNED', nullable: false },
      { name: 'record_type', type: 'ENUM("soap","progress","summary")', nullable: false },
      { name: 'icd10_codes', type: 'JSON', nullable: true },
      { name: 'snomed_codes', type: 'JSON', nullable: true },
      { name: 'clinical_notes', type: 'TEXT', nullable: true },
      { name: 'allergy_alerts_json', type: 'JSON', nullable: true },
      { name: 'provider_id', type: 'BIGINT UNSIGNED', nullable: false },
      { name: 'facility_id', type: 'BIGINT UNSIGNED', nullable: false },
      { name: 'status', type: 'ENUM("active","archived")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 162,
    name: 'Patient Appointment Scheduling',
    slug: 'patient-appointments',
    category: 'Healthcare & Clinical',
    phase: 2,
    iconName: 'CalendarCheck',
    purpose: 'Multi-specialty provider calendar booking, automated SMS/email reminders, intake form collection, and no-show prediction.',
    responsibilities: [
      'Manage complex provider clinic schedules, exam room availability, and equipment constraints',
      'Send automated appointment confirmation text messages with 2-way reschedule capability',
      'Predict patient no-show probabilities using historical visit patterns'
    ],
    tableName: 'clinical_appointments',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'patient_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'provider_id', type: 'BIGINT UNSIGNED', nullable: false },
      { name: 'appointment_type', type: 'VARCHAR(100)', nullable: false },
      { name: 'scheduled_datetime', type: 'TIMESTAMP', nullable: false },
      { name: 'duration_minutes', type: 'INT UNSIGNED', nullable: false },
      { name: 'room_id', type: 'BIGINT UNSIGNED', nullable: true },
      { name: 'no_show_probability', type: 'DECIMAL(5,4)', nullable: true },
      { name: 'reminder_sent', type: 'BOOLEAN', nullable: false },
      { name: 'intake_form_completed', type: 'BOOLEAN', nullable: false },
      { name: 'status', type: 'ENUM("scheduled","confirmed","completed","cancelled","no_show")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 163,
    name: 'Telehealth Video Consultation',
    slug: 'telehealth-video',
    category: 'Healthcare & Clinical',
    phase: 2,
    iconName: 'Video',
    purpose: 'HIPAA-compliant WebRTC encrypted video visits, virtual waiting rooms, in-call screen sharing, and recording consent.',
    responsibilities: [
      'Establish peer-to-peer encrypted HD video sessions with no client software download required',
      'Manage patient virtual waiting rooms with queue position indicators and audio chime alerts',
      'Capture and record patient legal consent for telemedicine encounters'
    ],
    tableName: 'telehealth_sessions',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'patient_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'provider_id', type: 'BIGINT UNSIGNED', nullable: false },
      { name: 'session_token', type: 'VARCHAR(255)', nullable: false },
      { name: 'waiting_room_joined_at', type: 'TIMESTAMP', nullable: true },
      { name: 'call_started_at', type: 'TIMESTAMP', nullable: true },
      { name: 'call_ended_at', type: 'TIMESTAMP', nullable: true },
      { name: 'recording_consent', type: 'BOOLEAN', nullable: false },
      { name: 'consent_timestamp', type: 'TIMESTAMP', nullable: true },
      { name: 'status', type: 'ENUM("waiting","in_progress","completed","failed")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 164,
    name: 'Electronic Prescription (eRx) Engine',
    slug: 'erx-prescriptions',
    category: 'Healthcare & Clinical',
    phase: 3,
    iconName: 'Pill',
    purpose: 'NCPDP SCRIPT standard electronic prescription routing, DEA EPCS controlled substance two-factor authentication.',
    responsibilities: [
      'Transmit electronic prescriptions directly to retail and mail-order pharmacies across national networks',
      'Enforce DEA Electronic Prescriptions for Controlled Substances (EPCS) biometric 2FA',
      'Verify patient formulary coverage, tiered copays, and lower-cost generic alternatives'
    ],
    tableName: 'prescriptions',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'patient_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'provider_id', type: 'BIGINT UNSIGNED', nullable: false },
      { name: 'pharmacy_id', type: 'BIGINT UNSIGNED', nullable: false },
      { name: 'ndc_code', type: 'VARCHAR(11)', nullable: false },
      { name: 'medication_name', type: 'VARCHAR(255)', nullable: false },
      { name: 'dosage_quantity', type: 'DECIMAL(10,2)', nullable: false },
      { name: 'dosage_unit', type: 'VARCHAR(20)', nullable: false },
      { name: 'frequency', type: 'VARCHAR(50)', nullable: false },
      { name: 'refills_remaining', type: 'INT UNSIGNED', nullable: false },
      { name: 'controlled_substance_flag', type: 'BOOLEAN', nullable: false },
      { name: 'epcs_2fa_completed', type: 'BOOLEAN', nullable: false },
      { name: 'formulary_tier', type: 'INT UNSIGNED', nullable: true },
      { name: 'status', type: 'ENUM("pending","transmitted","filled","cancelled")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 165,
    name: 'Clinical Lab Order Management',
    slug: 'lab-orders',
    category: 'Healthcare & Clinical',
    phase: 2,
    iconName: 'FlaskConical',
    purpose: 'Electronic lab requisition generation, LOINC code test mapping, specimen barcoding, and HL7 result ingestion.',
    responsibilities: [
      'Generate computerized physician order entry (CPOE) lab orders mapped to standardized LOINC codes',
      'Print specimen tube barcode labels with specimen stability and centrifugation guidelines',
      'Ingest HL7 ORU result messages and automatically flag panic/critical value laboratory findings'
    ],
    tableName: 'lab_orders',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'patient_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'ordering_provider_id', type: 'BIGINT UNSIGNED', nullable: false },
      { name: 'loinc_code', type: 'VARCHAR(10)', nullable: false },
      { name: 'test_name', type: 'VARCHAR(255)', nullable: false },
      { name: 'specimen_type', type: 'VARCHAR(50)', nullable: false },
      { name: 'barcode_label', type: 'VARCHAR(100)', nullable: false },
      { name: 'specimen_collected_at', type: 'TIMESTAMP', nullable: true },
      { name: 'result_status', type: 'ENUM("pending","in_progress","completed")', nullable: false },
      { name: 'panic_value_flag', type: 'BOOLEAN', nullable: false },
      { name: 'status', type: 'ENUM("ordered","collected","resulted")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 166,
    name: 'Medical Billing & ICD-10 Coding',
    slug: 'medical-billing',
    category: 'Healthcare & Clinical',
    phase: 2,
    iconName: 'FileSpreadsheet',
    purpose: 'EDI 837P/837I health insurance claim generation, clearinghouse scrubbing, CMS-1500 generation, and claim denial tracking.',
    responsibilities: [
      'Scrub clinical encounter codes against National Correct Coding Initiative (NCCI) edit rules',
      'Generate electronic EDI 837 professional and institutional health insurance claim batches',
      'Categorize and triage claim rejections and denials (EDI 835 ERA) with automated appeals'
    ],
    tableName: 'insurance_claims',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'patient_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'provider_id', type: 'BIGINT UNSIGNED', nullable: false },
      { name: 'encounter_id', type: 'BIGINT UNSIGNED', nullable: false },
      { name: 'icd10_codes', type: 'JSON', nullable: false },
      { name: 'cpt_codes', type: 'JSON', nullable: false },
      { name: 'claim_type', type: 'ENUM("837P","837I")', nullable: false },
      { name: 'payer_id', type: 'BIGINT UNSIGNED', nullable: false },
      { name: 'claim_amount', type: 'DECIMAL(12,2)', nullable: false },
      { name: 'ncci_edit_violations', type: 'JSON', nullable: true },
      { name: 'denial_code', type: 'VARCHAR(10)', nullable: true },
      { name: 'status', type: 'ENUM("submitted","accepted","denied","appealed")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 167,
    name: 'HIPAA Audit & Privacy Safeguards',
    slug: 'hipaa-audit',
    category: 'Healthcare & Clinical',
    phase: 3,
    iconName: 'ShieldCheck',
    purpose: 'Protected Health Information (PHI) access logging, break-the-glass emergency audits, and breach risk assessments.',
    responsibilities: [
      'Record immutable audit trails for every view, edit, or export of patient medical records',
      'Enforce mandatory break-the-glass justification workflows for out-of-care-team chart access',
      'Generate automated compliance reports verifying Business Associate Agreement (BAA) safeguards'
    ],
    tableName: 'phi_access_logs',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'user_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'patient_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'action_type', type: 'ENUM("view","edit","export")', nullable: false },
      { name: 'record_type', type: 'VARCHAR(50)', nullable: false },
      { name: 'access_timestamp', type: 'TIMESTAMP', nullable: false },
      { name: 'break_the_glass_flag', type: 'BOOLEAN', nullable: false },
      { name: 'justification_text', type: 'TEXT', nullable: true },
      { name: 'ip_address', type: 'VARCHAR(45)', nullable: false },
      { name: 'baa_compliant', type: 'BOOLEAN', nullable: false },
      { name: 'status', type: 'ENUM("logged","reviewed","flagged")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 168,
    name: 'Pharmacy Dispensing & Inventory',
    slug: 'pharmacy-dispensing',
    category: 'Healthcare & Clinical',
    phase: 2,
    iconName: 'Package',
    purpose: 'National Drug Code (NDC) inventory tracking, pill counting verification, lot expiration tracking, and drug recall alerts.',
    responsibilities: [
      'Track prescription medication inventory by National Drug Code (NDC) and lot number',
      'Perform barcode verification during medication dispensing to prevent dispensing errors',
      'Trigger automated recalls isolating affected drug lots across clinic inventory'
    ],
    tableName: 'pharmacy_inventory',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'ndc_code', type: 'VARCHAR(11)', nullable: false, index: true },
      { name: 'medication_name', type: 'VARCHAR(255)', nullable: false },
      { name: 'lot_number', type: 'VARCHAR(50)', nullable: false },
      { name: 'expiration_date', type: 'DATE', nullable: false },
      { name: 'quantity_on_hand', type: 'INT UNSIGNED', nullable: false },
      { name: 'reorder_threshold', type: 'INT UNSIGNED', nullable: false },
      { name: 'manufacturer', type: 'VARCHAR(255)', nullable: false },
      { name: 'barcode_scan_verified', type: 'BOOLEAN', nullable: false },
      { name: 'recall_flag', type: 'BOOLEAN', nullable: false },
      { name: 'status', type: 'ENUM("available","low_stock","out_of_stock","recalled")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 169,
    name: 'Patient Portal & Health Records',
    slug: 'patient-portal',
    category: 'Healthcare & Clinical',
    phase: 1,
    iconName: 'User',
    purpose: 'Patient self-service access to lab results, doctor messaging, medical bill payment, and downloadable health summaries.',
    responsibilities: [
      'Provide patients secure access to test results with clinician commentary and education links',
      'Enable asynchronous secure messaging with care teams following HIPAA confidentiality guidelines',
      'Allow patients to pay co-pays and balances via credit card or Apple/Google Pay'
    ],
    tableName: 'patient_portal_accounts',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'patient_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'email', type: 'VARCHAR(255)', nullable: false },
      { name: 'last_login_at', type: 'TIMESTAMP', nullable: true },
      { name: 'lab_results_viewed', type: 'BOOLEAN', nullable: false },
      { name: 'messages_sent', type: 'INT UNSIGNED', nullable: false },
      { name: 'bill_payments_made', type: 'INT UNSIGNED', nullable: false },
      { name: 'portal_active', type: 'BOOLEAN', nullable: false },
      { name: 'two_factor_enabled', type: 'BOOLEAN', nullable: false },
      { name: 'status', type: 'ENUM("active","suspended","deactivated")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 170,
    name: 'Diagnostic Imaging & PACS Viewer',
    slug: 'pacs-imaging',
    category: 'Healthcare & Clinical',
    phase: 3,
    iconName: 'Eye',
    purpose: 'DICOM web viewer, radiology report dictation integration, image storage archival, and AI lesion pre-screening.',
    responsibilities: [
      'Stream and render multi-slice CT, MRI, and X-ray studies directly in browser via DICOMweb',
      'Support radiologist measurement tools (Hounsfield units, Cobb angle, length calibration)',
      'Store medical imagery securely in vendor neutral archives (VNA) with tiered cold storage'
    ],
    tableName: 'radiology_studies',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'patient_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'ordering_provider_id', type: 'BIGINT UNSIGNED', nullable: false },
      { name: 'study_type', type: 'ENUM("ct","mri","xray","ultrasound")', nullable: false },
      { name: 'accession_number', type: 'VARCHAR(50)', nullable: false, index: true },
      { name: 'dicom_store_url', type: 'VARCHAR(500)', nullable: false },
      { name: 'report_status', type: 'ENUM("pending","dictated","finalized")', nullable: false },
      { name: 'ai_lesion_flag', type: 'BOOLEAN', nullable: false },
      { name: 'measurement_tools_used', type: 'JSON', nullable: true },
      { name: 'status', type: 'ENUM("uploaded","viewed","reported")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 171,
    name: 'Vital Signs & Remote Patient Monitoring (RPM)',
    slug: 'rpm-vitals',
    category: 'Healthcare & Clinical',
    phase: 2,
    iconName: 'Activity',
    purpose: 'Cellular blood pressure cuff, continuous glucose monitor (CGM), and pulse oximeter data ingestion with threshold alerts.',
    responsibilities: [
      'Ingest continuous physiological biometric data from Bluetooth and cellular medical peripherals',
      'Calculate rolling mean arterial pressures and time-in-range metrics for diabetic cohorts',
      'Alert on-call clinical triage nurses when vitals breach critical danger thresholds'
    ],
    tableName: 'patient_vitals_telemetry',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'patient_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'device_id', type: 'BIGINT UNSIGNED', nullable: false },
      { name: 'vital_type', type: 'VARCHAR(50)', nullable: false },
      { name: 'reading_value', type: 'DECIMAL(10,2)', nullable: false },
      { name: 'reading_unit', type: 'VARCHAR(20)', nullable: false },
      { name: 'reading_timestamp', type: 'TIMESTAMP', nullable: false },
      { name: 'rolling_mean_arterial', type: 'DECIMAL(10,2)', nullable: true },
      { name: 'time_in_range_pct', type: 'DECIMAL(5,2)', nullable: true },
      { name: 'threshold_breach_flag', type: 'BOOLEAN', nullable: false },
      { name: 'status', type: 'ENUM("normal","elevated","critical","breached")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 172,
    name: 'Clinical Decision Support System (CDSS)',
    slug: 'clinical-decision-support',
    category: 'Healthcare & Clinical',
    phase: 3,
    iconName: 'Brain',
    purpose: 'Evidence-based clinical guidelines, sepsis early warning score (NEWS2), and preventative care gap notifications.',
    responsibilities: [
      'Evaluate real-time vitals and lab results against National Early Warning Scores (NEWS2) for sepsis',
      'Prompt clinicians regarding overdue preventative screenings (mammograms, colonoscopies, A1C tests)',
      'Surface relevant peer-reviewed clinical practice guidelines at the point of care'
    ],
    tableName: 'cdss_alerts',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'patient_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'alert_type', type: 'VARCHAR(100)', nullable: false },
      { name: 'guideline_source', type: 'VARCHAR(255)', nullable: false },
      { name: 'news2_score', type: 'INT UNSIGNED', nullable: true },
      { name: 'alert_severity', type: 'ENUM("low","medium","high","critical")', nullable: false },
      { name: 'clinician_notified', type: 'BOOLEAN', nullable: false },
      { name: 'acknowledged_by', type: 'BIGINT UNSIGNED', nullable: true },
      { name: 'acknowledged_at', type: 'TIMESTAMP', nullable: true },
      { name: 'screening_overdue_flag', type: 'BOOLEAN', nullable: false },
      { name: 'status', type: 'ENUM("active","acknowledged","resolved")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 173,
    name: 'Health Insurance Eligibility Verification',
    slug: 'eligibility-verification',
    category: 'Healthcare & Clinical',
    phase: 2,
    iconName: 'FileSearch',
    purpose: 'Real-time EDI 270/271 insurance coverage queries, deductible accumulators, co-insurance calculation, and payer rules.',
    responsibilities: [
      'Execute real-time EDI 270 electronic benefit eligibility inquiries during patient check-in',
      'Parse EDI 271 responses extracting remaining annual deductible and specialist co-pay amounts',
      'Flag inactive policies or missing primary care physician (PCP) referrals before service delivery'
    ],
    tableName: 'eligibility_inquiries',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'patient_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'payer_id', type: 'BIGINT UNSIGNED', nullable: false },
      { name: 'edi270_transaction_id', type: 'VARCHAR(50)', nullable: false },
      { name: 'coverage_status', type: 'ENUM("active","inactive","pending")', nullable: false },
      { name: 'remaining_deductible', type: 'DECIMAL(12,2)', nullable: true },
      { name: 'specialist_copay', type: 'DECIMAL(10,2)', nullable: true },
      { name: 'pcp_referral_required', type: 'BOOLEAN', nullable: false },
      { name: 'policy_active', type: 'BOOLEAN', nullable: false },
      { name: 'status', type: 'ENUM("queried","verified","denied")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 174,
    name: 'Medical Device IoT Telemetry',
    slug: 'medical-device-iot',
    category: 'Healthcare & Clinical',
    phase: 3,
    iconName: 'Cpu',
    purpose: 'Infusion pump, ventilator, and anesthesia machine connectivity, biomedical preventive maintenance, and cybersecurity alerts.',
    responsibilities: [
      'Ingest IEEE 11073 medical device communication packets from ICU bedside monitors',
      'Track biomedical engineering calibration cycles and preventive maintenance certifications',
      'Detect firmware vulnerabilities and anomalous network traffic on connected hospital hardware'
    ],
    tableName: 'biomedical_devices',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'device_type', type: 'VARCHAR(100)', nullable: false },
      { name: 'manufacturer', type: 'VARCHAR(255)', nullable: false },
      { name: 'model_number', type: 'VARCHAR(100)', nullable: false },
      { name: 'serial_number', type: 'VARCHAR(100)', nullable: false, index: true },
      { name: 'firmware_version', type: 'VARCHAR(50)', nullable: false },
      { name: 'ieee11073_packet', type: 'JSON', nullable: true },
      { name: 'calibration_due_at', type: 'TIMESTAMP', nullable: false },
      { name: 'preventive_maintenance_at', type: 'TIMESTAMP', nullable: false },
      { name: 'vulnerability_alert_flag', type: 'BOOLEAN', nullable: false },
      { name: 'status', type: 'ENUM("online","offline","maintenance","alert")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 175,
    name: 'Clinical Trial Patient Recruitment',
    slug: 'clinical-trial-recruitment',
    category: 'Healthcare & Clinical',
    phase: 3,
    iconName: 'Microscope',
    purpose: 'Protocol eligibility criteria matching, patient pre-screening questionnaires, and informed consent e-signature tracking.',
    responsibilities: [
      'Query EHR records for clinical trial inclusion/exclusion criteria (biomarkers, prior therapies)',
      'Manage prospective participant outreach and automated pre-screening digital questionnaires',
      'Collect and archive FDA 21 CFR Part 50 compliant electronic informed consent documents'
    ],
    tableName: 'trial_cohorts',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'patient_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'trial_protocol_id', type: 'BIGINT UNSIGNED', nullable: false },
      { name: 'eligibility_criteria_met', type: 'BOOLEAN', nullable: false },
      { name: 'screening_questionnaire_json', type: 'JSON', nullable: true },
      { name: 'pre_screening_status', type: 'ENUM("pending","passed","failed")', nullable: false },
      { name: 'informed_consent_signed', type: 'BOOLEAN', nullable: false },
      { name: 'consent_timestamp', type: 'TIMESTAMP', nullable: true },
      { name: 'fda_part50_compliant', type: 'BOOLEAN', nullable: false },
      { name: 'status', type: 'ENUM("screened","enrolled","withdrawn","completed")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 176,
    name: 'Adverse Drug Interaction Checker',
    slug: 'drug-interaction-checker',
    category: 'Healthcare & Clinical',
    phase: 2,
    iconName: 'AlertCircle',
    purpose: 'Multi-drug contraindication matrix, RxNorm ingredient mapping, food-drug interactions, and severity stratification.',
    responsibilities: [
      'Cross-reference patient active medication lists against comprehensive RxNorm drug ontology databases',
      'Classify interaction severities (Contraindicated, Major, Moderate, Minor) with clinical explanations',
      'Warn regarding potential QT-interval prolongation and cytochrome P450 enzyme competition'
    ],
    tableName: 'drug_contraindications',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'drug_a_rxnorm', type: 'VARCHAR(20)', nullable: false, index: true },
      { name: 'drug_b_rxnorm', type: 'VARCHAR(20)', nullable: false, index: true },
      { name: 'interaction_type', type: 'VARCHAR(50)', nullable: false },
      { name: 'severity_level', type: 'ENUM("contraindicated","major","moderate","minor")', nullable: false },
      { name: 'clinical_explanation', type: 'TEXT', nullable: false },
      { name: 'qt_prolongation_risk', type: 'BOOLEAN', nullable: false },
      { name: 'cyp450_enzyme_competition', type: 'BOOLEAN', nullable: false },
      { name: 'food_drug_flag', type: 'BOOLEAN', nullable: false },
      { name: 'status', type: 'ENUM("active","deprecated")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 177,
    name: 'Immunization & Vaccine Registry',
    slug: 'immunization-registry',
    category: 'Healthcare & Clinical',
    phase: 2,
    iconName: 'Syringe',
    purpose: 'CDC CVX code tracking, state immunization information systems (IIS) HL7 reporting, and vaccine forecast schedules.',
    responsibilities: [
      'Record vaccine administrations with lot numbers, manufacturer, injection site, and expiration',
      'Transmit automated HL7 VXU messages to state public health immunization registries',
      'Calculate personalized childhood and adult vaccine booster schedules based on ACIP guidelines'
    ],
    tableName: 'vaccine_administrations',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'patient_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'cvx_code', type: 'VARCHAR(10)', nullable: false },
      { name: 'vaccine_name', type: 'VARCHAR(255)', nullable: false },
      { name: 'manufacturer', type: 'VARCHAR(255)', nullable: false },
      { name: 'lot_number', type: 'VARCHAR(50)', nullable: false },
      { name: 'expiration_date', type: 'DATE', nullable: false },
      { name: 'injection_site', type: 'VARCHAR(50)', nullable: false },
      { name: 'administrator_id', type: 'BIGINT UNSIGNED', nullable: false },
      { name: 'hlu_vxu_transmitted', type: 'BOOLEAN', nullable: false },
      { name: 'booster_schedule_json', type: 'JSON', nullable: true },
      { name: 'status', type: 'ENUM("administered","reported","cancelled")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 178,
    name: 'Mental Health Screening & Care Plans',
    slug: 'mental-health-care',
    category: 'Healthcare & Clinical',
    phase: 2,
    iconName: 'Smile',
    purpose: 'Automated PHQ-9 and GAD-7 assessment scoring, safety planning, psychiatric progress notes, and crisis escalations.',
    responsibilities: [
      'Administer standard psychological screening assessments (PHQ-9 depression, GAD-7 anxiety)',
      'Trigger immediate crisis intervention notifications if suicide risk ideation is detected',
      'Document collaborative psychiatric wellness and multidisciplinary behavioral health care plans'
    ],
    tableName: 'psych_assessments',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'patient_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'assessment_type', type: 'ENUM("PHQ9","GAD7","other")', nullable: false },
      { name: 'score_value', type: 'INT UNSIGNED', nullable: false },
      { name: 'risk_level', type: 'ENUM("none","mild","moderate","severe")', nullable: false },
      { name: 'crisis_flag', type: 'BOOLEAN', nullable: false },
      { name: 'safety_plan_json', type: 'JSON', nullable: true },
      { name: 'care_plan_json', type: 'JSON', nullable: true },
      { name: 'clinician_id', type: 'BIGINT UNSIGNED', nullable: false },
      { name: 'suicide_ideation_detected', type: 'BOOLEAN', nullable: false },
      { name: 'status', type: 'ENUM("completed","in_progress","flagged")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 179,
    name: 'Emergency Triage & Bed Management',
    slug: 'emergency-triage',
    category: 'Healthcare & Clinical',
    phase: 3,
    iconName: 'Ambulance',
    purpose: 'Emergency Severity Index (ESI 1-5) triage scoring, hospital bed occupancy boards, and ED length-of-stay tracking.',
    responsibilities: [
      'Assign Emergency Severity Index acuity scores (ESI 1 resuscitation to ESI 5 non-urgent)',
      'Provide real-time visual hospital floor plan bed occupancy tracking (ICU, Med-Surg, Step-down)',
      'Monitor emergency room door-to-doctor times and flag patients at risk of leaving without being seen'
    ],
    tableName: 'emergency_encounters',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'patient_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'esi_acuity_score', type: 'INT UNSIGNED', nullable: false },
      { name: 'arrival_time', type: 'TIMESTAMP', nullable: false },
      { name: 'bed_assigned', type: 'VARCHAR(50)', nullable: true },
      { name: 'department_code', type: 'VARCHAR(20)', nullable: false },
      { name: 'door_to_doctor_minutes', type: 'INT UNSIGNED', nullable: true },
      { name: 'leaving_without_seen_flag', type: 'BOOLEAN', nullable: false },
      { name: 'disposition', type: 'VARCHAR(100)', nullable: true },
      { name: 'status', type: 'ENUM("triaged","waiting","in_treatment","discharged","admitted")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 180,
    name: 'Surgical Suite Scheduling & Equipment',
    slug: 'surgical-suite',
    category: 'Healthcare & Clinical',
    phase: 3,
    iconName: 'Scissors',
    purpose: 'Operating room block scheduling, surgical preference cards, sterile processing department (SPD) tray tracking.',
    responsibilities: [
      'Allocate operating room blocks factoring in surgeon utilization, case duration, and turnaround time',
      'Manage surgeon-specific electronic preference cards for instruments, sutures, and implants',
      'Track surgical tray sterilization cycles and autoclave validation in sterile processing'
    ],
    tableName: 'operating_rooms',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'room_number', type: 'VARCHAR(20)', nullable: false },
      { name: 'surgeon_id', type: 'BIGINT UNSIGNED', nullable: false },
      { name: 'procedure_name', type: 'VARCHAR(255)', nullable: false },
      { name: 'block_start_at', type: 'TIMESTAMP', nullable: false },
      { name: 'block_end_at', type: 'TIMESTAMP', nullable: false },
      { name: 'case_duration_minutes', type: 'INT UNSIGNED', nullable: false },
      { name: 'preference_card_id', type: 'BIGINT UNSIGNED', nullable: true },
      { name: 'spd_tray_id', type: 'BIGINT UNSIGNED', nullable: true },
      { name: 'sterilization_valid', type: 'BOOLEAN', nullable: false },
      { name: 'status', type: 'ENUM("scheduled","in_use","turnover","completed")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 181,
    name: 'Blood Bank & Donor Management',
    slug: 'blood-bank',
    category: 'Healthcare & Clinical',
    phase: 3,
    iconName: 'Droplet',
    purpose: 'ISBT 128 barcode blood labeling, crossmatch testing, unit expiration management, and transfusion reactions.',
    responsibilities: [
      'Maintain strict ISBT 128 labeling for packed red cells, platelets, fresh frozen plasma, and cryo',
      'Record ABO/Rh blood type verification and antibody screening crossmatch compatibility tests',
      'Log blood unit issue, bedside double-check verification, and adverse transfusion reaction workups'
    ],
    tableName: 'blood_inventory',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'unit_isbt128_code', type: 'VARCHAR(50)', nullable: false, index: true },
      { name: 'blood_type', type: 'ENUM("A+","A-","B+","B-","AB+","AB-","O+","O-")', nullable: false },
      { name: 'component_type', type: 'VARCHAR(50)', nullable: false },
      { name: 'donor_id', type: 'BIGINT UNSIGNED', nullable: false },
      { name: 'collection_date', type: 'DATE', nullable: false },
      { name: 'expiration_date', type: 'DATE', nullable: false },
      { name: 'crossmatch_result', type: 'VARCHAR(50)', nullable: true },
      { name: 'bedside_check_verified', type: 'BOOLEAN', nullable: false },
      { name: 'transfusion_reaction_flag', type: 'BOOLEAN', nullable: false },
      { name: 'status', type: 'ENUM("available","issued","expired","discarded")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 182,
    name: 'Medical Credentialing & Privileging',
    slug: 'medical-credentialing',
    category: 'Healthcare & Clinical',
    phase: 3,
    iconName: 'Award',
    purpose: 'Physician state license primary source verification, DEA registration tracking, and hospital medical staff privileges.',
    responsibilities: [
      'Perform automated primary source verification of physician state medical licenses and board certifications',
      'Query the National Practitioner Data Bank (NPDB) for disciplinary actions or malpractice claims',
      'Manage biennial hospital clinical privileging approval workflows across departmental chairs'
    ],
    tableName: 'provider_credentials',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'provider_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'license_number', type: 'VARCHAR(50)', nullable: false },
      { name: 'license_state', type: 'VARCHAR(2)', nullable: false },
      { name: 'license_expiry', type: 'DATE', nullable: false },
      { name: 'board_certification', type: 'VARCHAR(100)', nullable: true },
      { name: 'dea_registration', type: 'VARCHAR(20)', nullable: true },
      { name: 'npdb_check_completed', type: 'BOOLEAN', nullable: false },
      { name: 'privileging_expiry', type: 'DATE', nullable: true },
      { name: 'status', type: 'ENUM("verified","expired","suspended","pending")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 183,
    name: 'Dental Records & Periodontal Charting',
    slug: 'dental-records',
    category: 'Healthcare & Clinical',
    phase: 2,
    iconName: 'Grid',
    purpose: 'Interactive 32-tooth graphical odontogram, periodontal pocket depth probing, and CDT dental insurance claim billing.',
    responsibilities: [
      'Render interactive visual 32-tooth adult and primary dentition charting diagrams',
      'Record 6-point periodontal pocket depths, bleeding on probing, and tooth mobility grades',
      'Generate American Dental Association (ADA) dental claims with CDT procedure codes'
    ],
    tableName: 'dental_charts',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'patient_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'tooth_number', type: 'INT UNSIGNED', nullable: false },
      { name: 'procedure_code', type: 'VARCHAR(10)', nullable: false },
      { name: 'periodontal_pocket_depth', type: 'INT UNSIGNED', nullable: true },
      { name: 'bleeding_on_probing', type: 'BOOLEAN', nullable: false },
      { name: 'mobility_grade', type: 'INT UNSIGNED', nullable: true },
      { name: 'charting_image_url', type: 'VARCHAR(500)', nullable: true },
      { name: 'ada_claim_id', type: 'BIGINT UNSIGNED', nullable: true },
      { name: 'status', type: 'ENUM("active","treated","extracted","pending")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 184,
    name: 'Oncology Care Regimen Tracker',
    slug: 'oncology-care',
    category: 'Healthcare & Clinical',
    phase: 3,
    iconName: 'Shield',
    purpose: 'Chemotherapy dosing by body surface area (BSA), cycle day administration checklists, and toxicity grading.',
    responsibilities: [
      'Calculate oncology drug dosages based on Mosteller body surface area (BSA) formulas',
      'Enforce independent dual-pharmacist and dual-nurse chemotherapy verification sign-offs',
      'Track Common Terminology Criteria for Adverse Events (CTCAE) toxicity symptom grading'
    ],
    tableName: 'oncology_regimens',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'patient_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'regimen_protocol_id', type: 'BIGINT UNSIGNED', nullable: false },
      { name: 'drug_name', type: 'VARCHAR(255)', nullable: false },
      { name: 'bsa_calculated', type: 'DECIMAL(6,2)', nullable: false },
      { name: 'dosage_mg', type: 'DECIMAL(10,2)', nullable: false },
      { name: 'cycle_day', type: 'INT UNSIGNED', nullable: false },
      { name: 'dual_verification_completed', type: 'BOOLEAN', nullable: false },
      { name: 'ctcae_toxicity_grade', type: 'INT UNSIGNED', nullable: true },
      { name: 'status', type: 'ENUM("scheduled","administered","toxicity_reported","completed")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 185,
    name: 'Genomics Data & Biomarker Annotation',
    slug: 'genomics-data',
    category: 'Healthcare & Clinical',
    phase: 3,
    iconName: 'Dna',
    purpose: 'Next-generation sequencing (NGS) VCF file ingestion, pathogenic variant classification (ACMG), and targeted therapies.',
    responsibilities: [
      'Ingest genetic variant call format (VCF) files from clinical genomic sequencing laboratories',
      'Annotate genomic variants using ClinVar and dbSNP knowledge bases according to ACMG standards',
      'Surface FDA-approved precision oncology targeted therapies matched to identified genetic mutations'
    ],
    tableName: 'genomic_variants',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'patient_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'vcf_file_id', type: 'BIGINT UNSIGNED', nullable: false },
      { name: 'variant_position', type: 'VARCHAR(50)', nullable: false },
      { name: 'gene_name', type: 'VARCHAR(50)', nullable: false },
      { name: 'clinvar_classification', type: 'VARCHAR(50)', nullable: true },
      { name: 'dbsnp_id', type: 'VARCHAR(20)', nullable: true },
      { name: 'acmg_pathogenicity', type: 'VARCHAR(20)', nullable: false },
      { name: 'targeted_therapy_match', type: 'JSON', nullable: true },
      { name: 'clinical_significance', type: 'ENUM("pathogenic","likely_pathogenic","uncertain","benign")', nullable: false },
      { name: 'status', type: 'ENUM("identified","annotated","reported")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 186,
    name: 'Medical Transportation & Ambulance Dispatch',
    slug: 'ambulance-dispatch',
    category: 'Healthcare & Clinical',
    phase: 2,
    iconName: 'Truck',
    purpose: 'Non-emergency medical transportation (NEMT) routing, ALS/BLS ambulance dispatch, and patient mobility equipment needs.',
    responsibilities: [
      'Dispatch appropriate ambulance units (Basic Life Support vs Advanced Life Support) based on patient acuity',
      'Optimize non-emergency wheelchair van routes for scheduled outpatient dialysis appointments',
      'Capture electronic patient care reports (ePCR) conforming to NEMSIS national EMS standards'
    ],
    tableName: 'ambulance_transports',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'patient_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'transport_type', type: 'ENUM("als","bls","nemt")', nullable: false },
      { name: 'unit_type', type: 'VARCHAR(50)', nullable: false },
      { name: 'dispatch_time', type: 'TIMESTAMP', nullable: false },
      { name: 'pickup_location', type: 'VARCHAR(255)', nullable: false },
      { name: 'dropoff_location', type: 'VARCHAR(255)', nullable: false },
      { name: 'crew_id', type: 'BIGINT UNSIGNED', nullable: false },
      { name: 'epcr_submitted', type: 'BOOLEAN', nullable: false },
      { name: 'nemsis_compliant', type: 'BOOLEAN', nullable: false },
      { name: 'status', type: 'ENUM("dispatched","en_route","transporting","completed")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 187,
    name: 'Prior Authorization Automation',
    slug: 'prior-authorization',
    category: 'Healthcare & Clinical',
    phase: 2,
    iconName: 'FileCheck2',
    purpose: 'Electronic Prior Authorization (ePA), X12 278 transactions, clinical documentation attachment, and payer decision tracking.',
    responsibilities: [
      'Determine procedure and medication prior authorization requirements before treatment initiation',
      'Assemble supporting medical necessity clinical charts and submit standard X12 278 transactions',
      'Track payer turnaround deadlines and automatically trigger expedited appeals for urgent cases'
    ],
    tableName: 'prior_authorizations',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'patient_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'provider_id', type: 'BIGINT UNSIGNED', nullable: false },
      { name: 'procedure_code', type: 'VARCHAR(10)', nullable: false },
      { name: 'payer_id', type: 'BIGINT UNSIGNED', nullable: false },
      { name: 'clinical_necessity_doc', type: 'TEXT', nullable: false },
      { name: 'edi278_transaction_id', type: 'VARCHAR(50)', nullable: false },
      { name: 'payer_decision', type: 'ENUM("approved","denied","pending")', nullable: false },
      { name: 'turnaround_deadline', type: 'TIMESTAMP', nullable: false },
      { name: 'expedited_appeal_flag', type: 'BOOLEAN', nullable: false },
      { name: 'status', type: 'ENUM("submitted","approved","denied","appealed")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 188,
    name: 'Patient Discharge & Follow-up Planner',
    slug: 'discharge-planner',
    category: 'Healthcare & Clinical',
    phase: 2,
    iconName: 'CheckSquare',
    purpose: 'Hospital discharge instruction packets, post-acute care placement (SNF/Rehab), and 30-day readmission reduction.',
    responsibilities: [
      'Generate clear plain-language patient medication reconciliation and discharge instruction summaries',
      'Coordinate patient placement referrals to skilled nursing facilities (SNF) and home health agencies',
      'Schedule automated post-discharge nurse phone calls at 48 hours to prevent 30-day readmissions'
    ],
    tableName: 'discharge_plans',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'patient_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'discharge_date', type: 'DATE', nullable: false },
      { name: 'discharge_summary_json', type: 'JSON', nullable: false },
      { name: 'medication_reconciliation', type: 'JSON', nullable: false },
      { name: 'placement_facility', type: 'VARCHAR(255)', nullable: true },
      { name: 'readmission_risk_score', type: 'DECIMAL(5,2)', nullable: true },
      { name: 'followup_call_scheduled', type: 'TIMESTAMP', nullable: true },
      { name: 'followup_call_completed', type: 'BOOLEAN', nullable: false },
      { name: 'status', type: 'ENUM("planned","discharged","followed_up")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 189,
    name: 'Medical Consent & Directive Vault',
    slug: 'medical-consent-vault',
    category: 'Healthcare & Clinical',
    phase: 2,
    iconName: 'Lock',
    purpose: 'Living wills, Durable Power of Attorney for Healthcare, Do Not Resuscitate (DNR) orders, and procedure consents.',
    responsibilities: [
      'Store cryptographically verified electronic advance healthcare directives and living wills',
      'Record legally binding DNR/POLST medical orders with instant access during emergency resuscitation',
      'Collect informed procedure-specific consent signatures with patient educational comprehension quizzes'
    ],
    tableName: 'advance_directives',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'patient_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'directive_type', type: 'ENUM("living_will","dpoa","dnr","polst","consent")', nullable: false },
      { name: 'document_hash', type: 'VARCHAR(255)', nullable: false },
      { name: 'signed_timestamp', type: 'TIMESTAMP', nullable: false },
      { name: 'dnr_order_flag', type: 'BOOLEAN', nullable: false },
      { name: 'polst_order', type: 'BOOLEAN', nullable: false },
      { name: 'procedure_consent', type: 'VARCHAR(255)', nullable: true },
      { name: 'legal_guardian_id', type: 'BIGINT UNSIGNED', nullable: true },
      { name: 'fda_part50_compliant', type: 'BOOLEAN', nullable: false },
      { name: 'status', type: 'ENUM("active","revoked","expired")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 190,
    name: 'Healthcare Provider Directory & NPI Lookup',
    slug: 'provider-directory',
    category: 'Healthcare & Clinical',
    phase: 1,
    iconName: 'BookUser',
    purpose: 'National Provider Identifier (NPI) registry sync, taxonomy codes, insurance in-network status, and clinic locations.',
    responsibilities: [
      'Sync clinical provider credentials against the federal CMS NPPES National Provider Identifier registry',
      'Maintain up-to-date in-network health plan participation directories for No Surprises Act compliance',
      'Provide consumer-facing provider search filtering by clinical specialty, language, and gender'
    ],
    tableName: 'healthcare_providers',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'npi_number', type: 'VARCHAR(10)', nullable: false, index: true },
      { name: 'provider_name', type: 'VARCHAR(255)', nullable: false },
      { name: 'taxonomy_code', type: 'VARCHAR(10)', nullable: false },
      { name: 'specialty', type: 'VARCHAR(100)', nullable: false },
      { name: 'license_state', type: 'VARCHAR(2)', nullable: false },
      { name: 'in_network_status', type: 'BOOLEAN', nullable: false },
      { name: 'practice_location_json', type: 'JSON', nullable: true },
      { name: 'directory_visible', type: 'BOOLEAN', nullable: false },
      { name: 'nppes_synced_at', type: 'TIMESTAMP', nullable: true },
      { name: 'status', type: 'ENUM("active","inactive","restricted")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),

  // ==========================================
  // DOMAIN 14: REAL ESTATE & ASSETS (191-220)
  // ==========================================
  buildModule({
    id: 191,
    name: 'Property Listing & MLS Syndication',
    slug: 'property-listings',
    category: 'Real Estate & Assets',
    phase: 2,
    iconName: 'Building',
    purpose: 'RESO Web API property syndication, virtual tour media embeds, open house scheduling, and lead attribution.',
    responsibilities: [
      'Publish residential and commercial properties conforming to Real Estate Standards Organization (RESO) specs',
      'Syndicate listings to Zillow, Realtor.com, and local Multiple Listing Services (MLS)',
      'Host 3D Matterport virtual tour walkthroughs and coordinate public open house appointments'
    ],
    tableName: 'property_listings',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'property_address', type: 'VARCHAR(500)', nullable: false },
      { name: 'property_type', type: 'ENUM("residential","commercial","land")', nullable: false },
      { name: 'listing_price', type: 'DECIMAL(14,2)', nullable: false },
      { name: 'square_footage', type: 'INT UNSIGNED', nullable: false },
      { name: 'bedroom_count', type: 'INT UNSIGNED', nullable: true },
      { name: 'bathroom_count', type: 'DECIMAL(3,1)', nullable: true },
      { name: 'virtual_tour_url', type: 'VARCHAR(500)', nullable: true },
      { name: 'mls_number', type: 'VARCHAR(50)', nullable: false, index: true },
      { name: 'open_house_dates', type: 'JSON', nullable: true },
      { name: 'syndication_status', type: 'ENUM("active","paused","expired")', nullable: false },
      { name: 'status', type: 'ENUM("for_sale","under_contract","sold","withdrawn")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 192,
    name: 'Lease Contract Management',
    slug: 'lease-contracts',
    category: 'Real Estate & Assets',
    phase: 2,
    iconName: 'FileText',
    purpose: 'Commercial and residential lease generation, rent escalation clauses, renewal options, and security deposit ledgers.',
    responsibilities: [
      'Draft standardized state-compliant residential lease agreements with customizable clauses',
      'Automate commercial rent escalation calculations (CPI adjustments, stepped percentage increases)',
      'Maintain separate interest-bearing security deposit escrow trust accounts with annual interest accruals'
    ],
    tableName: 'lease_contracts',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'property_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'tenant_id', type: 'BIGINT UNSIGNED', nullable: false },
      { name: 'lease_start_date', type: 'DATE', nullable: false },
      { name: 'lease_end_date', type: 'DATE', nullable: false },
      { name: 'monthly_rent_amount', type: 'DECIMAL(12,2)', nullable: false },
      { name: 'security_deposit_amount', type: 'DECIMAL(12,2)', nullable: false },
      { name: 'renewal_option_flag', type: 'BOOLEAN', nullable: false },
      { name: 'rent_escalation_clause', type: 'TEXT', nullable: true },
      { name: 'status', type: 'ENUM("draft","active","expired","terminated")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 193,
    name: 'Tenant Screening & Credit Check',
    slug: 'tenant-screening',
    category: 'Real Estate & Assets',
    phase: 2,
    iconName: 'UserCheck',
    purpose: 'Automated credit score retrieval, national criminal background checks, eviction history records, and income verification.',
    responsibilities: [
      'Pull soft-pull credit reports with FICO scores and outstanding debt obligations',
      'Search nationwide eviction filings and sex offender registries compliant with Fair Housing laws',
      'Verify prospective tenant employment and income through automated bank statement integrations'
    ],
    tableName: 'tenant_screenings',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'applicant_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'credit_score', type: 'INT UNSIGNED', nullable: false },
      { name: 'criminal_background_flag', type: 'BOOLEAN', nullable: false },
      { name: 'eviction_history_flag', type: 'BOOLEAN', nullable: false },
      { name: 'income_verification_amount', type: 'DECIMAL(12,2)', nullable: true },
      { name: 'employment_verified', type: 'BOOLEAN', nullable: false },
      { name: 'screening_status', type: 'ENUM("pending","approved","denied","conditional")', nullable: false },
      { name: 'fair_housing_compliant', type: 'BOOLEAN', nullable: false },
      { name: 'status', type: 'ENUM("initiated","completed","expired")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 194,
    name: 'Maintenance Work Order Dispatch',
    slug: 'maintenance-dispatch',
    category: 'Real Estate & Assets',
    phase: 2,
    iconName: 'Wrench',
    purpose: 'Tenant maintenance ticketing, contractor dispatch, before-and-after photo verification, and expense approval limits.',
    responsibilities: [
      'Provide tenants a mobile-friendly portal to report plumbing, HVAC, and electrical repair issues',
      'Dispatch work orders automatically to preferred trade vendors based on unit location and trade specialty',
      'Require contractor before/after photographic proof of repair prior to invoice authorization'
    ],
    tableName: 'maintenance_tickets',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'property_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'tenant_id', type: 'BIGINT UNSIGNED', nullable: false },
      { name: 'issue_category', type: 'VARCHAR(100)', nullable: false },
      { name: 'description_text', type: 'TEXT', nullable: false },
      { name: 'contractor_id', type: 'BIGINT UNSIGNED', nullable: true },
      { name: 'priority_level', type: 'ENUM("low","medium","high","emergency")', nullable: false },
      { name: 'before_photo_url', type: 'VARCHAR(500)', nullable: true },
      { name: 'after_photo_url', type: 'VARCHAR(500)', nullable: true },
      { name: 'invoice_authorized', type: 'BOOLEAN', nullable: false },
      { name: 'status', type: 'ENUM("open","dispatched","in_progress","completed")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 195,
    name: 'Rent Collection & Automated ACH',
    slug: 'rent-collection',
    category: 'Real Estate & Assets',
    phase: 2,
    iconName: 'DollarSign',
    purpose: 'Recurring autopay scheduling, split roommate payments, late fee calculation, and automated landlord disbursements.',
    responsibilities: [
      'Process recurring monthly rent payments via fee-free ACH debit or debit/credit card processing',
      'Allow roommates in shared leases to individually pay fractional portions of total monthly rent',
      'Assess statutory late fees automatically after grace periods expire and disburse funds to property owners'
    ],
    tableName: 'rent_transactions',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'lease_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'tenant_id', type: 'BIGINT UNSIGNED', nullable: false },
      { name: 'payment_amount', type: 'DECIMAL(12,2)', nullable: false },
      { name: 'payment_method', type: 'ENUM("ach","credit_card","debit_card","check")', nullable: false },
      { name: 'autopay_flag', type: 'BOOLEAN', nullable: false },
      { name: 'late_fee_amount', type: 'DECIMAL(10,2)', nullable: false },
      { name: 'disbursement_status', type: 'ENUM("pending","disbursed","failed")', nullable: false },
      { name: 'grace_period_end', type: 'DATE', nullable: true },
      { name: 'split_roommate_flag', type: 'BOOLEAN', nullable: false },
      { name: 'status', type: 'ENUM("scheduled","processing","completed","failed")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 196,
    name: 'Commercial Space Space-Planning',
    slug: 'space-planning',
    category: 'Real Estate & Assets',
    phase: 3,
    iconName: 'Layout',
    purpose: 'Usable vs rentable square footage (BOMA 2017 standards), floor plan allocation, and tenant improvement (TI) allowances.',
    responsibilities: [
      'Calculate rentable square footage and building load factors conforming to BOMA floor measurement standards',
      'Allocate tenant suite demising walls and common corridor areas on CAD floor plans',
      'Track Tenant Improvement (TI) architectural construction allowance disbursements against contractor lien waivers'
    ],
    tableName: 'commercial_spaces',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'property_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'suite_number', type: 'VARCHAR(20)', nullable: false },
      { name: 'usable_sqft', type: 'INT UNSIGNED', nullable: false },
      { name: 'rentable_sqft', type: 'INT UNSIGNED', nullable: false },
      { name: 'boma_load_factor', type: 'DECIMAL(5,4)', nullable: false },
      { name: 'floor_plan_url', type: 'VARCHAR(500)', nullable: true },
      { name: 'ti_allowance_amount', type: 'DECIMAL(12,2)', nullable: true },
      { name: 'tenant_id', type: 'BIGINT UNSIGNED', nullable: true },
      { name: 'status', type: 'ENUM("vacant","leased","under_construction")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 197,
    name: 'Facility Energy Consumption Metering',
    slug: 'facility-energy-metering',
    category: 'Real Estate & Assets',
    phase: 2,
    iconName: 'Zap',
    purpose: 'Smart electric, gas, and water sub-metering, tenant utility rebilling (RUBS), and peak demand charge mitigation.',
    responsibilities: [
      'Ingest pulse meter data from commercial electric submeters at 15-minute intervals',
      'Calculate Ratio Utility Billing System (RUBS) tenant allocations for shared master-metered buildings',
      'Alert facility managers before building electrical consumption triggers expensive utility peak demand ratchets'
    ],
    tableName: 'meter_readings',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'property_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'meter_type', type: 'ENUM("electric","gas","water")', nullable: false },
      { name: 'reading_value', type: 'DECIMAL(12,4)', nullable: false },
      { name: 'reading_unit', type: 'VARCHAR(20)', nullable: false },
      { name: 'interval_start', type: 'TIMESTAMP', nullable: false },
      { name: 'interval_end', type: 'TIMESTAMP', nullable: false },
      { name: 'tenant_allocation_amount', type: 'DECIMAL(12,2)', nullable: true },
      { name: 'rubs_calculation', type: 'JSON', nullable: true },
      { name: 'peak_demand_flag', type: 'BOOLEAN', nullable: false },
      { name: 'status', type: 'ENUM("recorded","validated","flagged")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 198,
    name: 'Smart Building IoT Access Control',
    slug: 'building-iot-access',
    category: 'Real Estate & Assets',
    phase: 3,
    iconName: 'Key',
    purpose: 'Mobile BLE door unlocking, visitor QR codes, elevator floor access permissions, and turnstile integrations.',
    responsibilities: [
      'Provision encrypted mobile smartphone NFC/BLE digital credentials for commercial building turnstiles',
      'Generate expiring single-use QR guest passes for lobby security desk kiosks',
      'Control destination dispatch elevators restricting visitor cabs strictly to authorized tenant floors'
    ],
    tableName: 'access_credentials',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'tenant_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'credential_type', type: 'ENUM("mobile_nfc","mobile_ble","qr_pass")', nullable: false },
      { name: 'nfc_ble_token', type: 'VARCHAR(255)', nullable: false },
      { name: 'qr_pass_expiry', type: 'TIMESTAMP', nullable: true },
      { name: 'elevator_floor_access', type: 'JSON', nullable: true },
      { name: 'access_schedule', type: 'VARCHAR(100)', nullable: true },
      { name: 'revocation_flag', type: 'BOOLEAN', nullable: false },
      { name: 'revoked_at', type: 'TIMESTAMP', nullable: true },
      { name: 'status', type: 'ENUM("active","revoked","expired","suspended")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 199,
    name: 'HOA & Strata Community Management',
    slug: 'hoa-management',
    category: 'Real Estate & Assets',
    phase: 2,
    iconName: 'Home',
    purpose: 'HOA dues collection, architectural review board (ARC) submissions, community CCR violation notices, and elections.',
    responsibilities: [
      'Invoice quarterly HOA assessments and manage reserve fund allocations for capital expenditures',
      'Review architectural change applications (paint colors, fences, solar panels) with committee voting',
      'Issue CCR violation warnings with attached photographic evidence and track hearing appeals'
    ],
    tableName: 'hoa_communities',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'community_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'homeowner_id', type: 'BIGINT UNSIGNED', nullable: false },
      { name: 'assessment_amount', type: 'DECIMAL(10,2)', nullable: false },
      { name: 'reserve_fund_balance', type: 'DECIMAL(14,2)', nullable: true },
      { name: 'arc_submission_flag', type: 'BOOLEAN', nullable: false },
      { name: 'ccr_violation_flag', type: 'BOOLEAN', nullable: false },
      { name: 'election_vote_json', type: 'JSON', nullable: true },
      { name: 'hearing_appeal_flag', type: 'BOOLEAN', nullable: false },
      { name: 'status', type: 'ENUM("current","delinquent","in_violation")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 200,
    name: 'Fixed Asset Depreciation Engine',
    slug: 'fixed-asset-depreciation',
    category: 'Real Estate & Assets',
    phase: 2,
    iconName: 'Percent',
    purpose: 'GAAP and tax depreciation (MACRS 200% DB, Straight-Line, Section 179), asset tagging, and disposal gain/loss posting.',
    responsibilities: [
      'Maintain fixed asset registers with barcode serial numbers, purchase invoices, and physical locations',
      'Compute automated monthly book depreciation (Straight-Line) and tax depreciation (MACRS bonus depreciation)',
      'Calculate gain or loss upon asset retirement or sale and post balancing journal entries to general ledger'
    ],
    tableName: 'fixed_assets',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'asset_tag', type: 'VARCHAR(50)', nullable: false, index: true },
      { name: 'description', type: 'VARCHAR(255)', nullable: false },
      { name: 'purchase_cost', type: 'DECIMAL(14,2)', nullable: false },
      { name: 'purchase_date', type: 'DATE', nullable: false },
      { name: 'useful_life_months', type: 'INT UNSIGNED', nullable: false },
      { name: 'depreciation_method', type: 'ENUM("straight_line","macrs","section179")', nullable: false },
      { name: 'book_value', type: 'DECIMAL(14,2)', nullable: false },
      { name: 'tax_value', type: 'DECIMAL(14,2)', nullable: false },
      { name: 'disposal_gain_loss', type: 'DECIMAL(14,2)', nullable: true },
      { name: 'status', type: 'ENUM("active","fully_depreciated","disposed","sold")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 201,
    name: 'Preventative Maintenance Scheduler',
    slug: 'preventative-maintenance',
    category: 'Real Estate & Assets',
    phase: 2,
    iconName: 'CheckCircle',
    purpose: 'Roofing inspections, chiller filter replacements, elevator safety certifications, and backflow preventer testing.',
    responsibilities: [
      'Generate recurring preventive maintenance checklists based on equipment run-hours or calendar frequencies',
      'Archive annual municipal elevator, boiler, and fire suppression compliance inspection certificates',
      'Track equipment warranty documentation preventing paying out-of-pocket for covered component repairs'
    ],
    tableName: 'preventive_schedules',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'property_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'equipment_id', type: 'BIGINT UNSIGNED', nullable: false },
      { name: 'maintenance_type', type: 'VARCHAR(100)', nullable: false },
      { name: 'frequency_days', type: 'INT UNSIGNED', nullable: false },
      { name: 'last_completed_at', type: 'TIMESTAMP', nullable: true },
      { name: 'next_due_at', type: 'TIMESTAMP', nullable: false },
      { name: 'certificate_url', type: 'VARCHAR(500)', nullable: true },
      { name: 'warranty_expiry', type: 'DATE', nullable: true },
      { name: 'compliance_flag', type: 'BOOLEAN', nullable: false },
      { name: 'status', type: 'ENUM("scheduled","in_progress","completed","overdue")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 202,
    name: 'Real Estate Appraisal & Valuation',
    slug: 'appraisal-valuation',
    category: 'Real Estate & Assets',
    phase: 3,
    iconName: 'Scale',
    purpose: 'Automated Valuation Models (AVM), comparable sales adjustments, income capitalization approach, and appraisal reviews.',
    responsibilities: [
      'Execute Automated Valuation Models comparing recent nearby square-foot sales comps',
      'Calculate commercial property valuations using Capitalization Rates (Cap Rate) and Net Operating Income (NOI)',
      'Track Uniform Residential Appraisal Report (URAR Form 1004) submission milestones for mortgage underwriters'
    ],
    tableName: 'property_valuations',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'property_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'valuation_type', type: 'ENUM("avm","income","comparison")', nullable: false },
      { name: 'estimated_value', type: 'DECIMAL(14,2)', nullable: false },
      { name: 'comparable_sales_json', type: 'JSON', nullable: true },
      { name: 'cap_rate_pct', type: 'DECIMAL(5,2)', nullable: true },
      { name: 'noi_amount', type: 'DECIMAL(14,2)', nullable: true },
      { name: 'urar_form_url', type: 'VARCHAR(500)', nullable: true },
      { name: 'valuation_date', type: 'DATE', nullable: false },
      { name: 'appraiser_id', type: 'BIGINT UNSIGNED', nullable: true },
      { name: 'status', type: 'ENUM("draft","final","expired","disputed")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 203,
    name: 'Escrow & Title Closing Workflow',
    slug: 'escrow-closing',
    category: 'Real Estate & Assets',
    phase: 3,
    iconName: 'Briefcase',
    purpose: 'Earnest money deposit holding, title search defect clearance, ALTA settlement statement generation, and deed recording.',
    responsibilities: [
      'Track buyer earnest money escrow deposits and condition satisfaction deadlines (inspection, financing)',
      'Log title search reports and flag liens, encroachments, or unpaid tax encumbrances requiring clearance',
      'Generate ALTA settlement statements balancing buyer debits and seller credits at final closing'
    ],
    tableName: 'escrow_transactions',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'property_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'buyer_id', type: 'BIGINT UNSIGNED', nullable: false },
      { name: 'seller_id', type: 'BIGINT UNSIGNED', nullable: false },
      { name: 'earnest_money_deposit', type: 'DECIMAL(14,2)', nullable: false },
      { name: 'title_search_status', type: 'ENUM("pending","clear","defects_found")', nullable: false },
      { name: 'lien_clearance_flag', type: 'BOOLEAN', nullable: false },
      { name: 'alta_statement_url', type: 'VARCHAR(500)', nullable: true },
      { name: 'deed_recording_status', type: 'ENUM("pending","recorded","rejected")', nullable: false },
      { name: 'closing_date', type: 'DATE', nullable: false },
      { name: 'status', type: 'ENUM("opened","funded","closed","cancelled")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 204,
    name: 'Move-In & Move-Out Digital Inspections',
    slug: 'property-inspections',
    category: 'Real Estate & Assets',
    phase: 2,
    iconName: 'Camera',
    purpose: 'Mobile room-by-room condition checklists, time-stamped damage photos, and security deposit itemization deductions.',
    responsibilities: [
      'Guide property managers through digital room-by-room condition checklists with high-res photo capture',
      'Compare move-in vs move-out conditions side-by-side to distinguish normal wear and tear from tenant damage',
      'Generate legally mandated security deposit deduction notices with contractor repair receipts'
    ],
    tableName: 'inspection_reports',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'property_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'tenant_id', type: 'BIGINT UNSIGNED', nullable: false },
      { name: 'inspection_type', type: 'ENUM("move_in","move_out","routine")', nullable: false },
      { name: 'room_checklist_json', type: 'JSON', nullable: false },
      { name: 'photo_urls_json', type: 'JSON', nullable: true },
      { name: 'move_in_condition', type: 'TEXT', nullable: true },
      { name: 'move_out_condition', type: 'TEXT', nullable: true },
      { name: 'security_deposit_deduction_amount', type: 'DECIMAL(12,2)', nullable: true },
      { name: 'status', type: 'ENUM("scheduled","in_progress","completed","submitted")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 205,
    name: 'Parking Space & EV Charger Allocation',
    slug: 'parking-ev-allocation',
    category: 'Real Estate & Assets',
    phase: 2,
    iconName: 'Car',
    purpose: 'Assigned garage stall management, guest parking permits, EV charging station billing (kWh), and license plate recognition.',
    responsibilities: [
      'Assign reserved residential and commercial garage spaces and issue RFID windshield toll tags',
      'Bill electric vehicle charging session kilowatt-hours directly to tenant monthly rent ledgers',
      'Enforce visitor parking limits using automated mobile security license plate scanning patrols'
    ],
    tableName: 'parking_stalls',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'property_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'stall_number', type: 'VARCHAR(20)', nullable: false },
      { name: 'tenant_id', type: 'BIGINT UNSIGNED', nullable: true },
      { name: 'rfid_tag', type: 'VARCHAR(50)', nullable: true },
      { name: 'ev_charger_flag', type: 'BOOLEAN', nullable: false },
      { name: 'guest_permit_flag', type: 'BOOLEAN', nullable: false },
      { name: 'license_plate', type: 'VARCHAR(20)', nullable: true },
      { name: 'kwh_charged', type: 'DECIMAL(10,2)', nullable: true },
      { name: 'billing_amount', type: 'DECIMAL(10,2)', nullable: false },
      { name: 'status', type: 'ENUM("assigned","unassigned","reserved","maintenance")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 206,
    name: 'Vendor Contractor Dispatch & Invoicing',
    slug: 'vendor-dispatch',
    category: 'Real Estate & Assets',
    phase: 2,
    iconName: 'Hammer',
    purpose: 'Trade contractor insurance verification, RFP bidding, work sign-offs, and two-way invoice matching.',
    responsibilities: [
      'Verify contractor general liability and workers compensation certificates of insurance before job dispatch',
      'Solicit competitive trade contractor bids for major capital improvement projects ($10k+)',
      'Perform 2-way matching of contractor invoices against approved purchase orders before payment'
    ],
    tableName: 'contractor_invoices',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'property_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'contractor_id', type: 'BIGINT UNSIGNED', nullable: false },
      { name: 'insurance_verified', type: 'BOOLEAN', nullable: false },
      { name: 'rfp_id', type: 'BIGINT UNSIGNED', nullable: true },
      { name: 'purchase_order_id', type: 'BIGINT UNSIGNED', nullable: true },
      { name: 'invoice_amount', type: 'DECIMAL(14,2)', nullable: false },
      { name: 'two_way_match_flag', type: 'BOOLEAN', nullable: false },
      { name: 'work_signed_off', type: 'BOOLEAN', nullable: false },
      { name: 'payment_status', type: 'ENUM("pending","approved","paid","rejected")', nullable: false },
      { name: 'status', type: 'ENUM("submitted","matched","approved","paid")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 207,
    name: 'CAM (Common Area Maintenance) Reconciliation',
    slug: 'cam-reconciliation',
    category: 'Real Estate & Assets',
    phase: 3,
    iconName: 'Calculator',
    purpose: 'Triple-net (NNN) commercial lease expense pooling, pro-rata share calculations, and annual reconciliation true-ups.',
    responsibilities: [
      'Pool annual operational expenses (landscaping, snow removal, security, property taxes, insurance)',
      'Calculate each commercial tenant pro-rata share based on leased square footage percentages',
      'Generate annual CAM reconciliation statements billing shortfalls or crediting overpayments'
    ],
    tableName: 'cam_pools',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'property_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'fiscal_year', type: 'INT UNSIGNED', nullable: false },
      { name: 'total_expenses', type: 'DECIMAL(14,2)', nullable: false },
      { name: 'tenant_sqft', type: 'INT UNSIGNED', nullable: false },
      { name: 'pro_rata_share_pct', type: 'DECIMAL(5,4)', nullable: false },
      { name: 'reconciliation_amount', type: 'DECIMAL(14,2)', nullable: false },
      { name: 'shortfall_credit_flag', type: 'BOOLEAN', nullable: false },
      { name: 'statement_generated_at', type: 'TIMESTAMP', nullable: true },
      { name: 'status', type: 'ENUM("pooled","calculated","reconciled","paid")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 208,
    name: 'Keycard & Mobile Credential Provisioning',
    slug: 'keycard-provisioning',
    category: 'Real Estate & Assets',
    phase: 2,
    iconName: 'CreditCard',
    purpose: 'HID physical access keycard encoding, access group assignments, perimeter gate sync, and credential revoking.',
    responsibilities: [
      'Encode physical RFID/NFC key fobs and program credential bits into access control servers',
      'Assign granular access schedules (e.g., Gym: 6am-10pm, Building: 24/7, Penthouse: Restricted)',
      'Instantly revoke all digital and physical access credentials upon tenant lease termination'
    ],
    tableName: 'keycard_credentials',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'tenant_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'credential_type', type: 'ENUM("rfid_fob","nfc_card","mobile")', nullable: false },
      { name: 'rfid_nfc_token', type: 'VARCHAR(255)', nullable: false },
      { name: 'access_group', type: 'VARCHAR(100)', nullable: false },
      { name: 'access_schedule', type: 'VARCHAR(100)', nullable: false },
      { name: 'gate_sync_flag', type: 'BOOLEAN', nullable: false },
      { name: 'revocation_flag', type: 'BOOLEAN', nullable: false },
      { name: 'revoked_at', type: 'TIMESTAMP', nullable: true },
      { name: 'status', type: 'ENUM("active","revoked","lost","expired")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 209,
    name: 'Short-Term Rental Channel Manager',
    slug: 'short-term-rentals',
    category: 'Real Estate & Assets',
    phase: 2,
    iconName: 'Calendar',
    purpose: 'Airbnb, VRBO, and Booking.com calendar sync (iCal/API), dynamic pricing rules, and automated cleaner dispatch.',
    responsibilities: [
      'Synchronize availability calendars across Airbnb, VRBO, and direct booking engines to prevent double-booking',
      'Update nightly prices dynamically based on local festival dates, weekend demand, and competitor rates',
      'Dispatch turnaround cleaning crews automatically based on guest checkout and check-in times'
    ],
    tableName: 'short_term_reservations',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'property_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'channel_source', type: 'ENUM("airbnb","vrbo","booking_com","direct")', nullable: false },
      { name: 'guest_name', type: 'VARCHAR(255)', nullable: false },
      { name: 'check_in_date', type: 'DATE', nullable: false },
      { name: 'check_out_date', type: 'DATE', nullable: false },
      { name: 'nightly_rate', type: 'DECIMAL(10,2)', nullable: false },
      { name: 'calendar_synced', type: 'BOOLEAN', nullable: false },
      { name: 'dynamic_pricing_flag', type: 'BOOLEAN', nullable: false },
      { name: 'cleaner_dispatched', type: 'BOOLEAN', nullable: false },
      { name: 'status', type: 'ENUM("confirmed","checked_in","checked_out","cancelled")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 210,
    name: 'Real Estate Investment Trust (REIT) Ledger',
    slug: 'reit-ledger',
    category: 'Real Estate & Assets',
    phase: 3,
    iconName: 'Coins',
    purpose: 'Funds From Operations (FFO) calculations, dividend distribution schedules, and multi-property investor distributions.',
    responsibilities: [
      'Calculate Funds From Operations (FFO) and Adjusted FFO (AFFO) conforming to NAREIT accounting guidelines',
      'Track individual limited partner equity ownership shares, capital calls, and preferred return hurdles',
      'Generate quarterly dividend distribution schedules and annual K-1 tax document packages'
    ],
    tableName: 'reit_investors',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'property_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'investor_id', type: 'BIGINT UNSIGNED', nullable: false },
      { name: 'equity_share_pct', type: 'DECIMAL(7,4)', nullable: false },
      { name: 'ffo_amount', type: 'DECIMAL(14,2)', nullable: false },
      { name: 'affo_amount', type: 'DECIMAL(14,2)', nullable: false },
      { name: 'capital_call_amount', type: 'DECIMAL(14,2)', nullable: true },
      { name: 'preferred_return_pct', type: 'DECIMAL(5,2)', nullable: true },
      { name: 'dividend_amount', type: 'DECIMAL(14,2)', nullable: false },
      { name: 'k1_generated_flag', type: 'BOOLEAN', nullable: false },
      { name: 'status', type: 'ENUM("active","pending_distribution","capital_call")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 211,
    name: 'Janitorial & Sanitation Scheduling',
    slug: 'janitorial-scheduling',
    category: 'Real Estate & Assets',
    phase: 2,
    iconName: 'Sparkles',
    purpose: 'Nightly cleaning task checklists, chemical safety data sheet (SDS) compliance, and QR checkpoint scanning.',
    responsibilities: [
      'Schedule nightly commercial office cleaning routes across restrooms, lobbies, and conference centers',
      'Require custodial staff to scan QR checkpoints throughout the facility to verify service delivery',
      'Maintain OSHA Safety Data Sheets (SDS) for all cleaning chemicals stored on the property'
    ],
    tableName: 'cleaning_checkpoints',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'property_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'checkpoint_qr', type: 'VARCHAR(100)', nullable: false },
      { name: 'task_type', type: 'VARCHAR(100)', nullable: false },
      { name: 'scheduled_date', type: 'DATE', nullable: false },
      { name: 'scanned_at', type: 'TIMESTAMP', nullable: true },
      { name: 'custodian_id', type: 'BIGINT UNSIGNED', nullable: false },
      { name: 'chemical_sds_compliant', type: 'BOOLEAN', nullable: false },
      { name: 'completion_verified', type: 'BOOLEAN', nullable: false },
      { name: 'status', type: 'ENUM("scheduled","in_progress","completed","missed")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 212,
    name: 'HVAC Automated Setpoint Control',
    slug: 'hvac-controls',
    category: 'Real Estate & Assets',
    phase: 2,
    iconName: 'Thermometer',
    purpose: 'BACnet and Modbus building automation protocol integration, weekend setback schedules, and zone thermal comfort.',
    responsibilities: [
      'Communicate with commercial rooftop HVAC units via BACnet/IP and Modbus protocols',
      'Apply automated setback temperatures during non-business hours to reduce operational energy costs',
      'Monitor tenant conference room occupancy sensors to pre-cool meeting rooms before scheduled events'
    ],
    tableName: 'hvac_zones',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'property_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'zone_id', type: 'VARCHAR(50)', nullable: false },
      { name: 'bacnet_modbus_protocol', type: 'ENUM("bacnet","modbus")', nullable: false },
      { name: 'setback_temperature', type: 'DECIMAL(5,2)', nullable: false },
      { name: 'occupancy_sensor_flag', type: 'BOOLEAN', nullable: false },
      { name: 'pre_cool_flag', type: 'BOOLEAN', nullable: false },
      { name: 'current_temperature', type: 'DECIMAL(5,2)', nullable: true },
      { name: 'target_temperature', type: 'DECIMAL(5,2)', nullable: true },
      { name: 'status', type: 'ENUM("normal","setback","occupied","offline")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 213,
    name: 'Water Leak & Fire Alarm Telemetry',
    slug: 'leak-fire-telemetry',
    category: 'Real Estate & Assets',
    phase: 2,
    iconName: 'Flame',
    purpose: 'LoRaWAN wireless water leak sensor arrays, automatic main shutoff valve triggers, and central station alarm feeds.',
    responsibilities: [
      'Ingest real-time wireless LoRaWAN moisture sensor signals positioned under water heaters and riser pipes',
      'Trigger automatic motorized water main shutoff valves within 15 seconds of confirmed pipe burst detection',
      'Log commercial fire alarm panel supervisory events, duct smoke sensors, and water flow alarms'
    ],
    tableName: 'hazard_telemetry',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'property_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'sensor_type', type: 'ENUM("water_leak","fire_alarm","duct_smoke")', nullable: false },
      { name: 'lorawan_device_id', type: 'VARCHAR(50)', nullable: false },
      { name: 'reading_value', type: 'DECIMAL(10,2)', nullable: false },
      { name: 'shutoff_valve_triggered', type: 'BOOLEAN', nullable: false },
      { name: 'fire_alarm_panel_event', type: 'VARCHAR(100)', nullable: true },
      { name: 'duct_smoke_sensor', type: 'VARCHAR(100)', nullable: true },
      { name: 'water_flow_alarm', type: 'BOOLEAN', nullable: false },
      { name: 'status', type: 'ENUM("normal","warning","alarm","acknowledged")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 214,
    name: 'Tenant Amenity Booking (Gym, Lounge)',
    slug: 'amenity-booking',
    category: 'Real Estate & Assets',
    phase: 1,
    iconName: 'Coffee',
    purpose: 'Rooftop deck reservations, shared conference room credits, clubhouse rental fees, and liability waiver collection.',
    responsibilities: [
      'Allow tenants to reserve shared building amenities (clubhouse, movie theater, grilling stations) via mobile app',
      'Allocate recurring monthly conference room credit quotas for commercial office tenants',
      'Collect security deposits and signed digital liability waivers for private party venue bookings'
    ],
    tableName: 'amenity_bookings',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'tenant_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'amenity_type', type: 'VARCHAR(100)', nullable: false },
      { name: 'booking_start', type: 'TIMESTAMP', nullable: false },
      { name: 'booking_end', type: 'TIMESTAMP', nullable: false },
      { name: 'security_deposit_amount', type: 'DECIMAL(10,2)', nullable: true },
      { name: 'liability_waiver_signed', type: 'BOOLEAN', nullable: false },
      { name: 'monthly_credit_quota', type: 'INT UNSIGNED', nullable: true },
      { name: 'party_booking_flag', type: 'BOOLEAN', nullable: false },
      { name: 'status', type: 'ENUM("confirmed","cancelled","completed","no_show")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 215,
    name: 'Architectural Blueprint Viewer',
    slug: 'blueprint-viewer',
    category: 'Real Estate & Assets',
    phase: 2,
    iconName: 'Layers',
    purpose: 'Multi-layer CAD/PDF architectural drawings, as-built markup annotations, and electrical riser diagrams.',
    responsibilities: [
      'Render complex multi-sheet vector architectural CAD and BIM drawings in browser',
      'Allow facility technicians to create pinned annotations and attach repair photos directly to floorplan locations',
      'Store revision-controlled as-built electrical, plumbing, and structural engineering schematics'
    ],
    tableName: 'blueprint_drawings',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'property_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'drawing_type', type: 'VARCHAR(100)', nullable: false },
      { name: 'sheet_number', type: 'VARCHAR(20)', nullable: false },
      { name: 'cad_bim_url', type: 'VARCHAR(500)', nullable: false },
      { name: 'revision_controlled', type: 'BOOLEAN', nullable: false },
      { name: 'annotation_json', type: 'JSON', nullable: true },
      { name: 'electrical_riser_url', type: 'VARCHAR(500)', nullable: true },
      { name: 'plumbing_url', type: 'VARCHAR(500)', nullable: true },
      { name: 'structural_url', type: 'VARCHAR(500)', nullable: true },
      { name: 'status', type: 'ENUM("current","archived","revision_pending")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 216,
    name: 'Sublease & Coworking Desk Allocation',
    slug: 'sublease-coworking',
    category: 'Real Estate & Assets',
    phase: 2,
    iconName: 'Monitor',
    purpose: 'Hot desk reservations, dedicated desk monthly billing, master landlord consent tracking, and high-speed Wi-Fi provisioning.',
    responsibilities: [
      'Manage flexible coworking hot desks, phone booths, and dedicated private offices with mobile booking',
      'Track master landlord sublease consent approvals and underlying lease expiration constraints',
      'Generate dynamic RADIUS Wi-Fi network passwords for day-pass visitors and monthly members'
    ],
    tableName: 'coworking_desks',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'property_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'desk_type', type: 'ENUM("hot_desk","dedicated","private_office")', nullable: false },
      { name: 'tenant_id', type: 'BIGINT UNSIGNED', nullable: true },
      { name: 'booking_start', type: 'TIMESTAMP', nullable: false },
      { name: 'booking_end', type: 'TIMESTAMP', nullable: false },
      { name: 'monthly_billing_amount', type: 'DECIMAL(10,2)', nullable: false },
      { name: 'landlord_consent_flag', type: 'BOOLEAN', nullable: false },
      { name: 'lease_expiry_constraint', type: 'DATE', nullable: true },
      { name: 'radius_wifi_generated', type: 'BOOLEAN', nullable: false },
      { name: 'status', type: 'ENUM("available","booked","maintenance")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 217,
    name: 'Property Tax & Escrow Tracking',
    slug: 'property-tax-escrow',
    category: 'Real Estate & Assets',
    phase: 2,
    iconName: 'Landmark',
    purpose: 'County tax assessment notices, property tax appeal deadlines, mortgage escrow account analysis, and payment vouchers.',
    responsibilities: [
      'Track annual county property tax assessment values, millage rates, and tax payment installment due dates',
      'Flag sharp valuation spikes and calculate potential tax savings for property tax appeal filings',
      'Perform annual mortgage escrow account analyses identifying surpluses or escrow balance shortages'
    ],
    tableName: 'property_tax_records',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'property_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'tax_year', type: 'INT UNSIGNED', nullable: false },
      { name: 'assessment_value', type: 'DECIMAL(14,2)', nullable: false },
      { name: 'millage_rate', type: 'DECIMAL(8,4)', nullable: false },
      { name: 'payment_due_date', type: 'DATE', nullable: false },
      { name: 'appeal_flag', type: 'BOOLEAN', nullable: false },
      { name: 'escrow_surplus_amount', type: 'DECIMAL(12,2)', nullable: true },
      { name: 'escrow_shortage_amount', type: 'DECIMAL(12,2)', nullable: true },
      { name: 'mortgage_escrow_analyzed', type: 'BOOLEAN', nullable: false },
      { name: 'status', type: 'ENUM("assessed","paid","appealed","overdue")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 218,
    name: 'Disaster Preparedness & Evacuation Drills',
    slug: 'disaster-preparedness',
    category: 'Real Estate & Assets',
    phase: 2,
    iconName: 'ShieldAlert',
    purpose: 'Emergency broadcast SMS notifications, tenant roll-call rosters, evacuation routes, and fire drill records.',
    responsibilities: [
      'Send emergency mass-broadcast SMS alerts to all building occupants during weather or safety crises',
      'Provide floor wardens real-time mobile roll-call rosters at external assembly muster points',
      'Record mandatory annual commercial fire evacuation drill completion times for municipal safety inspectors'
    ],
    tableName: 'evacuation_events',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'property_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'event_type', type: 'ENUM("fire_drill","weather","active_threat","other")', nullable: false },
      { name: 'sms_broadcast_sent', type: 'BOOLEAN', nullable: false },
      { name: 'roll_call_roster_json', type: 'JSON', nullable: true },
      { name: 'assembly_point', type: 'VARCHAR(100)', nullable: false },
      { name: 'evacuation_route', type: 'VARCHAR(255)', nullable: true },
      { name: 'drill_completion_time', type: 'INT UNSIGNED', nullable: true },
      { name: 'municipal_inspector_notified', type: 'BOOLEAN', nullable: false },
      { name: 'status', type: 'ENUM("triggered","in_progress","completed","cancelled")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 219,
    name: 'Commercial Retail Footfall Analytics',
    slug: 'retail-footfall',
    category: 'Real Estate & Assets',
    phase: 3,
    iconName: 'Users',
    purpose: 'Overhead optical stereoscopic people counters, dwell time heatmaps, and retail tenant percentage rent auditing.',
    responsibilities: [
      'Ingest hourly visitor count data from ceiling-mounted optical 3D people counters in shopping center concourses',
      'Generate shopper traffic heatmaps identifying prime mall concourse pedestrian zones',
      'Audit retail tenant percentage rent clauses tying base rent escalations to verified store sales velocity'
    ],
    tableName: 'footfall_records',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'property_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'counter_id', type: 'VARCHAR(50)', nullable: false },
      { name: 'hourly_visitor_count', type: 'INT UNSIGNED', nullable: false },
      { name: 'heatmap_url', type: 'VARCHAR(500)', nullable: true },
      { name: 'concourse_zone', type: 'VARCHAR(100)', nullable: false },
      { name: 'percentage_rent_audit_flag', type: 'BOOLEAN', nullable: false },
      { name: 'tenant_id', type: 'BIGINT UNSIGNED', nullable: true },
      { name: 'sales_velocity_json', type: 'JSON', nullable: true },
      { name: 'status', type: 'ENUM("recorded","validated","audited")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 220,
    name: 'Construction Draw & Loan Inspection',
    slug: 'construction-draws',
    category: 'Real Estate & Assets',
    phase: 3,
    iconName: 'HardHat',
    purpose: 'G702/G703 contractor pay applications, AIA architect certification, mechanics lien waiver tracking, and loan draws.',
    responsibilities: [
      'Process general contractor AIA Document G702/G703 payment applications against itemized schedules of values',
      'Collect unconditional progressive mechanics lien waivers from all subcontractors before funding',
      'Coordinate third-party bank construction progress inspections prior to releasing loan draw tranches'
    ],
    tableName: 'construction_draws',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'property_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'draw_number', type: 'INT UNSIGNED', nullable: false },
      { name: 'g702_g703_amount', type: 'DECIMAL(14,2)', nullable: false },
      { name: 'architect_certification_flag', type: 'BOOLEAN', nullable: false },
      { name: 'lien_waiver_received', type: 'BOOLEAN', nullable: false },
      { name: 'bank_inspection_completed', type: 'BOOLEAN', nullable: false },
      { name: 'loan_draw_tranche', type: 'INT UNSIGNED', nullable: false },
      { name: 'contractor_id', type: 'BIGINT UNSIGNED', nullable: false },
      { name: 'status', type: 'ENUM("submitted","inspected","approved","funded")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ]
  })
];
