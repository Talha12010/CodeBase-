# NEXUS-100 — Security Architecture & Guidelines

## 1. Threat Model & Defense-in-Depth
NEXUS-100 enforces multi-tier defense:
1. **Perimeter Layer**: Cloudflare / Reverse Proxy DDoS protection, SSL/TLS 1.3 termination, strict CORS headers.
2. **Network Layer**: Internal private subnet isolation between application servers, Redis cluster, and MySQL database.
3. **Application Layer**: Laravel Sanctum Bearer tokens, FormRequest validation, Content Security Policy (CSP), SQL Injection prevention via PDO parameterized queries.
4. **Data Layer**: Sensitive column encryption (AES-256-GCM), bcrypt/Argon2id password hashing, PCI-DSS compliant payment tokenization.

---

## 2. Authentication & Authorization Enforcement

### Sanctum Stateless Tokens
- Plaintext API tokens are returned only once upon creation.
- Hashes (`SHA-256`) stored in `personal_access_tokens`.
- Expiry strictly enforced (configurable default: 7 days with automatic refresh cycle).

### Server-Side RBAC
```php
// Server-side policy check (NEVER trust frontend claims)
public function update(User $user, Order $order): bool
{
    return $user->hasPermissionTo('orders.update') 
        && ($order->vendor_id === $user->vendor_id || $user->hasRole('super-admin'));
}
```

---

## 3. Financial Security & Double-Entry Integrity
- **Database Locks**: Pessimistic locking (`$wallet->lockForUpdate()`) prevents race conditions and balance doubling during concurrent checkout requests.
- **Idempotency**: All payment transactions require an `Idempotency-Key` header stored in Redis with a 24-hour TTL.
- **Audit Trails**: Financial mutations generate immutable entries in `ledger_entries` with before/after balances.

---

## 4. Input Sanitization & XSS Mitigation
- Strict FormRequests reject unexpected fields via `$request->validated()`.
- Blade and React JSX auto-escape HTML entities.
- User-supplied Markdown is parsed through sanitized HTML purifiers stripping `script`, `iframe`, and malicious attributes.
