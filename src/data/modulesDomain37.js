import { buildModule } from './moduleBuilderHelper';

export const modulesDomain37 = [
  buildModule({
    id: 816,
    name: 'Aircraft Maintenance Tracker',
    slug: 'aircraft-maintenance-tracker',
    category: 'Aviation & Aerospace',
    phase: 37,
    iconName: 'Wrench',
    purpose: 'Schedule and track preventive and corrective maintenance on aircraft fleets.',
    responsibilities: [
      'Plan maintenance check intervals based on flight hours',
      'Track work order completion and sign-off status',
      'Ensure compliance with airworthiness directives'
    ],
    tableName: 'aircraft_maintenance_records',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'aircraft_tail', type: 'VARCHAR(32)', nullable: false },
      { name: 'check_type', type: 'VARCHAR(64)', nullable: false },
      { name: 'status', type: 'ENUM("scheduled","in_progress","completed","overdue")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/aircraft-maintenance-tracker', description: 'Schedule maintenance', permission: 'aircraft-maintenance-tracker.create', authRequired: true },
      { method: 'GET', path: '/api/v1/aircraft-maintenance-tracker', description: 'List maintenance records', permission: 'aircraft-maintenance-tracker.view', authRequired: true },
      { method: 'GET', path: '/api/v1/aircraft-maintenance-tracker/{id}', description: 'Get record details', permission: 'aircraft-maintenance-tracker.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/aircraft-maintenance-tracker/{id}', description: 'Update record', permission: 'aircraft-maintenance-tracker.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/aircraft-maintenance-tracker/{id}', description: 'Archive record', permission: 'aircraft-maintenance-tracker.delete', authRequired: true }
    ],
    services: ['MaintenanceSchedulingService', 'AirworthinessComplianceService'],
    events: ['MaintenanceScheduled', 'WorkOrderCompleted', 'AirworthinessDirectiveIssued'],
    jobs: ['ScheduleMaintenanceChecksJob', 'CheckAirworthinessDirectivesJob'],
    dependencies: [1],
    tests: ['MaintenanceSchedulingTest', 'AirworthinessComplianceTest']
  }),
  buildModule({
    id: 817,
    name: 'Flight Operations Manager',
    slug: 'flight-operations-manager',
    category: 'Aviation & Aerospace',
    phase: 37,
    iconName: 'Plane',
    purpose: 'Manage flight scheduling, dispatch, and operational coordination for airline fleets.',
    responsibilities: [
      'Generate and optimize flight schedules',
      'Coordinate crew assignments and aircraft rotations',
      'Track real-time flight status and disruptions'
    ],
    tableName: 'flight_operations',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'flight_number', type: 'VARCHAR(16)', nullable: false, index: true },
      { name: 'departure_time', type: 'DATETIME', nullable: false },
      { name: 'status', type: 'ENUM("scheduled","boarding","departed","arrived","cancelled","diverted")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/flight-operations-manager', description: 'Create flight', permission: 'flight-operations-manager.create', authRequired: true },
      { method: 'GET', path: '/api/v1/flight-operations-manager', description: 'List flights', permission: 'flight-operations-manager.view', authRequired: true },
      { method: 'GET', path: '/api/v1/flight-operations-manager/{id}', description: 'Get flight details', permission: 'flight-operations-manager.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/flight-operations-manager/{id}', description: 'Update flight', permission: 'flight-operations-manager.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/flight-operations-manager/{id}', description: 'Cancel flight', permission: 'flight-operations-manager.delete', authRequired: true }
    ],
    services: ['FlightSchedulingService', 'CrewAssignmentService'],
    events: ['FlightScheduled', 'FlightDispatched', 'FlightStatusChanged'],
    jobs: ['GenerateFlightScheduleJob', 'CoordinateCrewAssignmentsJob'],
    dependencies: [1],
    tests: ['FlightSchedulingTest', 'CrewAssignmentTest']
  }),
  buildModule({
    id: 818,
    name: 'Airline Crew Scheduler',
    slug: 'airline-crew-scheduler',
    category: 'Aviation & Aerospace',
    phase: 37,
    iconName: 'Users',
    purpose: 'Optimize crew rostering, pairing, and duty time compliance for airlines.',
    responsibilities: [
      'Generate crew pairings that meet regulatory rest requirements',
      'Handle crew swaps, standby assignments, and disruption recovery',
      'Track pilot and cabin crew currency and qualifications'
    ],
    tableName: 'crew_schedules',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'crew_member_id', type: 'BIGINT UNSIGNED', nullable: false },
      { name: 'duty_period_hours', type: 'DECIMAL(5,2)', nullable: false },
      { name: 'status', type: 'ENUM("assigned","standby","on_duty","completed","archived")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/airline-crew-scheduler', description: 'Create schedule', permission: 'airline-crew-scheduler.create', authRequired: true },
      { method: 'GET', path: '/api/v1/airline-crew-scheduler', description: 'List schedules', permission: 'airline-crew-scheduler.view', authRequired: true },
      { method: 'GET', path: '/api/v1/airline-crew-scheduler/{id}', description: 'Get schedule details', permission: 'airline-crew-scheduler.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/airline-crew-scheduler/{id}', description: 'Update schedule', permission: 'airline-crew-scheduler.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/airline-crew-scheduler/{id}', description: 'Delete schedule', permission: 'airline-crew-scheduler.delete', authRequired: true }
    ],
    services: ['CrewRosteringService', 'DutyTimeComplianceService'],
    events: ['CrewPairingGenerated', 'CrewSwapRequested', 'DutyTimeAlertTriggered'],
    jobs: ['GenerateCrewPairingsJob', 'ValidateDutyTimeComplianceJob'],
    dependencies: [1],
    tests: ['CrewRosteringTest', 'DutyTimeComplianceTest']
  }),
  buildModule({
    id: 819,
    name: 'Airport Gate Allocation',
    slug: 'airport-gate-allocation',
    category: 'Aviation & Aerospace',
    phase: 37,
    iconName: 'LayoutGrid',
    purpose: 'Optimize gate assignments for arriving and departing flights at airport terminals.',
    responsibilities: [
      'Assign gates based on aircraft size, airline, and turnaround time',
      'Minimize gate conflicts and passenger connection times',
      'Handle dynamic reallocation during disruptions'
    ],
    tableName: 'gate_allocations',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'gate_number', type: 'VARCHAR(16)', nullable: false },
      { name: 'flight_number', type: 'VARCHAR(16)', nullable: false },
      { name: 'status', type: 'ENUM("assigned","occupied","released","conflict")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/airport-gate-allocation', description: 'Allocate gate', permission: 'airport-gate-allocation.create', authRequired: true },
      { method: 'GET', path: '/api/v1/airport-gate-allocation', description: 'List allocations', permission: 'airport-gate-allocation.view', authRequired: true },
      { method: 'GET', path: '/api/v1/airport-gate-allocation/{id}', description: 'Get allocation details', permission: 'airport-gate-allocation.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/airport-gate-allocation/{id}', description: 'Reallocate gate', permission: 'airport-gate-allocation.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/airport-gate-allocation/{id}', description: 'Release gate', permission: 'airport-gate-allocation.delete', authRequired: true }
    ],
    services: ['GateAssignmentService', 'ConflictResolutionService'],
    events: ['GateAllocated', 'GateConflictDetected', 'GateReallocated'],
    jobs: ['AllocateGatesJob', 'ResolveGateConflictsJob'],
    dependencies: [1],
    tests: ['GateAssignmentTest', 'ConflictResolutionTest']
  }),
  buildModule({
    id: 820,
    name: 'Aircraft Parts Inventory',
    slug: 'aircraft-parts-inventory',
    category: 'Aviation & Aerospace',
    phase: 37,
    iconName: 'Package',
    purpose: 'Manage aircraft spare parts inventory, traceability, and shelf-life compliance.',
    responsibilities: [
      'Track part serial numbers and serviceable status',
      'Manage shelf-life and overhaul cycle compliance',
      'Optimize stock levels across MRO warehouses'
    ],
    tableName: 'aircraft_parts_inventory',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'part_number', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'serial_number', type: 'VARCHAR(128)', nullable: true, index: true },
      { name: 'status', type: 'ENUM("serviceable","unserviceable","quarantine","expired","archived")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/aircraft-parts-inventory', description: 'Add part', permission: 'aircraft-parts-inventory.create', authRequired: true },
      { method: 'GET', path: '/api/v1/aircraft-parts-inventory', description: 'List parts', permission: 'aircraft-parts-inventory.view', authRequired: true },
      { method: 'GET', path: '/api/v1/aircraft-parts-inventory/{id}', description: 'Get part details', permission: 'aircraft-parts-inventory.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/aircraft-parts-inventory/{id}', description: 'Update part status', permission: 'aircraft-parts-inventory.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/aircraft-parts-inventory/{id}', description: 'Remove part', permission: 'aircraft-parts-inventory.delete', authRequired: true }
    ],
    services: ['PartsInventoryService', 'ShelfLifeComplianceService'],
    events: ['PartReceived', 'PartStatusChanged', 'ShelfLifeExpiring'],
    jobs: ['CheckShelfLifeComplianceJob', 'OptimizeStockLevelsJob'],
    dependencies: [1],
    tests: ['PartsInventoryTest', 'ShelfLifeComplianceTest']
  }),
  buildModule({
    id: 821,
    name: 'Flight Safety Reporting',
    slug: 'flight-safety-reporting',
    category: 'Aviation & Aerospace',
    phase: 37,
    iconName: 'Shield',
    purpose: 'Collect and analyze flight safety reports, occurrence data, and hazard alerts.',
    responsibilities: [
      'Enable confidential safety occurrence reporting',
      'Analyze trends in safety events and near-misses',
      'Generate safety performance dashboards for management'
    ],
    tableName: 'flight_safety_reports',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'report_type', type: 'VARCHAR(64)', nullable: false },
      { name: 'severity', type: 'ENUM("low","medium","high","critical")', nullable: false },
      { name: 'status', type: 'ENUM("submitted","investigating","closed","archived")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/flight-safety-reporting', description: 'Submit report', permission: 'flight-safety-reporting.create', authRequired: true },
      { method: 'GET', path: '/api/v1/flight-safety-reporting', description: 'List reports', permission: 'flight-safety-reporting.view', authRequired: true },
      { method: 'GET', path: '/api/v1/flight-safety-reporting/{id}', description: 'Get report details', permission: 'flight-safety-reporting.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/flight-safety-reporting/{id}', description: 'Update report', permission: 'flight-safety-reporting.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/flight-safety-reporting/{id}', description: 'Archive report', permission: 'flight-safety-reporting.delete', authRequired: true }
    ],
    services: ['SafetyReportService', 'SafetyTrendAnalyzer'],
    events: ['SafetyReportSubmitted', 'HazardAlertIssued', 'SafetyTrendDetected'],
    jobs: ['AnalyzeSafetyTrendsJob', 'GenerateSafetyDashboardJob'],
    dependencies: [1],
    tests: ['SafetyReportTest', 'SafetyTrendAnalyzerTest']
  }),
  buildModule({
    id: 822,
    name: 'Air Traffic Flow Manager',
    slug: 'air-traffic-flow-manager',
    category: 'Aviation & Aerospace',
    phase: 37,
    iconName: 'TrafficCone',
    purpose: 'Manage air traffic flow and slot allocation to optimize airspace capacity.',
    responsibilities: [
      'Calculate airport arrival and departure rates',
      'Coordinate slot allocation with airport operators',
      'Implement ground delay programs during congestion'
    ],
    tableName: 'air_traffic_flow_records',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'airport_code', type: 'VARCHAR(8)', nullable: false },
      { name: 'capacity_rate', type: 'INT', nullable: false },
      { name: 'status', type: 'ENUM("normal","congested","delay_program","archived")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/air-traffic-flow-manager', description: 'Record flow data', permission: 'air-traffic-flow-manager.create', authRequired: true },
      { method: 'GET', path: '/api/v1/air-traffic-flow-manager', description: 'List flow records', permission: 'air-traffic-flow-manager.view', authRequired: true },
      { method: 'GET', path: '/api/v1/air-traffic-flow-manager/{id}', description: 'Get record details', permission: 'air-traffic-flow-manager.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/air-traffic-flow-manager/{id}', description: 'Update record', permission: 'air-traffic-flow-manager.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/air-traffic-flow-manager/{id}', description: 'Archive record', permission: 'air-traffic-flow-manager.delete', authRequired: true }
    ],
    services: ['FlowCalculationService', 'SlotAllocationService'],
    events: ['FlowRateUpdated', 'DelayProgramActivated', 'SlotAllocated'],
    jobs: ['CalculateCapacityRatesJob', 'ManageGroundDelayProgramJob'],
    dependencies: [1],
    tests: ['FlowCalculationTest', 'SlotAllocationTest']
  }),
  buildModule({
    id: 823,
    name: 'Cabin Service Configuration',
    slug: 'cabin-service-configuration',
    category: 'Aviation & Aerospace',
    phase: 37,
    iconName: 'Armchair',
    purpose: 'Configure and manage in-flight services, catering, and cabin equipment for flights.',
    responsibilities: [
      'Set cabin class configurations and seat maps',
      'Order catering and special meal requirements',
      'Track cabin equipment and amenity inventory'
    ],
    tableName: 'cabin_service_configs',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'flight_number', type: 'VARCHAR(16)', nullable: false },
      { name: 'cabin_class', type: 'VARCHAR(32)', nullable: false },
      { name: 'status', type: 'ENUM("configured","confirmed","completed","archived")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/cabin-service-configuration', description: 'Configure service', permission: 'cabin-service-configuration.create', authRequired: true },
      { method: 'GET', path: '/api/v1/cabin-service-configuration', description: 'List configurations', permission: 'cabin-service-configuration.view', authRequired: true },
      { method: 'GET', path: '/api/v1/cabin-service-configuration/{id}', description: 'Get configuration details', permission: 'cabin-service-configuration.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/cabin-service-configuration/{id}', description: 'Update configuration', permission: 'cabin-service-configuration.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/cabin-service-configuration/{id}', description: 'Archive configuration', permission: 'cabin-service-configuration.delete', authRequired: true }
    ],
    services: ['CabinConfigurationService', 'CateringOrderService'],
    events: ['ServiceConfigured', 'CateringOrdered', 'EquipmentInventoryUpdated'],
    jobs: ['ConfigureCabinServicesJob', 'OrderCateringJob'],
    dependencies: [1],
    tests: ['CabinConfigurationTest', 'CateringOrderTest']
  }),
  buildModule({
    id: 824,
    name: 'Aircraft Weight & Balance',
    slug: 'aircraft-weight-balance',
    category: 'Aviation & Aerospace',
    phase: 37,
    iconName: 'Scale',
    purpose: 'Calculate and verify aircraft weight and balance for safe flight operations.',
    responsibilities: [
      'Compute center of gravity for each flight configuration',
      'Verify payload limits and fuel requirements',
      'Generate load sheets for pilot verification'
    ],
    tableName: 'weight_balance_records',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'aircraft_tail', type: 'VARCHAR(32)', nullable: false },
      { name: 'flight_number', type: 'VARCHAR(16)', nullable: false },
      { name: 'status', type: 'ENUM("calculated","verified","rejected","archived")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/aircraft-weight-balance', description: 'Create calculation', permission: 'aircraft-weight-balance.create', authRequired: true },
      { method: 'GET', path: '/api/v1/aircraft-weight-balance', description: 'List calculations', permission: 'aircraft-weight-balance.view', authRequired: true },
      { method: 'GET', path: '/api/v1/aircraft-weight-balance/{id}', description: 'Get calculation details', permission: 'aircraft-weight-balance.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/aircraft-weight-balance/{id}', description: 'Update calculation', permission: 'aircraft-weight-balance.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/aircraft-weight-balance/{id}', description: 'Archive calculation', permission: 'aircraft-weight-balance.delete', authRequired: true }
    ],
    services: ['WeightCalculationService', 'BalanceVerificationService'],
    events: ['WeightCalculated', 'BalanceVerified', 'LoadSheetGenerated'],
    jobs: ['CalculateWeightAndBalanceJob', 'GenerateLoadSheetJob'],
    dependencies: [1],
    tests: ['WeightCalculationTest', 'BalanceVerificationTest']
  }),
  buildModule({
    id: 825,
    name: 'Fuel Efficiency Analytics',
    slug: 'fuel-efficiency-analytics',
    category: 'Aviation & Aerospace',
    phase: 37,
    iconName: 'Fuel',
    purpose: 'Analyze fuel consumption patterns and identify efficiency improvement opportunities.',
    responsibilities: [
      'Track fuel burn per flight segment and per aircraft',
      'Compare actual vs planned fuel consumption',
      'Recommend fuel-saving operational procedures'
    ],
    tableName: 'fuel_efficiency_records',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'aircraft_tail', type: 'VARCHAR(32)', nullable: false },
      { name: 'fuel_burn_kg', type: 'DECIMAL(10,2)', nullable: false },
      { name: 'status', type: 'ENUM("recorded","analyzed","optimization_pending","archived")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/fuel-efficiency-analytics', description: 'Record fuel data', permission: 'fuel-efficiency-analytics.create', authRequired: true },
      { method: 'GET', path: '/api/v1/fuel-efficiency-analytics', description: 'List records', permission: 'fuel-efficiency-analytics.view', authRequired: true },
      { method: 'GET', path: '/api/v1/fuel-efficiency-analytics/{id}', description: 'Get record details', permission: 'fuel-efficiency-analytics.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/fuel-efficiency-analytics/{id}', description: 'Update record', permission: 'fuel-efficiency-analytics.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/fuel-efficiency-analytics/{id}', description: 'Archive record', permission: 'fuel-efficiency-analytics.delete', authRequired: true }
    ],
    services: ['FuelBurnAnalyzer', 'EfficiencyRecommendationEngine'],
    events: ['FuelDataRecorded', 'EfficiencyTrendDetected', 'FuelSavingRecommended'],
    jobs: ['AnalyzeFuelBurnPatternsJob', 'GenerateEfficiencyReportJob'],
    dependencies: [1],
    tests: ['FuelBurnAnalyzerTest', 'EfficiencyRecommendationTest']
  }),
  buildModule({
    id: 826,
    name: 'MRO Work Order Manager',
    slug: 'mro-work-order-manager',
    category: 'Aviation & Aerospace',
    phase: 37,
    iconName: 'ClipboardList',
    purpose: 'Manage maintenance, repair, and overhaul work orders across MRO facilities.',
    responsibilities: [
      'Create and assign work orders to MRO technicians',
      'Track work order progress and labor hours',
      'Manage parts requisitions and tooling requirements'
    ],
    tableName: 'mro_work_orders',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'work_order_type', type: 'VARCHAR(64)', nullable: false },
      { name: 'aircraft_tail', type: 'VARCHAR(32)', nullable: false },
      { name: 'status', type: 'ENUM("open","in_progress","on_hold","completed","archived")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/mro-work-order-manager', description: 'Create work order', permission: 'mro-work-order-manager.create', authRequired: true },
      { method: 'GET', path: '/api/v1/mro-work-order-manager', description: 'List work orders', permission: 'mro-work-order-manager.view', authRequired: true },
      { method: 'GET', path: '/api/v1/mro-work-order-manager/{id}', description: 'Get work order details', permission: 'mro-work-order-manager.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/mro-work-order-manager/{id}', description: 'Update work order', permission: 'mro-work-order-manager.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/mro-work-order-manager/{id}', description: 'Archive work order', permission: 'mro-work-order-manager.delete', authRequired: true }
    ],
    services: ['WorkOrderService', 'LaborTrackingService'],
    events: ['WorkOrderCreated', 'WorkOrderCompleted', 'PartsRequisitioned'],
    jobs: ['AssignWorkOrdersJob', 'TrackLaborHoursJob'],
    dependencies: [1],
    tests: ['WorkOrderTest', 'LaborTrackingTest']
  }),
  buildModule({
    id: 827,
    name: 'Aircraft Lease Tracker',
    slug: 'aircraft-lease-tracker',
    category: 'Aviation & Aerospace',
    phase: 37,
    iconName: 'FileText',
    purpose: 'Track aircraft lease agreements, payments, return conditions, and compliance.',
    responsibilities: [
      'Manage lease start, end, and option exercise dates',
      'Track monthly lease payments and escalation clauses',
      'Monitor aircraft condition relative to return criteria'
    ],
    tableName: 'aircraft_lease_records',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'aircraft_tail', type: 'VARCHAR(32)', nullable: false },
      { name: 'lessor_name', type: 'VARCHAR(255)', nullable: false },
      { name: 'status', type: 'ENUM("active","return_pending","returned","archived")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/aircraft-lease-tracker', description: 'Register lease', permission: 'aircraft-lease-tracker.create', authRequired: true },
      { method: 'GET', path: '/api/v1/aircraft-lease-tracker', description: 'List leases', permission: 'aircraft-lease-tracker.view', authRequired: true },
      { method: 'GET', path: '/api/v1/aircraft-lease-tracker/{id}', description: 'Get lease details', permission: 'aircraft-lease-tracker.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/aircraft-lease-tracker/{id}', description: 'Update lease', permission: 'aircraft-lease-tracker.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/aircraft-lease-tracker/{id}', description: 'Archive lease', permission: 'aircraft-lease-tracker.delete', authRequired: true }
    ],
    services: ['LeaseManagementService', 'ReturnConditionService'],
    events: ['LeaseRegistered', 'LeasePaymentDue', 'ReturnConditionAssessed'],
    jobs: ['TrackLeasePaymentsJob', 'AssessReturnConditionsJob'],
    dependencies: [1],
    tests: ['LeaseManagementTest', 'ReturnConditionTest']
  }),
  buildModule({
    id: 828,
    name: 'NOTAM Management System',
    slug: 'notam-management-system',
    category: 'Aviation & Aerospace',
    phase: 37,
    iconName: 'Bell',
    purpose: 'Manage Notice to Airmen (NOTAM) dissemination and pilot briefing preparation.',
    responsibilities: [
      'Ingest and parse NOTAMs from global sources',
      'Filter NOTAMs relevant to planned flight routes',
      'Include NOTAMs in pilot pre-flight briefing packages'
    ],
    tableName: 'notam_records',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'notam_number', type: 'VARCHAR(32)', nullable: false, index: true },
      { name: 'affected_facility', type: 'VARCHAR(16)', nullable: false },
      { name: 'status', type: 'ENUM("active","expired","cancelled","archived")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/notam-management-system', description: 'Ingest NOTAM', permission: 'notam-management-system.create', authRequired: true },
      { method: 'GET', path: '/api/v1/notam-management-system', description: 'List NOTAMs', permission: 'notam-management-system.view', authRequired: true },
      { method: 'GET', path: '/api/v1/notam-management-system/{id}', description: 'Get NOTAM details', permission: 'notam-management-system.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/notam-management-system/{id}', description: 'Update NOTAM', permission: 'notam-management-system.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/notam-management-system/{id}', description: 'Archive NOTAM', permission: 'notam-management-system.delete', authRequired: true }
    ],
    services: ['NotamIngestionService', 'NotamFilterService'],
    events: ['NotamIngested', 'NotamFiltered', 'NotamBriefingGenerated'],
    jobs: ['IngestGlobalNotamsJob', 'GenerateFlightBriefingsJob'],
    dependencies: [1],
    tests: ['NotamIngestionTest', 'NotamFilterTest']
  }),
  buildModule({
    id: 829,
    name: 'Airport Runway Inspector',
    slug: 'airport-runway-inspector',
    category: 'Aviation & Aerospace',
    phase: 37,
    iconName: 'Ruler',
    purpose: 'Schedule and record runway inspections, friction tests, and surface condition assessments.',
    responsibilities: [
      'Schedule daily and post-weather runway inspections',
      'Record friction coefficient and surface defects',
      'Report runway closure and NOTAM issuance requirements'
    ],
    tableName: 'runway_inspection_records',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'runway_designator', type: 'VARCHAR(8)', nullable: false },
      { name: 'friction_coefficient', type: 'DECIMAL(4,2)', nullable: true },
      { name: 'status', type: 'ENUM("scheduled","in_progress","completed","deficiency_found")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/airport-runway-inspector', description: 'Schedule inspection', permission: 'airport-runway-inspector.create', authRequired: true },
      { method: 'GET', path: '/api/v1/airport-runway-inspector', description: 'List inspections', permission: 'airport-runway-inspector.view', authRequired: true },
      { method: 'GET', path: '/api/v1/airport-runway-inspector/{id}', description: 'Get inspection details', permission: 'airport-runway-inspector.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/airport-runway-inspector/{id}', description: 'Update inspection', permission: 'airport-runway-inspector.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/airport-runway-inspector/{id}', description: 'Archive inspection', permission: 'airport-runway-inspector.delete', authRequired: true }
    ],
    services: ['RunwayInspectionService', 'SurfaceConditionService'],
    events: ['InspectionScheduled', 'DeficiencyFound', 'RunwayClosureRequired'],
    jobs: ['ScheduleRunwayInspectionsJob', 'AssessSurfaceConditionsJob'],
    dependencies: [1],
    tests: ['RunwayInspectionTest', 'SurfaceConditionTest']
  }),
  buildModule({
    id: 830,
    name: 'Airline Catering Manager',
    slug: 'airline-catering-manager',
    category: 'Aviation & Aerospace',
    phase: 37,
    iconName: 'UtensilsCrossed',
    purpose: 'Coordinate airline catering orders, meal production, and on-board provisioning.',
    responsibilities: [
      'Place catering orders based on passenger manifests',
      'Track meal production and delivery timelines',
      'Manage special dietary and religious meal requirements'
    ],
    tableName: 'catering_orders',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'flight_number', type: 'VARCHAR(16)', nullable: false },
      { name: 'meal_count', type: 'INT', nullable: false },
      { name: 'status', type: 'ENUM("ordered","preparing","delivered","cancelled","archived")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/airline-catering-manager', description: 'Place order', permission: 'airline-catering-manager.create', authRequired: true },
      { method: 'GET', path: '/api/v1/airline-catering-manager', description: 'List orders', permission: 'airline-catering-manager.view', authRequired: true },
      { method: 'GET', path: '/api/v1/airline-catering-manager/{id}', description: 'Get order details', permission: 'airline-catering-manager.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/airline-catering-manager/{id}', description: 'Update order', permission: 'airline-catering-manager.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/airline-catering-manager/{id}', description: 'Cancel order', permission: 'airline-catering-manager.delete', authRequired: true }
    ],
    services: ['CateringOrderService', 'MealProvisioningService'],
    events: ['CateringOrderPlaced', 'MealDelivered', 'SpecialDietaryRequired'],
    jobs: ['PlaceCateringOrdersJob', 'TrackMealDeliveryJob'],
    dependencies: [1],
    tests: ['CateringOrderTest', 'MealProvisioningTest']
  }),
  buildModule({
    id: 831,
    name: 'Flight Delay Compensation',
    slug: 'flight-delay-compensation',
    category: 'Aviation & Aerospace',
    phase: 37,
    iconName: 'Clock',
    purpose: 'Calculate and process passenger compensation for delayed and cancelled flights.',
    responsibilities: [
      'Determine EU261/US-DOT compensation eligibility',
      'Calculate compensation amounts based on delay duration',
      'Process passenger refund and compensation claims'
    ],
    tableName: 'delay_compensation_records',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'flight_number', type: 'VARCHAR(16)', nullable: false },
      { name: 'delay_hours', type: 'DECIMAL(4,2)', nullable: false },
      { name: 'status', type: 'ENUM("eligible","claimed","paid","denied","archived")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/flight-delay-compensation', description: 'Create claim', permission: 'flight-delay-compensation.create', authRequired: true },
      { method: 'GET', path: '/api/v1/flight-delay-compensation', description: 'List claims', permission: 'flight-delay-compensation.view', authRequired: true },
      { method: 'GET', path: '/api/v1/flight-delay-compensation/{id}', description: 'Get claim details', permission: 'flight-delay-compensation.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/flight-delay-compensation/{id}', description: 'Update claim', permission: 'flight-delay-compensation.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/flight-delay-compensation/{id}', description: 'Archive claim', permission: 'flight-delay-compensation.delete', authRequired: true }
    ],
    services: ['CompensationCalculationService', 'ClaimProcessingService'],
    events: ['ClaimCreated', 'CompensationApproved', 'PaymentProcessed'],
    jobs: ['CalculateCompensationJob', 'ProcessClaimPaymentsJob'],
    dependencies: [1],
    tests: ['CompensationCalculationTest', 'ClaimProcessingTest']
  }),
  buildModule({
    id: 832,
    name: 'Aircraft Interior Refurbishment',
    slug: 'aircraft-interior-refurbishment',
    category: 'Aviation & Aerospace',
    phase: 37,
    iconName: 'Paintbrush',
    purpose: 'Plan and track aircraft cabin interior refurbishment and retrofit projects.',
    responsibilities: [
      'Schedule cabin refurbishment during maintenance downtime',
      'Track seat installation, IFE upgrades, and cabin refresh',
      'Manage vendor contracts for interior components'
    ],
    tableName: 'interior_refurbishment_records',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'aircraft_tail', type: 'VARCHAR(32)', nullable: false },
      { name: 'project_scope', type: 'VARCHAR(255)', nullable: false },
      { name: 'status', type: 'ENUM("planned","in_progress","completed","archived")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/aircraft-interior-refurbishment', description: 'Create project', permission: 'aircraft-interior-refurbishment.create', authRequired: true },
      { method: 'GET', path: '/api/v1/aircraft-interior-refurbishment', description: 'List projects', permission: 'aircraft-interior-refurbishment.view', authRequired: true },
      { method: 'GET', path: '/api/v1/aircraft-interior-refurbishment/{id}', description: 'Get project details', permission: 'aircraft-interior-refurbishment.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/aircraft-interior-refurbishment/{id}', description: 'Update project', permission: 'aircraft-interior-refurbishment.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/aircraft-interior-refurbishment/{id}', description: 'Archive project', permission: 'aircraft-interior-refurbishment.delete', authRequired: true }
    ],
    services: ['RefurbishmentPlanningService', 'VendorManagementService'],
    events: ['ProjectCreated', 'RefurbishmentCompleted', 'VendorContractSigned'],
    jobs: ['ScheduleRefurbishmentJob', 'TrackVendorContractsJob'],
    dependencies: [1],
    tests: ['RefurbishmentPlanningTest', 'VendorManagementTest']
  }),
  buildModule({
    id: 833,
    name: 'Pilot Currency Tracker',
    slug: 'pilot-currency-tracker',
    category: 'Aviation & Aerospace',
    phase: 37,
    iconName: 'UserCheck',
    purpose: 'Track pilot flight hours, simulator sessions, and regulatory currency requirements.',
    responsibilities: [
      'Log pilot flight time and night/commercial landings',
      'Track simulator session completion and recency',
      'Alert when pilots are approaching currency expiry'
    ],
    tableName: 'pilot_currency_records',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'pilot_id', type: 'BIGINT UNSIGNED', nullable: false },
      { name: 'flight_hours', type: 'DECIMAL(6,2)', nullable: false },
      { name: 'status', type: 'ENUM("current","expiring","expired","archived")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/pilot-currency-tracker', description: 'Log currency', permission: 'pilot-currency-tracker.create', authRequired: true },
      { method: 'GET', path: '/api/v1/pilot-currency-tracker', description: 'List records', permission: 'pilot-currency-tracker.view', authRequired: true },
      { method: 'GET', path: '/api/v1/pilot-currency-tracker/{id}', description: 'Get record details', permission: 'pilot-currency-tracker.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/pilot-currency-tracker/{id}', description: 'Update record', permission: 'pilot-currency-tracker.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/pilot-currency-tracker/{id}', description: 'Archive record', permission: 'pilot-currency-tracker.delete', authRequired: true }
    ],
    services: ['PilotCurrencyService', 'FlightTimeLogService'],
    events: ['CurrencyRecorded', 'CurrencyExpiring', 'CurrencyExpired'],
    jobs: ['TrackPilotCurrencyJob', 'NotifyCurrencyExpiryJob'],
    dependencies: [1],
    tests: ['PilotCurrencyTest', 'FlightTimeLogTest']
  }),
  buildModule({
    id: 834,
    name: 'Airspace Conflict Detector',
    slug: 'airspace-conflict-detector',
    category: 'Aviation & Aerospace',
    phase: 37,
    iconName: 'AlertOctagon',
    purpose: 'Detect and prevent potential airspace conflicts between aircraft in flight.',
    responsibilities: [
      'Monitor aircraft positions in real time for separation minima',
      'Generate conflict alerts for air traffic controllers',
      'Suggest resolution maneuvers to maintain safe separation'
    ],
    tableName: 'airspace_conflict_records',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'aircraft_a', type: 'VARCHAR(16)', nullable: false },
      { name: 'aircraft_b', type: 'VARCHAR(16)', nullable: false },
      { name: 'status', type: 'ENUM("detected","alerting","resolved","archived")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/airspace-conflict-detector', description: 'Report conflict', permission: 'airspace-conflict-detector.create', authRequired: true },
      { method: 'GET', path: '/api/v1/airspace-conflict-detector', description: 'List conflicts', permission: 'airspace-conflict-detector.view', authRequired: true },
      { method: 'GET', path: '/api/v1/airspace-conflict-detector/{id}', description: 'Get conflict details', permission: 'airspace-conflict-detector.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/airspace-conflict-detector/{id}', description: 'Update conflict', permission: 'airspace-conflict-detector.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/airspace-conflict-detector/{id}', description: 'Archive conflict', permission: 'airspace-conflict-detector.delete', authRequired: true }
    ],
    services: ['ConflictDetectionService', 'ResolutionSuggestionService'],
    events: ['ConflictDetected', 'AlertIssued', 'ConflictResolved'],
    jobs: ['MonitorAirspaceConflictsJob', 'GenerateResolutionSuggestionsJob'],
    dependencies: [1],
    tests: ['ConflictDetectionTest', 'ResolutionSuggestionTest']
  }),
  buildModule({
    id: 835,
    name: 'Helicopter Operations Manager',
    slug: 'helicopter-operations-manager',
    category: 'Aviation & Aerospace',
    phase: 37,
    iconName: 'Helicopter',
    purpose: 'Manage helicopter flight operations, missions, and maintenance scheduling.',
    responsibilities: [
      'Plan helicopter missions and flight routes',
      'Track rotorcraft maintenance and airworthiness',
      'Coordinate helipad assignments and ground operations'
    ],
    tableName: 'helicopter_operations',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'aircraft_tail', type: 'VARCHAR(32)', nullable: false },
      { name: 'mission_type', type: 'VARCHAR(64)', nullable: false },
      { name: 'status', type: 'ENUM("planned","in_flight","completed","grounded")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/helicopter-operations-manager', description: 'Plan mission', permission: 'helicopter-operations-manager.create', authRequired: true },
      { method: 'GET', path: '/api/v1/helicopter-operations-manager', description: 'List operations', permission: 'helicopter-operations-manager.view', authRequired: true },
      { method: 'GET', path: '/api/v1/helicopter-operations-manager/{id}', description: 'Get operation details', permission: 'helicopter-operations-manager.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/helicopter-operations-manager/{id}', description: 'Update operation', permission: 'helicopter-operations-manager.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/helicopter-operations-manager/{id}', description: 'Archive operation', permission: 'helicopter-operations-manager.delete', authRequired: true }
    ],
    services: ['HelicopterMissionService', 'HelipadManagementService'],
    events: ['MissionPlanned', 'MissionCompleted', 'RotorcraftGrounded'],
    jobs: ['PlanHelicopterMissionsJob', 'AssignHelipadsJob'],
    dependencies: [1],
    tests: ['HelicopterMissionTest', 'HelipadManagementTest']
  }),
  buildModule({
    id: 836,
    name: 'Drone Registration Registry',
    slug: 'drone-registration-registry',
    category: 'Aviation & Aerospace',
    phase: 37,
    iconName: 'Smartphone',
    purpose: 'Register and manage drone operator licenses, aircraft serial numbers, and flight authorizations.',
    responsibilities: [
      'Register drones with national aviation authority databases',
      'Track operator certifications and training records',
      'Issue flight authorization for controlled airspace'
    ],
    tableName: 'drone_registrations',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'drone_serial', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'operator_id', type: 'BIGINT UNSIGNED', nullable: false },
      { name: 'status', type: 'ENUM("registered","suspended","deregistered","archived")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/drone-registration-registry', description: 'Register drone', permission: 'drone-registration-registry.create', authRequired: true },
      { method: 'GET', path: '/api/v1/drone-registration-registry', description: 'List registrations', permission: 'drone-registration-registry.view', authRequired: true },
      { method: 'GET', path: '/api/v1/drone-registration-registry/{id}', description: 'Get registration details', permission: 'drone-registration-registry.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/drone-registration-registry/{id}', description: 'Update registration', permission: 'drone-registration-registry.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/drone-registration-registry/{id}', description: 'Deregister drone', permission: 'drone-registration-registry.delete', authRequired: true }
    ],
    services: ['DroneRegistrationService', 'FlightAuthorizationService'],
    events: ['DroneRegistered', 'AuthorizationIssued', 'RegistrationSuspended'],
    jobs: ['ProcessDroneRegistrationsJob', 'IssueFlightAuthorizationsJob'],
    dependencies: [1],
    tests: ['DroneRegistrationTest', 'FlightAuthorizationTest']
  }),
  buildModule({
    id: 837,
    name: 'Satellite Launch Scheduler',
    slug: 'satellite-launch-scheduler',
    category: 'Aviation & Aerospace',
    phase: 37,
    iconName: 'Rocket',
    purpose: 'Schedule and coordinate satellite launch windows, payloads, and ground station readiness.',
    responsibilities: [
      'Coordinate launch window availability with range safety',
      'Track payload integration and pre-launch testing',
      'Manage countdown procedures and anomaly resolution'
    ],
    tableName: 'satellite_launches',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'mission_name', type: 'VARCHAR(255)', nullable: false },
      { name: 'launch_vehicle', type: 'VARCHAR(64)', nullable: false },
      { name: 'status', type: 'ENUM("planned","integration","countdown","launched","archived")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/satellite-launch-scheduler', description: 'Schedule launch', permission: 'satellite-launch-scheduler.create', authRequired: true },
      { method: 'GET', path: '/api/v1/satellite-launch-scheduler', description: 'List launches', permission: 'satellite-launch-scheduler.view', authRequired: true },
      { method: 'GET', path: '/api/v1/satellite-launch-scheduler/{id}', description: 'Get launch details', permission: 'satellite-launch-scheduler.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/satellite-launch-scheduler/{id}', description: 'Update launch', permission: 'satellite-launch-scheduler.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/satellite-launch-scheduler/{id}', description: 'Archive launch', permission: 'satellite-launch-scheduler.delete', authRequired: true }
    ],
    services: ['LaunchSchedulingService', 'PayloadIntegrationService'],
    events: ['LaunchScheduled', 'PayloadIntegrated', 'LaunchCountdownStarted'],
    jobs: ['CoordinateLaunchWindowsJob', 'TrackPayloadIntegrationJob'],
    dependencies: [1],
    tests: ['LaunchSchedulingTest', 'PayloadIntegrationTest']
  }),
  buildModule({
    id: 838,
    name: 'Aerospace Quality Inspector',
    slug: 'aerospace-quality-inspector',
    category: 'Aviation & Aerospace',
    phase: 37,
    iconName: 'CheckCircle',
    purpose: 'Perform quality inspections on aerospace components and document non-conformances.',
    responsibilities: [
      'Execute quality inspections per AS9100 standards',
      'Document non-conformances and corrective actions',
      'Track component serial numbers through quality gates'
    ],
    tableName: 'aerospace_quality_inspections',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'component_serial', type: 'VARCHAR(128)', nullable: false },
      { name: 'inspection_type', type: 'VARCHAR(64)', nullable: false },
      { name: 'status', type: 'ENUM("scheduled","in_progress","passed","failed","archived")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/aerospace-quality-inspector', description: 'Create inspection', permission: 'aerospace-quality-inspector.create', authRequired: true },
      { method: 'GET', path: '/api/v1/aerospace-quality-inspector', description: 'List inspections', permission: 'aerospace-quality-inspector.view', authRequired: true },
      { method: 'GET', path: '/api/v1/aerospace-quality-inspector/{id}', description: 'Get inspection details', permission: 'aerospace-quality-inspector.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/aerospace-quality-inspector/{id}', description: 'Update inspection', permission: 'aerospace-quality-inspector.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/aerospace-quality-inspector/{id}', description: 'Archive inspection', permission: 'aerospace-quality-inspector.delete', authRequired: true }
    ],
    services: ['QualityInspectionService', 'NonConformanceService'],
    events: ['InspectionCreated', 'NonConformanceFound', 'CorrectiveActionIssued'],
    jobs: ['ScheduleQualityInspectionsJob', 'TrackCorrectiveActionsJob'],
    dependencies: [1],
    tests: ['QualityInspectionTest', 'NonConformanceTest']
  }),
  buildModule({
    id: 839,
    name: 'Airline Revenue Optimizer',
    slug: 'airline-revenue-optimizer',
    category: 'Aviation & Aerospace',
    phase: 37,
    iconName: 'DollarSign',
    purpose: 'Optimize airline revenue through dynamic pricing, ancillary sales, and seat inventory.',
    responsibilities: [
      'Calculate optimal fare pricing based on demand forecasts',
      'Manage overbooking levels and denied boarding compensation',
      'Track ancillary revenue from baggage, upgrades, and meals'
    ],
    tableName: 'airline_revenue_records',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'flight_number', type: 'VARCHAR(16)', nullable: false },
      { name: 'revenue_amount', type: 'DECIMAL(12,2)', nullable: false },
      { name: 'status', type: 'ENUM("forecasted","actual","adjusted","archived")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/airline-revenue-optimizer', description: 'Record revenue', permission: 'airline-revenue-optimizer.create', authRequired: true },
      { method: 'GET', path: '/api/v1/airline-revenue-optimizer', description: 'List records', permission: 'airline-revenue-optimizer.view', authRequired: true },
      { method: 'GET', path: '/api/v1/airline-revenue-optimizer/{id}', description: 'Get record details', permission: 'airline-revenue-optimizer.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/airline-revenue-optimizer/{id}', description: 'Update record', permission: 'airline-revenue-optimizer.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/airline-revenue-optimizer/{id}', description: 'Archive record', permission: 'airline-revenue-optimizer.delete', authRequired: true }
    ],
    services: ['DynamicPricingService', 'AncillaryRevenueService'],
    events: ['RevenueRecorded', 'PricingOptimized', 'OverbookingAdjusted'],
    jobs: ['OptimizeFarePricingJob', 'CalculateAncillaryRevenueJob'],
    dependencies: [1],
    tests: ['DynamicPricingTest', 'AncillaryRevenueTest']
  }),
  buildModule({
    id: 840,
    name: 'Airport Security Compliance',
    slug: 'airport-security-compliance',
    category: 'Aviation & Aerospace',
    phase: 37,
    iconName: 'Lock',
    purpose: 'Ensure airport security operations comply with national and international aviation security regulations.',
    responsibilities: [
      'Track TSA and ICAO security compliance checkpoints',
      'Monitor screening equipment calibration schedules',
      'Manage security incident reports and response procedures'
    ],
    tableName: 'security_compliance_records',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'checkpoint_id', type: 'VARCHAR(64)', nullable: false },
      { name: 'compliance_framework', type: 'VARCHAR(64)', nullable: false },
      { name: 'status', type: 'ENUM("compliant","non_compliant","remediation","archived")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/airport-security-compliance', description: 'Record compliance', permission: 'airport-security-compliance.create', authRequired: true },
      { method: 'GET', path: '/api/v1/airport-security-compliance', description: 'List records', permission: 'airport-security-compliance.view', authRequired: true },
      { method: 'GET', path: '/api/v1/airport-security-compliance/{id}', description: 'Get record details', permission: 'airport-security-compliance.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/airport-security-compliance/{id}', description: 'Update record', permission: 'airport-security-compliance.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/airport-security-compliance/{id}', description: 'Archive record', permission: 'airport-security-compliance.delete', authRequired: true }
    ],
    services: ['SecurityComplianceService', 'EquipmentCalibrationService'],
    events: ['ComplianceRecorded', 'NonComplianceDetected', 'CalibrationDue'],
    jobs: ['MonitorSecurityComplianceJob', 'TrackEquipmentCalibrationJob'],
    dependencies: [1],
    tests: ['SecurityComplianceTest', 'EquipmentCalibrationTest']
  })
];
