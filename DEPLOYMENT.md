# NEXUS-100 — Deployment & Infrastructure Guide

## 1. Local Development Setup (Windows / Linux / macOS)

### Prerequisites
- PHP 8.3+ (Extensions: `pdo_mysql`, `mbstring`, `openssl`, `bcmath`, `curl`, `redis`, `gd`)
- Composer 2.7+
- Node.js 20+ & npm 10+
- MySQL 8.0+

### Setup Commands
```bash
# 1. Clone repository
git clone https://github.com/enterprise/nexus-100.git
cd nexus-100

# 2. Install PHP backend dependencies
composer install --prefer-dist --optimize-autoloader

# 3. Environment configuration
cp .env.example .env
php artisan key:generate

# 4. Database migrations & seeders (all 100 modules)
php artisan migrate --seed

# 5. Install frontend dependencies and build assets
npm install
npm run build # or npm run dev for live development

# 6. Start queue worker and scheduler
php artisan queue:work redis --tries=3
php artisan schedule:work
```

---

## 2. Production Optimization Checklist
- `php artisan config:cache`
- `php artisan route:cache`
- `php artisan view:cache`
- `php artisan event:cache`
- Enable OPcache in `php.ini` with `opcache.enable=1` and `opcache.memory_consumption=256`.
- Redis cluster for queue workers and cache tags.
