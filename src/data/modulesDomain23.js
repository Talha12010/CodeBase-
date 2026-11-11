import { buildModule } from './moduleBuilderHelper';

export const modulesDomain23 = [
  // ========================================================
  // DOMAIN 23: SPORTS & FITNESS (441-460)
  // ========================================================
  buildModule({
    id: 441,
    name: 'Gym Membership Portal',
    slug: 'gym-membership-portal',
    category: 'Sports & Fitness',
    phase: 2,
    iconName: 'Dumbbell',
    purpose: 'Gym membership enrollment, renewal management, access control, billing integration, and member profile administration for fitness facilities.',
    responsibilities: [
      'Manage membership tier enrollment including pricing plans, billing cycles, and access privileges',
      'Control facility access via member card scanning, QR code validation, and real-time check-in logging',
      'Track membership renewal status, overdue payments, and automatic billing retry workflows'
    ],
    tableName: 'gym_memberships',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'member_number', type: 'VARCHAR(32)', nullable: false, index: true },
      { name: 'member_name', type: 'VARCHAR(255)', nullable: false },
      { name: 'email', type: 'VARCHAR(255)', nullable: false },
      { name: 'membership_tier', type: 'ENUM("basic","standard","premium","vip","corporate")', nullable: false },
      { name: 'status', type: 'ENUM("active","suspended","expired","cancelled","pending")', nullable: false },
      { name: 'start_date', type: 'TIMESTAMP', nullable: false },
      { name: 'end_date', type: 'TIMESTAMP', nullable: true },
      { name: 'billing_amount', type: 'DECIMAL(8,2)', nullable: false },
      { name: 'auto_renew', type: 'BOOLEAN', nullable: false },
      { name: 'metadata', type: 'JSON', nullable: true },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'GET', path: '/api/v1/gym-membership-portal', description: 'List gym memberships', permission: 'gym-membership-portal.view', authRequired: true },
      { method: 'POST', path: '/api/v1/gym-membership-portal', description: 'Enroll a new gym membership', permission: 'gym-membership-portal.create', authRequired: true },
      { method: 'GET', path: '/api/v1/gym-membership-portal/{id}', description: 'Get membership details by ID', permission: 'gym-membership-portal.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/gym-membership-portal/{id}/status', description: 'Update membership status or tier', permission: 'gym-membership-portal.manage', authRequired: true }
    ],
    services: ['GymMembershipService', 'AccessControlService', 'BillingManagementService'],
    events: ['GymMembershipEnrolled', 'MembershipStatusChanged', 'MembershipRenewalProcessed'],
    jobs: ['ProcessGymMembershipRenewalsJob', 'AuditGymMembershipAccessJob', 'GenerateGymMembershipReportJob'],
    dependencies: [9, 27],
    tests: ['GymMembershipEnrollmentTest', 'AccessControlValidationTest', 'MembershipRenewalTest']
  }),

  buildModule({
    id: 442,
    name: 'Workout Plan Builder',
    slug: 'workout-plan-builder',
    category: 'Sports & Fitness',
    phase: 2,
    iconName: 'Target',
    purpose: 'Personalized workout plan creation, exercise scheduling, progression tracking, and adaptive training algorithm management for athletes.',
    responsibilities: [
      'Generate customized workout plans based on fitness goals, experience level, and equipment availability',
      'Manage weekly training schedules with exercise rotation, rest day allocation, and progressive overload',
      'Track workout completion rates, intensity adjustments, and long-term progression metrics'
    ],
    tableName: 'workout_plans',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'plan_code', type: 'VARCHAR(32)', nullable: false, index: true },
      { name: 'athlete_name', type: 'VARCHAR(255)', nullable: false },
      { name: 'fitness_goal', type: 'ENUM("strength","endurance","flexibility","weight_loss","muscle_gain","rehabilitation")', nullable: false },
      { name: 'difficulty_level', type: 'ENUM("beginner","intermediate","advanced","elite")', nullable: false },
      { name: 'week_count', type: 'INT', nullable: false },
      { name: 'plan_data', type: 'JSON', nullable: false },
      { name: 'status', type: 'ENUM("draft","active","completed","archived")', nullable: false },
      { name: 'completion_pct', type: 'DECIMAL(5,2)', nullable: true },
      { name: 'trainer_notes', type: 'TEXT', nullable: true },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'GET', path: '/api/v1/workout-plan-builder', description: 'List workout plans', permission: 'workout-plan-builder.view', authRequired: true },
      { method: 'POST', path: '/api/v1/workout-plan-builder', description: 'Create a new workout plan', permission: 'workout-plan-builder.create', authRequired: true },
      { method: 'GET', path: '/api/v1/workout-plan-builder/{id}', description: 'Get workout plan details', permission: 'workout-plan-builder.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/workout-plan-builder/{id}/status', description: 'Update plan status or completion', permission: 'workout-plan-builder.manage', authRequired: true }
    ],
    services: ['WorkoutPlanService', 'ExerciseSchedulingEngine', 'ProgressionTracker'],
    events: ['WorkoutPlanCreated', 'WorkoutPlanUpdated', 'WorkoutPlanCompleted'],
    jobs: ['GenerateWorkoutPlanJob', 'TrackWorkoutProgressionJob', 'AuditWorkoutPlanMetricsJob'],
    dependencies: [9, 41],
    tests: ['WorkoutPlanCreationTest', 'ExerciseSchedulingTest', 'ProgressionTrackingTest']
  }),

  buildModule({
    id: 443,
    name: 'Personal Trainer Booking',
    slug: 'personal-trainer-booking',
    category: 'Sports & Fitness',
    phase: 2,
    iconName: 'Calendar',
    purpose: 'Personal trainer session scheduling, availability management, client-trainer matching, and session feedback collection for fitness coaching.',
    responsibilities: [
      'Manage trainer availability calendars with session time slots and booking conflict resolution',
      'Match clients with trainers based on specialization, availability, and client fitness goals',
      'Collect session feedback, rating scores, and training notes for trainer performance analytics'
    ],
    tableName: 'trainer_bookings',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'booking_ref', type: 'VARCHAR(32)', nullable: false, index: true },
      { name: 'client_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'trainer_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'session_type', type: 'ENUM("personal","group","assessment","rehabilitation","nutrition")', nullable: false },
      { name: 'scheduled_at', type: 'TIMESTAMP', nullable: false },
      { name: 'duration_minutes', type: 'INT', nullable: false },
      { name: 'status', type: 'ENUM("pending","confirmed","completed","cancelled","no_show")', nullable: false },
      { name: 'session_fee', type: 'DECIMAL(8,2)', nullable: false },
      { name: 'client_rating', type: 'INT', nullable: true },
      { name: 'session_notes', type: 'TEXT', nullable: true },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'GET', path: '/api/v1/personal-trainer-booking', description: 'List trainer bookings', permission: 'personal-trainer-booking.view', authRequired: true },
      { method: 'POST', path: '/api/v1/personal-trainer-booking', description: 'Book a new trainer session', permission: 'personal-trainer-booking.create', authRequired: true },
      { method: 'GET', path: '/api/v1/personal-trainer-booking/{id}', description: 'Get booking details', permission: 'personal-trainer-booking.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/personal-trainer-booking/{id}/status', description: 'Confirm, cancel, or complete booking', permission: 'personal-trainer-booking.manage', authRequired: true }
    ],
    services: ['TrainerBookingService', 'TrainerAvailabilityService', 'SessionFeedbackService'],
    events: ['TrainerBookingCreated', 'BookingStatusChanged', 'SessionCompleted'],
    jobs: ['ProcessTrainerBookingsJob', 'SyncTrainerAvailabilityJob', 'AuditTrainerMetricsJob'],
    dependencies: [9, 27],
    tests: ['TrainerBookingCreationTest', 'AvailabilityConflictTest', 'SessionFeedbackTest']
  }),

  buildModule({
    id: 444,
    name: 'Exercise Progress Tracker',
    slug: 'exercise-progress-tracker',
    category: 'Sports & Fitness',
    phase: 2,
    iconName: 'TrendingUp',
    purpose: 'Individual exercise performance logging, workout history tracking, personal record management, and progress visualization analytics.',
    responsibilities: [
      'Log individual exercise sets, reps, weights, duration, and distance for each workout session',
      'Track personal records, strength progression curves, and cardiovascular improvement trends',
      'Generate progress charts, weekly summaries, and monthly performance comparison reports'
    ],
    tableName: 'exercise_logs',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'log_code', type: 'VARCHAR(32)', nullable: false, index: true },
      { name: 'athlete_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'exercise_name', type: 'VARCHAR(255)', nullable: false },
      { name: 'exercise_category', type: 'ENUM("strength","cardio","flexibility","balance","plyometric","sport")', nullable: false },
      { name: 'sets_completed', type: 'INT', nullable: true },
      { name: 'reps_per_set', type: 'INT', nullable: true },
      { name: 'weight_kg', type: 'DECIMAL(6,2)', nullable: true },
      { name: 'duration_seconds', type: 'INT', nullable: true },
      { name: 'distance_km', type: 'DECIMAL(6,2)', nullable: true },
      { name: 'effort_rating', type: 'INT', nullable: true },
      { name: 'recorded_at', type: 'TIMESTAMP', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'GET', path: '/api/v1/exercise-progress-tracker', description: 'List exercise logs', permission: 'exercise-progress-tracker.view', authRequired: true },
      { method: 'POST', path: '/api/v1/exercise-progress-tracker', description: 'Log a new exercise entry', permission: 'exercise-progress-tracker.create', authRequired: true },
      { method: 'GET', path: '/api/v1/exercise-progress-tracker/{id}', description: 'Get exercise log details', permission: 'exercise-progress-tracker.view', authRequired: true },
      { method: 'GET', path: '/api/v1/exercise-progress-tracker/analytics', description: 'Get exercise progress analytics', permission: 'exercise-progress-tracker.view', authRequired: true }
    ],
    services: ['ExerciseLogService', 'ProgressAnalyticsEngine', 'PersonalRecordTracker'],
    events: ['ExerciseLogRecorded', 'PersonalRecordAchieved', 'ProgressMilestoneReached'],
    jobs: ['ProcessExerciseLogsJob', 'CalculateProgressAnalyticsJob', 'AuditExerciseMetricsJob'],
    dependencies: [9, 41],
    tests: ['ExerciseLogRecordingTest', 'ProgressAnalyticsTest', 'PersonalRecordTest']
  }),

  buildModule({
    id: 445,
    name: 'Sports League Scheduler',
    slug: 'sports-league-scheduler',
    category: 'Sports & Fitness',
    phase: 2,
    iconName: 'Trophy',
    purpose: 'Sports league fixture generation, match scheduling, venue assignment, and season calendar management for organized competitions.',
    responsibilities: [
      'Generate season fixtures with balanced home-away rotation and conflict-free scheduling algorithms',
      'Manage venue assignments considering capacity, availability, and team geographic proximity',
      'Track league standings, playoff qualification, and tournament bracket progression'
    ],
    tableName: 'league_schedules',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'fixture_code', type: 'VARCHAR(32)', nullable: false, index: true },
      { name: 'league_name', type: 'VARCHAR(255)', nullable: false },
      { name: 'season', type: 'VARCHAR(32)', nullable: false },
      { name: 'home_team', type: 'VARCHAR(255)', nullable: false },
      { name: 'away_team', type: 'VARCHAR(255)', nullable: false },
      { name: 'venue_name', type: 'VARCHAR(255)', nullable: false },
      { name: 'match_date', type: 'TIMESTAMP', nullable: false },
      { name: 'match_week', type: 'INT', nullable: false },
      { name: 'status', type: 'ENUM("scheduled","in_progress","completed","postponed","cancelled")', nullable: false },
      { name: 'metadata', type: 'JSON', nullable: true },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'GET', path: '/api/v1/sports-league-scheduler', description: 'List league fixtures', permission: 'sports-league-scheduler.view', authRequired: true },
      { method: 'POST', path: '/api/v1/sports-league-scheduler', description: 'Create a new league fixture', permission: 'sports-league-scheduler.create', authRequired: true },
      { method: 'GET', path: '/api/v1/sports-league-scheduler/{id}', description: 'Get fixture details', permission: 'sports-league-scheduler.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/sports-league-scheduler/{id}/status', description: 'Update match status', permission: 'sports-league-scheduler.manage', authRequired: true }
    ],
    services: ['LeagueScheduleService', 'FixtureGeneratorEngine', 'StandingsTrackerService'],
    events: ['FixtureCreated', 'MatchStatusChanged', 'LeagueStandingsUpdated'],
    jobs: ['GenerateSeasonFixturesJob', 'ResolveSchedulingConflictsJob', 'AuditLeagueMetricsJob'],
    dependencies: [9, 41],
    tests: ['FixtureGenerationTest', 'SchedulingConflictTest', 'StandingsTrackingTest']
  }),

  buildModule({
    id: 446,
    name: 'Team Roster Management',
    slug: 'team-roster-management',
    category: 'Sports & Fitness',
    phase: 2,
    iconName: 'Users',
    purpose: 'Team roster composition, player registration, squad number assignment, transfer window management, and eligibility verification.',
    responsibilities: [
      'Manage team roster composition including player registration, squad numbers, and position assignments',
      'Process player transfers between teams with eligibility verification and registration deadlines',
      'Track roster limits, salary cap compliance, and player contract status for league regulations'
    ],
    tableName: 'team_rosters',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'roster_entry_code', type: 'VARCHAR(32)', nullable: false, index: true },
      { name: 'team_name', type: 'VARCHAR(255)', nullable: false },
      { name: 'player_name', type: 'VARCHAR(255)', nullable: false },
      { name: 'squad_number', type: 'INT', nullable: true },
      { name: 'position', type: 'VARCHAR(64)', nullable: true },
      { name: 'registration_status', type: 'ENUM("registered","pending","suspended","injured","inactive","transferred")', nullable: false },
      { name: 'contract_start', type: 'TIMESTAMP', nullable: true },
      { name: 'contract_end', type: 'TIMESTAMP', nullable: true },
      { name: 'salary_cap_hit', type: 'DECIMAL(12,2)', nullable: true },
      { name: 'eligibility_cleared', type: 'BOOLEAN', nullable: false },
      { name: 'metadata', type: 'JSON', nullable: true },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'GET', path: '/api/v1/team-roster-management', description: 'List team rosters', permission: 'team-roster-management.view', authRequired: true },
      { method: 'POST', path: '/api/v1/team-roster-management', description: 'Add player to roster', permission: 'team-roster-management.create', authRequired: true },
      { method: 'GET', path: '/api/v1/team-roster-management/{id}', description: 'Get roster entry details', permission: 'team-roster-management.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/team-roster-management/{id}/status', description: 'Update player roster status', permission: 'team-roster-management.manage', authRequired: true }
    ],
    services: ['TeamRosterService', 'PlayerRegistrationService', 'SalaryCapService'],
    events: ['PlayerAddedToRoster', 'RosterStatusChanged', 'TransferProcessed'],
    jobs: ['ProcessTeamRosterJob', 'VerifyPlayerEligibilityJob', 'AuditSalaryCapJob'],
    dependencies: [9, 27],
    tests: ['RosterAdditionTest', 'EligibilityVerificationTest', 'SalaryCapComplianceTest']
  }),

  buildModule({
    id: 447,
    name: 'Match Score Recorder',
    slug: 'match-score-recorder',
    category: 'Sports & Fitness',
    phase: 2,
    iconName: 'Timer',
    purpose: 'Live match score tracking, period-by-period scoring, official score submission, and historical score archive management for sports.',
    responsibilities: [
      'Record real-time match scores including goals, points, runs, and period-by-period breakdowns',
      'Validate official score submissions against match rules and referee confirmation protocols',
      'Maintain historical score archives with searchable match records and statistical aggregations'
    ],
    tableName: 'match_results',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'match_code', type: 'VARCHAR(32)', nullable: false, index: true },
      { name: 'league_name', type: 'VARCHAR(255)', nullable: false },
      { name: 'home_team', type: 'VARCHAR(255)', nullable: false },
      { name: 'away_team', type: 'VARCHAR(255)', nullable: false },
      { name: 'home_score', type: 'INT', nullable: false },
      { name: 'away_score', type: 'INT', nullable: false },
      { name: 'period_scores', type: 'JSON', nullable: true },
      { name: 'match_date', type: 'TIMESTAMP', nullable: false },
      { name: 'venue_name', type: 'VARCHAR(255)', nullable: false },
      { name: 'status', type: 'ENUM("live","completed","suspended","abandoned")', nullable: false },
      { name: 'official_result', type: 'BOOLEAN', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'GET', path: '/api/v1/match-score-recorder', description: 'List match results', permission: 'match-score-recorder.view', authRequired: true },
      { method: 'POST', path: '/api/v1/match-score-recorder', description: 'Record a new match score', permission: 'match-score-recorder.create', authRequired: true },
      { method: 'GET', path: '/api/v1/match-score-recorder/{id}', description: 'Get match score details', permission: 'match-score-recorder.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/match-score-recorder/{id}/status', description: 'Update match status or submit official result', permission: 'match-score-recorder.manage', authRequired: true }
    ],
    services: ['MatchScoreService', 'ScoreValidationEngine', 'ScoreArchiveService'],
    events: ['MatchScoreRecorded', 'MatchStatusChanged', 'OfficialResultSubmitted'],
    jobs: ['ProcessMatchScoreJob', 'ValidateMatchScoreJob', 'AuditMatchMetricsJob'],
    dependencies: [445, 446],
    tests: ['MatchScoreRecordingTest', 'ScoreValidationTest', 'OfficialResultTest']
  }),

  buildModule({
    id: 448,
    name: 'Sports Venue Booking',
    slug: 'sports-venue-booking',
    category: 'Sports & Fitness',
    phase: 2,
    iconName: 'MapPin',
    purpose: 'Sports venue reservation management, facility availability tracking, event scheduling, and venue resource allocation for athletic events.',
    responsibilities: [
      'Manage sports venue reservations with availability checking and conflict-free booking confirmations',
      'Allocate facility resources including equipment, staff, and utilities for booked events',
      'Track venue utilization rates, revenue per facility, and maintenance scheduling windows'
    ],
    tableName: 'venue_reservations',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reservation_code', type: 'VARCHAR(32)', nullable: false, index: true },
      { name: 'venue_name', type: 'VARCHAR(255)', nullable: false },
      { name: 'facility_type', type: 'ENUM("field","court","pool","track","gym","stadium","arena")', nullable: false },
      { name: 'event_name', type: 'VARCHAR(255)', nullable: true },
      { name: 'reserved_by', type: 'VARCHAR(255)', nullable: false },
      { name: 'start_at', type: 'TIMESTAMP', nullable: false },
      { name: 'end_at', type: 'TIMESTAMP', nullable: false },
      { name: 'status', type: 'ENUM("pending","confirmed","in_use","completed","cancelled")', nullable: false },
      { name: 'rental_fee', type: 'DECIMAL(8,2)', nullable: true },
      { name: 'equipment_requested', type: 'JSON', nullable: true },
      { name: 'metadata', type: 'JSON', nullable: true },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'GET', path: '/api/v1/sports-venue-booking', description: 'List venue reservations', permission: 'sports-venue-booking.view', authRequired: true },
      { method: 'POST', path: '/api/v1/sports-venue-booking', description: 'Create a venue reservation', permission: 'sports-venue-booking.create', authRequired: true },
      { method: 'GET', path: '/api/v1/sports-venue-booking/{id}', description: 'Get reservation details', permission: 'sports-venue-booking.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/sports-venue-booking/{id}/status', description: 'Confirm or cancel reservation', permission: 'sports-venue-booking.manage', authRequired: true }
    ],
    services: ['VenueBookingService', 'FacilityAllocationEngine', 'VenueAnalyticsService'],
    events: ['VenueReservationCreated', 'ReservationStatusChanged', 'VenueUtilizationUpdated'],
    jobs: ['ProcessVenueReservationsJob', 'CheckVenueAvailabilityJob', 'AuditVenueUtilizationJob'],
    dependencies: [9, 27],
    tests: ['VenueBookingCreationTest', 'AvailabilityConflictTest', 'VenueUtilizationTest']
  }),

  buildModule({
    id: 449,
    name: 'Athletic Performance Analytics',
    slug: 'athletic-performance-analytics',
    category: 'Sports & Fitness',
    phase: 2,
    iconName: 'BarChart3',
    purpose: 'Multi-dimensional athletic performance data aggregation, benchmark comparison, KPI dashboards, and predictive performance modeling.',
    responsibilities: [
      'Aggregate performance metrics from training logs, match results, and wearable device data',
      'Generate benchmark comparisons against team averages, league standards, and historical personal bests',
      'Build predictive models for performance forecasting, injury risk scoring, and peak readiness estimation'
    ],
    tableName: 'performance_metrics',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'metric_code', type: 'VARCHAR(32)', nullable: false, index: true },
      { name: 'athlete_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'metric_name', type: 'VARCHAR(128)', nullable: false },
      { name: 'metric_value', type: 'DECIMAL(12,4)', nullable: false },
      { name: 'unit', type: 'VARCHAR(32)', nullable: false },
      { name: 'benchmark_value', type: 'DECIMAL(12,4)', nullable: true },
      { name: 'percentile_rank', type: 'DECIMAL(5,2)', nullable: true },
      { name: 'assessment_type', type: 'ENUM("training","competition","assessment","recovery","baseline")', nullable: false },
      { name: 'recorded_at', type: 'TIMESTAMP', nullable: false },
      { name: 'metadata', type: 'JSON', nullable: true },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'GET', path: '/api/v1/athletic-performance-analytics', description: 'List performance metrics', permission: 'athletic-performance-analytics.view', authRequired: true },
      { method: 'POST', path: '/api/v1/athletic-performance-analytics', description: 'Record a performance metric', permission: 'athletic-performance-analytics.create', authRequired: true },
      { method: 'GET', path: '/api/v1/athletic-performance-analytics/{id}', description: 'Get metric details', permission: 'athletic-performance-analytics.view', authRequired: true },
      { method: 'GET', path: '/api/v1/athletic-performance-analytics/athlete/{athleteId}', description: 'Get athlete performance summary', permission: 'athletic-performance-analytics.view', authRequired: true }
    ],
    services: ['PerformanceAnalyticsService', 'BenchmarkComparisonEngine', 'PredictiveModelingService'],
    events: ['PerformanceMetricRecorded', 'BenchmarkExceeded', 'InjuryRiskAlertTriggered'],
    jobs: ['AggregatePerformanceMetricsJob', 'RunPredictiveModelsJob', 'AuditPerformanceAnalyticsJob'],
    dependencies: [9, 41],
    tests: ['MetricRecordingTest', 'BenchmarkComparisonTest', 'PredictiveModelTest']
  }),

  buildModule({
    id: 450,
    name: 'Nutrition Diet Planner',
    slug: 'nutrition-diet-planner',
    category: 'Sports & Fitness',
    phase: 2,
    iconName: 'Apple',
    purpose: 'Personalized nutrition plan creation, macronutrient tracking, meal scheduling, and dietary compliance monitoring for athletes.',
    responsibilities: [
      'Generate customized nutrition plans based on athlete body composition, goals, and training intensity',
      'Track daily macronutrient intake including protein, carbohydrates, fats, and micronutrient targets',
      'Monitor dietary compliance scores and flag nutrient deficiencies requiring supplementation'
    ],
    tableName: 'diet_plans',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'plan_code', type: 'VARCHAR(32)', nullable: false, index: true },
      { name: 'athlete_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'plan_name', type: 'VARCHAR(255)', nullable: false },
      { name: 'calorie_target', type: 'INT', nullable: false },
      { name: 'protein_grams', type: 'DECIMAL(6,2)', nullable: false },
      { name: 'carb_grams', type: 'DECIMAL(6,2)', nullable: false },
      { name: 'fat_grams', type: 'DECIMAL(6,2)', nullable: false },
      { name: 'meal_plan', type: 'JSON', nullable: false },
      { name: 'diet_type', type: 'ENUM("standard","vegetarian","vegan","keto","paleo","custom")', nullable: false },
      { name: 'status', type: 'ENUM("draft","active","completed","archived")', nullable: false },
      { name: 'compliance_score', type: 'DECIMAL(5,2)', nullable: true },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'GET', path: '/api/v1/nutrition-diet-planner', description: 'List nutrition diet plans', permission: 'nutrition-diet-planner.view', authRequired: true },
      { method: 'POST', path: '/api/v1/nutrition-diet-planner', description: 'Create a new diet plan', permission: 'nutrition-diet-planner.create', authRequired: true },
      { method: 'GET', path: '/api/v1/nutrition-diet-planner/{id}', description: 'Get diet plan details', permission: 'nutrition-diet-planner.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/nutrition-diet-planner/{id}/status', description: 'Update plan status or compliance', permission: 'nutrition-diet-planner.manage', authRequired: true }
    ],
    services: ['DietPlanService', 'NutrientCalculatorEngine', 'DietaryComplianceMonitor'],
    events: ['DietPlanCreated', 'DietaryComplianceAlerted', 'NutrientDeficiencyDetected'],
    jobs: ['GenerateDietPlanJob', 'CalculateNutrientTargetsJob', 'AuditDietaryComplianceJob'],
    dependencies: [9, 449],
    tests: ['DietPlanCreationTest', 'NutrientCalculationTest', 'DietaryComplianceTest']
  }),

  buildModule({
    id: 451,
    name: 'Hydration Tracking System',
    slug: 'hydration-tracking-system',
    category: 'Sports & Fitness',
    phase: 2,
    iconName: 'Droplets',
    purpose: 'Daily water intake logging, hydration goal setting, electrolyte balance monitoring, and dehydration risk alerting for athletes.',
    responsibilities: [
      'Log daily water intake volumes with timestamps and activity context for each athlete',
      'Set personalized hydration goals based on body weight, training intensity, and environmental conditions',
      'Monitor dehydration risk indicators and trigger proactive hydration reminders and alerts'
    ],
    tableName: 'hydration_logs',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'log_code', type: 'VARCHAR(32)', nullable: false, index: true },
      { name: 'athlete_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'intake_ml', type: 'DECIMAL(8,2)', nullable: false },
      { name: 'beverage_type', type: 'ENUM("water","electrolyte","sports_drink","milk","juice","other")', nullable: false },
      { name: 'daily_goal_ml', type: 'DECIMAL(8,2)', nullable: false },
      { name: 'running_total_ml', type: 'DECIMAL(8,2)', nullable: false },
      { name: 'dehydration_risk', type: 'ENUM("low","moderate","high","critical")', nullable: false },
      { name: 'recorded_at', type: 'TIMESTAMP', nullable: false },
      { name: 'metadata', type: 'JSON', nullable: true },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'GET', path: '/api/v1/hydration-tracking-system', description: 'List hydration logs', permission: 'hydration-tracking-system.view', authRequired: true },
      { method: 'POST', path: '/api/v1/hydration-tracking-system', description: 'Log water intake', permission: 'hydration-tracking-system.create', authRequired: true },
      { method: 'GET', path: '/api/v1/hydration-tracking-system/{id}', description: 'Get hydration log details', permission: 'hydration-tracking-system.view', authRequired: true },
      { method: 'GET', path: '/api/v1/hydration-tracking-system/athlete/{athleteId}', description: 'Get athlete hydration summary', permission: 'hydration-tracking-system.view', authRequired: true }
    ],
    services: ['HydrationLogService', 'HydrationGoalCalculator', 'DehydrationRiskAlertService'],
    events: ['HydrationIntakeRecorded', 'DehydrationRiskAlerted', 'HydrationGoalMet'],
    jobs: ['ProcessHydrationLogsJob', 'CalculateDehydrationRiskJob', 'AuditHydrationMetricsJob'],
    dependencies: [9, 449],
    tests: ['HydrationIntakeTest', 'DehydrationRiskTest', 'HydrationGoalTest']
  }),

  buildModule({
    id: 452,
    name: 'Heart Rate Monitor Integration',
    slug: 'heart-rate-monitor-integration',
    category: 'Sports & Fitness',
    phase: 2,
    iconName: 'Heart',
    purpose: 'Real-time heart rate data ingestion from wearable devices, zone-based training analysis, and cardiac threshold zone tracking for athletes.',
    responsibilities: [
      'Ingest real-time heart rate data from Bluetooth and ANT+ wearable devices via fitness APIs',
      'Classify heart rate readings into training zones (recovery, aerobic, threshold, VO2 max, anaerobic)',
      'Track resting heart rate trends, heart rate variability (HRV), and cardiac recovery metrics'
    ],
    tableName: 'heart_rate_readings',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reading_code', type: 'VARCHAR(32)', nullable: false, index: true },
      { name: 'athlete_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'bpm_value', type: 'INT', nullable: false },
      { name: 'training_zone', type: 'ENUM("recovery","aerobic","tempo","threshold","vo2_max","anaerobic")', nullable: false },
      { name: 'device_id', type: 'VARCHAR(64)', nullable: true },
      { name: 'activity_type', type: 'VARCHAR(64)', nullable: true },
      { name: 'duration_seconds', type: 'INT', nullable: false },
      { name: 'calories_burned', type: 'DECIMAL(8,2)', nullable: true },
      { name: 'hrv_ms', type: 'DECIMAL(6,2)', nullable: true },
      { name: 'recorded_at', type: 'TIMESTAMP', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'GET', path: '/api/v1/heart-rate-monitor-integration', description: 'List heart rate readings', permission: 'heart-rate-monitor-integration.view', authRequired: true },
      { method: 'POST', path: '/api/v1/heart-rate-monitor-integration', description: 'Submit a heart rate reading', permission: 'heart-rate-monitor-integration.create', authRequired: true },
      { method: 'GET', path: '/api/v1/heart-rate-monitor-integration/{id}', description: 'Get reading details', permission: 'heart-rate-monitor-integration.view', authRequired: true },
      { method: 'GET', path: '/api/v1/heart-rate-monitor-integration/athlete/{athleteId}', description: 'Get athlete heart rate summary', permission: 'heart-rate-monitor-integration.view', authRequired: true }
    ],
    services: ['HeartRateService', 'TrainingZoneClassifier', 'CardiacAnalyticsEngine'],
    events: ['HeartRateReadingReceived', 'TrainingZoneChanged', 'CardiacThresholdAlerted'],
    jobs: ['IngestHeartRateDataJob', 'ClassifyTrainingZonesJob', 'AuditCardiacMetricsJob'],
    dependencies: [9, 449],
    tests: ['HeartRateIngestionTest', 'TrainingZoneClassificationTest', 'CardiacAnalyticsTest']
  }),

  buildModule({
    id: 453,
    name: 'Sports Equipment Inventory',
    slug: 'sports-equipment-inventory',
    category: 'Sports & Fitness',
    phase: 2,
    iconName: 'Package',
    purpose: 'Sports equipment stock management, maintenance scheduling, equipment checkout tracking, and procurement lifecycle management.',
    responsibilities: [
      'Track sports equipment inventory levels, locations, and condition status across all facility storage areas',
      'Manage equipment checkout and return workflows with maintenance inspection checkpoints',
      'Schedule preventive maintenance and track equipment depreciation for procurement replacement planning'
    ],
    tableName: 'equipment_stock',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'item_code', type: 'VARCHAR(32)', nullable: false, index: true },
      { name: 'item_name', type: 'VARCHAR(255)', nullable: false },
      { name: 'equipment_category', type: 'ENUM("ball","racket","protective","fitness","field","water","court","other")', nullable: false },
      { name: 'quantity_total', type: 'INT', nullable: false },
      { name: 'quantity_available', type: 'INT', nullable: false },
      { name: 'storage_location', type: 'VARCHAR(128)', nullable: false },
      { name: 'condition_status', type: 'ENUM("new","good","fair","poor","retired")', nullable: false },
      { name: 'last_maintenance_at', type: 'TIMESTAMP', nullable: true },
      { name: 'next_maintenance_at', type: 'TIMESTAMP', nullable: true },
      { name: 'unit_cost', type: 'DECIMAL(8,2)', nullable: true },
      { name: 'metadata', type: 'JSON', nullable: true },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'GET', path: '/api/v1/sports-equipment-inventory', description: 'List equipment inventory', permission: 'sports-equipment-inventory.view', authRequired: true },
      { method: 'POST', path: '/api/v1/sports-equipment-inventory', description: 'Add equipment to inventory', permission: 'sports-equipment-inventory.create', authRequired: true },
      { method: 'GET', path: '/api/v1/sports-equipment-inventory/{id}', description: 'Get equipment details', permission: 'sports-equipment-inventory.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/sports-equipment-inventory/{id}/status', description: 'Update equipment condition or stock', permission: 'sports-equipment-inventory.manage', authRequired: true }
    ],
    services: ['EquipmentInventoryService', 'MaintenanceSchedulerService', 'ProcurementLifecycleService'],
    events: ['EquipmentStockUpdated', 'MaintenanceScheduled', 'EquipmentCheckoutProcessed'],
    jobs: ['SyncEquipmentInventoryJob', 'ScheduleEquipmentMaintenanceJob', 'AuditEquipmentStockJob'],
    dependencies: [9, 27],
    tests: ['EquipmentInventoryTest', 'MaintenanceSchedulingTest', 'CheckoutTrackingTest']
  }),

  buildModule({
    id: 454,
    name: 'Runner Race Registration',
    slug: 'runner-race-registration',
    category: 'Sports & Fitness',
    phase: 2,
    iconName: 'Run',
    purpose: 'Running race event registration, participant bib assignment, race result tracking, and marathon qualifier time management.',
    responsibilities: [
      'Process race registrations with participant details, waiver acceptance, and payment collection',
      'Assign race bib numbers, starting corral positions, and timing chip identifiers',
      'Record finish times, age group rankings, and marathon qualifying time validations'
    ],
    tableName: 'race_registrations',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'registration_code', type: 'VARCHAR(32)', nullable: false, index: true },
      { name: 'event_name', type: 'VARCHAR(255)', nullable: false },
      { name: 'runner_name', type: 'VARCHAR(255)', nullable: false },
      { name: 'race_distance', type: 'ENUM("5k","10k","half_marathon","marathon","ultra","other")', nullable: false },
      { name: 'bib_number', type: 'VARCHAR(16)', nullable: true },
      { name: 'corral_position', type: 'VARCHAR(16)', nullable: true },
      { name: 'registration_status', type: 'ENUM("registered","confirmed","completed","dns","dnf","dq")', nullable: false },
      { name: 'finish_time', type: 'VARCHAR(16)', nullable: true },
      { name: 'age_group', type: 'VARCHAR(16)', nullable: true },
      { name: 'qualifier_time', type: 'BOOLEAN', nullable: true },
      { name: 'registration_fee', type: 'DECIMAL(8,2)', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'GET', path: '/api/v1/runner-race-registration', description: 'List race registrations', permission: 'runner-race-registration.view', authRequired: true },
      { method: 'POST', path: '/api/v1/runner-race-registration', description: 'Register for a race', permission: 'runner-race-registration.create', authRequired: true },
      { method: 'GET', path: '/api/v1/runner-race-registration/{id}', description: 'Get registration details', permission: 'runner-race-registration.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/runner-race-registration/{id}/status', description: 'Update registration or record finish time', permission: 'runner-race-registration.manage', authRequired: true }
    ],
    services: ['RaceRegistrationService', 'BibAssignmentService', 'RaceResultService'],
    events: ['RaceRegistrationCreated', 'RaceResultRecorded', 'QualifierTimeAchieved'],
    jobs: ['ProcessRaceRegistrationsJob', 'AssignRaceBibsJob', 'AuditRaceResultsJob'],
    dependencies: [9, 48],
    tests: ['RaceRegistrationTest', 'BibAssignmentTest', 'RaceResultTest']
  }),

  buildModule({
    id: 455,
    name: 'Swimming Pool Booking',
    slug: 'swimming-pool-booking',
    category: 'Sports & Fitness',
    phase: 2,
    iconName: 'Waves',
    purpose: 'Swimming pool session reservations, lane allocation, water temperature monitoring, and pool capacity management for aquatic facilities.',
    responsibilities: [
      'Manage pool session bookings with lane assignments and time slot allocations for lap and recreational swim',
      'Monitor water temperature, chemical levels, and pool occupancy capacity in real-time',
      'Track lane utilization rates, session revenue, and pool maintenance scheduling windows'
    ],
    tableName: 'pool_sessions',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'session_code', type: 'VARCHAR(32)', nullable: false, index: true },
      { name: 'pool_id', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'session_type', type: 'ENUM("lap_swim","recreational","lesson","team_practice","open_swim","therapy")', nullable: false },
      { name: 'lane_number', type: 'INT', nullable: true },
      { name: 'start_at', type: 'TIMESTAMP', nullable: false },
      { name: 'end_at', type: 'TIMESTAMP', nullable: false },
      { name: 'max_capacity', type: 'INT', nullable: false },
      { name: 'current_occupancy', type: 'INT', nullable: true },
      { name: 'water_temperature_c', type: 'DECIMAL(4,1)', nullable: true },
      { name: 'status', type: 'ENUM("scheduled","in_progress","completed","cancelled")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'GET', path: '/api/v1/swimming-pool-booking', description: 'List pool sessions', permission: 'swimming-pool-booking.view', authRequired: true },
      { method: 'POST', path: '/api/v1/swimming-pool-booking', description: 'Book a pool session', permission: 'swimming-pool-booking.create', authRequired: true },
      { method: 'GET', path: '/api/v1/swimming-pool-booking/{id}', description: 'Get session details', permission: 'swimming-pool-booking.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/swimming-pool-booking/{id}/status', description: 'Update session status or occupancy', permission: 'swimming-pool-booking.manage', authRequired: true }
    ],
    services: ['PoolBookingService', 'LaneAllocationService', 'PoolMonitoringService'],
    events: ['PoolSessionBooked', 'SessionStatusChanged', 'PoolCapacityAlertTriggered'],
    jobs: ['ProcessPoolBookingsJob', 'MonitorPoolConditionsJob', 'AuditPoolUtilizationJob'],
    dependencies: [9, 48],
    tests: ['PoolBookingTest', 'LaneAllocationTest', 'PoolCapacityTest']
  }),

  buildModule({
    id: 456,
    name: 'Yoga Class Scheduler',
    slug: 'yoga-class-scheduler',
    category: 'Sports & Fitness',
    phase: 2,
    iconName: 'Zen',
    purpose: 'Yoga class scheduling, instructor roster management, class capacity tracking, and attendance reporting for wellness studios.',
    responsibilities: [
      'Schedule yoga classes with instructor assignments, room bookings, and level-appropriate classifications',
      'Manage class waitlists, cancellations, and real-time capacity tracking for live sessions',
      'Track instructor availability, class ratings, and attendance patterns for wellness program optimization'
    ],
    tableName: 'yoga_classes',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'class_code', type: 'VARCHAR(32)', nullable: false, index: true },
      { name: 'class_name', type: 'VARCHAR(255)', nullable: false },
      { name: 'yoga_style', type: 'ENUM("hatha","vinyasa","ashtanga","yin","restorative","power","kundalini","hot")', nullable: false },
      { name: 'instructor_name', type: 'VARCHAR(255)', nullable: false },
      { name: 'scheduled_at', type: 'TIMESTAMP', nullable: false },
      { name: 'duration_minutes', type: 'INT', nullable: false },
      { name: 'max_participants', type: 'INT', nullable: false },
      { name: 'current_enrollment', type: 'INT', nullable: true },
      { name: 'difficulty_level', type: 'ENUM("beginner","intermediate","advanced","all_levels")', nullable: false },
      { name: 'status', type: 'ENUM("scheduled","in_progress","completed","cancelled")', nullable: false },
      { name: 'room_name', type: 'VARCHAR(128)', nullable: true },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'GET', path: '/api/v1/yoga-class-scheduler', description: 'List yoga classes', permission: 'yoga-class-scheduler.view', authRequired: true },
      { method: 'POST', path: '/api/v1/yoga-class-scheduler', description: 'Schedule a new yoga class', permission: 'yoga-class-scheduler.create', authRequired: true },
      { method: 'GET', path: '/api/v1/yoga-class-scheduler/{id}', description: 'Get class details', permission: 'yoga-class-scheduler.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/yoga-class-scheduler/{id}/status', description: 'Update class status or enrollment', permission: 'yoga-class-scheduler.manage', authRequired: true }
    ],
    services: ['YogaClassService', 'InstructorRosterService', 'ClassAttendanceService'],
    events: ['YogaClassScheduled', 'ClassEnrollmentUpdated', 'ClassAttendanceRecorded'],
    jobs: ['ScheduleYogaClassesJob', 'TrackClassAttendanceJob', 'AuditYogaMetricsJob'],
    dependencies: [9, 48],
    tests: ['YogaClassSchedulingTest', 'InstructorAssignmentTest', 'ClassAttendanceTest']
  }),

  buildModule({
    id: 457,
    name: 'Fitness Challenge Tracker',
    slug: 'fitness-challenge-tracker',
    category: 'Sports & Fitness',
    phase: 2,
    iconName: 'Award',
    purpose: 'Fitness challenge creation, participant leaderboard management, milestone tracking, and challenge completion reward distribution.',
    responsibilities: [
      'Create and manage fitness challenges with goals, duration rules, and participation eligibility criteria',
      'Track real-time participant progress and maintain live leaderboards with ranking algorithms',
      'Distribute completion badges, rewards, and challenge result certificates to participants'
    ],
    tableName: 'fitness_challenges',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'challenge_code', type: 'VARCHAR(32)', nullable: false, index: true },
      { name: 'challenge_name', type: 'VARCHAR(255)', nullable: false },
      { name: 'challenge_type', type: 'ENUM("steps","distance","weight_loss","consistency","strength","custom")', nullable: false },
      { name: 'start_date', type: 'TIMESTAMP', nullable: false },
      { name: 'end_date', type: 'TIMESTAMP', nullable: false },
      { name: 'target_value', type: 'DECIMAL(12,2)', nullable: false },
      { name: 'target_unit', type: 'VARCHAR(32)', nullable: false },
      { name: 'participant_count', type: 'INT', nullable: true },
      { name: 'status', type: 'ENUM("draft","upcoming","active","completed","archived")', nullable: false },
      { name: 'reward_data', type: 'JSON', nullable: true },
      { name: 'metadata', type: 'JSON', nullable: true },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'GET', path: '/api/v1/fitness-challenge-tracker', description: 'List fitness challenges', permission: 'fitness-challenge-tracker.view', authRequired: true },
      { method: 'POST', path: '/api/v1/fitness-challenge-tracker', description: 'Create a fitness challenge', permission: 'fitness-challenge-tracker.create', authRequired: true },
      { method: 'GET', path: '/api/v1/fitness-challenge-tracker/{id}', description: 'Get challenge details', permission: 'fitness-challenge-tracker.view', authRequired: true },
      { method: 'GET', path: '/api/v1/fitness-challenge-tracker/{id}/leaderboard', description: 'Get challenge leaderboard', permission: 'fitness-challenge-tracker.view', authRequired: true }
    ],
    services: ['FitnessChallengeService', 'LeaderboardService', 'RewardDistributionService'],
    events: ['FitnessChallengeCreated', 'ChallengeProgressUpdated', 'ChallengeCompleted'],
    jobs: ['ProcessFitnessChallengesJob', 'UpdateLeaderboardJob', 'DistributeChallengeRewardsJob'],
    dependencies: [9, 444],
    tests: ['ChallengeCreationTest', 'LeaderboardTest', 'RewardDistributionTest']
  }),

  buildModule({
    id: 458,
    name: 'Sports Injury Clinic',
    slug: 'sports-injury-clinic',
    category: 'Sports & Fitness',
    phase: 2,
    iconName: 'Stethoscope',
    purpose: 'Sports injury documentation, treatment plan management, rehabilitation protocol tracking, and return-to-play clearance workflows.',
    responsibilities: [
      'Document sports injuries with detailed descriptions, severity assessments, and diagnostic classifications',
      'Manage rehabilitation treatment plans with exercise protocols, milestone tracking, and progress notes',
      'Process return-to-play clearance decisions based on medical assessment and functional testing results'
    ],
    tableName: 'injury_records',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'injury_code', type: 'VARCHAR(32)', nullable: false, index: true },
      { name: 'athlete_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'injury_type', type: 'ENUM("sprain","strain","fracture","tear","concussion","overuse","dislocation","other")', nullable: false },
      { name: 'body_region', type: 'VARCHAR(128)', nullable: false },
      { name: 'severity', type: 'ENUM("mild","moderate","severe","critical")', nullable: false },
      { name: 'diagnosis', type: 'TEXT', nullable: false },
      { name: 'treatment_plan', type: 'JSON', nullable: true },
      { name: 'rehabilitation_status', type: 'ENUM("acute","rehabilitation","return_to_play","cleared","re_injured")', nullable: false },
      { name: 'estimated_recovery_weeks', type: 'INT', nullable: true },
      { name: 'cleared_for_play', type: 'BOOLEAN', nullable: false },
      { name: 'injury_date', type: 'TIMESTAMP', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'GET', path: '/api/v1/sports-injury-clinic', description: 'List injury records', permission: 'sports-injury-clinic.view', authRequired: true },
      { method: 'POST', path: '/api/v1/sports-injury-clinic', description: 'Document a new injury', permission: 'sports-injury-clinic.create', authRequired: true },
      { method: 'GET', path: '/api/v1/sports-injury-clinic/{id}', description: 'Get injury record details', permission: 'sports-injury-clinic.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/sports-injury-clinic/{id}/status', description: 'Update rehab status or clearance', permission: 'sports-injury-clinic.manage', authRequired: true }
    ],
    services: ['InjuryRecordService', 'RehabilitationPlanService', 'ReturnToPlayService'],
    events: ['InjuryRecordCreated', 'RehabilitationProgressUpdated', 'ReturnToPlayCleared'],
    jobs: ['ProcessInjuryRecordsJob', 'TrackRehabilitationProgressJob', 'AuditInjuryMetricsJob'],
    dependencies: [9, 449],
    tests: ['InjuryDocumentationTest', 'RehabilitationTrackingTest', 'ReturnToPlayTest']
  }),

  buildModule({
    id: 459,
    name: 'Coaching Certification Tracker',
    slug: 'coaching-certification-tracker',
    category: 'Sports & Fitness',
    phase: 2,
    iconName: 'GraduationCap',
    purpose: 'Coaching certification management, continuing education tracking, credential renewal monitoring, and compliance reporting for coaches.',
    responsibilities: [
      'Manage coaching certifications including issuance dates, expiration dates, and governing body information',
      'Track continuing education credits (CECs) and professional development course completions',
      'Monitor credential renewal deadlines and trigger proactive renewal reminders and compliance alerts'
    ],
    tableName: 'coaching_certs',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'cert_code', type: 'VARCHAR(32)', nullable: false, index: true },
      { name: 'coach_name', type: 'VARCHAR(255)', nullable: false },
      { name: 'certification_name', type: 'VARCHAR(255)', nullable: false },
      { name: 'issuing_body', type: 'VARCHAR(255)', nullable: false },
      { name: 'level', type: 'ENUM("level_1","level_2","level_3","master","specialist")', nullable: false },
      { name: 'issued_at', type: 'TIMESTAMP', nullable: false },
      { name: 'expires_at', type: 'TIMESTAMP', nullable: true },
      { name: 'cec_credits', type: 'DECIMAL(6,2)', nullable: true },
      { name: 'cec_required', type: 'DECIMAL(6,2)', nullable: true },
      { name: 'status', type: 'ENUM("active","pending_renewal","expired","revoked","suspended")', nullable: false },
      { name: 'metadata', type: 'JSON', nullable: true },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'GET', path: '/api/v1/coaching-certification-tracker', description: 'List coaching certifications', permission: 'coaching-certification-tracker.view', authRequired: true },
      { method: 'POST', path: '/api/v1/coaching-certification-tracker', description: 'Register a coaching certification', permission: 'coaching-certification-tracker.create', authRequired: true },
      { method: 'GET', path: '/api/v1/coaching-certification-tracker/{id}', description: 'Get certification details', permission: 'coaching-certification-tracker.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/coaching-certification-tracker/{id}/status', description: 'Update certification status or CEC credits', permission: 'coaching-certification-tracker.manage', authRequired: true }
    ],
    services: ['CoachingCertService', 'CECTrackingService', 'CredentialRenewalService'],
    events: ['CoachingCertRegistered', 'CECCreditsUpdated', 'CredentialRenewalAlerted'],
    jobs: ['ProcessCoachingCertsJob', 'TrackCECCreditsJob', 'AuditCertificationComplianceJob'],
    dependencies: [9, 27],
    tests: ['CertificationRegistrationTest', 'CECTrackingTest', 'RenewalAlertTest']
  }),

  buildModule({
    id: 460,
    name: 'Sports Merchandise Store',
    slug: 'sports-merchandise-store',
    category: 'Sports & Fitness',
    phase: 2,
    iconName: 'ShoppingBag',
    purpose: 'Sports merchandise catalog management, online storefront operations, order processing, and inventory fulfillment for athletic retail.',
    responsibilities: [
      'Manage sports merchandise product catalog with categories, pricing, sizes, and team branding details',
      'Process customer orders including cart management, payment processing, and shipping label generation',
      'Track inventory levels, restock alerts, and fulfillment status across warehouse and retail locations'
    ],
    tableName: 'merchandise_products',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'sku_code', type: 'VARCHAR(32)', nullable: false, index: true },
      { name: 'product_name', type: 'VARCHAR(255)', nullable: false },
      { name: 'product_category', type: 'ENUM("apparel","footwear","accessories","equipment","collectibles","nutrition")', nullable: false },
      { name: 'team_brand', type: 'VARCHAR(128)', nullable: true },
      { name: 'price', type: 'DECIMAL(8,2)', nullable: false },
      { name: 'stock_quantity', type: 'INT', nullable: false },
      { name: 'size_options', type: 'JSON', nullable: true },
      { name: 'images', type: 'JSON', nullable: true },
      { name: 'status', type: 'ENUM("active","out_of_stock","discontinued","pre_order","coming_soon")', nullable: false },
      { name: 'restock_threshold', type: 'INT', nullable: true },
      { name: 'metadata', type: 'JSON', nullable: true },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'GET', path: '/api/v1/sports-merchandise-store', description: 'List merchandise products', permission: 'sports-merchandise-store.view', authRequired: true },
      { method: 'POST', path: '/api/v1/sports-merchandise-store', description: 'Add a merchandise product', permission: 'sports-merchandise-store.create', authRequired: true },
      { method: 'GET', path: '/api/v1/sports-merchandise-store/{id}', description: 'Get product details', permission: 'sports-merchandise-store.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/sports-merchandise-store/{id}/status', description: 'Update product stock or status', permission: 'sports-merchandise-store.manage', authRequired: true }
    ],
    services: ['MerchandiseCatalogService', 'OrderProcessingService', 'InventoryFulfillmentService'],
    events: ['MerchandiseProductAdded', 'OrderProcessed', 'InventoryRestockTriggered'],
    jobs: ['ProcessMerchandiseOrdersJob', 'SyncInventoryLevelsJob', 'AuditMerchandiseSalesJob'],
    dependencies: [9, 41],
    tests: ['MerchandiseCatalogTest', 'OrderProcessingTest', 'InventoryFulfillmentTest']
  })
];
