import { buildModule } from './moduleBuilderHelper';

export const modulesDomain28_29 = [
  // DOMAIN 28: BASIC CRUD MODULES (541-570)
  buildModule({
    id: 541,
    name: 'Category Management',
    slug: 'category-management',
    category: 'Operations & Productivity',
    phase: 28,
    iconName: 'FolderTree',
    purpose: 'Hierarchical category organization for products, articles, and content classification.',
    responsibilities: [
      'Create, update, and organize hierarchical categories',
      'Manage parent-child category relationships',
      'Provide category-based content organization'
    ],
    tableName: 'categories',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'name', type: 'VARCHAR(255)', nullable: false },
      { name: 'slug', type: 'VARCHAR(255)', nullable: false, index: true },
      { name: 'description', type: 'TEXT', nullable: true },
      { name: 'parent_id', type: 'BIGINT UNSIGNED', nullable: true, index: true },
      { name: 'sort_order', type: 'INT', nullable: false },
      { name: 'is_active', type: 'BOOLEAN', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/category-management', description: 'Create new category', permission: 'category-management.create', authRequired: true },
      { method: 'GET', path: '/api/v1/category-management', description: 'List all categories', permission: 'category-management.view', authRequired: true },
      { method: 'GET', path: '/api/v1/category-management/{id}', description: 'Get category details', permission: 'category-management.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/category-management/{id}', description: 'Update category', permission: 'category-management.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/category-management/{id}', description: 'Delete category', permission: 'category-management.delete', authRequired: true }
    ],
    services: ['CategoryService', 'CategoryTreeService'],
    events: ['CategoryCreated', 'CategoryUpdated', 'CategoryDeleted'],
    jobs: ['RebuildCategoryTreeJob'],
    dependencies: [1],
    tests: ['CategoryHierarchyTest', 'CategoryCrudTest']
  }),
  buildModule({
    id: 542,
    name: 'Tag Management',
    slug: 'tag-management',
    category: 'Operations & Productivity',
    phase: 28,
    iconName: 'Tag',
    purpose: 'Flat tag system for content labeling, filtering, and search enhancement.',
    responsibilities: [
      'Create, update, and manage tags',
      'Associate tags with content entities',
      'Provide tag-based search and filtering'
    ],
    tableName: 'tags',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'name', type: 'VARCHAR(128)', nullable: false, index: true },
      { name: 'slug', type: 'VARCHAR(128)', nullable: false, index: true },
      { name: 'description', type: 'TEXT', nullable: true },
      { name: 'usage_count', type: 'INT UNSIGNED', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/tag-management', description: 'Create new tag', permission: 'tag-management.create', authRequired: true },
      { method: 'GET', path: '/api/v1/tag-management', description: 'List all tags', permission: 'tag-management.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/tag-management/{id}', description: 'Update tag', permission: 'tag-management.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/tag-management/{id}', description: 'Delete tag', permission: 'tag-management.delete', authRequired: true }
    ],
    services: ['TagService', 'TagIndexService'],
    events: ['TagCreated', 'TagUpdated', 'TagDeleted'],
    jobs: ['UpdateTagUsageCountJob'],
    dependencies: [1],
    tests: ['TagCrudTest', 'TagSearchTest']
  }),
  buildModule({
    id: 543,
    name: 'Note Management',
    slug: 'note-management',
    category: 'Operations & Productivity',
    phase: 28,
    iconName: 'StickyNote',
    purpose: 'Simple note-taking system for users to create and organize personal notes.',
    responsibilities: [
      'Create, update, and delete personal notes',
      'Organize notes with categories and tags',
      'Provide search and filtering capabilities'
    ],
    tableName: 'notes',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'user_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'title', type: 'VARCHAR(255)', nullable: false },
      { name: 'content', type: 'TEXT', nullable: false },
      { name: 'is_pinned', type: 'BOOLEAN', nullable: false },
      { name: 'status', type: 'ENUM("draft","published","archived")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/note-management', description: 'Create new note', permission: 'note-management.create', authRequired: true },
      { method: 'GET', path: '/api/v1/note-management', description: 'List my notes', permission: 'note-management.view', authRequired: true },
      { method: 'GET', path: '/api/v1/note-management/{id}', description: 'Get note details', permission: 'note-management.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/note-management/{id}', description: 'Update note', permission: 'note-management.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/note-management/{id}', description: 'Delete note', permission: 'note-management.delete', authRequired: true }
    ],
    services: ['NoteService', 'NoteSearchService'],
    events: ['NoteCreated', 'NoteUpdated', 'NoteDeleted'],
    jobs: ['IndexNoteForSearchJob'],
    dependencies: [1],
    tests: ['NoteCrudTest', 'NoteAuthorizationTest']
  }),
  buildModule({
    id: 544,
    name: 'Task Management',
    slug: 'task-management',
    category: 'Operations & Productivity',
    phase: 28,
    iconName: 'CheckSquare',
    purpose: 'Simple task tracking system for personal and team task management.',
    responsibilities: [
      'Create, assign, and track tasks',
      'Manage task priorities and deadlines',
      'Provide task status updates and completion tracking'
    ],
    tableName: 'tasks',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'user_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'title', type: 'VARCHAR(255)', nullable: false },
      { name: 'description', type: 'TEXT', nullable: true },
      { name: 'priority', type: 'ENUM("low","medium","high","urgent")', nullable: false },
      { name: 'status', type: 'ENUM("todo","in_progress","completed","cancelled")', nullable: false },
      { name: 'due_date', type: 'DATE', nullable: true },
      { name: 'completed_at', type: 'TIMESTAMP', nullable: true },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/task-management', description: 'Create new task', permission: 'task-management.create', authRequired: true },
      { method: 'GET', path: '/api/v1/task-management', description: 'List my tasks', permission: 'task-management.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/task-management/{id}', description: 'Update task', permission: 'task-management.manage', authRequired: true },
      { method: 'PATCH', path: '/api/v1/task-management/{id}/complete', description: 'Mark task as completed', permission: 'task-management.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/task-management/{id}', description: 'Delete task', permission: 'task-management.delete', authRequired: true }
    ],
    services: ['TaskService', 'TaskNotificationService'],
    events: ['TaskCreated', 'TaskCompleted', 'TaskOverdue'],
    jobs: ['CheckOverdueTasksJob', 'SendTaskRemindersJob'],
    dependencies: [1],
    tests: ['TaskCrudTest', 'TaskCompletionTest']
  }),
  buildModule({
    id: 545,
    name: 'Bookmark Management',
    slug: 'bookmark-management',
    category: 'Operations & Productivity',
    phase: 28,
    iconName: 'Bookmark',
    purpose: 'Personal bookmark system for saving and organizing URLs and references.',
    responsibilities: [
      'Save and organize bookmarks',
      'Categorize bookmarks with folders and tags',
      'Provide search and quick access to bookmarks'
    ],
    tableName: 'bookmarks',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'user_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'title', type: 'VARCHAR(255)', nullable: false },
      { name: 'url', type: 'VARCHAR(2048)', nullable: false },
      { name: 'description', type: 'TEXT', nullable: true },
      { name: 'folder', type: 'VARCHAR(128)', nullable: true },
      { name: 'favicon_url', type: 'VARCHAR(512)', nullable: true },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/bookmark-management', description: 'Save new bookmark', permission: 'bookmark-management.create', authRequired: true },
      { method: 'GET', path: '/api/v1/bookmark-management', description: 'List my bookmarks', permission: 'bookmark-management.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/bookmark-management/{id}', description: 'Update bookmark', permission: 'bookmark-management.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/bookmark-management/{id}', description: 'Delete bookmark', permission: 'bookmark-management.delete', authRequired: true }
    ],
    services: ['BookmarkService', 'BookmarkMetadataService'],
    events: ['BookmarkCreated', 'BookmarkUpdated', 'BookmarkDeleted'],
    jobs: ['FetchBookmarkMetadataJob'],
    dependencies: [1],
    tests: ['BookmarkCrudTest', 'BookmarkOrganizationTest']
  }),
  buildModule({
    id: 546,
    name: 'Calendar Event Management',
    slug: 'calendar-event-management',
    category: 'Operations & Productivity',
    phase: 28,
    iconName: 'Calendar',
    purpose: 'Simple calendar event system for scheduling and managing events.',
    responsibilities: [
      'Create, update, and delete calendar events',
      'Manage event reminders and notifications',
      'Provide calendar view and event listing'
    ],
    tableName: 'calendar_events',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'user_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'title', type: 'VARCHAR(255)', nullable: false },
      { name: 'description', type: 'TEXT', nullable: true },
      { name: 'start_time', type: 'DATETIME', nullable: false },
      { name: 'end_time', type: 'DATETIME', nullable: false },
      { name: 'location', type: 'VARCHAR(255)', nullable: true },
      { name: 'is_all_day', type: 'BOOLEAN', nullable: false },
      { name: 'reminder_minutes', type: 'INT', nullable: true },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/calendar-event-management', description: 'Create new event', permission: 'calendar-event-management.create', authRequired: true },
      { method: 'GET', path: '/api/v1/calendar-event-management', description: 'List my events', permission: 'calendar-event-management.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/calendar-event-management/{id}', description: 'Update event', permission: 'calendar-event-management.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/calendar-event-management/{id}', description: 'Delete event', permission: 'calendar-event-management.delete', authRequired: true }
    ],
    services: ['CalendarEventService', 'EventReminderService'],
    events: ['EventCreated', 'EventUpdated', 'EventReminderTriggered'],
    jobs: ['SendEventRemindersJob'],
    dependencies: [1],
    tests: ['CalendarEventCrudTest', 'EventReminderTest']
  }),
  buildModule({
    id: 547,
    name: 'Contact Management',
    slug: 'contact-management',
    category: 'Operations & Productivity',
    phase: 28,
    iconName: 'Contact',
    purpose: 'Personal contact book for managing contact information and details.',
    responsibilities: [
      'Create, update, and delete contacts',
      'Organize contacts with groups and labels',
      'Provide contact search and quick dial'
    ],
    tableName: 'contacts',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'user_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'first_name', type: 'VARCHAR(128)', nullable: false },
      { name: 'last_name', type: 'VARCHAR(128)', nullable: false },
      { name: 'email', type: 'VARCHAR(255)', nullable: true },
      { name: 'phone', type: 'VARCHAR(32)', nullable: true },
      { name: 'company', type: 'VARCHAR(255)', nullable: true },
      { name: 'job_title', type: 'VARCHAR(255)', nullable: true },
      { name: 'notes', type: 'TEXT', nullable: true },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/contact-management', description: 'Add new contact', permission: 'contact-management.create', authRequired: true },
      { method: 'GET', path: '/api/v1/contact-management', description: 'List my contacts', permission: 'contact-management.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/contact-management/{id}', description: 'Update contact', permission: 'contact-management.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/contact-management/{id}', description: 'Delete contact', permission: 'contact-management.delete', authRequired: true }
    ],
    services: ['ContactService', 'ContactSearchService'],
    events: ['ContactCreated', 'ContactUpdated', 'ContactDeleted'],
    jobs: ['IndexContactForSearchJob'],
    dependencies: [1],
    tests: ['ContactCrudTest', 'ContactSearchTest']
  }),
  buildModule({
    id: 548,
    name: 'File Management',
    slug: 'file-management',
    category: 'Operations & Productivity',
    phase: 28,
    iconName: 'File',
    purpose: 'Simple file upload and management system for storing and organizing files.',
    responsibilities: [
      'Upload and store files',
      'Organize files with folders and tags',
      'Provide file download and sharing capabilities'
    ],
    tableName: 'files',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'user_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'name', type: 'VARCHAR(255)', nullable: false },
      { name: 'original_name', type: 'VARCHAR(255)', nullable: false },
      { name: 'mime_type', type: 'VARCHAR(128)', nullable: false },
      { name: 'size', type: 'BIGINT UNSIGNED', nullable: false },
      { name: 'path', type: 'VARCHAR(2048)', nullable: false },
      { name: 'folder', type: 'VARCHAR(255)', nullable: true },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/file-management', description: 'Upload new file', permission: 'file-management.create', authRequired: true },
      { method: 'GET', path: '/api/v1/file-management', description: 'List my files', permission: 'file-management.view', authRequired: true },
      { method: 'GET', path: '/api/v1/file-management/{id}/download', description: 'Download file', permission: 'file-management.view', authRequired: true },
      { method: 'DELETE', path: '/api/v1/file-management/{id}', description: 'Delete file', permission: 'file-management.delete', authRequired: true }
    ],
    services: ['FileService', 'FileStorageService'],
    events: ['FileUploaded', 'FileDeleted'],
    jobs: ['GenerateFileThumbnailJob', 'ScanFileForVirusJob'],
    dependencies: [1],
    tests: ['FileUploadTest', 'FileCrudTest']
  }),
  buildModule({
    id: 549,
    name: 'Notification Management',
    slug: 'notification-management',
    category: 'Operations & Productivity',
    phase: 28,
    iconName: 'Bell',
    purpose: 'User notification system for managing alerts, messages, and updates.',
    responsibilities: [
      'Send and manage user notifications',
      'Track notification read status',
      'Provide notification preferences and settings'
    ],
    tableName: 'notifications',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'user_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'type', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'title', type: 'VARCHAR(255)', nullable: false },
      { name: 'message', type: 'TEXT', nullable: false },
      { name: 'data', type: 'JSON', nullable: true },
      { name: 'read_at', type: 'TIMESTAMP', nullable: true },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'GET', path: '/api/v1/notification-management', description: 'List my notifications', permission: 'notification-management.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/notification-management/{id}/read', description: 'Mark notification as read', permission: 'notification-management.manage', authRequired: true },
      { method: 'PATCH', path: '/api/v1/notification-management/read-all', description: 'Mark all notifications as read', permission: 'notification-management.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/notification-management/{id}', description: 'Delete notification', permission: 'notification-management.delete', authRequired: true }
    ],
    services: ['NotificationService', 'NotificationPreferenceService'],
    events: ['NotificationSent', 'NotificationRead', 'NotificationDeleted'],
    jobs: ['SendPushNotificationJob', 'CleanOldNotificationsJob'],
    dependencies: [1],
    tests: ['NotificationCrudTest', 'NotificationReadTest']
  }),
  buildModule({
    id: 550,
    name: 'Comment Management',
    slug: 'comment-management',
    category: 'Operations & Productivity',
    phase: 28,
    iconName: 'MessageSquare',
    purpose: 'Generic comment system for adding comments to any entity in the system.',
    responsibilities: [
      'Add, edit, and delete comments',
      'Support nested replies and threads',
      'Provide comment moderation capabilities'
    ],
    tableName: 'comments',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'user_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'commentable_type', type: 'VARCHAR(255)', nullable: false, index: true },
      { name: 'commentable_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'parent_id', type: 'BIGINT UNSIGNED', nullable: true, index: true },
      { name: 'content', type: 'TEXT', nullable: false },
      { name: 'status', type: 'ENUM("pending","approved","rejected","spam")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/comment-management', description: 'Add new comment', permission: 'comment-management.create', authRequired: true },
      { method: 'GET', path: '/api/v1/comment-management', description: 'List comments for entity', permission: 'comment-management.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/comment-management/{id}', description: 'Update comment', permission: 'comment-management.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/comment-management/{id}', description: 'Delete comment', permission: 'comment-management.delete', authRequired: true }
    ],
    services: ['CommentService', 'CommentModerationService'],
    events: ['CommentCreated', 'CommentUpdated', 'CommentModerated'],
    jobs: ['ModerateCommentJob', 'NotifyEntityOwnerJob'],
    dependencies: [1],
    tests: ['CommentCrudTest', 'CommentThreadTest']
  }),
  buildModule({
    id: 551,
    name: 'Rating Management',
    slug: 'rating-management',
    category: 'Operations & Productivity',
    phase: 28,
    iconName: 'Star',
    purpose: 'Rating and review system for collecting user feedback and ratings.',
    responsibilities: [
      'Submit and manage ratings',
      'Calculate average ratings and aggregates',
      'Provide rating analytics and insights'
    ],
    tableName: 'ratings',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'user_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'rateable_type', type: 'VARCHAR(255)', nullable: false, index: true },
      { name: 'rateable_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'rating', type: 'TINYINT UNSIGNED', nullable: false },
      { name: 'review', type: 'TEXT', nullable: true },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/rating-management', description: 'Submit new rating', permission: 'rating-management.create', authRequired: true },
      { method: 'GET', path: '/api/v1/rating-management', description: 'List ratings for entity', permission: 'rating-management.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/rating-management/{id}', description: 'Update rating', permission: 'rating-management.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/rating-management/{id}', description: 'Delete rating', permission: 'rating-management.delete', authRequired: true }
    ],
    services: ['RatingService', 'RatingAggregationService'],
    events: ['RatingSubmitted', 'RatingUpdated', 'RatingDeleted'],
    jobs: ['RecalculateRatingAggregatesJob'],
    dependencies: [1],
    tests: ['RatingCrudTest', 'RatingAggregationTest']
  }),
  buildModule({
    id: 552,
    name: 'FAQ Management',
    slug: 'faq-management',
    category: 'Operations & Productivity',
    phase: 28,
    iconName: 'HelpCircle',
    purpose: 'Frequently asked questions management for help centers and knowledge bases.',
    responsibilities: [
      'Create, update, and organize FAQ entries',
      'Categorize FAQs by topic',
      'Provide search and quick access to FAQs'
    ],
    tableName: 'faqs',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'question', type: 'TEXT', nullable: false },
      { name: 'answer', type: 'TEXT', nullable: false },
      { name: 'category', type: 'VARCHAR(128)', nullable: false, index: true },
      { name: 'sort_order', type: 'INT', nullable: false },
      { name: 'is_published', type: 'BOOLEAN', nullable: false },
      { name: 'view_count', type: 'INT UNSIGNED', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/faq-management', description: 'Create new FAQ', permission: 'faq-management.create', authRequired: true },
      { method: 'GET', path: '/api/v1/faq-management', description: 'List all FAQs', permission: 'faq-management.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/faq-management/{id}', description: 'Update FAQ', permission: 'faq-management.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/faq-management/{id}', description: 'Delete FAQ', permission: 'faq-management.delete', authRequired: true }
    ],
    services: ['FaqService', 'FaqSearchService'],
    events: ['FaqCreated', 'FaqUpdated', 'FaqDeleted'],
    jobs: ['IndexFaqForSearchJob'],
    dependencies: [1],
    tests: ['FaqCrudTest', 'FaqSearchTest']
  }),
  buildModule({
    id: 553,
    name: 'Testimonial Management',
    slug: 'testimonial-management',
    category: 'Operations & Productivity',
    phase: 28,
    iconName: 'Quote',
    purpose: 'Customer testimonial and social proof management system.',
    responsibilities: [
      'Collect and manage customer testimonials',
      'Display testimonials on marketing pages',
      'Track testimonial performance and engagement'
    ],
    tableName: 'testimonials',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'customer_name', type: 'VARCHAR(255)', nullable: false },
      { name: 'customer_title', type: 'VARCHAR(255)', nullable: true },
      { name: 'customer_company', type: 'VARCHAR(255)', nullable: true },
      { name: 'content', type: 'TEXT', nullable: false },
      { name: 'rating', type: 'TINYINT UNSIGNED', nullable: true },
      { name: 'avatar_url', type: 'VARCHAR(512)', nullable: true },
      { name: 'is_featured', type: 'BOOLEAN', nullable: false },
      { name: 'status', type: 'ENUM("pending","approved","rejected")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/testimonial-management', description: 'Submit new testimonial', permission: 'testimonial-management.create', authRequired: true },
      { method: 'GET', path: '/api/v1/testimonial-management', description: 'List approved testimonials', permission: 'testimonial-management.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/testimonial-management/{id}/approve', description: 'Approve testimonial', permission: 'testimonial-management.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/testimonial-management/{id}', description: 'Delete testimonial', permission: 'testimonial-management.delete', authRequired: true }
    ],
    services: ['TestimonialService', 'TestimonialModerationService'],
    events: ['TestimonialSubmitted', 'TestimonialApproved', 'TestimonialRejected'],
    jobs: ['ModerateTestimonialJob'],
    dependencies: [1],
    tests: ['TestimonialCrudTest', 'TestimonialModerationTest']
  }),
  buildModule({
    id: 554,
    name: 'Survey Management',
    slug: 'survey-management',
    category: 'Operations & Productivity',
    phase: 28,
    iconName: 'ClipboardList',
    purpose: 'Simple survey creation and response collection system.',
    responsibilities: [
      'Create and manage surveys with questions',
      'Collect and store survey responses',
      'Provide basic survey analytics'
    ],
    tableName: 'surveys',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'user_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'title', type: 'VARCHAR(255)', nullable: false },
      { name: 'description', type: 'TEXT', nullable: true },
      { name: 'questions', type: 'JSON', nullable: false },
      { name: 'status', type: 'ENUM("draft","active","closed","archived")', nullable: false },
      { name: 'response_count', type: 'INT UNSIGNED', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/survey-management', description: 'Create new survey', permission: 'survey-management.create', authRequired: true },
      { method: 'GET', path: '/api/v1/survey-management', description: 'List my surveys', permission: 'survey-management.view', authRequired: true },
      { method: 'POST', path: '/api/v1/survey-management/{id}/respond', description: 'Submit survey response', permission: 'survey-management.respond', authRequired: true },
      { method: 'PATCH', path: '/api/v1/survey-management/{id}', description: 'Update survey', permission: 'survey-management.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/survey-management/{id}', description: 'Delete survey', permission: 'survey-management.delete', authRequired: true }
    ],
    services: ['SurveyService', 'SurveyResponseService'],
    events: ['SurveyCreated', 'SurveyResponseSubmitted', 'SurveyClosed'],
    jobs: ['ProcessSurveyResponsesJob', 'GenerateSurveyAnalyticsJob'],
    dependencies: [1],
    tests: ['SurveyCrudTest', 'SurveyResponseTest']
  }),
  buildModule({
    id: 555,
    name: 'Announcement Management',
    slug: 'announcement-management',
    category: 'Operations & Productivity',
    phase: 28,
    iconName: 'Megaphone',
    purpose: 'System-wide announcement and notification broadcasting system.',
    responsibilities: [
      'Create and publish announcements',
      'Target announcements to specific user groups',
      'Track announcement views and engagement'
    ],
    tableName: 'announcements',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'title', type: 'VARCHAR(255)', nullable: false },
      { name: 'content', type: 'TEXT', nullable: false },
      { name: 'type', type: 'ENUM("info","warning","success","error")', nullable: false },
      { name: 'target_audience', type: 'JSON', nullable: true },
      { name: 'publish_at', type: 'TIMESTAMP', nullable: true },
      { name: 'expires_at', type: 'TIMESTAMP', nullable: true },
      { name: 'view_count', type: 'INT UNSIGNED', nullable: false },
      { name: 'status', type: 'ENUM("draft","published","expired","archived")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/announcement-management', description: 'Create new announcement', permission: 'announcement-management.create', authRequired: true },
      { method: 'GET', path: '/api/v1/announcement-management', description: 'List active announcements', permission: 'announcement-management.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/announcement-management/{id}', description: 'Update announcement', permission: 'announcement-management.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/announcement-management/{id}', description: 'Delete announcement', permission: 'announcement-management.delete', authRequired: true }
    ],
    services: ['AnnouncementService', 'AnnouncementDeliveryService'],
    events: ['AnnouncementPublished', 'AnnouncementExpired'],
    jobs: ['DeliverAnnouncementsJob', 'ExpireAnnouncementsJob'],
    dependencies: [1],
    tests: ['AnnouncementCrudTest', 'AnnouncementDeliveryTest']
  }),
  buildModule({
    id: 556,
    name: 'Milestone Management',
    slug: 'milestone-management',
    category: 'Operations & Productivity',
    phase: 28,
    iconName: 'Flag',
    purpose: 'Project milestone tracking for marking important project checkpoints.',
    responsibilities: [
      'Create and manage project milestones',
      'Track milestone completion status',
      'Link milestones to tasks and deliverables'
    ],
    tableName: 'milestones',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'user_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'title', type: 'VARCHAR(255)', nullable: false },
      { name: 'description', type: 'TEXT', nullable: true },
      { name: 'due_date', type: 'DATE', nullable: true },
      { name: 'status', type: 'ENUM("pending","in_progress","completed","overdue")', nullable: false },
      { name: 'completed_at', type: 'TIMESTAMP', nullable: true },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/milestone-management', description: 'Create new milestone', permission: 'milestone-management.create', authRequired: true },
      { method: 'GET', path: '/api/v1/milestone-management', description: 'List my milestones', permission: 'milestone-management.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/milestone-management/{id}', description: 'Update milestone', permission: 'milestone-management.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/milestone-management/{id}', description: 'Delete milestone', permission: 'milestone-management.delete', authRequired: true }
    ],
    services: ['MilestoneService', 'MilestoneTrackingService'],
    events: ['MilestoneCreated', 'MilestoneCompleted', 'MilestoneOverdue'],
    jobs: ['CheckOverdueMilestonesJob'],
    dependencies: [1],
    tests: ['MilestoneCrudTest', 'MilestoneTrackingTest']
  }),
  buildModule({
    id: 557,
    name: 'Time Entry Management',
    slug: 'time-entry-management',
    category: 'Operations & Productivity',
    phase: 28,
    iconName: 'Clock',
    purpose: 'Time tracking system for logging work hours and activities.',
    responsibilities: [
      'Log and manage time entries',
      'Track time by project and task',
      'Provide time reports and summaries'
    ],
    tableName: 'time_entries',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'user_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'description', type: 'VARCHAR(255)', nullable: false },
      { name: 'hours', type: 'DECIMAL(5,2)', nullable: false },
      { name: 'date', type: 'DATE', nullable: false, index: true },
      { name: 'project_name', type: 'VARCHAR(255)', nullable: true },
      { name: 'task_name', type: 'VARCHAR(255)', nullable: true },
      { name: 'billable', type: 'BOOLEAN', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/time-entry-management', description: 'Log new time entry', permission: 'time-entry-management.create', authRequired: true },
      { method: 'GET', path: '/api/v1/time-entry-management', description: 'List my time entries', permission: 'time-entry-management.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/time-entry-management/{id}', description: 'Update time entry', permission: 'time-entry-management.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/time-entry-management/{id}', description: 'Delete time entry', permission: 'time-entry-management.delete', authRequired: true }
    ],
    services: ['TimeEntryService', 'TimeReportService'],
    events: ['TimeEntryCreated', 'TimeEntryUpdated', 'TimeEntryDeleted'],
    jobs: ['GenerateTimeReportJob'],
    dependencies: [1],
    tests: ['TimeEntryCrudTest', 'TimeReportTest']
  }),
  buildModule({
    id: 558,
    name: 'Expense Management',
    slug: 'expense-management',
    category: 'Operations & Productivity',
    phase: 28,
    iconName: 'Receipt',
    purpose: 'Personal expense tracking and categorization system.',
    responsibilities: [
      'Log and categorize expenses',
      'Track expenses by category and date',
      'Provide expense reports and summaries'
    ],
    tableName: 'expenses',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'user_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'description', type: 'VARCHAR(255)', nullable: false },
      { name: 'amount', type: 'DECIMAL(10,2)', nullable: false },
      { name: 'category', type: 'VARCHAR(128)', nullable: false, index: true },
      { name: 'date', type: 'DATE', nullable: false, index: true },
      { name: 'receipt_url', type: 'VARCHAR(512)', nullable: true },
      { name: 'notes', type: 'TEXT', nullable: true },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/expense-management', description: 'Log new expense', permission: 'expense-management.create', authRequired: true },
      { method: 'GET', path: '/api/v1/expense-management', description: 'List my expenses', permission: 'expense-management.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/expense-management/{id}', description: 'Update expense', permission: 'expense-management.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/expense-management/{id}', description: 'Delete expense', permission: 'expense-management.delete', authRequired: true }
    ],
    services: ['ExpenseService', 'ExpenseReportService'],
    events: ['ExpenseCreated', 'ExpenseUpdated', 'ExpenseDeleted'],
    jobs: ['GenerateExpenseReportJob'],
    dependencies: [1],
    tests: ['ExpenseCrudTest', 'ExpenseReportTest']
  }),
  buildModule({
    id: 559,
    name: 'Goal Management',
    slug: 'goal-management',
    category: 'Operations & Productivity',
    phase: 28,
    iconName: 'Target',
    purpose: 'Personal and team goal setting and tracking system.',
    responsibilities: [
      'Create and manage personal and team goals',
      'Track goal progress and milestones',
      'Provide goal analytics and insights'
    ],
    tableName: 'goals',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'user_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'title', type: 'VARCHAR(255)', nullable: false },
      { name: 'description', type: 'TEXT', nullable: true },
      { name: 'target_value', type: 'DECIMAL(10,2)', nullable: true },
      { name: 'current_value', type: 'DECIMAL(10,2)', nullable: false },
      { name: 'unit', type: 'VARCHAR(32)', nullable: true },
      { name: 'start_date', type: 'DATE', nullable: false },
      { name: 'end_date', type: 'DATE', nullable: true },
      { name: 'status', type: 'ENUM("active","completed","cancelled","paused")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/goal-management', description: 'Create new goal', permission: 'goal-management.create', authRequired: true },
      { method: 'GET', path: '/api/v1/goal-management', description: 'List my goals', permission: 'goal-management.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/goal-management/{id}', description: 'Update goal', permission: 'goal-management.manage', authRequired: true },
      { method: 'PATCH', path: '/api/v1/goal-management/{id}/progress', description: 'Update goal progress', permission: 'goal-management.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/goal-management/{id}', description: 'Delete goal', permission: 'goal-management.delete', authRequired: true }
    ],
    services: ['GoalService', 'GoalTrackingService'],
    events: ['GoalCreated', 'GoalProgressUpdated', 'GoalCompleted'],
    jobs: ['CheckGoalDeadlinesJob', 'GenerateGoalAnalyticsJob'],
    dependencies: [1],
    tests: ['GoalCrudTest', 'GoalTrackingTest']
  }),
  buildModule({
    id: 560,
    name: 'Journal Management',
    slug: 'journal-management',
    category: 'Operations & Productivity',
    phase: 28,
    iconName: 'BookOpen',
    purpose: 'Personal journaling system for daily logs, reflections, and mood tracking.',
    responsibilities: [
      'Create and manage journal entries',
      'Track mood and emotions over time',
      'Provide journal search and insights'
    ],
    tableName: 'journal_entries',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'user_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'title', type: 'VARCHAR(255)', nullable: true },
      { name: 'content', type: 'TEXT', nullable: false },
      { name: 'mood', type: 'ENUM("great","good","neutral","bad","terrible")', nullable: true },
      { name: 'entry_date', type: 'DATE', nullable: false, index: true },
      { name: 'tags', type: 'JSON', nullable: true },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/journal-management', description: 'Create new journal entry', permission: 'journal-management.create', authRequired: true },
      { method: 'GET', path: '/api/v1/journal-management', description: 'List my journal entries', permission: 'journal-management.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/journal-management/{id}', description: 'Update journal entry', permission: 'journal-management.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/journal-management/{id}', description: 'Delete journal entry', permission: 'journal-management.delete', authRequired: true }
    ],
    services: ['JournalService', 'JournalAnalyticsService'],
    events: ['JournalEntryCreated', 'JournalEntryUpdated', 'JournalEntryDeleted'],
    jobs: ['AnalyzeJournalMoodTrendsJob'],
    dependencies: [1],
    tests: ['JournalCrudTest', 'JournalMoodTrackingTest']
  }),
  // DOMAIN 29: BASIC CRUD MODULES CONTINUED (561-600)
  buildModule({
    id: 561,
    name: 'Vendor Management',
    slug: 'vendor-management',
    category: 'Commerce',
    phase: 29,
    iconName: 'Store',
    purpose: 'Vendor and supplier management for tracking business partnerships.',
    responsibilities: [
      'Create and manage vendor profiles',
      'Track vendor performance and ratings',
      'Manage vendor contracts and agreements'
    ],
    tableName: 'vendors',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'name', type: 'VARCHAR(255)', nullable: false },
      { name: 'contact_name', type: 'VARCHAR(255)', nullable: true },
      { name: 'email', type: 'VARCHAR(255)', nullable: true },
      { name: 'phone', type: 'VARCHAR(32)', nullable: true },
      { name: 'address', type: 'TEXT', nullable: true },
      { name: 'website', type: 'VARCHAR(512)', nullable: true },
      { name: 'status', type: 'ENUM("active","inactive","suspended")', nullable: false },
      { name: 'rating', type: 'DECIMAL(3,2)', nullable: true },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/vendor-management', description: 'Create new vendor', permission: 'vendor-management.create', authRequired: true },
      { method: 'GET', path: '/api/v1/vendor-management', description: 'List all vendors', permission: 'vendor-management.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/vendor-management/{id}', description: 'Update vendor', permission: 'vendor-management.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/vendor-management/{id}', description: 'Delete vendor', permission: 'vendor-management.delete', authRequired: true }
    ],
    services: ['VendorService', 'VendorPerformanceService'],
    events: ['VendorCreated', 'VendorUpdated', 'VendorDeleted'],
    jobs: ['UpdateVendorRatingsJob'],
    dependencies: [1],
    tests: ['VendorCrudTest', 'VendorPerformanceTest']
  }),
  buildModule({
    id: 562,
    name: 'Product Management',
    slug: 'product-management',
    category: 'Commerce',
    phase: 29,
    iconName: 'Package',
    purpose: 'Product catalog management for creating and organizing products.',
    responsibilities: [
      'Create and manage product listings',
      'Organize products with categories and attributes',
      'Track product inventory levels'
    ],
    tableName: 'products',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'name', type: 'VARCHAR(255)', nullable: false },
      { name: 'slug', type: 'VARCHAR(255)', nullable: false, index: true },
      { name: 'description', type: 'TEXT', nullable: true },
      { name: 'sku', type: 'VARCHAR(128)', nullable: true, index: true },
      { name: 'price', type: 'DECIMAL(10,2)', nullable: false },
      { name: 'stock_quantity', type: 'INT UNSIGNED', nullable: false },
      { name: 'status', type: 'ENUM("draft","active","out_of_stock","discontinued")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/product-management', description: 'Create new product', permission: 'product-management.create', authRequired: true },
      { method: 'GET', path: '/api/v1/product-management', description: 'List all products', permission: 'product-management.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/product-management/{id}', description: 'Update product', permission: 'product-management.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/product-management/{id}', description: 'Delete product', permission: 'product-management.delete', authRequired: true }
    ],
    services: ['ProductService', 'InventoryService'],
    events: ['ProductCreated', 'ProductUpdated', 'ProductDeleted'],
    jobs: ['SyncInventoryJob'],
    dependencies: [1, 541],
    tests: ['ProductCrudTest', 'InventoryManagementTest']
  }),
  buildModule({
    id: 563,
    name: 'Customer Management',
    slug: 'customer-management',
    category: 'Commerce',
    phase: 29,
    iconName: 'Users',
    purpose: 'Customer database management for tracking customer information and interactions.',
    responsibilities: [
      'Create and manage customer profiles',
      'Track customer interactions and history',
      'Provide customer analytics and insights'
    ],
    tableName: 'customers',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'first_name', type: 'VARCHAR(128)', nullable: false },
      { name: 'last_name', type: 'VARCHAR(128)', nullable: false },
      { name: 'email', type: 'VARCHAR(255)', nullable: false, index: true },
      { name: 'phone', type: 'VARCHAR(32)', nullable: true },
      { name: 'company', type: 'VARCHAR(255)', nullable: true },
      { name: 'lifetime_value', type: 'DECIMAL(10,2)', nullable: false },
      { name: 'status', type: 'ENUM("active","inactive","lead")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/customer-management', description: 'Create new customer', permission: 'customer-management.create', authRequired: true },
      { method: 'GET', path: '/api/v1/customer-management', description: 'List all customers', permission: 'customer-management.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/customer-management/{id}', description: 'Update customer', permission: 'customer-management.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/customer-management/{id}', description: 'Delete customer', permission: 'customer-management.delete', authRequired: true }
    ],
    services: ['CustomerService', 'CustomerAnalyticsService'],
    events: ['CustomerCreated', 'CustomerUpdated', 'CustomerDeleted'],
    jobs: ['CalculateCustomerLifetimeValueJob'],
    dependencies: [1],
    tests: ['CustomerCrudTest', 'CustomerAnalyticsTest']
  }),
  buildModule({
    id: 564,
    name: 'Invoice Management',
    slug: 'invoice-management',
    category: 'Commerce',
    phase: 29,
    iconName: 'FileText',
    purpose: 'Invoice creation and management for billing and payments.',
    responsibilities: [
      'Create and manage invoices',
      'Track invoice status and payments',
      'Generate invoice PDFs and reports'
    ],
    tableName: 'invoices',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'customer_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'invoice_number', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'subtotal', type: 'DECIMAL(10,2)', nullable: false },
      { name: 'tax_amount', type: 'DECIMAL(10,2)', nullable: false },
      { name: 'total', type: 'DECIMAL(10,2)', nullable: false },
      { name: 'status', type: 'ENUM("draft","sent","paid","overdue","cancelled")', nullable: false },
      { name: 'due_date', type: 'DATE', nullable: false },
      { name: 'paid_at', type: 'TIMESTAMP', nullable: true },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/invoice-management', description: 'Create new invoice', permission: 'invoice-management.create', authRequired: true },
      { method: 'GET', path: '/api/v1/invoice-management', description: 'List all invoices', permission: 'invoice-management.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/invoice-management/{id}/status', description: 'Update invoice status', permission: 'invoice-management.manage', authRequired: true },
      { method: 'GET', path: '/api/v1/invoice-management/{id}/pdf', description: 'Download invoice PDF', permission: 'invoice-management.view', authRequired: true },
      { method: 'DELETE', path: '/api/v1/invoice-management/{id}', description: 'Delete invoice', permission: 'invoice-management.delete', authRequired: true }
    ],
    services: ['InvoiceService', 'InvoicePdfService'],
    events: ['InvoiceCreated', 'InvoiceSent', 'InvoicePaid'],
    jobs: ['GenerateInvoicePdfJob', 'CheckOverdueInvoicesJob'],
    dependencies: [1, 563],
    tests: ['InvoiceCrudTest', 'InvoicePaymentTest']
  }),
  buildModule({
    id: 565,
    name: 'Quote Management',
    slug: 'quote-management',
    category: 'Commerce',
    phase: 29,
    iconName: 'FileText',
    purpose: 'Sales quote creation and management for proposals and estimates.',
    responsibilities: [
      'Create and manage sales quotes',
      'Convert quotes to invoices',
      'Track quote status and expiry'
    ],
    tableName: 'quotes',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'customer_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'quote_number', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'subtotal', type: 'DECIMAL(10,2)', nullable: false },
      { name: 'tax_amount', type: 'DECIMAL(10,2)', nullable: false },
      { name: 'total', type: 'DECIMAL(10,2)', nullable: false },
      { name: 'status', type: 'ENUM("draft","sent","accepted","rejected","expired")', nullable: false },
      { name: 'valid_until', type: 'DATE', nullable: false },
      { name: 'notes', type: 'TEXT', nullable: true },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/quote-management', description: 'Create new quote', permission: 'quote-management.create', authRequired: true },
      { method: 'GET', path: '/api/v1/quote-management', description: 'List all quotes', permission: 'quote-management.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/quote-management/{id}/status', description: 'Update quote status', permission: 'quote-management.manage', authRequired: true },
      { method: 'POST', path: '/api/v1/quote-management/{id}/convert', description: 'Convert quote to invoice', permission: 'quote-management.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/quote-management/{id}', description: 'Delete quote', permission: 'quote-management.delete', authRequired: true }
    ],
    services: ['QuoteService', 'QuoteConversionService'],
    events: ['QuoteCreated', 'QuoteSent', 'QuoteAccepted'],
    jobs: ['CheckExpiredQuotesJob'],
    dependencies: [1, 563, 564],
    tests: ['QuoteCrudTest', 'QuoteConversionTest']
  }),
  buildModule({
    id: 566,
    name: 'Warehouse Management',
    slug: 'warehouse-management',
    category: 'Logistics & Supply Chain',
    phase: 29,
    iconName: 'Warehouse',
    purpose: 'Warehouse and storage location management for inventory operations.',
    responsibilities: [
      'Create and manage warehouse locations',
      'Track inventory across warehouses',
      'Manage warehouse zones and bins'
    ],
    tableName: 'warehouses',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'name', type: 'VARCHAR(255)', nullable: false },
      { name: 'code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'address', type: 'TEXT', nullable: true },
      { name: 'capacity', type: 'INT UNSIGNED', nullable: true },
      { name: 'manager_name', type: 'VARCHAR(255)', nullable: true },
      { name: 'status', type: 'ENUM("active","inactive","maintenance")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/warehouse-management', description: 'Create new warehouse', permission: 'warehouse-management.create', authRequired: true },
      { method: 'GET', path: '/api/v1/warehouse-management', description: 'List all warehouses', permission: 'warehouse-management.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/warehouse-management/{id}', description: 'Update warehouse', permission: 'warehouse-management.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/warehouse-management/{id}', description: 'Delete warehouse', permission: 'warehouse-management.delete', authRequired: true }
    ],
    services: ['WarehouseService', 'WarehouseInventoryService'],
    events: ['WarehouseCreated', 'WarehouseUpdated', 'WarehouseDeleted'],
    jobs: ['SyncWarehouseInventoryJob'],
    dependencies: [1],
    tests: ['WarehouseCrudTest', 'WarehouseInventoryTest']
  }),
  buildModule({
    id: 567,
    name: 'Shipment Tracking',
    slug: 'shipment-tracking',
    category: 'Logistics & Supply Chain',
    phase: 29,
    iconName: 'Truck',
    purpose: 'Shipment and delivery tracking for order fulfillment.',
    responsibilities: [
      'Create and track shipments',
      'Update shipment status and location',
      'Provide delivery notifications'
    ],
    tableName: 'shipments',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'order_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'tracking_number', type: 'VARCHAR(128)', nullable: true, index: true },
      { name: 'carrier', type: 'VARCHAR(128)', nullable: true },
      { name: 'status', type: 'ENUM("pending","shipped","in_transit","delivered","returned")', nullable: false },
      { name: 'shipped_at', type: 'TIMESTAMP', nullable: true },
      { name: 'delivered_at', type: 'TIMESTAMP', nullable: true },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/shipment-tracking', description: 'Create new shipment', permission: 'shipment-tracking.create', authRequired: true },
      { method: 'GET', path: '/api/v1/shipment-tracking', description: 'List all shipments', permission: 'shipment-tracking.view', authRequired: true },
      { method: 'GET', path: '/api/v1/shipment-tracking/{id}/track', description: 'Track shipment', permission: 'shipment-tracking.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/shipment-tracking/{id}/status', description: 'Update shipment status', permission: 'shipment-tracking.manage', authRequired: true }
    ],
    services: ['ShipmentService', 'ShipmentTrackingService'],
    events: ['ShipmentCreated', 'ShipmentStatusUpdated', 'ShipmentDelivered'],
    jobs: ['TrackShipmentStatusJob', 'SendDeliveryNotificationJob'],
    dependencies: [1],
    tests: ['ShipmentCrudTest', 'ShipmentTrackingTest']
  }),
  buildModule({
    id: 568,
    name: 'Inventory Management',
    slug: 'inventory-management',
    category: 'Logistics & Supply Chain',
    phase: 29,
    iconName: 'Box',
    purpose: 'Inventory tracking and management for stock levels and movements.',
    responsibilities: [
      'Track inventory levels across locations',
      'Manage stock movements and transfers',
      'Provide inventory alerts and reports'
    ],
    tableName: 'inventory',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'product_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'warehouse_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'quantity', type: 'INT UNSIGNED', nullable: false },
      { name: 'reserved_quantity', type: 'INT UNSIGNED', nullable: false },
      { name: 'reorder_point', type: 'INT UNSIGNED', nullable: true },
      { name: 'status', type: 'ENUM("in_stock","low_stock","out_of_stock")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/inventory-management', description: 'Create inventory record', permission: 'inventory-management.create', authRequired: true },
      { method: 'GET', path: '/api/v1/inventory-management', description: 'List inventory', permission: 'inventory-management.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/inventory-management/{id}', description: 'Update inventory', permission: 'inventory-management.manage', authRequired: true },
      { method: 'POST', path: '/api/v1/inventory-management/{id}/adjust', description: 'Adjust inventory quantity', permission: 'inventory-management.manage', authRequired: true }
    ],
    services: ['InventoryService', 'InventoryAlertService'],
    events: ['InventoryUpdated', 'StockLevelLow', 'StockTransferCompleted'],
    jobs: ['CheckLowStockLevelsJob', 'SyncInventoryLevelsJob'],
    dependencies: [1, 566],
    tests: ['InventoryCrudTest', 'InventoryAlertTest']
  }),
  buildModule({
    id: 569,
    name: 'Asset Management',
    slug: 'asset-management',
    category: 'Operations & Productivity',
    phase: 29,
    iconName: 'Briefcase',
    purpose: 'Company asset tracking and management for equipment and resources.',
    responsibilities: [
      'Track company assets and equipment',
      'Manage asset assignments and checkouts',
      'Provide asset maintenance schedules'
    ],
    tableName: 'assets',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'name', type: 'VARCHAR(255)', nullable: false },
      { name: 'serial_number', type: 'VARCHAR(128)', nullable: true, index: true },
      { name: 'category', type: 'VARCHAR(128)', nullable: false, index: true },
      { name: 'purchase_date', type: 'DATE', nullable: true },
      { name: 'purchase_cost', type: 'DECIMAL(10,2)', nullable: true },
      { name: 'assigned_to', type: 'BIGINT UNSIGNED', nullable: true, index: true },
      { name: 'status', type: 'ENUM("available","assigned","maintenance","retired")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/asset-management', description: 'Register new asset', permission: 'asset-management.create', authRequired: true },
      { method: 'GET', path: '/api/v1/asset-management', description: 'List all assets', permission: 'asset-management.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/asset-management/{id}', description: 'Update asset', permission: 'asset-management.manage', authRequired: true },
      { method: 'POST', path: '/api/v1/asset-management/{id}/assign', description: 'Assign asset to user', permission: 'asset-management.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/asset-management/{id}', description: 'Delete asset', permission: 'asset-management.delete', authRequired: true }
    ],
    services: ['AssetService', 'AssetAssignmentService'],
    events: ['AssetCreated', 'AssetAssigned', 'AssetRetired'],
    jobs: ['CheckAssetMaintenanceJob'],
    dependencies: [1],
    tests: ['AssetCrudTest', 'AssetAssignmentTest']
  }),
  buildModule({
    id: 570,
    name: 'Maintenance Management',
    slug: 'maintenance-management',
    category: 'Operations & Productivity',
    phase: 29,
    iconName: 'Wrench',
    purpose: 'Maintenance scheduling and tracking for equipment and facilities.',
    responsibilities: [
      'Schedule and track maintenance tasks',
      'Manage maintenance requests and work orders',
      'Provide maintenance history and reports'
    ],
    tableName: 'maintenance_tasks',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'asset_id', type: 'BIGINT UNSIGNED', nullable: true, index: true },
      { name: 'title', type: 'VARCHAR(255)', nullable: false },
      { name: 'description', type: 'TEXT', nullable: true },
      { name: 'type', type: 'ENUM("preventive","corrective","emergency")', nullable: false },
      { name: 'priority', type: 'ENUM("low","medium","high","urgent")', nullable: false },
      { name: 'status', type: 'ENUM("scheduled","in_progress","completed","cancelled")', nullable: false },
      { name: 'scheduled_date', type: 'DATE', nullable: true },
      { name: 'completed_at', type: 'TIMESTAMP', nullable: true },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/maintenance-management', description: 'Create maintenance task', permission: 'maintenance-management.create', authRequired: true },
      { method: 'GET', path: '/api/v1/maintenance-management', description: 'List maintenance tasks', permission: 'maintenance-management.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/maintenance-management/{id}', description: 'Update maintenance task', permission: 'maintenance-management.manage', authRequired: true },
      { method: 'PATCH', path: '/api/v1/maintenance-management/{id}/complete', description: 'Complete maintenance task', permission: 'maintenance-management.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/maintenance-management/{id}', description: 'Delete maintenance task', permission: 'maintenance-management.delete', authRequired: true }
    ],
    services: ['MaintenanceService', 'MaintenanceSchedulingService'],
    events: ['MaintenanceTaskCreated', 'MaintenanceTaskCompleted', 'MaintenanceOverdue'],
    jobs: ['CheckOverdueMaintenanceJob', 'SendMaintenanceRemindersJob'],
    dependencies: [1, 569],
    tests: ['MaintenanceCrudTest', 'MaintenanceSchedulingTest']
  }),
  buildModule({
    id: 571,
    name: 'Donation Management',
    slug: 'donation-management',
    category: 'Commerce',
    phase: 29,
    iconName: 'Heart',
    purpose: 'Donation collection and tracking for charitable and fundraising campaigns.',
    responsibilities: [
      'Process and track donations',
      'Manage donor information and history',
      'Provide donation receipts and reports'
    ],
    tableName: 'donations',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'donor_name', type: 'VARCHAR(255)', nullable: false },
      { name: 'donor_email', type: 'VARCHAR(255)', nullable: true },
      { name: 'amount', type: 'DECIMAL(10,2)', nullable: false },
      { name: 'currency', type: 'VARCHAR(3)', nullable: false },
      { name: 'campaign', type: 'VARCHAR(255)', nullable: true },
      { name: 'payment_method', type: 'VARCHAR(64)', nullable: true },
      { name: 'status', type: 'ENUM("pending","completed","failed","refunded")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/donation-management', description: 'Record new donation', permission: 'donation-management.create', authRequired: true },
      { method: 'GET', path: '/api/v1/donation-management', description: 'List all donations', permission: 'donation-management.view', authRequired: true },
      { method: 'GET', path: '/api/v1/donation-management/{id}', description: 'Get donation details', permission: 'donation-management.view', authRequired: true },
      { method: 'POST', path: '/api/v1/donation-management/{id}/receipt', description: 'Generate donation receipt', permission: 'donation-management.manage', authRequired: true }
    ],
    services: ['DonationService', 'ReceiptService'],
    events: ['DonationReceived', 'ReceiptGenerated'],
    jobs: ['GenerateDonationReceiptJob', 'UpdateCampaignTotalsJob'],
    dependencies: [1],
    tests: ['DonationCrudTest', 'ReceiptGenerationTest']
  }),
  buildModule({
    id: 572,
    name: 'Coupon Management',
    slug: 'coupon-management',
    category: 'Commerce',
    phase: 29,
    iconName: 'Ticket',
    purpose: 'Discount coupon and promotion code management system.',
    responsibilities: [
      'Create and manage discount coupons',
      'Track coupon usage and redemptions',
      'Enforce coupon rules and expiration'
    ],
    tableName: 'coupons',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'description', type: 'TEXT', nullable: true },
      { name: 'discount_type', type: 'ENUM("percentage","fixed")', nullable: false },
      { name: 'discount_value', type: 'DECIMAL(10,2)', nullable: false },
      { name: 'min_purchase', type: 'DECIMAL(10,2)', nullable: true },
      { name: 'max_uses', type: 'INT UNSIGNED', nullable: true },
      { name: 'used_count', type: 'INT UNSIGNED', nullable: false },
      { name: 'starts_at', type: 'TIMESTAMP', nullable: false },
      { name: 'expires_at', type: 'TIMESTAMP', nullable: true },
      { name: 'is_active', type: 'BOOLEAN', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/coupon-management', description: 'Create new coupon', permission: 'coupon-management.create', authRequired: true },
      { method: 'GET', path: '/api/v1/coupon-management', description: 'List all coupons', permission: 'coupon-management.view', authRequired: true },
      { method: 'POST', path: '/api/v1/coupon-management/validate', description: 'Validate coupon code', permission: 'coupon-management.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/coupon-management/{id}', description: 'Update coupon', permission: 'coupon-management.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/coupon-management/{id}', description: 'Delete coupon', permission: 'coupon-management.delete', authRequired: true }
    ],
    services: ['CouponService', 'CouponValidationService'],
    events: ['CouponCreated', 'CouponRedeemed', 'CouponExpired'],
    jobs: ['ExpireCouponsJob'],
    dependencies: [1],
    tests: ['CouponCrudTest', 'CouponValidationTest']
  }),
  buildModule({
    id: 573,
    name: 'Loyalty Program',
    slug: 'loyalty-program',
    category: 'Commerce',
    phase: 29,
    iconName: 'Award',
    purpose: 'Customer loyalty points and rewards program management.',
    responsibilities: [
      'Manage loyalty points earning and redemption',
      'Track customer loyalty tiers',
      'Provide rewards catalog and redemption'
    ],
    tableName: 'loyalty_points',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'customer_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'points', type: 'INT', nullable: false },
      { name: 'type', type: 'ENUM("earned","redeemed","expired","adjusted")', nullable: false },
      { name: 'description', type: 'VARCHAR(255)', nullable: true },
      { name: 'expires_at', type: 'TIMESTAMP', nullable: true },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/loyalty-program', description: 'Add loyalty points', permission: 'loyalty-program.create', authRequired: true },
      { method: 'GET', path: '/api/v1/loyalty-program', description: 'List points history', permission: 'loyalty-program.view', authRequired: true },
      { method: 'GET', path: '/api/v1/loyalty-program/balance', description: 'Get points balance', permission: 'loyalty-program.view', authRequired: true },
      { method: 'POST', path: '/api/v1/loyalty-program/redeem', description: 'Redeem points', permission: 'loyalty-program.manage', authRequired: true }
    ],
    services: ['LoyaltyService', 'PointsCalculationService'],
    events: ['PointsEarned', 'PointsRedeemed', 'PointsExpired'],
    jobs: ['ExpireOldPointsJob', 'UpdateLoyaltyTierJob'],
    dependencies: [1, 563],
    tests: ['LoyaltyCrudTest', 'PointsCalculationTest']
  }),
  buildModule({
    id: 574,
    name: 'Subscription Management',
    slug: 'subscription-management',
    category: 'Commerce',
    phase: 29,
    iconName: 'RefreshCw',
    purpose: 'Subscription and recurring billing management.',
    responsibilities: [
      'Create and manage subscription plans',
      'Track subscriber status and billing',
      'Handle subscription lifecycle events'
    ],
    tableName: 'subscriptions',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'customer_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'plan_name', type: 'VARCHAR(255)', nullable: false },
      { name: 'amount', type: 'DECIMAL(10,2)', nullable: false },
      { name: 'billing_cycle', type: 'ENUM("monthly","quarterly","yearly")', nullable: false },
      { name: 'status', type: 'ENUM("active","paused","cancelled","expired")', nullable: false },
      { name: 'starts_at', type: 'TIMESTAMP', nullable: false },
      { name: 'ends_at', type: 'TIMESTAMP', nullable: true },
      { name: 'next_billing_at', type: 'TIMESTAMP', nullable: true },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/subscription-management', description: 'Create new subscription', permission: 'subscription-management.create', authRequired: true },
      { method: 'GET', path: '/api/v1/subscription-management', description: 'List subscriptions', permission: 'subscription-management.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/subscription-management/{id}/cancel', description: 'Cancel subscription', permission: 'subscription-management.manage', authRequired: true },
      { method: 'PATCH', path: '/api/v1/subscription-management/{id}/pause', description: 'Pause subscription', permission: 'subscription-management.manage', authRequired: true }
    ],
    services: ['SubscriptionService', 'BillingService'],
    events: ['SubscriptionCreated', 'SubscriptionCancelled', 'PaymentProcessed'],
    jobs: ['ProcessRecurringPaymentsJob', 'CheckExpiredSubscriptionsJob'],
    dependencies: [1, 563],
    tests: ['SubscriptionCrudTest', 'SubscriptionLifecycleTest']
  }),
  buildModule({
    id: 575,
    name: 'Affiliate Management',
    slug: 'affiliate-management',
    category: 'Commerce',
    phase: 29,
    iconName: 'Link',
    purpose: 'Affiliate program management for tracking referrals and commissions.',
    responsibilities: [
      'Manage affiliate accounts and links',
      'Track referral conversions and commissions',
      'Process affiliate payouts'
    ],
    tableName: 'affiliates',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'user_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'affiliate_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'commission_rate', type: 'DECIMAL(5,2)', nullable: false },
      { name: 'total_earnings', type: 'DECIMAL(10,2)', nullable: false },
      { name: 'pending_earnings', type: 'DECIMAL(10,2)', nullable: false },
      { name: 'status', type: 'ENUM("active","inactive","suspended")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/affiliate-management', description: 'Register new affiliate', permission: 'affiliate-management.create', authRequired: true },
      { method: 'GET', path: '/api/v1/affiliate-management', description: 'List all affiliates', permission: 'affiliate-management.view', authRequired: true },
      { method: 'GET', path: '/api/v1/affiliate-management/{id}/stats', description: 'Get affiliate statistics', permission: 'affiliate-management.view', authRequired: true },
      { method: 'POST', path: '/api/v1/affiliate-management/{id}/payout', description: 'Process affiliate payout', permission: 'affiliate-management.manage', authRequired: true }
    ],
    services: ['AffiliateService', 'CommissionService'],
    events: ['AffiliateRegistered', 'ReferralConverted', 'PayoutProcessed'],
    jobs: ['CalculateCommissionsJob', 'ProcessAffiliatePayoutsJob'],
    dependencies: [1],
    tests: ['AffiliateCrudTest', 'CommissionCalculationTest']
  }),
  buildModule({
    id: 576,
    name: 'Return Management',
    slug: 'return-management',
    category: 'Commerce',
    phase: 29,
    iconName: 'RotateCcw',
    purpose: 'Product return and refund processing system.',
    responsibilities: [
      'Process return requests',
      'Manage return status and refunds',
      'Track return reasons and analytics'
    ],
    tableName: 'returns',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'order_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'customer_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reason', type: 'TEXT', nullable: false },
      { name: 'status', type: 'ENUM("requested","approved","rejected","shipped","received","refunded")', nullable: false },
      { name: 'refund_amount', type: 'DECIMAL(10,2)', nullable: true },
      { name: 'refunded_at', type: 'TIMESTAMP', nullable: true },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/return-management', description: 'Request return', permission: 'return-management.create', authRequired: true },
      { method: 'GET', path: '/api/v1/return-management', description: 'List all returns', permission: 'return-management.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/return-management/{id}/approve', description: 'Approve return', permission: 'return-management.manage', authRequired: true },
      { method: 'POST', path: '/api/v1/return-management/{id}/refund', description: 'Process refund', permission: 'return-management.manage', authRequired: true }
    ],
    services: ['ReturnService', 'RefundService'],
    events: ['ReturnRequested', 'ReturnApproved', 'RefundProcessed'],
    jobs: ['ProcessRefundJob'],
    dependencies: [1, 563],
    tests: ['ReturnCrudTest', 'RefundProcessingTest']
  }),
  buildModule({
    id: 577,
    name: 'Product Review Management',
    slug: 'product-review-management',
    category: 'Commerce',
    phase: 29,
    iconName: 'MessageCircle',
    purpose: 'Product review and rating management for e-commerce.',
    responsibilities: [
      'Collect and display product reviews',
      'Moderate review content',
      'Provide review analytics and insights'
    ],
    tableName: 'product_reviews',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'product_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'customer_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'rating', type: 'TINYINT UNSIGNED', nullable: false },
      { name: 'title', type: 'VARCHAR(255)', nullable: true },
      { name: 'content', type: 'TEXT', nullable: false },
      { name: 'status', type: 'ENUM("pending","approved","rejected")', nullable: false },
      { name: 'helpful_count', type: 'INT UNSIGNED', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/product-review-management', description: 'Submit product review', permission: 'product-review-management.create', authRequired: true },
      { method: 'GET', path: '/api/v1/product-review-management', description: 'List reviews for product', permission: 'product-review-management.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/product-review-management/{id}/approve', description: 'Approve review', permission: 'product-review-management.manage', authRequired: true },
      { method: 'POST', path: '/api/v1/product-review-management/{id}/helpful', description: 'Mark review as helpful', permission: 'product-review-management.view', authRequired: true }
    ],
    services: ['ProductReviewService', 'ReviewModerationService'],
    events: ['ReviewSubmitted', 'ReviewApproved', 'ReviewMarkedHelpful'],
    jobs: ['ModerateReviewJob', 'UpdateProductRatingJob'],
    dependencies: [1, 562],
    tests: ['ProductReviewCrudTest', 'ReviewModerationTest']
  }),
  buildModule({
    id: 578,
    name: 'Wishlist Management',
    slug: 'wishlist-management',
    category: 'Commerce',
    phase: 29,
    iconName: 'Heart',
    purpose: 'Wishlist and saved items management for customers.',
    responsibilities: [
      'Create and manage wishlists',
      'Add and remove items from wishlists',
      'Share wishlists with others'
    ],
    tableName: 'wishlists',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'user_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'name', type: 'VARCHAR(255)', nullable: false },
      { name: 'is_public', type: 'BOOLEAN', nullable: false },
      { name: 'items_count', type: 'INT UNSIGNED', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/wishlist-management', description: 'Create new wishlist', permission: 'wishlist-management.create', authRequired: true },
      { method: 'GET', path: '/api/v1/wishlist-management', description: 'List my wishlists', permission: 'wishlist-management.view', authRequired: true },
      { method: 'POST', path: '/api/v1/wishlist-management/{id}/items', description: 'Add item to wishlist', permission: 'wishlist-management.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/wishlist-management/{id}/items/{itemId}', description: 'Remove item from wishlist', permission: 'wishlist-management.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/wishlist-management/{id}', description: 'Delete wishlist', permission: 'wishlist-management.delete', authRequired: true }
    ],
    services: ['WishlistService', 'WishlistShareService'],
    events: ['WishlistCreated', 'ItemAddedToWishlist', 'ItemRemovedFromWishlist'],
    jobs: ['NotifyWishlistPriceDropJob'],
    dependencies: [1, 562],
    tests: ['WishlistCrudTest', 'WishlistItemManagementTest']
  }),
  buildModule({
    id: 579,
    name: 'Payment Method Management',
    slug: 'payment-method-management',
    category: 'Financial',
    phase: 29,
    iconName: 'CreditCard',
    purpose: 'Payment method storage and management for customer transactions.',
    responsibilities: [
      'Store and tokenize payment methods',
      'Manage default payment methods',
      'Provide payment method verification'
    ],
    tableName: 'payment_methods',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'customer_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'type', type: 'ENUM("credit_card","debit_card","bank_account","digital_wallet")', nullable: false },
      { name: 'last_four', type: 'CHAR(4)', nullable: false },
      { name: 'brand', type: 'VARCHAR(32)', nullable: true },
      { name: 'expiry_month', type: 'TINYINT UNSIGNED', nullable: true },
      { name: 'expiry_year', type: 'SMALLINT UNSIGNED', nullable: true },
      { name: 'is_default', type: 'BOOLEAN', nullable: false },
      { name: 'status', type: 'ENUM("active","expired","deleted")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/payment-method-management', description: 'Add new payment method', permission: 'payment-method-management.create', authRequired: true },
      { method: 'GET', path: '/api/v1/payment-method-management', description: 'List my payment methods', permission: 'payment-method-management.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/payment-method-management/{id}/default', description: 'Set as default payment method', permission: 'payment-method-management.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/payment-method-management/{id}', description: 'Delete payment method', permission: 'payment-method-management.delete', authRequired: true }
    ],
    services: ['PaymentMethodService', 'PaymentTokenizationService'],
    events: ['PaymentMethodAdded', 'PaymentMethodDefaultChanged', 'PaymentMethodDeleted'],
    jobs: ['CheckExpiredPaymentMethodsJob'],
    dependencies: [1, 563],
    tests: ['PaymentMethodCrudTest', 'PaymentMethodDefaultTest']
  }),
  buildModule({
    id: 580,
    name: 'Tax Management',
    slug: 'tax-management',
    category: 'Financial',
    phase: 29,
    iconName: 'Calculator',
    purpose: 'Tax rate configuration and calculation management.',
    responsibilities: [
      'Configure tax rates and rules',
      'Calculate taxes for transactions',
      'Provide tax reports and summaries'
    ],
    tableName: 'tax_rates',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'name', type: 'VARCHAR(255)', nullable: false },
      { name: 'rate', type: 'DECIMAL(5,4)', nullable: false },
      { name: 'type', type: 'ENUM("percentage","fixed")', nullable: false },
      { name: 'country', type: 'VARCHAR(2)', nullable: true },
      { name: 'state', type: 'VARCHAR(64)', nullable: true },
      { name: 'is_active', type: 'BOOLEAN', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/tax-management', description: 'Create new tax rate', permission: 'tax-management.create', authRequired: true },
      { method: 'GET', path: '/api/v1/tax-management', description: 'List all tax rates', permission: 'tax-management.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/tax-management/{id}', description: 'Update tax rate', permission: 'tax-management.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/tax-management/{id}', description: 'Delete tax rate', permission: 'tax-management.delete', authRequired: true }
    ],
    services: ['TaxService', 'TaxCalculationService'],
    events: ['TaxRateCreated', 'TaxRateUpdated'],
    jobs: ['RecalculateTaxRatesJob'],
    dependencies: [1],
    tests: ['TaxCrudTest', 'TaxCalculationTest']
  }),
  buildModule({
    id: 581,
    name: 'Shipping Rate Management',
    slug: 'shipping-rate-management',
    category: 'Logistics & Supply Chain',
    phase: 29,
    iconName: 'Truck',
    purpose: 'Shipping rate configuration and management for order fulfillment.',
    responsibilities: [
      'Configure shipping rates by zone and method',
      'Calculate shipping costs for orders',
      'Manage shipping rate rules and exceptions'
    ],
    tableName: 'shipping_rates',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'name', type: 'VARCHAR(255)', nullable: false },
      { name: 'method', type: 'VARCHAR(128)', nullable: false },
      { name: 'zone', type: 'VARCHAR(128)', nullable: false, index: true },
      { name: 'min_weight', type: 'DECIMAL(8,2)', nullable: true },
      { name: 'max_weight', type: 'DECIMAL(8,2)', nullable: true },
      { name: 'rate', type: 'DECIMAL(10,2)', nullable: false },
      { name: 'is_active', type: 'BOOLEAN', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/shipping-rate-management', description: 'Create new shipping rate', permission: 'shipping-rate-management.create', authRequired: true },
      { method: 'GET', path: '/api/v1/shipping-rate-management', description: 'List all shipping rates', permission: 'shipping-rate-management.view', authRequired: true },
      { method: 'POST', path: '/api/v1/shipping-rate-management/calculate', description: 'Calculate shipping cost', permission: 'shipping-rate-management.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/shipping-rate-management/{id}', description: 'Update shipping rate', permission: 'shipping-rate-management.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/shipping-rate-management/{id}', description: 'Delete shipping rate', permission: 'shipping-rate-management.delete', authRequired: true }
    ],
    services: ['ShippingRateService', 'ShippingCalculationService'],
    events: ['ShippingRateCreated', 'ShippingRateUpdated'],
    jobs: ['RecalculateShippingRatesJob'],
    dependencies: [1],
    tests: ['ShippingRateCrudTest', 'ShippingCalculationTest']
  }),
  buildModule({
    id: 582,
    name: 'Address Management',
    slug: 'address-management',
    category: 'Identity & Access',
    phase: 29,
    iconName: 'MapPin',
    purpose: 'User address book management for billing and shipping addresses.',
    responsibilities: [
      'Create and manage user addresses',
      'Validate address formats',
      'Set default billing and shipping addresses'
    ],
    tableName: 'addresses',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'user_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'type', type: 'ENUM("billing","shipping","both")', nullable: false },
      { name: 'line1', type: 'VARCHAR(255)', nullable: false },
      { name: 'line2', type: 'VARCHAR(255)', nullable: true },
      { name: 'city', type: 'VARCHAR(128)', nullable: false },
      { name: 'state', type: 'VARCHAR(128)', nullable: true },
      { name: 'postal_code', type: 'VARCHAR(32)', nullable: false },
      { name: 'country', type: 'VARCHAR(2)', nullable: false },
      { name: 'is_default', type: 'BOOLEAN', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/address-management', description: 'Add new address', permission: 'address-management.create', authRequired: true },
      { method: 'GET', path: '/api/v1/address-management', description: 'List my addresses', permission: 'address-management.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/address-management/{id}', description: 'Update address', permission: 'address-management.manage', authRequired: true },
      { method: 'PATCH', path: '/api/v1/address-management/{id}/default', description: 'Set as default address', permission: 'address-management.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/address-management/{id}', description: 'Delete address', permission: 'address-management.delete', authRequired: true }
    ],
    services: ['AddressService', 'AddressValidationService'],
    events: ['AddressCreated', 'AddressUpdated', 'AddressDeleted'],
    jobs: ['ValidateAddressFormatsJob'],
    dependencies: [1],
    tests: ['AddressCrudTest', 'AddressDefaultTest']
  }),
  buildModule({
    id: 583,
    name: 'Notification Preference',
    slug: 'notification-preference',
    category: 'System & Governance',
    phase: 29,
    iconName: 'Settings',
    purpose: 'User notification preferences and channel configuration.',
    responsibilities: [
      'Manage notification channel preferences',
      'Configure notification frequency',
      'Provide opt-in and opt-out management'
    ],
    tableName: 'notification_preferences',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'user_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'channel', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'category', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'is_enabled', type: 'BOOLEAN', nullable: false },
      { name: 'frequency', type: 'ENUM("immediate","daily","weekly","never")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'GET', path: '/api/v1/notification-preference', description: 'Get my notification preferences', permission: 'notification-preference.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/notification-preference/{id}', description: 'Update notification preference', permission: 'notification-preference.manage', authRequired: true },
      { method: 'PATCH', path: '/api/v1/notification-preference/bulk', description: 'Update multiple preferences', permission: 'notification-preference.manage', authRequired: true }
    ],
    services: ['NotificationPreferenceService'],
    events: ['PreferenceUpdated'],
    jobs: [],
    dependencies: [1, 549],
    tests: ['NotificationPreferenceTest']
  }),
  buildModule({
    id: 584,
    name: 'Session Management',
    slug: 'session-management',
    category: 'System & Governance',
    phase: 29,
    iconName: 'Monitor',
    purpose: 'User session tracking and management for security.',
    responsibilities: [
      'Track active user sessions',
      'Manage session expiration',
      'Provide session revocation capabilities'
    ],
    tableName: 'user_sessions',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'user_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'ip_address', type: 'VARCHAR(45)', nullable: false },
      { name: 'user_agent', type: 'TEXT', nullable: true },
      { name: 'last_activity_at', type: 'TIMESTAMP', nullable: false },
      { name: 'expires_at', type: 'TIMESTAMP', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'GET', path: '/api/v1/session-management', description: 'List active sessions', permission: 'session-management.view', authRequired: true },
      { method: 'DELETE', path: '/api/v1/session-management/{id}', description: 'Revoke session', permission: 'session-management.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/session-management/all', description: 'Revoke all sessions', permission: 'session-management.manage', authRequired: true }
    ],
    services: ['SessionService'],
    events: ['SessionRevoked', 'AllSessionsRevoked'],
    jobs: ['CleanExpiredSessionsJob'],
    dependencies: [1, 2],
    tests: ['SessionManagementTest']
  }),
  buildModule({
    id: 585,
    name: 'API Key Management',
    slug: 'api-key-management',
    category: 'System & Governance',
    phase: 29,
    iconName: 'Key',
    purpose: 'API key generation and management for external integrations.',
    responsibilities: [
      'Generate and manage API keys',
      'Track API key usage',
      'Provide key rotation and revocation'
    ],
    tableName: 'api_keys',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'user_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'name', type: 'VARCHAR(255)', nullable: false },
      { name: 'key_hash', type: 'VARCHAR(255)', nullable: false, index: true },
      { name: 'last_used_at', type: 'TIMESTAMP', nullable: true },
      { name: 'expires_at', type: 'TIMESTAMP', nullable: true },
      { name: 'is_active', type: 'BOOLEAN', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/api-key-management', description: 'Generate new API key', permission: 'api-key-management.create', authRequired: true },
      { method: 'GET', path: '/api/v1/api-key-management', description: 'List my API keys', permission: 'api-key-management.view', authRequired: true },
      { method: 'DELETE', path: '/api/v1/api-key-management/{id}', description: 'Revoke API key', permission: 'api-key-management.delete', authRequired: true }
    ],
    services: ['ApiKeyService'],
    events: ['ApiKeyGenerated', 'ApiKeyRevoked'],
    jobs: ['CheckExpiredApiKeysJob'],
    dependencies: [1],
    tests: ['ApiKeyCrudTest']
  }),
  buildModule({
    id: 586,
    name: 'Webhook Management',
    slug: 'webhook-management',
    category: 'System & Governance',
    phase: 29,
    iconName: 'Radio',
    purpose: 'Webhook endpoint management for event-driven integrations.',
    responsibilities: [
      'Create and manage webhook endpoints',
      'Track webhook delivery status',
      'Provide webhook retry and logging'
    ],
    tableName: 'webhooks',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'user_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'url', type: 'VARCHAR(2048)', nullable: false },
      { name: 'events', type: 'JSON', nullable: false },
      { name: 'secret', type: 'VARCHAR(255)', nullable: true },
      { name: 'is_active', type: 'BOOLEAN', nullable: false },
      { name: 'last_triggered_at', type: 'TIMESTAMP', nullable: true },
      { name: 'failure_count', type: 'INT UNSIGNED', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/webhook-management', description: 'Create new webhook', permission: 'webhook-management.create', authRequired: true },
      { method: 'GET', path: '/api/v1/webhook-management', description: 'List my webhooks', permission: 'webhook-management.view', authRequired: true },
      { method: 'POST', path: '/api/v1/webhook-management/{id}/test', description: 'Test webhook endpoint', permission: 'webhook-management.manage', authRequired: true },
      { method: 'PATCH', path: '/api/v1/webhook-management/{id}', description: 'Update webhook', permission: 'webhook-management.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/webhook-management/{id}', description: 'Delete webhook', permission: 'webhook-management.delete', authRequired: true }
    ],
    services: ['WebhookService', 'WebhookDeliveryService'],
    events: ['WebhookCreated', 'WebhookDeliveryFailed'],
    jobs: ['RetryFailedWebhooksJob'],
    dependencies: [1],
    tests: ['WebhookCrudTest', 'WebhookDeliveryTest']
  }),
  buildModule({
    id: 587,
    name: 'Audit Log Management',
    slug: 'audit-log-management',
    category: 'System & Governance',
    phase: 29,
    iconName: 'Scroll',
    purpose: 'System audit logging for tracking changes and user actions.',
    responsibilities: [
      'Record system audit events',
      'Track user actions and changes',
      'Provide audit log search and reports'
    ],
    tableName: 'audit_logs',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'user_id', type: 'BIGINT UNSIGNED', nullable: true, index: true },
      { name: 'action', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'auditable_type', type: 'VARCHAR(255)', nullable: false, index: true },
      { name: 'auditable_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'old_values', type: 'JSON', nullable: true },
      { name: 'new_values', type: 'JSON', nullable: true },
      { name: 'ip_address', type: 'VARCHAR(45)', nullable: true },
      { name: 'user_agent', type: 'TEXT', nullable: true },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'GET', path: '/api/v1/audit-log-management', description: 'List audit logs', permission: 'audit-log-management.view', authRequired: true },
      { method: 'GET', path: '/api/v1/audit-log-management/{id}', description: 'Get audit log details', permission: 'audit-log-management.view', authRequired: true }
    ],
    services: ['AuditLogService'],
    events: [],
    jobs: ['CleanOldAuditLogsJob'],
    dependencies: [1],
    tests: ['AuditLogTest']
  }),
  buildModule({
    id: 588,
    name: 'System Setting Management',
    slug: 'system-setting-management',
    category: 'System & Governance',
    phase: 29,
    iconName: 'Sliders',
    purpose: 'System-wide configuration and settings management.',
    responsibilities: [
      'Store and retrieve system settings',
      'Manage feature flags and toggles',
      'Provide settings cache management'
    ],
    tableName: 'system_settings',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'group', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'key', type: 'VARCHAR(128)', nullable: false, index: true },
      { name: 'value', type: 'TEXT', nullable: true },
      { name: 'type', type: 'ENUM("string","integer","boolean","json")', nullable: false },
      { name: 'is_public', type: 'BOOLEAN', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'GET', path: '/api/v1/system-setting-management', description: 'List all settings', permission: 'system-setting-management.view', authRequired: true },
      { method: 'GET', path: '/api/v1/system-setting-management/{group}', description: 'Get settings by group', permission: 'system-setting-management.view', authRequired: true },
      { method: 'PUT', path: '/api/v1/system-setting-management/{group}/{key}', description: 'Update setting value', permission: 'system-setting-management.manage', authRequired: true },
      { method: 'POST', path: '/api/v1/system-setting-management/cache/flush', description: 'Flush settings cache', permission: 'system-setting-management.manage', authRequired: true }
    ],
    services: ['SystemSettingService', 'SettingsCacheService'],
    events: ['SettingUpdated', 'SettingsCacheFlushed'],
    jobs: ['WarmSettingsCacheJob'],
    dependencies: [1],
    tests: ['SystemSettingTest']
  }),
  buildModule({
    id: 589,
    name: 'Email Template Management',
    slug: 'email-template-management',
    category: 'Communication',
    phase: 29,
    iconName: 'Mail',
    purpose: 'Email template creation and management for system notifications.',
    responsibilities: [
      'Create and manage email templates',
      'Support template variables and preview',
      'Track template usage and performance'
    ],
    tableName: 'email_templates',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'name', type: 'VARCHAR(255)', nullable: false },
      { name: 'slug', type: 'VARCHAR(128)', nullable: false, index: true },
      { name: 'subject', type: 'VARCHAR(255)', nullable: false },
      { name: 'body', type: 'TEXT', nullable: false },
      { name: 'variables', type: 'JSON', nullable: true },
      { name: 'is_active', type: 'BOOLEAN', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/email-template-management', description: 'Create new email template', permission: 'email-template-management.create', authRequired: true },
      { method: 'GET', path: '/api/v1/email-template-management', description: 'List all templates', permission: 'email-template-management.view', authRequired: true },
      { method: 'POST', path: '/api/v1/email-template-management/{id}/preview', description: 'Preview template with data', permission: 'email-template-management.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/email-template-management/{id}', description: 'Update template', permission: 'email-template-management.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/email-template-management/{id}', description: 'Delete template', permission: 'email-template-management.delete', authRequired: true }
    ],
    services: ['EmailTemplateService', 'TemplateRenderingService'],
    events: ['TemplateCreated', 'TemplateUpdated'],
    jobs: [],
    dependencies: [1],
    tests: ['EmailTemplateCrudTest']
  }),
  buildModule({
    id: 590,
    name: 'SMS Template Management',
    slug: 'sms-template-management',
    category: 'Communication',
    phase: 29,
    iconName: 'MessageSquare',
    purpose: 'SMS template creation and management for text notifications.',
    responsibilities: [
      'Create and manage SMS templates',
      'Support template variables',
      'Track SMS sending history'
    ],
    tableName: 'sms_templates',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'name', type: 'VARCHAR(255)', nullable: false },
      { name: 'slug', type: 'VARCHAR(128)', nullable: false, index: true },
      { name: 'content', type: 'TEXT', nullable: false },
      { name: 'variables', type: 'JSON', nullable: true },
      { name: 'is_active', type: 'BOOLEAN', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/sms-template-management', description: 'Create new SMS template', permission: 'sms-template-management.create', authRequired: true },
      { method: 'GET', path: '/api/v1/sms-template-management', description: 'List all SMS templates', permission: 'sms-template-management.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/sms-template-management/{id}', description: 'Update SMS template', permission: 'sms-template-management.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/sms-template-management/{id}', description: 'Delete SMS template', permission: 'sms-template-management.delete', authRequired: true }
    ],
    services: ['SmsTemplateService'],
    events: ['SmsTemplateCreated', 'SmsTemplateUpdated'],
    jobs: [],
    dependencies: [1],
    tests: ['SmsTemplateCrudTest']
  }),
  buildModule({
    id: 591,
    name: 'Campaign Management',
    slug: 'campaign-management',
    category: 'Marketing & Growth',
    phase: 29,
    iconName: 'Target',
    purpose: 'Marketing campaign creation and management system.',
    responsibilities: [
      'Create and manage marketing campaigns',
      'Track campaign performance metrics',
      'Provide campaign analytics and reports'
    ],
    tableName: 'campaigns',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'name', type: 'VARCHAR(255)', nullable: false },
      { name: 'description', type: 'TEXT', nullable: true },
      { name: 'type', type: 'ENUM("email","sms","social","multi_channel")', nullable: false },
      { name: 'budget', type: 'DECIMAL(10,2)', nullable: true },
      { name: 'spent', type: 'DECIMAL(10,2)', nullable: false },
      { name: 'start_date', type: 'DATE', nullable: true },
      { name: 'end_date', type: 'DATE', nullable: true },
      { name: 'status', type: 'ENUM("draft","active","paused","completed","cancelled")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/campaign-management', description: 'Create new campaign', permission: 'campaign-management.create', authRequired: true },
      { method: 'GET', path: '/api/v1/campaign-management', description: 'List all campaigns', permission: 'campaign-management.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/campaign-management/{id}', description: 'Update campaign', permission: 'campaign-management.manage', authRequired: true },
      { method: 'POST', path: '/api/v1/campaign-management/{id}/activate', description: 'Activate campaign', permission: 'campaign-management.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/campaign-management/{id}', description: 'Delete campaign', permission: 'campaign-management.delete', authRequired: true }
    ],
    services: ['CampaignService', 'CampaignAnalyticsService'],
    events: ['CampaignCreated', 'CampaignActivated', 'CampaignCompleted'],
    jobs: ['TrackCampaignMetricsJob'],
    dependencies: [1],
    tests: ['CampaignCrudTest', 'CampaignAnalyticsTest']
  }),
  buildModule({
    id: 592,
    name: 'Banner Management',
    slug: 'banner-management',
    category: 'Marketing & Growth',
    phase: 29,
    iconName: 'Image',
    purpose: 'Website banner and promotional content management.',
    responsibilities: [
      'Create and manage banners',
      'Schedule banner display periods',
      'Track banner impressions and clicks'
    ],
    tableName: 'banners',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'title', type: 'VARCHAR(255)', nullable: false },
      { name: 'image_url', type: 'VARCHAR(512)', nullable: false },
      { name: 'link_url', type: 'VARCHAR(2048)', nullable: true },
      { name: 'position', type: 'VARCHAR(64)', nullable: false },
      { name: 'starts_at', type: 'TIMESTAMP', nullable: true },
      { name: 'expires_at', type: 'TIMESTAMP', nullable: true },
      { name: 'impression_count', type: 'INT UNSIGNED', nullable: false },
      { name: 'click_count', type: 'INT UNSIGNED', nullable: false },
      { name: 'is_active', type: 'BOOLEAN', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/banner-management', description: 'Create new banner', permission: 'banner-management.create', authRequired: true },
      { method: 'GET', path: '/api/v1/banner-management', description: 'List all banners', permission: 'banner-management.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/banner-management/{id}', description: 'Update banner', permission: 'banner-management.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/banner-management/{id}', description: 'Delete banner', permission: 'banner-management.delete', authRequired: true }
    ],
    services: ['BannerService', 'BannerAnalyticsService'],
    events: ['BannerCreated', 'BannerImpression', 'BannerClick'],
    jobs: ['ExpireBannersJob'],
    dependencies: [1],
    tests: ['BannerCrudTest']
  }),
  buildModule({
    id: 593,
    name: 'Tagline Management',
    slug: 'tagline-management',
    category: 'Marketing & Growth',
    phase: 29,
    iconName: 'Quote',
    purpose: 'Marketing tagline and slogan management for brand messaging.',
    responsibilities: [
      'Create and manage marketing taglines',
      'A/B test different taglines',
      'Track tagline performance metrics'
    ],
    tableName: 'taglines',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'content', type: 'VARCHAR(500)', nullable: false },
      { name: 'context', type: 'VARCHAR(128)', nullable: true },
      { name: 'is_active', type: 'BOOLEAN', nullable: false },
      { name: 'impression_count', type: 'INT UNSIGNED', nullable: false },
      { name: 'conversion_count', type: 'INT UNSIGNED', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/tagline-management', description: 'Create new tagline', permission: 'tagline-management.create', authRequired: true },
      { method: 'GET', path: '/api/v1/tagline-management', description: 'List all taglines', permission: 'tagline-management.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/tagline-management/{id}', description: 'Update tagline', permission: 'tagline-management.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/tagline-management/{id}', description: 'Delete tagline', permission: 'tagline-management.delete', authRequired: true }
    ],
    services: ['TaglineService'],
    events: ['TaglineCreated', 'TaglineUpdated'],
    jobs: [],
    dependencies: [1],
    tests: ['TaglineCrudTest']
  }),
  buildModule({
    id: 594,
    name: 'Link Management',
    slug: 'link-management',
    category: 'Marketing & Growth',
    phase: 29,
    iconName: 'ExternalLink',
    purpose: 'Short link and URL redirection management.',
    responsibilities: [
      'Create and manage short links',
      'Track link clicks and analytics',
      'Provide link expiration and redirection'
    ],
    tableName: 'short_links',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'user_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'original_url', type: 'VARCHAR(2048)', nullable: false },
      { name: 'short_code', type: 'VARCHAR(32)', nullable: false, index: true },
      { name: 'title', type: 'VARCHAR(255)', nullable: true },
      { name: 'click_count', type: 'INT UNSIGNED', nullable: false },
      { name: 'expires_at', type: 'TIMESTAMP', nullable: true },
      { name: 'is_active', type: 'BOOLEAN', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/link-management', description: 'Create short link', permission: 'link-management.create', authRequired: true },
      { method: 'GET', path: '/api/v1/link-management', description: 'List my links', permission: 'link-management.view', authRequired: true },
      { method: 'GET', path: '/api/v1/link-management/{code}/stats', description: 'Get link statistics', permission: 'link-management.view', authRequired: true },
      { method: 'DELETE', path: '/api/v1/link-management/{id}', description: 'Delete link', permission: 'link-management.delete', authRequired: true }
    ],
    services: ['LinkService', 'LinkAnalyticsService'],
    events: ['LinkCreated', 'LinkClicked'],
    jobs: ['CleanExpiredLinksJob'],
    dependencies: [1],
    tests: ['LinkCrudTest', 'LinkAnalyticsTest']
  }),
  buildModule({
    id: 595,
    name: 'Feedback Management',
    slug: 'feedback-management',
    category: 'Operations & Productivity',
    phase: 29,
    iconName: 'MessageSquare',
    purpose: 'User feedback collection and management system.',
    responsibilities: [
      'Collect user feedback and suggestions',
      'Track feedback status and responses',
      'Provide feedback analytics and insights'
    ],
    tableName: 'feedback',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'user_id', type: 'BIGINT UNSIGNED', nullable: true, index: true },
      { name: 'category', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'subject', type: 'VARCHAR(255)', nullable: false },
      { name: 'content', type: 'TEXT', nullable: false },
      { name: 'status', type: 'ENUM("new","reviewing","planned","completed","declined")', nullable: false },
      { name: 'priority', type: 'ENUM("low","medium","high")', nullable: false },
      { name: 'votes_count', type: 'INT UNSIGNED', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/feedback-management', description: 'Submit feedback', permission: 'feedback-management.create', authRequired: true },
      { method: 'GET', path: '/api/v1/feedback-management', description: 'List all feedback', permission: 'feedback-management.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/feedback-management/{id}', description: 'Update feedback status', permission: 'feedback-management.manage', authRequired: true },
      { method: 'POST', path: '/api/v1/feedback-management/{id}/vote', description: 'Vote on feedback', permission: 'feedback-management.view', authRequired: true }
    ],
    services: ['FeedbackService'],
    events: ['FeedbackSubmitted', 'FeedbackStatusChanged', 'FeedbackVoted'],
    jobs: ['AggregateFeedbackVotesJob'],
    dependencies: [1],
    tests: ['FeedbackCrudTest']
  }),
  buildModule({
    id: 596,
    name: 'Changelog Management',
    slug: 'changelog-management',
    category: 'System & Governance',
    phase: 29,
    iconName: 'FileText',
    purpose: 'Product changelog and release notes management.',
    responsibilities: [
      'Create and publish changelog entries',
      'Organize changes by version and category',
      'Provide changelog subscription and notifications'
    ],
    tableName: 'changelogs',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'version', type: 'VARCHAR(32)', nullable: false, index: true },
      { name: 'title', type: 'VARCHAR(255)', nullable: false },
      { name: 'content', type: 'TEXT', nullable: false },
      { name: 'type', type: 'ENUM("feature","improvement","bugfix","security","breaking")', nullable: false },
      { name: 'is_published', type: 'BOOLEAN', nullable: false },
      { name: 'published_at', type: 'TIMESTAMP', nullable: true },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/changelog-management', description: 'Create new changelog entry', permission: 'changelog-management.create', authRequired: true },
      { method: 'GET', path: '/api/v1/changelog-management', description: 'List published changelogs', permission: 'changelog-management.view', authRequired: false },
      { method: 'PATCH', path: '/api/v1/changelog-management/{id}', description: 'Update changelog', permission: 'changelog-management.manage', authRequired: true },
      { method: 'POST', path: '/api/v1/changelog-management/{id}/publish', description: 'Publish changelog', permission: 'changelog-management.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/changelog-management/{id}', description: 'Delete changelog', permission: 'changelog-management.delete', authRequired: true }
    ],
    services: ['ChangelogService'],
    events: ['ChangelogCreated', 'ChangelogPublished'],
    jobs: ['NotifyChangelogSubscribersJob'],
    dependencies: [1],
    tests: ['ChangelogCrudTest']
  }),
  buildModule({
    id: 597,
    name: 'Feature Flag Management',
    slug: 'feature-flag-management',
    category: 'System & Governance',
    phase: 29,
    iconName: 'ToggleLeft',
    purpose: 'Feature flag and toggle management for controlled rollouts.',
    responsibilities: [
      'Create and manage feature flags',
      'Control feature access by user segments',
      'Provide flag analytics and metrics'
    ],
    tableName: 'feature_flags',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'name', type: 'VARCHAR(128)', nullable: false, index: true },
      { name: 'description', type: 'TEXT', nullable: true },
      { name: 'is_enabled', type: 'BOOLEAN', nullable: false },
      { name: 'rollout_percentage', type: 'TINYINT UNSIGNED', nullable: false },
      { name: 'target_segments', type: 'JSON', nullable: true },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'POST', path: '/api/v1/feature-flag-management', description: 'Create new feature flag', permission: 'feature-flag-management.create', authRequired: true },
      { method: 'GET', path: '/api/v1/feature-flag-management', description: 'List all feature flags', permission: 'feature-flag-management.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/feature-flag-management/{id}', description: 'Update feature flag', permission: 'feature-flag-management.manage', authRequired: true },
      { method: 'POST', path: '/api/v1/feature-flag-management/{id}/toggle', description: 'Toggle feature flag', permission: 'feature-flag-management.manage', authRequired: true }
    ],
    services: ['FeatureFlagService', 'FeatureFlagEvaluationService'],
    events: ['FeatureFlagCreated', 'FeatureFlagToggled'],
    jobs: ['SyncFeatureFlagsJob'],
    dependencies: [1],
    tests: ['FeatureFlagCrudTest']
  }),
  buildModule({
    id: 598,
    name: 'Cache Management',
    slug: 'cache-management',
    category: 'System & Governance',
    phase: 29,
    iconName: 'Database',
    purpose: 'System cache management and monitoring tools.',
    responsibilities: [
      'Monitor cache hit rates and performance',
      'Provide cache flush and invalidation',
      'Track cache usage and analytics'
    ],
    tableName: 'cache_entries',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'key', type: 'VARCHAR(255)', nullable: false, index: true },
      { name: 'store', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'tags', type: 'JSON', nullable: true },
      { name: 'size_bytes', type: 'INT UNSIGNED', nullable: true },
      { name: 'hit_count', type: 'INT UNSIGNED', nullable: false },
      { name: 'expires_at', type: 'TIMESTAMP', nullable: true },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'GET', path: '/api/v1/cache-management', description: 'List cache entries', permission: 'cache-management.view', authRequired: true },
      { method: 'GET', path: '/api/v1/cache-management/stats', description: 'Get cache statistics', permission: 'cache-management.view', authRequired: true },
      { method: 'POST', path: '/api/v1/cache-management/flush', description: 'Flush cache by store/tags', permission: 'cache-management.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/cache-management/{key}', description: 'Delete specific cache entry', permission: 'cache-management.manage', authRequired: true }
    ],
    services: ['CacheManagementService'],
    events: ['CacheFlushed', 'CacheEntryDeleted'],
    jobs: ['CleanExpiredCacheEntriesJob'],
    dependencies: [1],
    tests: ['CacheManagementTest']
  }),
  buildModule({
    id: 599,
    name: 'Queue Management',
    slug: 'queue-management',
    category: 'System & Governance',
    phase: 29,
    iconName: 'ListOrdered',
    purpose: 'Background job queue monitoring and management.',
    responsibilities: [
      'Monitor queue status and job counts',
      'Provide job retry and cancellation',
      'Track queue performance metrics'
    ],
    tableName: 'queue_jobs',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'job_name', type: 'VARCHAR(255)', nullable: false, index: true },
      { name: 'queue', type: 'VARCHAR(128)', nullable: false, index: true },
      { name: 'status', type: 'ENUM("pending","processing","completed","failed","retrying")', nullable: false },
      { name: 'payload', type: 'JSON', nullable: true },
      { name: 'attempts', type: 'TINYINT UNSIGNED', nullable: false },
      { name: 'max_attempts', type: 'TINYINT UNSIGNED', nullable: false },
      { name: 'failed_at', type: 'TIMESTAMP', nullable: true },
      { name: 'completed_at', type: 'TIMESTAMP', nullable: true },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'GET', path: '/api/v1/queue-management', description: 'List queue jobs', permission: 'queue-management.view', authRequired: true },
      { method: 'GET', path: '/api/v1/queue-management/stats', description: 'Get queue statistics', permission: 'queue-management.view', authRequired: true },
      { method: 'POST', path: '/api/v1/queue-management/{id}/retry', description: 'Retry failed job', permission: 'queue-management.manage', authRequired: true },
      { method: 'DELETE', path: '/api/v1/queue-management/{id}', description: 'Delete job', permission: 'queue-management.manage', authRequired: true }
    ],
    services: ['QueueManagementService'],
    events: ['JobRetried', 'JobDeleted'],
    jobs: ['MonitorQueueHealthJob'],
    dependencies: [1],
    tests: ['QueueManagementTest']
  }),
  buildModule({
    id: 600,
    name: 'Scheduled Task Management',
    slug: 'scheduled-task-management',
    category: 'System & Governance',
    phase: 29,
    iconName: 'Clock',
    purpose: 'Scheduled task and cron job management and monitoring.',
    responsibilities: [
      'Monitor scheduled task execution',
      'Track task history and performance',
      'Provide task pause and resume capabilities'
    ],
    tableName: 'scheduled_tasks',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'name', type: 'VARCHAR(255)', nullable: false, index: true },
      { name: 'command', type: 'VARCHAR(500)', nullable: false },
      { name: 'schedule', type: 'VARCHAR(128)', nullable: false },
      { name: 'is_active', type: 'BOOLEAN', nullable: false },
      { name: 'last_run_at', type: 'TIMESTAMP', nullable: true },
      { name: 'next_run_at', type: 'TIMESTAMP', nullable: true },
      { name: 'last_status', type: 'ENUM("success","failed","running")', nullable: true },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ],
    endpoints: [
      { method: 'GET', path: '/api/v1/scheduled-task-management', description: 'List all scheduled tasks', permission: 'scheduled-task-management.view', authRequired: true },
      { method: 'PATCH', path: '/api/v1/scheduled-task-management/{id}', description: 'Update scheduled task', permission: 'scheduled-task-management.manage', authRequired: true },
      { method: 'POST', path: '/api/v1/scheduled-task-management/{id}/run', description: 'Manually run task', permission: 'scheduled-task-management.manage', authRequired: true },
      { method: 'PATCH', path: '/api/v1/scheduled-task-management/{id}/toggle', description: 'Enable/disable task', permission: 'scheduled-task-management.manage', authRequired: true }
    ],
    services: ['ScheduledTaskService'],
    events: ['TaskScheduled', 'TaskExecuted'],
    jobs: ['MonitorScheduledTasksJob'],
    dependencies: [1],
    tests: ['ScheduledTaskTest']
  })
];