import { buildModule } from './moduleBuilderHelper';

export const modulesDomain11_12 = [
  // ==========================================
  // DOMAIN 11: LOGISTICS & SUPPLY CHAIN (101-130)
  // ==========================================
  buildModule({
    id: 101,
    name: 'Fleet Management',
    slug: 'fleet-management',
    category: 'Logistics & Supply Chain',
    phase: 2,
    iconName: 'Truck',
    purpose: 'Real-time vehicle tracking, engine telemetry, driver duty cycles, and automated preventive maintenance scheduling.',
    responsibilities: [
      'Monitor vehicle GPS telemetry, OBD-II diagnostic fault codes, and fuel efficiency',
      'Track commercial driver hours of service (HOS) and electronic logging compliance',
      'Schedule automated maintenance work orders based on odometer thresholds'
    ],
    tableName: 'fleet_vehicles',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'vin', type: 'VARCHAR(17)', nullable: false, index: true },
      { name: 'license_plate', type: 'VARCHAR(16)', nullable: false },
      { name: 'make_model', type: 'VARCHAR(128)', nullable: false },
      { name: 'fuel_type', type: 'ENUM("diesel","electric","hybrid","gasoline")', nullable: false },
      { name: 'odometer_km', type: 'INT UNSIGNED', nullable: false },
      { name: 'status', type: 'ENUM("in_service","in_transit","maintenance","decommissioned")', nullable: false },
      { name: 'current_lat', type: 'DECIMAL(10,7)', nullable: true },
      { name: 'current_lng', type: 'DECIMAL(10,7)', nullable: true },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 102,
    name: 'Warehouse Slotting & Layout',
    slug: 'warehouse-slotting',
    category: 'Logistics & Supply Chain',
    phase: 2,
    iconName: 'Boxes',
    purpose: 'Algorithmic 3D bin location assignment, pick-path routing optimization, and inventory velocity grouping.',
    responsibilities: [
      'Compute optimal pick bin locations based on SKU turnover frequency and cubic dimensions',
      'Generate serpentine and travelling-salesman pick paths to minimize travel time',
      'Handle aisle capacity constraints, pallet racking limits, and mezzanine zones'
    ],
    tableName: 'warehouse_slots',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'slot_code', type: 'VARCHAR(32)', nullable: false, index: true },
      { name: 'warehouse_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'aisle', type: 'VARCHAR(8)', nullable: false },
      { name: 'row', type: 'VARCHAR(8)', nullable: false },
      { name: 'level_tier', type: 'VARCHAR(8)', nullable: false },
      { name: 'bin_position', type: 'VARCHAR(16)', nullable: false },
      { name: 'max_weight_kg', type: 'DECIMAL(10,2)', nullable: false },
      { name: 'velocity_class', type: 'ENUM("A","B","C","D")', nullable: false },
      { name: 'zone', type: 'VARCHAR(32)', nullable: false },
      { name: 'is_occupied', type: 'BOOLEAN', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 103,
    name: 'Cold Chain Telemetry',
    slug: 'cold-chain-telemetry',
    category: 'Logistics & Supply Chain',
    phase: 2,
    iconName: 'ThermometerSnowflake',
    purpose: 'Continuous temperature and humidity tracking for pharmaceutical and perishable cargo with automated excursion alarms.',
    responsibilities: [
      'Ingest wireless BLE and cellular temperature sensor telemetry at 60-second intervals',
      'Trigger instant real-time alerts when temperature deviates outside defined thresholds (2°C–8°C)',
      'Generate FDA 21 CFR Part 11 compliant thermal excursion audit certificates'
    ],
    tableName: 'cold_chain_telemetry',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'shipment_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'sensor_device_id', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'temperature_celsius', type: 'DECIMAL(5,2)', nullable: false },
      { name: 'humidity_pct', type: 'DECIMAL(5,2)', nullable: true },
      { name: 'latitude', type: 'DECIMAL(10,7)', nullable: true },
      { name: 'longitude', type: 'DECIMAL(10,7)', nullable: true },
      { name: 'reading_ts', type: 'TIMESTAMP', nullable: false, index: true },
      { name: 'excursion_flag', type: 'BOOLEAN', nullable: false },
      { name: 'alert_sent', type: 'BOOLEAN', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 104,
    name: 'Freight Brokerage & Carrier Matching',
    slug: 'freight-brokerage',
    category: 'Logistics & Supply Chain',
    phase: 2,
    iconName: 'Shuffle',
    purpose: 'Automated spot market quoting, lane matching, carrier qualification, and digital rate confirmation binding.',
    responsibilities: [
      'Match freight shippers with certified carriers based on equipment type, lane history, and deadhead miles',
      'Verify carrier active FMCSA insurance, safety scores, and broker contract status',
      'Generate electronic digital rate confirmations with instant e-signatures'
    ],
    tableName: 'freight_shipments',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'origin_city', type: 'VARCHAR(128)', nullable: false, index: true },
      { name: 'destination_city', type: 'VARCHAR(128)', nullable: false, index: true },
      { name: 'equipment_type', type: 'VARCHAR(32)', nullable: false },
      { name: 'weight_lbs', type: 'INT UNSIGNED', nullable: false },
      { name: 'carrier_mc_number', type: 'VARCHAR(32)', nullable: true },
      { name: 'quoted_rate_usd', type: 'DECIMAL(10,2)', nullable: true },
      { name: 'status', type: 'ENUM("pending","quoted","booked","in_transit","delivered")', nullable: false },
      { name: 'pickup_date', type: 'DATE', nullable: true },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 105,
    name: 'Customs Clearance & Harmonized Tariffs',
    slug: 'customs-clearance',
    category: 'Logistics & Supply Chain',
    phase: 3,
    iconName: 'FileCheck2',
    purpose: 'HS code classification, import/export duty calculation, commercial invoice generation, and electronic customs filings.',
    responsibilities: [
      'Automate Harmonized System (HS) code matching using merchandise descriptions',
      'Calculate import duties, VAT, and countervailing taxes across 180+ sovereign jurisdictions',
      'Generate cross-border electronic single window declarations and certificates of origin'
    ],
    tableName: 'customs_declarations',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'declaration_number', type: 'VARCHAR(32)', nullable: false, index: true },
      { name: 'exporter_name', type: 'VARCHAR(256)', nullable: false },
      { name: 'importer_name', type: 'VARCHAR(256)', nullable: false },
      { name: 'hs_code', type: 'VARCHAR(16)', nullable: false, index: true },
      { name: 'country_of_origin', type: 'VARCHAR(3)', nullable: false },
      { name: 'declared_value_usd', type: 'DECIMAL(12,2)', nullable: false },
      { name: 'duty_amount_usd', type: 'DECIMAL(10,2)', nullable: false },
      { name: 'filing_status', type: 'ENUM("draft","filed","accepted","rejected")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 106,
    name: 'Last-Mile Dispatch & Route Optimization',
    slug: 'last-mile-dispatch',
    category: 'Logistics & Supply Chain',
    phase: 2,
    iconName: 'Navigation',
    purpose: 'Dynamic delivery sequencing, vehicle capacity constraints, time-window commitments, and driver mobile manifest dispatch.',
    responsibilities: [
      'Optimize multi-stop delivery routes factoring in real-time traffic, delivery windows, and parcel volumes',
      'Dispatch digital route manifests directly to courier mobile companion apps',
      'Provide recipient live tracking links with predictive estimated time of arrival (ETA)'
    ],
    tableName: 'dispatch_runs',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'driver_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'vehicle_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'route_name', type: 'VARCHAR(64)', nullable: false },
      { name: 'total_stops', type: 'INT UNSIGNED', nullable: false },
      { name: 'completed_stops', type: 'INT UNSIGNED', nullable: false },
      { name: 'total_distance_km', type: 'DECIMAL(10,2)', nullable: true },
      { name: 'estimated_duration_min', type: 'INT UNSIGNED', nullable: true },
      { name: 'status', type: 'ENUM("planned","dispatched","in_progress","completed")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 107,
    name: 'Yard & Dock Door Management',
    slug: 'yard-management',
    category: 'Logistics & Supply Chain',
    phase: 2,
    iconName: 'DoorOpen',
    purpose: 'Trailer spotting, dock door appointment scheduling, gate check-in workflows, and dwell time monitoring.',
    responsibilities: [
      'Coordinate inbound and outbound trailer staging across parking yard spots and loading docks',
      'Manage carrier dock appointment booking to eliminate warehouse congestion and detention fees',
      'Log security gate entry/exit timestamps with automated license plate recognition'
    ],
    tableName: 'dock_appointments',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'carrier_name', type: 'VARCHAR(256)', nullable: false, index: true },
      { name: 'dock_door_number', type: 'VARCHAR(16)', nullable: false },
      { name: 'trailer_number', type: 'VARCHAR(32)', nullable: true },
      { name: 'appointment_type', type: 'ENUM("inbound","outbound")', nullable: false },
      { name: 'scheduled_arrival', type: 'TIMESTAMP', nullable: false, index: true },
      { name: 'actual_arrival', type: 'TIMESTAMP', nullable: true },
      { name: 'dwell_hours', type: 'DECIMAL(6,2)', nullable: true },
      { name: 'status', type: 'ENUM("scheduled","checked_in","at_dock","completed","missed")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 108,
    name: 'Cross-Docking Operations',
    slug: 'cross-docking',
    category: 'Logistics & Supply Chain',
    phase: 2,
    iconName: 'ArrowLeftRight',
    purpose: 'Direct transfer of products from inbound carriers to outbound transit without intermediate storage.',
    responsibilities: [
      'Identify cross-dock eligible purchase orders matching open outbound customer backorders',
      'Direct forklift operators directly from unloading bay to staging outbound doors',
      'Re-label and consolidate multi-vendor pallets into store-ready replenishment orders'
    ],
    tableName: 'cross_dock_batches',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'batch_number', type: 'VARCHAR(32)', nullable: false, index: true },
      { name: 'inbound_dock', type: 'VARCHAR(16)', nullable: false },
      { name: 'outbound_dock', type: 'VARCHAR(16)', nullable: false },
      { name: 'pallet_count', type: 'INT UNSIGNED', nullable: false },
      { name: 'item_count', type: 'INT UNSIGNED', nullable: false },
      { name: 'cross_dock_type', type: 'ENUM("direct","consolidation","deconsolidation")', nullable: false },
      { name: 'status', type: 'ENUM("pending","in_progress","completed")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 109,
    name: 'Return Merchandise Authorization (RMA)',
    slug: 'rma-management',
    category: 'Logistics & Supply Chain',
    phase: 2,
    iconName: 'RotateCcw',
    purpose: 'Reverse logistics intake, warranty verification, disposition grading, and automated replacement or credit disbursement.',
    responsibilities: [
      'Issue trackable RMA numbers and prepaid return shipping labels to customers',
      'Perform intake scanning, serial number verification, and cosmetic grading (A/B/C/Scrap)',
      'Trigger automated refunds, store credits, or warranty replacement orders'
    ],
    tableName: 'rma_requests',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'rma_number', type: 'VARCHAR(32)', nullable: false, index: true },
      { name: 'customer_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'order_id', type: 'BIGINT UNSIGNED', nullable: true },
      { name: 'sku', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'serial_number', type: 'VARCHAR(64)', nullable: true },
      { name: 'reason_code', type: 'VARCHAR(32)', nullable: false },
      { name: 'condition_grade', type: 'ENUM("A","B","C","scrap")', nullable: true },
      { name: 'resolution', type: 'ENUM("refund","credit","replacement","none")', nullable: true },
      { name: 'status', type: 'ENUM("requested","approved","received","inspected","resolved")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 110,
    name: 'Pallet & Container Tracking',
    slug: 'pallet-container-tracking',
    category: 'Logistics & Supply Chain',
    phase: 2,
    iconName: 'Container',
    purpose: 'Circulating asset tracking for CHEP pallets, IBC totes, and intermodal shipping containers with deposit accounting.',
    responsibilities: [
      'Track returnable transport items (RTIs) across warehouses, third-party carriers, and customer sites',
      'Manage container deposit ledgers and loss liability reconciliation',
      'Record maintenance, cleaning certifications, and hydro-testing schedules for chemical totes'
    ],
    tableName: 'reusable_containers',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'container_tag', type: 'VARCHAR(32)', nullable: false, index: true },
      { name: 'container_type', type: 'ENUM("CHEP_pallet","IBC_tote","shipping_container","tote_bin")', nullable: false },
      { name: 'rfid_epc', type: 'VARCHAR(64)', nullable: true },
      { name: 'current_location', type: 'VARCHAR(128)', nullable: true },
      { name: 'custodian_party', type: 'VARCHAR(256)', nullable: true },
      { name: 'deposit_value_usd', type: 'DECIMAL(8,2)', nullable: true },
      { name: 'last_cleaned_at', type: 'TIMESTAMP', nullable: true },
      { name: 'status', type: 'ENUM("available","in_use","dirty","lost","retired")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 111,
    name: 'Hazardous Material Compliance',
    slug: 'hazmat-compliance',
    category: 'Logistics & Supply Chain',
    phase: 3,
    iconName: 'AlertTriangle',
    purpose: 'DOT/IMO dangerous goods documentation, UN number verification, placard requirements, and transport segregation rules.',
    responsibilities: [
      'Validate hazardous goods against international UN packaging groups and hazard classes',
      'Enforce chemical segregation rules preventing incompatible substances in the same vehicle',
      'Generate Dangerous Goods Declarations (DGD) and emergency response guidance forms'
    ],
    tableName: 'hazmat_manifests',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'manifest_number', type: 'VARCHAR(32)', nullable: false, index: true },
      { name: 'un_number', type: 'VARCHAR(8)', nullable: false },
      { name: 'hazard_class', type: 'VARCHAR(8)', nullable: false },
      { name: 'packing_group', type: 'ENUM("I","II","III")', nullable: false },
      { name: 'proper_shipping_name', type: 'VARCHAR(256)', nullable: false },
      { name: 'placard_required', type: 'BOOLEAN', nullable: false },
      { name: 'emergency_contact', type: 'VARCHAR(64)', nullable: true },
      { name: 'transport_mode', type: 'ENUM("road","rail","air","sea")', nullable: false },
      { name: 'status', type: 'ENUM("draft","validated","shipped","delivered")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 112,
    name: '3PL Partner Integration Hub',
    slug: '3pl-integration',
    category: 'Logistics & Supply Chain',
    phase: 2,
    iconName: 'Share2',
    purpose: 'Electronic data interchange (EDI 856, 940, 945) and REST webhooks for third-party logistics fulfillment centers.',
    responsibilities: [
      'Translate purchase orders into standardized EDI 940 warehouse shipping orders',
      'Process inbound EDI 856 advance ship notices and EDI 945 fulfillment confirmations',
      'Maintain real-time inventory level synchronization across distributed 3PL partners'
    ],
    tableName: 'partner_3pl_transfers',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'partner_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'edi_transaction_type', type: 'VARCHAR(16)', nullable: false },
      { name: 'edi_document_id', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'order_reference', type: 'VARCHAR(64)', nullable: true },
      { name: 'item_count', type: 'INT UNSIGNED', nullable: true },
      { name: 'sync_status', type: 'ENUM("pending","transmitted","acknowledged","error")', nullable: false },
      { name: 'response_payload', type: 'JSON', nullable: true },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 113,
    name: 'Supply Chain Digital Twin',
    slug: 'supply-chain-digital-twin',
    category: 'Logistics & Supply Chain',
    phase: 3,
    iconName: 'Activity',
    purpose: 'Simulated network graph of multi-tier supplier nodes, port choke points, lead times, and disruption resilience modeling.',
    responsibilities: [
      'Model physical supply network topology including tier-1, tier-2 suppliers, plants, and hubs',
      'Run stress-test simulations for geopolitical tariffs, port strikes, and natural disasters',
      'Recommend optimal buffer stock levels and alternate dual-sourcing allocations'
    ],
    tableName: 'supply_chain_nodes',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'node_name', type: 'VARCHAR(128)', nullable: false, index: true },
      { name: 'node_type', type: 'ENUM("supplier","plant","warehouse","port","distributor","retailer")', nullable: false },
      { name: 'tier_level', type: 'INT UNSIGNED', nullable: false },
      { name: 'latitude', type: 'DECIMAL(10,7)', nullable: true },
      { name: 'longitude', type: 'DECIMAL(10,7)', nullable: true },
      { name: 'lead_time_days', type: 'INT UNSIGNED', nullable: true },
      { name: 'capacity_units', type: 'INT UNSIGNED', nullable: true },
      { name: 'risk_score', type: 'DECIMAL(3,2)', nullable: true },
      { name: 'status', type: 'ENUM("active","inactive","disrupted")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 114,
    name: 'Inventory Cycle Counting',
    slug: 'cycle-counting',
    category: 'Logistics & Supply Chain',
    phase: 2,
    iconName: 'ClipboardCheck',
    purpose: 'ABC classification-driven continuous auditing schedules, inventory discrepancy reconciliation, and tolerance thresholds.',
    responsibilities: [
      'Generate daily cycle count lists prioritizing high-value and fast-moving Category A inventory',
      'Support blind counting via handheld RF barcode scanners to prevent operator bias',
      'Calculate root-cause inventory variance reports and post automated inventory adjustments'
    ],
    tableName: 'cycle_count_tasks',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'task_number', type: 'VARCHAR(32)', nullable: false, index: true },
      { name: 'warehouse_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'zone', type: 'VARCHAR(32)', nullable: false },
      { name: 'abc_class', type: 'ENUM("A","B","C")', nullable: false },
      { name: 'sku', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'expected_qty', type: 'INT UNSIGNED', nullable: true },
      { name: 'counted_qty', type: 'INT UNSIGNED', nullable: true },
      { name: 'variance', type: 'INT', nullable: true },
      { name: 'counted_by', type: 'BIGINT UNSIGNED', nullable: true },
      { name: 'status', type: 'ENUM("pending","in_progress","completed","reconciled")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 115,
    name: 'Bill of Lading (BoL) Automation',
    slug: 'bol-automation',
    category: 'Logistics & Supply Chain',
    phase: 2,
    iconName: 'FileText',
    purpose: 'Standardized VICS Bill of Lading generation, Master BoL consolidation, and digital carrier sign-off archiving.',
    responsibilities: [
      'Generate compliant standardized Bill of Lading documents with commodity NMFC codes',
      'Consolidate multiple Less-Than-Truckload (LTL) orders into Master Bill of Lading files',
      'Capture electronic driver signatures at dispatch with immutable cloud PDF archiving'
    ],
    tableName: 'bills_of_lading',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'bol_number', type: 'VARCHAR(32)', nullable: false, index: true },
      { name: 'master_bol_number', type: 'VARCHAR(32)', nullable: true, index: true },
      { name: 'shipper_name', type: 'VARCHAR(256)', nullable: false },
      { name: 'consignee_name', type: 'VARCHAR(256)', nullable: false },
      { name: 'carrier_name', type: 'VARCHAR(256)', nullable: false },
      { name: 'nmfc_code', type: 'VARCHAR(16)', nullable: true },
      { name: 'freight_class', type: 'VARCHAR(8)', nullable: true },
      { name: 'piece_count', type: 'INT UNSIGNED', nullable: false },
      { name: 'weight_lbs', type: 'DECIMAL(10,2)', nullable: false },
      { name: 'status', type: 'ENUM("draft","issued","in_transit","delivered")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 116,
    name: 'Fuel Surcharge Calculation',
    slug: 'fuel-surcharge',
    category: 'Logistics & Supply Chain',
    phase: 2,
    iconName: 'Flame',
    purpose: 'Dynamic weekly freight fuel surcharge matrix indexing against DOE national diesel price averages.',
    responsibilities: [
      'Ingest weekly Department of Energy (DOE) diesel fuel index benchmark price updates',
      'Calculate sliding-scale percentage and per-mile fuel surcharges on freight linehauls',
      'Audit freight bills to verify carrier fuel surcharge compliance with contracted tables'
    ],
    tableName: 'fuel_rate_matrices',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'effective_date', type: 'DATE', nullable: false, index: true },
      { name: 'doe_diesel_index', type: 'DECIMAL(6,3)', nullable: false },
      { name: 'base_rate_pct', type: 'DECIMAL(5,2)', nullable: false },
      { name: 'per_mile_rate_usd', type: 'DECIMAL(6,3)', nullable: true },
      { name: 'lane_region', type: 'VARCHAR(64)', nullable: true },
      { name: 'carrier_contract_id', type: 'BIGINT UNSIGNED', nullable: true },
      { name: 'status', type: 'ENUM("draft","active","superseded")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 117,
    name: 'Autonomous Mobile Robot (AMR) Dispatch',
    slug: 'amr-dispatch',
    category: 'Logistics & Supply Chain',
    phase: 3,
    iconName: 'Bot',
    purpose: 'VDA 5050 interoperability protocol integration for autonomous warehouse robots, shelf movers, and pallet tuggers.',
    responsibilities: [
      'Assign pick-to-light transport missions to available autonomous mobile robots (AMRs)',
      'Coordinate traffic intersection priority preventing gridlock in narrow warehouse aisles',
      'Monitor battery state of charge (SoC) and route robots to inductive charging docks'
    ],
    tableName: 'amr_robots',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'robot_serial', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'robot_model', type: 'VARCHAR(64)', nullable: false },
      { name: 'warehouse_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'battery_soc_pct', type: 'DECIMAL(5,2)', nullable: true },
      { name: 'current_zone', type: 'VARCHAR(32)', nullable: true },
      { name: 'mission_type', type: 'VARCHAR(32)', nullable: true },
      { name: 'status', type: 'ENUM("idle","charging","on_mission","maintenance","offline")', nullable: false },
      { name: 'last_heartbeat_at', type: 'TIMESTAMP', nullable: true },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 118,
    name: 'Vendor-Managed Inventory (VMI)',
    slug: 'vmi-management',
    category: 'Logistics & Supply Chain',
    phase: 2,
    iconName: 'Store',
    purpose: 'Consignment inventory tracking, client floor stock replenishment triggers, and supplier self-service portals.',
    responsibilities: [
      'Grant authorized suppliers visibility into real-time stock levels at client manufacturing sites',
      'Trigger automated purchase orders when client floor consumption dips below reorder points',
      'Reconcile ownership transfer and billing when items are pulled from consignment racks'
    ],
    tableName: 'vmi_agreements',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'agreement_number', type: 'VARCHAR(32)', nullable: false, index: true },
      { name: 'supplier_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'client_site_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'sku', type: 'VARCHAR(64)', nullable: false },
      { name: 'reorder_point', type: 'INT UNSIGNED', nullable: false },
      { name: 'max_stock_level', type: 'INT UNSIGNED', nullable: false },
      { name: 'last_replenishment_at', type: 'TIMESTAMP', nullable: true },
      { name: 'status', type: 'ENUM("active","paused","terminated")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 119,
    name: 'Package Dimensioning & Weigh-in-Motion',
    slug: 'package-dimensioning',
    category: 'Logistics & Supply Chain',
    phase: 2,
    iconName: 'Maximize2',
    purpose: 'Conveyor laser scanning, volumetric weight (DIM) calculation, and carrier parcel billing dispute prevention.',
    responsibilities: [
      'Capture real-time length, width, height, and gross weight from conveyor camera sensors',
      'Compute dimensional weight across UPS, FedEx, DHL, and USPS divisor formulas',
      'Detect package bulging or mislabeled dimensions before carrier handover'
    ],
    tableName: 'dimension_scans',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'tracking_number', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'carrier', type: 'VARCHAR(32)', nullable: false },
      { name: 'length_cm', type: 'DECIMAL(8,2)', nullable: false },
      { name: 'width_cm', type: 'DECIMAL(8,2)', nullable: false },
      { name: 'height_cm', type: 'DECIMAL(8,2)', nullable: false },
      { name: 'actual_weight_kg', type: 'DECIMAL(8,2)', nullable: false },
      { name: 'dim_weight_kg', type: 'DECIMAL(8,2)', nullable: false },
      { name: 'scan_station_id', type: 'VARCHAR(32)', nullable: true },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 120,
    name: 'Intermodal Rail & Ocean Booking',
    slug: 'intermodal-booking',
    category: 'Logistics & Supply Chain',
    phase: 3,
    iconName: 'Ship',
    purpose: 'Steamship line container bookings, rail ramp drayage coordination, container demurrage tracking, and shipping line EDI.',
    responsibilities: [
      'Manage booking requests and shipping instructions across global maritime container lines',
      'Coordinate first-mile drayage trucking to intermodal railheads and ocean container terminals',
      'Track free days at container yards to avoid costly demurrage and detention charges'
    ],
    tableName: 'intermodal_bookings',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'booking_reference', type: 'VARCHAR(32)', nullable: false, index: true },
      { name: 'container_number', type: 'VARCHAR(16)', nullable: true, index: true },
      { name: 'shipping_line', type: 'VARCHAR(128)', nullable: false },
      { name: 'port_of_loading', type: 'VARCHAR(64)', nullable: false },
      { name: 'port_of_discharge', type: 'VARCHAR(64)', nullable: false },
      { name: 'free_days_allowed', type: 'INT UNSIGNED', nullable: true },
      { name: 'demurrage_rate_daily', type: 'DECIMAL(8,2)', nullable: true },
      { name: 'status', type: 'ENUM("requested","confirmed","loaded","in_transit","discharged","cleared")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 121,
    name: 'Drop Shipping Fulfillment Hub',
    slug: 'dropshipping-hub',
    category: 'Logistics & Supply Chain',
    phase: 2,
    iconName: 'ExternalLink',
    purpose: 'Blind drop-shipping routing, custom packing slip generation, and multi-supplier inventory feed ingestion.',
    responsibilities: [
      'Route ecommerce orders to the lowest-cost or closest geographical drop-ship supplier',
      'Generate retailer-branded packing slips ensuring supplier anonymity',
      'Normalize multi-vendor CSV/EDI stock feeds into unified platform catalog availability'
    ],
    tableName: 'dropship_orders',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'order_reference', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'retailer_po', type: 'VARCHAR(64)', nullable: true },
      { name: 'supplier_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'customer_name', type: 'VARCHAR(256)', nullable: false },
      { name: 'sku', type: 'VARCHAR(64)', nullable: false },
      { name: 'quantity', type: 'INT UNSIGNED', nullable: false },
      { name: 'dropship_fee_usd', type: 'DECIMAL(8,2)', nullable: true },
      { name: 'status', type: 'ENUM("routed","accepted","shipped","delivered","failed")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 122,
    name: 'Proof of Delivery (ePOD)',
    slug: 'epod-management',
    category: 'Logistics & Supply Chain',
    phase: 2,
    iconName: 'CheckCheck',
    purpose: 'Digital customer signature capture, GPS delivery coordinates, photographic damage records, and instant invoice triggers.',
    responsibilities: [
      'Capture cryptographic customer sign-off with geo-stamped delivery coordinates',
      'Store high-resolution doorstep delivery photographs with optical package verification',
      'Trigger real-time delivery notifications and automated accounts receivable billing'
    ],
    tableName: 'delivery_proofs',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'delivery_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'driver_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'recipient_name', type: 'VARCHAR(256)', nullable: false },
      { name: 'signature_image_url', type: 'VARCHAR(512)', nullable: true },
      { name: 'photo_url', type: 'VARCHAR(512)', nullable: true },
      { name: 'delivery_lat', type: 'DECIMAL(10,7)', nullable: true },
      { name: 'delivery_lng', type: 'DECIMAL(10,7)', nullable: true },
      { name: 'delivered_at', type: 'TIMESTAMP', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 123,
    name: 'Demand-Driven MRP',
    slug: 'ddmrp-engine',
    category: 'Logistics & Supply Chain',
    phase: 3,
    iconName: 'TrendingUp',
    purpose: 'Decoupled lead time buffers, dynamic red/yellow/green replenishment zones, and bullwhip effect damping.',
    responsibilities: [
      'Calculate strategically decoupled stock buffer positions throughout multi-tier supply networks',
      'Dynamically resize buffer zones based on planned promotions and seasonal variance',
      'Dampen bullwhip order amplification across upstream raw material suppliers'
    ],
    tableName: 'ddmrp_buffers',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'buffer_position', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'sku', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'node_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'dlt_days', type: 'INT UNSIGNED', nullable: false },
      { name: 'reorder_point', type: 'INT UNSIGNED', nullable: false },
      { name: 'reorder_qty', type: 'INT UNSIGNED', nullable: false },
      { name: 'red_zone', type: 'INT UNSIGNED', nullable: false },
      { name: 'yellow_zone', type: 'INT UNSIGNED', nullable: false },
      { name: 'green_zone', type: 'INT UNSIGNED', nullable: false },
      { name: 'on_hand_qty', type: 'INT UNSIGNED', nullable: true },
      { name: 'status', type: 'ENUM("green","yellow","red","stockout")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 124,
    name: 'RFID & Barcode Scanning Gateway',
    slug: 'rfid-scanning-gateway',
    category: 'Logistics & Supply Chain',
    phase: 2,
    iconName: 'Scan',
    purpose: 'Fixed portal RFID reader integration, GS1-128 barcode parsing, and bulk pallet inventory intake processing.',
    responsibilities: [
      'Ingest EPC Gen2 UHF RFID tag reads from overhead dock door portal antennas',
      'Decode GS1-128 and DataMatrix 2D barcodes extracting batch, serial, and expiry fields',
      'Ingest 500+ items simultaneously in bulk passing through receiving portals'
    ],
    tableName: 'rfid_event_logs',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'epc_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'reader_id', type: 'VARCHAR(64)', nullable: false },
      { name: 'reader_location', type: 'VARCHAR(128)', nullable: false },
      { name: 'product_sku', type: 'VARCHAR(64)', nullable: true, index: true },
      { name: 'batch_number', type: 'VARCHAR(64)', nullable: true },
      { name: 'read_timestamp', type: 'TIMESTAMP', nullable: false, index: true },
      { name: 'signal_rssi', type: 'DECIMAL(5,2)', nullable: true },
      { name: 'event_type', type: 'ENUM("entry","exit","inventory","alert")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 125,
    name: 'Shipping Insurance & Claims',
    slug: 'shipping-insurance',
    category: 'Logistics & Supply Chain',
    phase: 2,
    iconName: 'ShieldAlert',
    purpose: 'Automated per-shipment insurance declaration, lost parcel claim filing, carrier settlement reconciliation, and payouts.',
    responsibilities: [
      'Bind third-party cargo insurance policies dynamically based on declared commercial value',
      'File digital claims for lost or damaged goods with supporting photographic evidence',
      'Track carrier claim payout status and issue customer restitution credits'
    ],
    tableName: 'shipping_claims',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'claim_number', type: 'VARCHAR(32)', nullable: false, index: true },
      { name: 'shipment_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'carrier_name', type: 'VARCHAR(256)', nullable: false },
      { name: 'claim_type', type: 'ENUM("lost","damaged","shortage","overcharge")', nullable: false },
      { name: 'declared_value_usd', type: 'DECIMAL(10,2)', nullable: false },
      { name: 'claim_amount_usd', type: 'DECIMAL(10,2)', nullable: true },
      { name: 'evidence_urls', type: 'JSON', nullable: true },
      { name: 'payout_status', type: 'ENUM("filed","under_review","approved","denied","paid")', nullable: false },
      { name: 'resolved_at', type: 'TIMESTAMP', nullable: true },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 126,
    name: 'Carbon-Efficient Routing Engine',
    slug: 'green-routing',
    category: 'Logistics & Supply Chain',
    phase: 3,
    iconName: 'Leaf',
    purpose: 'Eco-routing algorithms optimizing for reduced fuel consumption, electric vehicle range, and Scope 3 transport carbon emissions.',
    responsibilities: [
      'Calculate greenhouse gas emissions per freight ton-mile across transport modes',
      'Optimize delivery sequences considering elevation gradients and EV charging infrastructure',
      'Provide shippers carbon-offset options directly at the time of freight booking'
    ],
    tableName: 'green_routes',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'route_name', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'origin_lat', type: 'DECIMAL(10,7)', nullable: false },
      { name: 'origin_lng', type: 'DECIMAL(10,7)', nullable: false },
      { name: 'destination_lat', type: 'DECIMAL(10,7)', nullable: false },
      { name: 'destination_lng', type: 'DECIMAL(10,7)', nullable: false },
      { name: 'distance_km', type: 'DECIMAL(8,2)', nullable: false },
      { name: 'estimated_fuel_liters', type: 'DECIMAL(8,2)', nullable: true },
      { name: 'co2_emissions_kg', type: 'DECIMAL(8,2)', nullable: true },
      { name: 'vehicle_type', type: 'VARCHAR(32)', nullable: true },
      { name: 'ev_charging_stops', type: 'INT UNSIGNED', nullable: true },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 127,
    name: 'Reverse Logistics Processing',
    slug: 'reverse-logistics',
    category: 'Logistics & Supply Chain',
    phase: 2,
    iconName: 'RefreshCw',
    purpose: 'Secondary market refurbishment triage, liquidation auction bundling, and environmentally compliant recycling disposal.',
    responsibilities: [
      'Route returned merchandise to refurbishment, open-box resale, or certified recycling',
      'Bundle excess and returned stock into B2B liquidation wholesale auction lots',
      'Maintain WEEE and RoHS environmental certificates for scrapped electronic components'
    ],
    tableName: 'refurbishment_jobs',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'job_number', type: 'VARCHAR(32)', nullable: false, index: true },
      { name: 'rma_id', type: 'BIGINT UNSIGNED', nullable: true, index: true },
      { name: 'sku', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'serial_number', type: 'VARCHAR(64)', nullable: true },
      { name: 'condition_grade', type: 'ENUM("A","B","C","scrap")', nullable: false },
      { name: 'refurb_cost_usd', type: 'DECIMAL(8,2)', nullable: true },
      { name: 'disposition', type: 'ENUM("resale","open_box","recycle","scrap")', nullable: false },
      { name: 'assigned_tech', type: 'BIGINT UNSIGNED', nullable: true },
      { name: 'status', type: 'ENUM("queued","in_progress","completed","cancelled")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 128,
    name: 'Detention & Demurrage Auditing',
    slug: 'detention-auditing',
    category: 'Logistics & Supply Chain',
    phase: 2,
    iconName: 'Clock',
    purpose: 'Automated driver dwell time logging, port container storage deadline tracking, and carrier fee dispute filing.',
    responsibilities: [
      'Calculate driver waiting time exceeding standard 2-hour free detention windows',
      'Generate automated detention invoices against responsible loading facilities',
      'Dispute illegitimate carrier detention invoices using automated geofence entry/exit logs'
    ],
    tableName: 'detention_logs',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'shipment_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'driver_id', type: 'BIGINT UNSIGNED', nullable: true },
      { name: 'facility_name', type: 'VARCHAR(256)', nullable: false },
      { name: 'gate_in_at', type: 'TIMESTAMP', nullable: false },
      { name: 'gate_out_at', type: 'TIMESTAMP', nullable: true },
      { name: 'free_hours', type: 'DECIMAL(5,2)', nullable: true },
      { name: 'detention_hours', type: 'DECIMAL(5,2)', nullable: true },
      { name: 'rate_per_hour_usd', type: 'DECIMAL(6,2)', nullable: true },
      { name: 'total_fee_usd', type: 'DECIMAL(8,2)', nullable: true },
      { name: 'responsible_party', type: 'ENUM("shipper","consignee","carrier","unknown")', nullable: true },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 129,
    name: 'Dynamic Freight Rate Quoting',
    slug: 'dynamic-freight-rates',
    category: 'Logistics & Supply Chain',
    phase: 2,
    iconName: 'DollarSign',
    purpose: 'Machine learning predicted lane spot rates, contractual rate table evaluation, and instant broker margin calculations.',
    responsibilities: [
      'Evaluate contractual tariff tables and spot lane market indices in milliseconds',
      'Apply dynamic gross margin markups based on customer tier and credit terms',
      'Provide instant API rate quotes for integrations with TMS and ERP platforms'
    ],
    tableName: 'freight_rate_tables',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'rate_table_name', type: 'VARCHAR(128)', nullable: false, index: true },
      { name: 'origin_zip', type: 'VARCHAR(16)', nullable: false },
      { name: 'destination_zip', type: 'VARCHAR(16)', nullable: false },
      { name: 'equipment_type', type: 'VARCHAR(32)', nullable: false },
      { name: 'base_rate_usd', type: 'DECIMAL(10,2)', nullable: false },
      { name: 'fuel_surcharge_pct', type: 'DECIMAL(5,2)', nullable: true },
      { name: 'market_index', type: 'VARCHAR(32)', nullable: true },
      { name: 'effective_date', type: 'DATE', nullable: false },
      { name: 'expiry_date', type: 'DATE', nullable: true },
      { name: 'status', type: 'ENUM("draft","active","expired")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 130,
    name: 'Bonded Warehouse Accounting',
    slug: 'bonded-warehouse',
    category: 'Logistics & Supply Chain',
    phase: 3,
    iconName: 'Lock',
    purpose: 'Customs bonded storage compliance, duty suspension accounting, re-exportation tracking, and regulatory customs audits.',
    responsibilities: [
      'Manage inventory held under duty-suspension status within certified bonded zones',
      'Calculate deferred duties triggered when goods are withdrawn for domestic consumption',
      'Generate mandatory government customs audit reports for bonded goods in custody'
    ],
    tableName: 'bonded_inventory',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'bonded_warehouse_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'customs_bond_number', type: 'VARCHAR(32)', nullable: false, index: true },
      { name: 'sku', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'quantity_on_hand', type: 'INT UNSIGNED', nullable: false },
      { name: 'declared_value_usd', type: 'DECIMAL(12,2)', nullable: false },
      { name: 'duty_suspension_status', type: 'BOOLEAN', nullable: false },
      { name: 'entry_date', type: 'DATE', nullable: false },
      { name: 'storage_location', type: 'VARCHAR(64)', nullable: true },
      { name: 'status', type: 'ENUM("bonded","cleared","exported","forfeited")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),

  // ==========================================
  // DOMAIN 12: HUMAN CAPITAL MANAGEMENT & PAYROLL (131-160)
  // ==========================================
  buildModule({
    id: 131,
    name: 'Talent Acquisition & ATS',
    slug: 'talent-acquisition',
    category: 'Human Capital & HRMS',
    phase: 2,
    iconName: 'UserPlus',
    purpose: 'Job vacancy publishing, candidate resume parsing, interview pipeline scheduling, and collaborative recruiter scorecards.',
    responsibilities: [
      'Publish job requisitions across internal boards, LinkedIn, and third-party career portals',
      'Parse applicant resumes into structured skills, work histories, and educational backgrounds',
      'Coordinate multi-stage interview panel scorecards and offer approval hierarchies'
    ],
    tableName: 'job_applications',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'candidate_name', type: 'VARCHAR(256)', nullable: false },
      { name: 'email', type: 'VARCHAR(256)', nullable: false, index: true },
      { name: 'phone', type: 'VARCHAR(32)', nullable: true },
      { name: 'requisition_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'resume_url', type: 'VARCHAR(512)', nullable: true },
      { name: 'parsed_skills', type: 'JSON', nullable: true },
      { name: 'source', type: 'VARCHAR(64)', nullable: true },
      { name: 'stage', type: 'ENUM("applied","screening","interview","offer","hired","rejected")', nullable: false },
      { name: 'rating', type: 'DECIMAL(3,1)', nullable: true },
      { name: 'applied_at', type: 'TIMESTAMP', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 132,
    name: 'Employee Onboarding Workflows',
    slug: 'employee-onboarding',
    category: 'Human Capital & HRMS',
    phase: 2,
    iconName: 'UserCheck',
    purpose: 'Digital employee packet distribution, I-9/W-4 compliance, IT hardware provisioning, and automated department check-ins.',
    responsibilities: [
      'Guide new hires through pre-boarding document sign-offs and tax withholding forms',
      'Trigger automated IT tickets for laptop provisioning, email creation, and badge issuance',
      'Track 30-60-90 day milestone check-ins with assigned buddy and manager'
    ],
    tableName: 'onboarding_checklists',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'employee_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'hire_date', type: 'DATE', nullable: false },
      { name: 'department', type: 'VARCHAR(128)', nullable: false },
      { name: 'manager_id', type: 'BIGINT UNSIGNED', nullable: true },
      { name: 'buddy_id', type: 'BIGINT UNSIGNED', nullable: true },
      { name: 'i9_verified', type: 'BOOLEAN', nullable: false },
      { name: 'w4_submitted', type: 'BOOLEAN', nullable: false },
      { name: 'equipment_provisioned', type: 'BOOLEAN', nullable: false },
      { name: 'completion_pct', type: 'DECIMAL(5,2)', nullable: true },
      { name: 'status', type: 'ENUM("not_started","in_progress","completed")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 133,
    name: 'Multi-Jurisdiction Payroll Engine',
    slug: 'payroll-engine',
    category: 'Human Capital & HRMS',
    phase: 2,
    iconName: 'CreditCard',
    purpose: 'Gross-to-net tax calculation, state and municipal tax withholdings, wage garnishments, and direct deposit NACHA batches.',
    responsibilities: [
      'Compute statutory federal, state, and local income taxes across all 50 US states and international entities',
      'Execute court-ordered child support, tax levies, and student loan wage garnishments',
      'Generate compliant NACHA ACH files for direct deposit disbursement'
    ],
    tableName: 'payroll_runs',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'run_number', type: 'VARCHAR(32)', nullable: false, index: true },
      { name: 'pay_period_start', type: 'DATE', nullable: false },
      { name: 'pay_period_end', type: 'DATE', nullable: false },
      { name: 'employee_count', type: 'INT UNSIGNED', nullable: false },
      { name: 'gross_pay_total', type: 'DECIMAL(14,2)', nullable: false },
      { name: 'tax_withheld_total', type: 'DECIMAL(14,2)', nullable: false },
      { name: 'net_pay_total', type: 'DECIMAL(14,2)', nullable: false },
      { name: 'jurisdiction', type: 'VARCHAR(64)', nullable: false },
      { name: 'status', type: 'ENUM("draft","approved","processed","reconciled")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 134,
    name: 'Employee Benefits Administration',
    slug: 'benefits-admin',
    category: 'Human Capital & HRMS',
    phase: 2,
    iconName: 'HeartHandshake',
    purpose: 'Annual open enrollment, medical/dental/vision plans, HSA/FSA contributions, and qualifying life event management.',
    responsibilities: [
      'Orchestrate annual open enrollment windows with side-by-side plan comparison tools',
      'Process qualifying life events (marriage, birth, dependent changes) with supporting documentation',
      'Transmit weekly 834 benefit enrollment files to insurance carriers'
    ],
    tableName: 'benefit_elections',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'employee_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'plan_type', type: 'ENUM("medical","dental","vision","hsa","fsa","life","disability")', nullable: false },
      { name: 'plan_name', type: 'VARCHAR(128)', nullable: false },
      { name: 'provider', type: 'VARCHAR(128)', nullable: false },
      { name: 'employee_premium_biweekly', type: 'DECIMAL(8,2)', nullable: true },
      { name: 'employer_contribution_biweekly', type: 'DECIMAL(8,2)', nullable: true },
      { name: 'effective_date', type: 'DATE', nullable: false },
      { name: 'enrollment_event', type: 'ENUM("new_hire","open_enrollment","life_event")', nullable: false },
      { name: 'status', type: 'ENUM("pending","active","terminated")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 135,
    name: 'Time & Attendance Tracking',
    slug: 'time-attendance',
    category: 'Human Capital & HRMS',
    phase: 2,
    iconName: 'Clock',
    purpose: 'Geofenced mobile clock-in/out, biometric terminal sync, break compliance, and manager timesheet approvals.',
    responsibilities: [
      'Capture clock punch events with GPS geofencing verification and facial biometric validation',
      'Enforce mandatory meal break rules and calculate premium penalty pay for short breaks',
      'Streamline weekly manager timesheet sign-offs with automatic anomaly flags'
    ],
    tableName: 'timesheet_entries',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'employee_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'work_date', type: 'DATE', nullable: false },
      { name: 'clock_in', type: 'TIMESTAMP', nullable: false },
      { name: 'clock_out', type: 'TIMESTAMP', nullable: true },
      { name: 'break_minutes', type: 'INT UNSIGNED', nullable: true },
      { name: 'total_hours', type: 'DECIMAL(5,2)', nullable: true },
      { name: 'geofence_verified', type: 'BOOLEAN', nullable: false },
      { name: 'location_lat', type: 'DECIMAL(10,7)', nullable: true },
      { name: 'location_lng', type: 'DECIMAL(10,7)', nullable: true },
      { name: 'status', type: 'ENUM("clocked_in","on_break","clocked_in","approved","disputed")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 136,
    name: 'Shift Scheduling & Rostering',
    slug: 'shift-scheduling',
    category: 'Human Capital & HRMS',
    phase: 2,
    iconName: 'Calendar',
    purpose: 'Drag-and-drop shift calendar builder, fatigue management, peer shift swaps, and open shift bidding.',
    responsibilities: [
      'Generate shift schedules based on forecasted customer footfall and required staffing ratios',
      'Enforce mandatory rest intervals between consecutive shifts to prevent worker fatigue',
      'Enable peer-to-peer shift swaps with automated manager approval routing'
    ],
    tableName: 'work_shifts',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'shift_name', type: 'VARCHAR(64)', nullable: false },
      { name: 'employee_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'shift_date', type: 'DATE', nullable: false, index: true },
      { name: 'start_time', type: 'TIMESTAMP', nullable: false },
      { name: 'end_time', type: 'TIMESTAMP', nullable: false },
      { name: 'scheduled_hours', type: 'DECIMAL(5,2)', nullable: false },
      { name: 'location', type: 'VARCHAR(128)', nullable: true },
      { name: 'swap_requested', type: 'BOOLEAN', nullable: false },
      { name: 'status', type: 'ENUM("scheduled","confirmed","swapped","completed","absent")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 137,
    name: 'Performance Reviews & 360 Feedback',
    slug: 'performance-reviews',
    category: 'Human Capital & HRMS',
    phase: 2,
    iconName: 'Award',
    purpose: 'Quarterly review cycles, multi-rater 360 peer feedback, competency evaluations, and 9-box talent grid calibration.',
    responsibilities: [
      'Administer structured review cycles with customizable competency matrices and rating scales',
      'Collect anonymous 360 peer and upward feedback for holistic leadership evaluations',
      'Provide interactive 9-box grid calibration tools for executive leadership talent reviews'
    ],
    tableName: 'performance_cycles',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'cycle_name', type: 'VARCHAR(128)', nullable: false },
      { name: 'review_period_start', type: 'DATE', nullable: false },
      { name: 'review_period_end', type: 'DATE', nullable: false },
      { name: 'employee_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reviewer_id', type: 'BIGINT UNSIGNED', nullable: true },
      { name: 'rating', type: 'DECIMAL(3,1)', nullable: true },
      { name: 'nine_box_position', type: 'VARCHAR(8)', nullable: true },
      { name: 'peer_feedback_count', type: 'INT UNSIGNED', nullable: true },
      { name: 'status', type: 'ENUM("not_started","self_review","peer_feedback","manager_review","calibration","completed")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 138,
    name: 'Compensation Banding & Equity',
    slug: 'compensation-management',
    category: 'Human Capital & HRMS',
    phase: 3,
    iconName: 'TrendingUp',
    purpose: 'Pay band benchmarking, merit increase matrices, stock option grants, and pay equity disparity auditing.',
    responsibilities: [
      'Define salary bands and target compa-ratios based on external market compensation surveys',
      'Allocate merit increase budgets and manager compensation adjustment recommendations',
      'Conduct statistical pay equity audits across gender and ethnicity groups'
    ],
    tableName: 'compensation_bands',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'band_name', type: 'VARCHAR(128)', nullable: false, index: true },
      { name: 'job_family', type: 'VARCHAR(64)', nullable: false },
      { name: 'level', type: 'INT UNSIGNED', nullable: false },
      { name: 'min_salary', type: 'DECIMAL(12,2)', nullable: false },
      { name: 'midpoint_salary', type: 'DECIMAL(12,2)', nullable: false },
      { name: 'max_salary', type: 'DECIMAL(12,2)', nullable: false },
      { name: 'market_index', type: 'VARCHAR(32)', nullable: true },
      { name: 'merit_budget_pct', type: 'DECIMAL(5,2)', nullable: true },
      { name: 'status', type: 'ENUM("draft","active","frozen")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 139,
    name: 'Succession Planning & Leadership Matrix',
    slug: 'succession-planning',
    category: 'Human Capital & HRMS',
    phase: 3,
    iconName: 'Users',
    purpose: 'Critical role vacancy risk evaluation, high-potential employee talent benches, and executive readiness timelines.',
    responsibilities: [
      'Identify single-point-of-failure mission-critical positions throughout the enterprise',
      'Map high-potential successors with readiness horizons (Ready Now, 1-2 Years, 3-5 Years)',
      'Assign targeted executive development plans and mentorship programs to successors'
    ],
    tableName: 'succession_plans',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'critical_role', type: 'VARCHAR(128)', nullable: false },
      { name: 'incumbent_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'successor_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'readiness_level', type: 'ENUM("ready_now","1_2_years","3_5_years","development_needed")', nullable: false },
      { name: 'development_plan', type: 'TEXT', nullable: true },
      { name: 'risk_score', type: 'DECIMAL(3,2)', nullable: true },
      { name: 'mentor_id', type: 'BIGINT UNSIGNED', nullable: true },
      { name: 'last_reviewed_at', type: 'TIMESTAMP', nullable: true },
      { name: 'status', type: 'ENUM("active","archived","promoted")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 140,
    name: 'Employee Self-Service (ESS) Portal',
    slug: 'employee-self-service',
    category: 'Human Capital & HRMS',
    phase: 1,
    iconName: 'Smartphone',
    purpose: 'Mobile-first employee dashboard for pay stub downloads, address updates, direct deposit management, and W-2 retrieval.',
    responsibilities: [
      'Provide secure mobile access to historical digital pay stubs and annual tax documents',
      'Allow employees to update residential addresses, emergency contacts, and direct deposit accounts',
      'Submit formal inquiries directly to corporate HR service desks with SLA tracking'
    ],
    tableName: 'employee_profiles',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'employee_id', type: 'VARCHAR(32)', nullable: false, index: true },
      { name: 'full_name', type: 'VARCHAR(256)', nullable: false },
      { name: 'email', type: 'VARCHAR(256)', nullable: false, index: true },
      { name: 'phone', type: 'VARCHAR(32)', nullable: true },
      { name: 'department', type: 'VARCHAR(128)', nullable: false },
      { name: 'job_title', type: 'VARCHAR(128)', nullable: false },
      { name: 'hire_date', type: 'DATE', nullable: false },
      { name: 'address_line1', type: 'VARCHAR(256)', nullable: true },
      { name: 'emergency_contact', type: 'VARCHAR(256)', nullable: true },
      { name: 'profile_photo_url', type: 'VARCHAR(512)', nullable: true },
      { name: 'status', type: 'ENUM("active","leave","terminated")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 141,
    name: 'Leave & Accrual Policy Engine',
    slug: 'leave-management',
    category: 'Human Capital & HRMS',
    phase: 2,
    iconName: 'CalendarDays',
    purpose: 'Paid Time Off (PTO) accruals, statutory sick leave, parental leave policies, and leave request approval workflows.',
    responsibilities: [
      'Compute automated pay-period PTO accruals, carryover caps, and tenure-based increases',
      'Enforce FMLA, state paid family leave, and military leave compliance rules',
      'Provide shared department out-of-office calendars to avoid concurrent key staffing outages'
    ],
    tableName: 'leave_requests',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'employee_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'leave_type', type: 'ENUM("pto","sick","fmla","parental","military","bereavement","jury")', nullable: false },
      { name: 'start_date', type: 'DATE', nullable: false },
      { name: 'end_date', type: 'DATE', nullable: false },
      { name: 'days_requested', type: 'DECIMAL(4,1)', nullable: false },
      { name: 'accrual_balance', type: 'DECIMAL(6,1)', nullable: true },
      { name: 'approver_id', type: 'BIGINT UNSIGNED', nullable: true },
      { name: 'reason', type: 'TEXT', nullable: true },
      { name: 'status', type: 'ENUM("pending","approved","denied","cancelled")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 142,
    name: 'Contractor & Contingent Workforce',
    slug: 'contingent-workforce',
    category: 'Human Capital & HRMS',
    phase: 2,
    iconName: 'Briefcase',
    purpose: '1099 contractor onboarding, Statement of Work (SOW) milestone tracking, and contractor misclassification risk audits.',
    responsibilities: [
      'Manage freelancer agreements, NDAs, and Certificates of Insurance (COI)',
      'Track project deliverable milestone sign-offs against SOW fee schedules',
      'Assess 1099 vs W-2 employment classification using IRS common-law guidelines'
    ],
    tableName: 'contractor_engagements',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'contractor_name', type: 'VARCHAR(256)', nullable: false },
      { name: 'company', type: 'VARCHAR(256)', nullable: true },
      { name: 'tax_id', type: 'VARCHAR(32)', nullable: true },
      { name: 'sow_reference', type: 'VARCHAR(64)', nullable: true, index: true },
      { name: 'project_name', type: 'VARCHAR(128)', nullable: false },
      { name: 'hourly_rate_usd', type: 'DECIMAL(8,2)', nullable: true },
      { name: 'start_date', type: 'DATE', nullable: false },
      { name: 'end_date', type: 'DATE', nullable: true },
      { name: 'classification', type: 'ENUM("1099","w2_contractor","c2c")', nullable: false },
      { name: 'status', type: 'ENUM("active","completed","terminated")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 143,
    name: 'Workforce Analytics & Headcount Modeling',
    slug: 'workforce-analytics',
    category: 'Human Capital & HRMS',
    phase: 3,
    iconName: 'PieChart',
    purpose: 'Voluntary turnover cohort analysis, future headcount budgeting, recruiting funnel velocity, and diversity metrics.',
    responsibilities: [
      'Model future fiscal year headcount hiring plans and organizational wage burn rates',
      'Analyze employee attrition trends with machine learning flight-risk prediction models',
      'Generate automated EEOC diversity and inclusion reporting dashboards'
    ],
    tableName: 'headcount_plans',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'fiscal_year', type: 'INT UNSIGNED', nullable: false, index: true },
      { name: 'department', type: 'VARCHAR(128)', nullable: false, index: true },
      { name: 'current_headcount', type: 'INT UNSIGNED', nullable: false },
      { name: 'planned_hires', type: 'INT UNSIGNED', nullable: false },
      { name: 'planned_exits', type: 'INT UNSIGNED', nullable: false },
      { name: 'budget_usd', type: 'DECIMAL(14,2)', nullable: true },
      { name: 'avg_salary', type: 'DECIMAL(12,2)', nullable: true },
      { name: 'voluntary_turnover_pct', type: 'DECIMAL(5,2)', nullable: true },
      { name: 'hiring_manager_id', type: 'BIGINT UNSIGNED', nullable: true },
      { name: 'status', type: 'ENUM("draft","approved","frozen")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 144,
    name: 'Grievance & Employee Relations',
    slug: 'employee-relations',
    category: 'Human Capital & HRMS',
    phase: 2,
    iconName: 'ShieldAlert',
    purpose: 'Confidential workplace incident case management, investigative interviews, corrective action plans, and documentation.',
    responsibilities: [
      'Securely record workplace harassment, discrimination, and code-of-conduct allegations',
      'Document investigative interviews, timeline logs, and evidence repositories with restricted access',
      'Track Performance Improvement Plans (PIPs) and progressive disciplinary actions'
    ],
    tableName: 'incident_cases',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'case_number', type: 'VARCHAR(32)', nullable: false, index: true },
      { name: 'reporter_name', type: 'VARCHAR(256)', nullable: true },
      { name: 'subject_employee_id', type: 'BIGINT UNSIGNED', nullable: true, index: true },
      { name: 'incident_type', type: 'VARCHAR(64)', nullable: false },
      { name: 'incident_date', type: 'DATE', nullable: false },
      { name: 'description', type: 'TEXT', nullable: true },
      { name: 'assigned_to', type: 'BIGINT UNSIGNED', nullable: true },
      { name: 'priority', type: 'ENUM("low","medium","high","critical")', nullable: false },
      { name: 'status', type: 'ENUM("open","investigating","resolved","closed")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 145,
    name: 'Employee Recognition & Perks',
    slug: 'employee-recognition',
    category: 'Human Capital & HRMS',
    phase: 2,
    iconName: 'Gift',
    purpose: 'Peer-to-peer recognition points, anniversary milestones, service award redemptions, and corporate perk catalog.',
    responsibilities: [
      'Enable employees to award kudos and company value recognition points to colleagues',
      'Automate work anniversary and birthday congratulatory shout-outs and bonus points',
      'Maintain reward redemption catalog for gift cards, merchandise, and company swag'
    ],
    tableName: 'recognition_rewards',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'employee_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'issuer_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reward_type', type: 'ENUM("kudos","points","milestone","spot_award")', nullable: false },
      { name: 'points_value', type: 'INT UNSIGNED', nullable: true },
      { name: 'reason', type: 'VARCHAR(512)', nullable: true },
      { name: 'company_value_tag', type: 'VARCHAR(64)', nullable: true },
      { name: 'redeemed', type: 'BOOLEAN', nullable: false },
      { name: 'redemption_item', type: 'VARCHAR(128)', nullable: true },
      { name: 'awarded_at', type: 'TIMESTAMP', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 146,
    name: 'Exit Interview & Offboarding',
    slug: 'employee-offboarding',
    category: 'Human Capital & HRMS',
    phase: 2,
    iconName: 'UserMinus',
    purpose: 'Termination checklists, automated asset retrieval labels, COBRA notifications, and exit survey sentiment analysis.',
    responsibilities: [
      'Coordinate company equipment return shipments and automated corporate account deactivation',
      'Issue statutory COBRA continuation of coverage notifications and final pay checks',
      'Conduct exit interviews analyzing primary drivers for voluntary departures'
    ],
    tableName: 'offboarding_records',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'employee_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'termination_type', type: 'ENUM("voluntary","involuntary","retirement","end_of_contract")', nullable: false },
      { name: 'last_working_day', type: 'DATE', nullable: false },
      { name: 'final_pay_date', type: 'DATE', nullable: true },
      { name: 'equipment_returned', type: 'BOOLEAN', nullable: false },
      { name: 'cobra_notified', type: 'BOOLEAN', nullable: false },
      { name: 'exit_interview_completed', type: 'BOOLEAN', nullable: false },
      { name: 'exit_survey_sentiment', type: 'DECIMAL(3,1)', nullable: true },
      { name: 'status', type: 'ENUM("initiated","in_progress","completed")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 147,
    name: 'Internal Job Marketplace',
    slug: 'internal-job-marketplace',
    category: 'Human Capital & HRMS',
    phase: 2,
    iconName: 'Compass',
    purpose: 'Cross-functional gig projects, internal career mobility, rotational assignments, and employee skills discovery.',
    responsibilities: [
      'Match current employees with short-term internal sprint projects and stretch assignments',
      'Promote internal job openings directly to qualified employees prior to external posting',
      'Empower managers to scout internal talent based on certified competency tags'
    ],
    tableName: 'internal_job_postings',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'posting_title', type: 'VARCHAR(256)', nullable: false },
      { name: 'department', type: 'VARCHAR(128)', nullable: false },
      { name: 'location', type: 'VARCHAR(128)', nullable: true },
      { name: 'hiring_manager_id', type: 'BIGINT UNSIGNED', nullable: true },
      { name: 'required_skills', type: 'JSON', nullable: true },
      { name: 'posting_type', type: 'ENUM("gig","rotation","full_time","project")', nullable: false },
      { name: 'posted_date', type: 'DATE', nullable: false },
      { name: 'closing_date', type: 'DATE', nullable: true },
      { name: 'applicant_count', type: 'INT UNSIGNED', nullable: true },
      { name: 'status', type: 'ENUM("draft","published","closed","filled")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 148,
    name: 'Global Mobility & Expatriate Tax',
    slug: 'global-mobility',
    category: 'Human Capital & HRMS',
    phase: 3,
    iconName: 'Globe2',
    purpose: 'International employee transfers, work visa sponsorship tracking, shadow payroll, and tax equalization calculations.',
    responsibilities: [
      'Track foreign work permit, H-1B, and Schengen visa expiration dates and renewal filings',
      'Calculate expatriate cost-of-living allowances and foreign housing differentials',
      'Manage dual-country shadow payroll runs and tax equalization treaties'
    ],
    tableName: 'mobility_assignments',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'employee_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'home_country', type: 'VARCHAR(3)', nullable: false },
      { name: 'host_country', type: 'VARCHAR(3)', nullable: false },
      { name: 'assignment_type', type: 'ENUM("expat","inpatriate","short_term","commuter")', nullable: false },
      { name: 'start_date', type: 'DATE', nullable: false },
      { name: 'expected_end_date', type: 'DATE', nullable: true },
      { name: 'visa_type', type: 'VARCHAR(32)', nullable: true },
      { name: 'visa_expiry', type: 'DATE', nullable: true },
      { name: 'cost_of_living_pct', type: 'DECIMAL(5,2)', nullable: true },
      { name: 'status', type: 'ENUM("planning","active","completed","early_return")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 149,
    name: 'Pulse Surveys & Engagement Index',
    slug: 'pulse-surveys',
    category: 'Human Capital & HRMS',
    phase: 2,
    iconName: 'BarChart3',
    purpose: 'Frequent micro-surveys, eNPS (Employee Net Promoter Score) calculation, and natural language sentiment analysis.',
    responsibilities: [
      'Distribute weekly 2-minute employee sentiment pulse checks via Slack and mobile apps',
      'Calculate department-level Employee Net Promoter Scores (eNPS) over rolling quarters',
      'Highlight emerging team burnout signals and leadership communication gaps'
    ],
    tableName: 'survey_campaigns',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'campaign_name', type: 'VARCHAR(128)', nullable: false },
      { name: 'survey_type', type: 'ENUM("pulse","engagement","onboarding","exit","custom")', nullable: false },
      { name: 'department', type: 'VARCHAR(128)', nullable: true },
      { name: 'question_count', type: 'INT UNSIGNED', nullable: false },
      { name: 'response_rate_pct', type: 'DECIMAL(5,2)', nullable: true },
      { name: 'enps_score', type: 'DECIMAL(4,1)', nullable: true },
      { name: 'sentiment_avg', type: 'DECIMAL(3,2)', nullable: true },
      { name: 'distributed_at', type: 'TIMESTAMP', nullable: true },
      { name: 'closed_at', type: 'TIMESTAMP', nullable: true },
      { name: 'status', type: 'ENUM("draft","distributed","collecting","analyzed")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 150,
    name: 'OKR & Goal Cascading',
    slug: 'okr-management',
    category: 'Human Capital & HRMS',
    phase: 2,
    iconName: 'Target',
    purpose: 'Company-wide Objectives and Key Results (OKRs), parent-child goal alignment, and automated progress metric rollups.',
    responsibilities: [
      'Cascade high-level executive strategic priorities down to department and individual OKRs',
      'Track measurable key results with automated data sync from JIRA, Salesforce, and GitHub',
      'Hold weekly check-in cadences with confidence score ratings (0.0 to 1.0)'
    ],
    tableName: 'okr_objectives',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'objective_title', type: 'VARCHAR(256)', nullable: false },
      { name: 'owner_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'parent_okr_id', type: 'BIGINT UNSIGNED', nullable: true },
      { name: 'department', type: 'VARCHAR(128)', nullable: true },
      { name: 'cycle_quarter', type: 'VARCHAR(8)', nullable: false, index: true },
      { name: 'confidence_score', type: 'DECIMAL(3,2)', nullable: true },
      { name: 'progress_pct', type: 'DECIMAL(5,2)', nullable: true },
      { name: 'key_results', type: 'JSON', nullable: true },
      { name: 'status', type: 'ENUM("draft","active","achieved","missed","cancelled")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 151,
    name: 'Organizational Chart Modeling',
    slug: 'org-chart-modeling',
    category: 'Human Capital & HRMS',
    phase: 2,
    iconName: 'Network',
    purpose: 'Dynamic visual organizational hierarchy chart, matrix reporting lines, reorg sandboxes, and exportable directories.',
    responsibilities: [
      'Render real-time interactive visual org charts with employee contact cards and roles',
      'Support dotted-line cross-functional matrix reporting relationships',
      'Simulate future reorganization structures in private sandboxes before publication'
    ],
    tableName: 'org_nodes',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'node_label', type: 'VARCHAR(256)', nullable: false },
      { name: 'node_type', type: 'ENUM("executive","vp","director","manager","individual_contributor")', nullable: false },
      { name: 'department', type: 'VARCHAR(128)', nullable: true },
      { name: 'parent_node_id', type: 'BIGINT UNSIGNED', nullable: true, index: true },
      { name: 'employee_id', type: 'BIGINT UNSIGNED', nullable: true, index: true },
      { name: 'is_dotted_line', type: 'BOOLEAN', nullable: false },
      { name: 'cost_center', type: 'VARCHAR(32)', nullable: true },
      { name: 'headcount', type: 'INT UNSIGNED', nullable: true },
      { name: 'status', type: 'ENUM("active","planned","archived")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 152,
    name: 'Overtime & Penalty Rate Calculator',
    slug: 'overtime-calculator',
    category: 'Human Capital & HRMS',
    phase: 2,
    iconName: 'Calculator',
    purpose: 'State-specific overtime rules (California daily 8h/12h, 7th consecutive day), night differential, and holiday pay.',
    responsibilities: [
      'Calculate complex jurisdictional daily and weekly overtime thresholds accurately',
      'Compute blended regular rates of pay incorporating non-discretionary bonuses',
      'Enforce mandatory double-time rules for prolonged shift durations'
    ],
    tableName: 'overtime_rules',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'state_code', type: 'VARCHAR(2)', nullable: false, index: true },
      { name: 'rule_name', type: 'VARCHAR(128)', nullable: false },
      { name: 'daily_ot_threshold_hrs', type: 'DECIMAL(4,2)', nullable: false },
      { name: 'weekly_ot_threshold_hrs', type: 'DECIMAL(4,2)', nullable: false },
      { name: 'double_time_hrs', type: 'DECIMAL(4,2)', nullable: true },
      { name: 'seventh_day_rule', type: 'BOOLEAN', nullable: false },
      { name: 'night_differential_pct', type: 'DECIMAL(5,2)', nullable: true },
      { name: 'holiday_multiplier', type: 'DECIMAL(3,1)', nullable: true },
      { name: 'status', type: 'ENUM("active","superseded")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 153,
    name: 'Labor Union Agreement Compliance',
    slug: 'union-compliance',
    category: 'Human Capital & HRMS',
    phase: 3,
    iconName: 'FileCheck',
    purpose: 'Collective Bargaining Agreement (CBA) rule enforcement, seniority list tracking, union dues deduction, and grievance arbitration.',
    responsibilities: [
      'Enforce strict union contract job bid seniority rules and shift pick preferences',
      'Calculate monthly union dues payroll deductions and generate remittance reports',
      'Track multi-step union grievance escalations through formal arbitration deadlines'
    ],
    tableName: 'union_agreements',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'agreement_name', type: 'VARCHAR(256)', nullable: false },
      { name: 'union_name', type: 'VARCHAR(256)', nullable: false },
      { name: 'bargaining_unit', type: 'VARCHAR(128)', nullable: false },
      { name: 'employee_count', type: 'INT UNSIGNED', nullable: true },
      { name: 'effective_date', type: 'DATE', nullable: false },
      { name: 'expiration_date', type: 'DATE', nullable: false },
      { name: 'dues_rate_pct', type: 'DECIMAL(5,2)', nullable: true },
      { name: 'job_bid_seniority', type: 'BOOLEAN', nullable: false },
      { name: 'grievance_steps', type: 'INT UNSIGNED', nullable: true },
      { name: 'status', type: 'ENUM("active","expired","renegotiating")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 154,
    name: 'Health & Wellness Stipends',
    slug: 'wellness-stipends',
    category: 'Human Capital & HRMS',
    phase: 2,
    iconName: 'Heart',
    purpose: 'Gym membership reimbursements, mental health app subscriptions, annual wellness wallets, and automated receipt audits.',
    responsibilities: [
      'Provide pre-funded digital employee wellness wallets for fitness and wellness expenses',
      'Process expense receipts using OCR validation against eligible merchant category codes',
      'Calculate taxable vs non-taxable fringe benefit payroll tax implications'
    ],
    tableName: 'wellness_claims',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'employee_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'claim_type', type: 'ENUM("gym","mental_health","nutrition","wellness_wallet","other")', nullable: false },
      { name: 'amount_usd', type: 'DECIMAL(8,2)', nullable: false },
      { name: 'receipt_url', type: 'VARCHAR(512)', nullable: true },
      { name: 'merchant_category', type: 'VARCHAR(64)', nullable: true },
      { name: 'wallet_balance_usd', type: 'DECIMAL(8,2)', nullable: true },
      { name: 'taxable_fringe', type: 'BOOLEAN', nullable: false },
      { name: 'approved_by', type: 'BIGINT UNSIGNED', nullable: true },
      { name: 'status', type: 'ENUM("submitted","approved","denied","reimbursed")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 155,
    name: 'Remote Work Equipment Stipends',
    slug: 'remote-work-stipends',
    category: 'Human Capital & HRMS',
    phase: 2,
    iconName: 'Monitor',
    purpose: 'Home office equipment allocations, ergonomic assessment requests, and company asset inventory tagging.',
    responsibilities: [
      'Allocate one-time and recurring home office ergonomics and internet reimbursements',
      'Track remote employee physical hardware assets and serial numbers for asset recovery',
      'Coordinate certified virtual ergonomic workstation assessments with physical therapists'
    ],
    tableName: 'equipment_stipends',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'employee_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'stipend_type', type: 'ENUM("one_time","recurring")', nullable: false },
      { name: 'allocated_amount_usd', type: 'DECIMAL(8,2)', nullable: false },
      { name: 'spent_amount_usd', type: 'DECIMAL(8,2)', nullable: true },
      { name: 'item_description', type: 'VARCHAR(256)', nullable: true },
      { name: 'asset_tag', type: 'VARCHAR(32)', nullable: true },
      { name: 'ergonomic_assessment', type: 'BOOLEAN', nullable: false },
      { name: 'requisition_date', type: 'DATE', nullable: false },
      { name: 'status', type: 'ENUM("requested","approved","purchased","returned")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 156,
    name: 'Direct Deposit & ACH Splitter',
    slug: 'direct-deposit-splitter',
    category: 'Human Capital & HRMS',
    phase: 2,
    iconName: 'Banknote',
    purpose: 'Multi-bank account net pay splitting, pre-note micro-deposit verification, and instant payroll debit card integrations.',
    responsibilities: [
      'Allow employees to split net pay across up to 5 checking, savings, and investment accounts',
      'Validate routing transit numbers and account ownership via pre-note ACH transactions',
      'Support on-demand pay and instant earned wage access (EWA) transfers'
    ],
    tableName: 'bank_allocations',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'employee_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'bank_name', type: 'VARCHAR(128)', nullable: false },
      { name: 'routing_number', type: 'VARCHAR(9)', nullable: false },
      { name: 'account_number_masked', type: 'VARCHAR(16)', nullable: false },
      { name: 'account_type', type: 'ENUM("checking","savings","investment")', nullable: false },
      { name: 'allocation_pct', type: 'DECIMAL(5,2)', nullable: false },
      { name: 'allocation_amount_usd', type: 'DECIMAL(10,2)', nullable: true },
      { name: 'is_primary', type: 'BOOLEAN', nullable: false },
      { name: 'pre_note_verified', type: 'BOOLEAN', nullable: false },
      { name: 'status', type: 'ENUM("active","inactive","pending_verification")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 157,
    name: 'Tax Withholding & W-2 / 1099 Forms',
    slug: 'tax-withholding-forms',
    category: 'Human Capital & HRMS',
    phase: 2,
    iconName: 'Receipt',
    purpose: 'Annual electronic W-2, 1099-NEC, and 1095-C distribution, IRS FIRE system electronic filing, and W-4 withholding simulators.',
    responsibilities: [
      'Generate IRS-compliant electronic Form W-2 and 1099-MISC/NEC documents',
      'Provide employees interactive tax withholding simulators for W-4 adjustments',
      'Transmit annual year-end wage files to the Social Security Administration (SSA) and IRS'
    ],
    tableName: 'annual_tax_filings',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'employee_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'tax_year', type: 'INT UNSIGNED', nullable: false, index: true },
      { name: 'form_type', type: 'ENUM("W-2","1099-NEC","1099-MISC","1095-C")', nullable: false },
      { name: 'federal_wages', type: 'DECIMAL(12,2)', nullable: true },
      { name: 'federal_tax_withheld', type: 'DECIMAL(12,2)', nullable: true },
      { name: 'state_tax_withheld', type: 'DECIMAL(12,2)', nullable: true },
      { name: 'ss_wages', type: 'DECIMAL(12,2)', nullable: true },
      { name: 'filed_electronically', type: 'BOOLEAN', nullable: false },
      { name: 'filing_date', type: 'DATE', nullable: true },
      { name: 'status', type: 'ENUM("draft","filed","accepted","corrected")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 158,
    name: 'Skills Inventory & Competency Matrix',
    slug: 'skills-inventory',
    category: 'Human Capital & HRMS',
    phase: 2,
    iconName: 'GraduationCap',
    purpose: 'Standardized enterprise skills ontology, proficiency level ratings (1-5), certification tracking, and skills gap analysis.',
    responsibilities: [
      'Maintain an enterprise-wide taxonomy of technical, business, and leadership competencies',
      'Record verified employee certifications (AWS, PMP, CPA) with automated renewal alerts',
      'Identify critical organizational skill gaps to inform hiring and training budgets'
    ],
    tableName: 'employee_skills',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'employee_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'skill_name', type: 'VARCHAR(128)', nullable: false, index: true },
      { name: 'skill_category', type: 'VARCHAR(64)', nullable: false },
      { name: 'proficiency_level', type: 'INT UNSIGNED', nullable: false },
      { name: 'certification_name', type: 'VARCHAR(128)', nullable: true },
      { name: 'certification_expiry', type: 'DATE', nullable: true },
      { name: 'verified', type: 'BOOLEAN', nullable: false },
      { name: 'last_assessed_at', type: 'TIMESTAMP', nullable: true },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 159,
    name: 'Employee Document Vault & E-Sign',
    slug: 'employee-document-vault',
    category: 'Human Capital & HRMS',
    phase: 2,
    iconName: 'FolderLock',
    purpose: 'Encrypted personnel file storage, audit-ready document retention policies, and legally binding digital signature tracking.',
    responsibilities: [
      'Store employment agreements, non-competes, and disciplinary records under AES-256 encryption',
      'Enforce role-based access control ensuring confidential manager notes remain restricted',
      'Execute legally binding digital signatures with comprehensive audit trail certificates'
    ],
    tableName: 'personnel_documents',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'employee_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'document_type', type: 'ENUM("contract","nda","policy","disciplinary","performance","other")', nullable: false },
      { name: 'document_name', type: 'VARCHAR(256)', nullable: false },
      { name: 'file_url', type: 'VARCHAR(512)', nullable: false },
      { name: 'encrypted', type: 'BOOLEAN', nullable: false },
      { name: 'retention_years', type: 'INT UNSIGNED', nullable: true },
      { name: 'esignature_required', type: 'BOOLEAN', nullable: false },
      { name: 'esignature_completed', type: 'BOOLEAN', nullable: false },
      { name: 'uploaded_by', type: 'BIGINT UNSIGNED', nullable: true },
      { name: 'status', type: 'ENUM("draft","active","archived","deleted")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 160,
    name: 'Whistleblower & Anonymous Reporting',
    slug: 'whistleblower-portal',
    category: 'Human Capital & HRMS',
    phase: 3,
    iconName: 'EyeOff',
    purpose: 'Zero-knowledge encrypted anonymous reporting hotline, compliance officer assignment, and anti-retaliation tracking.',
    responsibilities: [
      'Provide a strictly anonymous, non-logged reporting channel for ethics violations and fraud',
      'Enable two-way encrypted dialogue with anonymous whistleblowers via access keys',
      'Maintain tamper-evident audit logs demonstrating compliance with Sarbanes-Oxley (SOX)'
    ],
    tableName: 'whistleblower_reports',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'report_reference', type: 'VARCHAR(32)', nullable: false, index: true },
      { name: 'category', type: 'ENUM("fraud","harassment","safety","compliance","ethics","other")', nullable: false },
      { name: 'description', type: 'TEXT', nullable: false },
      { name: 'access_key_hash', type: 'VARCHAR(128)', nullable: false },
      { name: 'assigned_investigator_id', type: 'BIGINT UNSIGNED', nullable: true },
      { name: 'priority', type: 'ENUM("low","medium","high","critical")', nullable: false },
      { name: 'anonymity_level', type: 'ENUM("full","partial","identified")', nullable: false },
      { name: 'response_count', type: 'INT UNSIGNED', nullable: true },
      { name: 'sox_compliant', type: 'BOOLEAN', nullable: false },
      { name: 'status', type: 'ENUM("submitted","under_investigation","resolved","closed")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ]
  })
];
