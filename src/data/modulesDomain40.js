import { buildModule } from './moduleBuilderHelper';

export const modulesDomain40 = [
  buildModule({
    id: 891,
    name: 'Policy Administration System',
    slug: 'policy-administration-system',
    category: 'Insurance & Actuarial',
    phase: 40,
    iconName: 'FileText',
    purpose: 'Manage end-to-end policy lifecycle from issuance through endorsements to renewal.',
    responsibilities: [
      'Issue new policies with coverage details and premium schedules',
      'Process endorsements, cancellations, and reinstatements',
      'Maintain policy master records with version history'
    ],
    tableName: 'policy_administration_records',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'policy_number', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'line_of_business', type: 'VARCHAR(64)', nullable: false },
      { name: 'status', type: 'ENUM("quoted","bound","issued","cancelled","expired","archived")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/policy-administration-system', description: 'Issue policy', permission: 'policy-administration-system.create', authRequired: true },
      { method: 'GET', path: '/api/v1/policy-administration-system', description: 'List policies', permission: 'policy-administration-system.view', authRequired: true },
      { method: 'GET', path: '/api/v1/policy-administration-system/{id}', description: 'Get policy details', permission: 'policy-administration-system.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/policy-administration-system/{id}', description: 'Update policy', permission: 'policy-administration-system.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/policy-administration-system/{id}', description: 'Cancel policy', permission: 'policy-administration-system.delete', authRequired: true }
    ],
    services: ['PolicyIssuanceService', 'EndorsementProcessingService'],
    events: ['PolicyIssued', 'PolicyEndorsed', 'PolicyCancelled'],
    jobs: ['IssuePoliciesJob', 'ProcessEndorsementsJob'],
    dependencies: [1],
    tests: ['PolicyIssuanceTest', 'EndorsementProcessingTest']
  }),
  buildModule({
    id: 892,
    name: 'Claims Adjudication Engine',
    slug: 'claims-adjudication-engine',
    category: 'Insurance & Actuarial',
    phase: 40,
    iconName: 'Scale',
    purpose: 'Evaluate and adjudicate insurance claims against policy coverage and terms.',
    responsibilities: [
      'Assess claim validity against policy terms and conditions',
      'Calculate claim payment amounts based on coverage limits',
      'Route complex claims for senior adjuster review'
    ],
    tableName: 'claims_adjudication_records',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'claim_number', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'claim_amount', type: 'DECIMAL(12,2)', nullable: false },
      { name: 'status', type: 'ENUM("filed","under_review","approved","denied","partially_paid","archived")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/claims-adjudication-engine', description: 'File claim', permission: 'claims-adjudication-engine.create', authRequired: true },
      { method: 'GET', path: '/api/v1/claims-adjudication-engine', description: 'List claims', permission: 'claims-adjudication-engine.view', authRequired: true },
      { method: 'GET', path: '/api/v1/claims-adjudication-engine/{id}', description: 'Get claim details', permission: 'claims-adjudication-engine.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/claims-adjudication-engine/{id}', description: 'Update claim', permission: 'claims-adjudication-engine.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/claims-adjudication-engine/{id}', description: 'Close claim', permission: 'claims-adjudication-engine.delete', authRequired: true }
    ],
    services: ['ClaimsAssessmentService', 'PaymentCalculationService'],
    events: ['ClaimFiled', 'ClaimApproved', 'ClaimPaymentProcessed'],
    jobs: ['AdjudicateClaimsJob', 'CalculateClaimPaymentsJob'],
    dependencies: [1],
    tests: ['ClaimsAssessmentTest', 'PaymentCalculationTest']
  }),
  buildModule({
    id: 893,
    name: 'Underwriting Risk Assessor',
    slug: 'underwriting-risk-assessor',
    category: 'Insurance & Actuarial',
    phase: 40,
    iconName: 'Shield',
    purpose: 'Assess and price risk for new and renewal insurance applications.',
    responsibilities: [
      'Evaluate applicant risk profiles using predictive models',
      'Apply pricing algorithms based on risk classification',
      'Generate underwriting recommendations and referral triggers'
    ],
    tableName: 'underwriting_assessments',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'applicant_name', type: 'VARCHAR(255)', nullable: false },
      { name: 'risk_score', type: 'INT', nullable: false },
      { name: 'status', type: 'ENUM("pending","assessed","approved","declined","referred","archived")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/underwriting-risk-assessor', description: 'Submit application', permission: 'underwriting-risk-assessor.create', authRequired: true },
      { method: 'GET', path: '/api/v1/underwriting-risk-assessor', description: 'List assessments', permission: 'underwriting-risk-assessor.view', authRequired: true },
      { method: 'GET', path: '/api/v1/underwriting-risk-assessor/{id}', description: 'Get assessment details', permission: 'underwriting-risk-assessor.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/underwriting-risk-assessor/{id}', description: 'Update assessment', permission: 'underwriting-risk-assessor.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/underwriting-risk-assessor/{id}', description: 'Archive assessment', permission: 'underwriting-risk-assessor.delete', authRequired: true }
    ],
    services: ['RiskAssessmentService', 'PricingModelService'],
    events: ['ApplicationReceived', 'RiskScoreCalculated', 'UnderwritingDecisionMade'],
    jobs: ['AssessUnderwritingRiskJob', 'ApplyPricingModelsJob'],
    dependencies: [1],
    tests: ['RiskAssessmentTest', 'PricingModelTest']
  }),
  buildModule({
    id: 894,
    name: 'Actuarial Model Builder',
    slug: 'actuarial-model-builder',
    category: 'Insurance & Actuarial',
    phase: 40,
    iconName: 'Calculator',
    purpose: 'Build and validate actuarial models for loss reserving, pricing, and capital modeling.',
    responsibilities: [
      'Develop GLM and machine learning pricing models',
      'Validate model accuracy against historical loss experience',
      'Generate model documentation for regulatory review'
    ],
    tableName: 'actuarial_models',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'model_name', type: 'VARCHAR(255)', nullable: false },
      { name: 'model_type', type: 'VARCHAR(64)', nullable: false },
      { name: 'status', type: 'ENUM("development","validated","production","archived")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/actuarial-model-builder', description: 'Create model', permission: 'actuarial-model-builder.create', authRequired: true },
      { method: 'GET', path: '/api/v1/actuarial-model-builder', description: 'List models', permission: 'actuarial-model-builder.view', authRequired: true },
      { method: 'GET', path: '/api/v1/actuarial-model-builder/{id}', description: 'Get model details', permission: 'actuarial-model-builder.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/actuarial-model-builder/{id}', description: 'Update model', permission: 'actuarial-model-builder.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/actuarial-model-builder/{id}', description: 'Archive model', permission: 'actuarial-model-builder.delete', authRequired: true }
    ],
    services: ['ModelDevelopmentService', 'ModelValidationService'],
    events: ['ModelCreated', 'ModelValidated', 'ModelDeployed'],
    jobs: ['DevelopActuarialModelsJob', 'ValidateModelAccuracyJob'],
    dependencies: [1],
    tests: ['ModelDevelopmentTest', 'ModelValidationTest']
  }),
  buildModule({
    id: 895,
    name: 'Insurance Broker Portal',
    slug: 'insurance-broker-portal',
    category: 'Insurance & Actuarial',
    phase: 40,
    iconName: 'Users',
    purpose: 'Provide brokers with a digital portal for quote submission, policy servicing, and commissions.',
    responsibilities: [
      'Enable brokers to submit and track quote requests',
      'Display policy documents and endorsement history',
      'Calculate and report broker commission settlements'
    ],
    tableName: 'broker_portal_records',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'broker_id', type: 'BIGINT UNSIGNED', nullable: false },
      { name: 'transaction_type', type: 'VARCHAR(64)', nullable: false },
      { name: 'status', type: 'ENUM("submitted","in_progress","completed","archived")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/insurance-broker-portal', description: 'Submit request', permission: 'insurance-broker-portal.create', authRequired: true },
      { method: 'GET', path: '/api/v1/insurance-broker-portal', description: 'List requests', permission: 'insurance-broker-portal.view', authRequired: true },
      { method: 'GET', path: '/api/v1/insurance-broker-portal/{id}', description: 'Get request details', permission: 'insurance-broker-portal.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/insurance-broker-portal/{id}', description: 'Update request', permission: 'insurance-broker-portal.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/insurance-broker-portal/{id}', description: 'Archive request', permission: 'insurance-broker-portal.delete', authRequired: true }
    ],
    services: ['BrokerPortalService', 'CommissionCalculationService'],
    events: ['BrokerRequestSubmitted', 'QuoteProvided', 'CommissionSettled'],
    jobs: ['ProcessBrokerRequestsJob', 'CalculateCommissionsJob'],
    dependencies: [1],
    tests: ['BrokerPortalTest', 'CommissionCalculationTest']
  }),
  buildModule({
    id: 896,
    name: 'Reinsurance Treaty Manager',
    slug: 'reinsurance-treaty-manager',
    category: 'Insurance & Actuarial',
    phase: 40,
    iconName: 'Handshake',
    purpose: 'Manage reinsurance treaty agreements, cessions, and recoveries.',
    responsibilities: [
      'Record treaty terms, layers, and participation percentages',
      'Calculate cession amounts for each policy bound',
      'Track reinsurance recoveries and settlements'
    ],
    tableName: 'reinsurance_treaties',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'treaty_name', type: 'VARCHAR(255)', nullable: false },
      { name: 'treaty_type', type: 'ENUM("proportional","non_proportional","excess_of_loss")', nullable: false },
      { name: 'status', type: 'ENUM("active","expired","renegotiated","archived")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/reinsurance-treaty-manager', description: 'Create treaty', permission: 'reinsurance-treaty-manager.create', authRequired: true },
      { method: 'GET', path: '/api/v1/reinsurance-treaty-manager', description: 'List treaties', permission: 'reinsurance-treaty-manager.view', authRequired: true },
      { method: 'GET', path: '/api/v1/reinsurance-treaty-manager/{id}', description: 'Get treaty details', permission: 'reinsurance-treaty-manager.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/reinsurance-treaty-manager/{id}', description: 'Update treaty', permission: 'reinsurance-treaty-manager.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/reinsurance-treaty-manager/{id}', description: 'Archive treaty', permission: 'reinsurance-treaty-manager.delete', authRequired: true }
    ],
    services: ['TreatyManagementService', 'CessionCalculationService'],
    events: ['TreatyCreated', 'CessionCalculated', 'RecoveryProcessed'],
    jobs: ['ManageReinsuranceTreatiesJob', 'CalculateCessionsJob'],
    dependencies: [1],
    tests: ['TreatyManagementTest', 'CessionCalculationTest']
  }),
  buildModule({
    id: 897,
    name: 'Premium Audit & Rating',
    slug: 'premium-audit-rating',
    category: 'Insurance & Actuarial',
    phase: 40,
    iconName: 'DollarSign',
    purpose: 'Calculate and audit insurance premiums based on policy terms and risk characteristics.',
    responsibilities: [
      'Apply rating algorithms to calculate policy premiums',
      'Conduct premium audits on auditable policies',
      'Generate premium debit and credit adjustments'
    ],
    tableName: 'premium_audit_records',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'policy_number', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'premium_amount', type: 'DECIMAL(12,2)', nullable: false },
      { name: 'status', type: 'ENUM("rated","audited","adjusted","finalized","archived")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/premium-audit-rating', description: 'Rate premium', permission: 'premium-audit-rating.create', authRequired: true },
      { method: 'GET', path: '/api/v1/premium-audit-rating', description: 'List records', permission: 'premium-audit-rating.view', authRequired: true },
      { method: 'GET', path: '/api/v1/premium-audit-rating/{id}', description: 'Get record details', permission: 'premium-audit-rating.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/premium-audit-rating/{id}', description: 'Update record', permission: 'premium-audit-rating.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/premium-audit-rating/{id}', description: 'Archive record', permission: 'premium-audit-rating.delete', authRequired: true }
    ],
    services: ['PremiumRatingService', 'PremiumAuditService'],
    events: ['PremiumRated', 'AuditCompleted', 'PremiumAdjusted'],
    jobs: ['CalculatePremiumRatingsJob', 'ConductPremiumAuditsJob'],
    dependencies: [1],
    tests: ['PremiumRatingTest', 'PremiumAuditTest']
  }),
  buildModule({
    id: 898,
    name: 'Loss Run Report Generator',
    slug: 'loss-run-report-generator',
    category: 'Insurance & Actuarial',
    phase: 40,
    iconName: 'FileBarChart',
    purpose: 'Generate loss run reports showing claims history for insured entities.',
    responsibilities: [
      'Compile claims history by policy period and coverage line',
      'Calculate loss ratios and claim frequency metrics',
      'Generate loss run documents for policy renewal and prospects'
    ],
    tableName: 'loss_run_reports',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'insured_name', type: 'VARCHAR(255)', nullable: false },
      { name: 'report_period', type: 'VARCHAR(32)', nullable: false },
      { name: 'status', type: 'ENUM("generating","completed","delivered","archived")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/loss-run-report-generator', description: 'Generate report', permission: 'loss-run-report-generator.create', authRequired: true },
      { method: 'GET', path: '/api/v1/loss-run-report-generator', description: 'List reports', permission: 'loss-run-report-generator.view', authRequired: true },
      { method: 'GET', path: '/api/v1/loss-run-report-generator/{id}', description: 'Get report details', permission: 'loss-run-report-generator.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/loss-run-report-generator/{id}', description: 'Update report', permission: 'loss-run-report-generator.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/loss-run-report-generator/{id}', description: 'Archive report', permission: 'loss-run-report-generator.delete', authRequired: true }
    ],
    services: ['LossRunService', 'LossRatioCalculationService'],
    events: ['ReportGenerated', 'LossRunDelivered', 'LossRatioCalculated'],
    jobs: ['GenerateLossRunReportsJob', 'CalculateLossRatiosJob'],
    dependencies: [1],
    tests: ['LossRunTest', 'LossRatioCalculationTest']
  }),
  buildModule({
    id: 899,
    name: 'Fraud Detection Engine',
    slug: 'fraud-detection-engine',
    category: 'Insurance & Actuarial',
    phase: 40,
    iconName: 'AlertTriangle',
    purpose: 'Detect potentially fraudulent insurance claims using pattern analysis and anomaly detection.',
    responsibilities: [
      'Score claims on fraud risk using predictive models',
      'Identify suspicious claim patterns and provider networks',
      'Route flagged claims for special investigation'
    ],
    tableName: 'fraud_detection_records',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'claim_number', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'fraud_score', type: 'INT', nullable: false },
      { name: 'status', type: 'ENUM("flagged","investigating","confirmed","cleared","archived")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/fraud-detection-engine', description: 'Flag claim', permission: 'fraud-detection-engine.create', authRequired: true },
      { method: 'GET', path: '/api/v1/fraud-detection-engine', description: 'List flags', permission: 'fraud-detection-engine.view', authRequired: true },
      { method: 'GET', path: '/api/v1/fraud-detection-engine/{id}', description: 'Get flag details', permission: 'fraud-detection-engine.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/fraud-detection-engine/{id}', description: 'Update flag', permission: 'fraud-detection-engine.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/fraud-detection-engine/{id}', description: 'Archive flag', permission: 'fraud-detection-engine.delete', authRequired: true }
    ],
    services: ['FraudScoringService', 'InvestigationRoutingService'],
    events: ['ClaimFlagged', 'FraudConfirmed', 'InvestigationCompleted'],
    jobs: ['ScoreClaimsForFraudJob', 'RouteFlaggedClaimsJob'],
    dependencies: [1],
    tests: ['FraudScoringTest', 'InvestigationRoutingTest']
  }),
  buildModule({
    id: 900,
    name: 'Insurance Document Vault',
    slug: 'insurance-document-vault',
    category: 'Insurance & Actuarial',
    phase: 40,
    iconName: 'Lock',
    purpose: 'Securely store and retrieve insurance documents including policies, claims, and correspondence.',
    responsibilities: [
      'Index and store policy, claim, and correspondence documents',
      'Provide full-text search across document repositories',
      'Enforce document retention policies and access controls'
    ],
    tableName: 'insurance_documents',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'document_type', type: 'VARCHAR(64)', nullable: false },
      { name: 'file_name', type: 'VARCHAR(255)', nullable: false },
      { name: 'status', type: 'ENUM("indexed","archived","retention_expired","archived")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/insurance-document-vault', description: 'Upload document', permission: 'insurance-document-vault.create', authRequired: true },
      { method: 'GET', path: '/api/v1/insurance-document-vault', description: 'List documents', permission: 'insurance-document-vault.view', authRequired: true },
      { method: 'GET', path: '/api/v1/insurance-document-vault/{id}', description: 'Get document details', permission: 'insurance-document-vault.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/insurance-document-vault/{id}', description: 'Update document', permission: 'insurance-document-vault.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/insurance-document-vault/{id}', description: 'Archive document', permission: 'insurance-document-vault.delete', authRequired: true }
    ],
    services: ['DocumentStorageService', 'DocumentSearchService'],
    events: ['DocumentUploaded', 'DocumentIndexed', 'RetentionExpiry'],
    jobs: ['IndexDocumentsJob', 'EnforceRetentionPoliciesJob'],
    dependencies: [1],
    tests: ['DocumentStorageTest', 'DocumentSearchTest']
  }),
  buildModule({
    id: 901,
    name: 'Actuarial Reserve Calculator',
    slug: 'actuarial-reserve-calculator',
    category: 'Insurance & Actuarial',
    phase: 40,
    iconName: 'Calculator',
    purpose: 'Calculate actuarial reserves for outstanding claims and unearned premiums.',
    responsibilities: [
      'Compute IBNR reserves using chain-ladder and Bornhuetter-Ferguson methods',
      'Calculate unearned premium reserves by policy',
      'Generate reserve triangles and development analyses'
    ],
    tableName: 'actuarial_reserve_records',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'reserve_type', type: 'ENUM("ibnr","upr","outstanding","total")', nullable: false },
      { name: 'reserve_amount', type: 'DECIMAL(14,2)', nullable: false },
      { name: 'status', type: 'ENUM("calculated","validated","reported","archived")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/actuarial-reserve-calculator', description: 'Calculate reserve', permission: 'actuarial-reserve-calculator.create', authRequired: true },
      { method: 'GET', path: '/api/v1/actuarial-reserve-calculator', description: 'List calculations', permission: 'actuarial-reserve-calculator.view', authRequired: true },
      { method: 'GET', path: '/api/v1/actuarial-reserve-calculator/{id}', description: 'Get calculation details', permission: 'actuarial-reserve-calculator.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/actuarial-reserve-calculator/{id}', description: 'Update calculation', permission: 'actuarial-reserve-calculator.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/actuarial-reserve-calculator/{id}', description: 'Archive calculation', permission: 'actuarial-reserve-calculator.delete', authRequired: true }
    ],
    services: ['ReserveCalculationService', 'DevelopmentAnalysisService'],
    events: ['ReserveCalculated', 'ReserveValidated', 'DevelopmentTriangleGenerated'],
    jobs: ['CalculateActuarialReservesJob', 'GenerateDevelopmentTrianglesJob'],
    dependencies: [1],
    tests: ['ReserveCalculationTest', 'DevelopmentAnalysisTest']
  }),
  buildModule({
    id: 902,
    name: 'Policy Renewal Tracker',
    slug: 'policy-renewal-tracker',
    category: 'Insurance & Actuarial',
    phase: 40,
    iconName: 'RefreshCw',
    purpose: 'Track and manage insurance policy renewal workflows and retention analytics.',
    responsibilities: [
      'Monitor upcoming policy renewal dates and expirations',
      'Trigger renewal offers and underwriting reviews',
      'Analyze retention rates and lapse patterns'
    ],
    tableName: 'policy_renewals',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'policy_number', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'renewal_premium', type: 'DECIMAL(12,2)', nullable: true },
      { name: 'status', type: 'ENUM("upcoming","renewed","lapsed","declined","archived")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/policy-renewal-tracker', description: 'Track renewal', permission: 'policy-renewal-tracker.create', authRequired: true },
      { method: 'GET', path: '/api/v1/policy-renewal-tracker', description: 'List renewals', permission: 'policy-renewal-tracker.view', authRequired: true },
      { method: 'GET', path: '/api/v1/policy-renewal-tracker/{id}', description: 'Get renewal details', permission: 'policy-renewal-tracker.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/policy-renewal-tracker/{id}', description: 'Update renewal', permission: 'policy-renewal-tracker.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/policy-renewal-tracker/{id}', description: 'Archive renewal', permission: 'policy-renewal-tracker.delete', authRequired: true }
    ],
    services: ['RenewalTrackingService', 'RetentionAnalyticsService'],
    events: ['RenewalTriggered', 'RenewalOffered', 'PolicyRenewed'],
    jobs: ['MonitorRenewalDatesJob', 'AnalyzeRetentionRatesJob'],
    dependencies: [1],
    tests: ['RenewalTrackingTest', 'RetentionAnalyticsTest']
  }),
  buildModule({
    id: 903,
    name: 'Claims Subrogation Manager',
    slug: 'claims-subrogation-manager',
    category: 'Insurance & Actuarial',
    phase: 40,
    iconName: 'ArrowRightLeft',
    purpose: 'Manage subrogation recovery actions against responsible third parties.',
    responsibilities: [
      'Identify subrogation potential from settled claims',
      'Coordinate with legal counsel on recovery actions',
      'Track recovery amounts and success rates'
    ],
    tableName: 'subrogation_records',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'claim_number', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'recovery_amount', type: 'DECIMAL(12,2)', nullable: true },
      { name: 'status', type: 'ENUM("identified","pursuing","settled","unsuccessful","archived")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/claims-subrogation-manager', description: 'Identify subrogation', permission: 'claims-subrogation-manager.create', authRequired: true },
      { method: 'GET', path: '/api/v1/claims-subrogation-manager', description: 'List records', permission: 'claims-subrogation-manager.view', authRequired: true },
      { method: 'GET', path: '/api/v1/claims-subrogation-manager/{id}', description: 'Get record details', permission: 'claims-subrogation-manager.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/claims-subrogation-manager/{id}', description: 'Update record', permission: 'claims-subrogation-manager.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/claims-subrogation-manager/{id}', description: 'Archive record', permission: 'claims-subrogation-manager.delete', authRequired: true }
    ],
    services: ['SubrogationIdentificationService', 'RecoveryTrackingService'],
    events: ['SubrogationIdentified', 'RecoveryActionStarted', 'RecoverySettled'],
    jobs: ['IdentifySubrogationOpportunitiesJob', 'TrackRecoveryActionsJob'],
    dependencies: [1],
    tests: ['SubrogationIdentificationTest', 'RecoveryTrackingTest']
  }),
  buildModule({
    id: 904,
    name: 'Insurance Rate Filing',
    slug: 'insurance-rate-filing',
    category: 'Insurance & Actuarial',
    phase: 40,
    iconName: 'Send',
    purpose: 'Prepare and submit insurance rate filings to state regulatory agencies.',
    responsibilities: [
      'Prepare rate filing packages with actuarial justification',
      'Submit filings to state departments of insurance',
      'Track filing approvals, objections, and withdrawal status'
    ],
    tableName: 'rate_filings',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'state_code', type: 'VARCHAR(8)', nullable: false },
      { name: 'line_of_business', type: 'VARCHAR(64)', nullable: false },
      { name: 'status', type: 'ENUM("draft","submitted","under_review","approved","objection","withdrawn","archived")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/insurance-rate-filing', description: 'Create filing', permission: 'insurance-rate-filing.create', authRequired: true },
      { method: 'GET', path: '/api/v1/insurance-rate-filing', description: 'List filings', permission: 'insurance-rate-filing.view', authRequired: true },
      { method: 'GET', path: '/api/v1/insurance-rate-filing/{id}', description: 'Get filing details', permission: 'insurance-rate-filing.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/insurance-rate-filing/{id}', description: 'Update filing', permission: 'insurance-rate-filing.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/insurance-rate-filing/{id}', description: 'Archive filing', permission: 'insurance-rate-filing.delete', authRequired: true }
    ],
    services: ['RateFilingService', 'RegulatorySubmissionService'],
    events: ['FilingCreated', 'FilingSubmitted', 'FilingApproved'],
    jobs: ['PrepareRateFilingsJob', 'TrackFilingStatusJob'],
    dependencies: [1],
    tests: ['RateFilingTest', 'RegulatorySubmissionTest']
  }),
  buildModule({
    id: 905,
    name: 'Catastrophe Model Simulator',
    slug: 'catastrophe-model-simulator',
    category: 'Insurance & Actuarial',
    phase: 40,
    iconName: 'CloudLightning',
    purpose: 'Simulate catastrophe scenarios for hurricane, earthquake, and wildfire risk assessment.',
    responsibilities: [
      'Run stochastic catastrophe event simulations',
      'Estimate insured losses per event and annual aggregate',
      'Assess portfolio concentration and accumulation risk'
    ],
    tableName: 'catastrophe_simulations',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'hazard_type', type: 'VARCHAR(64)', nullable: false },
      { name: 'estimated_loss', type: 'DECIMAL(14,2)', nullable: false },
      { name: 'status', type: 'ENUM("simulated","validated","reported","archived")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/catastrophe-model-simulator', description: 'Run simulation', permission: 'catastrophe-model-simulator.create', authRequired: true },
      { method: 'GET', path: '/api/v1/catastrophe-model-simulator', description: 'List simulations', permission: 'catastrophe-model-simulator.view', authRequired: true },
      { method: 'GET', path: '/api/v1/catastrophe-model-simulator/{id}', description: 'Get simulation details', permission: 'catastrophe-model-simulator.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/catastrophe-model-simulator/{id}', description: 'Update simulation', permission: 'catastrophe-model-simulator.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/catastrophe-model-simulator/{id}', description: 'Archive simulation', permission: 'catastrophe-model-simulator.delete', authRequired: true }
    ],
    services: ['CatastropheSimulationService', 'LossEstimationService'],
    events: ['SimulationRun', 'LossEstimated', 'RiskReportGenerated'],
    jobs: ['RunCatastropheSimulationsJob', 'EstimatePortfolioLossJob'],
    dependencies: [1],
    tests: ['CatastropheSimulationTest', 'LossEstimationTest']
  }),
  buildModule({
    id: 906,
    name: 'Agent Commission Tracker',
    slug: 'agent-commission-tracker',
    category: 'Insurance & Actuarial',
    phase: 40,
    iconName: 'Percent',
    purpose: 'Track and calculate insurance agent commissions on policies sold and renewals.',
    responsibilities: [
      'Calculate commissions based on premium volume and policy type',
      'Track commission schedules and override agreements',
      'Generate commission statements for agents'
    ],
    tableName: 'agent_commissions',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'agent_id', type: 'BIGINT UNSIGNED', nullable: false },
      { name: 'commission_amount', type: 'DECIMAL(10,2)', nullable: false },
      { name: 'status', type: 'ENUM("calculated","pending_payment","paid","archived")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/agent-commission-tracker', description: 'Record commission', permission: 'agent-commission-tracker.create', authRequired: true },
      { method: 'GET', path: '/api/v1/agent-commission-tracker', description: 'List commissions', permission: 'agent-commission-tracker.view', authRequired: true },
      { method: 'GET', path: '/api/v1/agent-commission-tracker/{id}', description: 'Get commission details', permission: 'agent-commission-tracker.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/agent-commission-tracker/{id}', description: 'Update commission', permission: 'agent-commission-tracker.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/agent-commission-tracker/{id}', description: 'Archive commission', permission: 'agent-commission-tracker.delete', authRequired: true }
    ],
    services: ['CommissionCalculationService', 'CommissionStatementService'],
    events: ['CommissionCalculated', 'CommissionStatementGenerated', 'CommissionPaid'],
    jobs: ['CalculateAgentCommissionsJob', 'GenerateCommissionStatementsJob'],
    dependencies: [1],
    tests: ['CommissionCalculationTest', 'CommissionStatementTest']
  }),
  buildModule({
    id: 907,
    name: 'Insurance Compliance Reporter',
    slug: 'insurance-compliance-reporter',
    category: 'Insurance & Actuarial',
    phase: 40,
    iconName: 'ClipboardCheck',
    purpose: 'Generate regulatory compliance reports for insurance departments and auditors.',
    responsibilities: [
      'Compile statutory financial and operational data',
      'Generate annual statement and quarterly filings',
      'Track regulatory examination findings and responses'
    ],
    tableName: 'compliance_reports',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'report_type', type: 'VARCHAR(64)', nullable: false },
      { name: 'filing_period', type: 'VARCHAR(32)', nullable: false },
      { name: 'status', type: 'ENUM("draft","submitted","accepted","archived")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/insurance-compliance-reporter', description: 'Create report', permission: 'insurance-compliance-reporter.create', authRequired: true },
      { method: 'GET', path: '/api/v1/insurance-compliance-reporter', description: 'List reports', permission: 'insurance-compliance-reporter.view', authRequired: true },
      { method: 'GET', path: '/api/v1/insurance-compliance-reporter/{id}', description: 'Get report details', permission: 'insurance-compliance-reporter.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/insurance-compliance-reporter/{id}', description: 'Update report', permission: 'insurance-compliance-reporter.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/insurance-compliance-reporter/{id}', description: 'Archive report', permission: 'insurance-compliance-reporter.delete', authRequired: true }
    ],
    services: ['ComplianceReportingService', 'RegulatoryFilingService'],
    events: ['ReportGenerated', 'FilingSubmitted', 'ExaminationTracked'],
    jobs: ['GenerateComplianceReportsJob', 'SubmitRegulatoryFilingsJob'],
    dependencies: [1],
    tests: ['ComplianceReportingTest', 'RegulatoryFilingTest']
  }),
  buildModule({
    id: 908,
    name: 'Life Insurance Policy Tracker',
    slug: 'life-insurance-policy-tracker',
    category: 'Insurance & Actuarial',
    phase: 40,
    iconName: 'Heart',
    purpose: 'Track life insurance policies including premiums, cash values, and beneficiary records.',
    responsibilities: [
      'Monitor premium payment schedules and grace periods',
      'Calculate cash surrender values and policy loans',
      'Manage beneficiary designations and claim notifications'
    ],
    tableName: 'life_insurance_policies',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'policy_number', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'face_amount', type: 'DECIMAL(12,2)', nullable: false },
      { name: 'status', type: 'ENUM("active","lapsed","surrendered","matured","death_claim","archived")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/life-insurance-policy-tracker', description: 'Record policy', permission: 'life-insurance-policy-tracker.create', authRequired: true },
      { method: 'GET', path: '/api/v1/life-insurance-policy-tracker', description: 'List policies', permission: 'life-insurance-policy-tracker.view', authRequired: true },
      { method: 'GET', path: '/api/v1/life-insurance-policy-tracker/{id}', description: 'Get policy details', permission: 'life-insurance-policy-tracker.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/life-insurance-policy-tracker/{id}', description: 'Update policy', permission: 'life-insurance-policy-tracker.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/life-insurance-policy-tracker/{id}', description: 'Archive policy', permission: 'life-insurance-policy-tracker.delete', authRequired: true }
    ],
    services: ['LifePolicyService', 'CashValueCalculationService'],
    events: ['PolicyTracked', 'PremiumDue', 'DeathClaimFiled'],
    jobs: ['MonitorPremiumPaymentsJob', 'CalculateCashValuesJob'],
    dependencies: [1],
    tests: ['LifePolicyTest', 'CashValueCalculationTest']
  }),
  buildModule({
    id: 909,
    name: 'Health Claims Processor',
    slug: 'health-claims-processor',
    category: 'Insurance & Actuarial',
    phase: 40,
    iconName: 'HeartPulse',
    purpose: 'Process and adjudicate health insurance claims including medical and dental.',
    responsibilities: [
      'Adjudicate medical claims against plan benefits and fee schedules',
      'Coordinate benefits across primary and secondary payers',
      'Process Explanation of Benefits (EOB) for members'
    ],
    tableName: 'health_claims',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'claim_number', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'billed_amount', type: 'DECIMAL(10,2)', nullable: false },
      { name: 'status', type: 'ENUM("received","adjudicated","paid","denied","appealed","archived")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/health-claims-processor', description: 'Submit claim', permission: 'health-claims-processor.create', authRequired: true },
      { method: 'GET', path: '/api/v1/health-claims-processor', description: 'List claims', permission: 'health-claims-processor.view', authRequired: true },
      { method: 'GET', path: '/api/v1/health-claims-processor/{id}', description: 'Get claim details', permission: 'health-claims-processor.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/health-claims-processor/{id}', description: 'Update claim', permission: 'health-claims-processor.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/health-claims-processor/{id}', description: 'Archive claim', permission: 'health-claims-processor.delete', authRequired: true }
    ],
    services: ['HealthClaimsAdjudicationService', 'CoordinationOfBenefitsService'],
    events: ['ClaimReceived', 'ClaimAdjudicated', 'EobGenerated'],
    jobs: ['ProcessHealthClaimsJob', 'CoordinateBenefitsJob'],
    dependencies: [1],
    tests: ['HealthClaimsAdjudicationTest', 'CoordinationOfBenefitsTest']
  }),
  buildModule({
    id: 910,
    name: 'Property Insurance Inspector',
    slug: 'property-insurance-inspector',
    category: 'Insurance & Actuarial',
    phase: 40,
    iconName: 'Home',
    purpose: 'Schedule and manage property inspections for underwriting and loss control.',
    responsibilities: [
      'Schedule property inspections based on risk tier',
      'Record inspection findings and hazard observations',
      'Generate inspection reports for underwriting decisions'
    ],
    tableName: 'property_inspections',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'property_address', type: 'VARCHAR(255)', nullable: false },
      { name: 'inspection_score', type: 'INT', nullable: true },
      { name: 'status', type: 'ENUM("scheduled","in_progress","completed","archived")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/property-insurance-inspector', description: 'Schedule inspection', permission: 'property-insurance-inspector.create', authRequired: true },
      { method: 'GET', path: '/api/v1/property-insurance-inspector', description: 'List inspections', permission: 'property-insurance-inspector.view', authRequired: true },
      { method: 'GET', path: '/api/v1/property-insurance-inspector/{id}', description: 'Get inspection details', permission: 'property-insurance-inspector.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/property-insurance-inspector/{id}', description: 'Update inspection', permission: 'property-insurance-inspector.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/property-insurance-inspector/{id}', description: 'Archive inspection', permission: 'property-insurance-inspector.delete', authRequired: true }
    ],
    services: ['InspectionSchedulingService', 'LossControlService'],
    events: ['InspectionScheduled', 'InspectionCompleted', 'HazardReported'],
    jobs: ['SchedulePropertyInspectionsJob', 'GenerateInspectionReportsJob'],
    dependencies: [1],
    tests: ['InspectionSchedulingTest', 'LossControlTest']
  }),
  buildModule({
    id: 911,
    name: 'Auto Claims Adjudicator',
    slug: 'auto-claims-adjudicator',
    category: 'Insurance & Actuarial',
    phase: 40,
    iconName: 'Car',
    purpose: 'Process and adjudicate auto insurance claims for collision, liability, and comprehensive.',
    responsibilities: [
      'Assess auto claims with damage estimates and liability determination',
      'Coordinate with repair shops and rental car providers',
      'Process total loss valuations and salvage titles'
    ],
    tableName: 'auto_claims',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'claim_number', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'damage_estimate', type: 'DECIMAL(10,2)', nullable: false },
      { name: 'status', type: 'ENUM("filed","inspecting","repairing","total_loss","closed","archived")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/auto-claims-adjudicator', description: 'File claim', permission: 'auto-claims-adjudicator.create', authRequired: true },
      { method: 'GET', path: '/api/v1/auto-claims-adjudicator', description: 'List claims', permission: 'auto-claims-adjudicator.view', authRequired: true },
      { method: 'GET', path: '/api/v1/auto-claims-adjudicator/{id}', description: 'Get claim details', permission: 'auto-claims-adjudicator.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/auto-claims-adjudicator/{id}', description: 'Update claim', permission: 'auto-claims-adjudicator.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/auto-claims-adjudicator/{id}', description: 'Close claim', permission: 'auto-claims-adjudicator.delete', authRequired: true }
    ],
    services: ['AutoClaimsService', 'DamageEstimationService'],
    events: ['AutoClaimFiled', 'DamageAssessed', 'ClaimSettled'],
    jobs: ['ProcessAutoClaimsJob', 'CoordinateRepairsJob'],
    dependencies: [1],
    tests: ['AutoClaimsTest', 'DamageEstimationTest']
  }),
  buildModule({
    id: 912,
    name: 'Liability Coverage Analyzer',
    slug: 'liability-coverage-analyzer',
    category: 'Insurance & Actuarial',
    phase: 40,
    iconName: 'Shield',
    purpose: 'Analyze liability coverage adequacy and recommend limits for commercial clients.',
    responsibilities: [
      'Evaluate current liability limits against exposure analysis',
      'Recommend coverage adjustments based on industry benchmarks',
      'Track umbrella and excess liability program status'
    ],
    tableName: 'liability_coverage_records',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'client_name', type: 'VARCHAR(255)', nullable: false },
      { name: 'current_limit', type: 'DECIMAL(12,2)', nullable: false },
      { name: 'status', type: 'ENUM("under_review","adequate","inadequate","archived")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/liability-coverage-analyzer', description: 'Create analysis', permission: 'liability-coverage-analyzer.create', authRequired: true },
      { method: 'GET', path: '/api/v1/liability-coverage-analyzer', description: 'List analyses', permission: 'liability-coverage-analyzer.view', authRequired: true },
      { method: 'GET', path: '/api/v1/liability-coverage-analyzer/{id}', description: 'Get analysis details', permission: 'liability-coverage-analyzer.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/liability-coverage-analyzer/{id}', description: 'Update analysis', permission: 'liability-coverage-analyzer.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/liability-coverage-analyzer/{id}', description: 'Archive analysis', permission: 'liability-coverage-analyzer.delete', authRequired: true }
    ],
    services: ['CoverageAnalysisService', 'ExposureAssessmentService'],
    events: ['AnalysisCreated', 'CoverageRecommendationGenerated', 'UmbrellaTracked'],
    jobs: ['AnalyzeLiabilityCoverageJob', 'RecommendCoverageLimitsJob'],
    dependencies: [1],
    tests: ['CoverageAnalysisTest', 'ExposureAssessmentTest']
  }),
  buildModule({
    id: 913,
    name: 'Insurance Lead Distributor',
    slug: 'insurance-lead-distributor',
    category: 'Insurance & Actuarial',
    phase: 40,
    iconName: 'Share2',
    purpose: 'Distribute and route insurance leads to agents based on territory and specialization.',
    responsibilities: [
      'Receive inbound leads from web, referrals, and marketing',
      'Match leads to agents by territory, expertise, and capacity',
      'Track lead conversion rates and agent performance'
    ],
    tableName: 'insurance_leads',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'lead_source', type: 'VARCHAR(64)', nullable: false },
      { name: 'assigned_agent_id', type: 'BIGINT UNSIGNED', nullable: true },
      { name: 'status', type: 'ENUM("new","assigned","contacted","converted","expired","archived")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/insurance-lead-distributor', description: 'Submit lead', permission: 'insurance-lead-distributor.create', authRequired: true },
      { method: 'GET', path: '/api/v1/insurance-lead-distributor', description: 'List leads', permission: 'insurance-lead-distributor.view', authRequired: true },
      { method: 'GET', path: '/api/v1/insurance-lead-distributor/{id}', description: 'Get lead details', permission: 'insurance-lead-distributor.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/insurance-lead-distributor/{id}', description: 'Update lead', permission: 'insurance-lead-distributor.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/insurance-lead-distributor/{id}', description: 'Archive lead', permission: 'insurance-lead-distributor.delete', authRequired: true }
    ],
    services: ['LeadRoutingService', 'LeadConversionService'],
    events: ['LeadReceived', 'LeadAssigned', 'LeadConverted'],
    jobs: ['RouteInsuranceLeadsJob', 'TrackLeadConversionJob'],
    dependencies: [1],
    tests: ['LeadRoutingTest', 'LeadConversionTest']
  }),
  buildModule({
    id: 914,
    name: 'Policy Endorsement Manager',
    slug: 'policy-endorsement-manager',
    category: 'Insurance & Actuarial',
    phase: 40,
    iconName: 'Edit',
    purpose: 'Manage policy endorsements, mid-term adjustments, and coverage changes.',
    responsibilities: [
      'Process endorsement requests from policyholders and brokers',
      'Calculate premium adjustments for coverage changes',
      'Issue endorsement documents and update policy records'
    ],
    tableName: 'policy_endorsements',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'policy_number', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'endorsement_type', type: 'VARCHAR(64)', nullable: false },
      { name: 'status', type: 'ENUM("requested","processing","effective","declined","archived")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/policy-endorsement-manager', description: 'Request endorsement', permission: 'policy-endorsement-manager.create', authRequired: true },
      { method: 'GET', path: '/api/v1/policy-endorsement-manager', description: 'List endorsements', permission: 'policy-endorsement-manager.view', authRequired: true },
      { method: 'GET', path: '/api/v1/policy-endorsement-manager/{id}', description: 'Get endorsement details', permission: 'policy-endorsement-manager.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/policy-endorsement-manager/{id}', description: 'Update endorsement', permission: 'policy-endorsement-manager.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/policy-endorsement-manager/{id}', description: 'Archive endorsement', permission: 'policy-endorsement-manager.delete', authRequired: true }
    ],
    services: ['EndorsementProcessingService', 'PremiumAdjustmentService'],
    events: ['EndorsementRequested', 'EndorsementEffective', 'PremiumAdjusted'],
    jobs: ['ProcessEndorsementsJob', 'CalculatePremiumAdjustmentsJob'],
    dependencies: [1],
    tests: ['EndorsementProcessingTest', 'PremiumAdjustmentTest']
  }),
  buildModule({
    id: 915,
    name: 'Actuarial Experience Study',
    slug: 'actuarial-experience-study',
    category: 'Insurance & Actuarial',
    phase: 40,
    iconName: 'BarChart2',
    purpose: 'Conduct actuarial experience studies to analyze loss development and pricing adequacy.',
    responsibilities: [
      'Compile historical loss and premium data for study periods',
      'Analyze loss frequency and severity trends by coverage class',
      'Recommend rate level changes based on indicated vs target ratios'
    ],
    tableName: 'experience_studies',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'study_name', type: 'VARCHAR(255)', nullable: false },
      { name: 'study_period', type: 'VARCHAR(32)', nullable: false },
      { name: 'status', type: 'ENUM("in_progress","completed","archived")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/actuarial-experience-study', description: 'Create study', permission: 'actuarial-experience-study.create', authRequired: true },
      { method: 'GET', path: '/api/v1/actuarial-experience-study', description: 'List studies', permission: 'actuarial-experience-study.view', authRequired: true },
      { method: 'GET', path: '/api/v1/actuarial-experience-study/{id}', description: 'Get study details', permission: 'actuarial-experience-study.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/actuarial-experience-study/{id}', description: 'Update study', permission: 'actuarial-experience-study.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/actuarial-experience-study/{id}', description: 'Archive study', permission: 'actuarial-experience-study.delete', authRequired: true }
    ],
    services: ['ExperienceStudyService', 'LossTrendAnalysisService'],
    events: ['StudyCreated', 'LossTrendsAnalyzed', 'RateRecommendationGenerated'],
    jobs: ['ConductExperienceStudyJob', 'AnalyzeLossTrendsJob'],
    dependencies: [1],
    tests: ['ExperienceStudyTest', 'LossTrendAnalysisTest']
  })
];
