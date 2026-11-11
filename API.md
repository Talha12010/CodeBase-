# NEXUS-100 — RESTful API Architecture Specification

## 1. API Design Principles
- **Base URI Pattern**: `/api/v1/{module-namespace}/{resource}`
- **Standard Protocol**: HTTPS only, JSON request/response payloads (`Content-Type: application/json`).
- **Stateless Authentication**: Laravel Sanctum Bearer tokens (`Authorization: Bearer <token>`).

---

## 2. Standardized Response Envelopes

### Success Response Format
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "per_page": 25,
    "total": 1280,
    "total_pages": 52
  }
}
```

### Validation Error Response (HTTP 422)
```json
{
  "success": false,
  "message": "Validation failed for the requested operation.",
  "errors": {
    "email": ["The email has already been taken."],
    "password": ["The password must be at least 8 characters."]
  }
}
```

### Authorization Error Response (HTTP 403)
```json
{
  "success": false,
  "message": "User does not possess the required permission [commerce.orders.manage]."
}
```

---

## 3. Rate Limiting Strategy
- **Standard Tier**: 60 requests per minute per IP.
- **Authenticated Users**: 300 requests per minute per Sanctum token.
- **Sensitive Endpoints** (Login, Password Reset, Checkout): 5 requests per minute with exponential backoff headers (`Retry-After`).

---

## 4. Representative API Endpoints Across 100 Modules

| Module | Route | Method | Description |
| :--- | :--- | :--- | :--- |
| **01 Identity** | `/api/v1/identity/users` | `GET` | List user accounts with filtering & pagination |
| **02 Auth** | `/api/v1/auth/login` | `POST` | Authenticate credentials and issue Sanctum token |
| **04 Roles** | `/api/v1/roles` | `GET, POST` | Manage roles and permission associations |
| **06 Organizations** | `/api/v1/organizations` | `GET, POST` | Create and configure enterprise tenants |
| **11 Social** | `/api/v1/social/follow` | `POST` | Follow/unfollow users & manage social graph |
| **21 Messaging** | `/api/v1/messages/threads` | `GET, POST` | Start conversations and send private messages |
| **31 Products** | `/api/v1/products` | `GET, POST` | Product catalog CRUD and SKU management |
| **37 Orders** | `/api/v1/orders/checkout` | `POST` | Atomic checkout, inventory reservation, order creation |
| **41 Payments** | `/api/v1/payments/process` | `POST` | Transaction-safe payment intent execution |
| **44 Wallet** | `/api/v1/wallets/transfer` | `POST` | Double-entry ledger wallet fund transfer |
| **53 Bookings** | `/api/v1/bookings/reserve` | `POST` | Book time slots with availability lock |
| **63 Tournaments** | `/api/v1/tournaments` | `GET, POST` | Bracket management and tournament rounds |
| **72 Campaigns** | `/api/v1/marketing/campaigns` | `GET, POST` | Omnichannel marketing campaign management |
| **83 Analytics** | `/api/v1/analytics/overview` | `GET` | Platform throughput, conversion, and retention metrics |
| **92 Auditing** | `/api/v1/audit/logs` | `GET` | Tamper-evident immutable audit log search |
| **100 System** | `/api/v1/system/health` | `GET` | Service readiness, queues, and database metrics |
