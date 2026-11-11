# NEXUS-100 — Database Architecture & ERD Specification

## 1. Relational Database Engine
- **RDBMS**: MySQL 8.0+
- **Storage Engine**: InnoDB (Strict ACID compliance)
- **Character Set**: `utf8mb4` with collation `utf8mb4_unicode_ci`
- **Timezone**: UTC (`+00:00`) for all `created_at`, `updated_at`, and `deleted_at` timestamps.

---

## 2. Global Table Design Conventions

1. **Primary Keys**:
   - High-velocity transactional tables use `BIGINT UNSIGNED AUTO_INCREMENT` for maximum B-tree indexing density and clustering performance.
   - External-facing public entities use UUIDv4 / ULID (`uuid CHAR(36) UNIQUE` or `ulid CHAR(26) UNIQUE`) indexed alongside integer PKs to prevent enumeration attacks.
2. **Audit & Lifecycle Columns**:
   - `created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP`
   - `updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`
   - `deleted_at TIMESTAMP NULL` (Soft deletes on major business records)
   - `created_by BIGINT UNSIGNED NULL` / `updated_by BIGINT UNSIGNED NULL`
3. **Foreign Keys**:
   - Strict `CONSTRAINT fk_... FOREIGN KEY (...) REFERENCES ... ON DELETE RESTRICT` for financial and inventory tables.
   - Cascading deletes are restricted to pure composite child items (e.g. `order_items` onDelete CASCADE with `orders`).

---

## 3. Core Database Tables by Module Domain

### Domain 1: Identity & Access (Modules 01–10)
- `users` (id, uuid, email, password, phone, status, email_verified_at, created_at, updated_at, deleted_at)
- `user_identities` (id, user_id, provider, provider_id, access_token, created_at)
- `roles` (id, name, slug, description, is_system, created_at)
- `permissions` (id, name, slug, module_code, description, created_at)
- `role_user` (user_id, role_id, created_at)
- `permission_role` (role_id, permission_id)
- `organizations` (id, uuid, name, slug, plan_tier, settings, created_at, updated_at)
- `organization_user` (organization_id, user_id, role, created_at)
- `teams` (id, organization_id, name, leader_id, created_at, updated_at)
- `team_members` (team_id, user_id, joined_at)
- `user_profiles` (id, user_id, display_name, avatar_url, bio, timezone, locale, created_at)
- `security_events` (id, user_id, event_type, ip_address, user_agent, payload, created_at)
- `compliance_records` (id, organization_id, standard, status, audited_at, expires_at)

### Domain 2: Social (Modules 11–20)
- `user_relationships` (id, follower_id, following_id, status, created_at)
- `posts` (id, uuid, user_id, community_id, content, visibility, likes_count, comments_count, created_at)
- `communities` (id, name, slug, description, owner_id, privacy, members_count, created_at)
- `groups` (id, community_id, name, privacy, created_at)
- `forums` (id, title, category, topics_count, posts_count, created_at)
- `forum_threads` (id, forum_id, user_id, title, is_pinned, is_locked, created_at)
- `articles` (id, author_id, title, slug, body, status, published_at, created_at)
- `media_assets` (id, user_id, filename, disk, mime_type, file_size, storage_path, created_at)
- `live_streams` (id, host_id, stream_key, title, viewer_count, status, started_at, ended_at)
- `creators` (id, user_id, tier, monetization_status, payout_settings, created_at)
- `influencer_campaigns` (id, brand_id, influencer_id, budget, deliverables, status)

### Domain 3: Communication (Modules 21–30)
- `conversations` (id, uuid, type, created_at, updated_at)
- `conversation_participants` (conversation_id, user_id, last_read_at)
- `messages` (id, conversation_id, sender_id, message_type, body, metadata, created_at)
- `video_rooms` (id, host_id, room_code, max_participants, is_active, created_at)
- `voice_calls` (id, caller_id, receiver_id, duration_seconds, status, created_at)
- `email_logs` (id, recipient, template, subject, status, provider_message_id, sent_at)
- `sms_logs` (id, phone_number, body, status, cost, sent_at)
- `notifications` (id, notifiable_type, notifiable_id, type, data, read_at, created_at)
- `contacts` (id, user_id, name, email, phone, company, tags, created_at)
- `support_tickets` (id, ticket_number, customer_id, priority, status, subject, created_at)
- `helpdesk_agents` (id, user_id, department, max_active_tickets, is_available)

### Domain 4: Commerce (Modules 31–40)
- `products` (id, uuid, vendor_id, sku, title, description, price, currency, stock_status, created_at)
- `categories` (id, parent_id, name, slug, level, created_at)
- `product_categories` (product_id, category_id)
- `inventory_items` (id, product_id, warehouse_id, quantity_on_hand, quantity_reserved, safety_stock)
- `warehouses` (id, name, code, address, is_active, created_at)
- `vendors` (id, name, code, contact_email, rating, created_at)
- `sellers` (id, user_id, store_name, commission_rate, verification_status, created_at)
- `orders` (id, order_number, user_id, status, subtotal, tax_total, shipping_total, total, created_at)
- `order_items` (id, order_id, product_id, quantity, unit_price, total_price)
- `shipments` (id, order_id, tracking_number, carrier, status, estimated_delivery, created_at)
- `returns` (id, order_id, user_id, reason, status, refund_amount, created_at)
- `purchase_orders` (id, vendor_id, po_number, total_amount, status, created_at)

### Domain 5: Financial (Modules 41–50)
- `payments` (id, payment_intent_id, order_id, amount, currency, status, provider, created_at)
- `billing_profiles` (id, user_id, customer_id, payment_method_id, billing_address, is_default)
- `subscription_plans` (id, name, code, billing_interval, price, features, created_at)
- `subscriptions` (id, user_id, plan_id, status, current_period_start, current_period_end)
- `wallets` (id, user_id, balance, currency, is_locked, created_at)
- `wallet_transactions` (id, wallet_id, type, amount, balance_after, reference_id, created_at)
- `invoices` (id, invoice_number, user_id, order_id, amount_due, amount_paid, status, due_date)
- `refunds` (id, payment_id, amount, reason, status, processed_at)
- `tax_rules` (id, country_code, state_code, tax_rate, is_compound, active_from)
- `commissions` (id, order_id, seller_id, rate, amount, payout_status, created_at)
- `financial_summaries` (id, fiscal_year, fiscal_month, gross_revenue, net_revenue, refunds_total)

### Domains 6–10 (Modules 51–100)
- Full enterprise schemas encompassing: `services`, `bookings`, `schedules`, `events`, `venues`, `games`, `tournaments`, `leaderboards`, `campaigns`, `coupons`, `affiliates`, `crm_leads`, `search_indexes`, `analytics_events`, `audit_logs`, `moderation_cases`, `fraud_signals`, `system_settings`.
