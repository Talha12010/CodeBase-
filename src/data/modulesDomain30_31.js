import { buildModule } from './moduleBuilderHelper';

export const modulesDomain30_31 = [
  buildModule({
    id: 601,
    name: 'Blog Management',
    slug: 'blog-management',
    category: 'Media & Entertainment',
    phase: 30,
    iconName: 'FileText',
    purpose: 'Create, edit, and publish blog posts with rich content management.',
    responsibilities: [
      'Manage blog post creation, editing, and publishing',
      'Organize posts by category and tags',
      'Track post engagement metrics'
    ],
    tableName: 'blog_posts',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'title', type: 'VARCHAR(255)', nullable: false },
      { name: 'content', type: 'TEXT', nullable: true },
      { name: 'status', type: 'ENUM("draft","published","archived")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/blog-management', description: 'Create new blog post', permission: 'blog-management.create', authRequired: true },
      { method: 'GET', path: '/api/v1/blog-management', description: 'List all blog posts', permission: 'blog-management.view', authRequired: true },
      { method: 'GET', path: '/api/v1/blog-management/{id}', description: 'Get blog post details', permission: 'blog-management.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/blog-management/{id}', description: 'Update blog post', permission: 'blog-management.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/blog-management/{id}', description: 'Delete blog post', permission: 'blog-management.delete', authRequired: true }
    ],
    services: ['BlogService', 'BlogPublisherService'],
    events: ['BlogPostCreated', 'BlogPostPublished', 'BlogPostArchived'],
    jobs: ['IndexBlogPostJob'],
    dependencies: [1],
    tests: ['BlogPostCrudTest', 'BlogPostPublishTest']
  }),
  buildModule({
    id: 602,
    name: 'Gallery Management',
    slug: 'gallery-management',
    category: 'Media & Entertainment',
    phase: 30,
    iconName: 'Image',
    purpose: 'Manage image galleries with upload, organization, and display features.',
    responsibilities: [
      'Upload and organize images into galleries',
      'Manage image metadata and ordering',
      'Control gallery visibility and access'
    ],
    tableName: 'galleries',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'name', type: 'VARCHAR(255)', nullable: false },
      { name: 'status', type: 'ENUM("draft","active","archived")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/gallery-management', description: 'Create new gallery', permission: 'gallery-management.create', authRequired: true },
      { method: 'GET', path: '/api/v1/gallery-management', description: 'List all galleries', permission: 'gallery-management.view', authRequired: true },
      { method: 'GET', path: '/api/v1/gallery-management/{id}', description: 'Get gallery details', permission: 'gallery-management.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/gallery-management/{id}', description: 'Update gallery', permission: 'gallery-management.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/gallery-management/{id}', description: 'Delete gallery', permission: 'gallery-management.delete', authRequired: true }
    ],
    services: ['GalleryService', 'ImageProcessingService'],
    events: ['GalleryCreated', 'GalleryUpdated', 'GalleryDeleted'],
    jobs: ['ProcessGalleryImagesJob'],
    dependencies: [1],
    tests: ['GalleryCrudTest', 'GalleryImageTest']
  }),
  buildModule({
    id: 603,
    name: 'Video Management',
    slug: 'video-management',
    category: 'Media & Entertainment',
    phase: 30,
    iconName: 'Video',
    purpose: 'Upload, process, and manage video content with encoding and streaming support.',
    responsibilities: [
      'Upload and store video files',
      'Manage video encoding and transcoding',
      'Track video views and engagement'
    ],
    tableName: 'videos',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'title', type: 'VARCHAR(255)', nullable: false },
      { name: 'status', type: 'ENUM("uploading","processing","ready","failed")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/video-management', description: 'Upload new video', permission: 'video-management.create', authRequired: true },
      { method: 'GET', path: '/api/v1/video-management', description: 'List all videos', permission: 'video-management.view', authRequired: true },
      { method: 'GET', path: '/api/v1/video-management/{id}', description: 'Get video details', permission: 'video-management.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/video-management/{id}', description: 'Update video', permission: 'video-management.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/video-management/{id}', description: 'Delete video', permission: 'video-management.delete', authRequired: true }
    ],
    services: ['VideoService', 'VideoEncodingService'],
    events: ['VideoUploaded', 'VideoProcessed', 'VideoDeleted'],
    jobs: ['EncodeVideoJob', 'GenerateVideoThumbnailJob'],
    dependencies: [1],
    tests: ['VideoCrudTest', 'VideoEncodingTest']
  }),
  buildModule({
    id: 604,
    name: 'Podcast Management',
    slug: 'podcast-management',
    category: 'Media & Entertainment',
    phase: 30,
    iconName: 'Mic',
    purpose: 'Create and manage podcast episodes with RSS feed generation.',
    responsibilities: [
      'Create and manage podcast episodes',
      'Generate and distribute RSS feeds',
      'Track episode downloads and analytics'
    ],
    tableName: 'podcasts',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'title', type: 'VARCHAR(255)', nullable: false },
      { name: 'status', type: 'ENUM("draft","published","archived")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/podcast-management', description: 'Create new podcast episode', permission: 'podcast-management.create', authRequired: true },
      { method: 'GET', path: '/api/v1/podcast-management', description: 'List all podcast episodes', permission: 'podcast-management.view', authRequired: true },
      { method: 'GET', path: '/api/v1/podcast-management/{id}', description: 'Get podcast details', permission: 'podcast-management.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/podcast-management/{id}', description: 'Update podcast', permission: 'podcast-management.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/podcast-management/{id}', description: 'Delete podcast', permission: 'podcast-management.delete', authRequired: true }
    ],
    services: ['PodcastService', 'RssFeedService'],
    events: ['PodcastCreated', 'PodcastPublished', 'PodcastArchived'],
    jobs: ['GenerateRssFeedJob'],
    dependencies: [1],
    tests: ['PodcastCrudTest', 'RssFeedTest']
  }),
  buildModule({
    id: 605,
    name: 'Newsletter Management',
    slug: 'newsletter-management',
    category: 'Communication',
    phase: 30,
    iconName: 'Mail',
    purpose: 'Create and send newsletter campaigns to subscriber lists.',
    responsibilities: [
      'Create newsletter content and templates',
      'Schedule and send newsletter campaigns',
      'Track open rates and click metrics'
    ],
    tableName: 'newsletters',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'subject', type: 'VARCHAR(255)', nullable: false },
      { name: 'status', type: 'ENUM("draft","scheduled","sent","failed")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/newsletter-management', description: 'Create new newsletter', permission: 'newsletter-management.create', authRequired: true },
      { method: 'GET', path: '/api/v1/newsletter-management', description: 'List all newsletters', permission: 'newsletter-management.view', authRequired: true },
      { method: 'GET', path: '/api/v1/newsletter-management/{id}', description: 'Get newsletter details', permission: 'newsletter-management.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/newsletter-management/{id}', description: 'Update newsletter', permission: 'newsletter-management.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/newsletter-management/{id}', description: 'Delete newsletter', permission: 'newsletter-management.delete', authRequired: true }
    ],
    services: ['NewsletterService', 'EmailDispatchService'],
    events: ['NewsletterCreated', 'NewsletterSent', 'NewsletterFailed'],
    jobs: ['SendNewsletterJob', 'TrackNewsletterMetricsJob'],
    dependencies: [1],
    tests: ['NewsletterCrudTest', 'NewsletterSendTest']
  }),
  buildModule({
    id: 606,
    name: 'Subscriber Management',
    slug: 'subscriber-management',
    category: 'Communication',
    phase: 30,
    iconName: 'Users',
    purpose: 'Manage email subscribers, subscriptions, and opt-in preferences.',
    responsibilities: [
      'Manage subscriber sign-ups and opt-outs',
      'Track subscription preferences',
      'Handle subscriber list segmentation'
    ],
    tableName: 'subscribers',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'email', type: 'VARCHAR(255)', nullable: false, index: true },
      { name: 'status', type: 'ENUM("active","unsubscribed","bounced")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/subscriber-management', description: 'Add new subscriber', permission: 'subscriber-management.create', authRequired: true },
      { method: 'GET', path: '/api/v1/subscriber-management', description: 'List all subscribers', permission: 'subscriber-management.view', authRequired: true },
      { method: 'GET', path: '/api/v1/subscriber-management/{id}', description: 'Get subscriber details', permission: 'subscriber-management.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/subscriber-management/{id}', description: 'Update subscriber', permission: 'subscriber-management.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/subscriber-management/{id}', description: 'Remove subscriber', permission: 'subscriber-management.delete', authRequired: true }
    ],
    services: ['SubscriberService', 'SubscriptionPreferenceService'],
    events: ['SubscriberAdded', 'SubscriberRemoved', 'SubscriberBounced'],
    jobs: ['SyncSubscriberListJob'],
    dependencies: [1],
    tests: ['SubscriberCrudTest', 'SubscriptionPreferenceTest']
  }),
  buildModule({
    id: 607,
    name: 'Reservation Management',
    slug: 'reservation-management',
    category: 'Booking & Services',
    phase: 30,
    iconName: 'CalendarCheck',
    purpose: 'Manage reservations and bookings for services, venues, or resources.',
    responsibilities: [
      'Create and manage reservation entries',
      'Handle booking confirmations and cancellations',
      'Track reservation status and availability'
    ],
    tableName: 'reservations',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'name', type: 'VARCHAR(255)', nullable: false },
      { name: 'status', type: 'ENUM("pending","confirmed","cancelled","completed")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/reservation-management', description: 'Create new reservation', permission: 'reservation-management.create', authRequired: true },
      { method: 'GET', path: '/api/v1/reservation-management', description: 'List all reservations', permission: 'reservation-management.view', authRequired: true },
      { method: 'GET', path: '/api/v1/reservation-management/{id}', description: 'Get reservation details', permission: 'reservation-management.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/reservation-management/{id}', description: 'Update reservation', permission: 'reservation-management.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/reservation-management/{id}', description: 'Cancel reservation', permission: 'reservation-management.delete', authRequired: true }
    ],
    services: ['ReservationService', 'AvailabilityService'],
    events: ['ReservationCreated', 'ReservationConfirmed', 'ReservationCancelled'],
    jobs: ['CheckReservationExpiryJob'],
    dependencies: [1],
    tests: ['ReservationCrudTest', 'ReservationBookingTest']
  }),
  buildModule({
    id: 608,
    name: 'Refund Management',
    slug: 'refund-management',
    category: 'Financial',
    phase: 30,
    iconName: 'Undo2',
    purpose: 'Process and track refund requests for payments and transactions.',
    responsibilities: [
      'Process refund requests from customers',
      'Track refund status and approval workflows',
      'Generate refund reports and analytics'
    ],
    tableName: 'refunds',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'name', type: 'VARCHAR(255)', nullable: false },
      { name: 'status', type: 'ENUM("pending","approved","rejected","completed")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/refund-management', description: 'Create refund request', permission: 'refund-management.create', authRequired: true },
      { method: 'GET', path: '/api/v1/refund-management', description: 'List all refunds', permission: 'refund-management.view', authRequired: true },
      { method: 'GET', path: '/api/v1/refund-management/{id}', description: 'Get refund details', permission: 'refund-management.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/refund-management/{id}', description: 'Update refund status', permission: 'refund-management.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/refund-management/{id}', description: 'Delete refund record', permission: 'refund-management.delete', authRequired: true }
    ],
    services: ['RefundService', 'RefundApprovalService'],
    events: ['RefundRequested', 'RefundApproved', 'RefundCompleted'],
    jobs: ['ProcessRefundJob', 'AuditRefundJob'],
    dependencies: [1],
    tests: ['RefundCrudTest', 'RefundApprovalTest']
  }),
  buildModule({
    id: 609,
    name: 'Commission Management',
    slug: 'commission-management',
    category: 'Financial',
    phase: 30,
    iconName: 'Percent',
    purpose: 'Track and calculate commissions for sales, referrals, and partnerships.',
    responsibilities: [
      'Calculate commission amounts based on rules',
      'Track commission payouts and balances',
      'Generate commission statements and reports'
    ],
    tableName: 'commissions',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'name', type: 'VARCHAR(255)', nullable: false },
      { name: 'status', type: 'ENUM("pending","approved","paid","cancelled")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/commission-management', description: 'Create commission record', permission: 'commission-management.create', authRequired: true },
      { method: 'GET', path: '/api/v1/commission-management', description: 'List all commissions', permission: 'commission-management.view', authRequired: true },
      { method: 'GET', path: '/api/v1/commission-management/{id}', description: 'Get commission details', permission: 'commission-management.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/commission-management/{id}', description: 'Update commission', permission: 'commission-management.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/commission-management/{id}', description: 'Delete commission record', permission: 'commission-management.delete', authRequired: true }
    ],
    services: ['CommissionService', 'CommissionCalculationService'],
    events: ['CommissionCreated', 'CommissionApproved', 'CommissionPaid'],
    jobs: ['CalculateCommissionsJob'],
    dependencies: [1],
    tests: ['CommissionCrudTest', 'CommissionCalculationTest']
  }),
  buildModule({
    id: 610,
    name: 'Reimbursement Management',
    slug: 'reimbursement-management',
    category: 'Financial',
    phase: 30,
    iconName: 'Receipt',
    purpose: 'Process employee and partner reimbursement requests with approval workflows.',
    responsibilities: [
      'Submit and track reimbursement requests',
      'Manage approval workflows and policies',
      'Process approved reimbursements for payment'
    ],
    tableName: 'reimbursements',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'name', type: 'VARCHAR(255)', nullable: false },
      { name: 'status', type: 'ENUM("submitted","reviewing","approved","rejected","paid")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/reimbursement-management', description: 'Submit reimbursement', permission: 'reimbursement-management.create', authRequired: true },
      { method: 'GET', path: '/api/v1/reimbursement-management', description: 'List all reimbursements', permission: 'reimbursement-management.view', authRequired: true },
      { method: 'GET', path: '/api/v1/reimbursement-management/{id}', description: 'Get reimbursement details', permission: 'reimbursement-management.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/reimbursement-management/{id}', description: 'Update reimbursement', permission: 'reimbursement-management.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/reimbursement-management/{id}', description: 'Delete reimbursement', permission: 'reimbursement-management.delete', authRequired: true }
    ],
    services: ['ReimbursementService', 'ReimbursementApprovalService'],
    events: ['ReimbursementSubmitted', 'ReimbursementApproved', 'ReimbursementPaid'],
    jobs: ['ProcessReimbursementJob'],
    dependencies: [1],
    tests: ['ReimbursementCrudTest', 'ReimbursementApprovalTest']
  }),
  buildModule({
    id: 611,
    name: 'Pet Management',
    slug: 'pet-management',
    category: 'Community & Social',
    phase: 30,
    iconName: 'PawPrint',
    purpose: 'Manage pet profiles, health records, and adoption information.',
    responsibilities: [
      'Create and maintain pet profiles',
      'Track vaccination and health records',
      'Manage adoption listings and inquiries'
    ],
    tableName: 'pets',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'name', type: 'VARCHAR(255)', nullable: false },
      { name: 'status', type: 'ENUM("active","archived","adopted")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/pet-management', description: 'Add new pet', permission: 'pet-management.create', authRequired: true },
      { method: 'GET', path: '/api/v1/pet-management', description: 'List all pets', permission: 'pet-management.view', authRequired: true },
      { method: 'GET', path: '/api/v1/pet-management/{id}', description: 'Get pet details', permission: 'pet-management.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/pet-management/{id}', description: 'Update pet', permission: 'pet-management.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/pet-management/{id}', description: 'Remove pet', permission: 'pet-management.delete', authRequired: true }
    ],
    services: ['PetService', 'PetHealthService'],
    events: ['PetAdded', 'PetUpdated', 'PetAdopted'],
    jobs: ['SyncPetRecordsJob'],
    dependencies: [1],
    tests: ['PetCrudTest', 'PetHealthTest']
  }),
  buildModule({
    id: 612,
    name: 'Recipe Management',
    slug: 'recipe-management',
    category: 'Community & Social',
    phase: 30,
    iconName: 'ChefHat',
    purpose: 'Create, share, and manage recipes with ingredients and cooking instructions.',
    responsibilities: [
      'Create and edit recipe entries',
      'Manage ingredients and nutritional information',
      'Share and rate recipes among users'
    ],
    tableName: 'recipes',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'title', type: 'VARCHAR(255)', nullable: false },
      { name: 'status', type: 'ENUM("draft","published","archived")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/recipe-management', description: 'Create new recipe', permission: 'recipe-management.create', authRequired: true },
      { method: 'GET', path: '/api/v1/recipe-management', description: 'List all recipes', permission: 'recipe-management.view', authRequired: true },
      { method: 'GET', path: '/api/v1/recipe-management/{id}', description: 'Get recipe details', permission: 'recipe-management.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/recipe-management/{id}', description: 'Update recipe', permission: 'recipe-management.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/recipe-management/{id}', description: 'Delete recipe', permission: 'recipe-management.delete', authRequired: true }
    ],
    services: ['RecipeService', 'RecipeSearchService'],
    events: ['RecipeCreated', 'RecipePublished', 'RecipeArchived'],
    jobs: ['IndexRecipeJob'],
    dependencies: [1],
    tests: ['RecipeCrudTest', 'RecipeSearchTest']
  }),
  buildModule({
    id: 613,
    name: 'Workout Plan Management',
    slug: 'workout-plan-management',
    category: 'Sports & Fitness',
    phase: 30,
    iconName: 'Dumbbell',
    purpose: 'Create and manage workout plans with exercises and training schedules.',
    responsibilities: [
      'Design workout plans with exercise sets',
      'Track workout completion and progress',
      'Generate personalized workout recommendations'
    ],
    tableName: 'workout_plans',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'name', type: 'VARCHAR(255)', nullable: false },
      { name: 'status', type: 'ENUM("draft","active","completed","archived")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/workout-plan-management', description: 'Create new workout plan', permission: 'workout-plan-management.create', authRequired: true },
      { method: 'GET', path: '/api/v1/workout-plan-management', description: 'List all workout plans', permission: 'workout-plan-management.view', authRequired: true },
      { method: 'GET', path: '/api/v1/workout-plan-management/{id}', description: 'Get workout plan details', permission: 'workout-plan-management.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/workout-plan-management/{id}', description: 'Update workout plan', permission: 'workout-plan-management.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/workout-plan-management/{id}', description: 'Delete workout plan', permission: 'workout-plan-management.delete', authRequired: true }
    ],
    services: ['WorkoutPlanService', 'WorkoutTrackingService'],
    events: ['WorkoutPlanCreated', 'WorkoutPlanActivated', 'WorkoutCompleted'],
    jobs: ['GenerateWorkoutRecommendationJob'],
    dependencies: [1],
    tests: ['WorkoutPlanCrudTest', 'WorkoutTrackingTest']
  }),
  buildModule({
    id: 614,
    name: 'Meal Plan Management',
    slug: 'meal-plan-management',
    category: 'Sports & Fitness',
    phase: 30,
    iconName: 'UtensilsCrossed',
    purpose: 'Create and manage meal plans with nutritional tracking and dietary preferences.',
    responsibilities: [
      'Design meal plans with recipes and portions',
      'Track nutritional intake and goals',
      'Manage dietary restrictions and preferences'
    ],
    tableName: 'meal_plans',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'name', type: 'VARCHAR(255)', nullable: false },
      { name: 'status', type: 'ENUM("draft","active","completed","archived")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/meal-plan-management', description: 'Create new meal plan', permission: 'meal-plan-management.create', authRequired: true },
      { method: 'GET', path: '/api/v1/meal-plan-management', description: 'List all meal plans', permission: 'meal-plan-management.view', authRequired: true },
      { method: 'GET', path: '/api/v1/meal-plan-management/{id}', description: 'Get meal plan details', permission: 'meal-plan-management.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/meal-plan-management/{id}', description: 'Update meal plan', permission: 'meal-plan-management.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/meal-plan-management/{id}', description: 'Delete meal plan', permission: 'meal-plan-management.delete', authRequired: true }
    ],
    services: ['MealPlanService', 'NutritionTrackingService'],
    events: ['MealPlanCreated', 'MealPlanActivated', 'MealPlanCompleted'],
    jobs: ['CalculateNutritionJob'],
    dependencies: [1],
    tests: ['MealPlanCrudTest', 'NutritionTrackingTest']
  }),
  buildModule({
    id: 615,
    name: 'Habit Tracker',
    slug: 'habit-tracker',
    category: 'Sports & Fitness',
    phase: 30,
    iconName: 'CheckSquare',
    purpose: 'Track daily habits, streaks, and progress toward personal goals.',
    responsibilities: [
      'Create and manage habit entries',
      'Track habit completion and streaks',
      'Provide habit analytics and insights'
    ],
    tableName: 'habits',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'name', type: 'VARCHAR(255)', nullable: false },
      { name: 'status', type: 'ENUM("active","paused","archived")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/habit-tracker', description: 'Create new habit', permission: 'habit-tracker.create', authRequired: true },
      { method: 'GET', path: '/api/v1/habit-tracker', description: 'List all habits', permission: 'habit-tracker.view', authRequired: true },
      { method: 'GET', path: '/api/v1/habit-tracker/{id}', description: 'Get habit details', permission: 'habit-tracker.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/habit-tracker/{id}', description: 'Update habit', permission: 'habit-tracker.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/habit-tracker/{id}', description: 'Delete habit', permission: 'habit-tracker.delete', authRequired: true }
    ],
    services: ['HabitService', 'HabitAnalyticsService'],
    events: ['HabitCreated', 'HabitCompleted', 'HabitStreakUpdated'],
    jobs: ['CalculateHabitStatsJob'],
    dependencies: [1],
    tests: ['HabitCrudTest', 'HabitStreakTest']
  }),
  buildModule({
    id: 616,
    name: 'Reading List Management',
    slug: 'reading-list-management',
    category: 'EdTech & Learning',
    phase: 30,
    iconName: 'BookOpen',
    purpose: 'Manage personal reading lists with bookmarks, notes, and progress tracking.',
    responsibilities: [
      'Add and organize reading materials',
      'Track reading progress and completion',
      'Share reading lists with other users'
    ],
    tableName: 'reading_lists',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'title', type: 'VARCHAR(255)', nullable: false },
      { name: 'status', type: 'ENUM("active","completed","archived")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/reading-list-management', description: 'Create new reading list', permission: 'reading-list-management.create', authRequired: true },
      { method: 'GET', path: '/api/v1/reading-list-management', description: 'List all reading lists', permission: 'reading-list-management.view', authRequired: true },
      { method: 'GET', path: '/api/v1/reading-list-management/{id}', description: 'Get reading list details', permission: 'reading-list-management.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/reading-list-management/{id}', description: 'Update reading list', permission: 'reading-list-management.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/reading-list-management/{id}', description: 'Delete reading list', permission: 'reading-list-management.delete', authRequired: true }
    ],
    services: ['ReadingListService', 'ReadingProgressService'],
    events: ['ReadingListCreated', 'ReadingListCompleted', 'ReadingItemAdded'],
    jobs: ['TrackReadingProgressJob'],
    dependencies: [1],
    tests: ['ReadingListCrudTest', 'ReadingProgressTest']
  }),
  buildModule({
    id: 617,
    name: 'Learning Path Management',
    slug: 'learning-path-management',
    category: 'EdTech & Learning',
    phase: 30,
    iconName: 'Route',
    purpose: 'Design and manage structured learning paths with courses and milestones.',
    responsibilities: [
      'Create learning paths with sequential courses',
      'Track learner progress through paths',
      'Generate completion certificates'
    ],
    tableName: 'learning_paths',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'name', type: 'VARCHAR(255)', nullable: false },
      { name: 'status', type: 'ENUM("draft","active","archived")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/learning-path-management', description: 'Create new learning path', permission: 'learning-path-management.create', authRequired: true },
      { method: 'GET', path: '/api/v1/learning-path-management', description: 'List all learning paths', permission: 'learning-path-management.view', authRequired: true },
      { method: 'GET', path: '/api/v1/learning-path-management/{id}', description: 'Get learning path details', permission: 'learning-path-management.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/learning-path-management/{id}', description: 'Update learning path', permission: 'learning-path-management.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/learning-path-management/{id}', description: 'Delete learning path', permission: 'learning-path-management.delete', authRequired: true }
    ],
    services: ['LearningPathService', 'PathProgressService'],
    events: ['LearningPathCreated', 'LearningPathActivated', 'PathCompleted'],
    jobs: ['TrackLearningProgressJob'],
    dependencies: [1],
    tests: ['LearningPathCrudTest', 'LearningProgressTest']
  }),
  buildModule({
    id: 618,
    name: 'Certificate Management',
    slug: 'certificate-management',
    category: 'EdTech & Learning',
    phase: 30,
    iconName: 'Award',
    purpose: 'Generate, issue, and verify completion certificates for courses and achievements.',
    responsibilities: [
      'Generate certificates from templates',
      'Issue certificates upon course completion',
      'Verify certificate authenticity'
    ],
    tableName: 'certificates',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'name', type: 'VARCHAR(255)', nullable: false },
      { name: 'status', type: 'ENUM("draft","issued","revoked")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/certificate-management', description: 'Issue new certificate', permission: 'certificate-management.create', authRequired: true },
      { method: 'GET', path: '/api/v1/certificate-management', description: 'List all certificates', permission: 'certificate-management.view', authRequired: true },
      { method: 'GET', path: '/api/v1/certificate-management/{id}', description: 'Get certificate details', permission: 'certificate-management.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/certificate-management/{id}', description: 'Update certificate', permission: 'certificate-management.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/certificate-management/{id}', description: 'Revoke certificate', permission: 'certificate-management.delete', authRequired: true }
    ],
    services: ['CertificateService', 'CertificateVerificationService'],
    events: ['CertificateIssued', 'CertificateRevoked', 'CertificateVerified'],
    jobs: ['GenerateCertificatePdfJob'],
    dependencies: [1],
    tests: ['CertificateCrudTest', 'CertificateVerificationTest']
  }),
  buildModule({
    id: 619,
    name: 'Quiz Management',
    slug: 'quiz-management',
    category: 'EdTech & Learning',
    phase: 30,
    iconName: 'Brain',
    purpose: 'Create and manage quizzes with questions, answers, and scoring logic.',
    responsibilities: [
      'Create quizzes with multiple question types',
      'Manage answer options and scoring',
      'Track quiz attempts and results'
    ],
    tableName: 'quizzes',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'title', type: 'VARCHAR(255)', nullable: false },
      { name: 'status', type: 'ENUM("draft","active","archived")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/quiz-management', description: 'Create new quiz', permission: 'quiz-management.create', authRequired: true },
      { method: 'GET', path: '/api/v1/quiz-management', description: 'List all quizzes', permission: 'quiz-management.view', authRequired: true },
      { method: 'GET', path: '/api/v1/quiz-management/{id}', description: 'Get quiz details', permission: 'quiz-management.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/quiz-management/{id}', description: 'Update quiz', permission: 'quiz-management.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/quiz-management/{id}', description: 'Delete quiz', permission: 'quiz-management.delete', authRequired: true }
    ],
    services: ['QuizService', 'QuizScoringService'],
    events: ['QuizCreated', 'QuizPublished', 'QuizAttemptCompleted'],
    jobs: ['GradeQuizAttemptJob'],
    dependencies: [1],
    tests: ['QuizCrudTest', 'QuizScoringTest']
  }),
  buildModule({
    id: 620,
    name: 'Poll Management',
    slug: 'poll-management',
    category: 'Community & Social',
    phase: 30,
    iconName: 'BarChart3',
    purpose: 'Create and manage polls with voting, results tracking, and analytics.',
    responsibilities: [
      'Create polls with multiple options',
      'Collect and validate votes',
      'Display real-time poll results'
    ],
    tableName: 'polls',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'title', type: 'VARCHAR(255)', nullable: false },
      { name: 'status', type: 'ENUM("draft","active","closed","archived")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/poll-management', description: 'Create new poll', permission: 'poll-management.create', authRequired: true },
      { method: 'GET', path: '/api/v1/poll-management', description: 'List all polls', permission: 'poll-management.view', authRequired: true },
      { method: 'GET', path: '/api/v1/poll-management/{id}', description: 'Get poll details', permission: 'poll-management.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/poll-management/{id}', description: 'Update poll', permission: 'poll-management.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/poll-management/{id}', description: 'Delete poll', permission: 'poll-management.delete', authRequired: true }
    ],
    services: ['PollService', 'PollAnalyticsService'],
    events: ['PollCreated', 'PollVoted', 'PollClosed'],
    jobs: ['TallyPollVotesJob'],
    dependencies: [1],
    tests: ['PollCrudTest', 'PollVotingTest']
  }),
  buildModule({
    id: 621,
    name: 'Discussion Forum',
    slug: 'discussion-forum',
    category: 'Community & Social',
    phase: 30,
    iconName: 'MessageSquare',
    purpose: 'Manage discussion forums with threads, posts, and moderation features.',
    responsibilities: [
      'Create and organize forum topics',
      'Manage threads and posts',
      'Handle moderation and reporting'
    ],
    tableName: 'forum_threads',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'title', type: 'VARCHAR(255)', nullable: false },
      { name: 'status', type: 'ENUM("open","locked","archived")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/discussion-forum', description: 'Create new thread', permission: 'discussion-forum.create', authRequired: true },
      { method: 'GET', path: '/api/v1/discussion-forum', description: 'List all threads', permission: 'discussion-forum.view', authRequired: true },
      { method: 'GET', path: '/api/v1/discussion-forum/{id}', description: 'Get thread details', permission: 'discussion-forum.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/discussion-forum/{id}', description: 'Update thread', permission: 'discussion-forum.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/discussion-forum/{id}', description: 'Delete thread', permission: 'discussion-forum.delete', authRequired: true }
    ],
    services: ['ForumService', 'ForumModerationService'],
    events: ['ThreadCreated', 'ThreadReplied', 'ThreadLocked'],
    jobs: ['ModerateForumPostsJob'],
    dependencies: [1],
    tests: ['ForumCrudTest', 'ForumModerationTest']
  }),
  buildModule({
    id: 622,
    name: 'Event RSVP Management',
    slug: 'event-rsvp-management',
    category: 'Community & Social',
    phase: 30,
    iconName: 'ClipboardList',
    purpose: 'Manage event RSVPs, attendance tracking, and guest list organization.',
    responsibilities: [
      'Track RSVP responses for events',
      'Manage guest lists and capacity',
      'Send RSVP confirmations and reminders'
    ],
    tableName: 'event_rsvps',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'name', type: 'VARCHAR(255)', nullable: false },
      { name: 'status', type: 'ENUM("pending","confirmed","declined","waitlisted")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/event-rsvp-management', description: 'Create RSVP', permission: 'event-rsvp-management.create', authRequired: true },
      { method: 'GET', path: '/api/v1/event-rsvp-management', description: 'List all RSVPs', permission: 'event-rsvp-management.view', authRequired: true },
      { method: 'GET', path: '/api/v1/event-rsvp-management/{id}', description: 'Get RSVP details', permission: 'event-rsvp-management.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/event-rsvp-management/{id}', description: 'Update RSVP', permission: 'event-rsvp-management.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/event-rsvp-management/{id}', description: 'Cancel RSVP', permission: 'event-rsvp-management.delete', authRequired: true }
    ],
    services: ['EventRsvpService', 'GuestListService'],
    events: ['RsvpCreated', 'RsvpConfirmed', 'RsvpCancelled'],
    jobs: ['SendRsvpReminderJob'],
    dependencies: [1],
    tests: ['RsvpCrudTest', 'GuestListTest']
  }),
  buildModule({
    id: 623,
    name: 'Waiting List Management',
    slug: 'waiting-list-management',
    category: 'Booking & Services',
    phase: 30,
    iconName: 'Hourglass',
    purpose: 'Manage waiting lists for events, products, or services with automated notifications.',
    responsibilities: [
      'Add and manage waiting list entries',
      'Track position and priority in queue',
      'Notify users when spots become available'
    ],
    tableName: 'waiting_lists',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'name', type: 'VARCHAR(255)', nullable: false },
      { name: 'status', type: 'ENUM("waiting","notified","converted","expired")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/waiting-list-management', description: 'Join waiting list', permission: 'waiting-list-management.create', authRequired: true },
      { method: 'GET', path: '/api/v1/waiting-list-management', description: 'List all entries', permission: 'waiting-list-management.view', authRequired: true },
      { method: 'GET', path: '/api/v1/waiting-list-management/{id}', description: 'Get entry details', permission: 'waiting-list-management.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/waiting-list-management/{id}', description: 'Update entry', permission: 'waiting-list-management.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/waiting-list-management/{id}', description: 'Remove from list', permission: 'waiting-list-management.delete', authRequired: true }
    ],
    services: ['WaitingListService', 'WaitlistNotificationService'],
    events: ['WaitingListJoined', 'WaitingListNotified', 'WaitingListConverted'],
    jobs: ['ProcessWaitlistJob'],
    dependencies: [1],
    tests: ['WaitingListCrudTest', 'WaitlistNotificationTest']
  }),
  buildModule({
    id: 624,
    name: 'Expense Split Management',
    slug: 'expense-split-management',
    category: 'Financial',
    phase: 30,
    iconName: 'Split',
    purpose: 'Track and split shared expenses among groups with balance calculations.',
    responsibilities: [
      'Record shared expenses and splits',
      'Calculate balances between members',
      'Track settlements and payments'
    ],
    tableName: 'expense_splits',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'name', type: 'VARCHAR(255)', nullable: false },
      { name: 'status', type: 'ENUM("pending","settled","disputed")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/expense-split-management', description: 'Create expense split', permission: 'expense-split-management.create', authRequired: true },
      { method: 'GET', path: '/api/v1/expense-split-management', description: 'List all splits', permission: 'expense-split-management.view', authRequired: true },
      { method: 'GET', path: '/api/v1/expense-split-management/{id}', description: 'Get split details', permission: 'expense-split-management.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/expense-split-management/{id}', description: 'Update split', permission: 'expense-split-management.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/expense-split-management/{id}', description: 'Delete split', permission: 'expense-split-management.delete', authRequired: true }
    ],
    services: ['ExpenseSplitService', 'BalanceCalculationService'],
    events: ['ExpenseSplitCreated', 'ExpenseSplitSettled', 'ExpenseSplitDisputed'],
    jobs: ['RecalculateBalancesJob'],
    dependencies: [1],
    tests: ['ExpenseSplitCrudTest', 'BalanceCalculationTest']
  }),
  buildModule({
    id: 625,
    name: 'Group Management',
    slug: 'group-management',
    category: 'Community & Social',
    phase: 30,
    iconName: 'UsersRound',
    purpose: 'Create and manage user groups with membership and permission controls.',
    responsibilities: [
      'Create and configure user groups',
      'Manage group memberships and roles',
      'Control group permissions and access'
    ],
    tableName: 'user_groups',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'name', type: 'VARCHAR(255)', nullable: false },
      { name: 'status', type: 'ENUM("active","inactive","archived")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/group-management', description: 'Create new group', permission: 'group-management.create', authRequired: true },
      { method: 'GET', path: '/api/v1/group-management', description: 'List all groups', permission: 'group-management.view', authRequired: true },
      { method: 'GET', path: '/api/v1/group-management/{id}', description: 'Get group details', permission: 'group-management.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/group-management/{id}', description: 'Update group', permission: 'group-management.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/group-management/{id}', description: 'Delete group', permission: 'group-management.delete', authRequired: true }
    ],
    services: ['GroupService', 'GroupMembershipService'],
    events: ['GroupCreated', 'MemberAdded', 'MemberRemoved'],
    jobs: ['SyncGroupPermissionsJob'],
    dependencies: [1],
    tests: ['GroupCrudTest', 'GroupMembershipTest']
  }),
  buildModule({
    id: 626,
    name: 'Event Management',
    slug: 'event-management',
    category: 'Booking & Services',
    phase: 30,
    iconName: 'CalendarDays',
    purpose: 'Create, schedule, and manage events with attendees and logistics.',
    responsibilities: [
      'Create and manage event details',
      'Handle event scheduling and capacity',
      'Track event attendance and feedback'
    ],
    tableName: 'events',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'title', type: 'VARCHAR(255)', nullable: false },
      { name: 'status', type: 'ENUM("draft","published","cancelled","completed")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/event-management', description: 'Create new event', permission: 'event-management.create', authRequired: true },
      { method: 'GET', path: '/api/v1/event-management', description: 'List all events', permission: 'event-management.view', authRequired: true },
      { method: 'GET', path: '/api/v1/event-management/{id}', description: 'Get event details', permission: 'event-management.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/event-management/{id}', description: 'Update event', permission: 'event-management.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/event-management/{id}', description: 'Delete event', permission: 'event-management.delete', authRequired: true }
    ],
    services: ['EventService', 'EventLogisticsService'],
    events: ['EventCreated', 'EventPublished', 'EventCancelled'],
    jobs: ['SendEventRemindersJob'],
    dependencies: [1],
    tests: ['EventCrudTest', 'EventSchedulingTest']
  }),
  buildModule({
    id: 627,
    name: 'Forum Management',
    slug: 'forum-management',
    category: 'Community & Social',
    phase: 30,
    iconName: 'MessagesSquare',
    purpose: 'Manage forum categories, boards, and community discussions.',
    responsibilities: [
      'Create and organize forum categories',
      'Manage board settings and moderation',
      'Track forum activity and engagement'
    ],
    tableName: 'forum_boards',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'name', type: 'VARCHAR(255)', nullable: false },
      { name: 'status', type: 'ENUM("active","inactive","archived")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/forum-management', description: 'Create new forum board', permission: 'forum-management.create', authRequired: true },
      { method: 'GET', path: '/api/v1/forum-management', description: 'List all forum boards', permission: 'forum-management.view', authRequired: true },
      { method: 'GET', path: '/api/v1/forum-management/{id}', description: 'Get forum board details', permission: 'forum-management.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/forum-management/{id}', description: 'Update forum board', permission: 'forum-management.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/forum-management/{id}', description: 'Delete forum board', permission: 'forum-management.delete', authRequired: true }
    ],
    services: ['ForumBoardService', 'ForumStatsService'],
    events: ['ForumBoardCreated', 'ForumBoardUpdated', 'ForumBoardArchived'],
    jobs: ['UpdateForumStatsJob'],
    dependencies: [1],
    tests: ['ForumBoardCrudTest', 'ForumStatsTest']
  }),
  buildModule({
    id: 628,
    name: 'Announcement Board',
    slug: 'announcement-board',
    category: 'Communication',
    phase: 30,
    iconName: 'Megaphone',
    purpose: 'Create and display announcements with scheduling and targeting features.',
    responsibilities: [
      'Create and publish announcements',
      'Schedule announcement display periods',
      'Target announcements to specific audiences'
    ],
    tableName: 'announcements',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'title', type: 'VARCHAR(255)', nullable: false },
      { name: 'status', type: 'ENUM("draft","published","expired","archived")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/announcement-board', description: 'Create new announcement', permission: 'announcement-board.create', authRequired: true },
      { method: 'GET', path: '/api/v1/announcement-board', description: 'List all announcements', permission: 'announcement-board.view', authRequired: true },
      { method: 'GET', path: '/api/v1/announcement-board/{id}', description: 'Get announcement details', permission: 'announcement-board.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/announcement-board/{id}', description: 'Update announcement', permission: 'announcement-board.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/announcement-board/{id}', description: 'Delete announcement', permission: 'announcement-board.delete', authRequired: true }
    ],
    services: ['AnnouncementService', 'AnnouncementTargetingService'],
    events: ['AnnouncementPublished', 'AnnouncementExpired', 'AnnouncementArchived'],
    jobs: ['ExpireAnnouncementsJob'],
    dependencies: [1],
    tests: ['AnnouncementCrudTest', 'AnnouncementSchedulingTest']
  }),
  buildModule({
    id: 629,
    name: 'Quick Note Management',
    slug: 'quick-note-management',
    category: 'Operations & Productivity',
    phase: 30,
    iconName: 'StickyNote',
    purpose: 'Create and manage quick notes for rapid idea capture and organization.',
    responsibilities: [
      'Create and edit quick notes',
      'Organize notes with tags and folders',
      'Search and retrieve notes quickly'
    ],
    tableName: 'quick_notes',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'title', type: 'VARCHAR(255)', nullable: false },
      { name: 'status', type: 'ENUM("draft","pinned","archived")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/quick-note-management', description: 'Create new note', permission: 'quick-note-management.create', authRequired: true },
      { method: 'GET', path: '/api/v1/quick-note-management', description: 'List all notes', permission: 'quick-note-management.view', authRequired: true },
      { method: 'GET', path: '/api/v1/quick-note-management/{id}', description: 'Get note details', permission: 'quick-note-management.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/quick-note-management/{id}', description: 'Update note', permission: 'quick-note-management.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/quick-note-management/{id}', description: 'Delete note', permission: 'quick-note-management.delete', authRequired: true }
    ],
    services: ['QuickNoteService', 'NoteSearchService'],
    events: ['QuickNoteCreated', 'QuickNoteUpdated', 'QuickNoteArchived'],
    jobs: ['IndexQuickNoteJob'],
    dependencies: [1],
    tests: ['QuickNoteCrudTest', 'QuickNoteSearchTest']
  }),
  buildModule({
    id: 630,
    name: 'Expense Report Management',
    slug: 'expense-report-management',
    category: 'Financial',
    phase: 30,
    iconName: 'FileSpreadsheet',
    purpose: 'Create, submit, and approve expense reports with receipt management.',
    responsibilities: [
      'Submit expense reports with line items',
      'Manage approval workflows',
      'Track expense report status and reimbursements'
    ],
    tableName: 'expense_reports',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'title', type: 'VARCHAR(255)', nullable: false },
      { name: 'status', type: 'ENUM("draft","submitted","approved","rejected","reimbursed")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/expense-report-management', description: 'Create expense report', permission: 'expense-report-management.create', authRequired: true },
      { method: 'GET', path: '/api/v1/expense-report-management', description: 'List all expense reports', permission: 'expense-report-management.view', authRequired: true },
      { method: 'GET', path: '/api/v1/expense-report-management/{id}', description: 'Get expense report details', permission: 'expense-report-management.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/expense-report-management/{id}', description: 'Update expense report', permission: 'expense-report-management.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/expense-report-management/{id}', description: 'Delete expense report', permission: 'expense-report-management.delete', authRequired: true }
    ],
    services: ['ExpenseReportService', 'ExpenseApprovalService'],
    events: ['ExpenseReportSubmitted', 'ExpenseReportApproved', 'ExpenseReportRejected'],
    jobs: ['ProcessExpenseReportJob'],
    dependencies: [1],
    tests: ['ExpenseReportCrudTest', 'ExpenseApprovalTest']
  }),
  buildModule({
    id: 631,
    name: 'Project Milestone',
    slug: 'project-milestone',
    category: 'Operations & Productivity',
    phase: 30,
    iconName: 'Milestone',
    purpose: 'Define and track project milestones with deadlines and completion status.',
    responsibilities: [
      'Create and manage project milestones',
      'Track milestone progress and deadlines',
      'Link milestones to project deliverables'
    ],
    tableName: 'project_milestones',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'name', type: 'VARCHAR(255)', nullable: false },
      { name: 'status', type: 'ENUM("pending","in_progress","completed","overdue")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/project-milestone', description: 'Create new milestone', permission: 'project-milestone.create', authRequired: true },
      { method: 'GET', path: '/api/v1/project-milestone', description: 'List all milestones', permission: 'project-milestone.view', authRequired: true },
      { method: 'GET', path: '/api/v1/project-milestone/{id}', description: 'Get milestone details', permission: 'project-milestone.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/project-milestone/{id}', description: 'Update milestone', permission: 'project-milestone.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/project-milestone/{id}', description: 'Delete milestone', permission: 'project-milestone.delete', authRequired: true }
    ],
    services: ['MilestoneService', 'MilestoneTrackingService'],
    events: ['MilestoneCreated', 'MilestoneCompleted', 'MilestoneOverdue'],
    jobs: ['CheckMilestoneDeadlinesJob'],
    dependencies: [1],
    tests: ['MilestoneCrudTest', 'MilestoneTrackingTest']
  }),
  buildModule({
    id: 632,
    name: 'Project Task',
    slug: 'project-task',
    category: 'Operations & Productivity',
    phase: 30,
    iconName: 'CheckCircle2',
    purpose: 'Create and manage project tasks with assignments and progress tracking.',
    responsibilities: [
      'Create and assign project tasks',
      'Track task status and progress',
      'Manage task dependencies and deadlines'
    ],
    tableName: 'project_tasks',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'title', type: 'VARCHAR(255)', nullable: false },
      { name: 'status', type: 'ENUM("todo","in_progress","review","done","archived")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/project-task', description: 'Create new task', permission: 'project-task.create', authRequired: true },
      { method: 'GET', path: '/api/v1/project-task', description: 'List all tasks', permission: 'project-task.view', authRequired: true },
      { method: 'GET', path: '/api/v1/project-task/{id}', description: 'Get task details', permission: 'project-task.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/project-task/{id}', description: 'Update task', permission: 'project-task.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/project-task/{id}', description: 'Delete task', permission: 'project-task.delete', authRequired: true }
    ],
    services: ['ProjectTaskService', 'TaskAssignmentService'],
    events: ['TaskCreated', 'TaskAssigned', 'TaskCompleted'],
    jobs: ['CheckOverdueTasksJob'],
    dependencies: [1],
    tests: ['ProjectTaskCrudTest', 'TaskAssignmentTest']
  }),
  buildModule({
    id: 633,
    name: 'Project Board',
    slug: 'project-board',
    category: 'Operations & Productivity',
    phase: 30,
    iconName: 'LayoutGrid',
    purpose: 'Manage project boards with columns, cards, and drag-drop workflow support.',
    responsibilities: [
      'Create and configure project boards',
      'Manage board columns and card placement',
      'Track workflow status across columns'
    ],
    tableName: 'project_boards',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'name', type: 'VARCHAR(255)', nullable: false },
      { name: 'status', type: 'ENUM("active","archived")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/project-board', description: 'Create new board', permission: 'project-board.create', authRequired: true },
      { method: 'GET', path: '/api/v1/project-board', description: 'List all boards', permission: 'project-board.view', authRequired: true },
      { method: 'GET', path: '/api/v1/project-board/{id}', description: 'Get board details', permission: 'project-board.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/project-board/{id}', description: 'Update board', permission: 'project-board.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/project-board/{id}', description: 'Delete board', permission: 'project-board.delete', authRequired: true }
    ],
    services: ['ProjectBoardService', 'BoardWorkflowService'],
    events: ['BoardCreated', 'BoardUpdated', 'BoardArchived'],
    jobs: ['SyncBoardCardsJob'],
    dependencies: [1],
    tests: ['ProjectBoardCrudTest', 'BoardWorkflowTest']
  }),
  buildModule({
    id: 634,
    name: 'Template Management',
    slug: 'template-management',
    category: 'Operations & Productivity',
    phase: 30,
    iconName: 'LayoutTemplate',
    purpose: 'Create and manage reusable templates for documents, emails, and workflows.',
    responsibilities: [
      'Create and store template definitions',
      'Manage template variables and placeholders',
      'Version and archive templates'
    ],
    tableName: 'templates',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'name', type: 'VARCHAR(255)', nullable: false },
      { name: 'status', type: 'ENUM("draft","active","archived")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/template-management', description: 'Create new template', permission: 'template-management.create', authRequired: true },
      { method: 'GET', path: '/api/v1/template-management', description: 'List all templates', permission: 'template-management.view', authRequired: true },
      { method: 'GET', path: '/api/v1/template-management/{id}', description: 'Get template details', permission: 'template-management.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/template-management/{id}', description: 'Update template', permission: 'template-management.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/template-management/{id}', description: 'Delete template', permission: 'template-management.delete', authRequired: true }
    ],
    services: ['TemplateService', 'TemplateRendererService'],
    events: ['TemplateCreated', 'TemplateUpdated', 'TemplateArchived'],
    jobs: ['ValidateTemplateSyntaxJob'],
    dependencies: [1],
    tests: ['TemplateCrudTest', 'TemplateRenderTest']
  }),
  buildModule({
    id: 635,
    name: 'Workflow Management',
    slug: 'workflow-management',
    category: 'Operations & Productivity',
    phase: 30,
    iconName: 'GitBranch',
    purpose: 'Design and automate business workflows with steps, triggers, and conditions.',
    responsibilities: [
      'Design workflow definitions with steps',
      'Configure triggers and conditions',
      'Track workflow execution and history'
    ],
    tableName: 'workflows',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'name', type: 'VARCHAR(255)', nullable: false },
      { name: 'status', type: 'ENUM("draft","active","paused","archived")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/workflow-management', description: 'Create new workflow', permission: 'workflow-management.create', authRequired: true },
      { method: 'GET', path: '/api/v1/workflow-management', description: 'List all workflows', permission: 'workflow-management.view', authRequired: true },
      { method: 'GET', path: '/api/v1/workflow-management/{id}', description: 'Get workflow details', permission: 'workflow-management.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/workflow-management/{id}', description: 'Update workflow', permission: 'workflow-management.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/workflow-management/{id}', description: 'Delete workflow', permission: 'workflow-management.delete', authRequired: true }
    ],
    services: ['WorkflowService', 'WorkflowEngineService'],
    events: ['WorkflowCreated', 'WorkflowActivated', 'WorkflowExecuted'],
    jobs: ['ExecuteWorkflowJob', 'AuditWorkflowRunsJob'],
    dependencies: [1],
    tests: ['WorkflowCrudTest', 'WorkflowExecutionTest']
  }),
  buildModule({
    id: 636,
    name: 'Approval Chain Management',
    slug: 'approval-chain-management',
    category: 'System & Governance',
    phase: 30,
    iconName: 'Workflow',
    purpose: 'Define and manage multi-level approval chains for processes and requests.',
    responsibilities: [
      'Define approval chain configurations',
      'Route requests through approval steps',
      'Track approval status and history'
    ],
    tableName: 'approval_chains',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'name', type: 'VARCHAR(255)', nullable: false },
      { name: 'status', type: 'ENUM("draft","active","inactive","archived")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/approval-chain-management', description: 'Create approval chain', permission: 'approval-chain-management.create', authRequired: true },
      { method: 'GET', path: '/api/v1/approval-chain-management', description: 'List all approval chains', permission: 'approval-chain-management.view', authRequired: true },
      { method: 'GET', path: '/api/v1/approval-chain-management/{id}', description: 'Get approval chain details', permission: 'approval-chain-management.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/approval-chain-management/{id}', description: 'Update approval chain', permission: 'approval-chain-management.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/approval-chain-management/{id}', description: 'Delete approval chain', permission: 'approval-chain-management.delete', authRequired: true }
    ],
    services: ['ApprovalChainService', 'ApprovalRoutingService'],
    events: ['ApprovalChainCreated', 'ApprovalStepCompleted', 'ApprovalChainFinished'],
    jobs: ['ProcessApprovalQueueJob'],
    dependencies: [1],
    tests: ['ApprovalChainCrudTest', 'ApprovalRoutingTest']
  }),
  buildModule({
    id: 637,
    name: 'Checklist Management',
    slug: 'checklist-management',
    category: 'Operations & Productivity',
    phase: 30,
    iconName: 'ListChecks',
    purpose: 'Create and manage checklists with items, completion tracking, and templates.',
    responsibilities: [
      'Create checklists with ordered items',
      'Track checklist completion progress',
      'Save checklists as reusable templates'
    ],
    tableName: 'checklists',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'name', type: 'VARCHAR(255)', nullable: false },
      { name: 'status', type: 'ENUM("draft","active","completed","archived")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/checklist-management', description: 'Create new checklist', permission: 'checklist-management.create', authRequired: true },
      { method: 'GET', path: '/api/v1/checklist-management', description: 'List all checklists', permission: 'checklist-management.view', authRequired: true },
      { method: 'GET', path: '/api/v1/checklist-management/{id}', description: 'Get checklist details', permission: 'checklist-management.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/checklist-management/{id}', description: 'Update checklist', permission: 'checklist-management.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/checklist-management/{id}', description: 'Delete checklist', permission: 'checklist-management.delete', authRequired: true }
    ],
    services: ['ChecklistService', 'ChecklistProgressService'],
    events: ['ChecklistCreated', 'ChecklistCompleted', 'ChecklistItemChecked'],
    jobs: ['TrackChecklistProgressJob'],
    dependencies: [1],
    tests: ['ChecklistCrudTest', 'ChecklistProgressTest']
  }),
  buildModule({
    id: 638,
    name: 'Knowledge Base',
    slug: 'knowledge-base',
    category: 'EdTech & Learning',
    phase: 30,
    iconName: 'BookMarked',
    purpose: 'Organize and manage knowledge base articles with search and categorization.',
    responsibilities: [
      'Create and edit knowledge base articles',
      'Organize articles by category and tags',
      'Provide search and suggestion features'
    ],
    tableName: 'knowledge_base_articles',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'title', type: 'VARCHAR(255)', nullable: false },
      { name: 'status', type: 'ENUM("draft","published","archived")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/knowledge-base', description: 'Create new article', permission: 'knowledge-base.create', authRequired: true },
      { method: 'GET', path: '/api/v1/knowledge-base', description: 'List all articles', permission: 'knowledge-base.view', authRequired: true },
      { method: 'GET', path: '/api/v1/knowledge-base/{id}', description: 'Get article details', permission: 'knowledge-base.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/knowledge-base/{id}', description: 'Update article', permission: 'knowledge-base.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/knowledge-base/{id}', description: 'Delete article', permission: 'knowledge-base.delete', authRequired: true }
    ],
    services: ['KnowledgeBaseService', 'ArticleSearchService'],
    events: ['ArticleCreated', 'ArticlePublished', 'ArticleArchived'],
    jobs: ['IndexKnowledgeBaseJob'],
    dependencies: [1],
    tests: ['KnowledgeBaseCrudTest', 'ArticleSearchTest']
  }),
  buildModule({
    id: 639,
    name: 'Document Versioning',
    slug: 'document-versioning',
    category: 'Operations & Productivity',
    phase: 30,
    iconName: 'GitCommitHorizontal',
    purpose: 'Track document versions with change history and rollback capabilities.',
    responsibilities: [
      'Store document versions with metadata',
      'Track changes between versions',
      'Support version comparison and rollback'
    ],
    tableName: 'document_versions',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'title', type: 'VARCHAR(255)', nullable: false },
      { name: 'status', type: 'ENUM("draft","current","archived")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/document-versioning', description: 'Create new version', permission: 'document-versioning.create', authRequired: true },
      { method: 'GET', path: '/api/v1/document-versioning', description: 'List all versions', permission: 'document-versioning.view', authRequired: true },
      { method: 'GET', path: '/api/v1/document-versioning/{id}', description: 'Get version details', permission: 'document-versioning.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/document-versioning/{id}', description: 'Update version', permission: 'document-versioning.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/document-versioning/{id}', description: 'Delete version', permission: 'document-versioning.delete', authRequired: true }
    ],
    services: ['DocumentVersionService', 'VersionDiffService'],
    events: ['VersionCreated', 'VersionPromoted', 'VersionArchived'],
    jobs: ['GenerateVersionDiffJob'],
    dependencies: [1],
    tests: ['DocumentVersionCrudTest', 'VersionDiffTest']
  }),
  buildModule({
    id: 640,
    name: 'Activity Log',
    slug: 'activity-log',
    category: 'System & Governance',
    phase: 30,
    iconName: 'Activity',
    purpose: 'Record and query system activity logs for audit trails and debugging.',
    responsibilities: [
      'Record user and system activity events',
      'Store activity details with timestamps',
      'Provide activity search and filtering'
    ],
    tableName: 'activity_logs',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'event', type: 'VARCHAR(255)', nullable: false },
      { name: 'status', type: 'ENUM("success","failure","warning")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/activity-log', description: 'Record activity event', permission: 'activity-log.create', authRequired: true },
      { method: 'GET', path: '/api/v1/activity-log', description: 'List activity logs', permission: 'activity-log.view', authRequired: true },
      { method: 'GET', path: '/api/v1/activity-log/{id}', description: 'Get activity details', permission: 'activity-log.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/activity-log/{id}', description: 'Update activity record', permission: 'activity-log.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/activity-log/{id}', description: 'Delete activity record', permission: 'activity-log.delete', authRequired: true }
    ],
    services: ['ActivityLogService', 'ActivitySearchService'],
    events: ['ActivityRecorded', 'ActivityPurged'],
    jobs: ['ArchiveOldActivityLogsJob'],
    dependencies: [1],
    tests: ['ActivityLogCrudTest', 'ActivitySearchTest']
  }),
  buildModule({
    id: 641,
    name: 'Data Export',
    slug: 'data-export',
    category: 'System & Governance',
    phase: 30,
    iconName: 'Download',
    purpose: 'Export data in various formats with scheduling and delivery options.',
    responsibilities: [
      'Configure and run data exports',
      'Support CSV, JSON, and Excel formats',
      'Schedule recurring exports and deliveries'
    ],
    tableName: 'data_exports',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'name', type: 'VARCHAR(255)', nullable: false },
      { name: 'status', type: 'ENUM("pending","processing","completed","failed")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/data-export', description: 'Create new export', permission: 'data-export.create', authRequired: true },
      { method: 'GET', path: '/api/v1/data-export', description: 'List all exports', permission: 'data-export.view', authRequired: true },
      { method: 'GET', path: '/api/v1/data-export/{id}', description: 'Get export details', permission: 'data-export.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/data-export/{id}', description: 'Update export', permission: 'data-export.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/data-export/{id}', description: 'Delete export', permission: 'data-export.delete', authRequired: true }
    ],
    services: ['DataExportService', 'ExportFileService'],
    events: ['ExportCreated', 'ExportCompleted', 'ExportFailed'],
    jobs: ['ProcessDataExportJob'],
    dependencies: [1],
    tests: ['DataExportCrudTest', 'ExportFormatTest']
  }),
  buildModule({
    id: 642,
    name: 'Import Management',
    slug: 'import-management',
    category: 'System & Governance',
    phase: 30,
    iconName: 'Upload',
    purpose: 'Import data from external sources with validation and error handling.',
    responsibilities: [
      'Upload and parse import files',
      'Validate data against schemas',
      'Track import progress and errors'
    ],
    tableName: 'imports',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'name', type: 'VARCHAR(255)', nullable: false },
      { name: 'status', type: 'ENUM("pending","processing","completed","failed")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/import-management', description: 'Create new import', permission: 'import-management.create', authRequired: true },
      { method: 'GET', path: '/api/v1/import-management', description: 'List all imports', permission: 'import-management.view', authRequired: true },
      { method: 'GET', path: '/api/v1/import-management/{id}', description: 'Get import details', permission: 'import-management.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/import-management/{id}', description: 'Update import', permission: 'import-management.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/import-management/{id}', description: 'Delete import', permission: 'import-management.delete', authRequired: true }
    ],
    services: ['ImportService', 'ImportValidationService'],
    events: ['ImportCreated', 'ImportCompleted', 'ImportFailed'],
    jobs: ['ProcessDataImportJob'],
    dependencies: [1],
    tests: ['ImportCrudTest', 'ImportValidationTest']
  }),
  buildModule({
    id: 643,
    name: 'Permission Group Management',
    slug: 'permission-group-management',
    category: 'System & Governance',
    phase: 30,
    iconName: 'Shield',
    purpose: 'Manage permission groups and role-based access control configurations.',
    responsibilities: [
      'Create and configure permission groups',
      'Assign permissions to roles',
      'Manage group membership and access levels'
    ],
    tableName: 'permission_groups',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'name', type: 'VARCHAR(255)', nullable: false },
      { name: 'status', type: 'ENUM("active","inactive","archived")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/permission-group-management', description: 'Create permission group', permission: 'permission-group-management.create', authRequired: true },
      { method: 'GET', path: '/api/v1/permission-group-management', description: 'List all permission groups', permission: 'permission-group-management.view', authRequired: true },
      { method: 'GET', path: '/api/v1/permission-group-management/{id}', description: 'Get permission group details', permission: 'permission-group-management.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/permission-group-management/{id}', description: 'Update permission group', permission: 'permission-group-management.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/permission-group-management/{id}', description: 'Delete permission group', permission: 'permission-group-management.delete', authRequired: true }
    ],
    services: ['PermissionGroupService', 'RoleAssignmentService'],
    events: ['PermissionGroupCreated', 'PermissionsUpdated', 'GroupDeactivated'],
    jobs: ['SyncPermissionCacheJob'],
    dependencies: [1],
    tests: ['PermissionGroupCrudTest', 'RoleAssignmentTest']
  }),
  buildModule({
    id: 644,
    name: 'Tenant Management',
    slug: 'tenant-management',
    category: 'System & Governance',
    phase: 30,
    iconName: 'Building2',
    purpose: 'Manage multi-tenant configurations, settings, and isolation policies.',
    responsibilities: [
      'Create and configure tenant environments',
      'Manage tenant-specific settings',
      'Handle tenant provisioning and deprovisioning'
    ],
    tableName: 'tenants',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'name', type: 'VARCHAR(255)', nullable: false },
      { name: 'status', type: 'ENUM("active","suspended","archived")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/tenant-management', description: 'Create new tenant', permission: 'tenant-management.create', authRequired: true },
      { method: 'GET', path: '/api/v1/tenant-management', description: 'List all tenants', permission: 'tenant-management.view', authRequired: true },
      { method: 'GET', path: '/api/v1/tenant-management/{id}', description: 'Get tenant details', permission: 'tenant-management.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/tenant-management/{id}', description: 'Update tenant', permission: 'tenant-management.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/tenant-management/{id}', description: 'Deactivate tenant', permission: 'tenant-management.delete', authRequired: true }
    ],
    services: ['TenantService', 'TenantProvisioningService'],
    events: ['TenantCreated', 'TenantSuspended', 'TenantDeactivated'],
    jobs: ['ProvisionTenantJob', 'AuditTenantUsageJob'],
    dependencies: [1],
    tests: ['TenantCrudTest', 'TenantProvisioningTest']
  }),
  buildModule({
    id: 645,
    name: 'Service Catalog',
    slug: 'service-catalog',
    category: 'System & Governance',
    phase: 30,
    iconName: 'Store',
    purpose: 'Manage service catalog with offerings, SLAs, and pricing configurations.',
    responsibilities: [
      'Define service offerings and descriptions',
      'Manage SLA terms and pricing',
      'Track service usage and billing'
    ],
    tableName: 'service_catalog',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'name', type: 'VARCHAR(255)', nullable: false },
      { name: 'status', type: 'ENUM("draft","active","retired")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/service-catalog', description: 'Create new service', permission: 'service-catalog.create', authRequired: true },
      { method: 'GET', path: '/api/v1/service-catalog', description: 'List all services', permission: 'service-catalog.view', authRequired: true },
      { method: 'GET', path: '/api/v1/service-catalog/{id}', description: 'Get service details', permission: 'service-catalog.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/service-catalog/{id}', description: 'Update service', permission: 'service-catalog.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/service-catalog/{id}', description: 'Retire service', permission: 'service-catalog.delete', authRequired: true }
    ],
    services: ['ServiceCatalogService', 'ServicePricingService'],
    events: ['ServiceCreated', 'ServiceActivated', 'ServiceRetired'],
    jobs: ['UpdateServicePricingJob'],
    dependencies: [1],
    tests: ['ServiceCatalogCrudTest', 'ServicePricingTest']
  }),
  buildModule({
    id: 646,
    name: 'Config Management',
    slug: 'config-management',
    category: 'System & Governance',
    phase: 30,
    iconName: 'Settings',
    purpose: 'Manage system configuration settings with versioning and rollback support.',
    responsibilities: [
      'Store and retrieve configuration values',
      'Track configuration changes',
      'Support configuration rollback'
    ],
    tableName: 'config_settings',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'name', type: 'VARCHAR(255)', nullable: false },
      { name: 'status', type: 'ENUM("active","deprecated","archived")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/config-management', description: 'Create config setting', permission: 'config-management.create', authRequired: true },
      { method: 'GET', path: '/api/v1/config-management', description: 'List all config settings', permission: 'config-management.view', authRequired: true },
      { method: 'GET', path: '/api/v1/config-management/{id}', description: 'Get config details', permission: 'config-management.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/config-management/{id}', description: 'Update config', permission: 'config-management.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/config-management/{id}', description: 'Delete config', permission: 'config-management.delete', authRequired: true }
    ],
    services: ['ConfigService', 'ConfigVersionService'],
    events: ['ConfigCreated', 'ConfigUpdated', 'ConfigRolledBack'],
    jobs: ['AuditConfigChangesJob'],
    dependencies: [1],
    tests: ['ConfigCrudTest', 'ConfigVersionTest']
  }),
  buildModule({
    id: 647,
    name: 'Flag Management',
    slug: 'flag-management',
    category: 'System & Governance',
    phase: 30,
    iconName: 'Flag',
    purpose: 'Manage feature flags with targeting rules and gradual rollout controls.',
    responsibilities: [
      'Create and configure feature flags',
      'Define targeting rules and user segments',
      'Monitor flag performance and impact'
    ],
    tableName: 'feature_flags',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'name', type: 'VARCHAR(255)', nullable: false },
      { name: 'status', type: 'ENUM("inactive","active","archived")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/flag-management', description: 'Create feature flag', permission: 'flag-management.create', authRequired: true },
      { method: 'GET', path: '/api/v1/flag-management', description: 'List all feature flags', permission: 'flag-management.view', authRequired: true },
      { method: 'GET', path: '/api/v1/flag-management/{id}', description: 'Get flag details', permission: 'flag-management.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/flag-management/{id}', description: 'Update flag', permission: 'flag-management.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/flag-management/{id}', description: 'Delete flag', permission: 'flag-management.delete', authRequired: true }
    ],
    services: ['FlagService', 'FlagTargetingService'],
    events: ['FlagCreated', 'FlagToggled', 'FlagArchived'],
    jobs: ['EvaluateFlagImpactJob'],
    dependencies: [1],
    tests: ['FlagCrudTest', 'FlagTargetingTest']
  }),
  buildModule({
    id: 648,
    name: 'Localization',
    slug: 'localization',
    category: 'System & Governance',
    phase: 30,
    iconName: 'Languages',
    purpose: 'Manage translations, language packs, and localization settings.',
    responsibilities: [
      'Store and manage translation strings',
      'Support multiple languages and locales',
      'Track translation completion status'
    ],
    tableName: 'localizations',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'name', type: 'VARCHAR(255)', nullable: false },
      { name: 'status', type: 'ENUM("draft","active","archived")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/localization', description: 'Create translation', permission: 'localization.create', authRequired: true },
      { method: 'GET', path: '/api/v1/localization', description: 'List all translations', permission: 'localization.view', authRequired: true },
      { method: 'GET', path: '/api/v1/localization/{id}', description: 'Get translation details', permission: 'localization.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/localization/{id}', description: 'Update translation', permission: 'localization.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/localization/{id}', description: 'Delete translation', permission: 'localization.delete', authRequired: true }
    ],
    services: ['LocalizationService', 'TranslationCacheService'],
    events: ['TranslationCreated', 'TranslationUpdated', 'LocaleChanged'],
    jobs: ['SyncTranslationCacheJob'],
    dependencies: [1],
    tests: ['LocalizationCrudTest', 'TranslationCacheTest']
  }),
  buildModule({
    id: 649,
    name: 'Email Subscription',
    slug: 'email-subscription',
    category: 'Communication',
    phase: 30,
    iconName: 'MailCheck',
    purpose: 'Manage email subscription lists with opt-in and opt-out tracking.',
    responsibilities: [
      'Manage email subscription lists',
      'Track subscriber preferences',
      'Handle subscription confirmations'
    ],
    tableName: 'email_subscriptions',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'name', type: 'VARCHAR(255)', nullable: false },
      { name: 'status', type: 'ENUM("active","unsubscribed","bounced")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/email-subscription', description: 'Create subscription', permission: 'email-subscription.create', authRequired: true },
      { method: 'GET', path: '/api/v1/email-subscription', description: 'List all subscriptions', permission: 'email-subscription.view', authRequired: true },
      { method: 'GET', path: '/api/v1/email-subscription/{id}', description: 'Get subscription details', permission: 'email-subscription.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/email-subscription/{id}', description: 'Update subscription', permission: 'email-subscription.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/email-subscription/{id}', description: 'Delete subscription', permission: 'email-subscription.delete', authRequired: true }
    ],
    services: ['EmailSubscriptionService', 'SubscriptionPreferenceService'],
    events: ['SubscriptionCreated', 'SubscriptionConfirmed', 'Unsubscribed'],
    jobs: ['SyncSubscriptionListJob'],
    dependencies: [1],
    tests: ['EmailSubscriptionCrudTest', 'SubscriptionPreferenceTest']
  }),
  buildModule({
    id: 650,
    name: 'SMS Notification',
    slug: 'sms-notification',
    category: 'Communication',
    phase: 30,
    iconName: 'Smartphone',
    purpose: 'Send and track SMS notifications with delivery status and analytics.',
    responsibilities: [
      'Send SMS notifications to users',
      'Track delivery status and failures',
      'Manage SMS templates and scheduling'
    ],
    tableName: 'sms_notifications',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'name', type: 'VARCHAR(255)', nullable: false },
      { name: 'status', type: 'ENUM("pending","sent","delivered","failed")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/sms-notification', description: 'Send SMS notification', permission: 'sms-notification.create', authRequired: true },
      { method: 'GET', path: '/api/v1/sms-notification', description: 'List all SMS notifications', permission: 'sms-notification.view', authRequired: true },
      { method: 'GET', path: '/api/v1/sms-notification/{id}', description: 'Get notification details', permission: 'sms-notification.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/sms-notification/{id}', description: 'Update notification', permission: 'sms-notification.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/sms-notification/{id}', description: 'Delete notification', permission: 'sms-notification.delete', authRequired: true }
    ],
    services: ['SmsNotificationService', 'SmsDeliveryService'],
    events: ['SmsSent', 'SmsDelivered', 'SmsFailed'],
    jobs: ['SendSmsNotificationJob', 'TrackSmsDeliveryJob'],
    dependencies: [1],
    tests: ['SmsNotificationCrudTest', 'SmsDeliveryTest']
  }),
  buildModule({
    id: 651,
    name: 'Push Notification',
    slug: 'push-notification',
    category: 'Communication',
    phase: 30,
    iconName: 'Bell',
    purpose: 'Send push notifications to mobile and web users with targeting and scheduling.',
    responsibilities: [
      'Send push notifications to devices',
      'Manage notification templates',
      'Track delivery and engagement metrics'
    ],
    tableName: 'push_notifications',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'title', type: 'VARCHAR(255)', nullable: false },
      { name: 'status', type: 'ENUM("draft","scheduled","sent","failed")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/push-notification', description: 'Create push notification', permission: 'push-notification.create', authRequired: true },
      { method: 'GET', path: '/api/v1/push-notification', description: 'List all push notifications', permission: 'push-notification.view', authRequired: true },
      { method: 'GET', path: '/api/v1/push-notification/{id}', description: 'Get notification details', permission: 'push-notification.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/push-notification/{id}', description: 'Update notification', permission: 'push-notification.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/push-notification/{id}', description: 'Delete notification', permission: 'push-notification.delete', authRequired: true }
    ],
    services: ['PushNotificationService', 'PushDeliveryService'],
    events: ['PushNotificationCreated', 'PushNotificationSent', 'PushNotificationFailed'],
    jobs: ['SendPushNotificationJob'],
    dependencies: [1],
    tests: ['PushNotificationCrudTest', 'PushDeliveryTest']
  }),
  buildModule({
    id: 652,
    name: 'Payment Processing',
    slug: 'payment-processing',
    category: 'Financial',
    phase: 30,
    iconName: 'CreditCard',
    purpose: 'Process payments with support for multiple gateways and transaction tracking.',
    responsibilities: [
      'Process payment transactions',
      'Support multiple payment gateways',
      'Track transaction status and history'
    ],
    tableName: 'payments',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'name', type: 'VARCHAR(255)', nullable: false },
      { name: 'status', type: 'ENUM("pending","processing","completed","failed","refunded")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/payment-processing', description: 'Process payment', permission: 'payment-processing.create', authRequired: true },
      { method: 'GET', path: '/api/v1/payment-processing', description: 'List all payments', permission: 'payment-processing.view', authRequired: true },
      { method: 'GET', path: '/api/v1/payment-processing/{id}', description: 'Get payment details', permission: 'payment-processing.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/payment-processing/{id}', description: 'Update payment', permission: 'payment-processing.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/payment-processing/{id}', description: 'Void payment', permission: 'payment-processing.delete', authRequired: true }
    ],
    services: ['PaymentService', 'PaymentGatewayService'],
    events: ['PaymentCreated', 'PaymentCompleted', 'PaymentFailed'],
    jobs: ['ProcessPaymentJob', 'ReconcilePaymentsJob'],
    dependencies: [1],
    tests: ['PaymentCrudTest', 'PaymentGatewayTest']
  }),
  buildModule({
    id: 653,
    name: 'Invoice Generation',
    slug: 'invoice-generation',
    category: 'Financial',
    phase: 30,
    iconName: 'FileText',
    purpose: 'Generate and manage invoices with line items and payment tracking.',
    responsibilities: [
      'Generate invoices from billing data',
      'Manage invoice status and payments',
      'Send invoices to customers'
    ],
    tableName: 'invoices',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'name', type: 'VARCHAR(255)', nullable: false },
      { name: 'status', type: 'ENUM("draft","sent","paid","overdue","cancelled")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/invoice-generation', description: 'Generate new invoice', permission: 'invoice-generation.create', authRequired: true },
      { method: 'GET', path: '/api/v1/invoice-generation', description: 'List all invoices', permission: 'invoice-generation.view', authRequired: true },
      { method: 'GET', path: '/api/v1/invoice-generation/{id}', description: 'Get invoice details', permission: 'invoice-generation.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/invoice-generation/{id}', description: 'Update invoice', permission: 'invoice-generation.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/invoice-generation/{id}', description: 'Cancel invoice', permission: 'invoice-generation.delete', authRequired: true }
    ],
    services: ['InvoiceService', 'InvoicePdfService'],
    events: ['InvoiceGenerated', 'InvoiceSent', 'InvoicePaid'],
    jobs: ['GenerateInvoicePdfJob', 'CheckOverdueInvoicesJob'],
    dependencies: [1],
    tests: ['InvoiceCrudTest', 'InvoicePdfTest']
  }),
  buildModule({
    id: 654,
    name: 'Payment Reminder',
    slug: 'payment-reminder',
    category: 'Financial',
    phase: 30,
    iconName: 'AlarmClock',
    purpose: 'Send payment reminders for overdue invoices and upcoming due dates.',
    responsibilities: [
      'Schedule and send payment reminders',
      'Track reminder delivery and responses',
      'Escalate overdue payments'
    ],
    tableName: 'payment_reminders',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'name', type: 'VARCHAR(255)', nullable: false },
      { name: 'status', type: 'ENUM("scheduled","sent","delivered","failed")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/payment-reminder', description: 'Create payment reminder', permission: 'payment-reminder.create', authRequired: true },
      { method: 'GET', path: '/api/v1/payment-reminder', description: 'List all reminders', permission: 'payment-reminder.view', authRequired: true },
      { method: 'GET', path: '/api/v1/payment-reminder/{id}', description: 'Get reminder details', permission: 'payment-reminder.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/payment-reminder/{id}', description: 'Update reminder', permission: 'payment-reminder.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/payment-reminder/{id}', description: 'Cancel reminder', permission: 'payment-reminder.delete', authRequired: true }
    ],
    services: ['PaymentReminderService', 'ReminderDeliveryService'],
    events: ['ReminderScheduled', 'ReminderSent', 'ReminderDelivered'],
    jobs: ['SendPaymentRemindersJob'],
    dependencies: [1],
    tests: ['PaymentReminderCrudTest', 'ReminderDeliveryTest']
  }),
  buildModule({
    id: 655,
    name: 'User Preference',
    slug: 'user-preference',
    category: 'System & Governance',
    phase: 30,
    iconName: 'SlidersHorizontal',
    purpose: 'Manage user preferences and settings for personalization.',
    responsibilities: [
      'Store user preference values',
      'Apply preferences across the platform',
      'Sync preferences across devices'
    ],
    tableName: 'user_preferences',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'name', type: 'VARCHAR(255)', nullable: false },
      { name: 'status', type: 'ENUM("active","inactive")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/user-preference', description: 'Set user preference', permission: 'user-preference.create', authRequired: true },
      { method: 'GET', path: '/api/v1/user-preference', description: 'List all preferences', permission: 'user-preference.view', authRequired: true },
      { method: 'GET', path: '/api/v1/user-preference/{id}', description: 'Get preference details', permission: 'user-preference.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/user-preference/{id}', description: 'Update preference', permission: 'user-preference.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/user-preference/{id}', description: 'Reset preference', permission: 'user-preference.delete', authRequired: true }
    ],
    services: ['UserPreferenceService', 'PreferenceSyncService'],
    events: ['PreferenceCreated', 'PreferenceUpdated', 'PreferenceSynced'],
    jobs: ['SyncUserPreferencesJob'],
    dependencies: [1],
    tests: ['UserPreferenceCrudTest', 'PreferenceSyncTest']
  }),
  buildModule({
    id: 656,
    name: 'User Activity',
    slug: 'user-activity',
    category: 'System & Governance',
    phase: 30,
    iconName: 'Activity',
    purpose: 'Track user activity events for analytics, auditing, and engagement insights.',
    responsibilities: [
      'Record user activity events',
      'Aggregate activity metrics',
      'Provide activity-based insights'
    ],
    tableName: 'user_activities',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'event', type: 'VARCHAR(255)', nullable: false },
      { name: 'status', type: 'ENUM("recorded","processed","archived")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/user-activity', description: 'Record user activity', permission: 'user-activity.create', authRequired: true },
      { method: 'GET', path: '/api/v1/user-activity', description: 'List user activities', permission: 'user-activity.view', authRequired: true },
      { method: 'GET', path: '/api/v1/user-activity/{id}', description: 'Get activity details', permission: 'user-activity.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/user-activity/{id}', description: 'Update activity', permission: 'user-activity.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/user-activity/{id}', description: 'Delete activity', permission: 'user-activity.delete', authRequired: true }
    ],
    services: ['UserActivityService', 'ActivityAnalyticsService'],
    events: ['ActivityRecorded', 'ActivityProcessed', 'ActivityArchived'],
    jobs: ['AggregateUserActivityJob'],
    dependencies: [1],
    tests: ['UserActivityCrudTest', 'ActivityAnalyticsTest']
  }),
  buildModule({
    id: 657,
    name: 'User Session',
    slug: 'user-session',
    category: 'System & Governance',
    phase: 30,
    iconName: 'Monitor',
    purpose: 'Track and manage user sessions with device info and security controls.',
    responsibilities: [
      'Track active user sessions',
      'Manage session timeouts and revocations',
      'Record device and location data'
    ],
    tableName: 'user_sessions',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'name', type: 'VARCHAR(255)', nullable: false },
      { name: 'status', type: 'ENUM("active","expired","revoked")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/user-session', description: 'Create session', permission: 'user-session.create', authRequired: true },
      { method: 'GET', path: '/api/v1/user-session', description: 'List active sessions', permission: 'user-session.view', authRequired: true },
      { method: 'GET', path: '/api/v1/user-session/{id}', description: 'Get session details', permission: 'user-session.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/user-session/{id}', description: 'Update session', permission: 'user-session.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/user-session/{id}', description: 'Revoke session', permission: 'user-session.delete', authRequired: true }
    ],
    services: ['UserSessionService', 'SessionSecurityService'],
    events: ['SessionCreated', 'SessionRevoked', 'SessionExpired'],
    jobs: ['CleanupExpiredSessionsJob'],
    dependencies: [1],
    tests: ['UserSessionCrudTest', 'SessionSecurityTest']
  }),
  buildModule({
    id: 658,
    name: 'Password Policy',
    slug: 'password-policy',
    category: 'System & Governance',
    phase: 30,
    iconName: 'Lock',
    purpose: 'Manage password policies, strength rules, and expiration settings.',
    responsibilities: [
      'Define password complexity rules',
      'Enforce password expiration policies',
      'Track password change history'
    ],
    tableName: 'password_policies',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'name', type: 'VARCHAR(255)', nullable: false },
      { name: 'status', type: 'ENUM("active","inactive","archived")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/password-policy', description: 'Create password policy', permission: 'password-policy.create', authRequired: true },
      { method: 'GET', path: '/api/v1/password-policy', description: 'List all policies', permission: 'password-policy.view', authRequired: true },
      { method: 'GET', path: '/api/v1/password-policy/{id}', description: 'Get policy details', permission: 'password-policy.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/password-policy/{id}', description: 'Update policy', permission: 'password-policy.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/password-policy/{id}', description: 'Delete policy', permission: 'password-policy.delete', authRequired: true }
    ],
    services: ['PasswordPolicyService', 'PasswordValidationService'],
    events: ['PolicyCreated', 'PolicyUpdated', 'PolicyDeactivated'],
    jobs: ['EnforcePasswordExpirationJob'],
    dependencies: [1],
    tests: ['PasswordPolicyCrudTest', 'PasswordValidationTest']
  }),
  buildModule({
    id: 659,
    name: 'Rate Limiting',
    slug: 'rate-limiting',
    category: 'System & Governance',
    phase: 30,
    iconName: 'Gauge',
    purpose: 'Configure and enforce API rate limiting rules with quota management.',
    responsibilities: [
      'Define rate limiting rules per endpoint',
      'Track request counts and quotas',
      'Handle rate limit exceeded responses'
    ],
    tableName: 'rate_limits',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'name', type: 'VARCHAR(255)', nullable: false },
      { name: 'status', type: 'ENUM("active","inactive","archived")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/rate-limiting', description: 'Create rate limit rule', permission: 'rate-limiting.create', authRequired: true },
      { method: 'GET', path: '/api/v1/rate-limiting', description: 'List all rate limits', permission: 'rate-limiting.view', authRequired: true },
      { method: 'GET', path: '/api/v1/rate-limiting/{id}', description: 'Get rate limit details', permission: 'rate-limiting.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/rate-limiting/{id}', description: 'Update rate limit', permission: 'rate-limiting.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/rate-limiting/{id}', description: 'Delete rate limit', permission: 'rate-limiting.delete', authRequired: true }
    ],
    services: ['RateLimitService', 'RateLimitEnforcementService'],
    events: ['RateLimitCreated', 'RateLimitExceeded', 'RateLimitUpdated'],
    jobs: ['ResetRateLimitCountersJob'],
    dependencies: [1],
    tests: ['RateLimitCrudTest', 'RateLimitEnforcementTest']
  }),
  buildModule({
    id: 660,
    name: 'Login Attempt Tracking',
    slug: 'login-attempt-tracking',
    category: 'System & Governance',
    phase: 30,
    iconName: 'LogIn',
    purpose: 'Track login attempts for security monitoring and brute-force protection.',
    responsibilities: [
      'Record all login attempts',
      'Detect suspicious login patterns',
      'Enforce account lockout policies'
    ],
    tableName: 'login_attempts',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'event', type: 'VARCHAR(255)', nullable: false },
      { name: 'status', type: 'ENUM("success","failure","locked_out")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/login-attempt-tracking', description: 'Record login attempt', permission: 'login-attempt-tracking.create', authRequired: true },
      { method: 'GET', path: '/api/v1/login-attempt-tracking', description: 'List login attempts', permission: 'login-attempt-tracking.view', authRequired: true },
      { method: 'GET', path: '/api/v1/login-attempt-tracking/{id}', description: 'Get attempt details', permission: 'login-attempt-tracking.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/login-attempt-tracking/{id}', description: 'Update attempt', permission: 'login-attempt-tracking.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/login-attempt-tracking/{id}', description: 'Delete attempt', permission: 'login-attempt-tracking.delete', authRequired: true }
    ],
    services: ['LoginAttemptService', 'BruteForceProtectionService'],
    events: ['LoginAttemptRecorded', 'LoginSucceeded', 'LoginFailed'],
    jobs: ['MonitorLoginAttemptsJob', 'LockoutViolationsJob'],
    dependencies: [1],
    tests: ['LoginAttemptCrudTest', 'BruteForceProtectionTest']
  })
];
