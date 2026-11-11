import { buildModule } from './moduleBuilderHelper';

export const modulesDomain38 = [
  buildModule({
    id: 841,
    name: 'Vessel Tracking & AIS Monitor',
    slug: 'vessel-tracking-ais-monitor',
    category: 'Maritime & Shipping',
    phase: 38,
    iconName: 'Navigation',
    purpose: 'Track vessel positions via AIS data and monitor fleet movements in real time.',
    responsibilities: [
      'Ingest and display AIS position reports on a live map',
      'Alert on deviations from planned voyage routes',
      'Archive historical track data for voyage analysis'
    ],
    tableName: 'vessel_tracking_records',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'imo_number', type: 'VARCHAR(16)', nullable: false, index: true },
      { name: 'latitude', type: 'DECIMAL(10,7)', nullable: false },
      { name: 'status', type: 'ENUM("underway","at_anchor","moored","inactive","archived")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/vessel-tracking-ais-monitor', description: 'Record position', permission: 'vessel-tracking-ais-monitor.create', authRequired: true },
      { method: 'GET', path: '/api/v1/vessel-tracking-ais-monitor', description: 'List positions', permission: 'vessel-tracking-ais-monitor.view', authRequired: true },
      { method: 'GET', path: '/api/v1/vessel-tracking-ais-monitor/{id}', description: 'Get position details', permission: 'vessel-tracking-ais-monitor.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/vessel-tracking-ais-monitor/{id}', description: 'Update position', permission: 'vessel-tracking-ais-monitor.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/vessel-tracking-ais-monitor/{id}', description: 'Archive record', permission: 'vessel-tracking-ais-monitor.delete', authRequired: true }
    ],
    services: ['AisIngestionService', 'VesselTrackingService'],
    events: ['PositionRecorded', 'RouteDeviationDetected', 'VesselAlertTriggered'],
    jobs: ['IngestAisPositionsJob', 'MonitorRouteDeviationsJob'],
    dependencies: [1],
    tests: ['AisIngestionTest', 'VesselTrackingTest']
  }),
  buildModule({
    id: 842,
    name: 'Port Terminal Operations',
    slug: 'port-terminal-operations',
    category: 'Maritime & Shipping',
    phase: 38,
    iconName: 'Anchor',
    purpose: 'Manage berth allocation, quay crane operations, and yard logistics at port terminals.',
    responsibilities: [
      'Allocate berths based on vessel size and cargo type',
      'Coordinate quay crane scheduling and productivity',
      'Track container yard utilization and movement'
    ],
    tableName: 'port_terminal_operations',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'berth_id', type: 'VARCHAR(32)', nullable: false },
      { name: 'vessel_name', type: 'VARCHAR(255)', nullable: false },
      { name: 'status', type: 'ENUM("scheduled","in_progress","completed","delayed","archived")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/port-terminal-operations', description: 'Schedule operation', permission: 'port-terminal-operations.create', authRequired: true },
      { method: 'GET', path: '/api/v1/port-terminal-operations', description: 'List operations', permission: 'port-terminal-operations.view', authRequired: true },
      { method: 'GET', path: '/api/v1/port-terminal-operations/{id}', description: 'Get operation details', permission: 'port-terminal-operations.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/port-terminal-operations/{id}', description: 'Update operation', permission: 'port-terminal-operations.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/port-terminal-operations/{id}', description: 'Archive operation', permission: 'port-terminal-operations.delete', authRequired: true }
    ],
    services: ['BerthAllocationService', 'CraneSchedulingService'],
    events: ['BerthAllocated', 'CraneOperationStarted', 'YardMovementTracked'],
    jobs: ['AllocateBerthsJob', 'ScheduleCraneOperationsJob'],
    dependencies: [1],
    tests: ['BerthAllocationTest', 'CraneSchedulingTest']
  }),
  buildModule({
    id: 843,
    name: 'Container Stowage Planner',
    slug: 'container-stowage-planner',
    category: 'Maritime & Shipping',
    phase: 38,
    iconName: 'Box',
    purpose: 'Optimize container stowage plans for vessel stability and port sequence efficiency.',
    responsibilities: [
      'Generate stowage plans based on weight distribution rules',
      'Account for hazardous cargo segregation requirements',
      'Minimize restow and rehandle moves at subsequent ports'
    ],
    tableName: 'container_stowage_plans',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'vessel_name', type: 'VARCHAR(255)', nullable: false },
      { name: 'voyage_number', type: 'VARCHAR(32)', nullable: false },
      { name: 'status', type: 'ENUM("draft","locked","executing","completed","archived")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/container-stowage-planner', description: 'Create stowage plan', permission: 'container-stowage-planner.create', authRequired: true },
      { method: 'GET', path: '/api/v1/container-stowage-planner', description: 'List plans', permission: 'container-stowage-planner.view', authRequired: true },
      { method: 'GET', path: '/api/v1/container-stowage-planner/{id}', description: 'Get plan details', permission: 'container-stowage-planner.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/container-stowage-planner/{id}', description: 'Update plan', permission: 'container-stowage-planner.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/container-stowage-planner/{id}', description: 'Archive plan', permission: 'container-stowage-planner.delete', authRequired: true }
    ],
    services: ['StowagePlanningService', 'StabilityCalculationService'],
    events: ['StowagePlanCreated', 'PlanLocked', 'StabilityWarningRaised'],
    jobs: ['GenerateStowagePlanJob', 'ValidateStabilityJob'],
    dependencies: [1],
    tests: ['StowagePlanningTest', 'StabilityCalculationTest']
  }),
  buildModule({
    id: 844,
    name: 'Maritime Crew Management',
    slug: 'maritime-crew-management',
    category: 'Maritime & Shipping',
    phase: 38,
    iconName: 'Users',
    purpose: 'Manage seafarer certifications, watches, and voyage crew assignments.',
    responsibilities: [
      'Track STCW certification validity and flag state requirements',
      'Generate voyage crew rosters with watch schedules',
      'Manage crew changes at port call locations'
    ],
    tableName: 'maritime_crew_records',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'seafarer_name', type: 'VARCHAR(255)', nullable: false },
      { name: 'rank', type: 'VARCHAR(64)', nullable: false },
      { name: 'status', type: 'ENUM("onboard","shore_leave","signed_off","archived")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/maritime-crew-management', description: 'Register crew', permission: 'maritime-crew-management.create', authRequired: true },
      { method: 'GET', path: '/api/v1/maritime-crew-management', description: 'List crew', permission: 'maritime-crew-management.view', authRequired: true },
      { method: 'GET', path: '/api/v1/maritime-crew-management/{id}', description: 'Get crew details', permission: 'maritime-crew-management.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/maritime-crew-management/{id}', description: 'Update crew status', permission: 'maritime-crew-management.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/maritime-crew-management/{id}', description: 'Archive record', permission: 'maritime-crew-management.delete', authRequired: true }
    ],
    services: ['CrewManagementService', 'CertificationTrackingService'],
    events: ['CrewRegistered', 'CertificationExpiring', 'CrewChangeScheduled'],
    jobs: ['TrackCrewCertificationsJob', 'GenerateVoyageRostersJob'],
    dependencies: [1],
    tests: ['CrewManagementTest', 'CertificationTrackingTest']
  }),
  buildModule({
    id: 845,
    name: 'Ship Maintenance Drydock Scheduler',
    slug: 'ship-maintenance-drydock-scheduler',
    category: 'Maritime & Shipping',
    phase: 38,
    iconName: 'Wrench',
    purpose: 'Schedule and manage drydock maintenance periods for vessel hull and machinery.',
    responsibilities: [
      'Plan drydock windows based on class survey requirements',
      'Track hull cleaning, painting, and propeller maintenance',
      'Manage drydock yard contracts and project timelines'
    ],
    tableName: 'drydock_schedules',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'vessel_name', type: 'VARCHAR(255)', nullable: false },
      { name: 'drydock_type', type: 'VARCHAR(64)', nullable: false },
      { name: 'status', type: 'ENUM("planned","in_drydock","completed","archived")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/ship-maintenance-drydock-scheduler', description: 'Schedule drydock', permission: 'ship-maintenance-drydock-scheduler.create', authRequired: true },
      { method: 'GET', path: '/api/v1/ship-maintenance-drydock-scheduler', description: 'List schedules', permission: 'ship-maintenance-drydock-scheduler.view', authRequired: true },
      { method: 'GET', path: '/api/v1/ship-maintenance-drydock-scheduler/{id}', description: 'Get schedule details', permission: 'ship-maintenance-drydock-scheduler.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/ship-maintenance-drydock-scheduler/{id}', description: 'Update schedule', permission: 'ship-maintenance-drydock-scheduler.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/ship-maintenance-drydock-scheduler/{id}', description: 'Archive schedule', permission: 'ship-maintenance-drydock-scheduler.delete', authRequired: true }
    ],
    services: ['DrydockSchedulingService', 'HullMaintenanceService'],
    events: ['DrydockScheduled', 'DrydockStarted', 'DrydockCompleted'],
    jobs: ['ScheduleDrydockPeriodsJob', 'TrackHullMaintenanceJob'],
    dependencies: [1],
    tests: ['DrydockSchedulingTest', 'HullMaintenanceTest']
  }),
  buildModule({
    id: 846,
    name: 'Cargo Manifest Manager',
    slug: 'cargo-manifest-manager',
    category: 'Maritime & Shipping',
    phase: 38,
    iconName: 'ClipboardList',
    purpose: 'Manage cargo manifests, bill of lading details, and dangerous goods declarations.',
    responsibilities: [
      'Create and validate cargo manifests per voyage',
      'Track dangerous goods declarations and UN numbers',
      'Generate customs documentation for port clearance'
    ],
    tableName: 'cargo_manifests',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'voyage_number', type: 'VARCHAR(32)', nullable: false },
      { name: 'cargo_type', type: 'VARCHAR(64)', nullable: false },
      { name: 'status', type: 'ENUM("draft","submitted","cleared","archived")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/cargo-manifest-manager', description: 'Create manifest', permission: 'cargo-manifest-manager.create', authRequired: true },
      { method: 'GET', path: '/api/v1/cargo-manifest-manager', description: 'List manifests', permission: 'cargo-manifest-manager.view', authRequired: true },
      { method: 'GET', path: '/api/v1/cargo-manifest-manager/{id}', description: 'Get manifest details', permission: 'cargo-manifest-manager.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/cargo-manifest-manager/{id}', description: 'Update manifest', permission: 'cargo-manifest-manager.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/cargo-manifest-manager/{id}', description: 'Archive manifest', permission: 'cargo-manifest-manager.delete', authRequired: true }
    ],
    services: ['ManifestService', 'DangerousGoodsService'],
    events: ['ManifestCreated', 'DangerousGoodsDeclared', 'CustomsClearanceRequested'],
    jobs: ['ValidateCargoManifestJob', 'GenerateCustomsDocumentationJob'],
    dependencies: [1],
    tests: ['ManifestTest', 'DangerousGoodsTest']
  }),
  buildModule({
    id: 847,
    name: 'Vessel Charter Party Manager',
    slug: 'vessel-charter-party-manager',
    category: 'Maritime & Shipping',
    phase: 38,
    iconName: 'FileText',
    purpose: 'Manage charter party agreements, hire calculations, and demurrage tracking.',
    responsibilities: [
      'Store and track time charter and voyage charter contracts',
      'Calculate hire payments and off-hire periods',
      'Manage demurrage and dispatch money calculations'
    ],
    tableName: 'charter_party_records',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'vessel_name', type: 'VARCHAR(255)', nullable: false },
      { name: 'charter_type', type: 'ENUM("time","voyage","bareboat","demise")', nullable: false },
      { name: 'status', type: 'ENUM("active","off_hire","completed","archived")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/vessel-charter-party-manager', description: 'Create charter', permission: 'vessel-charter-party-manager.create', authRequired: true },
      { method: 'GET', path: '/api/v1/vessel-charter-party-manager', description: 'List charters', permission: 'vessel-charter-party-manager.view', authRequired: true },
      { method: 'GET', path: '/api/v1/vessel-charter-party-manager/{id}', description: 'Get charter details', permission: 'vessel-charter-party-manager.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/vessel-charter-party-manager/{id}', description: 'Update charter', permission: 'vessel-charter-party-manager.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/vessel-charter-party-manager/{id}', description: 'Archive charter', permission: 'vessel-charter-party-manager.delete', authRequired: true }
    ],
    services: ['CharterPartyService', 'DemurrageCalculationService'],
    events: ['CharterCreated', 'HirePaymentDue', 'DemurrageCalculated'],
    jobs: ['CalculateHirePaymentsJob', 'TrackDemurrageJob'],
    dependencies: [1],
    tests: ['CharterPartyTest', 'DemurrageCalculationTest']
  }),
  buildModule({
    id: 848,
    name: 'Marine Insurance Claim',
    slug: 'marine-insurance-claim',
    category: 'Maritime & Shipping',
    phase: 38,
    iconName: 'Shield',
    purpose: 'Process and track marine insurance claims for hull, cargo, and P&I losses.',
    responsibilities: [
      'Register and document marine casualty events',
      'Track claim investigations and surveyor reports',
      'Manage claim settlement and recovery actions'
    ],
    tableName: 'marine_insurance_claims',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'claim_type', type: 'ENUM("hull","cargo","pi","machinery")', nullable: false },
      { name: 'loss_amount', type: 'DECIMAL(12,2)', nullable: false },
      { name: 'status', type: 'ENUM("reported","investigating","settled","recovered","archived")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/marine-insurance-claim', description: 'File claim', permission: 'marine-insurance-claim.create', authRequired: true },
      { method: 'GET', path: '/api/v1/marine-insurance-claim', description: 'List claims', permission: 'marine-insurance-claim.view', authRequired: true },
      { method: 'GET', path: '/api/v1/marine-insurance-claim/{id}', description: 'Get claim details', permission: 'marine-insurance-claim.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/marine-insurance-claim/{id}', description: 'Update claim', permission: 'marine-insurance-claim.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/marine-insurance-claim/{id}', description: 'Archive claim', permission: 'marine-insurance-claim.delete', authRequired: true }
    ],
    services: ['MarineClaimService', 'SurveyorCoordinationService'],
    events: ['ClaimFiled', 'SurveyCompleted', 'ClaimSettled'],
    jobs: ['ProcessMarineClaimsJob', 'CoordinateSurveyorsJob'],
    dependencies: [1],
    tests: ['MarineClaimTest', 'SurveyorCoordinationTest']
  }),
  buildModule({
    id: 849,
    name: 'Ballast Water Treatment Log',
    slug: 'ballast-water-treatment-log',
    category: 'Maritime & Shipping',
    phase: 38,
    iconName: 'Droplets',
    purpose: 'Log ballast water exchange and treatment activities for IMO D-2 compliance.',
    responsibilities: [
      'Record ballast water intake, exchange, and discharge events',
      'Track treatment system performance and sampling results',
      'Generate BWM Convention compliance reports'
    ],
    tableName: 'ballast_water_logs',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'vessel_name', type: 'VARCHAR(255)', nullable: false },
      { name: 'operation_type', type: 'ENUM("intake","exchange","discharge","treatment")', nullable: false },
      { name: 'status', type: 'ENUM("recorded","verified","compliant","non_compliant","archived")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/ballast-water-treatment-log', description: 'Log operation', permission: 'ballast-water-treatment-log.create', authRequired: true },
      { method: 'GET', path: '/api/v1/ballast-water-treatment-log', description: 'List logs', permission: 'ballast-water-treatment-log.view', authRequired: true },
      { method: 'GET', path: '/api/v1/ballast-water-treatment-log/{id}', description: 'Get log details', permission: 'ballast-water-treatment-log.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/ballast-water-treatment-log/{id}', description: 'Update log', permission: 'ballast-water-treatment-log.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/ballast-water-treatment-log/{id}', description: 'Archive log', permission: 'ballast-water-treatment-log.delete', authRequired: true }
    ],
    services: ['BallastWaterLogService', 'BwmComplianceService'],
    events: ['OperationLogged', 'SamplingCompleted', 'ComplianceReportGenerated'],
    jobs: ['LogBallastOperationsJob', 'VerifyBwmComplianceJob'],
    dependencies: [1],
    tests: ['BallastWaterLogTest', 'BwmComplianceTest']
  }),
  buildModule({
    id: 850,
    name: 'Port State Control Inspector',
    slug: 'port-state-control-inspector',
    category: 'Maritime & Shipping',
    phase: 38,
    iconName: 'ClipboardCheck',
    purpose: 'Conduct and track Port State Control (PSC) inspections and detention records.',
    responsibilities: [
      'Schedule and conduct PSC inspections on visiting vessels',
      'Record deficiencies and rectification actions',
      'Track vessel detention and release status'
    ],
    tableName: 'psc_inspections',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'vessel_name', type: 'VARCHAR(255)', nullable: false },
      { name: 'deficiency_count', type: 'INT', nullable: false },
      { name: 'status', type: 'ENUM("scheduled","in_progress","completed","detained","archived")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/port-state-control-inspector', description: 'Create inspection', permission: 'port-state-control-inspector.create', authRequired: true },
      { method: 'GET', path: '/api/v1/port-state-control-inspector', description: 'List inspections', permission: 'port-state-control-inspector.view', authRequired: true },
      { method: 'GET', path: '/api/v1/port-state-control-inspector/{id}', description: 'Get inspection details', permission: 'port-state-control-inspector.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/port-state-control-inspector/{id}', description: 'Update inspection', permission: 'port-state-control-inspector.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/port-state-control-inspector/{id}', description: 'Archive inspection', permission: 'port-state-control-inspector.delete', authRequired: true }
    ],
    services: ['PscInspectionService', 'DeficiencyTrackingService'],
    events: ['InspectionScheduled', 'DeficiencyRecorded', 'VesselDetained'],
    jobs: ['SchedulePscInspectionsJob', 'TrackDeficiencyRectificationsJob'],
    dependencies: [1],
    tests: ['PscInspectionTest', 'DeficiencyTrackingTest']
  }),
  buildModule({
    id: 851,
    name: 'Shipping Route Optimizer',
    slug: 'shipping-route-optimizer',
    category: 'Maritime & Shipping',
    phase: 38,
    iconName: 'Route',
    purpose: 'Optimize shipping routes based on weather, fuel cost, and schedule constraints.',
    responsibilities: [
      'Calculate optimal routes using weather routing algorithms',
      'Estimate fuel consumption and voyage duration',
      'Suggest route alternatives to avoid heavy weather'
    ],
    tableName: 'shipping_routes',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'origin_port', type: 'VARCHAR(32)', nullable: false },
      { name: 'destination_port', type: 'VARCHAR(32)', nullable: false },
      { name: 'status', type: 'ENUM("planned","active","completed","archived")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/shipping-route-optimizer', description: 'Plan route', permission: 'shipping-route-optimizer.create', authRequired: true },
      { method: 'GET', path: '/api/v1/shipping-route-optimizer', description: 'List routes', permission: 'shipping-route-optimizer.view', authRequired: true },
      { method: 'GET', path: '/api/v1/shipping-route-optimizer/{id}', description: 'Get route details', permission: 'shipping-route-optimizer.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/shipping-route-optimizer/{id}', description: 'Update route', permission: 'shipping-route-optimizer.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/shipping-route-optimizer/{id}', description: 'Archive route', permission: 'shipping-route-optimizer.delete', authRequired: true }
    ],
    services: ['WeatherRoutingService', 'FuelOptimizationService'],
    events: ['RoutePlanned', 'RouteOptimized', 'WeatherAlertReceived'],
    jobs: ['CalculateOptimalRoutesJob', 'EstimateFuelConsumptionJob'],
    dependencies: [1],
    tests: ['WeatherRoutingTest', 'FuelOptimizationTest']
  }),
  buildModule({
    id: 852,
    name: 'Maritime Safety Compliance',
    slug: 'maritime-safety-compliance',
    category: 'Maritime & Shipping',
    phase: 38,
    iconName: 'ShieldCheck',
    purpose: 'Ensure vessel fleet compliance with ISM, SOLAS, and flag state safety requirements.',
    responsibilities: [
      'Track ISM Code safety management system audits',
      'Monitor SOLAS safety equipment certification expiry',
      'Manage flag state inspection and certification cycles'
    ],
    tableName: 'maritime_safety_compliance_records',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'vessel_name', type: 'VARCHAR(255)', nullable: false },
      { name: 'compliance_type', type: 'VARCHAR(64)', nullable: false },
      { name: 'status', type: 'ENUM("compliant","non_compliant","pending_audit","archived")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/maritime-safety-compliance', description: 'Record compliance', permission: 'maritime-safety-compliance.create', authRequired: true },
      { method: 'GET', path: '/api/v1/maritime-safety-compliance', description: 'List records', permission: 'maritime-safety-compliance.view', authRequired: true },
      { method: 'GET', path: '/api/v1/maritime-safety-compliance/{id}', description: 'Get record details', permission: 'maritime-safety-compliance.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/maritime-safety-compliance/{id}', description: 'Update record', permission: 'maritime-safety-compliance.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/maritime-safety-compliance/{id}', description: 'Archive record', permission: 'maritime-safety-compliance.delete', authRequired: true }
    ],
    services: ['SafetyComplianceService', 'CertificationTrackingService'],
    events: ['ComplianceRecorded', 'CertificationExpiring', 'AuditScheduled'],
    jobs: ['TrackSafetyCertificationsJob', 'MonitorComplianceStatusJob'],
    dependencies: [1],
    tests: ['SafetyComplianceTest', 'CertificationTrackingTest']
  }),
  buildModule({
    id: 853,
    name: 'Ship Fuel (Bunker) Tracker',
    slug: 'ship-fuel-bunker-tracker',
    category: 'Maritime & Shipping',
    phase: 38,
    iconName: 'Fuel',
    purpose: 'Track bunker fuel purchases, consumption, and ISO 8217 quality test results.',
    responsibilities: [
      'Record bunker deliveries with quantity and quality data',
      'Track fuel consumption per voyage and per nautical mile',
      'Monitor sulphur content compliance with IMO 2020 regulations'
    ],
    tableName: 'bunker_fuel_records',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'vessel_name', type: 'VARCHAR(255)', nullable: false },
      { name: 'fuel_grade', type: 'VARCHAR(32)', nullable: false },
      { name: 'status', type: 'ENUM("purchased","consumed","tested","archived")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/ship-fuel-bunker-tracker', description: 'Record delivery', permission: 'ship-fuel-bunker-tracker.create', authRequired: true },
      { method: 'GET', path: '/api/v1/ship-fuel-bunker-tracker', description: 'List records', permission: 'ship-fuel-bunker-tracker.view', authRequired: true },
      { method: 'GET', path: '/api/v1/ship-fuel-bunker-tracker/{id}', description: 'Get record details', permission: 'ship-fuel-bunker-tracker.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/ship-fuel-bunker-tracker/{id}', description: 'Update record', permission: 'ship-fuel-bunker-tracker.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/ship-fuel-bunker-tracker/{id}', description: 'Archive record', permission: 'ship-fuel-bunker-tracker.delete', authRequired: true }
    ],
    services: ['BunkerTrackingService', 'FuelQualityService'],
    events: ['BunkerDelivered', 'FuelTestCompleted', 'SulphurLimitExceeded'],
    jobs: ['TrackBunkerDeliveriesJob', 'ValidateFuelQualityJob'],
    dependencies: [1],
    tests: ['BunkerTrackingTest', 'FuelQualityTest']
  }),
  buildModule({
    id: 854,
    name: 'Port Labor Scheduling',
    slug: 'port-labor-scheduling',
    category: 'Maritime & Shipping',
    phase: 38,
    iconName: 'Calendar',
    purpose: 'Schedule port stevedore and terminal labor shifts for vessel cargo operations.',
    responsibilities: [
      'Assign stevedore gangs based on vessel cargo plan',
      'Track labor hours and overtime for billing',
      'Manage shift changes during 24/7 port operations'
    ],
    tableName: 'port_labor_schedules',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'berth_id', type: 'VARCHAR(32)', nullable: false },
      { name: 'shift_hours', type: 'DECIMAL(4,2)', nullable: false },
      { name: 'status', type: 'ENUM("scheduled","active","completed","archived")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/port-labor-scheduling', description: 'Schedule shift', permission: 'port-labor-scheduling.create', authRequired: true },
      { method: 'GET', path: '/api/v1/port-labor-scheduling', description: 'List schedules', permission: 'port-labor-scheduling.view', authRequired: true },
      { method: 'GET', path: '/api/v1/port-labor-scheduling/{id}', description: 'Get schedule details', permission: 'port-labor-scheduling.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/port-labor-scheduling/{id}', description: 'Update schedule', permission: 'port-labor-scheduling.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/port-labor-scheduling/{id}', description: 'Archive schedule', permission: 'port-labor-scheduling.delete', authRequired: true }
    ],
    services: ['LaborSchedulingService', 'StevedoreAssignmentService'],
    events: ['ShiftScheduled', 'ShiftStarted', 'LaborHoursRecorded'],
    jobs: ['ScheduleStevedoreGangsJob', 'CalculateLaborHoursJob'],
    dependencies: [1],
    tests: ['LaborSchedulingTest', 'StevedoreAssignmentTest']
  }),
  buildModule({
    id: 855,
    name: 'Container Depot Manager',
    slug: 'container-depot-manager',
    category: 'Maritime & Shipping',
    phase: 38,
    iconName: 'Warehouse',
    purpose: 'Manage container depot operations including storage, repair, and repositioning.',
    responsibilities: [
      'Track container inventory and yard utilization',
      'Schedule container repair and refurbishment',
      'Coordinate container repositioning between depots'
    ],
    tableName: 'container_depot_records',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'container_number', type: 'VARCHAR(32)', nullable: false, index: true },
      { name: 'depot_location', type: 'VARCHAR(128)', nullable: false },
      { name: 'status', type: 'ENUM("stored","in_repair","dispatched","archived")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/container-depot-manager', description: 'Record container', permission: 'container-depot-manager.create', authRequired: true },
      { method: 'GET', path: '/api/v1/container-depot-manager', description: 'List containers', permission: 'container-depot-manager.view', authRequired: true },
      { method: 'GET', path: '/api/v1/container-depot-manager/{id}', description: 'Get container details', permission: 'container-depot-manager.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/container-depot-manager/{id}', description: 'Update container', permission: 'container-depot-manager.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/container-depot-manager/{id}', description: 'Archive record', permission: 'container-depot-manager.delete', authRequired: true }
    ],
    services: ['DepotInventoryService', 'ContainerRepairService'],
    events: ['ContainerReceived', 'RepairCompleted', 'ContainerDispatched'],
    jobs: ['TrackContainerInventoryJob', 'ScheduleContainerRepairsJob'],
    dependencies: [1],
    tests: ['DepotInventoryTest', 'ContainerRepairTest']
  }),
  buildModule({
    id: 856,
    name: 'Vessel Layup Manager',
    slug: 'vessel-layup-manager',
    category: 'Maritime & Shipping',
    phase: 38,
    iconName: 'Pause',
    purpose: 'Manage vessel layup periods during low market conditions and return-to-service.',
    responsibilities: [
      'Track layup location, duration, and associated costs',
      'Schedule periodic maintenance during layup',
      'Plan vessel reactivation and sea trials'
    ],
    tableName: 'vessel_layup_records',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'vessel_name', type: 'VARCHAR(255)', nullable: false },
      { name: 'layup_location', type: 'VARCHAR(255)', nullable: false },
      { name: 'status', type: 'ENUM("laid_up","reactivating","active","archived")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/vessel-layup-manager', description: 'Record layup', permission: 'vessel-layup-manager.create', authRequired: true },
      { method: 'GET', path: '/api/v1/vessel-layup-manager', description: 'List records', permission: 'vessel-layup-manager.view', authRequired: true },
      { method: 'GET', path: '/api/v1/vessel-layup-manager/{id}', description: 'Get record details', permission: 'vessel-layup-manager.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/vessel-layup-manager/{id}', description: 'Update record', permission: 'vessel-layup-manager.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/vessel-layup-manager/{id}', description: 'Archive record', permission: 'vessel-layup-manager.delete', authRequired: true }
    ],
    services: ['LayupManagementService', 'ReactivationService'],
    events: ['LayupRecorded', 'ReactivationStarted', 'VesselReactivated'],
    jobs: ['MonitorLayupPeriodsJob', 'PlanReactivationJob'],
    dependencies: [1],
    tests: ['LayupManagementTest', 'ReactivationTest']
  }),
  buildModule({
    id: 857,
    name: 'Maritime Weather Routing',
    slug: 'maritime-weather-routing',
    category: 'Maritime & Shipping',
    phase: 38,
    iconName: 'Cloud',
    purpose: 'Provide weather routing advisories and ocean condition forecasts for voyages.',
    responsibilities: [
      'Generate weather routing recommendations for voyage plans',
      'Issue storm avoidance and heavy weather advisories',
      'Provide sea state and wind forecasts along routes'
    ],
    tableName: 'weather_routing_records',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'voyage_number', type: 'VARCHAR(32)', nullable: false },
      { name: 'weather_condition', type: 'VARCHAR(128)', nullable: false },
      { name: 'status', type: 'ENUM("advisory_active","rerouted","completed","archived")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/maritime-weather-routing', description: 'Issue advisory', permission: 'maritime-weather-routing.create', authRequired: true },
      { method: 'GET', path: '/api/v1/maritime-weather-routing', description: 'List advisories', permission: 'maritime-weather-routing.view', authRequired: true },
      { method: 'GET', path: '/api/v1/maritime-weather-routing/{id}', description: 'Get advisory details', permission: 'maritime-weather-routing.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/maritime-weather-routing/{id}', description: 'Update advisory', permission: 'maritime-weather-routing.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/maritime-weather-routing/{id}', description: 'Archive advisory', permission: 'maritime-weather-routing.delete', authRequired: true }
    ],
    services: ['WeatherRoutingService', 'OceanForecastService'],
    events: ['AdvisoryIssued', 'RouteRerouted', 'HeavyWeatherAvoided'],
    jobs: ['GenerateWeatherRoutingJob', 'IssueStormAdvisoriesJob'],
    dependencies: [1],
    tests: ['WeatherRoutingTest', 'OceanForecastTest']
  }),
  buildModule({
    id: 858,
    name: 'Port Community System',
    slug: 'port-community-system',
    category: 'Maritime & Shipping',
    phase: 38,
    iconName: 'Network',
    purpose: 'Provide a shared digital platform for port stakeholders to exchange data and documents.',
    responsibilities: [
      'Facilitate electronic data interchange between port actors',
      'Centralize customs, shipping line, and terminal information',
      'Enable real-time visibility of port processes for all parties'
    ],
    tableName: 'port_community_records',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'message_type', type: 'VARCHAR(64)', nullable: false },
      { name: 'sender_org', type: 'VARCHAR(255)', nullable: false },
      { name: 'status', type: 'ENUM("sent","processed","acknowledged","archived")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/port-community-system', description: 'Send message', permission: 'port-community-system.create', authRequired: true },
      { method: 'GET', path: '/api/v1/port-community-system', description: 'List messages', permission: 'port-community-system.view', authRequired: true },
      { method: 'GET', path: '/api/v1/port-community-system/{id}', description: 'Get message details', permission: 'port-community-system.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/port-community-system/{id}', description: 'Acknowledge message', permission: 'port-community-system.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/port-community-system/{id}', description: 'Archive message', permission: 'port-community-system.delete', authRequired: true }
    ],
    services: ['PortDataExchangeService', 'StakeholderCoordinationService'],
    events: ['MessageSent', 'MessageProcessed', 'PortEventBroadcast'],
    jobs: ['ProcessPortMessagesJob', 'BroadcastPortEventsJob'],
    dependencies: [1],
    tests: ['PortDataExchangeTest', 'StakeholderCoordinationTest']
  }),
  buildModule({
    id: 859,
    name: 'Ship Manning Certificate Tracker',
    slug: 'ship-manning-certificate-tracker',
    category: 'Maritime & Shipping',
    phase: 38,
    iconName: 'FileCheck',
    purpose: 'Track minimum safe manning certificates and crew qualification requirements per vessel.',
    responsibilities: [
      'Verify minimum manning certificate compliance per flag state',
      'Track crew qualification requirements against assigned crew',
      'Alert on manning deficiencies before port state inspections'
    ],
    tableName: 'manning_certificate_records',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'vessel_name', type: 'VARCHAR(255)', nullable: false },
      { name: 'flag_state', type: 'VARCHAR(64)', nullable: false },
      { name: 'status', type: 'ENUM("compliant","deficient","resolved","archived")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/ship-manning-certificate-tracker', description: 'Record certificate', permission: 'ship-manning-certificate-tracker.create', authRequired: true },
      { method: 'GET', path: '/api/v1/ship-manning-certificate-tracker', description: 'List records', permission: 'ship-manning-certificate-tracker.view', authRequired: true },
      { method: 'GET', path: '/api/v1/ship-manning-certificate-tracker/{id}', description: 'Get record details', permission: 'ship-manning-certificate-tracker.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/ship-manning-certificate-tracker/{id}', description: 'Update record', permission: 'ship-manning-certificate-tracker.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/ship-manning-certificate-tracker/{id}', description: 'Archive record', permission: 'ship-manning-certificate-tracker.delete', authRequired: true }
    ],
    services: ['ManningComplianceService', 'QualificationVerificationService'],
    events: ['CertificateRecorded', 'ManningDeficiencyDetected', 'ComplianceAchieved'],
    jobs: ['CheckManningComplianceJob', 'VerifyQualificationsJob'],
    dependencies: [1],
    tests: ['ManningComplianceTest', 'QualificationVerificationTest']
  }),
  buildModule({
    id: 860,
    name: 'Maritime Incident Investigator',
    slug: 'maritime-incident-investigator',
    category: 'Maritime & Shipping',
    phase: 38,
    iconName: 'Search',
    purpose: 'Investigate and document maritime incidents, near-misses, and casualties.',
    responsibilities: [
      'Collect evidence and witness statements after incidents',
      'Determine root causes and contributing factors',
      'Issue safety recommendations and track corrective actions'
    ],
    tableName: 'maritime_incidents',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'incident_type', type: 'VARCHAR(64)', nullable: false },
      { name: 'vessel_name', type: 'VARCHAR(255)', nullable: true },
      { name: 'status', type: 'ENUM("reported","investigating","report_published","closed","archived")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/maritime-incident-investigator', description: 'Report incident', permission: 'maritime-incident-investigator.create', authRequired: true },
      { method: 'GET', path: '/api/v1/maritime-incident-investigator', description: 'List incidents', permission: 'maritime-incident-investigator.view', authRequired: true },
      { method: 'GET', path: '/api/v1/maritime-incident-investigator/{id}', description: 'Get incident details', permission: 'maritime-incident-investigator.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/maritime-incident-investigator/{id}', description: 'Update investigation', permission: 'maritime-incident-investigator.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/maritime-incident-investigator/{id}', description: 'Archive incident', permission: 'maritime-incident-investigator.delete', authRequired: true }
    ],
    services: ['IncidentInvestigationService', 'RootCauseAnalysisService'],
    events: ['IncidentReported', 'InvestigationCompleted', 'SafetyRecommendationIssued'],
    jobs: ['ConductIncidentInvestigationJob', 'TrackCorrectiveActionsJob'],
    dependencies: [1],
    tests: ['IncidentInvestigationTest', 'RootCauseAnalysisTest']
  }),
  buildModule({
    id: 861,
    name: 'Ocean Freight Rate Index',
    slug: 'ocean-freight-rate-index',
    category: 'Maritime & Shipping',
    phase: 38,
    iconName: 'TrendingUp',
    purpose: 'Track and analyze ocean freight rates across trade lanes and container types.',
    responsibilities: [
      'Collect spot and contract freight rate data',
      'Calculate rate indices per trade lane and equipment type',
      'Provide market intelligence for freight procurement'
    ],
    tableName: 'freight_rate_records',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'trade_lane', type: 'VARCHAR(128)', nullable: false },
      { name: 'rate_per_feu', type: 'DECIMAL(10,2)', nullable: false },
      { name: 'status', type: 'ENUM("current","historical","forecasted","archived")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/ocean-freight-rate-index', description: 'Record rate', permission: 'ocean-freight-rate-index.create', authRequired: true },
      { method: 'GET', path: '/api/v1/ocean-freight-rate-index', description: 'List rates', permission: 'ocean-freight-rate-index.view', authRequired: true },
      { method: 'GET', path: '/api/v1/ocean-freight-rate-index/{id}', description: 'Get rate details', permission: 'ocean-freight-rate-index.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/ocean-freight-rate-index/{id}', description: 'Update rate', permission: 'ocean-freight-rate-index.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/ocean-freight-rate-index/{id}', description: 'Archive rate', permission: 'ocean-freight-rate-index.delete', authRequired: true }
    ],
    services: ['FreightRateCollectionService', 'MarketIndexService'],
    events: ['RateRecorded', 'IndexCalculated', 'MarketTrendDetected'],
    jobs: ['CollectFreightRatesJob', 'CalculateRateIndicesJob'],
    dependencies: [1],
    tests: ['FreightRateCollectionTest', 'MarketIndexTest']
  }),
  buildModule({
    id: 862,
    name: 'Reefer Container Monitor',
    slug: 'reefer-container-monitor',
    category: 'Maritime & Shipping',
    phase: 38,
    iconName: 'Thermometer',
    purpose: 'Monitor temperature, humidity, and ventilation conditions in reefer containers.',
    responsibilities: [
      'Track real-time temperature and humidity in reefer units',
      'Alert on out-of-range conditions and alarm events',
      'Generate reefer cargo condition reports for consignees'
    ],
    tableName: 'reefer_monitor_records',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'container_number', type: 'VARCHAR(32)', nullable: false, index: true },
      { name: 'temperature_celsius', type: 'DECIMAL(5,2)', nullable: false },
      { name: 'status', type: 'ENUM("normal","alarm","discharging","archived")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/reefer-container-monitor', description: 'Record reading', permission: 'reefer-container-monitor.create', authRequired: true },
      { method: 'GET', path: '/api/v1/reefer-container-monitor', description: 'List readings', permission: 'reefer-container-monitor.view', authRequired: true },
      { method: 'GET', path: '/api/v1/reefer-container-monitor/{id}', description: 'Get reading details', permission: 'reefer-container-monitor.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/reefer-container-monitor/{id}', description: 'Update reading', permission: 'reefer-container-monitor.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/reefer-container-monitor/{id}', description: 'Archive reading', permission: 'reefer-container-monitor.delete', authRequired: true }
    ],
    services: ['ReeferSensorService', 'TemperatureAlertService'],
    events: ['TemperatureRecorded', 'AlarmTriggered', 'CargoConditionReportGenerated'],
    jobs: ['PollReeferSensorsJob', 'MonitorTemperatureAlarmsJob'],
    dependencies: [1],
    tests: ['ReeferSensorTest', 'TemperatureAlertTest']
  }),
  buildModule({
    id: 863,
    name: 'Port Gate Appointment System',
    slug: 'port-gate-appointment-system',
    category: 'Maritime & Shipping',
    phase: 38,
    iconName: 'DoorOpen',
    purpose: 'Schedule truck gate appointments for container pick-up and drop-off at port terminals.',
    responsibilities: [
      'Allow truckers to book gate time slots online',
      'Manage yard吊 capacity and appointment throughput',
      'Reduce truck waiting times and gate congestion'
    ],
    tableName: 'gate_appointments',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'container_number', type: 'VARCHAR(32)', nullable: false },
      { name: 'appointment_slot', type: 'VARCHAR(32)', nullable: false },
      { name: 'status', type: 'ENUM("booked","arrived","completed","no_show","archived")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/port-gate-appointment-system', description: 'Book appointment', permission: 'port-gate-appointment-system.create', authRequired: true },
      { method: 'GET', path: '/api/v1/port-gate-appointment-system', description: 'List appointments', permission: 'port-gate-appointment-system.view', authRequired: true },
      { method: 'GET', path: '/api/v1/port-gate-appointment-system/{id}', description: 'Get appointment details', permission: 'port-gate-appointment-system.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/port-gate-appointment-system/{id}', description: 'Update appointment', permission: 'port-gate-appointment-system.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/port-gate-appointment-system/{id}', description: 'Cancel appointment', permission: 'port-gate-appointment-system.delete', authRequired: true }
    ],
    services: ['AppointmentBookingService', 'GateFlowService'],
    events: ['AppointmentBooked', 'TruckArrived', 'GatePassageCompleted'],
    jobs: ['ManageGateAppointmentsJob', 'TrackGateThroughputJob'],
    dependencies: [1],
    tests: ['AppointmentBookingTest', 'GateFlowTest']
  }),
  buildModule({
    id: 864,
    name: 'Maritime Environmental Compliance',
    slug: 'maritime-environmental-compliance',
    category: 'Maritime & Shipping',
    phase: 38,
    iconName: 'Leaf',
    purpose: 'Ensure fleet compliance with MARPOL, EEXI, and CII environmental regulations.',
    responsibilities: [
      'Track MARPOL Annex I-VI compliance status per vessel',
      'Monitor CII ratings and EEXI technical files',
      'Report greenhouse gas emissions per IMO DC/TF framework'
    ],
    tableName: 'maritime_environmental_records',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'vessel_name', type: 'VARCHAR(255)', nullable: false },
      { name: 'regulation_type', type: 'VARCHAR(64)', nullable: false },
      { name: 'status', type: 'ENUM("compliant","non_compliant","under_review","archived")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/maritime-environmental-compliance', description: 'Record compliance', permission: 'maritime-environmental-compliance.create', authRequired: true },
      { method: 'GET', path: '/api/v1/maritime-environmental-compliance', description: 'List records', permission: 'maritime-environmental-compliance.view', authRequired: true },
      { method: 'GET', path: '/api/v1/maritime-environmental-compliance/{id}', description: 'Get record details', permission: 'maritime-environmental-compliance.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/maritime-environmental-compliance/{id}', description: 'Update record', permission: 'maritime-environmental-compliance.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/maritime-environmental-compliance/{id}', description: 'Archive record', permission: 'maritime-environmental-compliance.delete', authRequired: true }
    ],
    services: ['MarpolComplianceService', 'CiiMonitoringService'],
    events: ['ComplianceRecorded', 'CiiRatingCalculated', 'NonComplianceDetected'],
    jobs: ['MonitorMarpolComplianceJob', 'CalculateCiiRatingsJob'],
    dependencies: [1],
    tests: ['MarpolComplianceTest', 'CiiMonitoringTest']
  }),
  buildModule({
    id: 865,
    name: 'Ship Securities (ISPS) Tracker',
    slug: 'ship-securities-isps-tracker',
    category: 'Maritime & Shipping',
    phase: 38,
    iconName: 'Shield',
    purpose: 'Track ISPS Code compliance, ship security assessments, and security drill records.',
    responsibilities: [
      'Manage Ship Security Assessment (SSA) documentation',
      'Track Ship Security Plan (SSP) updates and approval',
      'Record security drills and exercises for audit evidence'
    ],
    tableName: 'isps_compliance_records',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'vessel_name', type: 'VARCHAR(255)', nullable: false },
      { name: 'security_level', type: 'ENUM("1","2","3")', nullable: false },
      { name: 'status', type: 'ENUM("compliant","drill_pending","audit_due","archived")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/ship-securities-isps-tracker', description: 'Record compliance', permission: 'ship-securities-isps-tracker.create', authRequired: true },
      { method: 'GET', path: '/api/v1/ship-securities-isps-tracker', description: 'List records', permission: 'ship-securities-isps-tracker.view', authRequired: true },
      { method: 'GET', path: '/api/v1/ship-securities-isps-tracker/{id}', description: 'Get record details', permission: 'ship-securities-isps-tracker.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/ship-securities-isps-tracker/{id}', description: 'Update record', permission: 'ship-securities-isps-tracker.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/ship-securities-isps-tracker/{id}', description: 'Archive record', permission: 'ship-securities-isps-tracker.delete', authRequired: true }
    ],
    services: ['IspsComplianceService', 'SecurityDrillService'],
    events: ['ComplianceRecorded', 'SecurityDrillCompleted', 'SecurityLevelChanged'],
    jobs: ['TrackIspsComplianceJob', 'ScheduleSecurityDrillsJob'],
    dependencies: [1],
    tests: ['IspsComplianceTest', 'SecurityDrillTest']
  })
];
