import { buildModule } from './moduleBuilderHelper';

export const modulesDomain19_20 = [
  // ========================================================
  // DOMAIN 19: MEDIA, ENTERTAINMENT & PUBLISHING (341-370)
  // ========================================================
  buildModule({
    id: 341,
    name: 'Digital Rights Management (DRM) Licensing',
    slug: 'drm-licensing',
    category: 'Media & Entertainment',
    phase: 3,
    iconName: 'Lock',
    purpose: 'Widevine, FairPlay, and PlayReady DRM key generation, license servers, territorial geo-blocking, and concurrency limits.',
    responsibilities: [
      'Issue encrypted DRM playback licenses conforming to Google Widevine, Apple FairPlay, and Microsoft PlayReady',
      'Enforce maximum concurrent streaming video playback limits per subscriber household account',
      'Apply geographic IP whitelist/blacklist filtering ensuring territory-specific film distribution rights'
    ],
    tableName: 'drm_licenses',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'license_id', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'content_id', type: 'BIGINT UNSIGNED', nullable: false },
      { name: 'drm_type', type: 'ENUM("Widevine","FairPlay","PlayReady")', nullable: false },
      { name: 'license_key', type: 'TEXT', nullable: false },
      { name: 'territory_code', type: 'CHAR(2)', nullable: false },
      { name: 'max_concurrent_streams', type: 'INT UNSIGNED', nullable: false },
      { name: 'expiration_date', type: 'TIMESTAMP', nullable: true },
      { name: 'status', type: 'ENUM("active","revoked","expired")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 342,
    name: 'Content Delivery Network (CDN) Cache Purge',
    slug: 'cdn-cache-purge',
    category: 'Media & Entertainment',
    phase: 2,
    iconName: 'Globe',
    purpose: 'Fastly, Cloudflare, and Akamai API cache invalidation, edge header rules, surrogate keys, and bandwidth telemetry.',
    responsibilities: [
      'Dispatch instantaneous edge cache invalidation requests via surrogate keys / cache tags across global PoPs',
      'Configure dynamic edge cache-control headers and stale-while-revalidate serving policies',
      'Monitor global egress network bandwidth consumption and cache hit ratio analytics'
    ],
    tableName: 'cdn_purge_requests',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'request_id', type: 'VARCHAR(36)', nullable: false, index: true },
      { name: 'cdn_provider', type: 'ENUM("Fastly","Cloudflare","Akamai")', nullable: false },
      { name: 'surrogate_keys', type: 'JSON', nullable: true },
      { name: 'edge_pops', type: 'JSON', nullable: true },
      { name: 'invalidation_type', type: 'ENUM("purge_all","purge_key","purge_url")', nullable: false },
      { name: 'status', type: 'ENUM("pending","completed","failed")', nullable: false },
      { name: 'bandwidth_megabytes', type: 'DECIMAL(12,2)', nullable: true },
      { name: 'cache_hit_ratio', type: 'DECIMAL(5,4)', nullable: true },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'completed_at', type: 'TIMESTAMP', nullable: true }
    ]
  }),
  buildModule({
    id: 343,
    name: 'Royalty Distribution & Music Publishing',
    slug: 'royalty-distribution',
    category: 'Media & Entertainment',
    phase: 3,
    iconName: 'Music',
    purpose: 'Mechanical, performance, and synchronization royalty accounting, PRO distribution splits (ASCAP/BMI), and statements.',
    responsibilities: [
      'Calculate songwriter and publisher mechanical royalties based on per-stream statutory rate formulas',
      'Process Performance Rights Organization (PRO) cue sheets for television and film music placement',
      'Generate quarterly itemized royalty payment distribution statements with split percentages'
    ],
    tableName: 'music_royalties',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'royalty_id', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'song_id', type: 'BIGINT UNSIGNED', nullable: false },
      { name: 'songwriter_id', type: 'BIGINT UNSIGNED', nullable: false },
      { name: 'royalty_type', type: 'ENUM("mechanical","performance","synchronization")', nullable: false },
      { name: 'pro_code', type: 'ENUM("ASCAP","BMI","SESAC","GMR")', nullable: false },
      { name: 'split_percentage', type: 'DECIMAL(5,2)', nullable: false },
      { name: 'amount_usd', type: 'DECIMAL(12,2)', nullable: false },
      { name: 'statement_period', type: 'VARCHAR(7)', nullable: false },
      { name: 'payment_status', type: 'ENUM("pending","paid","held")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'paid_at', type: 'TIMESTAMP', nullable: true }
    ]
  }),
  buildModule({
    id: 344,
    name: 'Ad Insertion & VAST/VMAP Video Ads',
    slug: 'video-ad-insertion',
    category: 'Media & Entertainment',
    phase: 3,
    iconName: 'Tv',
    purpose: 'Server-Side Ad Insertion (SSAI), VAST 4.2 / VMAP playlist stitching, ad podding, and ad viewability tracking.',
    responsibilities: [
      'Stitch targeted pre-roll, mid-roll, and post-roll video advertisements seamlessly into HLS and DASH video manifests',
      'Bypass ad blockers using Server-Side Ad Insertion (SSAI) while preserving interactive client-side impression telemetry',
      'Enforce frequency capping preventing repetitive commercial ads from displaying to the same viewer'
    ],
    tableName: 'ad_insertions',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'insertion_id', type: 'VARCHAR(36)', nullable: false, index: true },
      { name: 'content_id', type: 'BIGINT UNSIGNED', nullable: false },
      { name: 'ad_pod_position', type: 'ENUM("pre-roll","mid-roll","post-roll")', nullable: false },
      { name: 'vast_version', type: 'ENUM("VAST_4.2","VMAP")', nullable: false },
      { name: 'ad_creative_id', type: 'BIGINT UNSIGNED', nullable: false },
      { name: 'duration_seconds', type: 'INT UNSIGNED', nullable: false },
      { name: 'viewability_score', type: 'DECIMAL(5,4)', nullable: true },
      { name: 'impression_count', type: 'INT UNSIGNED', nullable: false },
      { name: 'status', type: 'ENUM("active","paused","completed")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'completed_at', type: 'TIMESTAMP', nullable: true }
    ]
  }),
  buildModule({
    id: 345,
    name: 'Podcast RSS & Distribution Syndication',
    slug: 'podcast-syndication',
    category: 'Media & Entertainment',
    phase: 2,
    iconName: 'Mic',
    purpose: 'Apple Podcasts and Spotify compliant XML feeds, dynamic audio ad insertion, chapter markers, and IAB certified metrics.',
    responsibilities: [
      'Publish IAB v2.1 compliant podcast RSS feeds with rich episode metadata and ID3 chapter tags',
      'Execute dynamic audio pre-roll and mid-roll audio stitching during MP3 file streaming downloads',
      'Filter bot traffic and compute certified unique listener download metrics adhering to IAB measurement standards'
    ],
    tableName: 'podcast_episodes',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'episode_id', type: 'VARCHAR(64)', nullable: false, index: true },
      { name: 'podcast_id', type: 'BIGINT UNSIGNED', nullable: false },
      { name: 'title', type: 'VARCHAR(255)', nullable: false },
      { name: 'duration_seconds', type: 'INT UNSIGNED', nullable: false },
      { name: 'audio_url', type: 'VARCHAR(512)', nullable: false },
      { name: 'chapter_markers', type: 'JSON', nullable: true },
      { name: 'download_count', type: 'INT UNSIGNED', nullable: false },
      { name: 'unique_listeners', type: 'INT UNSIGNED', nullable: false },
      { name: 'iab_certified', type: 'BOOLEAN', nullable: false },
      { name: 'published_at', type: 'TIMESTAMP', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 346,
    name: 'Editorial Newsroom CMS & Workflow',
    slug: 'newsroom-cms',
    category: 'Media & Entertainment',
    phase: 2,
    iconName: 'FileText',
    purpose: 'Real-time collaborative article editing, copy desk review workflows, headline A/B testing, and wire feed ingestion.',
    responsibilities: [
      'Provide journalists rich collaborative rich-text editing with version history and editorial track changes',
      'Ingest real-time wire agency feeds (Associated Press, Reuters) with automated topic classification',
      'Execute automated headline and lead image A/B experiments to maximize article click-through rates'
    ],
    tableName: 'editorial_articles',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'article_id', type: 'VARCHAR(36)', nullable: false, index: true },
      { name: 'author_id', type: 'BIGINT UNSIGNED', nullable: false },
      { name: 'headline', type: 'VARCHAR(255)', nullable: false },
      { name: 'subheadline', type: 'VARCHAR(255)', nullable: true },
      { name: 'wire_feed_source', type: 'ENUM("AP","Reuters","AFP","UPI")', nullable: true },
      { name: 'status', type: 'ENUM("draft","review","published","archived")', nullable: false },
      { name: 'ab_test_variant', type: 'ENUM("A","B","C","control")', nullable: true },
      { name: 'view_count', type: 'INT UNSIGNED', nullable: false },
      { name: 'published_at', type: 'TIMESTAMP', nullable: true },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 347,
    name: 'Live Streaming Video Ingest & Transcoding',
    slug: 'live-video-transcoding',
    category: 'Media & Entertainment',
    phase: 3,
    iconName: 'Video',
    purpose: 'RTMP/SRT stream ingest, hardware accelerated FFmpeg transcoding, multi-rendition HLS ladders, and DVR playback.',
    responsibilities: [
      'Ingest live camera video feeds via ultra-low-latency Secure Reliable Transport (SRT) and RTMP protocols',
      'Transcode input video streams into 1080p, 720p, 480p, and 360p adaptive bitrate renditions using GPU encoders',
      'Enable instant replay live-DVR rewinding during live sports broadcasts'
    ],
    tableName: 'live_stream_channels',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'channel_id', type: 'VARCHAR(36)', nullable: false, index: true },
      { name: 'stream_key', type: 'VARCHAR(128)', nullable: false, index: true },
      { name: 'ingest_protocol', type: 'ENUM("RTMP","SRT")', nullable: false },
      { name: 'resolution', type: 'ENUM("1080p","720p","480p","360p")', nullable: false },
      { name: 'bitrate_kbps', type: 'INT UNSIGNED', nullable: false },
      { name: 'is_live', type: 'BOOLEAN', nullable: false },
      { name: 'viewer_count', type: 'INT UNSIGNED', nullable: false },
      { name: 'dvr_enabled', type: 'BOOLEAN', nullable: false },
      { name: 'started_at', type: 'TIMESTAMP', nullable: true },
      { name: 'ended_at', type: 'TIMESTAMP', nullable: true },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 348,
    name: 'Subtitle & Closed Caption Synchronization',
    slug: 'subtitle-sync',
    category: 'Media & Entertainment',
    phase: 2,
    iconName: 'FileCode',
    purpose: 'WebVTT and TTML subtitle generation, multi-language translation alignment, FCC compliance, and styling presets.',
    responsibilities: [
      'Format and deliver WebVTT and SMPTE-TT closed captioning tracks conforming to FCC accessibility regulations',
      'Align multi-language subtitle tracks ensuring text changes match speaker dialogue onset and cadence',
      'Support user-customizable caption display presets (font family, opacity, text color, window background)'
    ],
    tableName: 'subtitle_tracks',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'track_id', type: 'VARCHAR(36)', nullable: false, index: true },
      { name: 'content_id', type: 'BIGINT UNSIGNED', nullable: false },
      { name: 'language_code', type: 'CHAR(5)', nullable: false },
      { name: 'format', type: 'ENUM("WebVTT","TTML","SRT")', nullable: false },
      { name: 'is_cc', type: 'BOOLEAN', nullable: false },
      { name: 'fcc_compliant', type: 'BOOLEAN', nullable: false },
      { name: 'style_preset', type: 'JSON', nullable: true },
      { name: 'word_count', type: 'INT UNSIGNED', nullable: false },
      { name: 'synced_at', type: 'TIMESTAMP', nullable: true },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 349,
    name: 'Media Asset Management (MAM) Metadata',
    slug: 'mam-metadata',
    category: 'Media & Entertainment',
    phase: 2,
    iconName: 'Film',
    purpose: 'Broadcast video clip cataloging, proxy generation, timecode logging, facial recognition tags, and archival tape storage.',
    responsibilities: [
      'Catalog raw camera master B-roll clips with SMPTE timecodes, camera metadata, and shooting locations',
      'Generate low-resolution editing proxies for remote post-production video editing teams',
      'Orchestrate automated cold-storage archiving to Amazon S3 Glacier and LTO magnetic tape libraries'
    ],
    tableName: 'media_assets',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'asset_id', type: 'VARCHAR(36)', nullable: false, index: true },
      { name: 'title', type: 'VARCHAR(255)', nullable: false },
      { name: 'duration_seconds', type: 'INT UNSIGNED', nullable: false },
      { name: 'resolution', type: 'VARCHAR(20)', nullable: false },
      { name: 'timecode_in', type: 'VARCHAR(12)', nullable: false },
      { name: 'proxy_url', type: 'VARCHAR(512)', nullable: true },
      { name: 'facial_tags', type: 'JSON', nullable: true },
      { name: 'storage_location', type: 'ENUM("S3","Glacier","LTO","Local")', nullable: false },
      { name: 'archived_at', type: 'TIMESTAMP', nullable: true },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 350,
    name: 'Talent Agency Booking & Rider Contracts',
    slug: 'talent-booking',
    category: 'Media & Entertainment',
    phase: 2,
    iconName: 'UserCheck',
    purpose: 'Celebrity and performer appearance bookings, hospitality/technical rider management, and promoter escrow payments.',
    responsibilities: [
      'Draft standardized entertainment performance contracts with force majeure clauses and cancellation policies',
      'Track artist technical sound riders, stage lighting plots, and backstage dressing room hospitality specifications',
      'Manage promoter deposit escrows and disburse balance payments following successful concert completion'
    ],
    tableName: 'talent_bookings',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'booking_id', type: 'VARCHAR(36)', nullable: false, index: true },
      { name: 'talent_id', type: 'BIGINT UNSIGNED', nullable: false },
      { name: 'event_date', type: 'DATE', nullable: false },
      { name: 'venue_name', type: 'VARCHAR(255)', nullable: false },
      { name: 'technical_rider', type: 'JSON', nullable: true },
      { name: 'hospitality_rider', type: 'JSON', nullable: true },
      { name: 'performance_fee_usd', type: 'DECIMAL(12,2)', nullable: false },
      { name: 'escrow_deposit_usd', type: 'DECIMAL(12,2)', nullable: false },
      { name: 'status', type: 'ENUM("confirmed","cancelled","completed")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 351,
    name: 'Game Leaderboards & Matchmaking (ELO)',
    slug: 'game-matchmaking',
    category: 'Media & Entertainment',
    phase: 3,
    iconName: 'Award',
    purpose: 'Skill-based matchmaking (SBMM), Glicko-2 and ELO rating updates, global seasonal leaderboards, and anti-cheat telemetry.',
    responsibilities: [
      'Queue and match online competitive players into balanced multiplayer lobbies based on skill rating and ping',
      'Update player ELO and Glicko-2 rank points dynamically following match outcomes',
      'Maintain real-time Redis-backed top-100 seasonal regional and global leaderboards'
    ],
    tableName: 'matchmaking_queues',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'player_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'elo_rating', type: 'DECIMAL(6,2)', nullable: false },
      { name: 'glicko2_rating', type: 'DECIMAL(6,2)', nullable: false },
      { name: 'glicko2_rd', type: 'DECIMAL(5,2)', nullable: false },
      { name: 'region', type: 'VARCHAR(32)', nullable: false },
      { name: 'current_season', type: 'INT UNSIGNED', nullable: false },
      { name: 'matches_played', type: 'INT UNSIGNED', nullable: false },
      { name: 'win_rate', type: 'DECIMAL(5,4)', nullable: false },
      { name: 'is_queued', type: 'BOOLEAN', nullable: false },
      { name: 'last_match_at', type: 'TIMESTAMP', nullable: true },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 352,
    name: 'In-Game Economy & Virtual Currencies',
    slug: 'in-game-economy',
    category: 'Media & Entertainment',
    phase: 3,
    iconName: 'Coins',
    purpose: 'Soft and hard virtual currency ledgers, microtransaction item shops, battle pass tiers, and double-entry game balances.',
    responsibilities: [
      'Maintain strict double-entry cryptographic transaction ledgers for in-game premium and earned virtual currencies',
      'Serve rotating cosmetic item shop inventories with countdown timers and personalized bundles',
      'Track player battle pass tier progression, experience points, and seasonal reward redemptions'
    ],
    tableName: 'virtual_currency_ledgers',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'transaction_id', type: 'VARCHAR(36)', nullable: false, index: true },
      { name: 'player_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'currency_type', type: 'ENUM("soft","hard")', nullable: false },
      { name: 'amount', type: 'DECIMAL(12,2)', nullable: false },
      { name: 'balance_after', type: 'DECIMAL(12,2)', nullable: false },
      { name: 'transaction_type', type: 'ENUM("purchase","earn","spend","refund")', nullable: false },
      { name: 'item_id', type: 'BIGINT UNSIGNED', nullable: true },
      { name: 'description', type: 'VARCHAR(255)', nullable: true },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 353,
    name: 'Box Office & Reserved Seating Engine',
    slug: 'box-office-seating',
    category: 'Media & Entertainment',
    phase: 2,
    iconName: 'Ticket',
    purpose: 'Interactive SVG auditorium seating maps, real-time seat locks during checkout, and PDF barcode tickets.',
    responsibilities: [
      'Render interactive SVG theatre seating charts with tier-based seat pricing and handicap accessibility tags',
      'Hold selected seats in a temporary 10-minute cart lock preventing double-booking during checkout payment',
      'Generate cryptographically secure QR code mobile tickets scanned at venue entrance turnstiles'
    ],
    tableName: 'ticket_reservations',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reservation_id', type: 'VARCHAR(36)', nullable: false, index: true },
      { name: 'event_id', type: 'BIGINT UNSIGNED', nullable: false },
      { name: 'seat_section', type: 'VARCHAR(20)', nullable: false },
      { name: 'seat_row', type: 'CHAR(2)', nullable: false },
      { name: 'seat_number', type: 'VARCHAR(4)', nullable: false },
      { name: 'price_usd', type: 'DECIMAL(8,2)', nullable: false },
      { name: 'lock_expires_at', type: 'TIMESTAMP', nullable: true },
      { name: 'status', type: 'ENUM("available","locked","sold","cancelled")', nullable: false },
      { name: 'qr_code', type: 'TEXT', nullable: true },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 354,
    name: 'Print Publishing Circulation & Subscriptions',
    slug: 'print-circulation',
    category: 'Media & Entertainment',
    phase: 2,
    iconName: 'Book',
    purpose: 'Physical magazine and newspaper home delivery routing, carrier drop stops, renewal billing, and audit bureau reporting.',
    responsibilities: [
      'Manage home delivery subscriber address databases with delivery instructions (porch, driveway tube)',
      'Generate optimized daily newspaper route drop sheets for delivery motor carriers',
      'Produce standardized circulation verification audit reports conforming to Alliance for Audited Media (AAM) rules'
    ],
    tableName: 'print_subscriptions',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'subscription_id', type: 'VARCHAR(36)', nullable: false, index: true },
      { name: 'subscriber_name', type: 'VARCHAR(128)', nullable: false },
      { name: 'address_line1', type: 'VARCHAR(255)', nullable: false },
      { name: 'city', type: 'VARCHAR(64)', nullable: false },
      { name: 'state', type: 'CHAR(2)', nullable: false },
      { name: 'zip_code', type: 'VARCHAR(10)', nullable: false },
      { name: 'delivery_route', type: 'VARCHAR(32)', nullable: false },
      { name: 'renewal_date', type: 'DATE', nullable: false },
      { name: 'status', type: 'ENUM("active","suspended","cancelled")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 355,
    name: 'Photo Studio Asset Proofing & Approvals',
    slug: 'photo-proofing',
    category: 'Media & Entertainment',
    phase: 2,
    iconName: 'Camera',
    purpose: 'High-res photography gallery proofing, client star ratings and color color-label selections, and retouching notes.',
    responsibilities: [
      'Host private client proofing galleries for commercial fashion and product photography photoshoots',
      'Enable clients to favorite, rate, and leave pinpoint retouching annotations on specific image pixels',
      'Deliver final high-resolution, uncompressed color-profiled TIFF and JPEG deliverable archives'
    ],
    tableName: 'photo_galleries',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'gallery_id', type: 'VARCHAR(36)', nullable: false, index: true },
      { name: 'client_id', type: 'BIGINT UNSIGNED', nullable: false },
      { name: 'shoot_date', type: 'DATE', nullable: false },
      { name: 'image_count', type: 'INT UNSIGNED', nullable: false },
      { name: 'selected_count', type: 'INT UNSIGNED', nullable: false },
      { name: 'retouch_notes', type: 'TEXT', nullable: true },
      { name: 'delivery_format', type: 'ENUM("TIFF","JPEG","PNG","RAW")', nullable: false },
      { name: 'status', type: 'ENUM("proofing","approved","delivered")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 356,
    name: 'Music Master & Publishing Split Sheets',
    slug: 'split-sheets',
    category: 'Media & Entertainment',
    phase: 2,
    iconName: 'FileSpreadsheet',
    purpose: 'Recording studio split sheet agreements, master vs publishing equity shares, and digital producer sign-offs.',
    responsibilities: [
      'Document agreed songwriting publishing splits and sound recording master ownership percentages in the studio',
      'Collect digital signatures from all songwriters, lyricists, beat producers, and featured artists',
      'Export verified split contracts to collection societies preventing future copyright litigation disputes'
    ],
    tableName: 'music_split_sheets',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'split_sheet_id', type: 'VARCHAR(36)', nullable: false, index: true },
      { name: 'song_title', type: 'VARCHAR(255)', nullable: false },
      { name: 'recording_date', type: 'DATE', nullable: false },
      { name: 'studio_name', type: 'VARCHAR(128)', nullable: false },
      { name: 'songwriter_count', type: 'INT UNSIGNED', nullable: false },
      { name: 'master_share_percentage', type: 'DECIMAL(5,2)', nullable: false },
      { name: 'publishing_share_percentage', type: 'DECIMAL(5,2)', nullable: false },
      { name: 'signed_by', type: 'JSON', nullable: true },
      { name: 'status', type: 'ENUM("draft","signed","archived")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 357,
    name: 'Film Production Call Sheets & Crew',
    slug: 'film-call-sheets',
    category: 'Media & Entertainment',
    phase: 2,
    iconName: 'Clipboard',
    purpose: 'Daily Hollywood-style production call sheets, scene shooting schedules, cast call times, and hospital locations.',
    responsibilities: [
      'Publish daily film crew call sheets with call times, location GPS coordinates, weather, and nearest emergency hospital',
      'Schedule scene shoot sequences factoring in actor availability, lighting setups, and wardrobe changes',
      'Track SAG-AFTRA union actor work hours, meal penalty violations, and turnaround rest periods'
    ],
    tableName: 'film_call_sheets',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'call_sheet_id', type: 'VARCHAR(36)', nullable: false, index: true },
      { name: 'production_id', type: 'BIGINT UNSIGNED', nullable: false },
      { name: 'shoot_date', type: 'DATE', nullable: false },
      { name: 'general_call_time', type: 'TIME', nullable: false },
      { name: 'location_address', type: 'VARCHAR(255)', nullable: false },
      { name: 'weather_conditions', type: 'VARCHAR(64)', nullable: true },
      { name: 'nearest_hospital', type: 'VARCHAR(255)', nullable: true },
      { name: 'scene_numbers', type: 'JSON', nullable: false },
      { name: 'status', type: 'ENUM("draft","distributed","completed")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 358,
    name: 'Screenplay Script Breakdown & Scheduling',
    slug: 'script-breakdown',
    category: 'Media & Entertainment',
    phase: 2,
    iconName: 'FileCode',
    purpose: 'Final Draft screenplay ingestion, scene element tagging (cast, props, vehicles, stunts), and stripboard scheduling.',
    responsibilities: [
      'Parse Final Draft FDX script files extracting scenes, character dialogue, and scene page eighths',
      'Tag production elements (stunts, practical special effects, picture vehicles, period costumes) across scenes',
      'Arrange production shooting days on an interactive visual color-coded stripboard'
    ],
    tableName: 'script_scenes',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'scene_id', type: 'VARCHAR(36)', nullable: false, index: true },
      { name: 'script_id', type: 'BIGINT UNSIGNED', nullable: false },
      { name: 'scene_number', type: 'VARCHAR(10)', nullable: false },
      { name: 'scene_heading', type: 'VARCHAR(255)', nullable: false },
      { name: 'page_eighths', type: 'DECIMAL(4,1)', nullable: false },
      { name: 'cast_required', type: 'JSON', nullable: true },
      { name: 'props_required', type: 'JSON', nullable: true },
      { name: 'special_effects', type: 'BOOLEAN', nullable: false },
      { name: 'stripboard_day', type: 'INT UNSIGNED', nullable: true },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 359,
    name: 'Merchandise Licensing & Brand Partnerships',
    slug: 'merchandise-licensing',
    category: 'Media & Entertainment',
    phase: 2,
    iconName: 'ShoppingBag',
    purpose: 'Brand IP licensing agreements, licensee minimum sales guarantees, royalty reporting, and product approvals.',
    responsibilities: [
      'Manage trademark and character intellectual property licensing contracts with retail consumer goods manufacturers',
      'Track licensee contractual Minimum Guaranteed royalties and advance payment recoupment schedules',
      'Review and approve physical product prototypes through multi-stage brand compliance design milestones'
    ],
    tableName: 'licensing_contracts',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'contract_id', type: 'VARCHAR(36)', nullable: false, index: true },
      { name: 'brand_id', type: 'BIGINT UNSIGNED', nullable: false },
      { name: 'licensee_name', type: 'VARCHAR(255)', nullable: false },
      { name: 'ip_category', type: 'VARCHAR(64)', nullable: false },
      { name: 'minimum_guarantee_usd', type: 'DECIMAL(12,2)', nullable: false },
      { name: 'royalty_rate_pct', type: 'DECIMAL(5,2)', nullable: false },
      { name: 'contract_start_date', type: 'DATE', nullable: false },
      { name: 'contract_end_date', type: 'DATE', nullable: false },
      { name: 'approval_status', type: 'ENUM("pending","approved","rejected")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 360,
    name: 'Audience Nielsen / Comscore Telemetry',
    slug: 'audience-telemetry',
    category: 'Media & Entertainment',
    phase: 3,
    iconName: 'Activity',
    purpose: 'Census-level OTT video measurement, software development kit (SDK) heartbeats, Nielsen DAR/TAR sync, and ratings.',
    responsibilities: [
      'Ingest video player playback heartbeats every 10 seconds measuring exact minute-by-minute viewing duration',
      'Map telemetry sessions to Nielsen Digital Ad Ratings (DAR) and Comscore demographic panels',
      'Compute Gross Rating Points (GRP) and target audience demographic reach percentages'
    ],
    tableName: 'audience_sessions',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'session_id', type: 'VARCHAR(36)', nullable: false, index: true },
      { name: 'viewer_id', type: 'BIGINT UNSIGNED', nullable: true },
      { name: 'content_id', type: 'BIGINT UNSIGNED', nullable: false },
      { name: 'device_type', type: 'ENUM("mobile","desktop","smart_tv","stb")', nullable: false },
      { name: 'viewing_duration_seconds', type: 'INT UNSIGNED', nullable: false },
      { name: 'heartbeat_count', type: 'INT UNSIGNED', nullable: false },
      { name: 'demographic_panel', type: 'VARCHAR(32)', nullable: true },
      { name: 'grp_score', type: 'DECIMAL(5,2)', nullable: true },
      { name: 'started_at', type: 'TIMESTAMP', nullable: false },
      { name: 'ended_at', type: 'TIMESTAMP', nullable: true },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),

  // ========================================================
  // DOMAIN 20: HOSPITALITY, AGRICULTURE & LOGISTICS (361-400)
  // ========================================================
  buildModule({
    id: 361,
    name: 'Hotel Property Management System (PMS)',
    slug: 'hotel-pms',
    category: 'Hospitality & Travel',
    phase: 2,
    iconName: 'Building',
    purpose: 'Guest check-in/out folio billing, room status boards (clean, dirty, inspected), keycard integration, and night audit.',
    responsibilities: [
      'Manage hotel guest check-in/out workflows, incidental authorizations, and room keycard encoding',
      'Provide real-time housekeeping room status boards with maid assignment routing',
      'Execute automated end-of-day night audit balancing room charges, taxes, and posting room revenues'
    ],
    tableName: 'hotel_reservations',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'reservation_id', type: 'VARCHAR(36)', nullable: false, index: true },
      { name: 'guest_id', type: 'BIGINT UNSIGNED', nullable: false },
      { name: 'room_number', type: 'VARCHAR(10)', nullable: false },
      { name: 'room_type', type: 'ENUM("standard","suite","deluxe","penthouse")', nullable: false },
      { name: 'check_in_date', type: 'DATE', nullable: false },
      { name: 'check_out_date', type: 'DATE', nullable: false },
      { name: 'room_status', type: 'ENUM("clean","dirty","inspected","oos")', nullable: false },
      { name: 'incidental_hold_usd', type: 'DECIMAL(10,2)', nullable: true },
      { name: 'folio_balance_usd', type: 'DECIMAL(10,2)', nullable: false },
      { name: 'keycard_issued', type: 'BOOLEAN', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 362,
    name: 'Restaurant Point-of-Sale (POS) & KDS',
    slug: 'restaurant-pos-kds',
    category: 'Hospitality & Travel',
    phase: 2,
    iconName: 'Utensils',
    purpose: 'Table layout floor plans, order coursing, kitchen display system (KDS) bump bars, and split check payments.',
    responsibilities: [
      'Render interactive restaurant dining room floor plans with active table statuses and seated guest timers',
      'Route food tickets to kitchen display system (KDS) screens categorized by hot line, pantry, and beverage bar',
      'Support split bill calculations by seat number, item selection, or equal percentage division'
    ],
    tableName: 'dining_orders',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'order_id', type: 'VARCHAR(36)', nullable: false, index: true },
      { name: 'table_number', type: 'INT UNSIGNED', nullable: false },
      { name: 'server_id', type: 'BIGINT UNSIGNED', nullable: false },
      { name: 'guest_count', type: 'INT UNSIGNED', nullable: false },
      { name: 'order_items', type: 'JSON', nullable: false },
      { name: 'course_status', type: 'ENUM("appetizer","entree","dessert","complete")', nullable: false },
      { name: 'subtotal_usd', type: 'DECIMAL(10,2)', nullable: false },
      { name: 'tax_usd', type: 'DECIMAL(10,2)', nullable: false },
      { name: 'tip_usd', type: 'DECIMAL(10,2)', nullable: true },
      { name: 'payment_split', type: 'ENUM("full","half","by_seat","by_item")', nullable: true },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 363,
    name: 'Airline Central Reservation System (CRS)',
    slug: 'airline-crs',
    category: 'Hospitality & Travel',
    phase: 3,
    iconName: 'Plane',
    purpose: 'Passenger Name Record (PNR) creation, IATA NDC standard flights, seat selection, and ancillary bag fee pricing.',
    responsibilities: [
      'Generate 6-character alphanumeric Passenger Name Records (PNR) conforming to IATA airline industry standards',
      'Publish real-time seat availability and fare classes via New Distribution Capability (NDC) XML APIs',
      'Manage paid ancillary baggage, extra legroom seat selection, and priority boarding options'
    ],
    tableName: 'passenger_pnrs',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'pnr_code', type: 'CHAR(6)', nullable: false, index: true },
      { name: 'passenger_name', type: 'VARCHAR(128)', nullable: false },
      { name: 'passport_number', type: 'VARCHAR(20)', nullable: false },
      { name: 'flight_number', type: 'VARCHAR(10)', nullable: false },
      { name: 'origin_iata', type: 'CHAR(3)', nullable: false },
      { name: 'destination_iata', type: 'CHAR(3)', nullable: false },
      { name: 'departure_datetime', type: 'TIMESTAMP', nullable: false },
      { name: 'fare_class', type: 'VARCHAR(2)', nullable: false },
      { name: 'seat_number', type: 'VARCHAR(4)', nullable: true },
      { name: 'ancillary_bags', type: 'INT UNSIGNED', nullable: false },
      { name: 'status', type: 'ENUM("confirmed","waitlisted","cancelled","flown")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 364,
    name: 'Tour & Excursion Activity Booking',
    slug: 'tour-booking',
    category: 'Hospitality & Travel',
    phase: 2,
    iconName: 'Compass',
    purpose: 'Guide capacity scheduling, equipment waivers, hotel pickup route optimization, and weather cancellation refunds.',
    responsibilities: [
      'Schedule guided adventure tours with guide-to-guest safety ratios and equipment inventory limits',
      'Collect signed digital liability release waivers on mobile tablets prior to departure',
      'Automate instant full customer refunds and reschedule notifications in case of adverse weather cancellations'
    ],
    tableName: 'tour_bookings',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'booking_id', type: 'VARCHAR(36)', nullable: false, index: true },
      { name: 'tour_id', type: 'BIGINT UNSIGNED', nullable: false },
      { name: 'customer_id', type: 'BIGINT UNSIGNED', nullable: false },
      { name: 'tour_date', type: 'DATE', nullable: false },
      { name: 'guest_count', type: 'INT UNSIGNED', nullable: false },
      { name: 'equipment_waiver_signed', type: 'BOOLEAN', nullable: false },
      { name: 'pickup_location', type: 'VARCHAR(255)', nullable: true },
      { name: 'weather_status', type: 'ENUM("clear","rain","storm","cancelled")', nullable: false },
      { name: 'total_price_usd', type: 'DECIMAL(10,2)', nullable: false },
      { name: 'refund_amount_usd', type: 'DECIMAL(10,2)', nullable: true },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 365,
    name: 'Cruise Ship Cabin & Passenger Manifest',
    slug: 'cruise-cabin-manifest',
    category: 'Hospitality & Travel',
    phase: 3,
    iconName: 'Anchor',
    purpose: 'Stateroom allocation, onboard folio charging, maritime customs eAPIS border security, and muster drill check-in.',
    responsibilities: [
      'Allocate cruise staterooms and manage onboard cashless smart wristband folio spending limits',
      'Submit Advance Passenger Information System (eAPIS) manifests to US Customs and Border Protection',
      'Verify 100% passenger attendance at mandatory SOLAS emergency safety muster drills before ship departure'
    ],
    tableName: 'cruise_manifests',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'manifest_id', type: 'VARCHAR(36)', nullable: false, index: true },
      { name: 'voyage_id', type: 'BIGINT UNSIGNED', nullable: false },
      { name: 'guest_id', type: 'BIGINT UNSIGNED', nullable: false },
      { name: 'cabin_number', type: 'VARCHAR(10)', nullable: false },
      { name: 'cabin_class', type: 'ENUM("interior","oceanview","balcony","suite")', nullable: false },
      { name: 'eapis_submitted', type: 'BOOLEAN', nullable: false },
      { name: 'muster_drill_attended', type: 'BOOLEAN', nullable: false },
      { name: 'wristband_balance_usd', type: 'DECIMAL(10,2)', nullable: false },
      { name: 'embarkation_status', type: 'ENUM("pending","boarded","disembarked")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 366,
    name: 'Farm Crop Planning & Rotation Calendar',
    slug: 'crop-rotation-planning',
    category: 'Agriculture & Food Supply',
    phase: 2,
    iconName: 'Sun',
    purpose: 'Field parcel soil zoning, multi-year crop rotation (legumes, brassicas), seed planting dates, and harvest estimates.',
    responsibilities: [
      'Plan multi-year agricultural crop rotation schedules to optimize natural soil nitrogen fixation and break pest cycles',
      'Calculate optimal spring planting and harvest windows based on growing degree day (GDD) climate models',
      'Maintain field history records detailing previous chemical applications and organic certification compliance'
    ],
    tableName: 'farm_fields',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'field_id', type: 'VARCHAR(36)', nullable: false, index: true },
      { name: 'parcel_name', type: 'VARCHAR(64)', nullable: false },
      { name: 'acreage', type: 'DECIMAL(10,2)', nullable: false },
      { name: 'soil_type', type: 'VARCHAR(32)', nullable: false },
      { name: 'current_crop', type: 'VARCHAR(64)', nullable: false },
      { name: 'rotation_plan', type: 'JSON', nullable: true },
      { name: 'planting_date', type: 'DATE', nullable: true },
      { name: 'estimated_harvest_date', type: 'DATE', nullable: true },
      { name: 'organic_certified', type: 'BOOLEAN', nullable: false },
      { name: 'last_application_date', type: 'DATE', nullable: true },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 367,
    name: 'Precision Irrigation & Soil Moisture IoT',
    slug: 'precision-irrigation',
    category: 'Agriculture & Food Supply',
    phase: 2,
    iconName: 'Droplets',
    purpose: 'LoRaWAN soil tensiometer telemetry, automated pivot irrigation valve schedules, and water conservation metrics.',
    responsibilities: [
      'Ingest wireless soil moisture tension readings at 6-inch, 12-inch, and 24-inch depths across acreage',
      'Control center-pivot irrigation speed and solenoid water pump valves automatically based on moisture thresholds',
      'Track cumulative acre-feet water consumption for groundwater sustainability agency reporting'
    ],
    tableName: 'irrigation_valves',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'valve_id', type: 'VARCHAR(36)', nullable: false, index: true },
      { name: 'field_id', type: 'BIGINT UNSIGNED', nullable: false },
      { name: 'zone_id', type: 'VARCHAR(32)', nullable: false },
      { name: 'sensor_depth_inches', type: 'INT UNSIGNED', nullable: false },
      { name: 'moisture_tension_kpa', type: 'DECIMAL(8,2)', nullable: false },
      { name: 'flow_rate_gpm', type: 'DECIMAL(8,2)', nullable: false },
      { name: 'valve_status', type: 'ENUM("open","closed","fault")', nullable: false },
      { name: 'water_consumed_gallons', type: 'DECIMAL(12,2)', nullable: false },
      { name: 'last_irrigation_at', type: 'TIMESTAMP', nullable: true },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 368,
    name: 'Livestock Herd Health & RFID Tracking',
    slug: 'livestock-rfid-tracking',
    category: 'Agriculture & Food Supply',
    phase: 2,
    iconName: 'Shield',
    purpose: 'USDA 840 RFID ear tag scanning, cattle vaccination history, breeding lineage, and veterinary treatment logs.',
    responsibilities: [
      'Log electronic USDA 840 RFID ear tag scans at automated cattle chute scale heads during sorting',
      'Record mandatory antibiotic treatments and enforce withdrawal periods before animals can enter meat processing',
      'Track dam and sire genetics, artificial insemination dates, and expected calving calendar windows'
    ],
    tableName: 'livestock_animals',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'rfid_tag', type: 'VARCHAR(15)', nullable: false, index: true },
      { name: 'animal_type', type: 'ENUM("cattle","swine","sheep","goat")', nullable: false },
      { name: 'breed', type: 'VARCHAR(64)', nullable: false },
      { name: 'dam_id', type: 'BIGINT UNSIGNED', nullable: true },
      { name: 'sire_id', type: 'BIGINT UNSIGNED', nullable: true },
      { name: 'date_of_birth', type: 'DATE', nullable: false },
      { name: 'weight_lbs', type: 'DECIMAL(8,2)', nullable: true },
      { name: 'vaccination_records', type: 'JSON', nullable: true },
      { name: 'antibiotic_withdrawal_date', type: 'DATE', nullable: true },
      { name: 'status', type: 'ENUM("active","sold","deceased","processing_hold")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 369,
    name: 'Grain Elevator Storage & Moisture Testing',
    slug: 'grain-elevator-storage',
    category: 'Agriculture & Food Supply',
    phase: 2,
    iconName: 'Database',
    purpose: 'Gross/tare truck scale tickets, moisture meter discounts, grain aeration fan controls, and warehouse receipts.',
    responsibilities: [
      'Record inbound truck scale weights (gross, tare, net) and test grain moisture content and test weight (bushels)',
      'Apply standard dockage and moisture discount schedules against farmer grain settlement contracts',
      'Issue legally negotiable electronic warehouse receipts for stored corn, soybean, and wheat inventories'
    ],
    tableName: 'grain_scale_tickets',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'ticket_number', type: 'VARCHAR(20)', nullable: false, index: true },
      { name: 'farmer_id', type: 'BIGINT UNSIGNED', nullable: false },
      { name: 'grain_type', type: 'ENUM("corn","soybeans","wheat","barley")', nullable: false },
      { name: 'gross_weight_lbs', type: 'DECIMAL(12,2)', nullable: false },
      { name: 'tare_weight_lbs', type: 'DECIMAL(12,2)', nullable: false },
      { name: 'moisture_pct', type: 'DECIMAL(5,2)', nullable: false },
      { name: 'test_weight_bu', type: 'DECIMAL(5,2)', nullable: false },
      { name: 'dockage_pct', type: 'DECIMAL(5,2)', nullable: false },
      { name: 'net_bushels', type: 'DECIMAL(10,2)', nullable: false },
      { name: 'settlement_price_usd', type: 'DECIMAL(10,2)', nullable: false },
      { name: 'warehouse_receipt_issued', type: 'BOOLEAN', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 370,
    name: 'Food Safety HACCP & Temperature Logs',
    slug: 'food-safety-haccp',
    category: 'Agriculture & Food Supply',
    phase: 2,
    iconName: 'Thermometer',
    purpose: 'Hazard Analysis Critical Control Point (HACCP) monitoring, walk-in cooler temperature logs, and corrective actions.',
    responsibilities: [
      'Continuously log walk-in freezer and refrigeration temperatures via automated Bluetooth probe sensors',
      'Enforce mandatory scheduled employee hot-holding line temperature probe checks with digital signatures',
      'Document immediate corrective actions (re-heating, discard) when critical temperature limits are breached'
    ],
    tableName: 'haccp_temperature_logs',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'log_id', type: 'VARCHAR(36)', nullable: false, index: true },
      { name: 'facility_id', type: 'BIGINT UNSIGNED', nullable: false },
      { name: 'equipment_id', type: 'VARCHAR(32)', nullable: false },
      { name: 'equipment_type', type: 'ENUM("freezer","cooler","hot_holding","retherm")', nullable: false },
      { name: 'temperature_f', type: 'DECIMAL(5,1)', nullable: false },
      { name: 'critical_limit_f', type: 'DECIMAL(5,1)', nullable: false },
      { name: 'is_within_limits', type: 'BOOLEAN', nullable: false },
      { name: 'corrective_action', type: 'VARCHAR(255)', nullable: true },
      { name: 'inspector_id', type: 'BIGINT UNSIGNED', nullable: false },
      { name: 'digital_signature', type: 'TEXT', nullable: false },
      { name: 'recorded_at', type: 'TIMESTAMP', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 371,
    name: 'Pesticide & Herbicide Spray Application',
    slug: 'pesticide-application-logs',
    category: 'Agriculture & Food Supply',
    phase: 2,
    iconName: 'AlertCircle',
    purpose: 'EPA restricted use pesticide (RUP) logs, wind speed/weather checks, Restricted Entry Intervals (REI), and drift buffers.',
    responsibilities: [
      'Record EPA pesticide registration numbers, active ingredients, application rates, and certified applicator licenses',
      'Log weather conditions (wind speed, wind direction, ambient temperature) at time of chemical application',
      'Calculate Worker Protection Standard (WPS) Restricted Entry Intervals (REI) and flag field exclusion zones'
    ],
    tableName: 'spray_applications',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'application_id', type: 'VARCHAR(36)', nullable: false, index: true },
      { name: 'field_id', type: 'BIGINT UNSIGNED', nullable: false },
      { name: 'pesticide_name', type: 'VARCHAR(128)', nullable: false },
      { name: 'epa_reg_number', type: 'VARCHAR(20)', nullable: false },
      { name: 'active_ingredient', type: 'VARCHAR(64)', nullable: false },
      { name: 'application_rate', type: 'VARCHAR(32)', nullable: false },
      { name: 'applicator_license', type: 'VARCHAR(20)', nullable: false },
      { name: 'wind_speed_mph', type: 'DECIMAL(4,1)', nullable: false },
      { name: 'wind_direction', type: 'VARCHAR(3)', nullable: false },
      { name: 'ambient_temp_f', type: 'DECIMAL(5,1)', nullable: false },
      { name: 'rei_hours', type: 'INT UNSIGNED', nullable: false },
      { name: 'applied_at', type: 'TIMESTAMP', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 372,
    name: 'Greenhouse Climate & Nutrient Dosing',
    slug: 'greenhouse-automation',
    category: 'Agriculture & Food Supply',
    phase: 3,
    iconName: 'Wind',
    purpose: 'Hydroponic EC/pH nutrient dosing pumps, supplemental LED lighting PAR sensors, and automated shade curtains.',
    responsibilities: [
      'Regulate closed-loop hydroponic electrical conductivity (EC) and pH levels with automated peristaltic acid/base pumps',
      'Control supplemental LED grow light intensity based on Photosynthetically Active Radiation (PAR) sensor readings',
      'Automate motorized roof vents and ridge shade curtains to maintain optimal vapor pressure deficit (VPD)'
    ],
    tableName: 'greenhouse_zones',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'zone_id', type: 'VARCHAR(36)', nullable: false, index: true },
      { name: 'greenhouse_name', type: 'VARCHAR(64)', nullable: false },
      { name: 'ec_level', type: 'DECIMAL(5,2)', nullable: false },
      { name: 'ph_level', type: 'DECIMAL(4,2)', nullable: false },
      { name: 'water_temp_f', type: 'DECIMAL(5,1)', nullable: false },
      { name: 'air_temp_f', type: 'DECIMAL(5,1)', nullable: false },
      { name: 'humidity_pct', type: 'DECIMAL(5,2)', nullable: false },
      { name: 'vpd_kpa', type: 'DECIMAL(4,2)', nullable: false },
      { name: 'par_umol', type: 'INT UNSIGNED', nullable: false },
      { name: 'vent_status', type: 'ENUM("open","closed","auto")', nullable: false },
      { name: 'shade_curtain_pct', type: 'INT UNSIGNED', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 373,
    name: 'Agricultural Commodity Hedging Ledger',
    slug: 'commodity-hedging',
    category: 'Agriculture & Food Supply',
    phase: 3,
    iconName: 'TrendingUp',
    purpose: 'CBOT futures and options contracts, basis risk calculations, physical forward cash contracts, and hedge ratios.',
    responsibilities: [
      'Track Chicago Board of Trade (CBOT) grain futures hedge positions offset against physical cash crop inventories',
      'Calculate localized cash-to-futures basis differentials across regional delivery terminals',
      'Monitor mark-to-market margin call risks and manage bank hedging line of credit allocations'
    ],
    tableName: 'commodity_hedges',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'hedge_id', type: 'VARCHAR(36)', nullable: false, index: true },
      { name: 'commodity_type', type: 'ENUM("corn","soybeans","wheat","cotton")', nullable: false },
      { name: 'exchange', type: 'ENUM("CBOT","CME","ICE")', nullable: false },
      { name: 'contract_month', type: 'CHAR(4)', nullable: false },
      { name: 'position_type', type: 'ENUM("long","short")', nullable: false },
      { name: 'quantity_bushels', type: 'BIGINT UNSIGNED', nullable: false },
      { name: 'entry_price_usd', type: 'DECIMAL(10,4)', nullable: false },
      { name: 'current_price_usd', type: 'DECIMAL(10,4)', nullable: false },
      { name: 'mark_to_market_usd', type: 'DECIMAL(12,2)', nullable: false },
      { name: 'basis_differential', type: 'DECIMAL(10,4)', nullable: true },
      { name: 'margin_call_amount_usd', type: 'DECIMAL(12,2)', nullable: true },
      { name: 'status', type: 'ENUM("open","closed","expired")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 374,
    name: 'Cold-Chain Refrigeration Telemetry',
    slug: 'cold-chain-telemetry',
    category: 'Logistics & Supply Chain',
    phase: 2,
    iconName: 'ThermometerSnowflake',
    purpose: 'Reefer trailer temperature sensors, reefer setpoint changes, defrost cycles, and cold chain breach alarms.',
    responsibilities: [
      'Stream real-time temperature and humidity telemetry from refrigerated tractor-trailers in transit',
      'Detect temperature excursions outside FDA Food Safety Modernization Act (FSMA) cold chain limits',
      'Alert drivers and dispatchers immediately if a trailer refrigeration unit experiences a diesel engine fault'
    ],
    tableName: 'reefer_telemetry',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'telemetry_id', type: 'VARCHAR(36)', nullable: false, index: true },
      { name: 'trailer_id', type: 'VARCHAR(20)', nullable: false, index: true },
      { name: 'temperature_f', type: 'DECIMAL(5,1)', nullable: false },
      { name: 'humidity_pct', type: 'DECIMAL(5,2)', nullable: false },
      { name: 'setpoint_f', type: 'DECIMAL(5,1)', nullable: false },
      { name: 'defrost_cycle_active', type: 'BOOLEAN', nullable: false },
      { name: 'fuel_level_pct', type: 'DECIMAL(5,2)', nullable: true },
      { name: 'gps_lat', type: 'DECIMAL(10,7)', nullable: true },
      { name: 'gps_lng', type: 'DECIMAL(10,7)', nullable: true },
      { name: 'excursion_detected', type: 'BOOLEAN', nullable: false },
      { name: 'driver_alert_sent', type: 'BOOLEAN', nullable: false },
      { name: 'recorded_at', type: 'TIMESTAMP', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 375,
    name: 'Intermodal Container Port Logistics',
    slug: 'intermodal-port-logistics',
    category: 'Logistics & Supply Chain',
    phase: 3,
    iconName: 'Truck',
    purpose: 'Ocean container booking, terminal gate appointment scheduling (TOS), chassis pool tracking, and demurrage alerts.',
    responsibilities: [
      'Interface with Marine Terminal Operating Systems (TOS) to reserve drayage truck gate appointments',
      'Track marine ISO shipping container dwell times at marine terminals and calculate demurrage penalty fees',
      'Manage intermodal chassis pool lease agreements and roadability safety inspection compliance'
    ],
    tableName: 'port_containers',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'container_number', type: 'CHAR(11)', nullable: false, index: true },
      { name: 'booking_reference', type: 'VARCHAR(20)', nullable: false },
      { name: 'vessel_name', type: 'VARCHAR(128)', nullable: true },
      { name: 'voyage_number', type: 'VARCHAR(10)', nullable: true },
      { name: 'port_terminal', type: 'VARCHAR(64)', nullable: false },
      { name: 'gate_appointment_at', type: 'TIMESTAMP', nullable: true },
      { name: 'dwell_days', type: 'INT UNSIGNED', nullable: false },
      { name: 'demurrage_charges_usd', type: 'DECIMAL(10,2)', nullable: true },
      { name: 'chassis_id', type: 'VARCHAR(12)', nullable: true },
      { name: 'customs_held', type: 'BOOLEAN', nullable: false },
      { name: 'status', type: 'ENUM("in_transit","at_port","gated_out","empty_return")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 376,
    name: 'Customs Brokerage & Import Declarations',
    slug: 'customs-brokerage',
    category: 'Logistics & Supply Chain',
    phase: 2,
    iconName: 'FileCheck',
    purpose: 'Harmonized Tariff Schedule (HTS) classification, US Customs CBP Form 7501, duty calculation, and customs holds.',
    responsibilities: [
      'Classify commercial import commodities under the 10-digit Harmonized Tariff Schedule (HTS) code system',
      'Generate electronic CBP Form 7501 Entry Summaries and calculate section 301/232 additional tariff duties',
      'Track CBP customs examination holds (X-ray VACIS exams, intensive physical exams) and release statuses'
    ],
    tableName: 'customs_entries',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'entry_number', type: 'VARCHAR(20)', nullable: false, index: true },
      { name: 'importer_id', type: 'BIGINT UNSIGNED', nullable: false },
      { name: 'hts_code', type: 'CHAR(10)', nullable: false },
      { name: 'country_of_origin', type: 'CHAR(2)', nullable: false },
      { name: 'commercial_value_usd', type: 'DECIMAL(12,2)', nullable: false },
      { name: 'duty_rate_pct', type: 'DECIMAL(6,3)', nullable: false },
      { name: 'additional_duty_usd', type: 'DECIMAL(12,2)', nullable: true },
      { name: 'total_duty_usd', type: 'DECIMAL(12,2)', nullable: false },
      { name: 'cbp_form_7501_submitted', type: 'BOOLEAN', nullable: false },
      { name: 'examination_type', type: 'ENUM("none","xray","intensive","tailgate")', nullable: true },
      { name: 'release_status', type: 'ENUM("pending","released","held","liquidated")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 377,
    name: 'Freight Forwarding & Air Waybill (AWB)',
    slug: 'freight-forwarding-awb',
    category: 'Logistics & Supply Chain',
    phase: 2,
    iconName: 'Plane',
    purpose: 'Master and House Air Waybill (MAWB/HAWB) generation, volumetric weight calculations, and air cargo tracking.',
    responsibilities: [
      'Issue standard IATA Master Air Waybills (MAWB) and consolidator House Air Waybills (HAWB)',
      'Calculate chargeable volumetric dimensional weight (DIM weight) according to standard IATA volume ratios',
      'Track airline air freight milestone events from airport ramp transfer through destination customs release'
    ],
    tableName: 'air_waybills',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'awb_number', type: 'VARCHAR(14)', nullable: false, index: true },
      { name: 'awb_type', type: 'ENUM("MAWB","HAWB")', nullable: false },
      { name: 'shipper_name', type: 'VARCHAR(128)', nullable: false },
      { name: 'consignee_name', type: 'VARCHAR(128)', nullable: false },
      { name: 'origin_airport', type: 'CHAR(3)', nullable: false },
      { name: 'destination_airport', type: 'CHAR(3)', nullable: false },
      { name: 'actual_weight_kg', type: 'DECIMAL(10,2)', nullable: false },
      { name: 'volumetric_weight_kg', type: 'DECIMAL(10,2)', nullable: false },
      { name: 'chargeable_weight_kg', type: 'DECIMAL(10,2)', nullable: false },
      { name: 'piece_count', type: 'INT UNSIGNED', nullable: false },
      { name: 'freight_charges_usd', type: 'DECIMAL(10,2)', nullable: false },
      { name: 'status', type: 'ENUM("booked","in_transit","customs","delivered")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 378,
    name: 'Rail Freight Car & Siding Logistics',
    slug: 'rail-freight-logistics',
    category: 'Logistics & Supply Chain',
    phase: 2,
    iconName: 'Train',
    purpose: 'Class I railroad CLM tracking, rail spur siding capacity, hopper car demurrage, and bill of lading releases.',
    responsibilities: [
      'Ingest Class I railroad Car Location Message (CLM) EDI 414 feeds tracking tank and boxcars across rail networks',
      'Manage industrial rail spur track capacity and switch request orders to serving rail carriers',
      'Reconcile railroad demurrage and storage invoices against rail car dwell records on private sidings'
    ],
    tableName: 'rail_cars',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'car_number', type: 'VARCHAR(10)', nullable: false, index: true },
      { name: 'car_type', type: 'ENUM("hopper","boxcar","tank","flat")', nullable: false },
      { name: 'railroad_code', type: 'VARCHAR(4)', nullable: false },
      { name: 'current_location', type: 'VARCHAR(64)', nullable: false },
      { name: 'destination_siding', type: 'VARCHAR(64)', nullable: true },
      { name: 'load_status', type: 'ENUM("loaded","empty","partially_loaded")', nullable: false },
      { name: 'commodity', type: 'VARCHAR(64)', nullable: true },
      { name: 'dwell_hours', type: 'DECIMAL(8,2)', nullable: false },
      { name: 'demurrage_charges_usd', type: 'DECIMAL(10,2)', nullable: true },
      { name: 'billed_lading_number', type: 'VARCHAR(20)', nullable: true },
      { name: 'status', type: 'ENUM("in_transit","on_siding","unloading","returned")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 379,
    name: 'Hazardous Materials (HAZMAT) Transport',
    slug: 'hazmat-transport',
    category: 'Logistics & Supply Chain',
    phase: 3,
    iconName: 'AlertTriangle',
    purpose: 'DOT 49 CFR placard calculation, UN dangerous goods shipping papers, driver endorsements, and segregation tables.',
    responsibilities: [
      'Calculate mandatory DOT vehicle diamond placards based on UN numbers, packing groups, and aggregate hazard weights',
      'Enforce DOT hazardous materials segregation rules preventing incompatible reactive chemicals in the same trailer',
      'Verify truck commercial driver licenses (CDL) possess valid hazardous materials endorsements'
    ],
    tableName: 'hazmat_shipments',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'shipment_id', type: 'VARCHAR(36)', nullable: false, index: true },
      { name: 'un_number', type: 'CHAR(4)', nullable: false },
      { name: 'proper_shipping_name', type: 'VARCHAR(255)', nullable: false },
      { name: 'hazard_class', type: 'VARCHAR(4)', nullable: false },
      { name: 'packing_group', type: 'ENUM("I","II","III")', nullable: false },
      { name: 'placard_required', type: 'BOOLEAN', nullable: false },
      { name: 'placard_type', type: 'VARCHAR(32)', nullable: false },
      { name: 'driver_cdl_number', type: 'VARCHAR(20)', nullable: false },
      { name: 'cdl_hazmat_endorsement', type: 'BOOLEAN', nullable: false },
      { name: 'shipping_paper_reference', type: 'VARCHAR(20)', nullable: false },
      { name: 'segregation_group', type: 'VARCHAR(10)', nullable: false },
      { name: 'shipped_at', type: 'TIMESTAMP', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 380,
    name: 'Delivery Drone Airspace & Landing Pads',
    slug: 'drone-delivery-logistics',
    category: 'Logistics & Supply Chain',
    phase: 3,
    iconName: 'Navigation',
    purpose: 'FAA Part 135 drone delivery missions, GPS waypoint geofencing, rooftop vertipad landing zones, and battery swaps.',
    responsibilities: [
      'Plan autonomous drone flight trajectories avoiding FAA restricted airspace and temporary flight restrictions (TFR)',
      'Manage automated rooftop landing pad guidance beacons and winch tether package delivery releases',
      'Monitor multi-rotor battery state-of-health, telemetry range limits, and automated fail-safe return-to-home triggers'
    ],
    tableName: 'drone_missions',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'mission_id', type: 'VARCHAR(36)', nullable: false, index: true },
      { name: 'drone_id', type: 'VARCHAR(20)', nullable: false, index: true },
      { name: 'faa_part_135_cert', type: 'VARCHAR(20)', nullable: false },
      { name: 'origin_lat', type: 'DECIMAL(10,7)', nullable: false },
      { name: 'origin_lng', type: 'DECIMAL(10,7)', nullable: false },
      { name: 'destination_lat', type: 'DECIMAL(10,7)', nullable: false },
      { name: 'destination_lng', type: 'DECIMAL(10,7)', nullable: false },
      { name: 'geofence_violations', type: 'INT UNSIGNED', nullable: false },
      { name: 'battery_start_pct', type: 'INT UNSIGNED', nullable: false },
      { name: 'battery_end_pct', type: 'INT UNSIGNED', nullable: true },
      { name: 'package_delivered', type: 'BOOLEAN', nullable: true },
      { name: 'flight_duration_seconds', type: 'INT UNSIGNED', nullable: true },
      { name: 'status', type: 'ENUM("planned","in_flight","delivered","aborted","rth")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 381,
    name: 'Parcel Lockers & Automated Kiosks',
    slug: 'parcel-lockers',
    category: 'Logistics & Supply Chain',
    phase: 2,
    iconName: 'Box',
    purpose: 'Smart locker door solenoid controls, customer one-time pickup PINs, oversized locker allocation, and return drop-offs.',
    responsibilities: [
      'Allocate appropriate locker door compartments (small, medium, large) based on package dimensional scans',
      'Send customers encrypted single-use QR pickup codes and SMS pickup PINs upon delivery',
      'Manage courier return package drop-offs and track customer unclaimed package return-to-depot expirations'
    ],
    tableName: 'locker_compartments',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'compartment_id', type: 'VARCHAR(20)', nullable: false, index: true },
      { name: 'locker_bank_id', type: 'VARCHAR(20)', nullable: false },
      { name: 'compartment_size', type: 'ENUM("small","medium","large")', nullable: false },
      { name: 'package_tracking', type: 'VARCHAR(32)', nullable: false },
      { name: 'courier_code', type: 'VARCHAR(10)', nullable: false },
      { name: 'pickup_pin', type: 'CHAR(6)', nullable: false },
      { name: 'pickup_qr_code', type: 'TEXT', nullable: false },
      { name: 'recipient_phone', type: 'VARCHAR(15)', nullable: false },
      { name: 'stored_at', type: 'TIMESTAMP', nullable: false },
      { name: 'pickup_deadline_at', type: 'TIMESTAMP', nullable: false },
      { name: 'picked_up_at', type: 'TIMESTAMP', nullable: true },
      { name: 'return_initiated', type: 'BOOLEAN', nullable: false },
      { name: 'status', type: 'ENUM("available","occupied","picked_up","returned")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 382,
    name: 'Pallet Exchange & Return Logistics',
    slug: 'pallet-pooling-logistics',
    category: 'Logistics & Supply Chain',
    phase: 2,
    iconName: 'Layers',
    purpose: 'CHEP/PECO pooled pallet tracking, exchange balance accounting, pallet quality sorting, and return sweeps.',
    responsibilities: [
      'Track pooled commercial blue and red pallet transfers between distribution centers and retail store docks',
      'Reconcile daily pallet exchange balances with commercial carriers to eliminate pallet loss liabilities',
      'Schedule dedicated flatbed return sweeps collecting accumulated empty pallets from retail receiving yards'
    ],
    tableName: 'pallet_accounts',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'account_id', type: 'VARCHAR(36)', nullable: false, index: true },
      { name: 'pool_provider', type: 'ENUM("CHEP","PECO","iGPS","wood")', nullable: false },
      { name: 'facility_id', type: 'BIGINT UNSIGNED', nullable: false },
      { name: 'pallet_type', type: 'ENUM("blue","red","white","natural")', nullable: false },
      { name: 'quantity_received', type: 'INT UNSIGNED', nullable: false },
      { name: 'quantity_shipped', type: 'INT UNSIGNED', nullable: false },
      { name: 'balance_on_hand', type: 'INT UNSIGNED', nullable: false },
      { name: 'exchange_rate_usd', type: 'DECIMAL(8,2)', nullable: false },
      { name: 'adjustment_reason', type: 'VARCHAR(128)', nullable: true },
      { name: 'last_sweep_date', type: 'DATE', nullable: true },
      { name: 'status', type: 'ENUM("in_balance","short","over","disputed")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 383,
    name: 'Cross-Docking Terminal Orchestration',
    slug: 'cross-docking-orchestration',
    category: 'Logistics & Supply Chain',
    phase: 2,
    iconName: 'ArrowRightLeft',
    purpose: 'Inbound-to-outbound dock door staging, direct pallet transfer without putaway storage, and yard hostler moves.',
    responsibilities: [
      'Match incoming supplier full-truckload shipments directly with outbound outbound store delivery trailers',
      'Stage pallets directly across the cross-dock staging floor eliminating expensive warehouse putaway and picking labor',
      'Direct yard hostler spotting tractors to position trailers at specific dock doors minimizing forklift travel distances'
    ],
    tableName: 'crossdock_movements',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'movement_id', type: 'VARCHAR(36)', nullable: false, index: true },
      { name: 'inbound_trailer', type: 'VARCHAR(12)', nullable: false },
      { name: 'outbound_trailer', type: 'VARCHAR(12)', nullable: false },
      { name: 'dock_door_number', type: 'INT UNSIGNED', nullable: false },
      { name: 'pallet_count', type: 'INT UNSIGNED', nullable: false },
      { name: 'crossdock_type', type: 'ENUM("pure","break_bulk","consolidation")', nullable: false },
      { name: 'hostler_moves', type: 'INT UNSIGNED', nullable: false },
      { name: 'dwell_minutes', type: 'INT UNSIGNED', nullable: false },
      { name: 'staging_lane', type: 'VARCHAR(10)', nullable: true },
      { name: 'started_at', type: 'TIMESTAMP', nullable: false },
      { name: 'completed_at', type: 'TIMESTAMP', nullable: true },
      { name: 'status', type: 'ENUM("staged","in_progress","completed","exception")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 384,
    name: 'Freight Bill Audit & Payment (FBAP)',
    slug: 'freight-audit-payment',
    category: 'Logistics & Supply Chain',
    phase: 2,
    iconName: 'DollarSign',
    purpose: 'Automated 3-way freight invoice matching, fuel surcharge table verification, accessorial fee audit, and disbursements.',
    responsibilities: [
      'Audit carrier freight bills against contracted tariff rate tables and agreed accessorial charges (liftgate, detention)',
      'Verify carrier fuel surcharges against official DOE weekly national diesel fuel price averages',
      'Consolidate verified freight bills into batch electronic payment runs to approved motor carriers'
    ],
    tableName: 'freight_audit_bills',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'bill_id', type: 'VARCHAR(36)', nullable: false, index: true },
      { name: 'carrier_id', type: 'BIGINT UNSIGNED', nullable: false },
      { name: 'invoice_number', type: 'VARCHAR(32)', nullable: false },
      { name: 'bol_number', type: 'VARCHAR(20)', nullable: false },
      { name: 'freight_charges_usd', type: 'DECIMAL(12,2)', nullable: false },
      { name: 'fuel_surcharge_usd', type: 'DECIMAL(10,2)', nullable: false },
      { name: 'accessorial_charges_usd', type: 'DECIMAL(10,2)', nullable: true },
      { name: 'total_billed_usd', type: 'DECIMAL(12,2)', nullable: false },
      { name: 'contract_rate_usd', type: 'DECIMAL(12,2)', nullable: false },
      { name: 'variance_usd', type: 'DECIMAL(10,2)', nullable: false },
      { name: 'audit_result', type: 'ENUM("pass","fail","disputed","adjusted")', nullable: false },
      { name: 'payment_status', type: 'ENUM("pending","approved","paid","held")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 385,
    name: 'Supply Chain Carbon Scope 3 Accounting',
    slug: 'supply-chain-carbon',
    category: 'Logistics & Supply Chain',
    phase: 3,
    iconName: 'Leaf',
    purpose: 'GLEC framework freight carbon emission modeling (ton-km), supplier ESG reporting, and sustainable routing.',
    responsibilities: [
      'Calculate freight transport carbon footprint (CO2e) adhering to Global Logistics Emissions Council (GLEC) standards',
      'Compare carbon emission profiles across intermodal rail vs expedited air and long-haul trucking alternatives',
      'Collect tier-1 and tier-2 vendor environmental sustainability scorecards for corporate Scope 3 GHG disclosures'
    ],
    tableName: 'carbon_emission_logs',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'log_id', type: 'VARCHAR(36)', nullable: false, index: true },
      { name: 'shipment_id', type: 'BIGINT UNSIGNED', nullable: false },
      { name: 'transport_mode', type: 'ENUM("road","rail","air","ocean","intermodal")', nullable: false },
      { name: 'distance_km', type: 'DECIMAL(10,2)', nullable: false },
      { name: 'weight_tonnes', type: 'DECIMAL(10,2)', nullable: false },
      { name: 'co2e_kg', type: 'DECIMAL(12,4)', nullable: false },
      { name: 'co2e_per_ton_km', type: 'DECIMAL(10,6)', nullable: false },
      { name: 'fuel_consumed_liters', type: 'DECIMAL(10,2)', nullable: true },
      { name: 'glec_standard_version', type: 'VARCHAR(10)', nullable: false },
      { name: 'reporting_period', type: 'VARCHAR(7)', nullable: false },
      { name: 'supplier_id', type: 'BIGINT UNSIGNED', nullable: true },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 386,
    name: 'Cellular Tower Site & Lease Management',
    slug: 'cellular-tower-leases',
    category: 'Telecommunications & Utilities',
    phase: 2,
    iconName: 'Radio',
    purpose: 'Macro cell tower ground leases, structural wind load analysis, co-location tenant subleases, and FAA tower lights.',
    responsibilities: [
      'Manage real estate ground leases with property owners for wireless communications cellular towers',
      'Track structural wind and ice load engineering certifications for antenna and microwave dish additions',
      'Monitor automated FAA tower obstruction beacon light monitoring systems and report outages within 30 minutes'
    ],
    tableName: 'cell_towers',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'tower_id', type: 'VARCHAR(20)', nullable: false, index: true },
      { name: 'site_name', type: 'VARCHAR(128)', nullable: false },
      { name: 'latitude', type: 'DECIMAL(10,7)', nullable: false },
      { name: 'longitude', type: 'DECIMAL(10,7)', nullable: false },
      { name: 'tower_height_m', type: 'DECIMAL(6,1)', nullable: false },
      { name: 'ground_lease_expiry', type: 'DATE', nullable: true },
      { name: 'co_location_tenants', type: 'INT UNSIGNED', nullable: false },
      { name: 'faa_light_status', type: 'ENUM("operational","outage","na")', nullable: false },
      { name: 'wind_load_certified', type: 'BOOLEAN', nullable: false },
      { name: 'annual_lease_rent_usd', type: 'DECIMAL(12,2)', nullable: true },
      { name: 'status', type: 'ENUM("active","maintenance","decommissioned")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 387,
    name: 'Fiber Optic Cable Route GIS Mapping',
    slug: 'fiber-gis-mapping',
    category: 'Telecommunications & Utilities',
    phase: 2,
    iconName: 'Map',
    purpose: 'Underground conduit GIS traces, OTDR optical fiber splice loss testing, right-of-way permits, and cut locator alerts.',
    responsibilities: [
      'Map physical underground dark fiber conduits, splice vaults, and optical distribution frames in spatial GIS',
      'Log Optical Time-Domain Reflectometer (OTDR) trace test results recording individual fusion splice loss decibels',
      'Integrate with 811 Call-Before-You-Dig municipal locator networks to protect buried fiber assets from backhoe damage'
    ],
    tableName: 'fiber_routes',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'route_id', type: 'VARCHAR(36)', nullable: false, index: true },
      { name: 'segment_name', type: 'VARCHAR(128)', nullable: false },
      { name: 'fiber_count', type: 'INT UNSIGNED', nullable: false },
      { name: 'conduit_type', type: 'ENUM("underground","aerial","submarine")', nullable: false },
      { name: 'splice_vault_id', type: 'VARCHAR(20)', nullable: true },
      { name: 'otdr_loss_db', type: 'DECIMAL(6,3)', nullable: true },
      { name: 'distance_km', type: 'DECIMAL(8,3)', nullable: false },
      { name: 'right_of_way_permit', type: 'VARCHAR(32)', nullable: true },
      { name: 'call_before_dig_registered', type: 'BOOLEAN', nullable: false },
      { name: 'cut_alert_active', type: 'BOOLEAN', nullable: false },
      { name: 'status', type: 'ENUM("active","maintenance","cut","planned")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 388,
    name: 'Telecom Subscriber Provisioning (RADIUS/Diameter)',
    slug: 'telecom-subscriber-provisioning',
    category: 'Telecommunications & Utilities',
    phase: 3,
    iconName: 'Server',
    purpose: 'SIM card IMSI activation, eSIM QR profile delivery, RADIUS/Diameter authentication, and APN bandwidth throttling.',
    responsibilities: [
      'Provision SIM/eSIM credentials (IMSI, ICCID) across mobile network operator Home Subscriber Servers (HSS)',
      'Authenticate mobile data sessions and assign dynamic subscriber IP pools via RADIUS and Diameter protocols',
      'Enforce fair-use policy bandwidth throttling when subscriber monthly high-speed data caps are exceeded'
    ],
    tableName: 'subscriber_sims',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'imsi', type: 'VARCHAR(15)', nullable: false, index: true },
      { name: 'iccid', type: 'VARCHAR(22)', nullable: false, index: true },
      { name: 'subscriber_id', type: 'BIGINT UNSIGNED', nullable: false },
      { name: 'sim_type', type: 'ENUM("physical","esim")', nullable: false },
      { name: 'msisdn', type: 'VARCHAR(15)', nullable: false },
      { name: 'apn_name', type: 'VARCHAR(32)', nullable: false },
      { name: 'data_cap_gb', type: 'DECIMAL(8,2)', nullable: false },
      { name: 'data_used_gb', type: 'DECIMAL(8,2)', nullable: false },
      { name: 'throttled', type: 'BOOLEAN', nullable: false },
      { name: 'auth_protocol', type: 'ENUM("RADIUS","Diameter")', nullable: false },
      { name: 'ip_address', type: 'VARCHAR(45)', nullable: true },
      { name: 'status', type: 'ENUM("active","suspended","deactivated")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 389,
    name: 'VoIP PBX SIP Trunk & Call Routing',
    slug: 'voip-sip-routing',
    category: 'Telecommunications & Utilities',
    phase: 3,
    iconName: 'Phone',
    purpose: 'SIP trunk session border controller (SBC) registration, least-cost routing (LCR), E911 dispatch, and call detail records.',
    responsibilities: [
      'Manage enterprise Session Initiation Protocol (SIP) trunks with TLS encryption and SRTP media security',
      'Execute dynamic Least Cost Routing (LCR) algorithms across competitive wholesale telecommunications carriers',
      'Transmit compliant Kari Law and RAY BAUM Act accurate dispatchable civic address locations for E911 emergency calls'
    ],
    tableName: 'sip_trunks',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'trunk_id', type: 'VARCHAR(36)', nullable: false, index: true },
      { name: 'trunk_name', type: 'VARCHAR(64)', nullable: false },
      { name: 'carrier_name', type: 'VARCHAR(64)', nullable: false },
      { name: 'sbc_endpoint', type: 'VARCHAR(128)', nullable: false },
      { name: 'max_concurrent_channels', type: 'INT UNSIGNED', nullable: false },
      { name: 'active_channels', type: 'INT UNSIGNED', nullable: false },
      { name: 'lcr_route_priority', type: 'INT UNSIGNED', nullable: false },
      { name: 'e911_address', type: 'VARCHAR(255)', nullable: true },
      { name: 'encryption', type: 'ENUM("TLS_SRTP","none")', nullable: false },
      { name: 'calls_today', type: 'INT UNSIGNED', nullable: false },
      { name: 'asr_pct', type: 'DECIMAL(5,2)', nullable: true },
      { name: 'status', type: 'ENUM("active","disabled","failed")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 390,
    name: 'Smart Water Utility AMI Metering',
    slug: 'water-ami-metering',
    category: 'Telecommunications & Utilities',
    phase: 2,
    iconName: 'Droplet',
    purpose: 'Advanced Metering Infrastructure (AMI) acoustic leak detection, hourly cubic-foot water consumption, and shutoff valves.',
    responsibilities: [
      'Ingest hourly water meter consumption telemetry over fixed wireless radio frequency networks',
      'Analyze nighttime continuous baseline water flow patterns to detect hidden customer service line leaks',
      'Dispatch motorized remote valve commands to disconnect or limit water flow for non-payment'
    ],
    tableName: 'water_meters',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'meter_serial', type: 'VARCHAR(20)', nullable: false, index: true },
      { name: 'customer_id', type: 'BIGINT UNSIGNED', nullable: false },
      { name: 'service_address', type: 'VARCHAR(255)', nullable: false },
      { name: 'meter_size_inches', type: 'DECIMAL(4,1)', nullable: false },
      { name: 'consumption_gallons', type: 'DECIMAL(12,2)', nullable: false },
      { name: 'reading_timestamp', type: 'TIMESTAMP', nullable: false },
      { name: 'nighttime_baseline_gpm', type: 'DECIMAL(6,2)', nullable: true },
      { name: 'leak_detected', type: 'BOOLEAN', nullable: false },
      { name: 'valve_status', type: 'ENUM("open","closed","restricted")', nullable: false },
      { name: 'signal_strength_dbm', type: 'INT', nullable: true },
      { name: 'status', type: 'ENUM("active","tampered","fault","disconnected")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 391,
    name: 'Electric Grid Outage Management System (OMS)',
    slug: 'grid-outage-management',
    category: 'Telecommunications & Utilities',
    phase: 3,
    iconName: 'Zap',
    purpose: 'SCADA substation feeder trip alarms, AMI meter last-gasp pings, lineworker truck dispatch, and customer outage maps.',
    responsibilities: [
      'Correlate smart electric meter last-gasp radio transmissions to pinpoint blown distribution transformer fuses',
      'Dispatch utility lineworker emergency restoration crews with hazardous downed wire hazard alerts',
      'Render live public web outage maps displaying estimated restoration times (ETR) and affected customer counts'
    ],
    tableName: 'grid_outages',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'outage_id', type: 'VARCHAR(36)', nullable: false, index: true },
      { name: 'feeder_id', type: 'VARCHAR(20)', nullable: false },
      { name: 'substation_id', type: 'VARCHAR(20)', nullable: false },
      { name: 'cause_code', type: 'VARCHAR(10)', nullable: false },
      { name: 'affected_customers', type: 'INT UNSIGNED', nullable: false },
      { name: 'scada_trip_timestamp', type: 'TIMESTAMP', nullable: true },
      { name: 'meter_last_gasp_at', type: 'TIMESTAMP', nullable: true },
      { name: 'crew_dispatched_at', type: 'TIMESTAMP', nullable: true },
      { name: 'estimated_restoration_at', type: 'TIMESTAMP', nullable: true },
      { name: 'actual_restoration_at', type: 'TIMESTAMP', nullable: true },
      { name: 'downed_wires_reported', type: 'BOOLEAN', nullable: false },
      { name: 'status', type: 'ENUM("reporting","investigating","restoring","restored")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 392,
    name: 'Natural Gas Pipeline Cathodic Protection',
    slug: 'pipeline-cathodic-protection',
    category: 'Telecommunications & Utilities',
    phase: 2,
    iconName: 'ShieldCheck',
    purpose: 'Impressed current cathodic protection (ICCP) rectifier telemetry, pipe-to-soil voltage potential tests, and DOT PHMSA.',
    responsibilities: [
      'Monitor continuous negative pipe-to-soil potential voltages (-850mV criteria) preventing pipeline metal corrosion',
      'Track solar and AC transformer rectifier operational outputs and anode ground bed depletion rates',
      'Generate annual pipeline integrity compliance reports mandated by the DOT Pipeline and Hazardous Materials Safety Admin'
    ],
    tableName: 'cathodic_rectifiers',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'rectifier_id', type: 'VARCHAR(20)', nullable: false, index: true },
      { name: 'pipeline_segment', type: 'VARCHAR(32)', nullable: false },
      { name: 'rectifier_type', type: 'ENUM("solar","ac_transformer","hybrid")', nullable: false },
      { name: 'output_voltage_v', type: 'DECIMAL(6,2)', nullable: false },
      { name: 'output_current_a', type: 'DECIMAL(6,2)', nullable: false },
      { name: 'pipe_to_soil_mv', type: 'DECIMAL(7,1)', nullable: false },
      { name: 'meets_850mv_criterion', type: 'BOOLEAN', nullable: false },
      { name: 'anode_bed_remaining_pct', type: 'DECIMAL(5,2)', nullable: true },
      { name: 'last_test_date', type: 'DATE', nullable: false },
      { name: 'compliance_report_due', type: 'DATE', nullable: false },
      { name: 'status', type: 'ENUM("operating","degraded","fault","offline")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 393,
    name: 'Solar Farm Photovoltaic Inverter SCADA',
    slug: 'solar-inverter-scada',
    category: 'Telecommunications & Utilities',
    phase: 3,
    iconName: 'Sun',
    purpose: 'Utility-scale solar string inverter telemetry, solar tracking motor control, soiling loss tracking, and grid curtailment.',
    responsibilities: [
      'Monitor DC megawatt input, AC power output, and inverter conversion efficiency across thousands of solar strings',
      'Orient single-axis solar trackers to the optimal astronomical sun angle throughout the day',
      'Calculate photovoltaic panel dust soiling losses and optimize utility robotic cleaning schedules'
    ],
    tableName: 'solar_inverters',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'inverter_id', type: 'VARCHAR(20)', nullable: false, index: true },
      { name: 'inverter_model', type: 'VARCHAR(64)', nullable: false },
      { name: 'string_count', type: 'INT UNSIGNED', nullable: false },
      { name: 'dc_input_kw', type: 'DECIMAL(10,3)', nullable: false },
      { name: 'ac_output_kw', type: 'DECIMAL(10,3)', nullable: false },
      { name: 'efficiency_pct', type: 'DECIMAL(5,2)', nullable: false },
      { name: 'tracker_angle_deg', type: 'DECIMAL(6,2)', nullable: true },
      { name: 'soiling_loss_pct', type: 'DECIMAL(5,2)', nullable: true },
      { name: 'grid_curtailment_pct', type: 'DECIMAL(5,2)', nullable: true },
      { name: 'panel_temp_c', type: 'DECIMAL(5,1)', nullable: true },
      { name: 'inverter_temp_c', type: 'DECIMAL(5,1)', nullable: true },
      { name: 'status', type: 'ENUM("generating","curtailed","fault","offline")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 394,
    name: 'Wind Turbine Fleet Aerodynamic Telemetry',
    slug: 'wind-turbine-fleet',
    category: 'Telecommunications & Utilities',
    phase: 3,
    iconName: 'Wind',
    purpose: 'Wind speed anemometer readings, blade pitch regulation, yaw drive alignment, and gearbox lubrication telemetry.',
    responsibilities: [
      'Adjust wind turbine blade pitch angles to maximize power extraction while protecting against hurricane cut-out speeds',
      'Align nacelle yaw orientation facing oncoming wind direction using continuous ultrasonic anemometers',
      'Monitor multi-stage gearbox particle counters and oil temperatures preventing mechanical catastrophic seizure'
    ],
    tableName: 'wind_turbines',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'turbine_id', type: 'VARCHAR(20)', nullable: false, index: true },
      { name: 'turbine_model', type: 'VARCHAR(64)', nullable: false },
      { name: 'rated_capacity_mw', type: 'DECIMAL(6,2)', nullable: false },
      { name: 'wind_speed_ms', type: 'DECIMAL(5,2)', nullable: false },
      { name: 'blade_pitch_deg', type: 'DECIMAL(5,2)', nullable: false },
      { name: 'yaw_angle_deg', type: 'DECIMAL(6,2)', nullable: false },
      { name: 'power_output_kw', type: 'DECIMAL(10,3)', nullable: false },
      { name: 'gearbox_oil_temp_c', type: 'DECIMAL(5,1)', nullable: true },
      { name: 'gearbox_particle_count', type: 'INT UNSIGNED', nullable: true },
      { name: 'nacelle_temp_c', type: 'DECIMAL(5,1)', nullable: true },
      { name: 'availability_pct', type: 'DECIMAL(5,2)', nullable: true },
      { name: 'status', type: 'ENUM("generating","idling","fault","hurricane_cutout")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 395,
    name: 'Battery Energy Storage System (BESS) EMS',
    slug: 'bess-energy-storage',
    category: 'Telecommunications & Utilities',
    phase: 3,
    iconName: 'BatteryCharging',
    purpose: 'Grid-scale lithium iron phosphate (LFP) state of charge (SoC), thermal runaway alarms, and frequency regulation.',
    responsibilities: [
      'Control multi-megawatt battery energy storage charge/discharge cycles in response to grid frequency anomalies',
      'Monitor cell-level temperatures, voltages, and internal impedances detecting thermal runaway precursors',
      'Participate in wholesale ancillary service electricity markets providing fast-frequency response (FFR)'
    ],
    tableName: 'bess_installations',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'installation_id', type: 'VARCHAR(20)', nullable: false, index: true },
      { name: 'site_name', type: 'VARCHAR(128)', nullable: false },
      { name: 'chemistry', type: 'ENUM("LFP","NMC","NCA")', nullable: false },
      { name: 'rated_capacity_mwh', type: 'DECIMAL(10,2)', nullable: false },
      { name: 'state_of_charge_pct', type: 'DECIMAL(5,2)', nullable: false },
      { name: 'charge_rate_mw', type: 'DECIMAL(8,3)', nullable: false },
      { name: 'discharge_rate_mw', type: 'DECIMAL(8,3)', nullable: false },
      { name: 'max_cell_temp_c', type: 'DECIMAL(5,1)', nullable: true },
      { name: 'thermal_runaway_alert', type: 'BOOLEAN', nullable: false },
      { name: 'cycle_count', type: 'INT UNSIGNED', nullable: false },
      { name: 'degradation_pct', type: 'DECIMAL(5,2)', nullable: true },
      { name: 'market_participation', type: 'ENUM("frequency_regulation","arbitrage","peak_shaving","standby")', nullable: false },
      { name: 'status', type: 'ENUM("charging","discharging","idle","fault","thermal_alarm")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 396,
    name: 'Municipal Streetlight LED Mesh Network',
    slug: 'smart-streetlights',
    category: 'Telecommunications & Utilities',
    phase: 2,
    iconName: 'Lightbulb',
    purpose: 'Z-Wave/Wi-SUN wireless streetlight mesh, photocell astronomical clock dimming, and burnt fixture outage detection.',
    responsibilities: [
      'Manage municipal LED streetlights connected via self-healing Wi-SUN wireless mesh network nodes',
      'Dim streetlight illumination levels during late night hours to conserve city electrical budgets',
      'Automatically flag burnt out fixtures or faulty photocell drivers for public works maintenance repair'
    ],
    tableName: 'smart_streetlights',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'fixture_id', type: 'VARCHAR(20)', nullable: false, index: true },
      { name: 'pole_location_lat', type: 'DECIMAL(10,7)', nullable: false },
      { name: 'pole_location_lng', type: 'DECIMAL(10,7)', nullable: false },
      { name: 'wattage', type: 'INT UNSIGNED', nullable: false },
      { name: 'lumen_output', type: 'INT UNSIGNED', nullable: false },
      { name: 'dimming_level_pct', type: 'INT UNSIGNED', nullable: false },
      { name: 'photocell_status', type: 'ENUM("dusk_on","dawn_off","fault")', nullable: false },
      { name: 'mesh_node_id', type: 'VARCHAR(10)', nullable: true },
      { name: 'signal_strength_dbm', type: 'INT', nullable: true },
      { name: 'energy_consumed_kwh', type: 'DECIMAL(10,4)', nullable: false },
      { name: 'last_reported_at', type: 'TIMESTAMP', nullable: true },
      { name: 'status', type: 'ENUM("online","outage","maintenance","burnt_out")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 397,
    name: 'Hydroelectric Dam Reservoir & Spillway',
    slug: 'hydroelectric-dam-controls',
    category: 'Telecommunications & Utilities',
    phase: 3,
    iconName: 'Droplets',
    purpose: 'Acre-feet reservoir water levels, Francis turbine hydraulic head pressure, flood spillway gates, and fish ladders.',
    responsibilities: [
      'Calculate hydrostatic pressure, penstock water flow rates, and electrical generation of hydroelectric turbines',
      'Automate motorized spillway radial flood gate positions based on upstream snowpack runoff telemetry',
      'Regulate continuous minimum ecological river bypass flow rates and operate upstream fish passage ladders'
    ],
    tableName: 'hydro_turbines',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'turbine_id', type: 'VARCHAR(20)', nullable: false, index: true },
      { name: 'dam_name', type: 'VARCHAR(128)', nullable: false },
      { name: 'turbine_type', type: 'ENUM("francis","kaplan","pelton")', nullable: false },
      { name: 'rated_capacity_mw', type: 'DECIMAL(10,2)', nullable: false },
      { name: 'reservoir_level_ft', type: 'DECIMAL(8,2)', nullable: false },
      { name: 'hydraulic_head_ft', type: 'DECIMAL(8,2)', nullable: false },
      { name: 'flow_rate_cfs', type: 'DECIMAL(10,2)', nullable: false },
      { name: 'power_output_mw', type: 'DECIMAL(10,3)', nullable: false },
      { name: 'spillway_gate_position_pct', type: 'INT UNSIGNED', nullable: true },
      { name: 'fish_ladder_flow_cfs', type: 'DECIMAL(8,2)', nullable: true },
      { name: 'bypass_flow_cfs', type: 'DECIMAL(8,2)', nullable: true },
      { name: 'status', type: 'ENUM("generating","spill","maintenance","flood_control")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 398,
    name: 'Subsea Telecommunications Cable Monitoring',
    slug: 'subsea-cable-monitoring',
    category: 'Telecommunications & Utilities',
    phase: 3,
    iconName: 'Anchor',
    purpose: 'Transoceanic optical amplifier telemetry, Coherent DWDM wavelengths, marine ship AIS anchor proximity warnings.',
    responsibilities: [
      'Monitor optical signal-to-noise ratios (OSNR) across submerged erbium-doped fiber amplifiers (EDFA)',
      'Track commercial vessel Automatic Identification System (AIS) positions near submarine cable landing zones',
      'Broadcast immediate automated radio warnings to maritime vessels dragging anchors near undersea fiber routes'
    ],
    tableName: 'subsea_cables',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'cable_id', type: 'VARCHAR(20)', nullable: false, index: true },
      { name: 'cable_name', type: 'VARCHAR(128)', nullable: false },
      { name: 'landing_station_a', type: 'VARCHAR(64)', nullable: false },
      { name: 'landing_station_b', type: 'VARCHAR(64)', nullable: false },
      { name: 'total_length_km', type: 'DECIMAL(10,2)', nullable: false },
      { name: 'fiber_pair_count', type: 'INT UNSIGNED', nullable: false },
      { name: 'osnr_db', type: 'DECIMAL(6,2)', nullable: true },
      { name: 'edfa_count', type: 'INT UNSIGNED', nullable: false },
      { name: 'dwdm_wavelengths', type: 'INT UNSIGNED', nullable: false },
      { name: 'nearest_vessel_ais_id', type: 'VARCHAR(10)', nullable: true },
      { name: 'anchor_warning_sent', type: 'BOOLEAN', nullable: false },
      { name: 'status', type: 'ENUM("operational","degraded","cut","repair_vessel_dispatched")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 399,
    name: 'Satellite Ground Station & Orbital Passes',
    slug: 'satellite-ground-stations',
    category: 'Telecommunications & Utilities',
    phase: 3,
    iconName: 'Radio',
    purpose: 'Low Earth Orbit (LEO) parabolic dish antenna tracking, Doppler frequency shifts, telemetry downlinks, and passes.',
    responsibilities: [
      'Control motorized parabolic dish azimuth and elevation motors tracking LEO satellites across orbital passes',
      'Compensate radio frequency transceivers dynamically for Doppler frequency shifts during high-speed passes',
      'Ingest and decrypt spacecraft housekeeping telemetry downlinks and schedule scientific payload data transfers'
    ],
    tableName: 'satellite_passes',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'pass_id', type: 'VARCHAR(36)', nullable: false, index: true },
      { name: 'satellite_norad_id', type: 'INT UNSIGNED', nullable: false },
      { name: 'station_id', type: 'VARCHAR(20)', nullable: false },
      { name: 'pass_start_at', type: 'TIMESTAMP', nullable: false },
      { name: 'pass_end_at', type: 'TIMESTAMP', nullable: false },
      { name: 'max_elevation_deg', type: 'DECIMAL(5,2)', nullable: false },
      { name: 'azimuth_start_deg', type: 'DECIMAL(6,2)', nullable: false },
      { name: 'azimuth_end_deg', type: 'DECIMAL(6,2)', nullable: false },
      { name: 'doppler_shift_hz', type: 'DECIMAL(12,2)', nullable: true },
      { name: 'downlink_freq_mhz', type: 'DECIMAL(10,4)', nullable: false },
      { name: 'data_volume_mbps', type: 'DECIMAL(10,2)', nullable: true },
      { name: 'status', type: 'ENUM("scheduled","tracking","completed","missed")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ]
  }),
  buildModule({
    id: 400,
    name: 'Enterprise Architecture Repository (TOGAF)',
    slug: 'enterprise-architecture-togaf',
    category: 'Telecommunications & Utilities',
    phase: 3,
    iconName: 'Layers',
    purpose: 'TOGAF metamodel, application portfolio management (TIME model), technology standards lifecycle, and roadmaps.',
    responsibilities: [
      'Catalog all enterprise business capabilities, data entities, application services, and technology infrastructure',
      'Categorize corporate software applications using the Gartner TIME framework (Tolerate, Invest, Migrate, Eliminate)',
      'Enforce technology stack obsolescence lifecycles and architectural review board (ARB) governance standards'
    ],
    tableName: 'architecture_components',
    tableColumns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
      { name: 'component_id', type: 'VARCHAR(36)', nullable: false, index: true },
      { name: 'component_type', type: 'ENUM("capability","data_entity","app_service","tech_infra")', nullable: false },
      { name: 'component_name', type: 'VARCHAR(128)', nullable: false },
      { name: 'description', type: 'TEXT', nullable: false },
      { name: 'time_action', type: 'ENUM("tolerate","invest","migrate","eliminate")', nullable: true },
      { name: 'lifecycle_status', type: 'ENUM("current","deprecated","planned","retired")', nullable: false },
      { name: 'owner_domain', type: 'VARCHAR(64)', nullable: false },
      { name: 'dependency_count', type: 'INT UNSIGNED', nullable: false },
      { name: 'tech_stack', type: 'JSON', nullable: true },
      { name: 'review_date', type: 'DATE', nullable: true },
      { name: 'arb_approved', type: 'BOOLEAN', nullable: false },
      { name: 'status', type: 'ENUM("active","pending_review","approved","retired")', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false },
      { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
    ]
  })
];
