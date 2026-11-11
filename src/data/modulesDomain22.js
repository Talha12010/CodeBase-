import { buildModule } from './moduleBuilderHelper';

export const modulesDomain22 = [
  buildModule({
    id: 421,
    name: 'Crop Management System',
    slug: 'crop-management-wheat',
    category: 'Agriculture & Food',
    phase: 22,
    iconName: 'Wheat',
    purpose: 'Manages wheat crop planning, growth tracking, and harvest scheduling across agricultural zones. Coordinates planting cycles, irrigation needs, and yield projections.',
    responsibilities: [
      'Plan and track wheat crop planting and growth cycles',
      'Monitor crop health and recommend interventions',
      'Forecast harvest dates and expected yields'
    ],
    tableName: 'crop_plans',
    tableColumns: [
      { name: 'id', type: 'VARCHAR(36)', nullable: false, index: true },
      { name: 'farm_id', type: 'VARCHAR(36)', nullable: false, index: true },
      { name: 'crop_type', type: 'VARCHAR(100)', nullable: false, index: false },
      { name: 'field_zone', type: 'VARCHAR(50)', nullable: false, index: true },
      { name: 'planted_date', type: 'DATE', nullable: false, index: false },
      { name: 'expected_harvest', type: 'DATE', nullable: true, index: false },
      { name: 'acres', type: 'DECIMAL(10,2)', nullable: false, index: false },
      { name: 'growth_stage', type: 'VARCHAR(50)', nullable: false, index: true },
      { name: 'status', type: 'VARCHAR(30)', nullable: false, index: true },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false, index: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/crop-plans', description: 'Create a new crop plan', permission: 'crop_plans:create', authRequired: true },
      { method: 'GET', path: '/api/v1/crop-plans', description: 'List all crop plans with filters', permission: 'crop_plans:read', authRequired: true },
      { method: 'PUT', path: '/api/v1/crop-plans/:id', description: 'Update crop plan details', permission: 'crop_plans:update', authRequired: true },
      { method: 'DELETE', path: '/api/v1/crop-plans/:id', description: 'Archive a crop plan', permission: 'crop_plans:delete', authRequired: true }
    ],
    services: ['CropPlanService', 'GrowthTrackerService', 'HarvestForecastService'],
    events: ['CropPlanCreated', 'CropStageChanged', 'HarvestScheduled'],
    jobs: ['SyncCropGrowthData', 'CalculateYieldProjections', 'AlertCropHealthIssues'],
    dependencies: [88, 27],
    tests: ['CropPlanCRUD', 'GrowthStageTransitions', 'HarvestDateCalculation']
  }),

  buildModule({
    id: 422,
    name: 'Livestock Tracking',
    slug: 'livestock-tracking-beef',
    category: 'Agriculture & Food',
    phase: 22,
    iconName: 'Beef',
    purpose: 'Tracks beef cattle assets through their lifecycle from birth to market readiness. Monitors health records, weight gain, and breeding lineage.',
    responsibilities: [
      'Register and track individual cattle assets',
      'Maintain health and vaccination records',
      'Monitor weight gain and market readiness'
    ],
    tableName: 'livestock_assets',
    tableColumns: [
      { name: 'id', type: 'VARCHAR(36)', nullable: false, index: true },
      { name: 'farm_id', type: 'VARCHAR(36)', nullable: false, index: true },
      { name: 'tag_number', type: 'VARCHAR(50)', nullable: false, index: true },
      { name: 'breed', type: 'VARCHAR(100)', nullable: false, index: false },
      { name: 'birth_date', type: 'DATE', nullable: true, index: false },
      { name: 'weight_kg', type: 'DECIMAL(10,2)', nullable: true, index: false },
      { name: 'health_status', type: 'VARCHAR(30)', nullable: false, index: true },
      { name: 'pen_id', type: 'VARCHAR(36)', nullable: true, index: true },
      { name: 'acquisition_date', type: 'DATE', nullable: false, index: false },
      { name: 'status', type: 'VARCHAR(30)', nullable: false, index: true },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false, index: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/livestock', description: 'Register a new livestock asset', permission: 'livestock:create', authRequired: true },
      { method: 'GET', path: '/api/v1/livestock', description: 'List livestock with filters', permission: 'livestock:read', authRequired: true },
      { method: 'PUT', path: '/api/v1/livestock/:id', description: 'Update livestock record', permission: 'livestock:update', authRequired: true },
      { method: 'GET', path: '/api/v1/livestock/:id/health', description: 'Get health history', permission: 'livestock:read', authRequired: true }
    ],
    services: ['LivestockAssetService', 'HealthRecordService', 'WeightTrackingService'],
    events: ['LivestockRegistered', 'HealthStatusChanged', 'WeightRecorded'],
    jobs: ['SyncLivestockData', 'CalculateWeightGain', 'AlertHealthIssues'],
    dependencies: [88, 9],
    tests: ['LivestockRegistration', 'HealthRecordTracking', 'WeightGainCalculation']
  }),

  buildModule({
    id: 423,
    name: 'Irrigation Control IoT',
    slug: 'irrigation-control-iot',
    category: 'Agriculture & Food',
    phase: 22,
    iconName: 'Droplets',
    purpose: 'Controls and monitors irrigation systems across farm zones using IoT sensors and actuators. Manages water schedules based on soil moisture and weather data.',
    responsibilities: [
      'Control irrigation zone activation and scheduling',
      'Monitor soil moisture and water usage in real-time',
      'Optimize irrigation based on weather forecasts'
    ],
    tableName: 'irrigation_zones',
    tableColumns: [
      { name: 'id', type: 'VARCHAR(36)', nullable: false, index: true },
      { name: 'farm_id', type: 'VARCHAR(36)', nullable: false, index: true },
      { name: 'zone_name', type: 'VARCHAR(100)', nullable: false, index: false },
      { name: 'zone_area_acres', type: 'DECIMAL(10,2)', nullable: false, index: false },
      { name: 'moisture_threshold', type: 'DECIMAL(5,2)', nullable: false, index: false },
      { name: 'water_flow_rate', type: 'DECIMAL(10,2)', nullable: true, index: false },
      { name: 'last_irrigated', type: 'TIMESTAMP', nullable: true, index: false },
      { name: 'status', type: 'VARCHAR(30)', nullable: false, index: true },
      { name: 'device_id', type: 'VARCHAR(36)', nullable: true, index: true },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false, index: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/irrigation-zones', description: 'Add new irrigation zone', permission: 'irrigation:create', authRequired: true },
      { method: 'GET', path: '/api/v1/irrigation-zones', description: 'List all irrigation zones', permission: 'irrigation:read', authRequired: true },
      { method: 'POST', path: '/api/v1/irrigation-zones/:id/activate', description: 'Activate irrigation zone', permission: 'irrigation:control', authRequired: true },
      { method: 'GET', path: '/api/v1/irrigation-zones/:id/readings', description: 'Get moisture readings', permission: 'irrigation:read', authRequired: true }
    ],
    services: ['IrrigationZoneService', 'MoistureMonitorService', 'WaterScheduleService'],
    events: ['IrrigationActivated', 'MoistureThresholdExceeded', 'WaterUsageLogged'],
    jobs: ['ProcessSensorReadings', 'AutoAdjustSchedules', 'GenerateWaterUsageReport'],
    dependencies: [424, 432],
    tests: ['IrrigationZoneSetup', 'MoistureThresholdLogic', 'ScheduleOptimization']
  }),

  buildModule({
    id: 424,
    name: 'Soil Health Analytics',
    slug: 'soil-health-analytics',
    category: 'Agriculture & Food',
    phase: 22,
    iconName: 'Layers',
    purpose: 'Analyzes soil samples to determine nutrient levels, pH balance, and composition across farm fields. Provides recommendations for soil amendments.',
    responsibilities: [
      'Collect and catalog soil samples from fields',
      'Analyze soil composition and nutrient levels',
      'Generate soil amendment recommendations'
    ],
    tableName: 'soil_samples',
    tableColumns: [
      { name: 'id', type: 'VARCHAR(36)', nullable: false, index: true },
      { name: 'farm_id', type: 'VARCHAR(36)', nullable: false, index: true },
      { name: 'field_zone', type: 'VARCHAR(50)', nullable: false, index: true },
      { name: 'sample_date', type: 'DATE', nullable: false, index: true },
      { name: 'ph_level', type: 'DECIMAL(4,2)', nullable: true, index: false },
      { name: 'nitrogen_ppm', type: 'DECIMAL(10,2)', nullable: true, index: false },
      { name: 'phosphorus_ppm', type: 'DECIMAL(10,2)', nullable: true, index: false },
      { name: 'potassium_ppm', type: 'DECIMAL(10,2)', nullable: true, index: false },
      { name: 'organic_matter_pct', type: 'DECIMAL(5,2)', nullable: true, index: false },
      { name: 'lab_id', type: 'VARCHAR(36)', nullable: true, index: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false, index: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/soil-samples', description: 'Record new soil sample', permission: 'soil:create', authRequired: true },
      { method: 'GET', path: '/api/v1/soil-samples', description: 'List soil samples with filters', permission: 'soil:read', authRequired: true },
      { method: 'GET', path: '/api/v1/soil-samples/:id', description: 'Get detailed soil analysis', permission: 'soil:read', authRequired: true },
      { method: 'GET', path: '/api/v1/soil-samples/recommendations', description: 'Get amendment recommendations', permission: 'soil:read', authRequired: true }
    ],
    services: ['SoilSampleService', 'NutrientAnalysisService', 'AmendmentRecommendationService'],
    events: ['SoilSampleRecorded', 'NutrientLevelAlert', 'AmendmentRecommended'],
    jobs: ['AnalyzePendingSamples', 'GenerateNutrientReport', 'SyncLabResults'],
    dependencies: [421, 88],
    tests: ['SoilSampleCreation', 'NutrientCalculation', 'RecommendationEngine']
  }),

  buildModule({
    id: 425,
    name: 'Harvest Yield Optimizer',
    slug: 'harvest-yield-optimizer',
    category: 'Agriculture & Food',
    phase: 22,
    iconName: 'TrendingUp',
    purpose: 'Optimizes harvest operations by analyzing yield data, field conditions, and market timing. Tracks actual vs projected yields per field.',
    responsibilities: [
      'Record harvest data including yield and quality metrics',
      'Compare actual yields against projections',
      'Recommend optimal harvest timing for future crops'
    ],
    tableName: 'harvest_records',
    tableColumns: [
      { name: 'id', type: 'VARCHAR(36)', nullable: false, index: true },
      { name: 'farm_id', type: 'VARCHAR(36)', nullable: false, index: true },
      { name: 'crop_plan_id', type: 'VARCHAR(36)', nullable: false, index: true },
      { name: 'harvest_date', type: 'DATE', nullable: false, index: false },
      { name: 'field_zone', type: 'VARCHAR(50)', nullable: false, index: true },
      { name: 'yield_tons', type: 'DECIMAL(12,2)', nullable: false, index: false },
      { name: 'quality_grade', type: 'VARCHAR(20)', nullable: true, index: false },
      { name: 'moisture_pct', type: 'DECIMAL(5,2)', nullable: true, index: false },
      { name: 'projected_yield', type: 'DECIMAL(12,2)', nullable: true, index: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false, index: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/harvest-records', description: 'Record harvest data', permission: 'harvest:create', authRequired: true },
      { method: 'GET', path: '/api/v1/harvest-records', description: 'List harvest records', permission: 'harvest:read', authRequired: true },
      { method: 'GET', path: '/api/v1/harvest-records/analysis', description: 'Get yield analysis', permission: 'harvest:read', authRequired: true },
      { method: 'GET', path: '/api/v1/harvest-records/forecast', description: 'Get yield forecast', permission: 'harvest:read', authRequired: true }
    ],
    services: ['HarvestRecordService', 'YieldAnalysisService', 'OptimizationEngineService'],
    events: ['HarvestRecorded', 'YieldDeviationDetected', 'OptimalTimingRecommended'],
    jobs: ['AnalyzeYieldTrends', 'GenerateSeasonReport', 'UpdateProjections'],
    dependencies: [421, 424],
    tests: ['HarvestRecordCreation', 'YieldDeviationCalculation', 'ForecastAccuracy']
  }),

  buildModule({
    id: 426,
    name: 'Agricultural Supply Chain',
    slug: 'agricultural-supply-chain',
    category: 'Agriculture & Food',
    phase: 22,
    iconName: 'Truck',
    purpose: 'Manages procurement and logistics of agricultural supplies including seeds, fertilizers, and equipment parts. Tracks orders from suppliers to farm delivery.',
    responsibilities: [
      'Process and track farm supply orders',
      'Manage supplier relationships and contracts',
      'Coordinate delivery logistics to farm locations'
    ],
    tableName: 'farm_supply_orders',
    tableColumns: [
      { name: 'id', type: 'VARCHAR(36)', nullable: false, index: true },
      { name: 'farm_id', type: 'VARCHAR(36)', nullable: false, index: true },
      { name: 'supplier_id', type: 'VARCHAR(36)', nullable: false, index: true },
      { name: 'order_date', type: 'DATE', nullable: false, index: false },
      { name: 'item_description', type: 'VARCHAR(500)', nullable: false, index: false },
      { name: 'quantity', type: 'DECIMAL(10,2)', nullable: false, index: false },
      { name: 'unit_cost', type: 'DECIMAL(10,2)', nullable: false, index: false },
      { name: 'total_cost', type: 'DECIMAL(12,2)', nullable: false, index: false },
      { name: 'delivery_status', type: 'VARCHAR(30)', nullable: false, index: true },
      { name: 'expected_delivery', type: 'DATE', nullable: true, index: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false, index: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/supply-orders', description: 'Create supply order', permission: 'supply:create', authRequired: true },
      { method: 'GET', path: '/api/v1/supply-orders', description: 'List supply orders', permission: 'supply:read', authRequired: true },
      { method: 'PUT', path: '/api/v1/supply-orders/:id', description: 'Update order status', permission: 'supply:update', authRequired: true },
      { method: 'GET', path: '/api/v1/supply-orders/:id/tracking', description: 'Track order delivery', permission: 'supply:read', authRequired: true }
    ],
    services: ['SupplyOrderService', 'SupplierManagementService', 'DeliveryTrackingService'],
    events: ['SupplyOrderCreated', 'OrderStatusUpdated', 'DeliveryCompleted'],
    jobs: ['ProcessPendingOrders', 'SyncSupplierInventory', 'GenerateCostReport'],
    dependencies: [88, 27],
    tests: ['OrderCreation', 'StatusTransition', 'CostCalculation']
  }),

  buildModule({
    id: 427,
    name: 'Farm Equipment Maintenance',
    slug: 'farm-equipment-maintenance',
    category: 'Agriculture & Food',
    phase: 22,
    iconName: 'Wrench',
    purpose: 'Manages maintenance schedules and repair records for farm equipment and machinery. Tracks usage hours and schedules preventive maintenance.',
    responsibilities: [
      'Register and track farm equipment assets',
      'Schedule preventive maintenance tasks',
      'Record and manage repair history'
    ],
    tableName: 'equipment_assets',
    tableColumns: [
      { name: 'id', type: 'VARCHAR(36)', nullable: false, index: true },
      { name: 'farm_id', type: 'VARCHAR(36)', nullable: false, index: true },
      { name: 'equipment_name', type: 'VARCHAR(200)', nullable: false, index: false },
      { name: 'equipment_type', type: 'VARCHAR(100)', nullable: false, index: true },
      { name: 'serial_number', type: 'VARCHAR(100)', nullable: true, index: true },
      { name: 'purchase_date', type: 'DATE', nullable: true, index: false },
      { name: 'usage_hours', type: 'DECIMAL(10,2)', nullable: false, index: false },
      { name: 'last_service_date', type: 'DATE', nullable: true, index: false },
      { name: 'next_service_hours', type: 'DECIMAL(10,2)', nullable: true, index: false },
      { name: 'status', type: 'VARCHAR(30)', nullable: false, index: true },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false, index: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/equipment', description: 'Register equipment', permission: 'equipment:create', authRequired: true },
      { method: 'GET', path: '/api/v1/equipment', description: 'List equipment assets', permission: 'equipment:read', authRequired: true },
      { method: 'PUT', path: '/api/v1/equipment/:id', description: 'Update equipment record', permission: 'equipment:update', authRequired: true },
      { method: 'GET', path: '/api/v1/equipment/:id/maintenance', description: 'Get maintenance schedule', permission: 'equipment:read', authRequired: true }
    ],
    services: ['EquipmentAssetService', 'MaintenanceSchedulerService', 'RepairRecordService'],
    events: ['EquipmentRegistered', 'MaintenanceScheduled', 'RepairCompleted'],
    jobs: ['CheckMaintenanceDue', 'UpdateUsageHours', 'GenerateEquipmentReport'],
    dependencies: [88, 101],
    tests: ['EquipmentRegistration', 'MaintenanceScheduling', 'UsageHoursTracking']
  }),

  buildModule({
    id: 428,
    name: 'Food Safety Compliance',
    slug: 'food-safety-compliance',
    category: 'Agriculture & Food',
    phase: 22,
    iconName: 'ShieldCheck',
    purpose: 'Ensures compliance with food safety regulations through audits, inspections, and certification tracking. Manages HACCP and food safety protocols.',
    responsibilities: [
      'Schedule and conduct food safety audits',
      'Track compliance status across operations',
      'Manage corrective actions and certifications'
    ],
    tableName: 'safety_audits',
    tableColumns: [
      { name: 'id', type: 'VARCHAR(36)', nullable: false, index: true },
      { name: 'farm_id', type: 'VARCHAR(36)', nullable: false, index: true },
      { name: 'audit_type', type: 'VARCHAR(100)', nullable: false, index: true },
      { name: 'auditor_id', type: 'VARCHAR(36)', nullable: false, index: false },
      { name: 'audit_date', type: 'DATE', nullable: false, index: true },
      { name: 'score', type: 'DECIMAL(5,2)', nullable: true, index: false },
      { name: 'findings', type: 'TEXT', nullable: true, index: false },
      { name: 'status', type: 'VARCHAR(30)', nullable: false, index: true },
      { name: 'corrective_actions', type: 'INT', nullable: false, index: false },
      { name: 'certification_id', type: 'VARCHAR(36)', nullable: true, index: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false, index: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/safety-audits', description: 'Schedule new audit', permission: 'safety:create', authRequired: true },
      { method: 'GET', path: '/api/v1/safety-audits', description: 'List safety audits', permission: 'safety:read', authRequired: true },
      { method: 'PUT', path: '/api/v1/safety-audits/:id', description: 'Update audit results', permission: 'safety:update', authRequired: true },
      { method: 'GET', path: '/api/v1/safety-audits/compliance', description: 'Get compliance dashboard', permission: 'safety:read', authRequired: true }
    ],
    services: ['SafetyAuditService', 'ComplianceTrackerService', 'CorrectiveActionService'],
    events: ['AuditScheduled', 'AuditCompleted', 'ComplianceViolationDetected'],
    jobs: ['GenerateComplianceReport', 'TrackCorrectiveDeadlines', 'SyncRegulatoryUpdates'],
    dependencies: [421, 88],
    tests: ['AuditScheduling', 'ComplianceScoreCalculation', 'CorrectiveActionTracking']
  }),

  buildModule({
    id: 429,
    name: 'Cold Chain Monitoring',
    slug: 'cold-chain-monitoring',
    category: 'Agriculture & Food',
    phase: 22,
    iconName: 'Thermometer',
    purpose: 'Monitors temperature conditions throughout the cold chain for perishable agricultural products. Alerts on temperature excursions during storage and transport.',
    responsibilities: [
      'Track temperature readings from cold storage units',
      'Alert on temperature excursions and door openings',
      'Maintain cold chain compliance records'
    ],
    tableName: 'cold_chain_readings',
    tableColumns: [
      { name: 'id', type: 'VARCHAR(36)', nullable: false, index: true },
      { name: 'farm_id', type: 'VARCHAR(36)', nullable: false, index: true },
      { name: 'storage_unit_id', type: 'VARCHAR(36)', nullable: false, index: true },
      { name: 'temperature_celsius', type: 'DECIMAL(5,2)', nullable: false, index: false },
      { name: 'humidity_pct', type: 'DECIMAL(5,2)', nullable: true, index: false },
      { name: 'door_open', type: 'BOOLEAN', nullable: false, index: false },
      { name: 'location_lat', type: 'DECIMAL(10,7)', nullable: true, index: false },
      { name: 'location_lng', type: 'DECIMAL(10,7)', nullable: true, index: false },
      { name: 'reading_time', type: 'TIMESTAMP', nullable: false, index: true },
      { name: 'alert_level', type: 'VARCHAR(20)', nullable: true, index: true },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false, index: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/cold-chain-readings', description: 'Record temperature reading', permission: 'coldchain:create', authRequired: true },
      { method: 'GET', path: '/api/v1/cold-chain-readings', description: 'List temperature readings', permission: 'coldchain:read', authRequired: true },
      { method: 'GET', path: '/api/v1/cold-chain-readings/alerts', description: 'Get active alerts', permission: 'coldchain:read', authRequired: true },
      { method: 'GET', path: '/api/v1/cold-chain-readings/:unitId/history', description: 'Get unit temperature history', permission: 'coldchain:read', authRequired: true }
    ],
    services: ['TemperatureReadingService', 'ColdChainAlertService', 'ComplianceRecordService'],
    events: ['TemperatureRecorded', 'TemperatureAlertTriggered', 'ColdChainComplianceUpdate'],
    jobs: ['ProcessIncomingReadings', 'CheckTemperatureAlerts', 'GenerateComplianceReport'],
    dependencies: [428, 101],
    tests: ['TemperatureRecording', 'AlertThresholdLogic', 'ComplianceValidation']
  }),

  buildModule({
    id: 430,
    name: 'Organic Certification Tracker',
    slug: 'organic-certification-tracker',
    category: 'Agriculture & Food',
    phase: 22,
    iconName: 'Leaf',
    purpose: 'Tracks organic certification requirements, renewal deadlines, and compliance documentation. Manages the transition process from conventional to organic farming.',
    responsibilities: [
      'Track certification application and renewal status',
      'Manage organic compliance documentation',
      'Monitor transition period requirements'
    ],
    tableName: 'organic_certs',
    tableColumns: [
      { name: 'id', type: 'VARCHAR(36)', nullable: false, index: true },
      { name: 'farm_id', type: 'VARCHAR(36)', nullable: false, index: true },
      { name: 'certification_type', type: 'VARCHAR(100)', nullable: false, index: true },
      { name: 'certifying_body', type: 'VARCHAR(200)', nullable: false, index: false },
      { name: 'issue_date', type: 'DATE', nullable: true, index: false },
      { name: 'expiry_date', type: 'DATE', nullable: false, index: true },
      { name: 'cert_number', type: 'VARCHAR(100)', nullable: true, index: true },
      { name: 'status', type: 'VARCHAR(30)', nullable: false, index: true },
      { name: 'scope_areas', type: 'JSON', nullable: false, index: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false, index: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/organic-certs', description: 'Register certification', permission: 'organic:create', authRequired: true },
      { method: 'GET', path: '/api/v1/organic-certs', description: 'List certifications', permission: 'organic:read', authRequired: true },
      { method: 'PUT', path: '/api/v1/organic-certs/:id', description: 'Update certification', permission: 'organic:update', authRequired: true },
      { method: 'GET', path: '/api/v1/organic-certs/:id/renewal', description: 'Check renewal status', permission: 'organic:read', authRequired: true }
    ],
    services: ['OrganicCertService', 'RenewalTrackerService', 'ComplianceDocService'],
    events: ['CertificationRegistered', 'RenewalReminder', 'CertificationUpdated'],
    jobs: ['CheckRenewalDeadlines', 'SyncCertificationData', 'GenerateComplianceReport'],
    dependencies: [428, 88],
    tests: ['CertificationRegistration', 'RenewalCalculation', 'ScopeAreaTracking']
  }),

  buildModule({
    id: 431,
    name: 'Crop Disease Detection',
    slug: 'crop-disease-detection',
    category: 'Agriculture & Food',
    phase: 22,
    iconName: 'Bug',
    purpose: 'Identifies and tracks crop diseases using sensor data and image analysis. Manages treatment recommendations and containment protocols.',
    responsibilities: [
      'Detect and report crop disease occurrences',
      'Track disease spread and affected areas',
      'Recommend treatment and containment measures'
    ],
    tableName: 'disease_reports',
    tableColumns: [
      { name: 'id', type: 'VARCHAR(36)', nullable: false, index: true },
      { name: 'farm_id', type: 'VARCHAR(36)', nullable: false, index: true },
      { name: 'crop_plan_id', type: 'VARCHAR(36)', nullable: true, index: true },
      { name: 'disease_name', type: 'VARCHAR(200)', nullable: false, index: true },
      { name: 'field_zone', type: 'VARCHAR(50)', nullable: false, index: true },
      { name: 'severity_level', type: 'VARCHAR(20)', nullable: false, index: true },
      { name: 'detection_date', type: 'DATE', nullable: false, index: true },
      { name: 'affected_area_pct', type: 'DECIMAL(5,2)', nullable: false, index: false },
      { name: 'treatment_applied', type: 'TEXT', nullable: true, index: false },
      { name: 'status', type: 'VARCHAR(30)', nullable: false, index: true },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false, index: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/disease-reports', description: 'Report disease occurrence', permission: 'disease:create', authRequired: true },
      { method: 'GET', path: '/api/v1/disease-reports', description: 'List disease reports', permission: 'disease:read', authRequired: true },
      { method: 'PUT', path: '/api/v1/disease-reports/:id', description: 'Update disease report', permission: 'disease:update', authRequired: true },
      { method: 'GET', path: '/api/v1/disease-reports/alerts', description: 'Get active disease alerts', permission: 'disease:read', authRequired: true }
    ],
    services: ['DiseaseDetectionService', 'TreatmentRecommendationService', 'DiseaseAlertService'],
    events: ['DiseaseDetected', 'TreatmentRecommended', 'DiseaseResolved'],
    jobs: ['AnalyzeSensorData', 'GenerateDiseaseReport', 'CheckSpreadPatterns'],
    dependencies: [421, 101],
    tests: ['DiseaseReporting', 'SeverityClassification', 'TreatmentEffectiveness']
  }),

  buildModule({
    id: 432,
    name: 'Weather Station Network',
    slug: 'weather-station-network',
    category: 'Agriculture & Food',
    phase: 22,
    iconName: 'CloudSun',
    purpose: 'Collects and analyzes weather data from on-farm weather stations. Provides localized forecasts and weather advisories for agricultural planning.',
    responsibilities: [
      'Collect real-time weather data from farm stations',
      'Provide localized weather forecasts and alerts',
      'Correlate weather data with crop performance'
    ],
    tableName: 'weather_readings',
    tableColumns: [
      { name: 'id', type: 'VARCHAR(36)', nullable: false, index: true },
      { name: 'farm_id', type: 'VARCHAR(36)', nullable: false, index: true },
      { name: 'station_id', type: 'VARCHAR(36)', nullable: false, index: true },
      { name: 'reading_time', type: 'TIMESTAMP', nullable: false, index: true },
      { name: 'temperature_celsius', type: 'DECIMAL(5,2)', nullable: false, index: false },
      { name: 'humidity_pct', type: 'DECIMAL(5,2)', nullable: false, index: false },
      { name: 'rainfall_mm', type: 'DECIMAL(8,2)', nullable: false, index: false },
      { name: 'wind_speed_kmh', type: 'DECIMAL(6,2)', nullable: false, index: false },
      { name: 'soil_temp_celsius', type: 'DECIMAL(5,2)', nullable: true, index: false },
      { name: 'uv_index', type: 'DECIMAL(4,1)', nullable: true, index: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false, index: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/weather-readings', description: 'Record weather reading', permission: 'weather:create', authRequired: true },
      { method: 'GET', path: '/api/v1/weather-readings', description: 'List weather readings', permission: 'weather:read', authRequired: true },
      { method: 'GET', path: '/api/v1/weather-readings/forecast', description: 'Get local forecast', permission: 'weather:read', authRequired: true },
      { method: 'GET', path: '/api/v1/weather-readings/advisories', description: 'Get weather advisories', permission: 'weather:read', authRequired: true }
    ],
    services: ['WeatherReadingService', 'ForecastService', 'AdvisoryService'],
    events: ['WeatherReadingReceived', 'WeatherAlertIssued', 'ForecastUpdated'],
    jobs: ['ProcessStationData', 'GenerateDailyForecast', 'UpdateAdvisories'],
    dependencies: [421, 101],
    tests: ['WeatherRecording', 'ForecastAccuracy', 'AdvisoryGeneration']
  }),

  buildModule({
    id: 433,
    name: 'Grain Storage Management',
    slug: 'grain-storage-management',
    category: 'Agriculture & Food',
    phase: 22,
    iconName: 'Archive',
    purpose: 'Manages grain storage operations including silo inventory, moisture monitoring, and aeration control. Tracks grain quantities and quality conditions.',
    responsibilities: [
      'Track grain inventory across silos',
      'Monitor storage conditions (temperature, moisture)',
      'Manage grain movement and blending operations'
    ],
    tableName: 'grain_silos',
    tableColumns: [
      { name: 'id', type: 'VARCHAR(36)', nullable: false, index: true },
      { name: 'farm_id', type: 'VARCHAR(36)', nullable: false, index: true },
      { name: 'silo_name', type: 'VARCHAR(100)', nullable: false, index: false },
      { name: 'grain_type', type: 'VARCHAR(100)', nullable: true, index: true },
      { name: 'capacity_tons', type: 'DECIMAL(12,2)', nullable: false, index: false },
      { name: 'current_fill_pct', type: 'DECIMAL(5,2)', nullable: false, index: false },
      { name: 'temperature_celsius', type: 'DECIMAL(5,2)', nullable: true, index: false },
      { name: 'moisture_pct', type: 'DECIMAL(5,2)', nullable: true, index: false },
      { name: 'aeration_active', type: 'BOOLEAN', nullable: false, index: false },
      { name: 'last_inspection', type: 'DATE', nullable: true, index: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false, index: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/grain-silos', description: 'Register silo', permission: 'storage:create', authRequired: true },
      { method: 'GET', path: '/api/v1/grain-silos', description: 'List silos and inventory', permission: 'storage:read', authRequired: true },
      { method: 'PUT', path: '/api/v1/grain-silos/:id', description: 'Update silo data', permission: 'storage:update', authRequired: true },
      { method: 'GET', path: '/api/v1/grain-silos/:id/conditions', description: 'Get storage conditions', permission: 'storage:read', authRequired: true }
    ],
    services: ['SiloInventoryService', 'StorageConditionService', 'GrainMovementService'],
    events: ['SiloInventoryUpdated', 'ConditionAlertTriggered', 'GrainMoved'],
    jobs: ['MonitorStorageConditions', 'GenerateInventoryReport', 'CheckAerationSchedule'],
    dependencies: [421, 425],
    tests: ['SiloRegistration', 'InventoryTracking', 'ConditionMonitoring']
  }),

  buildModule({
    id: 434,
    name: 'Poultry Farm Management',
    slug: 'poultry-farm-management',
    category: 'Agriculture & Food',
    phase: 22,
    iconName: 'Egg',
    purpose: 'Manages poultry flock operations including flock health, egg production tracking, and feed management. Monitors environmental conditions in poultry houses.',
    responsibilities: [
      'Track poultry flock health and production',
      'Manage feed schedules and consumption',
      'Monitor poultry house environmental conditions'
    ],
    tableName: 'poultry_flocks',
    tableColumns: [
      { name: 'id', type: 'VARCHAR(36)', nullable: false, index: true },
      { name: 'farm_id', type: 'VARCHAR(36)', nullable: false, index: true },
      { name: 'flock_name', type: 'VARCHAR(100)', nullable: false, index: false },
      { name: 'breed', type: 'VARCHAR(100)', nullable: false, index: false },
      { name: 'house_id', type: 'VARCHAR(36)', nullable: false, index: true },
      { name: 'bird_count', type: 'INT', nullable: false, index: false },
      { name: 'avg_weight_g', type: 'DECIMAL(8,2)', nullable: true, index: false },
      { name: 'egg_production_daily', type: 'INT', nullable: true, index: false },
      { name: 'health_status', type: 'VARCHAR(30)', nullable: false, index: true },
      { name: 'mortality_pct', type: 'DECIMAL(5,2)', nullable: false, index: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false, index: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/poultry-flocks', description: 'Register poultry flock', permission: 'poultry:create', authRequired: true },
      { method: 'GET', path: '/api/v1/poultry-flocks', description: 'List poultry flocks', permission: 'poultry:read', authRequired: true },
      { method: 'PUT', path: '/api/v1/poultry-flocks/:id', description: 'Update flock record', permission: 'poultry:update', authRequired: true },
      { method: 'GET', path: '/api/v1/poultry-flocks/:id/production', description: 'Get production data', permission: 'poultry:read', authRequired: true }
    ],
    services: ['PoultryFlockService', 'EggProductionService', 'FeedManagementService'],
    events: ['FlockRegistered', 'ProductionRecorded', 'HealthAlertTriggered'],
    jobs: ['CalculateDailyProduction', 'MonitorMortalityRate', 'GenerateFeedSchedule'],
    dependencies: [88, 428],
    tests: ['FlockRegistration', 'ProductionCalculation', 'HealthStatusTracking']
  }),

  buildModule({
    id: 435,
    name: 'Agricultural Drone Spraying',
    slug: 'agricultural-drone-spraying',
    category: 'Agriculture & Food',
    phase: 22,
    iconName: 'Plane',
    purpose: 'Manages drone-based crop spraying operations for fertilizers, pesticides, and herbicides. Tracks spray missions, coverage, and chemical usage.',
    responsibilities: [
      'Plan and schedule drone spray missions',
      'Track spray coverage and chemical application rates',
      'Monitor drone fleet status and maintenance'
    ],
    tableName: 'drone_spray_missions',
    tableColumns: [
      { name: 'id', type: 'VARCHAR(36)', nullable: false, index: true },
      { name: 'farm_id', type: 'VARCHAR(36)', nullable: false, index: true },
      { name: 'drone_id', type: 'VARCHAR(36)', nullable: false, index: true },
      { name: 'mission_date', type: 'DATE', nullable: false, index: true },
      { name: 'chemical_type', type: 'VARCHAR(100)', nullable: false, index: false },
      { name: 'application_rate_lha', type: 'DECIMAL(8,2)', nullable: false, index: false },
      { name: 'area_covered_ha', type: 'DECIMAL(10,2)', nullable: false, index: false },
      { name: 'field_zones', type: 'JSON', nullable: false, index: false },
      { name: 'flight_duration_min', type: 'INT', nullable: false, index: false },
      { name: 'status', type: 'VARCHAR(30)', nullable: false, index: true },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false, index: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/drone-missions', description: 'Schedule spray mission', permission: 'drone:create', authRequired: true },
      { method: 'GET', path: '/api/v1/drone-missions', description: 'List spray missions', permission: 'drone:read', authRequired: true },
      { method: 'PUT', path: '/api/v1/drone-missions/:id', description: 'Update mission status', permission: 'drone:update', authRequired: true },
      { method: 'GET', path: '/api/v1/drone-missions/:id/coverage', description: 'Get spray coverage report', permission: 'drone:read', authRequired: true }
    ],
    services: ['SprayMissionService', 'CoverageTrackingService', 'DroneFleetService'],
    events: ['MissionScheduled', 'MissionCompleted', 'CoverageReportGenerated'],
    jobs: ['PlanFlightRoutes', 'CalculateChemicalUsage', 'GenerateCoverageMap'],
    dependencies: [421, 101],
    tests: ['MissionScheduling', 'CoverageCalculation', 'ChemicalUsageTracking']
  }),

  buildModule({
    id: 436,
    name: 'Fishery Pond Monitoring',
    slug: 'fishery-pond-monitoring',
    category: 'Agriculture & Food',
    phase: 22,
    iconName: 'Fish',
    purpose: 'Monitors water quality and fish health in aquaculture ponds. Tracks dissolved oxygen, pH, temperature, and feeding rates for optimal fish growth.',
    responsibilities: [
      'Monitor water quality parameters in fish ponds',
      'Track fish health and growth rates',
      'Manage feeding schedules and oxygenation systems'
    ],
    tableName: 'pond_sensors',
    tableColumns: [
      { name: 'id', type: 'VARCHAR(36)', nullable: false, index: true },
      { name: 'farm_id', type: 'VARCHAR(36)', nullable: false, index: true },
      { name: 'pond_id', type: 'VARCHAR(36)', nullable: false, index: true },
      { name: 'reading_time', type: 'TIMESTAMP', nullable: false, index: true },
      { name: 'dissolved_oxygen_mgl', type: 'DECIMAL(6,2)', nullable: false, index: false },
      { name: 'ph_level', type: 'DECIMAL(4,2)', nullable: false, index: false },
      { name: 'temperature_celsius', type: 'DECIMAL(5,2)', nullable: false, index: false },
      { name: 'ammonia_ppm', type: 'DECIMAL(6,2)', nullable: true, index: false },
      { name: 'turbidity_ntu', type: 'DECIMAL(8,2)', nullable: true, index: false },
      { name: 'oxygenator_status', type: 'VARCHAR(20)', nullable: false, index: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false, index: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/pond-readings', description: 'Record pond sensor data', permission: 'fishery:create', authRequired: true },
      { method: 'GET', path: '/api/v1/pond-readings', description: 'List pond readings', permission: 'fishery:read', authRequired: true },
      { method: 'GET', path: '/api/v1/pond-readings/alerts', description: 'Get water quality alerts', permission: 'fishery:read', authRequired: true },
      { method: 'GET', path: '/api/v1/pond-readings/:pondId/trends', description: 'Get pond trends', permission: 'fishery:read', authRequired: true }
    ],
    services: ['PondSensorService', 'WaterQualityService', 'FishHealthService'],
    events: ['PondReadingRecorded', 'WaterQualityAlert', 'OxygenLevelAlert'],
    jobs: ['ProcessSensorData', 'CheckWaterQualityAlerts', 'GenerateTrendReport'],
    dependencies: [101, 428],
    tests: ['SensorDataRecording', 'AlertThresholdLogic', 'TrendAnalysis']
  }),

  buildModule({
    id: 437,
    name: 'Seed Inventory Tracking',
    slug: 'seed-inventory-tracking',
    category: 'Agriculture & Food',
    phase: 22,
    iconName: 'Package',
    purpose: 'Manages seed inventory including lot tracking, germination rates, and planting recommendations. Ensures optimal seed selection for each crop cycle.',
    responsibilities: [
      'Track seed inventory lots and quantities',
      'Monitor germination test results',
      'Recommend seed varieties for planting'
    ],
    tableName: 'seed_inventory',
    tableColumns: [
      { name: 'id', type: 'VARCHAR(36)', nullable: false, index: true },
      { name: 'farm_id', type: 'VARCHAR(36)', nullable: false, index: true },
      { name: 'seed_variety', type: 'VARCHAR(200)', nullable: false, index: true },
      { name: 'lot_number', type: 'VARCHAR(100)', nullable: false, index: true },
      { name: 'supplier', type: 'VARCHAR(200)', nullable: false, index: false },
      { name: 'quantity_kg', type: 'DECIMAL(10,2)', nullable: false, index: false },
      { name: 'germination_pct', type: 'DECIMAL(5,2)', nullable: true, index: false },
      { name: 'purchase_date', type: 'DATE', nullable: false, index: false },
      { name: 'expiry_date', type: 'DATE', nullable: true, index: true },
      { name: 'storage_location', type: 'VARCHAR(100)', nullable: false, index: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false, index: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/seed-inventory', description: 'Add seed lot', permission: 'seed:create', authRequired: true },
      { method: 'GET', path: '/api/v1/seed-inventory', description: 'List seed inventory', permission: 'seed:read', authRequired: true },
      { method: 'PUT', path: '/api/v1/seed-inventory/:id', description: 'Update seed record', permission: 'seed:update', authRequired: true },
      { method: 'GET', path: '/api/v1/seed-inventory/recommendations', description: 'Get planting recommendations', permission: 'seed:read', authRequired: true }
    ],
    services: ['SeedInventoryService', 'GerminationTestService', 'PlantingRecommendationService'],
    events: ['SeedLotRegistered', 'GerminationTestCompleted', 'PlantingRecommended'],
    jobs: ['CheckExpiryAlerts', 'GeneratePlantingPlan', 'SyncSupplierData'],
    dependencies: [421, 426],
    tests: ['SeedLotCreation', 'GerminationCalculation', 'RecommendationLogic']
  }),

  buildModule({
    id: 438,
    name: 'Greenhouse Climate Control',
    slug: 'greenhouse-climate-control',
    category: 'Agriculture & Food',
    phase: 22,
    iconName: 'Home',
    purpose: 'Controls and monitors climate conditions in greenhouse growing zones. Manages temperature, humidity, CO2 levels, and lighting for optimal plant growth.',
    responsibilities: [
      'Monitor and control greenhouse temperature and humidity',
      'Manage CO2 enrichment and ventilation systems',
      'Optimize lighting schedules for plant growth'
    ],
    tableName: 'greenhouse_zones',
    tableColumns: [
      { name: 'id', type: 'VARCHAR(36)', nullable: false, index: true },
      { name: 'farm_id', type: 'VARCHAR(36)', nullable: false, index: true },
      { name: 'zone_name', type: 'VARCHAR(100)', nullable: false, index: false },
      { name: 'target_temp_min', type: 'DECIMAL(5,2)', nullable: false, index: false },
      { name: 'target_temp_max', type: 'DECIMAL(5,2)', nullable: false, index: false },
      { name: 'target_humidity_pct', type: 'DECIMAL(5,2)', nullable: false, index: false },
      { name: 'co2_target_ppm', type: 'INT', nullable: false, index: false },
      { name: 'lighting_hours', type: 'DECIMAL(4,1)', nullable: false, index: false },
      { name: 'current_crop', type: 'VARCHAR(200)', nullable: true, index: false },
      { name: 'status', type: 'VARCHAR(30)', nullable: false, index: true },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false, index: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/greenhouse-zones', description: 'Add greenhouse zone', permission: 'greenhouse:create', authRequired: true },
      { method: 'GET', path: '/api/v1/greenhouse-zones', description: 'List greenhouse zones', permission: 'greenhouse:read', authRequired: true },
      { method: 'PUT', path: '/api/v1/greenhouse-zones/:id', description: 'Update zone settings', permission: 'greenhouse:update', authRequired: true },
      { method: 'GET', path: '/api/v1/greenhouse-zones/:id/readings', description: 'Get climate readings', permission: 'greenhouse:read', authRequired: true }
    ],
    services: ['GreenhouseZoneService', 'ClimateControlService', 'LightingScheduleService'],
    events: ['ZoneAdded', 'ClimateSettingsUpdated', 'TemperatureAlertTriggered'],
    jobs: ['AdjustClimateSettings', 'OptimizeLightingSchedule', 'GenerateGrowthReport'],
    dependencies: [101, 88],
    tests: ['ZoneSetup', 'ClimateSettingsCalculation', 'AlertThresholdLogic']
  }),

  buildModule({
    id: 439,
    name: 'Agricultural Market Pricing',
    slug: 'agricultural-market-pricing',
    category: 'Agriculture & Food',
    phase: 22,
    iconName: 'DollarSign',
    purpose: 'Tracks commodity market prices and provides pricing analytics for agricultural products. Helps optimize selling decisions based on market conditions.',
    responsibilities: [
      'Collect and analyze commodity market prices',
      'Provide price trend analytics and forecasts',
      'Recommend optimal selling timing for crops'
    ],
    tableName: 'market_prices',
    tableColumns: [
      { name: 'id', type: 'VARCHAR(36)', nullable: false, index: true },
      { name: 'farm_id', type: 'VARCHAR(36)', nullable: false, index: true },
      { name: 'commodity', type: 'VARCHAR(100)', nullable: false, index: true },
      { name: 'market_source', type: 'VARCHAR(100)', nullable: false, index: true },
      { name: 'recorded_date', type: 'DATE', nullable: false, index: true },
      { name: 'price_per_unit', type: 'DECIMAL(10,2)', nullable: false, index: false },
      { name: 'currency', type: 'VARCHAR(3)', nullable: false, index: false },
      { name: 'unit_type', type: 'VARCHAR(20)', nullable: false, index: false },
      { name: 'price_trend', type: 'VARCHAR(10)', nullable: false, index: false },
      { name: 'volume_traded', type: 'DECIMAL(12,2)', nullable: true, index: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false, index: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/market-prices', description: 'Record market price', permission: 'market:create', authRequired: true },
      { method: 'GET', path: '/api/v1/market-prices', description: 'List market prices', permission: 'market:read', authRequired: true },
      { method: 'GET', path: '/api/v1/market-prices/:commodity/trends', description: 'Get price trends', permission: 'market:read', authRequired: true },
      { method: 'GET', path: '/api/v1/market-prices/recommendations', description: 'Get sell recommendations', permission: 'market:read', authRequired: true }
    ],
    services: ['MarketPriceService', 'PriceAnalyticsService', 'SellingRecommendationService'],
    events: ['PriceRecorded', 'PriceAlertTriggered', 'SellingRecommendationGenerated'],
    jobs: ['FetchMarketPrices', 'AnalyzePriceTrends', 'GenerateSellingAlerts'],
    dependencies: [425, 88],
    tests: ['PriceRecording', 'TrendAnalysis', 'RecommendationLogic']
  }),

  buildModule({
    id: 440,
    name: 'Farm Labor Management',
    slug: 'farm-labor-management',
    category: 'Agriculture & Food',
    phase: 22,
    iconName: 'Users',
    purpose: 'Manages farm worker scheduling, time tracking, and task assignments. Tracks labor costs and ensures adequate workforce coverage during critical periods.',
    responsibilities: [
      'Schedule workers for farm operations and tasks',
      'Track worker hours and attendance',
      'Manage labor costs and payroll data'
    ],
    tableName: 'farm_workers',
    tableColumns: [
      { name: 'id', type: 'VARCHAR(36)', nullable: false, index: true },
      { name: 'farm_id', type: 'VARCHAR(36)', nullable: false, index: true },
      { name: 'worker_name', type: 'VARCHAR(200)', nullable: false, index: false },
      { name: 'role', type: 'VARCHAR(100)', nullable: false, index: true },
      { name: 'hourly_rate', type: 'DECIMAL(8,2)', nullable: false, index: false },
      { name: 'skill_tags', type: 'JSON', nullable: false, index: false },
      { name: 'availability_status', type: 'VARCHAR(30)', nullable: false, index: true },
      { name: 'total_hours_month', type: 'DECIMAL(8,2)', nullable: false, index: false },
      { name: 'certifications', type: 'JSON', nullable: false, index: false },
      { name: 'hire_date', type: 'DATE', nullable: false, index: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false, index: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/farm-workers', description: 'Register farm worker', permission: 'labor:create', authRequired: true },
      { method: 'GET', path: '/api/v1/farm-workers', description: 'List farm workers', permission: 'labor:read', authRequired: true },
      { method: 'PUT', path: '/api/v1/farm-workers/:id', description: 'Update worker record', permission: 'labor:update', authRequired: true },
      { method: 'GET', path: '/api/v1/farm-workers/schedule', description: 'Get worker schedule', permission: 'labor:read', authRequired: true }
    ],
    services: ['FarmWorkerService', 'ScheduleService', 'LaborCostService'],
    events: ['WorkerRegistered', 'ScheduleUpdated', 'LaborCostCalculated'],
    jobs: ['GenerateWeeklySchedule', 'CalculateLaborCosts', 'CheckCertificationExpiry'],
    dependencies: [88, 421],
    tests: ['WorkerRegistration', 'ScheduleOptimization', 'CostCalculation']
  })
];

export default modulesDomain22;
