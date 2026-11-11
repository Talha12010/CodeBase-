import { buildModule } from './moduleBuilderHelper';

export const modulesDomain39 = [
  buildModule({
    id: 866,
    name: 'Mine Site Safety Monitor',
    slug: 'mine-site-safety-monitor',
    category: 'Mining & Natural Resources',
    phase: 39,
    iconName: 'Shield',
    purpose: 'Monitor mine site safety conditions, track incidents, and enforce safety protocols.',
    responsibilities: [
      'Track real-time gas levels, ground stability, and ventilation',
      'Record safety incidents and near-miss events',
      'Enforce mandatory safety training and certification compliance'
    ],
    tableName: 'mine_safety_records',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'site_name', type: 'VARCHAR(255)', nullable: false },
      { name: 'hazard_type', type: 'VARCHAR(64)', nullable: false },
      { name: 'status', type: 'ENUM("monitoring","alert","incident","resolved","archived")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/mine-site-safety-monitor', description: 'Record safety data', permission: 'mine-site-safety-monitor.create', authRequired: true },
      { method: 'GET', path: '/api/v1/mine-site-safety-monitor', description: 'List records', permission: 'mine-site-safety-monitor.view', authRequired: true },
      { method: 'GET', path: '/api/v1/mine-site-safety-monitor/{id}', description: 'Get record details', permission: 'mine-site-safety-monitor.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/mine-site-safety-monitor/{id}', description: 'Update record', permission: 'mine-site-safety-monitor.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/mine-site-safety-monitor/{id}', description: 'Archive record', permission: 'mine-site-safety-monitor.delete', authRequired: true }
    ],
    services: ['SafetyMonitoringService', 'HazardAlertService'],
    events: ['SafetyDataRecorded', 'HazardDetected', 'IncidentReported'],
    jobs: ['MonitorMineConditionsJob', 'EnforceSafetyTrainingJob'],
    dependencies: [1],
    tests: ['SafetyMonitoringTest', 'HazardAlertTest']
  }),
  buildModule({
    id: 867,
    name: 'Ore Grade Control System',
    slug: 'ore-grade-control-system',
    category: 'Mining & Natural Resources',
    phase: 39,
    iconName: 'BarChart2',
    purpose: 'Analyze ore grades from sampling and direct ore flow to processing plants.',
    responsibilities: [
      'Track assay results from blast hole and channel samples',
      'Generate grade control maps for mining blocks',
      'Reconcile predicted vs actual grades for mine-to-mill'
    ],
    tableName: 'ore_grade_records',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'block_id', type: 'VARCHAR(32)', nullable: false },
      { name: 'grade_pct', type: 'DECIMAL(8,4)', nullable: false },
      { name: 'status', type: 'ENUM("sampled","assayed","classified","archived")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/ore-grade-control-system', description: 'Record grade', permission: 'ore-grade-control-system.create', authRequired: true },
      { method: 'GET', path: '/api/v1/ore-grade-control-system', description: 'List records', permission: 'ore-grade-control-system.view', authRequired: true },
      { method: 'GET', path: '/api/v1/ore-grade-control-system/{id}', description: 'Get record details', permission: 'ore-grade-control-system.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/ore-grade-control-system/{id}', description: 'Update record', permission: 'ore-grade-control-system.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/ore-grade-control-system/{id}', description: 'Archive record', permission: 'ore-grade-control-system.delete', authRequired: true }
    ],
    services: ['GradeControlService', 'AssayReconciliationService'],
    events: ['SampleAssayed', 'GradeMapGenerated', 'ReconciliationCompleted'],
    jobs: ['ProcessAssayResultsJob', 'GenerateGradeControlMapsJob'],
    dependencies: [1],
    tests: ['GradeControlTest', 'AssayReconciliationTest']
  }),
  buildModule({
    id: 868,
    name: 'Drilling & Blasting Planner',
    slug: 'drilling-blasting-planner',
    category: 'Mining & Natural Resources',
    phase: 39,
    iconName: 'Target',
    purpose: 'Plan drill patterns, blast designs, and manage explosive initiation sequences.',
    responsibilities: [
      'Design drill hole patterns based on rock mass properties',
      'Calculate explosive charges and detonation sequences',
      'Track post-blast fragmentation and vibration results'
    ],
    tableName: 'drilling_blasting_records',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'blast_name', type: 'VARCHAR(255)', nullable: false },
      { name: 'hole_count', type: 'INT', nullable: false },
      { name: 'status', type: 'ENUM("planned","drilling","charged","detonated","archived")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/drilling-blasting-planner', description: 'Create blast plan', permission: 'drilling-blasting-planner.create', authRequired: true },
      { method: 'GET', path: '/api/v1/drilling-blasting-planner', description: 'List blast plans', permission: 'drilling-blasting-planner.view', authRequired: true },
      { method: 'GET', path: '/api/v1/drilling-blasting-planner/{id}', description: 'Get plan details', permission: 'drilling-blasting-planner.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/drilling-blasting-planner/{id}', description: 'Update plan', permission: 'drilling-blasting-planner.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/drilling-blasting-planner/{id}', description: 'Archive plan', permission: 'drilling-blasting-planner.delete', authRequired: true }
    ],
    services: ['BlastDesignService', 'VibrationMonitoringService'],
    events: ['BlastPlanCreated', 'BlastDetonated', 'VibrationRecorded'],
    jobs: ['DesignBlastPatternsJob', 'MonitorBlastVibrationsJob'],
    dependencies: [1],
    tests: ['BlastDesignTest', 'VibrationMonitoringTest']
  }),
  buildModule({
    id: 869,
    name: 'Mineral Exploration Logger',
    slug: 'mineral-exploration-logger',
    category: 'Mining & Natural Resources',
    phase: 39,
    iconName: 'Map',
    purpose: 'Log geological field observations, drill hole data, and exploration assay results.',
    responsibilities: [
      'Record field mapping observations and rock descriptions',
      'Track drill hole collar coordinates and assay intervals',
      'Generate resource estimation geological models'
    ],
    tableName: 'exploration_logs',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'drill_hole_id', type: 'VARCHAR(64)', nullable: true, index: true },
      { name: 'geological_domain', type: 'VARCHAR(128)', nullable: false },
      { name: 'status', type: 'ENUM("logged","assayed","interpreted","archived")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/mineral-exploration-logger', description: 'Log observation', permission: 'mineral-exploration-logger.create', authRequired: true },
      { method: 'GET', path: '/api/v1/mineral-exploration-logger', description: 'List logs', permission: 'mineral-exploration-logger.view', authRequired: true },
      { method: 'GET', path: '/api/v1/mineral-exploration-logger/{id}', description: 'Get log details', permission: 'mineral-exploration-logger.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/mineral-exploration-logger/{id}', description: 'Update log', permission: 'mineral-exploration-logger.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/mineral-exploration-logger/{id}', description: 'Archive log', permission: 'mineral-exploration-logger.delete', authRequired: true }
    ],
    services: ['ExplorationLoggingService', 'ResourceEstimationService'],
    events: ['ObservationLogged', 'AssayResultRecorded', 'ResourceModelUpdated'],
    jobs: ['LogExplorationDataJob', 'GenerateResourceModelJob'],
    dependencies: [1],
    tests: ['ExplorationLoggingTest', 'ResourceEstimationTest']
  }),
  buildModule({
    id: 870,
    name: 'Mine Ventilation Monitor',
    slug: 'mine-ventilation-monitor',
    category: 'Mining & Natural Resources',
    phase: 39,
    iconName: 'Wind',
    purpose: 'Monitor underground mine ventilation systems for airflow, gas, and temperature.',
    responsibilities: [
      'Track airflow volumes and velocities through mine workings',
      'Monitor methane, CO, and dust concentrations in real time',
      'Alert on ventilation system failures or degraded conditions'
    ],
    tableName: 'ventilation_monitor_records',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'sensor_id', type: 'VARCHAR(64)', nullable: false },
      { name: 'reading_type', type: 'VARCHAR(64)', nullable: false },
      { name: 'status', type: 'ENUM("normal","warning","critical","offline","archived")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/mine-ventilation-monitor', description: 'Record reading', permission: 'mine-ventilation-monitor.create', authRequired: true },
      { method: 'GET', path: '/api/v1/mine-ventilation-monitor', description: 'List readings', permission: 'mine-ventilation-monitor.view', authRequired: true },
      { method: 'GET', path: '/api/v1/mine-ventilation-monitor/{id}', description: 'Get reading details', permission: 'mine-ventilation-monitor.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/mine-ventilation-monitor/{id}', description: 'Update reading', permission: 'mine-ventilation-monitor.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/mine-ventilation-monitor/{id}', description: 'Archive reading', permission: 'mine-ventilation-monitor.delete', authRequired: true }
    ],
    services: ['VentilationSensorService', 'GasConcentrationService'],
    events: ['ReadingRecorded', 'GasLevelExceeded', 'VentilationFailureDetected'],
    jobs: ['PollVentilationSensorsJob', 'MonitorGasLevelsJob'],
    dependencies: [1],
    tests: ['VentilationSensorTest', 'GasConcentrationTest']
  }),
  buildModule({
    id: 871,
    name: 'Heavy Equipment Fleet Tracker',
    slug: 'heavy-equipment-fleet-tracker',
    category: 'Mining & Natural Resources',
    phase: 39,
    iconName: 'Truck',
    purpose: 'Track and manage heavy mining equipment fleet, usage, and maintenance schedules.',
    responsibilities: [
      'Monitor equipment location, hours, and fuel consumption',
      'Schedule preventive maintenance and track work orders',
      'Optimize fleet utilization across mine areas'
    ],
    tableName: 'equipment_fleet_records',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'equipment_id', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'equipment_type', type: 'VARCHAR(64)', nullable: false },
      { name: 'status', type: 'ENUM("operational","maintenance","standby","retired","archived")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/heavy-equipment-fleet-tracker', description: 'Register equipment', permission: 'heavy-equipment-fleet-tracker.create', authRequired: true },
      { method: 'GET', path: '/api/v1/heavy-equipment-fleet-tracker', description: 'List equipment', permission: 'heavy-equipment-fleet-tracker.view', authRequired: true },
      { method: 'GET', path: '/api/v1/heavy-equipment-fleet-tracker/{id}', description: 'Get equipment details', permission: 'heavy-equipment-fleet-tracker.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/heavy-equipment-fleet-tracker/{id}', description: 'Update equipment', permission: 'heavy-equipment-fleet-tracker.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/heavy-equipment-fleet-tracker/{id}', description: 'Archive record', permission: 'heavy-equipment-fleet-tracker.delete', authRequired: true }
    ],
    services: ['FleetTrackingService', 'MaintenanceSchedulingService'],
    events: ['EquipmentRegistered', 'MaintenanceScheduled', 'FleetUtilizationUpdated'],
    jobs: ['TrackFleetUtilizationJob', 'ScheduleEquipmentMaintenanceJob'],
    dependencies: [1],
    tests: ['FleetTrackingTest', 'MaintenanceSchedulingTest']
  }),
  buildModule({
    id: 872,
    name: 'Tailings Dam Monitor',
    slug: 'tailings-dam-monitor',
    category: 'Mining & Natural Resources',
    phase: 39,
    iconName: 'Droplets',
    purpose: 'Monitor tailings dam stability, pore pressure, and embankment deformation.',
    responsibilities: [
      'Track piezometer readings and pore water pressure',
      'Monitor surface displacement via InSAR and survey data',
      'Alert on dam stability threshold exceedances'
    ],
    tableName: 'tailings_dam_records',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'dam_id', type: 'VARCHAR(64)', nullable: false },
      { name: 'monitoring_type', type: 'VARCHAR(64)', nullable: false },
      { name: 'status', type: 'ENUM("normal","elevated","critical","archived")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/tailings-dam-monitor', description: 'Record monitoring data', permission: 'tailings-dam-monitor.create', authRequired: true },
      { method: 'GET', path: '/api/v1/tailings-dam-monitor', description: 'List records', permission: 'tailings-dam-monitor.view', authRequired: true },
      { method: 'GET', path: '/api/v1/tailings-dam-monitor/{id}', description: 'Get record details', permission: 'tailings-dam-monitor.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/tailings-dam-monitor/{id}', description: 'Update record', permission: 'tailings-dam-monitor.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/tailings-dam-monitor/{id}', description: 'Archive record', permission: 'tailings-dam-monitor.delete', authRequired: true }
    ],
    services: ['DamStabilityService', 'PorePressureService'],
    events: ['MonitoringDataRecorded', 'StabilityThresholdBreached', 'DamAlertIssued'],
    jobs: ['PollDamSensorsJob', 'AssessDamStabilityJob'],
    dependencies: [1],
    tests: ['DamStabilityTest', 'PorePressureTest']
  }),
  buildModule({
    id: 873,
    name: 'Mine Water Management',
    slug: 'mine-water-management',
    category: 'Mining & Natural Resources',
    phase: 39,
    iconName: 'Droplet',
    purpose: 'Manage mine dewatering, water treatment, and discharge compliance.',
    responsibilities: [
      'Monitor water inflow rates and dewatering pump performance',
      'Track water quality parameters for discharge compliance',
      'Optimize water recycling and tailings thickener operations'
    ],
    tableName: 'mine_water_records',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'water_body', type: 'VARCHAR(128)', nullable: false },
      { name: 'parameter_type', type: 'VARCHAR(64)', nullable: false },
      { name: 'status', type: 'ENUM("compliant","non_compliant","under_review","archived")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/mine-water-management', description: 'Record data', permission: 'mine-water-management.create', authRequired: true },
      { method: 'GET', path: '/api/v1/mine-water-management', description: 'List records', permission: 'mine-water-management.view', authRequired: true },
      { method: 'GET', path: '/api/v1/mine-water-management/{id}', description: 'Get record details', permission: 'mine-water-management.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/mine-water-management/{id}', description: 'Update record', permission: 'mine-water-management.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/mine-water-management/{id}', description: 'Archive record', permission: 'mine-water-management.delete', authRequired: true }
    ],
    services: ['DewateringService', 'WaterQualityService'],
    events: ['WaterDataRecorded', 'DischargeExceeded', 'RecyclingOptimized'],
    jobs: ['MonitorDewateringPumpsJob', 'CheckWaterQualityJob'],
    dependencies: [1],
    tests: ['DewateringTest', 'WaterQualityTest']
  }),
  buildModule({
    id: 874,
    name: 'Geological Survey Database',
    slug: 'geological-survey-database',
    category: 'Mining & Natural Resources',
    phase: 39,
    iconName: 'Database',
    purpose: 'Store and manage geological survey data including core samples, assays, and models.',
    responsibilities: [
      'Catalogue core sample intervals and lithological descriptions',
      'Maintain drill hole databases with collar and survey data',
      'Support resource estimation with validated geological datasets'
    ],
    tableName: 'geological_survey_records',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'drill_hole_id', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'survey_type', type: 'VARCHAR(64)', nullable: false },
      { name: 'status', type: 'ENUM("collected","validated","interpreted","archived")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/geological-survey-database', description: 'Record survey', permission: 'geological-survey-database.create', authRequired: true },
      { method: 'GET', path: '/api/v1/geological-survey-database', description: 'List records', permission: 'geological-survey-database.view', authRequired: true },
      { method: 'GET', path: '/api/v1/geological-survey-database/{id}', description: 'Get record details', permission: 'geological-survey-database.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/geological-survey-database/{id}', description: 'Update record', permission: 'geological-survey-database.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/geological-survey-database/{id}', description: 'Archive record', permission: 'geological-survey-database.delete', authRequired: true }
    ],
    services: ['SurveyDatabaseService', 'CoreSampleService'],
    events: ['SurveyRecorded', 'CoreSampleCatalogued', 'GeologicalModelUpdated'],
    jobs: ['CatalogueCoreSamplesJob', 'ValidateGeologicalDataJob'],
    dependencies: [1],
    tests: ['SurveyDatabaseTest', 'CoreSampleTest']
  }),
  buildModule({
    id: 875,
    name: 'Blasting Fragmentation Analyzer',
    slug: 'blasting-fragmentation-analyzer',
    category: 'Mining & Natural Resources',
    phase: 39,
    iconName: 'Zap',
    purpose: 'Analyze post-blast fragmentation size distribution to optimize blasting parameters.',
    responsibilities: [
      'Capture and analyze fragmentation images after blasts',
      'Calculate P50, P80, and uniformity indices',
      'Recommend blast design adjustments for improved fragmentation'
    ],
    tableName: 'fragmentation_analysis_records',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'blast_name', type: 'VARCHAR(255)', nullable: false },
      { name: 'p80_size_mm', type: 'DECIMAL(8,2)', nullable: false },
      { name: 'status', type: 'ENUM("analyzed","optimized","archived")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/blasting-fragmentation-analyzer', description: 'Record analysis', permission: 'blasting-fragmentation-analyzer.create', authRequired: true },
      { method: 'GET', path: '/api/v1/blasting-fragmentation-analyzer', description: 'List analyses', permission: 'blasting-fragmentation-analyzer.view', authRequired: true },
      { method: 'GET', path: '/api/v1/blasting-fragmentation-analyzer/{id}', description: 'Get analysis details', permission: 'blasting-fragmentation-analyzer.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/blasting-fragmentation-analyzer/{id}', description: 'Update analysis', permission: 'blasting-fragmentation-analyzer.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/blasting-fragmentation-analyzer/{id}', description: 'Archive analysis', permission: 'blasting-fragmentation-analyzer.delete', authRequired: true }
    ],
    services: ['FragmentationAnalysisService', 'BlastOptimizationService'],
    events: ['AnalysisRecorded', 'FragmentationMeasured', 'BlastDesignRecommended'],
    jobs: ['AnalyzeFragmentationJob', 'RecommendBlastDesignJob'],
    dependencies: [1],
    tests: ['FragmentationAnalysisTest', 'BlastOptimizationTest']
  }),
  buildModule({
    id: 876,
    name: 'Mine Haul Road Optimizer',
    slug: 'mine-haul-road-optimizer',
    category: 'Mining & Natural Resources',
    phase: 39,
    iconName: 'Route',
    purpose: 'Optimize haul road layouts and truck cycle times for improved mining productivity.',
    responsibilities: [
      'Model haul road gradients, curves, and surface conditions',
      'Track truck speeds, cycle times, and fuel consumption per route',
      'Recommend road maintenance and realignment priorities'
    ],
    tableName: 'haul_road_records',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'road_segment', type: 'VARCHAR(128)', nullable: false },
      { name: 'avg_speed_kph', type: 'DECIMAL(6,2)', nullable: false },
      { name: 'status', type: 'ENUM("active","maintenance_needed","optimized","archived")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/mine-haul-road-optimizer', description: 'Record road data', permission: 'mine-haul-road-optimizer.create', authRequired: true },
      { method: 'GET', path: '/api/v1/mine-haul-road-optimizer', description: 'List records', permission: 'mine-haul-road-optimizer.view', authRequired: true },
      { method: 'GET', path: '/api/v1/mine-haul-road-optimizer/{id}', description: 'Get record details', permission: 'mine-haul-road-optimizer.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/mine-haul-road-optimizer/{id}', description: 'Update record', permission: 'mine-haul-road-optimizer.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/mine-haul-road-optimizer/{id}', description: 'Archive record', permission: 'mine-haul-road-optimizer.delete', authRequired: true }
    ],
    services: ['HaulRoadModelingService', 'CycleTimeAnalysisService'],
    events: ['RoadDataRecorded', 'CycleTimeOptimized', 'RoadMaintenanceScheduled'],
    jobs: ['AnalyzeHaulRoadsJob', 'OptimizeTruckCyclesJob'],
    dependencies: [1],
    tests: ['HaulRoadModelingTest', 'CycleTimeAnalysisTest']
  }),
  buildModule({
    id: 877,
    name: 'Ore Processing Plant Manager',
    slug: 'ore-processing-plant-manager',
    category: 'Mining & Natural Resources',
    phase: 39,
    iconName: 'Factory',
    purpose: 'Manage ore processing plant operations including crushing, grinding, and flotation.',
    responsibilities: [
      'Track plant throughput, recovery rates, and reagent consumption',
      'Monitor crusher and mill performance parameters',
      'Optimize flotation circuit for maximum metal recovery'
    ],
    tableName: 'processing_plant_records',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'plant_section', type: 'VARCHAR(64)', nullable: false },
      { name: 'throughput_tph', type: 'DECIMAL(8,2)', nullable: false },
      { name: 'status', type: 'ENUM("operating","maintenance","standby","archived")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/ore-processing-plant-manager', description: 'Record plant data', permission: 'ore-processing-plant-manager.create', authRequired: true },
      { method: 'GET', path: '/api/v1/ore-processing-plant-manager', description: 'List records', permission: 'ore-processing-plant-manager.view', authRequired: true },
      { method: 'GET', path: '/api/v1/ore-processing-plant-manager/{id}', description: 'Get record details', permission: 'ore-processing-plant-manager.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/ore-processing-plant-manager/{id}', description: 'Update record', permission: 'ore-processing-plant-manager.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/ore-processing-plant-manager/{id}', description: 'Archive record', permission: 'ore-processing-plant-manager.delete', authRequired: true }
    ],
    services: ['PlantOperationsService', 'RecoveryOptimizationService'],
    events: ['PlantDataRecorded', 'RecoveryRateUpdated', 'OptimizationRecommended'],
    jobs: ['MonitorPlantPerformanceJob', 'OptimizeFlotationCircuitJob'],
    dependencies: [1],
    tests: ['PlantOperationsTest', 'RecoveryOptimizationTest']
  }),
  buildModule({
    id: 878,
    name: 'Mining Claim Registry',
    slug: 'mining-claim-registry',
    category: 'Mining & Natural Resources',
    phase: 39,
    iconName: 'FileCheck',
    purpose: 'Register and track mining claims, lease boundaries, and title documentation.',
    responsibilities: [
      'Record claim applications with boundary coordinates',
      'Track claim renewal dates and annual maintenance fees',
      'Manage claim transfers, mergers, and relinquishments'
    ],
    tableName: 'mining_claims',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'claim_number', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'commodity', type: 'VARCHAR(64)', nullable: false },
      { name: 'status', type: 'ENUM("active","pending","lapsed","archived")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/mining-claim-registry', description: 'Register claim', permission: 'mining-claim-registry.create', authRequired: true },
      { method: 'GET', path: '/api/v1/mining-claim-registry', description: 'List claims', permission: 'mining-claim-registry.view', authRequired: true },
      { method: 'GET', path: '/api/v1/mining-claim-registry/{id}', description: 'Get claim details', permission: 'mining-claim-registry.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/mining-claim-registry/{id}', description: 'Update claim', permission: 'mining-claim-registry.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/mining-claim-registry/{id}', description: 'Archive claim', permission: 'mining-claim-registry.delete', authRequired: true }
    ],
    services: ['ClaimRegistryService', 'TitleManagementService'],
    events: ['ClaimRegistered', 'ClaimRenewalDue', 'ClaimTransferred'],
    jobs: ['TrackClaimExpiryJob', 'ProcessClaimApplicationsJob'],
    dependencies: [1],
    tests: ['ClaimRegistryTest', 'TitleManagementTest']
  }),
  buildModule({
    id: 879,
    name: 'Mine Reclamation Planner',
    slug: 'mine-reclamation-planner',
    category: 'Mining & Natural Resources',
    phase: 39,
    iconName: 'TreePine',
    purpose: 'Plan and track mine site reclamation, rehabilitation, and closure activities.',
    responsibilities: [
      'Develop reclamation plans for mined-out areas',
      'Track revegetation progress and soil restoration',
      'Manage reclamation bond releases and regulatory sign-off'
    ],
    tableName: 'reclamation_plans',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'area_id', type: 'VARCHAR(64)', nullable: false },
      { name: 'reclamation_type', type: 'VARCHAR(64)', nullable: false },
      { name: 'status', type: 'ENUM("planned","in_progress","completed","verified","archived")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/mine-reclamation-planner', description: 'Create reclamation plan', permission: 'mine-reclamation-planner.create', authRequired: true },
      { method: 'GET', path: '/api/v1/mine-reclamation-planner', description: 'List plans', permission: 'mine-reclamation-planner.view', authRequired: true },
      { method: 'GET', path: '/api/v1/mine-reclamation-planner/{id}', description: 'Get plan details', permission: 'mine-reclamation-planner.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/mine-reclamation-planner/{id}', description: 'Update plan', permission: 'mine-reclamation-planner.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/mine-reclamation-planner/{id}', description: 'Archive plan', permission: 'mine-reclamation-planner.delete', authRequired: true }
    ],
    services: ['ReclamationPlanningService', 'BondReleaseService'],
    events: ['PlanCreated', 'RevegetationStarted', 'BondReleased'],
    jobs: ['DevelopReclamationPlansJob', 'TrackRevegetationProgressJob'],
    dependencies: [1],
    tests: ['ReclamationPlanningTest', 'BondReleaseTest']
  }),
  buildModule({
    id: 880,
    name: 'Survey Control Network',
    slug: 'survey-control-network',
    category: 'Mining & Natural Resources',
    phase: 39,
    iconName: 'Crosshair',
    purpose: 'Manage mine survey control points, coordinate systems, and survey measurements.',
    responsibilities: [
      'Establish and maintain survey control network across mine',
      'Track GPS/GNSS station positions and adjustments',
      'Support open pit and underground survey workflows'
    ],
    tableName: 'survey_control_records',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'point_id', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'coordinate_system', type: 'VARCHAR(64)', nullable: false },
      { name: 'status', type: 'ENUM("active","adjusted","deprecated","archived")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/survey-control-network', description: 'Record control point', permission: 'survey-control-network.create', authRequired: true },
      { method: 'GET', path: '/api/v1/survey-control-network', description: 'List control points', permission: 'survey-control-network.view', authRequired: true },
      { method: 'GET', path: '/api/v1/survey-control-network/{id}', description: 'Get point details', permission: 'survey-control-network.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/survey-control-network/{id}', description: 'Update point', permission: 'survey-control-network.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/survey-control-network/{id}', description: 'Archive point', permission: 'survey-control-network.delete', authRequired: true }
    ],
    services: ['SurveyControlService', 'CoordinateAdjustmentService'],
    events: ['ControlPointRecorded', 'NetworkAdjusted', 'SurveyCompleted'],
    jobs: ['MaintainControlNetworkJob', 'AdjustCoordinatesJob'],
    dependencies: [1],
    tests: ['SurveyControlTest', 'CoordinateAdjustmentTest']
  }),
  buildModule({
    id: 881,
    name: 'Ventilation Air Quality Monitor',
    slug: 'ventilation-air-quality-monitor',
    category: 'Mining & Natural Resources',
    phase: 39,
    iconName: 'Activity',
    purpose: 'Monitor air quality parameters in underground mine ventilation circuits.',
    responsibilities: [
      'Track dust, silica, and diesel particulate matter levels',
      'Monitor oxygen depletion and toxic gas concentrations',
      'Generate air quality compliance reports for regulators'
    ],
    tableName: 'air_quality_monitor_records',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'monitoring_station', type: 'VARCHAR(64)', nullable: false },
      { name: 'parameter', type: 'VARCHAR(64)', nullable: false },
      { name: 'status', type: 'ENUM("normal","warning","exceedance","archived")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/ventilation-air-quality-monitor', description: 'Record reading', permission: 'ventilation-air-quality-monitor.create', authRequired: true },
      { method: 'GET', path: '/api/v1/ventilation-air-quality-monitor', description: 'List readings', permission: 'ventilation-air-quality-monitor.view', authRequired: true },
      { method: 'GET', path: '/api/v1/ventilation-air-quality-monitor/{id}', description: 'Get reading details', permission: 'ventilation-air-quality-monitor.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/ventilation-air-quality-monitor/{id}', description: 'Update reading', permission: 'ventilation-air-quality-monitor.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/ventilation-air-quality-monitor/{id}', description: 'Archive reading', permission: 'ventilation-air-quality-monitor.delete', authRequired: true }
    ],
    services: ['AirQualitySensorService', 'DustMonitoringService'],
    events: ['AirQualityRecorded', 'ExceedanceDetected', 'ComplianceReportGenerated'],
    jobs: ['PollAirQualitySensorsJob', 'GenerateAirQualityReportJob'],
    dependencies: [1],
    tests: ['AirQualitySensorTest', 'DustMonitoringTest']
  }),
  buildModule({
    id: 882,
    name: 'Mine Ground Control Monitor',
    slug: 'mine-ground-control-monitor',
    category: 'Mining & Natural Resources',
    phase: 39,
    iconName: 'Mountain',
    purpose: 'Monitor ground movement and stability in underground and open pit mines.',
    responsibilities: [
      'Track convergence measurements and extensometer data',
      'Monitor slope movement via prisms and radar systems',
      'Alert on ground instability that threatens safety'
    ],
    tableName: 'ground_control_records',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'monitoring_station', type: 'VARCHAR(64)', nullable: false },
      { name: 'measurement_type', type: 'VARCHAR(64)', nullable: false },
      { name: 'status', type: 'ENUM("stable","moving","critical","archived")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/mine-ground-control-monitor', description: 'Record measurement', permission: 'mine-ground-control-monitor.create', authRequired: true },
      { method: 'GET', path: '/api/v1/mine-ground-control-monitor', description: 'List measurements', permission: 'mine-ground-control-monitor.view', authRequired: true },
      { method: 'GET', path: '/api/v1/mine-ground-control-monitor/{id}', description: 'Get measurement details', permission: 'mine-ground-control-monitor.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/mine-ground-control-monitor/{id}', description: 'Update measurement', permission: 'mine-ground-control-monitor.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/mine-ground-control-monitor/{id}', description: 'Archive measurement', permission: 'mine-ground-control-monitor.delete', authRequired: true }
    ],
    services: ['GroundControlService', 'SlopeStabilityService'],
    events: ['MeasurementRecorded', 'GroundMovementDetected', 'StabilityAlertIssued'],
    jobs: ['MonitorGroundMovementJob', 'AnalyzeSlopeStabilityJob'],
    dependencies: [1],
    tests: ['GroundControlTest', 'SlopeStabilityTest']
  }),
  buildModule({
    id: 883,
    name: 'Mineral Rights Royalty Tracker',
    slug: 'mineral-rights-royalty-tracker',
    category: 'Mining & Natural Resources',
    phase: 39,
    iconName: 'DollarSign',
    purpose: 'Track mineral rights ownership, royalty payments, and production-based royalties.',
    responsibilities: [
      'Record mineral rights ownership and lease terms',
      'Calculate royalties based on production volumes and commodity prices',
      'Manage royalty payments to landowners and governments'
    ],
    tableName: 'royalty_records',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'rights_holder', type: 'VARCHAR(255)', nullable: false },
      { name: 'royalty_rate_pct', type: 'DECIMAL(5,2)', nullable: false },
      { name: 'status', type: 'ENUM("active","payment_pending","archived")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/mineral-rights-royalty-tracker', description: 'Record royalty', permission: 'mineral-rights-royalty-tracker.create', authRequired: true },
      { method: 'GET', path: '/api/v1/mineral-rights-royalty-tracker', description: 'List records', permission: 'mineral-rights-royalty-tracker.view', authRequired: true },
      { method: 'GET', path: '/api/v1/mineral-rights-royalty-tracker/{id}', description: 'Get record details', permission: 'mineral-rights-royalty-tracker.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/mineral-rights-royalty-tracker/{id}', description: 'Update record', permission: 'mineral-rights-royalty-tracker.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/mineral-rights-royalty-tracker/{id}', description: 'Archive record', permission: 'mineral-rights-royalty-tracker.delete', authRequired: true }
    ],
    services: ['RoyaltyCalculationService', 'RightsRegistryService'],
    events: ['RoyaltyCalculated', 'PaymentProcessed', 'RightsTransferred'],
    jobs: ['CalculateProductionRoyaltiesJob', 'ProcessRoyaltyPaymentsJob'],
    dependencies: [1],
    tests: ['RoyaltyCalculationTest', 'RightsRegistryTest']
  }),
  buildModule({
    id: 884,
    name: 'Drilling Mud Log System',
    slug: 'drilling-mud-log-system',
    category: 'Mining & Natural Resources',
    phase: 39,
    iconName: 'FileText',
    purpose: 'Log drilling mud parameters, cuttings analysis, and wellbore conditions during drilling.',
    responsibilities: [
      'Record mud weight, viscosity, and pH readings at intervals',
      'Track cutting descriptions and lithological changes',
      'Monitor wellbore stability indicators during drilling'
    ],
    tableName: 'mud_log_records',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'drill_hole_id', type: 'VARCHAR(64)', nullable: false },
      { name: 'depth_m', type: 'DECIMAL(10,2)', nullable: false },
      { name: 'status', type: 'ENUM("recording","reviewed","validated","archived")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/drilling-mud-log-system', description: 'Record mud data', permission: 'drilling-mud-log-system.create', authRequired: true },
      { method: 'GET', path: '/api/v1/drilling-mud-log-system', description: 'List logs', permission: 'drilling-mud-log-system.view', authRequired: true },
      { method: 'GET', path: '/api/v1/drilling-mud-log-system/{id}', description: 'Get log details', permission: 'drilling-mud-log-system.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/drilling-mud-log-system/{id}', description: 'Update log', permission: 'drilling-mud-log-system.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/drilling-mud-log-system/{id}', description: 'Archive log', permission: 'drilling-mud-log-system.delete', authRequired: true }
    ],
    services: ['MudLogService', 'CuttingsAnalysisService'],
    events: ['MudDataRecorded', 'CuttingsLogged', 'WellboreAlertTriggered'],
    jobs: ['RecordMudLogDataJob', 'AnalyzeCuttingsJob'],
    dependencies: [1],
    tests: ['MudLogTest', 'CuttingsAnalysisTest']
  }),
  buildModule({
    id: 885,
    name: 'Mine Stockpile Inventory',
    slug: 'mine-stockpile-inventory',
    category: 'Mining & Natural Resources',
    phase: 39,
    iconName: 'Package',
    purpose: 'Track ore and waste stockpile volumes, grades, and movement between stockpile areas.',
    responsibilities: [
      'Monitor stockpile volumes via drone surveys and LiDAR',
      'Track grade variability within and across stockpiles',
      'Manage stockpile blending for plant feed optimization'
    ],
    tableName: 'stockpile_inventory_records',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'stockpile_id', type: 'VARCHAR(64)', nullable: false },
      { name: 'volume_tonnes', type: 'DECIMAL(12,2)', nullable: false },
      { name: 'status', type: 'ENUM("active","blending","depleted","archived")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/mine-stockpile-inventory', description: 'Record stockpile', permission: 'mine-stockpile-inventory.create', authRequired: true },
      { method: 'GET', path: '/api/v1/mine-stockpile-inventory', description: 'List records', permission: 'mine-stockpile-inventory.view', authRequired: true },
      { method: 'GET', path: '/api/v1/mine-stockpile-inventory/{id}', description: 'Get record details', permission: 'mine-stockpile-inventory.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/mine-stockpile-inventory/{id}', description: 'Update record', permission: 'mine-stockpile-inventory.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/mine-stockpile-inventory/{id}', description: 'Archive record', permission: 'mine-stockpile-inventory.delete', authRequired: true }
    ],
    services: ['StockpileMeasurementService', 'BlendingOptimizationService'],
    events: ['StockpileMeasured', 'GradeUpdated', 'BlendingOptimized'],
    jobs: ['MeasureStockpileVolumesJob', 'OptimizeStockpileBlendingJob'],
    dependencies: [1],
    tests: ['StockpileMeasurementTest', 'BlendingOptimizationTest']
  }),
  buildModule({
    id: 886,
    name: 'Crushing Circuit Optimizer',
    slug: 'crushing-circuit-optimizer',
    category: 'Mining & Natural Resources',
    phase: 39,
    iconName: 'Settings',
    purpose: 'Optimize crushing circuit performance for throughput and product size distribution.',
    responsibilities: [
      'Monitor crusher settings, power draw, and liner wear',
      'Track product size distribution and circulating load',
      'Recommend crusher parameter adjustments for efficiency'
    ],
    tableName: 'crushing_circuit_records',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'crusher_id', type: 'VARCHAR(64)', nullable: false },
      { name: 'throughput_tph', type: 'DECIMAL(8,2)', nullable: false },
      { name: 'status', type: 'ENUM("operating","optimizing","maintenance","archived")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/crushing-circuit-optimizer', description: 'Record data', permission: 'crushing-circuit-optimizer.create', authRequired: true },
      { method: 'GET', path: '/api/v1/crushing-circuit-optimizer', description: 'List records', permission: 'crushing-circuit-optimizer.view', authRequired: true },
      { method: 'GET', path: '/api/v1/crushing-circuit-optimizer/{id}', description: 'Get record details', permission: 'crushing-circuit-optimizer.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/crushing-circuit-optimizer/{id}', description: 'Update record', permission: 'crushing-circuit-optimizer.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/crushing-circuit-optimizer/{id}', description: 'Archive record', permission: 'crushing-circuit-optimizer.delete', authRequired: true }
    ],
    services: ['CrushingPerformanceService', 'SizeDistributionService'],
    events: ['CrusherDataRecorded', 'OptimizationRecommended', 'LinerWearAlert'],
    jobs: ['MonitorCrushingPerformanceJob', 'RecommendCrusherSettingsJob'],
    dependencies: [1],
    tests: ['CrushingPerformanceTest', 'SizeDistributionTest']
  }),
  buildModule({
    id: 887,
    name: 'Mining Permit Compliance',
    slug: 'mining-permit-compliance',
    category: 'Mining & Natural Resources',
    phase: 39,
    iconName: 'FileCheck',
    purpose: 'Track mining permits, environmental conditions, and compliance reporting deadlines.',
    responsibilities: [
      'Manage permit conditions and compliance obligations',
      'Track reporting deadlines for environmental and operational reports',
      'Alert on upcoming permit renewals and compliance gaps'
    ],
    tableName: 'mining_permit_records',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'permit_number', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'permit_type', type: 'VARCHAR(64)', nullable: false },
      { name: 'status', type: 'ENUM("active","renewal_pending","expired","archived")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/mining-permit-compliance', description: 'Register permit', permission: 'mining-permit-compliance.create', authRequired: true },
      { method: 'GET', path: '/api/v1/mining-permit-compliance', description: 'List permits', permission: 'mining-permit-compliance.view', authRequired: true },
      { method: 'GET', path: '/api/v1/mining-permit-compliance/{id}', description: 'Get permit details', permission: 'mining-permit-compliance.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/mining-permit-compliance/{id}', description: 'Update permit', permission: 'mining-permit-compliance.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/mining-permit-compliance/{id}', description: 'Archive permit', permission: 'mining-permit-compliance.delete', authRequired: true }
    ],
    services: ['PermitComplianceService', 'ReportingDeadlineService'],
    events: ['PermitRegistered', 'ReportingDeadlineApproaching', 'ComplianceGapDetected'],
    jobs: ['TrackPermitComplianceJob', 'MonitorReportingDeadlinesJob'],
    dependencies: [1],
    tests: ['PermitComplianceTest', 'ReportingDeadlineTest']
  }),
  buildModule({
    id: 888,
    name: 'Environmental Mine Audit',
    slug: 'environmental-mine-audit',
    category: 'Mining & Natural Resources',
    phase: 39,
    iconName: 'ClipboardCheck',
    purpose: 'Conduct and track environmental audits at mine sites for regulatory compliance.',
    responsibilities: [
      'Schedule and conduct environmental audits across mine sites',
      'Document findings and corrective action requirements',
      'Track audit closure and regulatory acceptance'
    ],
    tableName: 'environmental_mine_audits',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'site_name', type: 'VARCHAR(255)', nullable: false },
      { name: 'audit_scope', type: 'VARCHAR(128)', nullable: false },
      { name: 'status', type: 'ENUM("planned","in_progress","findings_issued","closed","archived")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/environmental-mine-audit', description: 'Create audit', permission: 'environmental-mine-audit.create', authRequired: true },
      { method: 'GET', path: '/api/v1/environmental-mine-audit', description: 'List audits', permission: 'environmental-mine-audit.view', authRequired: true },
      { method: 'GET', path: '/api/v1/environmental-mine-audit/{id}', description: 'Get audit details', permission: 'environmental-mine-audit.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/environmental-mine-audit/{id}', description: 'Update audit', permission: 'environmental-mine-audit.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/environmental-mine-audit/{id}', description: 'Archive audit', permission: 'environmental-mine-audit.delete', authRequired: true }
    ],
    services: ['MineAuditService', 'AuditFindingService'],
    events: ['AuditScheduled', 'AuditFindingRecorded', 'AuditClosed'],
    jobs: ['ScheduleMineAuditsJob', 'TrackAuditFindingsJob'],
    dependencies: [1],
    tests: ['MineAuditTest', 'AuditFindingTest']
  }),
  buildModule({
    id: 889,
    name: 'Mine Worker Training Tracker',
    slug: 'mine-worker-training-tracker',
    category: 'Mining & Natural Resources',
    phase: 39,
    iconName: 'GraduationCap',
    purpose: 'Track mine worker training records, certifications, and competency assessments.',
    responsibilities: [
      'Record mandatory safety training completions per worker',
      'Track certification expiry dates and renewal requirements',
      'Generate training compliance reports for regulators'
    ],
    tableName: 'mine_training_records',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'worker_id', type: 'BIGINT UNSIGNED', nullable: false },
      { name: 'training_module', type: 'VARCHAR(128)', nullable: false },
      { name: 'status', type: 'ENUM("assigned","in_progress","completed","expired","archived")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/mine-worker-training-tracker', description: 'Record training', permission: 'mine-worker-training-tracker.create', authRequired: true },
      { method: 'GET', path: '/api/v1/mine-worker-training-tracker', description: 'List records', permission: 'mine-worker-training-tracker.view', authRequired: true },
      { method: 'GET', path: '/api/v1/mine-worker-training-tracker/{id}', description: 'Get record details', permission: 'mine-worker-training-tracker.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/mine-worker-training-tracker/{id}', description: 'Update record', permission: 'mine-worker-training-tracker.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/mine-worker-training-tracker/{id}', description: 'Archive record', permission: 'mine-worker-training-tracker.delete', authRequired: true }
    ],
    services: ['TrainingTrackingService', 'CompetencyAssessmentService'],
    events: ['TrainingCompleted', 'CertificationExpiring', 'CompetencyAssessed'],
    jobs: ['TrackTrainingComplianceJob', 'NotifyCertificationExpiryJob'],
    dependencies: [1],
    tests: ['TrainingTrackingTest', 'CompetencyAssessmentTest']
  }),
  buildModule({
    id: 890,
    name: 'Autonomous Haulage System',
    slug: 'autonomous-haulage-system',
    category: 'Mining & Natural Resources',
    phase: 39,
    iconName: 'Bot',
    purpose: 'Manage and monitor autonomous haul truck fleet operations in open pit mines.',
    responsibilities: [
      'Coordinate autonomous truck dispatching and routing',
      'Monitor vehicle health and obstacle detection systems',
      'Optimize fleet productivity and collision avoidance'
    ],
    tableName: 'autonomous_haulage_records',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'vehicle_id', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'mission_type', type: 'VARCHAR(64)', nullable: false },
      { name: 'status', type: 'ENUM("dispatched","in_transit","dumping","returning","standby","archived")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/autonomous-haulage-system', description: 'Record mission', permission: 'autonomous-haulage-system.create', authRequired: true },
      { method: 'GET', path: '/api/v1/autonomous-haulage-system', description: 'List missions', permission: 'autonomous-haulage-system.view', authRequired: true },
      { method: 'GET', path: '/api/v1/autonomous-haulage-system/{id}', description: 'Get mission details', permission: 'autonomous-haulage-system.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/autonomous-haulage-system/{id}', description: 'Update mission', permission: 'autonomous-haulage-system.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/autonomous-haulage-system/{id}', description: 'Archive mission', permission: 'autonomous-haulage-system.delete', authRequired: true }
    ],
    services: ['AutonomousDispatchService', 'CollisionAvoidanceService'],
    events: ['MissionDispatched', 'ObstacleDetected', 'FleetProductivityUpdated'],
    jobs: ['DispatchAutonomousTrucksJob', 'MonitorFleetProductivityJob'],
    dependencies: [1],
    tests: ['AutonomousDispatchTest', 'CollisionAvoidanceTest']
  })
];
