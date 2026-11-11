import { buildModule } from './moduleBuilderHelper';

export const modulesDomain21 = [
  // ========================================================
  // DOMAIN 21: SMART CITIES & IOT (401-420)
  // ========================================================
  buildModule({
    id: 401,
    name: 'Smart Traffic Management',
    slug: 'smart-traffic-management',
    category: 'Smart Cities & IoT',
    phase: 21,
    iconName: 'TrafficCone',
    purpose: 'Intelligent traffic signal control, adaptive signal timing, congestion detection, and real-time traffic flow optimization for urban intersections.',
    responsibilities: [
      'Control adaptive traffic signal timing using real-time vehicle and pedestrian detection sensors',
      'Detect and respond to traffic congestion events with automated signal phase adjustments',
      'Provide real-time traffic flow analytics and historical pattern analysis for urban planners'
    ],
    tableName: 'traffic_signals',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'intersection_id', type: 'VARCHAR(128)', nullable: false, index: true },
      { name: 'signal_name', type: 'VARCHAR(255)', nullable: false },
      { name: 'latitude', type: 'DECIMAL(10,8)', nullable: false },
      { name: 'longitude', type: 'DECIMAL(11,8)', nullable: false },
      { name: 'phase_config', type: 'JSON', nullable: true },
      { name: 'status', type: 'ENUM("active","inactive","maintenance","fault")', nullable: false },
      { name: 'last_synced_at', type: 'TIMESTAMP', nullable: true },
      { name: 'metadata', type: 'JSON', nullable: true },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'GET', path: '/api/v1/smart-traffic-management', description: 'List all traffic signal configurations', permission: 'smart-traffic-management.view', authRequired: true },
      { method: 'POST', path: '/api/v1/smart-traffic-management', description: 'Register a new traffic signal', permission: 'smart-traffic-management.create', authRequired: true },
      { method: 'GET', path: '/api/v1/smart-traffic-management/{id}', description: 'Get traffic signal details by ID', permission: 'smart-traffic-management.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/smart-traffic-management/{id}/status', description: 'Update signal status or phase config', permission: 'smart-traffic-management.manage', authRequired: true }
    ],
    services: ['TrafficSignalService', 'TrafficFlowAnalyzer', 'CongestionDetectionEngine'],
    events: ['TrafficSignalUpdated', 'CongestionDetected', 'SignalPhaseChanged'],
    jobs: ['SyncTrafficSignalStatusJob', 'AnalyzeTrafficFlowPatternsJob', 'AlertCongestionThresholdJob'],
    dependencies: [88, 27],
    tests: ['TrafficSignalIntegrationTest', 'CongestionDetectionTest', 'AdaptiveTimingTest']
  }),

  buildModule({
    id: 402,
    name: 'Smart Parking Management',
    slug: 'smart-parking-management',
    category: 'Smart Cities & IoT',
    phase: 21,
    iconName: 'ParkingCircle',
    purpose: 'Real-time parking spot occupancy tracking, dynamic pricing, reservation management, and automated enforcement for urban parking facilities.',
    responsibilities: [
      'Track real-time parking spot occupancy using ground-level sensor networks and camera analytics',
      'Manage dynamic pricing based on demand, time of day, and neighborhood congestion levels',
      'Process parking reservations and enforce time limits with automated license plate recognition'
    ],
    tableName: 'parking_spots',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'spot_code', type: 'VARCHAR(32)', nullable: false, index: true },
      { name: 'zone_id', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'latitude', type: 'DECIMAL(10,8)', nullable: false },
      { name: 'longitude', type: 'DECIMAL(11,8)', nullable: false },
      { name: 'is_occupied', type: 'BOOLEAN', nullable: false },
      { name: 'spot_type', type: 'ENUM("standard","compact","handicap","ev_charging","reserved")', nullable: false },
      { name: 'hourly_rate', type: 'DECIMAL(6,2)', nullable: true },
      { name: 'sensor_battery_pct', type: 'INT', nullable: true },
      { name: 'last_occupancy_change_at', type: 'TIMESTAMP', nullable: true },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'GET', path: '/api/v1/smart-parking-management', description: 'List parking spots with occupancy filters', permission: 'smart-parking-management.view', authRequired: true },
      { method: 'POST', path: '/api/v1/smart-parking-management', description: 'Register a new parking spot', permission: 'smart-parking-management.create', authRequired: true },
      { method: 'GET', path: '/api/v1/smart-parking-management/{id}', description: 'Get parking spot details', permission: 'smart-parking-management.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/smart-parking-management/{id}/status', description: 'Update occupancy or rate status', permission: 'smart-parking-management.manage', authRequired: true }
    ],
    services: ['ParkingSpotService', 'DynamicPricingEngine', 'OccupancyTracker'],
    events: ['ParkingSpotOccupied', 'ParkingSpotFreed', 'DynamicRateChanged'],
    jobs: ['SyncParkingSensorDataJob', 'RecalculateDynamicPricingJob', 'EnforceParkingTimeLimitJob'],
    dependencies: [27, 101],
    tests: ['ParkingOccupancyTest', 'DynamicPricingTest', 'ReservationFlowTest']
  }),

  buildModule({
    id: 403,
    name: 'Waste Management IoT',
    slug: 'waste-management-iot',
    category: 'Smart Cities & IoT',
    phase: 21,
    iconName: 'Trash2',
    purpose: 'Smart waste bin fill-level monitoring, automated collection route optimization, and recycling analytics for municipal solid waste operations.',
    responsibilities: [
      'Monitor waste bin fill levels via ultrasonic and infrared IoT sensors across the city',
      'Optimize garbage truck collection routes dynamically based on real-time bin capacity data',
      'Track recycling contamination rates and waste diversion metrics for sustainability reporting'
    ],
    tableName: 'waste_bins',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'bin_serial', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'waste_type', type: 'ENUM("general","recycling","organic","hazardous","electronic")', nullable: false },
      { name: 'latitude', type: 'DECIMAL(10,8)', nullable: false },
      { name: 'longitude', type: 'DECIMAL(11,8)', nullable: false },
      { name: 'fill_level_pct', type: 'INT', nullable: false },
      { name: 'sensor_health', type: 'ENUM("ok","low_battery","fault","offline")', nullable: false },
      { name: 'last_collected_at', type: 'TIMESTAMP', nullable: true },
      { name: 'capacity_liters', type: 'INT', nullable: false },
      { name: 'metadata', type: 'JSON', nullable: true },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'GET', path: '/api/v1/waste-management-iot', description: 'List all smart waste bins', permission: 'waste-management-iot.view', authRequired: true },
      { method: 'POST', path: '/api/v1/waste-management-iot', description: 'Register a new smart waste bin', permission: 'waste-management-iot.create', authRequired: true },
      { method: 'GET', path: '/api/v1/waste-management-iot/{id}', description: 'Get waste bin details', permission: 'waste-management-iot.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/waste-management-iot/{id}/status', description: 'Update fill level or sensor health', permission: 'waste-management-iot.manage', authRequired: true }
    ],
    services: ['WasteBinService', 'CollectionRouteOptimizer', 'RecyclingAnalyticsEngine'],
    events: ['BinFillLevelChanged', 'CollectionRouteOptimized', 'BinSensorFaultDetected'],
    jobs: ['SyncWasteBinSensorsJob', 'OptimizeCollectionRoutesJob', 'GenerateWasteAnalyticsReportJob'],
    dependencies: [27, 9],
    tests: ['WasteBinSensorSyncTest', 'RouteOptimizationTest', 'FillLevelAlertTest']
  }),

  buildModule({
    id: 404,
    name: 'Air Quality Monitoring',
    slug: 'air-quality-monitoring',
    category: 'Smart Cities & IoT',
    phase: 21,
    iconName: 'Wind',
    purpose: 'Real-time urban air quality measurement, pollutant concentration tracking, AQI index computation, and public health alert notifications.',
    responsibilities: [
      'Collect PM2.5, PM10, NO2, SO2, O3, and CO concentration readings from distributed sensor stations',
      'Compute real-time Air Quality Index (AQI) values and historical trend analytics',
      'Trigger public health alerts when pollutant concentrations exceed EPA National Ambient Air Quality Standards'
    ],
    tableName: 'air_quality_readings',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'station_id', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'latitude', type: 'DECIMAL(10,8)', nullable: false },
      { name: 'longitude', type: 'DECIMAL(11,8)', nullable: false },
      { name: 'pm25_ugm3', type: 'DECIMAL(8,2)', nullable: true },
      { name: 'pm10_ugm3', type: 'DECIMAL(8,2)', nullable: true },
      { name: 'no2_ppb', type: 'DECIMAL(8,2)', nullable: true },
      { name: 'o3_ppb', type: 'DECIMAL(8,2)', nullable: true },
      { name: 'aqi_value', type: 'INT', nullable: false },
      { name: 'aqi_category', type: 'ENUM("good","moderate","unhealthy_sensitive","unhealthy","very_unhealthy","hazardous")', nullable: false },
      { name: 'recorded_at', type: 'TIMESTAMP', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'GET', path: '/api/v1/air-quality-monitoring', description: 'List air quality readings', permission: 'air-quality-monitoring.view', authRequired: true },
      { method: 'POST', path: '/api/v1/air-quality-monitoring', description: 'Submit a new air quality reading', permission: 'air-quality-monitoring.create', authRequired: true },
      { method: 'GET', path: '/api/v1/air-quality-monitoring/{id}', description: 'Get a specific reading', permission: 'air-quality-monitoring.view', authRequired: true },
      { method: 'GET', path: '/api/v1/air-quality-monitoring/trends', description: 'Get AQI trend analytics', permission: 'air-quality-monitoring.view', authRequired: true }
    ],
    services: ['AirQualityService', 'AQICalculator', 'HealthAlertEngine'],
    events: ['AirQualityReadingReceived', 'AQIThresholdExceeded', 'HealthAlertTriggered'],
    jobs: ['IngestAirQualitySensorsJob', 'CalculateAQITrendsJob', 'BroadcastHealthAlertsJob'],
    dependencies: [101, 9],
    tests: ['AQICalculationTest', 'ThresholdAlertTest', 'SensorIngestionTest']
  }),

  buildModule({
    id: 405,
    name: 'Smart Street Lighting',
    slug: 'smart-street-lighting',
    category: 'Smart Cities & IoT',
    phase: 21,
    iconName: 'Lightbulb',
    purpose: 'Adaptive LED streetlight dimming, fault detection, energy consumption analytics, and mesh network management for municipal lighting infrastructure.',
    responsibilities: [
      'Control LED streetlight brightness levels dynamically based on ambient light and traffic conditions',
      'Detect and report fixture faults including LED burnout, driver failures, and communication dropouts',
      'Track energy consumption per fixture and optimize dimming schedules for municipal cost savings'
    ],
    tableName: 'street_lights',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'fixture_id', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'pole_height_m', type: 'DECIMAL(4,2)', nullable: true },
      { name: 'wattage_rating', type: 'INT', nullable: false },
      { name: 'dimming_level_pct', type: 'INT', nullable: false },
      { name: 'latitude', type: 'DECIMAL(10,8)', nullable: false },
      { name: 'longitude', type: 'DECIMAL(11,8)', nullable: false },
      { name: 'fixture_status', type: 'ENUM("on","dimmed","off","fault","maintenance")', nullable: false },
      { name: 'mesh_node_id', type: 'VARCHAR(64)', nullable: true },
      { name: 'last_fault_at', type: 'TIMESTAMP', nullable: true },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'GET', path: '/api/v1/smart-street-lighting', description: 'List all street light fixtures', permission: 'smart-street-lighting.view', authRequired: true },
      { method: 'POST', path: '/api/v1/smart-street-lighting', description: 'Register a new street light fixture', permission: 'smart-street-lighting.create', authRequired: true },
      { method: 'GET', path: '/api/v1/smart-street-lighting/{id}', description: 'Get fixture details', permission: 'smart-street-lighting.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/smart-street-lighting/{id}/status', description: 'Update dimming level or fixture status', permission: 'smart-street-lighting.manage', authRequired: true }
    ],
    services: ['StreetLightService', 'DimmingController', 'EnergyAnalyticsEngine'],
    events: ['StreetLightFaultDetected', 'DimmingLevelChanged', 'EnergyUsageUpdated'],
    jobs: ['SyncStreetLightSensorsJob', 'OptimizeDimmingScheduleJob', 'GenerateEnergyReportJob'],
    dependencies: [88, 101],
    tests: ['DimmingControlTest', 'FaultDetectionTest', 'EnergyAnalyticsTest']
  }),

  buildModule({
    id: 406,
    name: 'Water Quality Monitoring',
    slug: 'water-quality-monitoring',
    category: 'Smart Cities & IoT',
    phase: 21,
    iconName: 'Droplets',
    purpose: 'Real-time potable water quality measurement, contamination detection, pH and chlorine tracking, and distribution system alert management.',
    responsibilities: [
      'Monitor pH, chlorine residual, turbidity, and temperature at distribution network sampling points',
      'Detect contamination events and trigger boil-water advisories for affected service zones',
      'Track water quality compliance with EPA Safe Drinking Water Act Maximum Contaminant Levels'
    ],
    tableName: 'water_quality_readings',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'sensor_id', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'distribution_zone', type: 'VARCHAR(128)', nullable: false, index: true },
      { name: 'ph_value', type: 'DECIMAL(4,2)', nullable: true },
      { name: 'chlorine_ppm', type: 'DECIMAL(6,3)', nullable: true },
      { name: 'turbidity_ntu', type: 'DECIMAL(6,2)', nullable: true },
      { name: 'temperature_c', type: 'DECIMAL(4,1)', nullable: true },
      { name: 'dissolved_oxygen_ppm', type: 'DECIMAL(5,2)', nullable: true },
      { name: 'compliance_status', type: 'ENUM("pass","warning","violation","critical")', nullable: false },
      { name: 'recorded_at', type: 'TIMESTAMP', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'GET', path: '/api/v1/water-quality-monitoring', description: 'List water quality readings', permission: 'water-quality-monitoring.view', authRequired: true },
      { method: 'POST', path: '/api/v1/water-quality-monitoring', description: 'Submit a water quality reading', permission: 'water-quality-monitoring.create', authRequired: true },
      { method: 'GET', path: '/api/v1/water-quality-monitoring/{id}', description: 'Get a specific reading', permission: 'water-quality-monitoring.view', authRequired: true },
      { method: 'GET', path: '/api/v1/water-quality-monitoring/compliance', description: 'Get compliance report', permission: 'water-quality-monitoring.view', authRequired: true }
    ],
    services: ['WaterQualityService', 'ContaminationDetector', 'ComplianceReportEngine'],
    events: ['WaterQualityReadingReceived', 'ContaminationDetected', 'ComplianceViolationTriggered'],
    jobs: ['IngestWaterQualitySensorsJob', 'AnalyzeContaminationPatternsJob', 'GenerateComplianceReportJob'],
    dependencies: [101, 9],
    tests: ['WaterQualityReadingTest', 'ContaminationAlertTest', 'ComplianceReportTest']
  }),

  buildModule({
    id: 407,
    name: 'Smart Grid Energy',
    slug: 'smart-grid-energy',
    category: 'Smart Cities & IoT',
    phase: 21,
    iconName: 'Zap',
    purpose: 'Distributed energy resource management, grid node telemetry, demand response coordination, and renewable energy integration for smart cities.',
    responsibilities: [
      'Monitor grid node voltage, current, and power factor telemetry from SCADA sensors',
      'Coordinate demand response events reducing peak load during high-demand periods',
      'Manage distributed solar, wind, and battery storage integration into the distribution grid'
    ],
    tableName: 'grid_nodes',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'node_id', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'node_type', type: 'ENUM("substation","feeder","transformer","solar","battery","ev_charger")', nullable: false },
      { name: 'latitude', type: 'DECIMAL(10,8)', nullable: false },
      { name: 'longitude', type: 'DECIMAL(11,8)', nullable: false },
      { name: 'voltage_kv', type: 'DECIMAL(8,2)', nullable: true },
      { name: 'current_amps', type: 'DECIMAL(10,2)', nullable: true },
      { name: 'power_factor', type: 'DECIMAL(3,2)', nullable: true },
      { name: 'status', type: 'ENUM("online","offline","maintenance","fault","islanded")', nullable: false },
      { name: 'last_telemetry_at', type: 'TIMESTAMP', nullable: true },
      { name: 'metadata', type: 'JSON', nullable: true },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'GET', path: '/api/v1/smart-grid-energy', description: 'List all grid nodes', permission: 'smart-grid-energy.view', authRequired: true },
      { method: 'POST', path: '/api/v1/smart-grid-energy', description: 'Register a new grid node', permission: 'smart-grid-energy.create', authRequired: true },
      { method: 'GET', path: '/api/v1/smart-grid-energy/{id}', description: 'Get grid node telemetry', permission: 'smart-grid-energy.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/smart-grid-energy/{id}/status', description: 'Update grid node status', permission: 'smart-grid-energy.manage', authRequired: true }
    ],
    services: ['SmartGridService', 'DemandResponseCoordinator', 'DERIntegrationEngine'],
    events: ['GridNodeTelemetryReceived', 'DemandResponseActivated', 'DEROutputChanged'],
    jobs: ['SyncGridTelemetryJob', 'CoordinateDemandResponseJob', 'OptimizeDERDispatchJob'],
    dependencies: [101, 103],
    tests: ['GridTelemetryTest', 'DemandResponseTest', 'DERIntegrationTest']
  }),

  buildModule({
    id: 408,
    name: 'Public Safety IoT',
    slug: 'public-safety-iot',
    category: 'Smart Cities & IoT',
    phase: 21,
    iconName: 'ShieldAlert',
    purpose: 'IoT-enabled public safety incident detection, gunshot detection, emergency response coordination, and surveillance camera analytics.',
    responsibilities: [
      'Detect gunshot, explosion, and aggressive incident audio signatures via acoustic sensor arrays',
      'Coordinate emergency response dispatch by correlating sensor data with public safety protocols',
      'Analyze surveillance camera feeds for crowd density, abandoned objects, and perimeter violations'
    ],
    tableName: 'safety_incidents',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'incident_code', type: 'VARCHAR(32)', nullable: false, index: true },
      { name: 'incident_type', type: 'ENUM("gunshot","explosion","aggression","fire","hazard","suspicious")', nullable: false },
      { name: 'latitude', type: 'DECIMAL(10,8)', nullable: false },
      { name: 'longitude', type: 'DECIMAL(11,8)', nullable: false },
      { name: 'severity', type: 'ENUM("low","medium","high","critical")', nullable: false },
      { name: 'detection_confidence', type: 'DECIMAL(3,2)', nullable: true },
      { name: 'response_dispatched', type: 'BOOLEAN', nullable: false },
      { name: 'resolved_at', type: 'TIMESTAMP', nullable: true },
      { name: 'metadata', type: 'JSON', nullable: true },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'GET', path: '/api/v1/public-safety-iot', description: 'List public safety incidents', permission: 'public-safety-iot.view', authRequired: true },
      { method: 'POST', path: '/api/v1/public-safety-iot', description: 'Report a new safety incident', permission: 'public-safety-iot.create', authRequired: true },
      { method: 'GET', path: '/api/v1/public-safety-iot/{id}', description: 'Get incident details', permission: 'public-safety-iot.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/public-safety-iot/{id}/status', description: 'Update incident response status', permission: 'public-safety-iot.manage', authRequired: true }
    ],
    services: ['PublicSafetyService', 'AcousticDetectionEngine', 'EmergencyResponseCoordinator'],
    events: ['SafetyIncidentDetected', 'EmergencyResponseDispatched', 'IncidentResolved'],
    jobs: ['AnalyzeAcousticSensorsJob', 'DispatchEmergencyResponseJob', 'GenerateSafetyReportJob'],
    dependencies: [101, 41],
    tests: ['GunshotDetectionTest', 'EmergencyDispatchTest', 'IncidentResolutionTest']
  }),

  buildModule({
    id: 409,
    name: 'Flood Monitoring & Alert',
    slug: 'flood-monitoring-alert',
    category: 'Smart Cities & IoT',
    phase: 21,
    iconName: 'CloudRain',
    purpose: 'Real-time water level monitoring, flood risk prediction, storm drain capacity tracking, and public flood warning notification delivery.',
    responsibilities: [
      'Monitor river, creek, and storm drain water levels via ultrasonic and pressure sensor networks',
      'Predict flood risk events using rainfall forecasts, tidal data, and historical hydrology models',
      'Broadcast flood warnings to residents through multi-channel notification systems'
    ],
    tableName: 'flood_sensors',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'sensor_id', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'waterway_name', type: 'VARCHAR(255)', nullable: false },
      { name: 'latitude', type: 'DECIMAL(10,8)', nullable: false },
      { name: 'longitude', type: 'DECIMAL(11,8)', nullable: false },
      { name: 'water_level_m', type: 'DECIMAL(6,2)', nullable: false },
      { name: 'flood_stage', type: 'ENUM("normal","action","minor","moderate","major")', nullable: false },
      { name: 'rainfall_mm_24h', type: 'DECIMAL(6,1)', nullable: true },
      { name: 'drain_capacity_pct', type: 'INT', nullable: true },
      { name: 'alert_active', type: 'BOOLEAN', nullable: false },
      { name: 'recorded_at', type: 'TIMESTAMP', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'GET', path: '/api/v1/flood-monitoring-alert', description: 'List flood sensor readings', permission: 'flood-monitoring-alert.view', authRequired: true },
      { method: 'POST', path: '/api/v1/flood-monitoring-alert', description: 'Submit a flood sensor reading', permission: 'flood-monitoring-alert.create', authRequired: true },
      { method: 'GET', path: '/api/v1/flood-monitoring-alert/{id}', description: 'Get sensor details', permission: 'flood-monitoring-alert.view', authRequired: true },
      { method: 'GET', path: '/api/v1/flood-monitoring-alert/warnings', description: 'Get active flood warnings', permission: 'flood-monitoring-alert.view', authRequired: true }
    ],
    services: ['FloodMonitoringService', 'FloodPredictionEngine', 'FloodWarningBroadcaster'],
    events: ['FloodSensorReadingReceived', 'FloodStageChanged', 'FloodWarningIssued'],
    jobs: ['IngestFloodSensorDataJob', 'PredictFloodRiskJob', 'BroadcastFloodWarningsJob'],
    dependencies: [101, 9],
    tests: ['FloodSensorReadingTest', 'FloodPredictionTest', 'WarningBroadcastTest']
  }),

  buildModule({
    id: 410,
    name: 'Connected Vehicle V2X',
    slug: 'connected-vehicle-v2x',
    category: 'Smart Cities & IoT',
    phase: 21,
    iconName: 'Radio',
    purpose: 'Vehicle-to-Everything (V2X) communication messaging, intersection collision avoidance, and cooperative adaptive cruise control coordination.',
    responsibilities: [
      'Process V2X Basic Safety Messages (BSM) from connected vehicles including position and trajectory',
      'Coordinate intersection collision avoidance warnings using cooperative perception data',
      'Manage Vehicle-to-Infrastructure (V2I) signal phase and timing (SPaT) broadcast messages'
    ],
    tableName: 'v2x_messages',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'message_id', type: 'VARCHAR(128)', nullable: false, index: true },
      { name: 'vehicle_id', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'message_type', type: 'ENUM("bsm","map","spat","rsa","psm","tim")', nullable: false },
      { name: 'latitude', type: 'DECIMAL(10,8)', nullable: false },
      { name: 'longitude', type: 'DECIMAL(11,8)', nullable: false },
      { name: 'heading_deg', type: 'DECIMAL(5,1)', nullable: true },
      { name: 'speed_kmh', type: 'DECIMAL(6,2)', nullable: true },
      { name: 'priority_level', type: 'ENUM("normal","elevated","emergency","hazmat")', nullable: false },
      { name: 'raw_payload', type: 'JSON', nullable: true },
      { name: 'received_at', type: 'TIMESTAMP', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'GET', path: '/api/v1/connected-vehicle-v2x', description: 'List V2X messages', permission: 'connected-vehicle-v2x.view', authRequired: true },
      { method: 'POST', path: '/api/v1/connected-vehicle-v2x', description: 'Submit a V2X message', permission: 'connected-vehicle-v2x.create', authRequired: true },
      { method: 'GET', path: '/api/v1/connected-vehicle-v2x/{id}', description: 'Get V2X message details', permission: 'connected-vehicle-v2x.view', authRequired: true },
      { method: 'GET', path: '/api/v1/connected-vehicle-v2x/collision-avoidance', description: 'Get active collision warnings', permission: 'connected-vehicle-v2x.view', authRequired: true }
    ],
    services: ['V2XMessageService', 'CollisionAvoidanceEngine', 'SPaTBroadcaster'],
    events: ['V2XMessageReceived', 'CollisionWarningTriggered', 'SPaTUpdateBroadcast'],
    jobs: ['IngestV2XMessagesJob', 'ProcessCollisionAvoidanceJob', 'BroadcastSPaTUpdatesJob'],
    dependencies: [88, 101],
    tests: ['V2XMessageProcessingTest', 'CollisionAvoidanceTest', 'SPaTBroadcastTest']
  }),

  buildModule({
    id: 411,
    name: 'Noise Pollution Mapping',
    slug: 'noise-pollution-mapping',
    category: 'Smart Cities & IoT',
    phase: 21,
    iconName: 'Volume2',
    purpose: 'Urban noise level monitoring, decibel heat map generation, noise violation detection, and community complaint correlation analytics.',
    responsibilities: [
      'Measure continuous ambient noise levels in decibels at distributed urban sensor locations',
      'Generate real-time noise pollution heat maps and historical trend visualizations',
      'Detect noise ordinance violations and correlate with citizen complaint data'
    ],
    tableName: 'noise_readings',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'sensor_id', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'latitude', type: 'DECIMAL(10,8)', nullable: false },
      { name: 'longitude', type: 'DECIMAL(11,8)', nullable: false },
      { name: 'db_level', type: 'DECIMAL(5,1)', nullable: false },
      { name: 'db_peak', type: 'DECIMAL(5,1)', nullable: true },
      { name: 'frequency_band', type: 'ENUM("low","mid","high","broadband")', nullable: false },
      { name: 'noise_category', type: 'ENUM("residential","commercial","industrial","construction","traffic","social")', nullable: false },
      { name: 'limit_exceeded', type: 'BOOLEAN', nullable: false },
      { name: 'recorded_at', type: 'TIMESTAMP', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'GET', path: '/api/v1/noise-pollution-mapping', description: 'List noise level readings', permission: 'noise-pollution-mapping.view', authRequired: true },
      { method: 'POST', path: '/api/v1/noise-pollution-mapping', description: 'Submit a noise reading', permission: 'noise-pollution-mapping.create', authRequired: true },
      { method: 'GET', path: '/api/v1/noise-pollution-mapping/{id}', description: 'Get a specific reading', permission: 'noise-pollution-mapping.view', authRequired: true },
      { method: 'GET', path: '/api/v1/noise-pollution-mapping/heatmap', description: 'Get noise heatmap data', permission: 'noise-pollution-mapping.view', authRequired: true }
    ],
    services: ['NoiseMonitoringService', 'HeatmapGenerator', 'NoiseViolationDetector'],
    events: ['NoiseReadingReceived', 'NoiseLimitExceeded', 'HeatmapUpdated'],
    jobs: ['IngestNoiseSensorDataJob', 'GenerateNoiseHeatmapJob', 'DetectNoiseViolationsJob'],
    dependencies: [101, 9],
    tests: ['NoiseReadingTest', 'HeatmapGenerationTest', 'ViolationDetectionTest']
  }),

  buildModule({
    id: 412,
    name: 'Smart Building HVAC',
    slug: 'smart-building-hvac',
    category: 'Smart Cities & IoT',
    phase: 21,
    iconName: 'Thermometer',
    purpose: 'Building HVAC zone temperature control, energy-efficient climate scheduling, occupancy-based adjustment, and indoor air quality monitoring.',
    responsibilities: [
      'Control HVAC zone temperatures using occupancy sensor data and schedule optimization algorithms',
      'Monitor indoor air quality metrics including CO2, humidity, and volatile organic compound levels',
      'Optimize HVAC energy consumption while maintaining occupant comfort and ventilation standards'
    ],
    tableName: 'hvac_zones',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'zone_id', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'building_id', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'floor_number', type: 'INT', nullable: false },
      { name: 'target_temp_c', type: 'DECIMAL(4,1)', nullable: false },
      { name: 'current_temp_c', type: 'DECIMAL(4,1)', nullable: true },
      { name: 'humidity_pct', type: 'DECIMAL(4,1)', nullable: true },
      { name: 'co2_ppm', type: 'INT', nullable: true },
      { name: 'occupancy_count', type: 'INT', nullable: true },
      { name: 'hvac_mode', type: 'ENUM("heating","cooling","auto","off","ventilation_only")', nullable: false },
      { name: 'energy_kwh_today', type: 'DECIMAL(8,2)', nullable: true },
      { name: 'status', type: 'ENUM("active","idle","maintenance","fault")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'GET', path: '/api/v1/smart-building-hvac', description: 'List all HVAC zones', permission: 'smart-building-hvac.view', authRequired: true },
      { method: 'POST', path: '/api/v1/smart-building-hvac', description: 'Register a new HVAC zone', permission: 'smart-building-hvac.create', authRequired: true },
      { method: 'GET', path: '/api/v1/smart-building-hvac/{id}', description: 'Get HVAC zone details', permission: 'smart-building-hvac.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/smart-building-hvac/{id}/status', description: 'Update HVAC mode or target temperature', permission: 'smart-building-hvac.manage', authRequired: true }
    ],
    services: ['HVACZoneService', 'ClimateOptimizer', 'IndoorAirQualityMonitor'],
    events: ['HVACTargetChanged', 'AirQualityAlert', 'EnergyUsageThreshold'],
    jobs: ['SyncHVACSensorsJob', 'OptimizeClimateScheduleJob', 'MonitorIndoorAirQualityJob'],
    dependencies: [101, 103],
    tests: ['HVACTargetControlTest', 'ClimateOptimizationTest', 'AirQualityMonitoringTest']
  }),

  buildModule({
    id: 413,
    name: 'Drone Traffic Management',
    slug: 'drone-traffic-management',
    category: 'Smart Cities & IoT',
    phase: 21,
    iconName: 'Plane',
    purpose: 'Urban drone airspace management, flight path deconfliction, vertiport scheduling, and FAA Low Altitude Authorization and Notification (LAANC) compliance.',
    responsibilities: [
      'Manage drone flight paths and altitude corridors in urban airspace to prevent mid-air conflicts',
      'Coordinate vertiport and drone takeoff/landing pad scheduling across city facilities',
      'Submit and track FAA LAANC authorization requests for controlled airspace drone operations'
    ],
    tableName: 'drone_flights',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'flight_id', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'drone_id', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'operator_id', type: 'VARCHAR(64)', nullable: false },
      { name: 'origin_vertiport', type: 'VARCHAR(64)', nullable: true },
      { name: 'destination_vertiport', type: 'VARCHAR(64)', nullable: true },
      { name: 'planned_altitude_m', type: 'INT', nullable: false },
      { name: 'flight_status', type: 'ENUM("planned","authorized","in_flight","completed","cancelled","diverted")', nullable: false },
      { name: 'path_geofence', type: 'JSON', nullable: true },
      { name: 'laanc_authorization_id', type: 'VARCHAR(128)', nullable: true },
      { name: 'planned_departure_at', type: 'TIMESTAMP', nullable: false },
      { name: 'actual_arrival_at', type: 'TIMESTAMP', nullable: true },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'GET', path: '/api/v1/drone-traffic-management', description: 'List drone flights', permission: 'drone-traffic-management.view', authRequired: true },
      { method: 'POST', path: '/api/v1/drone-traffic-management', description: 'Register a planned drone flight', permission: 'drone-traffic-management.create', authRequired: true },
      { method: 'GET', path: '/api/v1/drone-traffic-management/{id}', description: 'Get drone flight details', permission: 'drone-traffic-management.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/drone-traffic-management/{id}/status', description: 'Update flight status or divert', permission: 'drone-traffic-management.manage', authRequired: true }
    ],
    services: ['DroneTrafficService', 'AirspaceDeconflictionEngine', 'LAANCAuthorizationService'],
    events: ['DroneFlightPlanned', 'DroneFlightAuthorized', 'DroneFlightDiverted'],
    jobs: ['DeconflictDronePathsJob', 'SubmitLAANCRequestJob', 'TrackActiveDroneFlightsJob'],
    dependencies: [101, 88],
    tests: ['FlightPathDeconflictionTest', 'LAANCAuthorizationTest', 'VertiportSchedulingTest']
  }),

  buildModule({
    id: 414,
    name: 'Smart Metering Utilities',
    slug: 'smart-metering-utilities',
    category: 'Smart Cities & IoT',
    phase: 21,
    iconName: 'Gauge',
    purpose: 'Advanced Metering Infrastructure (AMI) for electricity, gas, and water consumption, time-of-use pricing, and utility billing integration.',
    responsibilities: [
      'Collect hourly consumption telemetry from smart meters across electricity, gas, and water utilities',
      'Calculate time-of-use pricing and demand charge billing based on consumption intervals',
      'Detect tampering, theft, and unusual consumption patterns requiring field investigation'
    ],
    tableName: 'smart_meters',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'meter_serial', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'utility_type', type: 'ENUM("electricity","gas","water","steam")', nullable: false },
      { name: 'customer_account', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'latitude', type: 'DECIMAL(10,8)', nullable: false },
      { name: 'longitude', type: 'DECIMAL(11,8)', nullable: false },
      { name: 'reading_kwh', type: 'DECIMAL(12,2)', nullable: true },
      { name: 'peak_demand_kw', type: 'DECIMAL(8,2)', nullable: true },
      { name: 'meter_status', type: 'ENUM("active","inactive","tampered","fault","offline")', nullable: false },
      { name: 'last_reading_at', type: 'TIMESTAMP', nullable: true },
      { name: 'firmware_version', type: 'VARCHAR(32)', nullable: true },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'GET', path: '/api/v1/smart-metering-utilities', description: 'List smart meters', permission: 'smart-metering-utilities.view', authRequired: true },
      { method: 'POST', path: '/api/v1/smart-metering-utilities', description: 'Register a new smart meter', permission: 'smart-metering-utilities.create', authRequired: true },
      { method: 'GET', path: '/api/v1/smart-metering-utilities/{id}', description: 'Get meter details', permission: 'smart-metering-utilities.view', authRequired: true },
      { method: 'POST', path: '/api/v1/smart-metering-utilities/{id}/readings', description: 'Submit consumption readings', permission: 'smart-metering-utilities.create', authRequired: true }
    ],
    services: ['SmartMeterService', 'ConsumptionAnalyticsEngine', 'TamperDetectionService'],
    events: ['MeterReadingReceived', 'TamperDetected', 'ConsumptionAnomalyAlert'],
    jobs: ['IngestMeterReadingsJob', 'DetectConsumptionAnomaliesJob', 'CalculateTOUBillingJob'],
    dependencies: [101, 103],
    tests: ['MeterReadingIngestTest', 'TamperDetectionTest', 'TOUBillingCalculationTest']
  }),

  buildModule({
    id: 415,
    name: 'Smart Transit Systems',
    slug: 'smart-transit-systems',
    category: 'Smart Cities & IoT',
    phase: 21,
    iconName: 'Bus',
    purpose: 'Real-time public transit vehicle tracking, passenger occupancy monitoring, route optimization, and GTFS-RT schedule adherence management.',
    responsibilities: [
      'Track real-time GPS positions and speeds of all transit vehicles across bus, tram, and rail networks',
      'Monitor passenger occupancy levels using infrared door counters and weight sensors',
      'Optimize transit schedules and routes based on ridership demand and traffic conditions'
    ],
    tableName: 'transit_vehicles',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'vehicle_id', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'route_id', type: 'VARCHAR(32)', nullable: false, index: true },
      { name: 'vehicle_type', type: 'ENUM("bus","tram","light_rail","subway","ferry")', nullable: false },
      { name: 'latitude', type: 'DECIMAL(10,8)', nullable: false },
      { name: 'longitude', type: 'DECIMAL(11,8)', nullable: false },
      { name: 'heading_deg', type: 'DECIMAL(5,1)', nullable: true },
      { name: 'speed_kmh', type: 'DECIMAL(6,2)', nullable: true },
      { name: 'passenger_count', type: 'INT', nullable: true },
      { name: 'capacity_pct', type: 'INT', nullable: true },
      { name: 'schedule_deviation_sec', type: 'INT', nullable: true },
      { name: 'vehicle_status', type: 'ENUM("in_service","at_stop","layover","diverted","out_of_service")', nullable: false },
      { name: 'last_position_at', type: 'TIMESTAMP', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'GET', path: '/api/v1/smart-transit-systems', description: 'List all transit vehicles', permission: 'smart-transit-systems.view', authRequired: true },
      { method: 'POST', path: '/api/v1/smart-transit-systems', description: 'Register a transit vehicle', permission: 'smart-transit-systems.create', authRequired: true },
      { method: 'GET', path: '/api/v1/smart-transit-systems/{id}', description: 'Get vehicle details', permission: 'smart-transit-systems.view', authRequired: true },
      { method: 'GET', path: '/api/v1/smart-transit-systems/{id}/positions', description: 'Get vehicle position history', permission: 'smart-transit-systems.view', authRequired: true }
    ],
    services: ['TransitVehicleService', 'GTFSRTFeedGenerator', 'OccupancyMonitor'],
    events: ['TransitPositionUpdated', 'PassengerCountChanged', 'ScheduleDeviationDetected'],
    jobs: ['SyncTransitGPSPositionsJob', 'GenerateGTFSRealtimeFeedJob', 'AnalyzeRidershipPatternsJob'],
    dependencies: [88, 27],
    tests: ['TransitTrackingTest', 'GTFSRTFeedTest', 'OccupancyMonitoringTest']
  }),

  buildModule({
    id: 416,
    name: 'Urban Green Space Monitor',
    slug: 'urban-green-space-monitor',
    category: 'Smart Cities & IoT',
    phase: 21,
    iconName: 'TreePine',
    purpose: 'Urban park and tree canopy health monitoring, irrigation automation, air quality contribution estimation, and biodiversity tracking.',
    responsibilities: [
      'Monitor tree health and canopy coverage using satellite imagery and ground-based sensor data',
      'Automate park irrigation systems based on soil moisture, weather forecasts, and plant water requirements',
      'Track urban biodiversity indicators including pollinator activity and bird species presence'
    ],
    tableName: 'green_space_assets',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'asset_id', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'asset_type', type: 'ENUM("tree","shrub","lawn","garden","wetland","green_roof")', nullable: false },
      { name: 'species_name', type: 'VARCHAR(255)', nullable: true },
      { name: 'latitude', type: 'DECIMAL(10,8)', nullable: false },
      { name: 'longitude', type: 'DECIMAL(11,8)', nullable: false },
      { name: 'health_score', type: 'DECIMAL(3,2)', nullable: true },
      { name: 'canopy_area_sqm', type: 'DECIMAL(10,2)', nullable: true },
      { name: 'soil_moisture_pct', type: 'DECIMAL(5,2)', nullable: true },
      { name: 'irrigation_active', type: 'BOOLEAN', nullable: false },
      { name: 'last_assessment_at', type: 'TIMESTAMP', nullable: true },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'GET', path: '/api/v1/urban-green-space-monitor', description: 'List green space assets', permission: 'urban-green-space-monitor.view', authRequired: true },
      { method: 'POST', path: '/api/v1/urban-green-space-monitor', description: 'Register a new green space asset', permission: 'urban-green-space-monitor.create', authRequired: true },
      { method: 'GET', path: '/api/v1/urban-green-space-monitor/{id}', description: 'Get asset details', permission: 'urban-green-space-monitor.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/urban-green-space-monitor/{id}/status', description: 'Update health score or irrigation', permission: 'urban-green-space-monitor.manage', authRequired: true }
    ],
    services: ['GreenSpaceAssetService', 'TreeHealthAnalyzer', 'AutomatedIrrigationController'],
    events: ['GreenSpaceHealthUpdated', 'IrrigationTriggered', 'BiodiversityIndicatorDetected'],
    jobs: ['AssessTreeCanopyHealthJob', 'ControlIrrigationSystemJob', 'TrackBiodiversityIndicatorsJob'],
    dependencies: [101, 9],
    tests: ['TreeHealthAssessmentTest', 'IrrigationControlTest', 'BiodiversityTrackingTest']
  }),

  buildModule({
    id: 417,
    name: 'Smart Waste Water',
    slug: 'smart-waste-water',
    category: 'Smart Cities & IoT',
    phase: 21,
    iconName: 'Droplet',
    purpose: 'Sewer system sensor monitoring, stormwater overflow detection, wastewater treatment plant telemetry, and combined sewer overflow (CSO) prevention.',
    responsibilities: [
      'Monitor sewer flow rates and levels at critical junction points using level and velocity sensors',
      'Detect and prevent combined sewer overflow (CSO) events using predictive control systems',
      'Track wastewater treatment plant influent and effluent quality metrics for regulatory compliance'
    ],
    tableName: 'sewer_sensors',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'sensor_id', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'catchment_area', type: 'VARCHAR(128)', nullable: false, index: true },
      { name: 'latitude', type: 'DECIMAL(10,8)', nullable: false },
      { name: 'longitude', type: 'DECIMAL(11,8)', nullable: false },
      { name: 'flow_rate_lps', type: 'DECIMAL(10,2)', nullable: true },
      { name: 'water_level_m', type: 'DECIMAL(6,2)', nullable: true },
      { name: 'turbidity_ntu', type: 'DECIMAL(8,2)', nullable: true },
      { name: 'overflow_risk', type: 'ENUM("low","moderate","high","critical")', nullable: false },
      { name: 'cso_prevention_active', type: 'BOOLEAN', nullable: false },
      { name: 'recorded_at', type: 'TIMESTAMP', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'GET', path: '/api/v1/smart-waste-water', description: 'List sewer sensor readings', permission: 'smart-waste-water.view', authRequired: true },
      { method: 'POST', path: '/api/v1/smart-waste-water', description: 'Submit a sewer sensor reading', permission: 'smart-waste-water.create', authRequired: true },
      { method: 'GET', path: '/api/v1/smart-waste-water/{id}', description: 'Get sensor details', permission: 'smart-waste-water.view', authRequired: true },
      { method: 'GET', path: '/api/v1/smart-waste-water/cso-risk', description: 'Get CSO risk assessment', permission: 'smart-waste-water.view', authRequired: true }
    ],
    services: ['SewerSensorService', 'CSOPreventionEngine', 'WastewaterComplianceMonitor'],
    events: ['SewerSensorReadingReceived', 'CSORiskElevated', 'OverflowPrevented'],
    jobs: ['IngestSewerSensorDataJob', 'AssessCSORiskJob', 'MonitorWastewaterComplianceJob'],
    dependencies: [101, 103],
    tests: ['SewerSensorReadingTest', 'CSOPreventionTest', 'WastewaterComplianceTest']
  }),

  buildModule({
    id: 418,
    name: 'Urban Mobility Analytics',
    slug: 'urban-mobility-analytics',
    category: 'Smart Cities & IoT',
    phase: 21,
    iconName: 'Map',
    purpose: 'Multi-modal urban trip analytics, shared mobility fleet utilization, congestion pattern analysis, and transportation planning data aggregation.',
    responsibilities: [
      'Aggregate trip data from bike-share, scooter-share, ride-hail, and public transit systems',
      'Analyze urban mobility patterns including peak hours, popular corridors, and modal split',
      'Generate urban transportation planning reports with congestion heat maps and demand forecasts'
    ],
    tableName: 'mobility_trips',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'trip_id', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'mode', type: 'ENUM("bike","scooter","ride_hail","bus","subway","walk","car_share")', nullable: false },
      { name: 'origin_zone', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'destination_zone', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'origin_lat', type: 'DECIMAL(10,8)', nullable: false },
      { name: 'origin_lng', type: 'DECIMAL(11,8)', nullable: false },
      { name: 'destination_lat', type: 'DECIMAL(10,8)', nullable: false },
      { name: 'destination_lng', type: 'DECIMAL(11,8)', nullable: false },
      { name: 'duration_seconds', type: 'INT', nullable: false },
      { name: 'distance_km', type: 'DECIMAL(6,2)', nullable: true },
      { name: 'started_at', type: 'TIMESTAMP', nullable: false },
      { name: 'ended_at', type: 'TIMESTAMP', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'GET', path: '/api/v1/urban-mobility-analytics', description: 'List mobility trips', permission: 'urban-mobility-analytics.view', authRequired: true },
      { method: 'POST', path: '/api/v1/urban-mobility-analytics', description: 'Submit a mobility trip', permission: 'urban-mobility-analytics.create', authRequired: true },
      { method: 'GET', path: '/api/v1/urban-mobility-analytics/{id}', description: 'Get trip details', permission: 'urban-mobility-analytics.view', authRequired: true },
      { method: 'GET', path: '/api/v1/urban-mobility-analytics/patterns', description: 'Get mobility pattern analytics', permission: 'urban-mobility-analytics.view', authRequired: true }
    ],
    services: ['MobilityTripService', 'PatternAnalyzer', 'UrbanPlanningReportEngine'],
    events: ['MobilityTripRecorded', 'CongestionPatternDetected', 'ModalSplitUpdated'],
    jobs: ['IngestMobilityTripDataJob', 'AnalyzeMobilityPatternsJob', 'GenerateUrbanPlanningReportJob'],
    dependencies: [88, 27],
    tests: ['MobilityTripIngestionTest', 'PatternAnalysisTest', 'PlanningReportTest']
  }),

  buildModule({
    id: 419,
    name: 'Digital Twin City',
    slug: 'digital-twin-city',
    category: 'Smart Cities & IoT',
    phase: 21,
    iconName: 'Box',
    purpose: 'Virtual city model synchronization, 3D urban simulation, infrastructure impact analysis, and scenario planning for smart city decision-making.',
    responsibilities: [
      'Synchronize real-time IoT sensor feeds into a 3D digital twin city model',
      'Run infrastructure impact simulations for proposed urban development projects',
      'Provide scenario planning tools for emergency response and climate resilience testing'
    ],
    tableName: 'digital_twin_models',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'model_id', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'model_name', type: 'VARCHAR(255)', nullable: false },
      { name: 'model_type', type: 'ENUM("infrastructure","traffic","energy","water","environment","emergency")', nullable: false },
      { name: 'district_name', type: 'VARCHAR(128)', nullable: false, index: true },
      { name: 'geographic_bounds', type: 'JSON', nullable: false },
      { name: 'sync_status', type: 'ENUM("syncing","synced","stale","error")', nullable: false },
      { name: 'last_synced_at', type: 'TIMESTAMP', nullable: true },
      { name: 'sensor_count', type: 'INT', nullable: true },
      { name: 'version', type: 'VARCHAR(32)', nullable: false },
      { name: 'metadata', type: 'JSON', nullable: true },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'GET', path: '/api/v1/digital-twin-city', description: 'List digital twin models', permission: 'digital-twin-city.view', authRequired: true },
      { method: 'POST', path: '/api/v1/digital-twin-city', description: 'Create a new digital twin model', permission: 'digital-twin-city.create', authRequired: true },
      { method: 'GET', path: '/api/v1/digital-twin-city/{id}', description: 'Get model details', permission: 'digital-twin-city.view', authRequired: true },
      { method: 'POST', path: '/api/v1/digital-twin-city/{id}/simulate', description: 'Run a simulation scenario', permission: 'digital-twin-city.manage', authRequired: true }
    ],
    services: ['DigitalTwinService', 'CityModelSynchronizer', 'ScenarioSimulationEngine'],
    events: ['DigitalTwinSynced', 'SimulationCompleted', 'InfrastructureImpactCalculated'],
    jobs: ['SyncDigitalTwinSensorsJob', 'RunInfrastructureSimulationJob', 'VersionControlDigitalTwinJob'],
    dependencies: [101, 88],
    tests: ['DigitalTwinSyncTest', 'SimulationScenarioTest', 'ModelVersioningTest']
  }),

  buildModule({
    id: 420,
    name: 'Citizen Engagement Platform',
    slug: 'citizen-engagement-platform',
    category: 'Smart Cities & IoT',
    phase: 21,
    iconName: 'Megaphone',
    purpose: 'Citizen service request management, issue reporting with photo upload, sentiment analysis, and municipal response tracking and SLA monitoring.',
    responsibilities: [
      'Enable citizens to submit service requests and issue reports via web, mobile, and SMS channels',
      'Categorize and route citizen requests to appropriate municipal departments for resolution',
      'Track response times and SLA compliance for citizen service request resolution'
    ],
    tableName: 'citizen_requests',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'request_id', type: 'VARCHAR(32)', nullable: false, index: true },
      { name: 'category', type: 'ENUM("pothole","streetlight","noise","graffiti","waste","water","transit","safety","other")', nullable: false },
      { name: 'description', type: 'TEXT', nullable: false },
      { name: 'latitude', type: 'DECIMAL(10,8)', nullable: true },
      { name: 'longitude', type: 'DECIMAL(11,8)', nullable: true },
      { name: 'status', type: 'ENUM("submitted","acknowledged","in_progress","resolved","closed","rejected")', nullable: false },
      { name: 'priority', type: 'ENUM("low","medium","high","urgent")', nullable: false },
      { name: 'citizen_name', type: 'VARCHAR(255)', nullable: true },
      { name: 'citizen_email', type: 'VARCHAR(255)', nullable: true },
      { name: 'photo_urls', type: 'JSON', nullable: true },
      { name: 'assigned_department', type: 'VARCHAR(128)', nullable: true },
      { name: 'resolved_at', type: 'TIMESTAMP', nullable: true },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'GET', path: '/api/v1/citizen-engagement-platform', description: 'List citizen requests', permission: 'citizen-engagement-platform.view', authRequired: true },
      { method: 'POST', path: '/api/v1/citizen-engagement-platform', description: 'Submit a citizen request', permission: 'citizen-engagement-platform.create', authRequired: false },
      { method: 'GET', path: '/api/v1/citizen-engagement-platform/{id}', description: 'Get request details', permission: 'citizen-engagement-platform.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/citizen-engagement-platform/{id}/status', description: 'Update request status', permission: 'citizen-engagement-platform.manage', authRequired: true }
    ],
    services: ['CitizenRequestService', 'RequestRoutingEngine', 'SLAMonitoringService'],
    events: ['CitizenRequestSubmitted', 'RequestStatusUpdated', 'SLABreachDetected'],
    jobs: ['RouteCitizenRequestsJob', 'MonitorSLAComplianceJob', 'AnalyzeCitizenSentimentJob'],
    dependencies: [9, 101],
    tests: ['CitizenRequestSubmissionTest', 'RequestRoutingTest', 'SLAMonitoringTest']
  })
];
