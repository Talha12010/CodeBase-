
export const modulesDomain5_6 = [
  // DOMAIN 5: FINANCIAL (41-50)
  {
    id: 41,
    code: 'MOD-041',
    name: 'Payment Management',
    slug: 'payment-management',
    category: 'Financial',
    phase: 5,
    iconName: 'CreditCard',
    purpose: 'Gateway abstraction (Stripe, Adyen, PayPal), idempotent checkout, 3DS verification, and payment intents.',
    responsibilities: [
      'Orchestrate secure tokenized payment attempts via external gateways',
      'Enforce idempotent transactions via Redis headers and unique intent keys',
      'Process asynchronous webhook events for payment confirmations and failures'
    ],
    databaseTables: [
      {
        name: 'payments',
        description: 'Payment transactions and processor intents.',
        primaryKey: 'id (BIGINT UNSIGNED)',
        foreignKeys: [{ column: 'order_id', references: 'id', table: 'orders' }],
        columns: [
          { name: 'id', type: 'BIGINT UNSIGNED', nullable: false },
          { name: 'payment_intent_id', type: 'VARCHAR(128)', nullable: false, index: true },
          { name: 'order_id', type: 'BIGINT UNSIGNED', nullable: true, index: true },
          { name: 'amount', type: 'DECIMAL(12,2)', nullable: false },
          { name: 'currency', type: 'CHAR(3)', nullable: false },
          { name: 'status', type: 'ENUM("pending","requires_action","succeeded","failed")', nullable: false },
          { name: 'provider', type: 'VARCHAR(32)', nullable: false }
        ],
        indexes: ['payment_intent_unique']
      }
    ],
    apiEndpoints: [
      { method: 'POST', path: '/api/v1/payments/intent', description: 'Create payment intent', authRequired: true },
      { method: 'POST', path: '/api/v1/payments/webhook', description: 'Handle gateway webhook', authRequired: false }
    ],
    services: ['PaymentGatewayService', 'IdempotencyLockService'],
    permissions: ['payments.process', 'payments.refund'],
    events: ['PaymentSucceeded', 'PaymentFailed'],
    jobs: ['ReconcileUnconfirmedPaymentsJob'],
    dependencies: [1, 37],
    tests: ['PaymentIdempotencyTest', 'GatewayWebhookSignatureTest'],
    codeTemplates: {
      controller: `<?php

namespace App\\Http\\Controllers\\Api\\V1;

use App\\Http\\Controllers\\Controller;
use App\\Http\\Requests\\CreatePaymentIntentRequest;
use App\\Services\\PaymentGatewayService;
use Illuminate\\Http\\JsonResponse;
use Illuminate\\Http\\Request;

class PaymentController extends Controller
{
    public function __construct(
        private readonly PaymentGatewayService $paymentGateway
    ) {}

    public function createIntent(CreatePaymentIntentRequest $request): JsonResponse
    {
        $payment = $this->paymentGateway->createIntent(
            orderId: $request->validated('order_id'),
            amount: $request->validated('amount'),
            currency: $request->validated('currency'),
            provider: $request->validated('provider'),
            idempotencyKey: $request->header('Idempotency-Key')
        );

        return response()->json([
            'data' => $payment,
            'client_secret' => $payment->client_secret ?? null,
        ], 201);
    }

    public function webhook(Request $request): JsonResponse
    {
        $payload = $request->getContent();
        $signature = $request->header('Stripe-Signature') ?? $request->header('X-Webhook-Signature');

        $result = $this->paymentGateway->handleWebhook($payload, $signature);

        return response()->json(['received' => true]);
    }
}`,
      model: `<?php

namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Model;
use Illuminate\\Database\\Eloquent\\Relations\\BelongsTo;

class Payment extends Model
{
    protected $fillable = [
        'payment_intent_id',
        'order_id',
        'amount',
        'currency',
        'status',
        'provider',
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
        ];
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    public function isSucceeded(): bool
    {
        return $this->status === 'succeeded';
    }

    public function markSucceeded(): void
    {
        $this->update(['status' => 'succeeded']);
    }

    public function markFailed(): void
    {
        $this->update(['status' => 'failed']);
    }

    public function markRequiresAction(): void
    {
        $this->update(['status' => 'requires_action']);
    }
}`,
      service: `<?php

namespace App\\Services;

use App\\Events\\PaymentFailed;
use App\\Events\\PaymentSucceeded;
use App\\Exceptions\\PaymentGatewayException;
use App\\Models\\Payment;
use Illuminate\\Support\\Facades\\DB;
use Illuminate\\Support\\Facades\\Redis;

class PaymentGatewayService
{
    private const IDEMPOTENCY_TTL = 86400;

    public function createIntent(
        int $orderId,
        string $amount,
        string $currency,
        string $provider,
        ?string $idempotencyKey = null
    ): Payment {
        $this->enforceIdempotency($idempotencyKey);

        return DB::transaction(function () use ($orderId, $amount, $currency, $provider, $idempotencyKey) {
            $intentId = $this->generateIntentId($provider);

            $payment = Payment::create([
                'payment_intent_id' => $intentId,
                'order_id' => $orderId,
                'amount' => $amount,
                'currency' => strtoupper($currency),
                'status' => 'pending',
                'provider' => $provider,
            ]);

            if ($idempotencyKey) {
                Redis::setex("idempotency:{$idempotencyKey}", self::IDEMPOTENCY_TTL, $payment->id);
            }

            return $payment;
        });
    }

    public function handleWebhook(string $payload, ?string $signature): Payment
    {
        $event = $this->parseAndVerifyWebhook($payload, $signature);

        $payment = Payment::where('payment_intent_id', $event['intent_id'])->firstOrFail();

        match ($event['type']) {
            'payment_intent.succeeded' => $this->handleSucceeded($payment),
            'payment_intent.payment_failed' => $this->handleFailed($payment),
            default => null,
        };

        return $payment;
    }

    private function enforceIdempotency(?string $key): void
    {
        if ($key && Redis::exists("idempotency:{$key}")) {
            throw new PaymentGatewayException('Duplicate request detected via idempotency key.');
        }
    }

    private function generateIntentId(string $provider): string
    {
        return match ($provider) {
            'Stripe' => 'pi_' . bin2hex(random_bytes(16)),
            'PayPal' => 'PAY-' . strtoupper(bin2hex(random_bytes(12))),
            'Adyen' => 'adyen_' . bin2hex(random_bytes(16)),
            default => 'pi_' . bin2hex(random_bytes(16)),
        };
    }

    private function parseAndVerifyWebhook(string $payload, ?string $signature): array
    {
        $event = json_decode($payload, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new PaymentGatewayException('Invalid webhook payload.');
        }

        return $event;
    }

    private function handleSucceeded(Payment $payment): void
    {
        DB::transaction(function () use ($payment) {
            $payment->markSucceeded();
            event(new PaymentSucceeded($payment));
        });
    }

    private function handleFailed(Payment $payment): void
    {
        DB::transaction(function () use ($payment) {
            $payment->markFailed();
            event(new PaymentFailed($payment));
        });
    }
}`,
      formRequest: `<?php

namespace App\\Http\\Requests;

use Illuminate\\Foundation\\Http\\FormRequest;

class CreatePaymentIntentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'order_id' => 'required|integer|exists:orders,id',
            'amount' => 'required|numeric|min:0.01|max:99999999.99',
            'currency' => 'required|size:3|alpha',
            'provider' => 'required|in:Stripe,PayPal,Adyen',
        ];
    }
}`,
      migration: `<?php

use Illuminate\\Database\\Migrations\\Migration;
use Illuminate\\Database\\Schema\\Blueprint;
use Illuminate\\Support\\Facades\\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->string('payment_intent_id', 128)->unique();
            $table->unsignedBigInteger('order_id')->nullable()->index();
            $table->decimal('amount', 12, 2);
            $table->char('currency', 3);
            $table->enum('status', ['pending', 'requires_action', 'succeeded', 'failed']);
            $table->string('provider', 32);
            $table->timestamps();

            $table->foreign('order_id')->references('id')->on('orders')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};`,
      policy: `<?php

namespace App\\Policies;

use App\\Models\\Payment;
use App\\Models\\User;

class PaymentPolicy
{
    public function process(User $user): bool
    {
        return $user->hasPermission('payments.process');
    }

    public function refund(User $user, Payment $payment): bool
    {
        return $user->hasPermission('payments.refund');
    }

    public function view(User $user, Payment $payment): bool
    {
        return $user->hasPermission('payments.process')
            || $payment->order->user_id === $user->id;
    }
}`
    },
    sampleRecords: [
      { id: 301, intent: 'pi_3MtwxELkdIwHu7ix', amount: 2499.00, currency: 'USD', status: 'succeeded', provider: 'Stripe' }
    ],
    status: 'Active'
  },
  {
    id: 42,
    code: 'MOD-042',
    name: 'Billing Management',
    slug: 'billing-management',
    category: 'Financial',
    phase: 5,
    iconName: 'Receipt',
    purpose: 'Customer payment methods, billing accounts, corporate invoice routing, and billing cycles.',
    responsibilities: [
      'Store vaulted payment method tokens (cards, bank accounts)',
      'Manage billing addresses, VAT IDs, and tax exemption certificates',
      'Schedule automated card charges on designated billing cycle dates'
    ],
    databaseTables: [
      {
        name: 'billing_profiles',
        description: 'Customer vaulted payment instruments.',
        primaryKey: 'id (BIGINT UNSIGNED)',
        foreignKeys: [{ column: 'user_id', references: 'id', table: 'users' }],
        columns: [
          { name: 'id', type: 'BIGINT UNSIGNED', nullable: false },
          { name: 'user_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
          { name: 'gateway_customer_id', type: 'VARCHAR(128)', nullable: false },
          { name: 'card_last4', type: 'CHAR(4)', nullable: true },
          { name: 'is_default', type: 'BOOLEAN', nullable: false }
        ],
        indexes: ['idx_billing_user']
      }
    ],
    apiEndpoints: [
      { method: 'GET', path: '/api/v1/billing/methods', description: 'List customer cards', authRequired: true },
      { method: 'POST', path: '/api/v1/billing/methods', description: 'Attach payment method', authRequired: true }
    ],
    services: ['BillingProfileService'],
    permissions: ['billing.manage'],
    events: ['PaymentMethodAttached'],
    jobs: ['PruneExpiredCardsJob'],
    dependencies: [1],
    tests: ['BillingProfileVaultTest'],
    codeTemplates: {
      controller: `<?php

namespace App\\Http\\Controllers\\Api\\V1;

use App\\Http\\Controllers\\Controller;
use App\\Http\\Requests\\AttachPaymentMethodRequest;
use App\\Services\\BillingProfileService;
use Illuminate\\Http\\JsonResponse;
use Illuminate\\Http\\Request;

class BillingController extends Controller
{
    public function __construct(
        private readonly BillingProfileService $billingService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $methods = $this->billingService->listMethods($request->user());

        return response()->json(['data' => $methods]);
    }

    public function store(AttachPaymentMethodRequest $request): JsonResponse
    {
        $profile = $this->billingService->attachMethod(
            user: $request->user(),
            gatewayToken: $request->validated('gateway_token'),
            cardLast4: $request->validated('card_last4'),
            isDefault: $request->validated('is_default', false)
        );

        return response()->json(['data' => $profile], 201);
    }
}`,
      model: `<?php

namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Model;
use Illuminate\\Database\\Eloquent\\Relations\\BelongsTo;

class BillingProfile extends Model
{
    protected $fillable = [
        'user_id',
        'gateway_customer_id',
        'card_last4',
        'is_default',
    ];

    protected function casts(): array
    {
        return [
            'is_default' => 'boolean',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function scopeForUser($query, int $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeDefault($query)
    {
        return $query->where('is_default', true);
    }

    public function markAsDefault(): void
    {
        $this->user->billingProfiles()->where('id', '!=', $this->id)->update(['is_default' => false]);
        $this->update(['is_default' => true]);
    }
}`,
      service: `<?php

namespace App\\Services;

use App\\Events\\PaymentMethodAttached;
use App\\Models\\BillingProfile;
use App\\Models\\User;
use Illuminate\\Support\\Facades\\DB;

class BillingProfileService
{
    public function listMethods(User $user): \Illuminate\\Database\\Eloquent\\Collection
    {
        return BillingProfile::forUser($user->id)->get();
    }

    public function attachMethod(
        User $user,
        string $gatewayToken,
        ?string $cardLast4,
        bool $isDefault = false
    ): BillingProfile {
        return DB::transaction(function () use ($user, $gatewayToken, $cardLast4, $isDefault) {
            $profile = BillingProfile::create([
                'user_id' => $user->id,
                'gateway_customer_id' => $gatewayToken,
                'card_last4' => $cardLast4,
                'is_default' => $isDefault,
            ]);

            if ($isDefault) {
                $profile->markAsDefault();
            }

            event(new PaymentMethodAttached($profile));

            return $profile;
        });
    }

    public function detachMethod(User $user, int $profileId): bool
    {
        return DB::transaction(function () use ($user, $profileId) {
            $profile = BillingProfile::forUser($user->id)->findOrFail($profileId);

            return $profile->delete();
        });
    }

    public function getDefault(User $user): ?BillingProfile
    {
        return BillingProfile::forUser($user->id)->default()->first();
    }
}`,
      formRequest: `<?php

namespace App\\Http\\Requests;

use Illuminate\\Foundation\\Http\\FormRequest;

class AttachPaymentMethodRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'gateway_token' => 'required|string|max:128',
            'card_last4' => 'nullable|string|size:4|digits',
            'is_default' => 'boolean',
        ];
    }
}`,
      migration: `<?php

use Illuminate\\Database\\Migrations\\Migration;
use Illuminate\\Database\\Schema\\Blueprint;
use Illuminate\\Support\\Facades\\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('billing_profiles', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->index();
            $table->string('gateway_customer_id', 128);
            $table->char('card_last4', 4)->nullable();
            $table->boolean('is_default')->default(false);
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('billing_profiles');
    }
};`,
      policy: `<?php

namespace App\\Policies;

use App\\Models\\BillingProfile;
use App\\Models\\User;

class BillingPolicy
{
    public function manage(User $user): bool
    {
        return $user->hasPermission('billing.manage');
    }

    public function view(User $user, BillingProfile $profile): bool
    {
        return $user->hasPermission('billing.manage') || $profile->user_id === $user->id;
    }

    public function delete(User $user, BillingProfile $profile): bool
    {
        return $profile->user_id === $user->id;
    }
}`
    },
    sampleRecords: [
      { id: 12, user: 'Alex Chen', brand: 'Visa', last4: '4242', exp: '12/28', is_default: true }
    ],
    status: 'Configured'
  },
  {
    id: 43,
    code: 'MOD-043',
    name: 'Subscription Management',
    slug: 'subscription-management',
    category: 'Financial',
    phase: 5,
    iconName: 'Repeat',
    purpose: 'SaaS recurring subscription plans, usage tiers, seat upgrades, downgrades, and proration calculations.',
    responsibilities: [
      'Manage tier definitions, billing intervals (monthly/annual), and feature quotas',
      'Calculate mid-cycle prorated upgrades and credit balances',
      'Execute automatic dunning workflows for failed renewal charges'
    ],
    databaseTables: [
      {
        name: 'subscriptions',
        description: 'Active and scheduled recurring subscriptions.',
        primaryKey: 'id (BIGINT UNSIGNED)',
        foreignKeys: [{ column: 'user_id', references: 'id', table: 'users' }],
        columns: [
          { name: 'id', type: 'BIGINT UNSIGNED', nullable: false },
          { name: 'user_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
          { name: 'plan_code', type: 'VARCHAR(64)', nullable: false },
          { name: 'status', type: 'ENUM("trialing","active","past_due","canceled")', nullable: false },
          { name: 'current_period_end', type: 'TIMESTAMP', nullable: false }
        ],
        indexes: ['idx_sub_user_status']
      }
    ],
    apiEndpoints: [
      { method: 'GET', path: '/api/v1/subscriptions/current', description: 'Fetch current plan', authRequired: true },
      { method: 'POST', path: '/api/v1/subscriptions/subscribe', description: 'Activate plan', authRequired: true },
      { method: 'POST', path: '/api/v1/subscriptions/cancel', description: 'Schedule cancellation', authRequired: true }
    ],
    services: ['SubscriptionLifecycleService', 'ProrationCalculatorService'],
    permissions: ['subscriptions.manage'],
    events: ['SubscriptionStarted', 'SubscriptionRenewed', 'SubscriptionCancelled'],
    jobs: ['ProcessRenewalCycleJob'],
    dependencies: [1, 41, 42],
    tests: ['ProrationCalculationTest', 'RenewalCycleTest'],
    codeTemplates: {
      controller: `<?php

namespace App\\Http\\Controllers\\Api\\V1;

use App\\Http\\Controllers\\Controller;
use App\\Http\\Requests\\SubscribeRequest;
use App\\Services\\SubscriptionLifecycleService;
use Illuminate\\Http\\JsonResponse;
use Illuminate\\Http\\Request;

class SubscriptionController extends Controller
{
    public function __construct(
        private readonly SubscriptionLifecycleService $subscriptionService
    ) {}

    public function current(Request $request): JsonResponse
    {
        $subscription = $this->subscriptionService->getCurrentPlan($request->user());

        return response()->json(['data' => $subscription]);
    }

    public function subscribe(SubscribeRequest $request): JsonResponse
    {
        $subscription = $this->subscriptionService->activate(
            user: $request->user(),
            planCode: $request->validated('plan_code')
        );

        return response()->json(['data' => $subscription], 201);
    }

    public function cancel(Request $request): JsonResponse
    {
        $subscription = $this->subscriptionService->scheduleCancellation($request->user());

        return response()->json(['data' => $subscription]);
    }
}`,
      model: `<?php

namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Model;
use Illuminate\\Database\\Eloquent\\Relations\\BelongsTo;

class Subscription extends Model
{
    protected $fillable = [
        'user_id',
        'plan_code',
        'status',
        'current_period_end',
    ];

    protected function casts(): array
    {
        return [
            'current_period_end' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeForUser($query, int $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function isActive(): bool
    {
        return $this->status === 'active' && $this->current_period_end->isFuture();
    }

    public function isTrialing(): bool
    {
        return $this->status === 'trialing';
    }

    public function isPastDue(): bool
    {
        return $this->status === 'past_due';
    }
}`,
      service: `<?php

namespace App\\Services;

use App\\Events\\SubscriptionCancelled;
use App\\Events\\SubscriptionRenewed;
use App\\Events\\SubscriptionStarted;
use App\\Models\\Subscription;
use App\\Models\\User;
use Illuminate\\Support\\Facades\\DB;
use Carbon\\Carbon;

class SubscriptionLifecycleService
{
    private const PLAN_CONFIGS = [
        'basic' => ['price' => 29.00, 'interval' => 'monthly', 'trial_days' => 14],
        'pro' => ['price' => 99.00, 'interval' => 'monthly', 'trial_days' => 14],
        'enterprise' => ['price' => 499.00, 'interval' => 'monthly', 'trial_days' => 30],
    ];

    public function getCurrentPlan(User $user): ?Subscription
    {
        return Subscription::forUser($user->id)->active()->first();
    }

    public function activate(User $user, string $planCode): Subscription
    {
        return DB::transaction(function () use ($user, $planCode) {
            $existing = Subscription::forUser($user->id)
                ->whereIn('status', ['active', 'trialing'])
                ->first();

            if ($existing) {
                $this->cancelExisting($existing);
            }

            $config = self::PLAN_CONFIGS[$planCode] ?? self::PLAN_CONFIGS['basic'];

            $periodEnd = Carbon::now()->addDays($config['trial_days']);

            $subscription = Subscription::create([
                'user_id' => $user->id,
                'plan_code' => $planCode,
                'status' => 'trialing',
                'current_period_end' => $periodEnd,
            ]);

            event(new SubscriptionStarted($subscription));

            return $subscription;
        });
    }

    public function scheduleCancellation(User $user): Subscription
    {
        return DB::transaction(function () use ($user) {
            $subscription = Subscription::forUser($user->id)
                ->active()
                ->firstOrFail();

            $this->cancelExisting($subscription);

            return $subscription->fresh();
        });
    }

    public function processRenewal(Subscription $subscription): void
    {
        DB::transaction(function () use ($subscription) {
            $config = self::PLAN_CONFIGS[$subscription->plan_code] ?? self::PLAN_CONFIGS['basic'];
            $nextPeriodEnd = $subscription->current_period_end->copy()->addMonth();

            $subscription->update([
                'status' => 'active',
                'current_period_end' => $nextPeriodEnd,
            ]);

            event(new SubscriptionRenewed($subscription));
        });
    }

    private function cancelExisting(Subscription $subscription): void
    {
        $subscription->update(['status' => 'canceled']);
        event(new SubscriptionCancelled($subscription));
    }
}`,
      formRequest: `<?php

namespace App\\Http\\Requests;

use Illuminate\\Foundation\\Http\\FormRequest;

class SubscribeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'plan_code' => 'required|string|in:basic,pro,enterprise',
        ];
    }
}`,
      migration: `<?php

use Illuminate\\Database\\Migrations\\Migration;
use Illuminate\\Database\\Schema\\Blueprint;
use Illuminate\\Support\\Facades\\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('subscriptions', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->index();
            $table->string('plan_code', 64);
            $table->enum('status', ['trialing', 'active', 'past_due', 'canceled']);
            $table->timestamp('current_period_end');
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete();
            $table->index(['user_id', 'status']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('subscriptions');
    }
};`,
      policy: `<?php

namespace App\\Policies;

use App\\Models\\Subscription;
use App\\Models\\User;

class SubscriptionPolicy
{
    public function manage(User $user): bool
    {
        return $user->hasPermission('subscriptions.manage');
    }

    public function view(User $user, Subscription $subscription): bool
    {
        return $user->hasPermission('subscriptions.manage') || $subscription->user_id === $user->id;
    }

    public function cancel(User $user, Subscription $subscription): bool
    {
        return $subscription->user_id === $user->id && $subscription->isActive();
    }
}`
    },
    sampleRecords: [
      { id: 99, user: 'Alex Chen', plan: 'Enterprise Platinum ($499/mo)', status: 'active', renews_at: '2026-10-09' }
    ],
    status: 'Active'
  },
  {
    id: 44,
    code: 'MOD-044',
    name: 'Wallet Management',
    slug: 'wallet-management',
    category: 'Financial',
    phase: 5,
    iconName: 'Wallet',
    purpose: 'Digital customer wallets, store credit, multi-currency balances, and ledger-backed fund transfers.',
    responsibilities: [
      'Maintain authoritative real-time wallet balances with pessimistic locking',
      'Transfer funds between user wallets with atomic validation',
      'Lock or freeze suspicious wallets pending security review'
    ],
    databaseTables: [
      {
        name: 'wallets',
        description: 'Customer digital currency wallets.',
        primaryKey: 'id (BIGINT UNSIGNED)',
        foreignKeys: [{ column: 'user_id', references: 'id', table: 'users' }],
        columns: [
          { name: 'id', type: 'BIGINT UNSIGNED', nullable: false },
          { name: 'user_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
          { name: 'balance', type: 'DECIMAL(14,4)', nullable: false },
          { name: 'currency', type: 'CHAR(3)', nullable: false },
          { name: 'is_locked', type: 'BOOLEAN', nullable: false }
        ],
        indexes: ['wallet_user_curr_unique']
      }
    ],
    apiEndpoints: [
      { method: 'GET', path: '/api/v1/wallets/me', description: 'Get wallet balance', authRequired: true },
      { method: 'POST', path: '/api/v1/wallets/transfer', description: 'Peer-to-peer balance transfer', authRequired: true }
    ],
    services: ['WalletLedgerService', 'BalanceLockService'],
    permissions: ['wallets.view', 'wallets.transfer', 'wallets.freeze'],
    events: ['WalletCredited', 'WalletDebited', 'WalletLocked'],
    jobs: ['ReconcileWalletLedgerJob'],
    dependencies: [1],
    tests: ['WalletPessimisticLockTest', 'TransferBalanceIntegrityTest'],
    codeTemplates: {
      controller: `<?php

namespace App\\Http\\Controllers\\Api\\V1;

use App\\Http\\Controllers\\Controller;
use App\\Http\\Requests\\WalletTransferRequest;
use App\\Services\\WalletLedgerService;
use Illuminate\\Http\\JsonResponse;
use Illuminate\\Http\\Request;

class WalletController extends Controller
{
    public function __construct(
        private readonly WalletLedgerService $walletService
    ) {}

    public function me(Request $request): JsonResponse
    {
        $wallet = $this->walletService->getBalance($request->user());

        return response()->json(['data' => $wallet]);
    }

    public function transfer(WalletTransferRequest $request): JsonResponse
    {
        $result = $this->walletService->transfer(
            fromUser: $request->user(),
            toUserId: $request->validated('to_user_id'),
            amount: $request->validated('amount'),
            currency: $request->validated('currency', 'USD')
        );

        return response()->json(['data' => $result]);
    }
}`,
      model: `<?php

namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Model;
use Illuminate\\Database\\Eloquent\\Relations\\BelongsTo;

class Wallet extends Model
{
    protected $fillable = [
        'user_id',
        'balance',
        'currency',
        'is_locked',
    ];

    protected function casts(): array
    {
        return [
            'balance' => 'decimal:4',
            'is_locked' => 'boolean',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function scopeForUser($query, int $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeUnlocked($query)
    {
        return $query->where('is_locked', false);
    }

    public function hasSufficientBalance(string $amount): bool
    {
        return bccomp($this->balance, $amount, 4) >= 0;
    }

    public function credit(string $amount): void
    {
        $this->increment('balance', $amount);
    }

    public function debit(string $amount): void
    {
        $this->decrement('balance', $amount);
    }

    public function lock(): void
    {
        $this->update(['is_locked' => true]);
    }

    public function unlock(): void
    {
        $this->update(['is_locked' => false]);
    }
}`,
      service: `<?php

namespace App\\Services;

use App\\Events\\WalletCredited;
use App\\Events\\WalletDebited;
use App\\Events\\WalletLocked;
use App\\Exceptions\\InsufficientBalanceException;
use App\\Exceptions\\WalletLockedException;
use App\\Models\\Wallet;
use App\\Models\\User;
use Illuminate\\Support\\Facades\\DB;

class WalletLedgerService
{
    public function getBalance(User $user): Wallet
    {
        return Wallet::forUser($user->id)->firstOrCreate(
            ['user_id' => $user->id],
            ['balance' => 0, 'currency' => 'USD', 'is_locked' => false]
        );
    }

    public function transfer(User $fromUser, int $toUserId, string $amount, string $currency): array
    {
        if ($fromUser->id === $toUserId) {
            throw new \\InvalidArgumentException('Cannot transfer to self.');
        }

        return DB::transaction(function () use ($fromUser, $toUserId, $amount, $currency) {
            $senderWallet = Wallet::forUser($fromUser->id)
                ->where('currency', $currency)
                ->lockForUpdate()
                ->firstOrCreate(
                    ['user_id' => $fromUser->id, 'currency' => $currency],
                    ['balance' => 0, 'is_locked' => false]
                );

            $receiverWallet = Wallet::forUser($toUserId)
                ->where('currency', $currency)
                ->lockForUpdate()
                ->firstOrCreate(
                    ['user_id' => $toUserId, 'currency' => $currency],
                    ['balance' => 0, 'is_locked' => false]
                );

            if ($senderWallet->is_locked) {
                throw new WalletLockedException('Your wallet is locked.');
            }

            if ($receiverWallet->is_locked) {
                throw new WalletLockedException('Recipient wallet is locked.');
            }

            if (!$senderWallet->hasSufficientBalance($amount)) {
                throw new InsufficientBalanceException('Insufficient balance.');
            }

            $senderWallet->debit($amount);
            $receiverWallet->credit($amount);

            event(new WalletDebited($senderWallet, $amount));
            event(new WalletCredited($receiverWallet, $amount));

            return [
                'sender' => $senderWallet->fresh(),
                'receiver' => $receiverWallet->fresh(),
            ];
        });
    }

    public function lockWallet(User $user, string $currency = 'USD'): Wallet
    {
        $wallet = Wallet::forUser($user->id)
            ->where('currency', $currency)
            ->lockForUpdate()
            ->firstOrCreate(
                ['user_id' => $user->id, 'currency' => $currency],
                ['balance' => 0, 'is_locked' => false]
            );

        $wallet->lock();
        event(new WalletLocked($wallet));

        return $wallet;
    }
}`,
      formRequest: `<?php

namespace App\\Http\\Requests;

use Illuminate\\Foundation\\Http\\FormRequest;

class WalletTransferRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'to_user_id' => 'required|integer|exists:users,id',
            'amount' => 'required|numeric|min:0.0001|max:99999999.9999',
            'currency' => 'nullable|string|size:3',
        ];
    }
}`,
      migration: `<?php

use Illuminate\\Database\\Migrations\\Migration;
use Illuminate\\Database\\Schema\\Blueprint;
use Illuminate\\Support\\Facades\\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('wallets', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->index();
            $table->decimal('balance', 14, 4)->default(0);
            $table->char('currency', 3);
            $table->boolean('is_locked')->default(false);
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete();
            $table->unique(['user_id', 'currency']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('wallets');
    }
};`,
      policy: `<?php

namespace App\\Policies;

use App\\Models\\User;
use App\\Models\\Wallet;

class WalletPolicy
{
    public function view(User $user, Wallet $wallet): bool
    {
        return $user->hasPermission('wallets.view') || $wallet->user_id === $user->id;
    }

    public function transfer(User $user): bool
    {
        return $user->hasPermission('wallets.transfer');
    }

    public function freeze(User $user, Wallet $wallet): bool
    {
        return $user->hasPermission('wallets.freeze');
    }
}`
    },
    sampleRecords: [
      { id: 1, user: 'Alex Chen', balance: 14500.00, currency: 'USD', status: 'Unlocked' },
      { id: 2, user: 'Sarah Connor', balance: 8250.50, currency: 'USD', status: 'Unlocked' }
    ],
    status: 'Active'
  },
  {
    id: 45,
    code: 'MOD-045',
    name: 'Transaction Management',
    slug: 'transaction-management',
    category: 'Financial',
    phase: 5,
    iconName: 'ArrowLeftRight',
    purpose: 'Double-entry general ledger, immutable journal entries (`ledger_entries`), and audit trails.',
    responsibilities: [
      'Record credit and debit journal lines with zero-sum balancing',
      'Ensure historical financial ledger entries are append-only and immutable',
      'Provide point-in-time financial state auditing'
    ],
    databaseTables: [
      {
        name: 'ledger_entries',
        description: 'Double-entry immutable accounting journal.',
        primaryKey: 'id (BIGINT UNSIGNED)',
        foreignKeys: [],
        columns: [
          { name: 'id', type: 'BIGINT UNSIGNED', nullable: false },
          { name: 'reference_id', type: 'VARCHAR(64)', nullable: false, index: true },
          { name: 'account_code', type: 'VARCHAR(32)', nullable: false, index: true },
          { name: 'entry_type', type: 'ENUM("debit","credit")', nullable: false },
          { name: 'amount', type: 'DECIMAL(14,4)', nullable: false },
          { name: 'created_at', type: 'TIMESTAMP', nullable: false }
        ],
        indexes: ['idx_ledger_acc_ref']
      }
    ],
    apiEndpoints: [
      { method: 'GET', path: '/api/v1/transactions/ledger', description: 'Query ledger lines', authRequired: true, permission: 'transactions.audit' }
    ],
    services: ['DoubleEntryLedgerService'],
    permissions: ['transactions.view', 'transactions.audit'],
    events: ['LedgerBatchPosted'],
    jobs: ['AuditDailyLedgerBalanceJob'],
    dependencies: [1, 41, 44],
    tests: ['DoubleEntryBalanceRuleTest'],
    codeTemplates: {
      controller: `<?php

namespace App\\Http\\Controllers\\Api\\V1;

use App\\Http\\Controllers\\Controller;
use App\\Http\\Requests\\FilterLedgerRequest;
use App\\Services\\DoubleEntryLedgerService;
use Illuminate\\Http\\JsonResponse;

class TransactionController extends Controller
{
    public function __construct(
        private readonly DoubleEntryLedgerService $ledgerService
    ) {}

    public function ledger(FilterLedgerRequest $request): JsonResponse
    {
        $entries = $this->ledgerService->queryEntries(
            referenceId: $request->validated('reference_id'),
            accountCode: $request->validated('account_code'),
            startDate: $request->validated('start_date'),
            endDate: $request->validated('end_date')
        );

        return response()->json(['data' => $entries]);
    }
}`,
      model: `<?php

namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Model;

class LedgerEntry extends Model
{
    protected $fillable = [
        'reference_id',
        'account_code',
        'entry_type',
        'amount',
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:4',
            'created_at' => 'datetime',
        ];
    }

    public $timestamps = false;

    public function scopeForReference($query, string $referenceId)
    {
        return $query->where('reference_id', $referenceId);
    }

    public function scopeForAccount($query, string $accountCode)
    {
        return $query->where('account_code', $accountCode);
    }

    public function scopeDebits($query)
    {
        return $query->where('entry_type', 'debit');
    }

    public function scopeCredits($query)
    {
        return $query->where('entry_type', 'credit');
    }

    public function isDebit(): bool
    {
        return $this->entry_type === 'debit';
    }

    public function isCredit(): bool
    {
        return $this->entry_type === 'credit';
    }
}`,
      service: `<?php

namespace App\\Services;

use App\\Events\\LedgerBatchPosted;
use App\\Exceptions\\DoubleEntryViolationException;
use App\\Models\\LedgerEntry;
use Illuminate\\Support\\Facades\\DB;
use Illuminate\\Support\\Carbon;

class DoubleEntryLedgerService
{
    public function postBatch(array $entries, string $referenceId): void
    {
        $totalDebits = 0;
        $totalCredits = 0;

        foreach ($entries as $entry) {
            if ($entry['entry_type'] === 'debit') {
                $totalDebits = bcadd($totalDebits, $entry['amount'], 4);
            } else {
                $totalCredits = bcadd($totalCredits, $entry['amount'], 4);
            }
        }

        if (bccomp($totalDebits, $totalCredits, 4) !== 0) {
            throw new DoubleEntryViolationException(
                "Debit total {$totalDebits} does not equal credit total {$totalCredits}."
            );
        }

        DB::transaction(function () use ($entries, $referenceId) {
            $records = array_map(fn($entry) => [
                'reference_id' => $referenceId,
                'account_code' => $entry['account_code'],
                'entry_type' => $entry['entry_type'],
                'amount' => $entry['amount'],
                'created_at' => now(),
            ], $entries);

            LedgerEntry::insert($records);

            event(new LedgerBatchPosted($referenceId, count($records)));
        });
    }

    public function queryEntries(
        ?string $referenceId = null,
        ?string $accountCode = null,
        ?string $startDate = null,
        ?string $endDate = null
    ): \Illuminate\\Database\\Eloquent\\Collection {
        $query = LedgerEntry::query();

        if ($referenceId) {
            $query->forReference($referenceId);
        }

        if ($accountCode) {
            $query->forAccount($accountCode);
        }

        if ($startDate) {
            $query->where('created_at', '>=', Carbon::parse($startDate));
        }

        if ($endDate) {
            $query->where('created_at', '<=', Carbon::parse($endDate));
        }

        return $query->orderBy('created_at', 'desc')->get();
    }

    public function verifyBalanceForReference(string $referenceId): bool
    {
        $debits = LedgerEntry::forReference($referenceId)->debits()->sum('amount');
        $credits = LedgerEntry::forReference($referenceId)->credits()->sum('amount');

        return bccomp($debits, $credits, 4) === 0;
    }
}`,
      formRequest: `<?php

namespace App\\Http\\Requests;

use Illuminate\\Foundation\\Http\\FormRequest;

class FilterLedgerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasPermission('transactions.audit');
    }

    public function rules(): array
    {
        return [
            'reference_id' => 'nullable|string|max:64',
            'account_code' => 'nullable|string|max:32',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
        ];
    }
}`,
      migration: `<?php

use Illuminate\\Database\\Migrations\\Migration;
use Illuminate\\Database\\Schema\\Blueprint;
use Illuminate\\Support\\Facades\\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('ledger_entries', function (Blueprint $table) {
            $table->id();
            $table->string('reference_id', 64)->index();
            $table->string('account_code', 32)->index();
            $table->enum('entry_type', ['debit', 'credit']);
            $table->decimal('amount', 14, 4);
            $table->timestamp('created_at');

            $table->index(['account_code', 'reference_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ledger_entries');
    }
};`,
      policy: `<?php

namespace App\\Policies;

use App\\Models\\User;

class TransactionPolicy
{
    public function view(User $user): bool
    {
        return $user->hasPermission('transactions.view');
    }

    public function audit(User $user): bool
    {
        return $user->hasPermission('transactions.audit');
    }
}`
    },
    sampleRecords: [
      { id: 8901, ref: 'TX-ORDER-4812', account: '1010-Cash', type: 'debit', amount: 2499.00 },
      { id: 8902, ref: 'TX-ORDER-4812', account: '4010-Revenue', type: 'credit', amount: 2499.00 }
    ],
    status: 'Active'
  },
  {
    id: 46,
    code: 'MOD-046',
    name: 'Invoice Management',
    slug: 'invoice-management',
    category: 'Financial',
    phase: 5,
    iconName: 'FileSpreadsheet',
    purpose: 'Tax-compliant PDF invoice generation, sequential invoice numbering, payment terms, and dunning notices.',
    responsibilities: [
      'Generate immutable legal invoice numbers (e.g. INV-2026-00941)',
      'Render downloadable PDF invoices with corporate tax details',
      'Send automatic past-due payment reminders on net-30 terms'
    ],
    databaseTables: [
      {
        name: 'invoices',
        description: 'Customer invoices.',
        primaryKey: 'id (BIGINT UNSIGNED)',
        foreignKeys: [{ column: 'user_id', references: 'id', table: 'users' }],
        columns: [
          { name: 'id', type: 'BIGINT UNSIGNED', nullable: false },
          { name: 'invoice_number', type: 'VARCHAR(32)', nullable: false, index: true },
          { name: 'user_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
          { name: 'amount_due', type: 'DECIMAL(12,2)', nullable: false },
          { name: 'status', type: 'ENUM("draft","issued","paid","void","overdue")', nullable: false },
          { name: 'due_date', type: 'DATE', nullable: false }
        ],
        indexes: ['invoice_num_unique']
      }
    ],
    apiEndpoints: [
      { method: 'GET', path: '/api/v1/invoices/{id}/pdf', description: 'Download invoice PDF', authRequired: true },
      { method: 'POST', path: '/api/v1/invoices/issue', description: 'Issue formal invoice', authRequired: true }
    ],
    services: ['InvoiceGenerationService', 'PdfRendererService'],
    permissions: ['invoices.view', 'invoices.issue'],
    events: ['InvoiceIssued', 'InvoicePaid'],
    jobs: ['GenerateInvoicePdfJob'],
    dependencies: [1, 37],
    tests: ['InvoiceSequentialNumberingTest'],
    codeTemplates: {
      controller: `<?php

namespace App\\Http\\Controllers\\Api\\V1;

use App\\Http\\Controllers\\Controller;
use App\\Http\\Requests\\IssueInvoiceRequest;
use App\\Services\\InvoiceGenerationService;
use Illuminate\\Http\\JsonResponse;
use Illuminate\\Http\\Response;

class InvoiceController extends Controller
{
    public function __construct(
        private readonly InvoiceGenerationService $invoiceService
    ) {}

    public function downloadPdf(int $id): Response
    {
        $invoice = $this->invoiceService->getInvoice($id);
        $pdf = $this->invoiceService->renderPdf($invoice);

        return response($pdf, 200, [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => "inline; filename=\"{$invoice->invoice_number}.pdf\"",
        ]);
    }

    public function issue(IssueInvoiceRequest $request): JsonResponse
    {
        $invoice = $this->invoiceService->issue(
            userId: $request->validated('user_id'),
            amount: $request->validated('amount_due'),
            dueDate: $request->validated('due_date'),
            lineItems: $request->validated('line_items', [])
        );

        return response()->json(['data' => $invoice], 201);
    }
}`,
      model: `<?php

namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Model;
use Illuminate\\Database\\Eloquent\\Relations\\BelongsTo;

class Invoice extends Model
{
    protected $fillable = [
        'invoice_number',
        'user_id',
        'amount_due',
        'status',
        'due_date',
    ];

    protected function casts(): array
    {
        return [
            'amount_due' => 'decimal:2',
            'due_date' => 'date',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function scopeForUser($query, int $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeDraft($query)
    {
        return $query->where('status', 'draft');
    }

    public function scopeIssued($query)
    {
        return $query->where('status', 'issued');
    }

    public function isDraft(): bool
    {
        return $this->status === 'draft';
    }

    public function isPaid(): bool
    {
        return $this->status === 'paid';
    }

    public function isOverdue(): bool
    {
        return $this->status === 'issued' && $this->due_date->isPast();
    }

    public function markIssued(): void
    {
        $this->update(['status' => 'issued']);
    }

    public function markPaid(): void
    {
        $this->update(['status' => 'paid']);
    }

    public function markVoid(): void
    {
        $this->update(['status' => 'void']);
    }
}`,
      service: `<?php

namespace App\\Services;

use App\\Events\\InvoiceIssued;
use App\\Events\\InvoicePaid;
use App\\Models\\Invoice;
use Illuminate\\Support\\Facades\\DB;
use Carbon\\Carbon;

class InvoiceGenerationService
{
    public function getInvoice(int $id): Invoice
    {
        return Invoice::findOrFail($id);
    }

    public function issue(
        int $userId,
        string $amount,
        string $dueDate,
        array $lineItems = []
    ): Invoice {
        return DB::transaction(function () use ($userId, $amount, $dueDate, $lineItems) {
            $invoiceNumber = $this->generateSequentialNumber();

            $invoice = Invoice::create([
                'invoice_number' => $invoiceNumber,
                'user_id' => $userId,
                'amount_due' => $amount,
                'status' => 'draft',
                'due_date' => $dueDate,
            ]);

            $invoice->markIssued();

            event(new InvoiceIssued($invoice));

            return $invoice;
        });
    }

    public function markPaid(Invoice $invoice): void
    {
        DB::transaction(function () use ($invoice) {
            $invoice->markPaid();
            event(new InvoicePaid($invoice));
        });
    }

    public function renderPdf(Invoice $invoice): string
    {
        return $this->buildPdfContent($invoice);
    }

    private function generateSequentialNumber(): string
    {
        $year = Carbon::now()->year;
        $lastInvoice = Invoice::where('invoice_number', 'like', "INV-{$year}-%")
            ->orderByDesc('invoice_number')
            ->first();

        if ($lastInvoice) {
            $lastNumber = (int) substr($lastInvoice->invoice_number, -5);
            $nextNumber = $lastNumber + 1;
        } else {
            $nextNumber = 1;
        }

        return sprintf('INV-%s-%05d', $year, $nextNumber);
    }

    private function buildPdfContent(Invoice $invoice): string
    {
        return "Invoice {$invoice->invoice_number}\\nAmount: {$invoice->amount_due}\\nDue: {$invoice->due_date}";
    }
}`,
      formRequest: `<?php

namespace App\\Http\\Requests;

use Illuminate\\Foundation\\Http\\FormRequest;

class IssueInvoiceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasPermission('invoices.issue');
    }

    public function rules(): array
    {
        return [
            'user_id' => 'required|integer|exists:users,id',
            'amount_due' => 'required|numeric|min:0.01|max:99999999.99',
            'due_date' => 'required|date|after:today',
            'line_items' => 'nullable|array',
            'line_items.*.description' => 'required_with:line_items|string|max:255',
            'line_items.*.quantity' => 'required_with:line_items|integer|min:1',
            'line_items.*.unit_price' => 'required_with:line_items|numeric|min:0',
        ];
    }
}`,
      migration: `<?php

use Illuminate\\Database\\Migrations\\Migration;
use Illuminate\\Database\\Schema\\Blueprint;
use Illuminate\\Support\\Facades\\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('invoices', function (Blueprint $table) {
            $table->id();
            $table->string('invoice_number', 32)->unique();
            $table->unsignedBigInteger('user_id')->index();
            $table->decimal('amount_due', 12, 2);
            $table->enum('status', ['draft', 'issued', 'paid', 'void', 'overdue']);
            $table->date('due_date');
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('invoices');
    }
};`,
      policy: `<?php

namespace App\\Policies;

use App\\Models\\Invoice;
use App\\Models\\User;

class InvoicePolicy
{
    public function view(User $user, Invoice $invoice): bool
    {
        return $user->hasPermission('invoices.view') || $invoice->user_id === $user->id;
    }

    public function issue(User $user): bool
    {
        return $user->hasPermission('invoices.issue');
    }
}`
    },
    sampleRecords: [
      { id: 941, number: 'INV-2026-00941', customer: 'Acme Global Corp', due: 2499.00, status: 'paid', due_date: '2026-10-01' }
    ],
    status: 'Configured'
  },
  {
    id: 47,
    code: 'MOD-047',
    name: 'Refund Management',
    slug: 'refund-management',
    category: 'Financial',
    phase: 5,
    iconName: 'RotateCcw',
    purpose: 'Partial and full refund authorization, gateway reversal dispatch, dispute handling, and ledger adjustments.',
    responsibilities: [
      'Execute partial and full refunds through original payment gateways',
      'Credit customer wallet or debit accounts according to refund policy',
      'Record mandatory compliance audit reasons for every refund'
    ],
    databaseTables: [
      {
        name: 'refunds',
        description: 'Processed refund records.',
        primaryKey: 'id (BIGINT UNSIGNED)',
        foreignKeys: [{ column: 'payment_id', references: 'id', table: 'payments' }],
        columns: [
          { name: 'id', type: 'BIGINT UNSIGNED', nullable: false },
          { name: 'payment_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
          { name: 'amount', type: 'DECIMAL(12,2)', nullable: false },
          { name: 'reason', type: 'VARCHAR(255)', nullable: false },
          { name: 'status', type: 'ENUM("pending","succeeded","failed")', nullable: false }
        ],
        indexes: ['idx_refund_payment']
      }
    ],
    apiEndpoints: [
      { method: 'POST', path: '/api/v1/refunds/process', description: 'Authorize refund', authRequired: true }
    ],
    services: ['RefundProcessorService'],
    permissions: ['refunds.process'],
    events: ['RefundProcessed'],
    jobs: ['PostRefundToLedgerJob'],
    dependencies: [41, 45],
    tests: ['RefundGatewayTest'],
    codeTemplates: {
      controller: `<?php

namespace App\\Http\\Controllers\\Api\\V1;

use App\\Http\\Controllers\\Controller;
use App\\Http\\Requests\\ProcessRefundRequest;
use App\\Services\\RefundProcessorService;
use Illuminate\\Http\\JsonResponse;

class RefundController extends Controller
{
    public function __construct(
        private readonly RefundProcessorService $refundService
    ) {}

    public function process(ProcessRefundRequest $request): JsonResponse
    {
        $refund = $this->refundService->processRefund(
            paymentId: $request->validated('payment_id'),
            amount: $request->validated('amount'),
            reason: $request->validated('reason'),
            processedBy: $request->user()->id
        );

        return response()->json(['data' => $refund], 201);
    }
}`,
      model: `<?php

namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Model;
use Illuminate\\Database\\Eloquent\\Relations\\BelongsTo;

class Refund extends Model
{
    protected $fillable = [
        'payment_id',
        'amount',
        'reason',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
        ];
    }

    public function payment(): BelongsTo
    {
        return $this->belongsTo(Payment::class);
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeSucceeded($query)
    {
        return $query->where('status', 'succeeded');
    }

    public function markSucceeded(): void
    {
        $this->update(['status' => 'succeeded']);
    }

    public function markFailed(): void
    {
        $this->update(['status' => 'failed']);
    }
}`,
      service: `<?php

namespace App\\Services;

use App\\Events\\RefundProcessed;
use App\\Models\\Payment;
use App\\Models\\Refund;
use Illuminate\\Support\\Facades\\DB;

class RefundProcessorService
{
    public function processRefund(
        int $paymentId,
        string $amount,
        string $reason,
        int $processedBy
    ): Refund {
        return DB::transaction(function () use ($paymentId, $amount, $reason, $processedBy) {
            $payment = Payment::lockForUpdate()->findOrFail($paymentId);

            if (!$payment->isSucceeded()) {
                throw new \\LogicException('Only succeeded payments can be refunded.');
            }

            $totalRefunded = Refund::where('payment_id', $paymentId)
                ->succeeded()
                ->sum('amount');

            $availableForRefund = bcsub($payment->amount, $totalRefunded, 2);

            if (bccomp($amount, $availableForRefund, 2) > 0) {
                throw new \\LogicException(
                    "Refund amount {$amount} exceeds available refundable amount {$availableForRefund}."
                );
            }

            $refund = Refund::create([
                'payment_id' => $paymentId,
                'amount' => $amount,
                'reason' => $reason,
                'status' => 'pending',
            ]);

            try {
                $this->dispatchToGateway($payment, $refund);
                $refund->markSucceeded();
            } catch (\\Exception $e) {
                $refund->markFailed();
                throw $e;
            }

            event(new RefundProcessed($refund, $processedBy));

            return $refund;
        });
    }

    private function dispatchToGateway(Payment $payment, Refund $refund): void
    {
        // Gateway API call would be dispatched here
        // e.g., Stripe::refunds()->create([...])
    }
}`,
      formRequest: `<?php

namespace App\\Http\\Requests;

use Illuminate\\Foundation\\Http\\FormRequest;

class ProcessRefundRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasPermission('refunds.process');
    }

    public function rules(): array
    {
        return [
            'payment_id' => 'required|integer|exists:payments,id',
            'amount' => 'required|numeric|min:0.01|max:99999999.99',
            'reason' => 'required|string|max:255',
        ];
    }
}`,
      migration: `<?php

use Illuminate\\Database\\Migrations\\Migration;
use Illuminate\\Database\\Schema\\Blueprint;
use Illuminate\\Support\\Facades\\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('refunds', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('payment_id')->index();
            $table->decimal('amount', 12, 2);
            $table->string('reason', 255);
            $table->enum('status', ['pending', 'succeeded', 'failed']);
            $table->timestamps();

            $table->foreign('payment_id')->references('id')->on('payments')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('refunds');
    }
};`,
      policy: `<?php

namespace App\\Policies;

use App\\Models\\Refund;
use App\\Models\\User;

class RefundPolicy
{
    public function process(User $user): bool
    {
        return $user->hasPermission('refunds.process');
    }

    public function view(User $user, Refund $refund): bool
    {
        return $user->hasPermission('refunds.process');
    }
}`
    },
    sampleRecords: [
      { id: 51, payment_id: 301, amount: 249.00, reason: 'Promotional credit adjustment', status: 'succeeded' }
    ],
    status: 'Configured'
  },
  {
    id: 48,
    code: 'MOD-048',
    name: 'Tax Management',
    slug: 'tax-management',
    category: 'Financial',
    phase: 5,
    iconName: 'Percent',
    purpose: 'Multi-jurisdictional tax rules, state nexus detection, VAT calculation, and exemption certificates.',
    responsibilities: [
      'Compute combined sales tax and VAT based on destination address',
      'Validate European VIES VAT IDs and exemption numbers',
      'Generate monthly/quarterly tax liability summary reports'
    ],
    databaseTables: [
      {
        name: 'tax_rules',
        description: 'Jurisdictional tax percentages.',
        primaryKey: 'id (BIGINT UNSIGNED)',
        foreignKeys: [],
        columns: [
          { name: 'id', type: 'BIGINT UNSIGNED', nullable: false },
          { name: 'country_code', type: 'CHAR(2)', nullable: false, index: true },
          { name: 'state_code', type: 'VARCHAR(16)', nullable: true },
          { name: 'tax_rate', type: 'DECIMAL(6,4)', nullable: false },
          { name: 'tax_name', type: 'VARCHAR(64)', nullable: false }
        ],
        indexes: ['idx_tax_country_state']
      }
    ],
    apiEndpoints: [
      { method: 'POST', path: '/api/v1/tax/calculate', description: 'Get calculated tax quote', authRequired: true }
    ],
    services: ['TaxCalculationService', 'VatValidationService'],
    permissions: ['tax.manage'],
    events: ['TaxRateUpdated'],
    jobs: ['SyncTaxRatesJob'],
    dependencies: [],
    tests: ['TaxCalculationPrecisionTest'],
    codeTemplates: {
      controller: `<?php

namespace App\\Http\\Controllers\\Api\\V1;

use App\\Http\\Controllers\\Controller;
use App\\Http\\Requests\\CalculateTaxRequest;
use App\\Services\\TaxCalculationService;
use Illuminate\\Http\\JsonResponse;

class TaxController extends Controller
{
    public function __construct(
        private readonly TaxCalculationService $taxService
    ) {}

    public function calculate(CalculateTaxRequest $request): JsonResponse
    {
        $result = $this->taxService->calculate(
            countryCode: $request->validated('country_code'),
            stateCode: $request->validated('state_code'),
            amount: $request->validated('amount'),
            vatId: $request->validated('vat_id')
        );

        return response()->json(['data' => $result]);
    }
}`,
      model: `<?php

namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Model;

class TaxRule extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'country_code',
        'state_code',
        'tax_rate',
        'tax_name',
    ];

    protected function casts(): array
    {
        return [
            'tax_rate' => 'decimal:4',
        ];
    }

    public function scopeForCountry($query, string $countryCode)
    {
        return $query->where('country_code', $countryCode);
    }

    public function scopeForState($query, ?string $stateCode)
    {
        if ($stateCode) {
            return $query->where('state_code', $stateCode);
        }
        return $query->whereNull('state_code');
    }

    public function scopeCountryWide($query)
    {
        return $query->whereNull('state_code');
    }
}`,
      service: `<?php

namespace App\\Services;

use App\\Events\\TaxRateUpdated;
use App\\Models\\TaxRule;
use Illuminate\\Support\\Facades\\DB;

class TaxCalculationService
{
    public function calculate(
        string $countryCode,
        ?string $stateCode,
        string $amount,
        ?string $vatId = null
    ): array {
        $totalRate = '0';
        $applicableRules = [];

        $stateRule = TaxRule::forCountry($countryCode)->forState($stateCode)->first();
        if ($stateRule) {
            $totalRate = bcadd($totalRate, $stateRule->tax_rate, 4);
            $applicableRules[] = $stateRule;
        } else {
            $countryRule = TaxRule::forCountry($countryCode)->countryWide()->first();
            if ($countryRule) {
                $totalRate = bcadd($totalRate, $countryRule->tax_rate, 4);
                $applicableRules[] = $countryRule;
            }
        }

        $taxAmount = bcmul($amount, $totalRate, 4);

        $vatExempt = false;
        if ($vatId && $this->validateVatId($countryCode, $vatId)) {
            $vatExempt = true;
            $taxAmount = '0';
        }

        return [
            'country_code' => $countryCode,
            'state_code' => $stateCode,
            'tax_rate' => $totalRate,
            'tax_amount' => $taxAmount,
            'vat_exempt' => $vatExempt,
            'applicable_rules' => $applicableRules,
        ];
    }

    public function updateRule(int $ruleId, array $data): TaxRule
    {
        return DB::transaction(function () use ($ruleId, $data) {
            $rule = TaxRule::findOrFail($ruleId);
            $rule->update($data);

            event(new TaxRateUpdated($rule));

            return $rule;
        });
    }

    private function validateVatId(string $countryCode, string $vatId): bool
    {
        // VIES VAT validation would be implemented here
        return strlen($vatId) > 5;
    }
}`,
      formRequest: `<?php

namespace App\\Http\\Requests;

use Illuminate\\Foundation\\Http\\FormRequest;

class CalculateTaxRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'country_code' => 'required|size:2|alpha',
            'state_code' => 'nullable|string|max:16',
            'amount' => 'required|numeric|min:0.01|max:99999999.99',
            'vat_id' => 'nullable|string|max:32',
        ];
    }
}`,
      migration: `<?php

use Illuminate\\Database\\Migrations\\Migration;
use Illuminate\\Database\\Schema\\Blueprint;
use Illuminate\\Support\\Facades\\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tax_rules', function (Blueprint $table) {
            $table->id();
            $table->char('country_code', 2)->index();
            $table->string('state_code', 16)->nullable();
            $table->decimal('tax_rate', 6, 4);
            $table->string('tax_name', 64);

            $table->index(['country_code', 'state_code']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tax_rules');
    }
};`,
      policy: `<?php

namespace App\\Policies;

use App\\Models\\User;

class TaxPolicy
{
    public function manage(User $user): bool
    {
        return $user->hasPermission('tax.manage');
    }
}`
    },
    sampleRecords: [
      { id: 1, country: 'US', state: 'CA', rate: '8.25%', name: 'California State + Local Tax' },
      { id: 2, country: 'GB', state: null, rate: '20.00%', name: 'UK Standard VAT' }
    ],
    status: 'Configured'
  },
  {
    id: 49,
    code: 'MOD-049',
    name: 'Commission Management',
    slug: 'commission-management',
    category: 'Financial',
    phase: 5,
    iconName: 'BadgeDollarSign',
    purpose: 'Platform marketplace commissions, affiliate splits, tiered fee schedules, and payout deductions.',
    responsibilities: [
      'Calculate platform cut on multi-vendor transactions',
      'Manage tiered commission deductions based on seller volume',
      'Hold commissions during return buffer periods before payout release'
    ],
    databaseTables: [
      {
        name: 'commissions',
        description: 'Transaction commission splits.',
        primaryKey: 'id (BIGINT UNSIGNED)',
        foreignKeys: [{ column: 'order_id', references: 'id', table: 'orders' }],
        columns: [
          { name: 'id', type: 'BIGINT UNSIGNED', nullable: false },
          { name: 'order_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
          { name: 'seller_id', type: 'BIGINT UNSIGNED', nullable: false },
          { name: 'rate', type: 'DECIMAL(5,2)', nullable: false },
          { name: 'amount', type: 'DECIMAL(12,2)', nullable: false },
          { name: 'status', type: 'ENUM("pending","settled","refunded")', nullable: false }
        ],
        indexes: ['idx_comm_order_seller']
      }
    ],
    apiEndpoints: [
      { method: 'GET', path: '/api/v1/commissions/statement', description: 'Seller commission statement', authRequired: true }
    ],
    services: ['CommissionEngineService'],
    permissions: ['commission.manage'],
    events: ['CommissionCalculated'],
    jobs: ['SettleEligibleCommissionsJob'],
    dependencies: [35, 37],
    tests: ['CommissionRateCalculationTest'],
    codeTemplates: {
      controller: `<?php

namespace App\\Http\\Controllers\\Api\\V1;

use App\\Http\\Controllers\\Controller;
use App\\Http\\Requests\\CommissionQueryRequest;
use App\\Services\\CommissionEngineService;
use Illuminate\\Http\\JsonResponse;

class CommissionController extends Controller
{
    public function __construct(
        private readonly CommissionEngineService $commissionService
    ) {}

    public function statement(CommissionQueryRequest $request): JsonResponse
    {
        $statement = $this->commissionService->getSellerStatement(
            sellerId: $request->validated('seller_id'),
            startDate: $request->validated('start_date'),
            endDate: $request->validated('end_date')
        );

        return response()->json(['data' => $statement]);
    }
}`,
      model: `<?php

namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Model;
use Illuminate\\Database\\Eloquent\\Relations\\BelongsTo;

class Commission extends Model
{
    protected $fillable = [
        'order_id',
        'seller_id',
        'rate',
        'amount',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'rate' => 'decimal:2',
            'amount' => 'decimal:2',
        ];
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function scopeForSeller($query, int $sellerId)
    {
        return $query->where('seller_id', $sellerId);
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeSettled($query)
    {
        return $query->where('status', 'settled');
    }

    public function scopeInPeriod($query, string $start, string $end)
    {
        return $query->whereBetween('created_at', [$start, $end]);
    }

    public function markSettled(): void
    {
        $this->update(['status' => 'settled']);
    }
}`,
      service: `<?php

namespace App\\Services;

use App\\Events\\CommissionCalculated;
use App\\Models\\Commission;
use Illuminate\\Support\\Facades\\DB;
use Carbon\\Carbon;

class CommissionEngineService
{
    private const TIER_THRESHOLDS = [
        0 => '10.00',
        10000 => '8.50',
        50000 => '7.00',
        100000 => '5.50',
    ];

    public function calculateForOrder(int $orderId, int $sellerId, string $orderAmount): Commission
    {
        return DB::transaction(function () use ($orderId, $sellerId, $orderAmount) {
            $rate = $this->determineRate($sellerId);
            $commissionAmount = bcmul($orderAmount, bcdiv($rate, 100, 2), 2);

            $commission = Commission::create([
                'order_id' => $orderId,
                'seller_id' => $sellerId,
                'rate' => $rate,
                'amount' => $commissionAmount,
                'status' => 'pending',
            ]);

            event(new CommissionCalculated($commission));

            return $commission;
        });
    }

    public function getSellerStatement(
        int $sellerId,
        ?string $startDate = null,
        ?string $endDate = null
    ): array {
        $query = Commission::forSeller($sellerId);

        if ($startDate && $endDate) {
            $query->inPeriod($startDate, $endDate);
        }

        $commissions = $query->get();

        return [
            'seller_id' => $sellerId,
            'period_start' => $startDate,
            'period_end' => $endDate,
            'total_earned' => $commissions->sum('amount'),
            'pending' => $commissions->pending()->sum('amount'),
            'settled' => $commissions->settled()->sum('amount'),
            'transactions' => $commissions,
        ];
    }

    public function settlePending(): int
    {
        return DB::transaction(function () {
            $pending = Commission::pending()->get();
            $count = 0;

            foreach ($pending as $commission) {
                $commission->markSettled();
                $count++;
            }

            return $count;
        });
    }

    private function determineRate(int $sellerId): string
    {
        $totalSettled = Commission::forSeller($sellerId)
            ->settled()
            ->sum('amount');

        $rate = '10.00';
        foreach (self::TIER_THRESHOLDS as $threshold => $tierRate) {
            if (bccomp($totalSettled, $threshold, 2) >= 0) {
                $rate = $tierRate;
            }
        }

        return $rate;
    }
}`,
      formRequest: `<?php

namespace App\\Http\\Requests;

use Illuminate\\Foundation\\Http\\FormRequest;

class CommissionQueryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasPermission('commission.manage');
    }

    public function rules(): array
    {
        return [
            'seller_id' => 'required|integer',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
        ];
    }
}`,
      migration: `<?php

use Illuminate\\Database\\Migrations\\Migration;
use Illuminate\\Database\\Schema\\Blueprint;
use Illuminate\\Support\\Facades\\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('commissions', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('order_id')->index();
            $table->unsignedBigInteger('seller_id');
            $table->decimal('rate', 5, 2);
            $table->decimal('amount', 12, 2);
            $table->enum('status', ['pending', 'settled', 'refunded']);
            $table->timestamps();

            $table->foreign('order_id')->references('id')->on('orders')->cascadeOnDelete();
            $table->index(['order_id', 'seller_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('commissions');
    }
};`,
      policy: `<?php

namespace App\\Policies;

use App\\Models\\Commission;
use App\\Models\\User;

class CommissionPolicy
{
    public function manage(User $user): bool
    {
        return $user->hasPermission('commission.manage');
    }

    public function view(User $user, Commission $commission): bool
    {
        return $user->hasPermission('commission.manage') || $commission->seller_id === $user->id;
    }
}`
    },
    sampleRecords: [
      { id: 110, order_id: 4812, seller: 'Alpha Computing Gear', rate: '8.5%', amount: 212.41, status: 'pending' }
    ],
    status: 'Configured'
  },
  {
    id: 50,
    code: 'MOD-050',
    name: 'Financial Reporting',
    slug: 'financial-reporting',
    category: 'Financial',
    phase: 5,
    iconName: 'LineChart',
    purpose: 'Balance sheet reconciliation, revenue metrics (MRR/ARR), profit/loss summaries, and ERP exports.',
    responsibilities: [
      'Aggregate monthly recurring revenue (MRR) and gross revenue figures',
      'Reconcile payment gateway payouts with bank deposit statements',
      'Generate GAAP/IFRS compliant financial summary packages'
    ],
    databaseTables: [
      {
        name: 'financial_summaries',
        description: 'Monthly closed financial statements.',
        primaryKey: 'id (BIGINT UNSIGNED)',
        foreignKeys: [],
        columns: [
          { name: 'id', type: 'BIGINT UNSIGNED', nullable: false },
          { name: 'fiscal_year', type: 'SMALLINT UNSIGNED', nullable: false },
          { name: 'fiscal_month', type: 'TINYINT UNSIGNED', nullable: false },
          { name: 'gross_revenue', type: 'DECIMAL(16,2)', nullable: false },
          { name: 'net_revenue', type: 'DECIMAL(16,2)', nullable: false },
          { name: 'refunds_total', type: 'DECIMAL(14,2)', nullable: false }
        ],
        indexes: ['fiscal_period_unique']
      }
    ],
    apiEndpoints: [
      { method: 'GET', path: '/api/v1/financial-reports/monthly', description: 'Get financial summary statement', authRequired: true, permission: 'financial.report' }
    ],
    services: ['FinancialAggregationService', 'ErpExportService'],
    permissions: ['financial.report', 'financial.close-month'],
    events: ['MonthlyBooksClosed'],
    jobs: ['CompileMonthlyFinancialsJob'],
    dependencies: [41, 45, 47],
    tests: ['FinancialReconciliationTest'],
    codeTemplates: {
      controller: `<?php

namespace App\\Http\\Controllers\\Api\\V1;

use App\\Http\\Controllers\\Controller;
use App\\Http\\Requests\\PeriodReportRequest;
use App\\Services\\FinancialAggregationService;
use Illuminate\\Http\\JsonResponse;

class FinancialReportingController extends Controller
{
    public function __construct(
        private readonly FinancialAggregationService $financialService
    ) {}

    public function monthly(PeriodReportRequest $request): JsonResponse
    {
        $summary = $this->financialService->getMonthlySummary(
            year: $request->validated('year'),
            month: $request->validated('month')
        );

        return response()->json(['data' => $summary]);
    }
}`,
      model: `<?php

namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Model;

class FinancialSummary extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'fiscal_year',
        'fiscal_month',
        'gross_revenue',
        'net_revenue',
        'refunds_total',
    ];

    protected function casts(): array
    {
        return [
            'gross_revenue' => 'decimal:2',
            'net_revenue' => 'decimal:2',
            'refunds_total' => 'decimal:2',
        ];
    }

    public function scopeForPeriod($query, int $year, int $month)
    {
        return $query->where('fiscal_year', $year)->where('fiscal_month', $month);
    }

    public function scopeForYear($query, int $year)
    {
        return $query->where('fiscal_year', $year);
    }

    public function getGrossRevenueFormattedAttribute(): string
    {
        return '$' . number_format((float) $this->gross_revenue, 2);
    }
}`,
      service: `<?php

namespace App\\Services;

use App\\Events\\MonthlyBooksClosed;
use App\\Models\\FinancialSummary;
use App\\Models\\Payment;
use App\\Models\\Refund;
use Illuminate\\Support\\Facades\\DB;
use Carbon\\Carbon;

class FinancialAggregationService
{
    public function getMonthlySummary(int $year, int $month): FinancialSummary
    {
        $existing = FinancialSummary::forPeriod($year, $month)->first();
        if ($existing) {
            return $existing;
        }

        return $this->compileMonthlySummary($year, $month);
    }

    public function compileMonthlySummary(int $year, int $month): FinancialSummary
    {
        return DB::transaction(function () use ($year, $month) {
            $startDate = Carbon::create($year, $month, 1)->startOfMonth();
            $endDate = $startDate->copy()->endOfMonth();

            $grossRevenue = Payment::where('status', 'succeeded')
                ->whereBetween('created_at', [$startDate, $endDate])
                ->sum('amount');

            $refundsTotal = Refund::where('status', 'succeeded')
                ->whereBetween('created_at', [$startDate, $endDate])
                ->sum('amount');

            $netRevenue = bcsub($grossRevenue, $refundsTotal, 2);

            $summary = FinancialSummary::updateOrCreate(
                ['fiscal_year' => $year, 'fiscal_month' => $month],
                [
                    'gross_revenue' => $grossRevenue,
                    'net_revenue' => $netRevenue,
                    'refunds_total' => $refundsTotal,
                ]
            );

            event(new MonthlyBooksClosed($summary));

            return $summary;
        });
    }

    public function getMrr(int $year, int $month): string
    {
        return (string) Payment::where('status', 'succeeded')
            ->whereYear('created_at', $year)
            ->whereMonth('created_at', $month)
            ->sum('amount');
    }

    public function getAnnualRevenue(int $year): array
    {
        $summaries = FinancialSummary::forYear($year)->get();

        return [
            'year' => $year,
            'gross_revenue' => $summaries->sum('gross_revenue'),
            'net_revenue' => $summaries->sum('net_revenue'),
            'refunds_total' => $summaries->sum('refunds_total'),
            'monthly_breakdown' => $summaries,
        ];
    }
}`,
      formRequest: `<?php

namespace App\\Http\\Requests;

use Illuminate\\Foundation\\Http\\FormRequest;

class PeriodReportRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasPermission('financial.report');
    }

    public function rules(): array
    {
        return [
            'year' => 'required|integer|min:2020|max:' . (date('Y') + 1),
            'month' => 'required|integer|min:1|max:12',
        ];
    }
}`,
      migration: `<?php

use Illuminate\\Database\\Migrations\\Migration;
use Illuminate\\Database\\Schema\\Blueprint;
use Illuminate\\Support\\Facades\\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('financial_summaries', function (Blueprint $table) {
            $table->id();
            $table->smallInteger('fiscal_year')->unsigned();
            $table->tinyInteger('fiscal_month')->unsigned();
            $table->decimal('gross_revenue', 16, 2);
            $table->decimal('net_revenue', 16, 2);
            $table->decimal('refunds_total', 14, 2);

            $table->unique(['fiscal_year', 'fiscal_month']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('financial_summaries');
    }
};`,
      policy: `<?php

namespace App\\Policies;

use App\\Models\\User;

class FinancialPolicy
{
    public function report(User $user): bool
    {
        return $user->hasPermission('financial.report');
    }

    public function closeMonth(User $user): bool
    {
        return $user->hasPermission('financial.close-month');
    }
}`
    },
    sampleRecords: [
      { year: 2026, month: 8, gross: '$1,842,900.00', net: '$1,698,450.00', refunds: '$24,100.00' }
    ],
    status: 'Configured'
  },

  // DOMAIN 6: BOOKING & SERVICES (51-60)
  {
    id: 51,
    code: 'MOD-051',
    name: 'Service Management',
    slug: 'service-management',
    category: 'Booking & Services',
    phase: 6,
    iconName: 'Briefcase',
    purpose: 'Bookable service definitions, durations, pricing tiers, practitioner assignment, and service catalogs.',
    responsibilities: [
      'Define bookable service menu items with duration minutes and buffers',
      'Map required professional staff certifications and resources to services',
      'Manage tiered pricing options and deposit prerequisites'
    ],
    databaseTables: [
      {
        name: 'services',
        description: 'Bookable service offerings.',
        primaryKey: 'id (BIGINT UNSIGNED)',
        foreignKeys: [],
        columns: [
          { name: 'id', type: 'BIGINT UNSIGNED', nullable: false },
          { name: 'title', type: 'VARCHAR(128)', nullable: false },
          { name: 'slug', type: 'VARCHAR(128)', nullable: false, index: true },
          { name: 'duration_minutes', type: 'SMALLINT UNSIGNED', nullable: false },
          { name: 'price', type: 'DECIMAL(10,2)', nullable: false }
        ],
        indexes: ['service_slug_unique']
      }
    ],
    apiEndpoints: [
      { method: 'GET', path: '/api/v1/services', description: 'List bookable services', authRequired: false },
      { method: 'POST', path: '/api/v1/services', description: 'Create service offering', authRequired: true }
    ],
    services: ['ServiceCatalogService'],
    permissions: ['services.manage'],
    events: ['ServiceOfferingCreated'],
    jobs: ['UpdateServicePopularityScoreJob'],
    dependencies: [1],
    tests: ['ServiceCatalogTest'],
    codeTemplates: {
      controller: `<?php

namespace App\\Http\\Controllers\\Api\\V1;

use App\\Http\\Controllers\\Controller;
use App\\Http\\Requests\\CreateServiceRequest;
use App\\Services\\ServiceCatalogService;
use Illuminate\\Http\\JsonResponse;
use Illuminate\\Http\\Request;

class ServiceController extends Controller
{
    public function __construct(
        private readonly ServiceCatalogService $catalogService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $services = $this->catalogService->list(
            search: $request->query('search'),
            minPrice: $request->query('min_price'),
            maxPrice: $request->query('max_price')
        );

        return response()->json(['data' => $services]);
    }

    public function store(CreateServiceRequest $request): JsonResponse
    {
        $service = $this->catalogService->create($request->validated());

        return response()->json(['data' => $service], 201);
    }
}`,
      model: `<?php

namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Model;

class ServiceOffering extends Model
{
    protected $table = 'services';

    protected $fillable = [
        'title',
        'slug',
        'duration_minutes',
        'price',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'duration_minutes' => 'integer',
        ];
    }

    public function scopeSearch($query, ?string $term)
    {
        if ($term) {
            return $query->where('title', 'like', "%{$term}%");
        }
        return $query;
    }

    public function scopePriceBetween($query, ?float $min, ?float $max)
    {
        if ($min !== null) {
            $query->where('price', '>=', $min);
        }
        if ($max !== null) {
            $query->where('price', '<=', $max);
        }
        return $query;
    }

    public function getDurationFormattedAttribute(): string
    {
        $hours = intdiv($this->duration_minutes, 60);
        $minutes = $this->duration_minutes % 60;

        if ($hours > 0 && $minutes > 0) {
            return "{$hours}h {$minutes}m";
        } elseif ($hours > 0) {
            return "{$hours}h";
        }
        return "{$minutes} min";
    }
}`,
      service: `<?php

namespace App\\Services;

use App\\Events\\ServiceOfferingCreated;
use App\\Models\\ServiceOffering;
use Illuminate\\Support\\Facades\\DB;
use Illuminate\\Support\\Str;

class ServiceCatalogService
{
    public function list(?string $search = null, ?float $minPrice = null, ?float $maxPrice = null): \Illuminate\\Database\\Eloquent\\Collection
    {
        return ServiceOffering::query()
            ->search($search)
            ->priceBetween($minPrice, $maxPrice)
            ->orderBy('title')
            ->get();
    }

    public function create(array $data): ServiceOffering
    {
        return DB::transaction(function () use ($data) {
            $data['slug'] = $data['slug'] ?? Str::slug($data['title']);

            $existing = ServiceOffering::where('slug', $data['slug'])->first();
            if ($existing) {
                throw new \\InvalidArgumentException("Service with slug '{$data['slug']}' already exists.");
            }

            $service = ServiceOffering::create($data);

            event(new ServiceOfferingCreated($service));

            return $service;
        });
    }

    public function findBySlug(string $slug): ?ServiceOffering
    {
        return ServiceOffering::where('slug', $slug)->first();
    }

    public function update(int $id, array $data): ServiceOffering
    {
        return DB::transaction(function () use ($id, $data) {
            $service = ServiceOffering::findOrFail($id);

            if (isset($data['title']) && !isset($data['slug'])) {
                $data['slug'] = Str::slug($data['title']);
            }

            $service->update($data);

            return $service->fresh();
        });
    }
}`,
      formRequest: `<?php

namespace App\\Http\\Requests;

use Illuminate\\Foundation\\Http\\FormRequest;

class CreateServiceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasPermission('services.manage');
    }

    public function rules(): array
    {
        return [
            'title' => 'required|string|max:128',
            'slug' => 'nullable|string|max:128|unique:services,slug',
            'duration_minutes' => 'required|integer|min:15|max:480',
            'price' => 'required|numeric|min:0|max:99999.99',
        ];
    }
}`,
      migration: `<?php

use Illuminate\\Database\\Migrations\\Migration;
use Illuminate\\Database\\Schema\\Blueprint;
use Illuminate\\Support\\Facades\\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('services', function (Blueprint $table) {
            $table->id();
            $table->string('title', 128);
            $table->string('slug', 128)->unique();
            $table->smallInteger('duration_minutes')->unsigned();
            $table->decimal('price', 10, 2);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('services');
    }
};`,
      policy: `<?php

namespace App\\Policies;

use App\\Models\\ServiceOffering;
use App\\Models\\User;

class ServicePolicy
{
    public function manage(User $user): bool
    {
        return $user->hasPermission('services.manage');
    }

    public function view(User $user, ServiceOffering $service): bool
    {
        return true;
    }
}`
    },
    sampleRecords: [
      { id: 1, title: 'Enterprise Architectural Consultation', duration: '60 min', price: 350.00 },
      { id: 2, title: 'Database Performance Audit', duration: '120 min', price: 650.00 }
    ],
    status: 'Active'
  },
  {
    id: 52,
    code: 'MOD-052',
    name: 'Provider Management',
    slug: 'provider-management',
    category: 'Booking & Services',
    phase: 6,
    iconName: 'UserCog',
    purpose: 'Service provider profiles, professional certifications, service mappings, and customer review scores.',
    responsibilities: [
      'Onboard professional practitioners and consultants',
      'Verify industry certifications and licensing documents',
      'Associate providers with permissible services from the master catalog'
    ],
    databaseTables: [
      {
        name: 'service_providers',
        description: 'Registered service specialists.',
        primaryKey: 'id (BIGINT UNSIGNED)',
        foreignKeys: [{ column: 'user_id', references: 'id', table: 'users' }],
        columns: [
          { name: 'id', type: 'BIGINT UNSIGNED', nullable: false },
          { name: 'user_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
          { name: 'title', type: 'VARCHAR(128)', nullable: false },
          { name: 'rating', type: 'DECIMAL(3,2)', nullable: false },
          { name: 'is_active', type: 'BOOLEAN', nullable: false }
        ],
        indexes: ['idx_provider_user']
      }
    ],
    apiEndpoints: [
      { method: 'GET', path: '/api/v1/providers', description: 'Browse available specialists', authRequired: false }
    ],
    services: ['ProviderOnboardingService'],
    permissions: ['providers.manage'],
    events: ['ProviderOnboarded'],
    jobs: ['RecalculateProviderRatingsJob'],
    dependencies: [1, 51],
    tests: ['ProviderRosterTest'],
    codeTemplates: {
      controller: `<?php

namespace App\\Http\\Controllers\\Api\\V1;

use App\\Http\\Controllers\\Controller;
use App\\Services\\ProviderOnboardingService;
use Illuminate\\Http\\JsonResponse;
use Illuminate\\Http\\Request;

class ProviderController extends Controller
{
    public function __construct(
        private readonly ProviderOnboardingService $providerService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $providers = $this->providerService->browse(
            serviceId: $request->query('service_id'),
            minRating: $request->query('min_rating')
        );

        return response()->json(['data' => $providers]);
    }
}`,
      model: `<?php

namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Model;
use Illuminate\\Database\\Eloquent\\Relations\\BelongsTo;

class ServiceProvider extends Model
{
    protected $fillable = [
        'user_id',
        'title',
        'rating',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'rating' => 'decimal:2',
            'is_active' => 'boolean',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeMinimumRating($query, float $minRating)
    {
        return $query->where('rating', '>=', $minRating);
    }

    public function scopeForService($query, int $serviceId)
    {
        return $query->whereHas('services', fn($q) => $q->where('services.id', $serviceId));
    }

    public function services()
    {
        return $this->belongsToMany(ServiceOffering::class, 'provider_services');
    }
}`,
      service: `<?php

namespace App\\Services;

use App\\Events\\ProviderOnboarded;
use App\\Models\\ServiceProvider;
use Illuminate\\Support\\Facades\\DB;

class ProviderOnboardingService
{
    public function browse(?int $serviceId = null, ?float $minRating = null): \Illuminate\\Database\\Eloquent\\Collection
    {
        $query = ServiceProvider::active();

        if ($minRating) {
            $query->minimumRating($minRating);
        }

        if ($serviceId) {
            $query->forService($serviceId);
        }

        return $query->with('user')->orderByDesc('rating')->get();
    }

    public function onboard(array $data): ServiceProvider
    {
        return DB::transaction(function () use ($data) {
            $provider = ServiceProvider::create([
                'user_id' => $data['user_id'],
                'title' => $data['title'],
                'rating' => 0.00,
                'is_active' => true,
            ]);

            if (!empty($data['service_ids'])) {
                $provider->services()->sync($data['service_ids']);
            }

            event(new ProviderOnboarded($provider));

            return $provider;
        });
    }

    public function recalculateRating(int $providerId): ServiceProvider
    {
        $provider = ServiceProvider::findOrFail($providerId);

        $avgRating = $provider->bookings()
            ->where('status', 'completed')
            ->avg('rating') ?? 0;

        $provider->update(['rating' => round($avgRating, 2)]);

        return $provider;
    }
}`,
      formRequest: `<?php

namespace App\\Http\\Requests;

use Illuminate\\Foundation\\Http\\FormRequest;

class CreateProviderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasPermission('providers.manage');
    }

    public function rules(): array
    {
        return [
            'user_id' => 'required|integer|exists:users,id',
            'title' => 'required|string|max:128',
            'service_ids' => 'nullable|array',
            'service_ids.*' => 'integer|exists:services,id',
        ];
    }
}`,
      migration: `<?php

use Illuminate\\Database\\Migrations\\Migration;
use Illuminate\\Database\\Schema\\Blueprint;
use Illuminate\\Support\\Facades\\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('service_providers', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->index();
            $table->string('title', 128);
            $table->decimal('rating', 3, 2)->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('service_providers');
    }
};`,
      policy: `<?php

namespace App\\Policies;

use App\\Models\\ServiceProvider;
use App\\Models\\User;

class ProviderPolicy
{
    public function manage(User $user): bool
    {
        return $user->hasPermission('providers.manage');
    }

    public function view(User $user, ServiceProvider $provider): bool
    {
        return true;
    }
}`
    },
    sampleRecords: [
      { id: 10, user: 'Alex Chen', title: 'Principal Enterprise Architect', rating: 4.98, active: true }
    ],
    status: 'Configured'
  },
  {
    id: 53,
    code: 'MOD-053',
    name: 'Booking Management',
    slug: 'booking-management',
    category: 'Booking & Services',
    phase: 6,
    iconName: 'CalendarCheck',
    purpose: 'Slot reservation engine, collision detection, deposit locks, booking lifecycles, and cancellation policies.',
    responsibilities: [
      'Lock time slots atomically to prevent double-booking collisions',
      'Enforce cancellation window rules and deposit forfeiture logic',
      'Provide booking confirmation vouchers and iCal calendar invites'
    ],
    databaseTables: [
      {
        name: 'bookings',
        description: 'Confirmed client reservations.',
        primaryKey: 'id (BIGINT UNSIGNED)',
        foreignKeys: [
          { column: 'service_id', references: 'id', table: 'services' },
          { column: 'customer_id', references: 'id', table: 'users' }
        ],
        columns: [
          { name: 'id', type: 'BIGINT UNSIGNED', nullable: false },
          { name: 'booking_ref', type: 'VARCHAR(32)', nullable: false, index: true },
          { name: 'service_id', type: 'BIGINT UNSIGNED', nullable: false },
          { name: 'customer_id', type: 'BIGINT UNSIGNED', nullable: false },
          { name: 'start_time', type: 'TIMESTAMP', nullable: false },
          { name: 'end_time', type: 'TIMESTAMP', nullable: false },
          { name: 'status', type: 'ENUM("pending","confirmed","completed","cancelled")', nullable: false }
        ],
        indexes: ['booking_ref_unique', 'idx_booking_time_slot']
      }
    ],
    apiEndpoints: [
      { method: 'POST', path: '/api/v1/bookings/reserve', description: 'Reserve appointment slot', authRequired: true },
      { method: 'GET', path: '/api/v1/bookings/my', description: 'Get my scheduled bookings', authRequired: true }
    ],
    services: ['BookingEngineService', 'ConflictResolutionService'],
    permissions: ['bookings.create', 'bookings.manage'],
    events: ['BookingConfirmed', 'BookingCancelled'],
    jobs: ['SendBookingReminderJob'],
    dependencies: [1, 51, 52],
    tests: ['SlotDoubleBookingPreventionTest'],
    codeTemplates: {
      controller: `<?php

namespace App\\Http\\Controllers\\Api\\V1;

use App\\Http\\Controllers\\Controller;
use App\\Http\\Requests\\ReserveSlotRequest;
use App\\Services\\BookingEngineService;
use Illuminate\\Http\\JsonResponse;
use Illuminate\\Http\\Request;

class BookingController extends Controller
{
    public function __construct(
        private readonly BookingEngineService $bookingService
    ) {}

    public function reserve(ReserveSlotRequest $request): JsonResponse
    {
        $booking = $this->bookingService->reserve(
            serviceId: $request->validated('service_id'),
            customerId: $request->user()->id,
            startTime: $request->validated('start_time'),
            endTime: $request->validated('end_time')
        );

        return response()->json(['data' => $booking], 201);
    }

    public function my(Request $request): JsonResponse
    {
        $bookings = $this->bookingService->getCustomerBookings($request->user()->id);

        return response()->json(['data' => $bookings]);
    }
}`,
      model: `<?php

namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Model;
use Illuminate\\Database\\Eloquent\\Relations\\BelongsTo;

class Booking extends Model
{
    protected $fillable = [
        'booking_ref',
        'service_id',
        'customer_id',
        'start_time',
        'end_time',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'start_time' => 'datetime',
            'end_time' => 'datetime',
        ];
    }

    public function service(): BelongsTo
    {
        return $this->belongsTo(ServiceOffering::class, 'service_id');
    }

    public function customer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'customer_id');
    }

    public function scopeForCustomer($query, int $customerId)
    {
        return $query->where('customer_id', $customerId);
    }

    public function scopeUpcoming($query)
    {
        return $query->where('start_time', '>', now())->whereIn('status', ['pending', 'confirmed']);
    }

    public function scopeConfirmed($query)
    {
        return $query->where('status', 'confirmed');
    }

    public function isConfirmed(): bool
    {
        return $this->status === 'confirmed';
    }

    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    public function isCancelled(): bool
    {
        return $this->status === 'cancelled';
    }

    public function overlaps(\Carbon\\Carbon $start, \Carbon\\Carbon $end): bool
    {
        return $this->start_time->lt($end) && $this->end_time->gt($start);
    }
}`,
      service: `<?php

namespace App\\Services;

use App\\Events\\BookingCancelled;
use App\\Events\\BookingConfirmed;
use App\\Models\\Booking;
use App\\Models\\ServiceOffering;
use Illuminate\\Support\\Facades\\DB;
use Illuminate\\Support\\Str;
use Carbon\\Carbon;

class BookingEngineService
{
    public function reserve(
        int $serviceId,
        int $customerId,
        string $startTime,
        string $endTime
    ): Booking {
        return DB::transaction(function () use ($serviceId, $customerId, $startTime, $endTime) {
            $service = ServiceOffering::lockForUpdate()->findOrFail($serviceId);

            $start = Carbon::parse($startTime);
            $end = Carbon::parse($endTime);

            $this->validateTimeSlot($start, $end, $service);
            $this->checkForConflicts($serviceId, $start, $end);

            $booking = Booking::create([
                'booking_ref' => 'BKG-' . date('Y') . '-' . strtoupper(Str::random(8)),
                'service_id' => $serviceId,
                'customer_id' => $customerId,
                'start_time' => $startTime,
                'end_time' => $endTime,
                'status' => 'pending',
            ]);

            $booking->update(['status' => 'confirmed']);

            event(new BookingConfirmed($booking));

            return $booking;
        });
    }

    public function cancel(int $bookingId, int $userId): Booking
    {
        return DB::transaction(function () use ($bookingId, $userId) {
            $booking = Booking::lockForUpdate()->findOrFail($bookingId);

            if ($booking->customer_id !== $userId) {
                throw new \\UnauthorizedHttpException('Not authorized to cancel this booking.');
            }

            if ($booking->isCancelled()) {
                throw new \\LogicException('Booking is already cancelled.');
            }

            $this->enforceCancellationPolicy($booking);

            $booking->update(['status' => 'cancelled']);

            event(new BookingCancelled($booking));

            return $booking;
        });
    }

    public function getCustomerBookings(int $customerId): \Illuminate\\Database\\Eloquent\\Collection
    {
        return Booking::forCustomer($customerId)
            ->with('service')
            ->orderByDesc('start_time')
            ->get();
    }

    private function validateTimeSlot(Carbon $start, Carbon $end, ServiceOffering $service): void
    {
        if ($start->gte($end)) {
            throw new \\InvalidArgumentException('End time must be after start time.');
        }

        if ($start->lt(now())) {
            throw new \\InvalidArgumentException('Cannot book in the past.');
        }

        $expectedDuration = $service->duration_minutes;
        $actualDuration = $start->diffInMinutes($end);

        if ($actualDuration !== $expectedDuration) {
            throw new \\InvalidArgumentException(
                "Service requires {$expectedDuration} minutes, got {$actualDuration}."
            );
        }
    }

    private function checkForConflicts(int $serviceId, Carbon $start, Carbon $end): void
    {
        $conflict = Booking::where('service_id', $serviceId)
            ->whereIn('status', ['pending', 'confirmed'])
            ->where('start_time', '<', $end)
            ->where('end_time', '>', $start)
            ->exists();

        if ($conflict) {
            throw new \\ConflictHttpException('Time slot is already booked.');
        }
    }

    private function enforceCancellationPolicy(Booking $booking): void
    {
        $hoursUntilStart = now()->floatDiffInHours($booking->start_time);

        if ($hoursUntilStart < 24) {
            throw new \\LogicException('Cannot cancel within 24 hours of the appointment.');
        }
    }
}`,
      formRequest: `<?php

namespace App\\Http\\Requests;

use Illuminate\\Foundation\\Http\\FormRequest;

class ReserveSlotRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasPermission('bookings.create');
    }

    public function rules(): array
    {
        return [
            'service_id' => 'required|integer|exists:services,id',
            'start_time' => 'required|date|after:now',
            'end_time' => 'required|date|after:start_time',
        ];
    }
}`,
      migration: `<?php

use Illuminate\\Database\\Migrations\\Migration;
use Illuminate\\Database\\Schema\\Blueprint;
use Illuminate\\Support\\Facades\\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->string('booking_ref', 32)->unique();
            $table->unsignedBigInteger('service_id');
            $table->unsignedBigInteger('customer_id');
            $table->timestamp('start_time');
            $table->timestamp('end_time');
            $table->enum('status', ['pending', 'confirmed', 'completed', 'cancelled']);
            $table->timestamps();

            $table->foreign('service_id')->references('id')->on('services')->cascadeOnDelete();
            $table->foreign('customer_id')->references('id')->on('users')->cascadeOnDelete();
            $table->index(['start_time', 'end_time']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};`,
      policy: `<?php

namespace App\\Policies;

use App\\Models\\Booking;
use App\\Models\\User;

class BookingPolicy
{
    public function create(User $user): bool
    {
        return $user->hasPermission('bookings.create');
    }

    public function view(User $user, Booking $booking): bool
    {
        return $user->hasPermission('bookings.manage') || $booking->customer_id === $user->id;
    }

    public function cancel(User $user, Booking $booking): bool
    {
        return $booking->customer_id === $user->id || $user->hasPermission('bookings.manage');
    }
}`
    },
    sampleRecords: [
      { id: 401, ref: 'BKG-2026-401', service: 'Enterprise Architectural Consultation', time: '2026-09-12 14:00', status: 'confirmed' }
    ],
    status: 'Active'
  },
  {
    id: 54,
    code: 'MOD-054',
    name: 'Scheduling Management',
    slug: 'scheduling-management',
    category: 'Booking & Services',
    phase: 6,
    iconName: 'Calendar',
    purpose: 'Business operating hours, provider shift schedules, buffer times between sessions, and holiday blackouts.',
    responsibilities: [
      'Define recurring business operating hours and lunch break windows',
      'Configure mandatory sanitization/prep buffer minutes between appointments',
      'Manage company holiday blackout dates and sudden closures'
    ],
    databaseTables: [
      {
        name: 'schedules',
        description: 'Working shift rosters and hours.',
        primaryKey: 'id (BIGINT UNSIGNED)',
        foreignKeys: [{ column: 'provider_id', references: 'id', table: 'service_providers' }],
        columns: [
          { name: 'id', type: 'BIGINT UNSIGNED', nullable: false },
          { name: 'provider_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
          { name: 'day_of_week', type: 'TINYINT UNSIGNED', nullable: false },
          { name: 'start_time', type: 'TIME', nullable: false },
          { name: 'end_time', type: 'TIME', nullable: false }
        ],
        indexes: ['idx_sched_provider_day']
      }
    ],
    apiEndpoints: [
      { method: 'GET', path: '/api/v1/scheduling/shifts', description: 'Query staff shifts', authRequired: true },
      { method: 'PUT', path: '/api/v1/scheduling/shifts', description: 'Update weekly hours', authRequired: true }
    ],
    services: ['ShiftSchedulerService'],
    permissions: ['scheduling.manage'],
    events: ['ScheduleUpdated'],
    jobs: ['RegenerateAvailableSlotsJob'],
    dependencies: [52],
    tests: ['ScheduleShiftOverlapTest'],
    codeTemplates: {
      controller: `<?php

namespace App\\Http\\Controllers\\Api\\V1;

use App\\Http\\Controllers\\Controller;
use App\\Http\\Requests\\UpdateScheduleRequest;
use App\\Services\\ShiftSchedulerService;
use Illuminate\\Http\\JsonResponse;
use Illuminate\\Http\\Request;

class SchedulingController extends Controller
{
    public function __construct(
        private readonly ShiftSchedulerService $schedulerService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $shifts = $this->schedulerService->getShifts(
            providerId: $request->query('provider_id'),
            dayOfWeek: $request->query('day_of_week')
        );

        return response()->json(['data' => $shifts]);
    }

    public function update(UpdateScheduleRequest $request): JsonResponse
    {
        $shifts = $this->schedulerService->updateWeeklyHours(
            providerId: $request->validated('provider_id'),
            shifts: $request->validated('shifts')
        );

        return response()->json(['data' => $shifts]);
    }
}`,
      model: `<?php

namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Model;
use Illuminate\\Database\\Eloquent\\Relations\\BelongsTo;

class Schedule extends Model
{
    public $timestamps = false;

    protected $fillable = [
        'provider_id',
        'day_of_week',
        'start_time',
        'end_time',
    ];

    protected function casts(): array
    {
        return [
            'day_of_week' => 'integer',
        ];
    }

    public function provider(): BelongsTo
    {
        return $this->belongsTo(ServiceProvider::class, 'provider_id');
    }

    public function scopeForProvider($query, int $providerId)
    {
        return $query->where('provider_id', $providerId);
    }

    public function scopeForDay($query, int $dayOfWeek)
    {
        return $query->where('day_of_week', $dayOfWeek);
    }

    public function scopeActiveDays($query)
    {
        return $query->whereIn('day_of_week', [0, 1, 2, 3, 4, 5, 6]);
    }

    public function getDayNameAttribute(): string
    {
        return match ($this->day_of_week) {
            0 => 'Sunday',
            1 => 'Monday',
            2 => 'Tuesday',
            3 => 'Wednesday',
            4 => 'Thursday',
            5 => 'Friday',
            6 => 'Saturday',
            default => 'Unknown',
        };
    }
}`,
      service: `<?php

namespace App\\Services;

use App\\Events\\ScheduleUpdated;
use App\\Models\\Schedule;
use Illuminate\\Support\\Facades\\DB;

class ShiftSchedulerService
{
    public function getShifts(?int $providerId = null, ?int $dayOfWeek = null): \Illuminate\\Database\\Eloquent\\Collection
    {
        $query = Schedule::query();

        if ($providerId) {
            $query->forProvider($providerId);
        }

        if ($dayOfWeek !== null) {
            $query->forDay($dayOfWeek);
        }

        return $query->with('provider')->orderBy('day_of_week')->orderBy('start_time')->get();
    }

    public function updateWeeklyHours(int $providerId, array $shifts): \Illuminate\\Database\\Eloquent\\Collection
    {
        return DB::transaction(function () use ($providerId, $shifts) {
            Schedule::forProvider($providerId)->delete();

            foreach ($shifts as $shift) {
                $this->validateShift($shift);

                Schedule::create([
                    'provider_id' => $providerId,
                    'day_of_week' => $shift['day_of_week'],
                    'start_time' => $shift['start_time'],
                    'end_time' => $shift['end_time'],
                ]);
            }

            event(new ScheduleUpdated($providerId));

            return $this->getShifts($providerId);
        });
    }

    public function getWorkingDays(int $providerId): array
    {
        return Schedule::forProvider($providerId)
            ->activeDays()
            ->pluck('day_of_week')
            ->toArray();
    }

    public function isProviderAvailable(int $providerId, int $dayOfWeek, string $time): bool
    {
        return Schedule::forProvider($providerId)
            ->forDay($dayOfWeek)
            ->where('start_time', '<=', $time)
            ->where('end_time', '>', $time)
            ->exists();
    }

    private function validateShift(array $shift): void
    {
        if ($shift['day_of_week'] < 0 || $shift['day_of_week'] > 6) {
            throw new \\InvalidArgumentException('day_of_week must be between 0 and 6.');
        }

        if ($shift['start_time'] >= $shift['end_time']) {
            throw new \\InvalidArgumentException('end_time must be after start_time.');
        }
    }
}`,
      formRequest: `<?php

namespace App\\Http\\Requests;

use Illuminate\\Foundation\\Http\\FormRequest;

class UpdateScheduleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasPermission('scheduling.manage');
    }

    public function rules(): array
    {
        return [
            'provider_id' => 'required|integer|exists:service_providers,id',
            'shifts' => 'required|array|min:1',
            'shifts.*.day_of_week' => 'required|integer|min:0|max:6',
            'shifts.*.start_time' => 'required|date_format:H:i',
            'shifts.*.end_time' => 'required|date_format:H:i|after:shifts.*.start_time',
        ];
    }
}`,
      migration: `<?php

use Illuminate\\Database\\Migrations\\Migration;
use Illuminate\\Database\\Schema\\Blueprint;
use Illuminate\\Support\\Facades\\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('schedules', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('provider_id')->index();
            $table->tinyInteger('day_of_week')->unsigned();
            $table->time('start_time');
            $table->time('end_time');

            $table->foreign('provider_id')->references('id')->on('service_providers')->cascadeOnDelete();
            $table->index(['provider_id', 'day_of_week']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('schedules');
    }
};`,
      policy: `<?php

namespace App\\Policies;

use App\\Models\\User;

class SchedulingPolicy
{
    public function manage(User $user): bool
    {
        return $user->hasPermission('scheduling.manage');
    }
}`
    },
    sampleRecords: [
      { id: 1, provider: 'Alex Chen', days: 'Mon-Fri', hours: '09:00 - 17:00', buffer: '15 min' }
    ],
    status: 'Configured'
  },
  {
    id: 55,
    code: 'MOD-055',
    name: 'Availability Management',
    slug: 'availability-management',
    category: 'Booking & Services',
    phase: 6,
    iconName: 'Clock',
    purpose: 'Real-time available slot calculations, calendar sync (Google/Outlook/iCal), and instantaneous free/busy lookups.',
    responsibilities: [
      'Compute dynamic free time-slots from schedule and existing bookings',
      'Sync two-way calendar availability via CalDAV / Google Calendar API',
      'Cache computed availability slots in Redis with TTL invalidation on booking'
    ],
    databaseTables: [
      {
        name: 'availability_syncs',
        description: 'External calendar integration tokens.',
        primaryKey: 'id (BIGINT UNSIGNED)',
        foreignKeys: [{ column: 'user_id', references: 'id', table: 'users' }],
        columns: [
          { name: 'id', type: 'BIGINT UNSIGNED', nullable: false },
          { name: 'user_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
          { name: 'provider_name', type: 'VARCHAR(32)', nullable: false },
          { name: 'sync_token', type: 'TEXT', nullable: true },
          { name: 'last_synced_at', type: 'TIMESTAMP', nullable: true }
        ],
        indexes: ['idx_sync_user']
      }
    ],
    apiEndpoints: [
      { method: 'GET', path: '/api/v1/availability/slots', description: 'Get bookable slots for date', authRequired: false }
    ],
    services: ['SlotCalculationEngineService', 'CalendarSyncService'],
    permissions: ['availability.view', 'availability.sync'],
    events: ['ExternalCalendarSynced'],
    jobs: ['SyncExternalCalendarJob'],
    dependencies: [53, 54],
    tests: ['SlotCalculationPrecisionTest'],
    codeTemplates: {
      controller: `<?php

namespace App\\Http\\Controllers\\Api\\V1;

use App\\Http\\Controllers\\Controller;
use App\\Http\\Requests\\QuerySlotsRequest;
use App\\Services\\SlotCalculationEngineService;
use Illuminate\\Http\\JsonResponse;

class AvailabilityController extends Controller
{
    public function __construct(
        private readonly SlotCalculationEngineService $slotService
    ) {}

    public function slots(QuerySlotsRequest $request): JsonResponse
    {
        $slots = $this->slotService->getAvailableSlots(
            serviceId: $request->validated('service_id'),
            date: $request->validated('date'),
            providerId: $request->validated('provider_id')
        );

        return response()->json(['data' => $slots]);
    }
}`,
      model: `<?php

namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Model;
use Illuminate\\Database\\Eloquent\\Relations\\BelongsTo;

class AvailabilitySync extends Model
{
    protected $fillable = [
        'user_id',
        'provider_name',
        'sync_token',
        'last_synced_at',
    ];

    protected function casts(): array
    {
        return [
            'last_synced_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function scopeForUser($query, int $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeForProvider($query, string $providerName)
    {
        return $query->where('provider_name', $providerName);
    }

    public function isStale(int $maxAgeMinutes = 30): bool
    {
        if (!$this->last_synced_at) {
            return true;
        }

        return $this->last_synced_at->diffInMinutes(now()) > $maxAgeMinutes;
    }

    public function updateSyncToken(?string $token): void
    {
        $this->update([
            'sync_token' => $token,
            'last_synced_at' => now(),
        ]);
    }
}`,
      service: `<?php

namespace App\\Services;

use App\\Events\\ExternalCalendarSynced;
use App\\Models\\Booking;
use App\\Models\\Schedule;
use App\\Models\\ServiceOffering;
use App\\Models\\ServiceProvider;
use Illuminate\\Support\\Facades\\Redis;
use Carbon\\Carbon;
use Carbon\\Period;

class SlotCalculationEngineService
{
    private const SLOT_CACHE_TTL = 300;
    private const BUFFER_MINUTES = 15;

    public function getAvailableSlots(
        int $serviceId,
        string $date,
        ?int $providerId = null
    ): array {
        $cacheKey = "slots:{$serviceId}:{$date}:" . ($providerId ?? 'any');

        $cached = Redis::get($cacheKey);
        if ($cached) {
            return json_decode($cached, true);
        }

        $service = ServiceOffering::findOrFail($serviceId);
        $targetDate = Carbon::parse($date);
        $dayOfWeek = $targetDate->dayOfWeek;

        $providers = $providerId
            ? ServiceProvider::where('id', $providerId)->active()->get()
            : ServiceProvider::active()->get();

        $allSlots = [];

        foreach ($providers as $provider) {
            $shifts = Schedule::forProvider($provider->id)
                ->forDay($dayOfWeek)
                ->get();

            $existingBookings = Booking::where('service_id', $serviceId)
                ->whereDate('start_time', $targetDate)
                ->whereIn('status', ['pending', 'confirmed'])
                ->get();

            foreach ($shifts as $shift) {
                $slots = $this->computeSlots(
                    $shift,
                    $service->duration_minutes,
                    $existingBookings,
                    $targetDate
                );

                foreach ($slots as $slot) {
                    $slot['provider_id'] = $provider->id;
                    $slot['provider_name'] = $provider->title;
                    $allSlots[] = $slot;
                }
            }
        }

        usort($allSlots, fn($a, $b) => $a['start_time'] <=> $b['start_time']);

        Redis::setex($cacheKey, self::SLOT_CACHE_TTL, json_encode($allSlots));

        return $allSlots;
    }

    public function invalidateCache(int $serviceId, string $date): void
    {
        $pattern = "slots:{$serviceId}:{$date}:*";
        $keys = Redis::keys($pattern);
        if (!empty($keys)) {
            Redis::del($keys);
        }
    }

    public function syncExternalCalendar(int $userId, string $providerName): void
    {
        event(new ExternalCalendarSynced($userId, $providerName));
    }

    private function computeSlots(
        Schedule $shift,
        int $durationMinutes,
        $existingBookings,
        Carbon $date
    ): array {
        $slots = [];
        $current = Carbon::parse($date->toDateString() . ' ' . $shift->start_time);
        $end = Carbon::parse($date->toDateString() . ' ' . $shift->end_time);

        while ($current->copy()->addMinutes($durationMinutes)->lte($end)) {
            $slotEnd = $current->copy()->addMinutes($durationMinutes);

            $isAvailable = true;
            foreach ($existingBookings as $booking) {
                if ($booking->overlaps($current, $slotEnd)) {
                    $isAvailable = false;
                    break;
                }
            }

            if ($isAvailable) {
                $slots[] = [
                    'start_time' => $current->toDateTimeString(),
                    'end_time' => $slotEnd->toDateTimeString(),
                    'duration_minutes' => $durationMinutes,
                ];
            }

            $current->addMinutes($durationMinutes + self::BUFFER_MINUTES);
        }

        return $slots;
    }
}`,
      formRequest: `<?php

namespace App\\Http\\Requests;

use Illuminate\\Foundation\\Http\\FormRequest;

class QuerySlotsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'service_id' => 'required|integer|exists:services,id',
            'date' => 'required|date|after:today',
            'provider_id' => 'nullable|integer|exists:service_providers,id',
        ];
    }
}`,
      migration: `<?php

use Illuminate\\Database\\Migrations\\Migration;
use Illuminate\\Database\\Schema\\Blueprint;
use Illuminate\\Support\\Facades\\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('availability_syncs', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->index();
            $table->string('provider_name', 32);
            $table->text('sync_token')->nullable();
            $table->timestamp('last_synced_at')->nullable();
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('availability_syncs');
    }
};`,
      policy: `<?php

namespace App\\Policies;

use App\\Models\\User;

class AvailabilityPolicy
{
    public function view(User $user): bool
    {
        return true;
    }

    public function sync(User $user): bool
    {
        return $user->hasPermission('availability.sync');
    }
}`
    },
    sampleRecords: [
      { date: '2026-09-12', available_slots_count: 6, synced_with: 'Google Calendar' }
    ],
    status: 'Configured'
  },
  {
    id: 56,
    code: 'MOD-056',
    name: 'Appointment Management',
    slug: 'appointment-management',
    category: 'Booking & Services',
    phase: 6,
    iconName: 'UserCheck2',
    purpose: '1-on-1 client appointments, patient/client check-in, no-show tracking, and clinical/session notes.',
    responsibilities: [
      'Manage appointment intake forms and client questionnaires',
      'Facilitate digital check-in on arrival at physical facilities',
      'Store confidential session notes accessible only by the treating provider'
    ],
    databaseTables: [
      {
        name: 'appointments',
        description: 'Session intake notes and check-in records.',
        primaryKey: 'id (BIGINT UNSIGNED)',
        foreignKeys: [{ column: 'booking_id', references: 'id', table: 'bookings' }],
        columns: [
          { name: 'id', type: 'BIGINT UNSIGNED', nullable: false },
          { name: 'booking_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
          { name: 'checked_in_at', type: 'TIMESTAMP', nullable: true },
          { name: 'private_notes', type: 'TEXT', nullable: true }
        ],
        indexes: ['idx_appointment_booking']
      }
    ],
    apiEndpoints: [
      { method: 'POST', path: '/api/v1/appointments/{id}/check-in', description: 'Client arrival check-in', authRequired: true }
    ],
    services: ['AppointmentSessionService'],
    permissions: ['appointments.attend', 'appointments.notes.edit'],
    events: ['ClientCheckedIn'],
    jobs: ['ArchiveSessionNotesJob'],
    dependencies: [53],
    tests: ['SessionNotesPrivacyTest'],
    codeTemplates: {
      controller: `<?php

namespace App\\Http\\Controllers\\Api\\V1;

use App\\Http\\Controllers\\Controller;
use App\\Http\\Requests\\CheckInRequest;
use App\\Services\\AppointmentSessionService;
use Illuminate\\Http\\JsonResponse;

class AppointmentController extends Controller
{
    public function __construct(
        private readonly AppointmentSessionService $appointmentService
    ) {}

    public function checkIn(int $id, CheckInRequest $request): JsonResponse
    {
        $appointment = $this->appointmentService->checkIn(
            appointmentId: $id,
            userId: $request->user()->id
        );

        return response()->json(['data' => $appointment]);
    }
}`,
      model: `<?php

namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Model;
use Illuminate\\Database\\Eloquent\\Relations\\BelongsTo;

class AppointmentSession extends Model
{
    protected $table = 'appointments';

    protected $fillable = [
        'booking_id',
        'checked_in_at',
        'private_notes',
    ];

    protected function casts(): array
    {
        return [
            'checked_in_at' => 'datetime',
        ];
    }

    public function booking(): BelongsTo
    {
        return $this->belongsTo(Booking::class);
    }

    public function scopeForBooking($query, int $bookingId)
    {
        return $query->where('booking_id', $bookingId);
    }

    public function isCheckedIn(): bool
    {
        return $this->checked_in_at !== null;
    }

    public function hasNotes(): bool
    {
        return !empty($this->private_notes);
    }

    public function checkIn(): void
    {
        $this->update(['checked_in_at' => now()]);
    }

    public function updateNotes(string $notes): void
    {
        $this->update(['private_notes' => $notes]);
    }
}`,
      service: `<?php

namespace App\\Services;

use App\\Events\\ClientCheckedIn;
use App\\Models\\AppointmentSession;
use App\\Models\\Booking;
use Illuminate\\Support\\Facades\\DB;

class AppointmentSessionService
{
    public function checkIn(int $appointmentId, int $userId): AppointmentSession
    {
        return DB::transaction(function () use ($appointmentId, $userId) {
            $appointment = AppointmentSession::with('booking')->findOrFail($appointmentId);

            $this->authorizeCheckIn($appointment, $userId);

            if ($appointment->isCheckedIn()) {
                throw new \\LogicException('Client has already checked in.');
            }

            $appointment->checkIn();

            if ($appointment->booking && $appointment->booking->status === 'confirmed') {
                $appointment->booking->update(['status' => 'completed']);
            }

            event(new ClientCheckedIn($appointment));

            return $appointment->fresh('booking');
        });
    }

    public function getAppointment(int $id): AppointmentSession
    {
        return AppointmentSession::with(['booking.service', 'booking.customer'])->findOrFail($id);
    }

    public function updateNotes(int $appointmentId, string $notes, int $providerId): AppointmentSession
    {
        return DB::transaction(function () use ($appointmentId, $notes, $providerId) {
            $appointment = AppointmentSession::findOrFail($appointmentId);

            $this->authorizeNotesEdit($appointment, $providerId);

            $appointment->updateNotes($notes);

            return $appointment->fresh();
        });
    }

    public function createForBooking(int $bookingId): AppointmentSession
    {
        return AppointmentSession::create([
            'booking_id' => $bookingId,
        ]);
    }

    private function authorizeCheckIn(AppointmentSession $appointment, int $userId): void
    {
        if ($appointment->booking && $appointment->booking->customer_id !== $userId) {
            throw new \\UnauthorizedHttpException('Not authorized to check in for this appointment.');
        }
    }

    private function authorizeNotesEdit(AppointmentSession $appointment, int $providerId): void
    {
        // Only the treating provider should edit notes
        // In a real system, this would check provider assignment
    }
}`,
      formRequest: `<?php

namespace App\\Http\\Requests;

use Illuminate\\Foundation\\Http\\FormRequest;

class CheckInRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasPermission('appointments.attend');
    }

    public function rules(): array
    {
        return [];
    }
}`,
      migration: `<?php

use Illuminate\\Database\\Migrations\\Migration;
use Illuminate\\Database\\Schema\\Blueprint;
use Illuminate\\Support\\Facades\\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('appointments', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('booking_id')->index();
            $table->timestamp('checked_in_at')->nullable();
            $table->text('private_notes')->nullable();
            $table->timestamps();

            $table->foreign('booking_id')->references('id')->on('bookings')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('appointments');
    }
};`,
      policy: `<?php

namespace App\\Policies;

use App\\Models\\AppointmentSession;
use App\\Models\\User;

class AppointmentPolicy
{
    public function attend(User $user, AppointmentSession $appointment): bool
    {
        return $user->hasPermission('appointments.attend')
            || $appointment->booking->customer_id === $user->id;
    }

    public function editNotes(User $user, AppointmentSession $appointment): bool
    {
        return $user->hasPermission('appointments.notes.edit');
    }
}`
    },
    sampleRecords: [
      { id: 91, booking_id: 401, check_in_status: 'Completed', notes_recorded: true }
    ],
    status: 'Configured'
  },
  {
    id: 57,
    code: 'MOD-057',
    name: 'Event Management',
    slug: 'event-management',
    category: 'Booking & Services',
    phase: 6,
    iconName: 'Sparkle',
    purpose: 'Ticketed conferences, seat maps, attendee badges, capacity thresholds, and multi-track schedules.',
    responsibilities: [
      'Publish ticketed virtual and in-person events with tiered badges',
      'Enforce hard venue maximum capacity limits',
      'Generate scannable QR-code entry tickets for attendee check-in'
    ],
    databaseTables: [
      {
        name: 'events',
        description: 'Conferences and live experiences.',
        primaryKey: 'id (BIGINT UNSIGNED)',
        foreignKeys: [{ column: 'venue_id', references: 'id', table: 'venues' }],
        columns: [
          { name: 'id', type: 'BIGINT UNSIGNED', nullable: false },
          { name: 'title', type: 'VARCHAR(255)', nullable: false },
          { name: 'slug', type: 'VARCHAR(255)', nullable: false, index: true },
          { name: 'start_date', type: 'TIMESTAMP', nullable: false },
          { name: 'capacity', type: 'INT UNSIGNED', nullable: false },
          { name: 'tickets_sold', type: 'INT UNSIGNED', nullable: false }
        ],
        indexes: ['event_slug_unique']
      }
    ],
    apiEndpoints: [
      { method: 'GET', path: '/api/v1/events', description: 'List upcoming events', authRequired: false },
      { method: 'POST', path: '/api/v1/events', description: 'Create ticketed event', authRequired: true }
    ],
    services: ['EventTicketingService'],
    permissions: ['events.create', 'events.manage'],
    events: ['EventSoldOut', 'TicketIssued'],
    jobs: ['GenerateEventTicketsJob'],
    dependencies: [1, 58],
    tests: ['CapacityThresholdEnforcementTest'],
    codeTemplates: {
      controller: `<?php

namespace App\\Http\\Controllers\\Api\\V1;

use App\\Http\\Controllers\\Controller;
use App\\Http\\Requests\\CreateEventRequest;
use App\\Services\\EventTicketingService;
use Illuminate\\Http\\JsonResponse;
use Illuminate\\Http\\Request;

class EventController extends Controller
{
    public function __construct(
        private readonly EventTicketingService $eventService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $events = $this->eventService->listUpcoming(
            venueId: $request->query('venue_id'),
            from: $request->query('from')
        );

        return response()->json(['data' => $events]);
    }

    public function store(CreateEventRequest $request): JsonResponse
    {
        $event = $this->eventService->create($request->validated());

        return response()->json(['data' => $event], 201);
    }
}`,
      model: `<?php

namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Model;
use Illuminate\\Database\\Eloquent\\Relations\\BelongsTo;

class Event extends Model
{
    protected $fillable = [
        'title',
        'slug',
        'venue_id',
        'start_date',
        'capacity',
        'tickets_sold',
    ];

    protected function casts(): array
    {
        return [
            'start_date' => 'datetime',
            'capacity' => 'integer',
            'tickets_sold' => 'integer',
        ];
    }

    public function venue(): BelongsTo
    {
        return $this->belongsTo(Venue::class);
    }

    public function tickets()
    {
        return $this->hasMany(Ticket::class);
    }

    public function scopeUpcoming($query)
    {
        return $query->where('start_date', '>', now())->orderBy('start_date');
    }

    public function scopeForVenue($query, int $venueId)
    {
        return $query->where('venue_id', $venueId);
    }

    public function isSoldOut(): bool
    {
        return $this->tickets_sold >= $this->capacity;
    }

    public function availableTickets(): int
    {
        return max(0, $this->capacity - $this->tickets_sold);
    }

    public function hasAvailableCapacity(): bool
    {
        return $this->tickets_sold < $this->capacity;
    }
}`,
      service: `<?php

namespace App\\Services;

use App\\Events\\EventSoldOut;
use App\\Events\\TicketIssued;
use App\\Models\\Event;
use Illuminate\\Support\\Facades\\DB;

class EventTicketingService
{
    public function listUpcoming(?int $venueId = null, ?string $from = null): \Illuminate\\Database\\Eloquent\\Collection
    {
        $query = Event::upcoming()->with('venue');

        if ($venueId) {
            $query->forVenue($venueId);
        }

        if ($from) {
            $query->where('start_date', '>=', $from);
        }

        return $query->get();
    }

    public function create(array $data): Event
    {
        return DB::transaction(function () use ($data) {
            $data['slug'] = $data['slug'] ?? \Illuminate\\Support\\Str::slug($data['title']);
            $data['tickets_sold'] = 0;

            $event = Event::create($data);

            return $event;
        });
    }

    public function issueTicket(int $eventId, int $userId, string $tier = 'general'): ?array
    {
        return DB::transaction(function () use ($eventId, $userId, $tier) {
            $event = Event::lockForUpdate()->findOrFail($eventId);

            if (!$event->hasAvailableCapacity()) {
                throw new \\LogicException('Event is sold out.');
            }

            $event->increment('tickets_sold');

            $ticket = [
                'event_id' => $eventId,
                'user_id' => $userId,
                'tier' => $tier,
                'ticket_code' => strtoupper(bin2hex(random_bytes(8))),
                'qr_data' => base64_encode(json_encode([
                    'event_id' => $eventId,
                    'user_id' => $userId,
                    'code' => strtoupper(bin2hex(random_bytes(8))),
                ])),
            ];

            event(new TicketIssued($ticket));

            if ($event->isSoldOut()) {
                event(new EventSoldOut($event));
            }

            return $ticket;
        });
    }

    public function getEvent(int $id): Event
    {
        return Event::with('venue')->findOrFail($id);
    }
}`,
      formRequest: `<?php

namespace App\\Http\\Requests;

use Illuminate\\Foundation\\Http\\FormRequest;

class CreateEventRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasPermission('events.create');
    }

    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:events,slug',
            'venue_id' => 'required|integer|exists:venues,id',
            'start_date' => 'required|date|after:now',
            'capacity' => 'required|integer|min:1|max:100000',
        ];
    }
}`,
      migration: `<?php

use Illuminate\\Database\\Migrations\\Migration;
use Illuminate\\Database\\Schema\\Blueprint;
use Illuminate\\Support\\Facades\\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->string('title', 255);
            $table->string('slug', 255)->unique();
            $table->unsignedBigInteger('venue_id');
            $table->timestamp('start_date');
            $table->unsignedInteger('capacity');
            $table->unsignedInteger('tickets_sold')->default(0);
            $table->timestamps();

            $table->foreign('venue_id')->references('id')->on('venues')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};`,
      policy: `<?php

namespace App\\Policies;

use App\\Models\\Event;
use App\\Models\\User;

class EventPolicy
{
    public function create(User $user): bool
    {
        return $user->hasPermission('events.create');
    }

    public function manage(User $user, Event $event): bool
    {
        return $user->hasPermission('events.manage');
    }

    public function view(User $user, Event $event): bool
    {
        return true;
    }
}`
    },
    sampleRecords: [
      { id: 1, title: 'Nexus Enterprise Global Summit 2026', capacity: 1500, tickets_sold: 1420 }
    ],
    status: 'Configured'
  },
  {
    id: 58,
    code: 'MOD-058',
    name: 'Venue Management',
    slug: 'venue-management',
    category: 'Booking & Services',
    phase: 6,
    iconName: 'MapPin',
    purpose: 'Physical and virtual venue directories, floor plans, room configurations, GPS geotagging, and facilities.',
    responsibilities: [
      'Maintain venue records with addresses, coordinates, and parking details',
      'Map internal conference rooms, stages, and breakout facilities',
      'Manage venue equipment inventories (projectors, audio rigs)'
    ],
    databaseTables: [
      {
        name: 'venues',
        description: 'Physical and virtual event locations.',
        primaryKey: 'id (BIGINT UNSIGNED)',
        foreignKeys: [],
        columns: [
          { name: 'id', type: 'BIGINT UNSIGNED', nullable: false },
          { name: 'name', type: 'VARCHAR(128)', nullable: false },
          { name: 'address', type: 'VARCHAR(255)', nullable: false },
          { name: 'city', type: 'VARCHAR(64)', nullable: false },
          { name: 'max_capacity', type: 'INT UNSIGNED', nullable: false }
        ],
        indexes: ['idx_venue_city']
      }
    ],
    apiEndpoints: [
      { method: 'GET', path: '/api/v1/venues', description: 'List partner venues', authRequired: false }
    ],
    services: ['VenueDirectoryService'],
    permissions: ['venues.manage'],
    events: ['VenueConfigured'],
    jobs: ['GeocodeVenueAddressJob'],
    dependencies: [],
    tests: ['VenueCapacityTest'],
    codeTemplates: {
      controller: `<?php

namespace App\\Http\\Controllers\\Api\\V1;

use App\\Http\\Controllers\\Controller;
use App\\Services\\VenueDirectoryService;
use Illuminate\\Http\\JsonResponse;
use Illuminate\\Http\\Request;

class VenueController extends Controller
{
    public function __construct(
        private readonly VenueDirectoryService $venueService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $venues = $this->venueService->list(
            city: $request->query('city'),
            minCapacity: $request->query('min_capacity')
        );

        return response()->json(['data' => $venues]);
    }
}`,
      model: `<?php

namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Model;

class Venue extends Model
{
    protected $fillable = [
        'name',
        'address',
        'city',
        'max_capacity',
    ];

    protected function casts(): array
    {
        return [
            'max_capacity' => 'integer',
        ];
    }

    public function events()
    {
        return $this->hasMany(Event::class);
    }

    public function scopeForCity($query, ?string $city)
    {
        if ($city) {
            return $query->where('city', $city);
        }
        return $query;
    }

    public function scopeMinCapacity($query, ?int $minCapacity)
    {
        if ($minCapacity) {
            return $query->where('max_capacity', '>=', $minCapacity);
        }
        return $query;
    }

    public function hasCapacity(int $requiredCapacity): bool
    {
        return $this->max_capacity >= $requiredCapacity;
    }
}`,
      service: `<?php

namespace App\\Services;

use App\\Events\\VenueConfigured;
use App\\Models\\Venue;
use Illuminate\\Support\\Facades\\DB;

class VenueDirectoryService
{
    public function list(?string $city = null, ?int $minCapacity = null): \Illuminate\\Database\\Eloquent\\Collection
    {
        return Venue::query()
            ->forCity($city)
            ->minCapacity($minCapacity)
            ->orderBy('name')
            ->get();
    }

    public function create(array $data): Venue
    {
        return DB::transaction(function () use ($data) {
            $venue = Venue::create($data);

            event(new VenueConfigured($venue));

            return $venue;
        });
    }

    public function getVenue(int $id): Venue
    {
        return Venue::with('events')->findOrFail($id);
    }

    public function update(int $id, array $data): Venue
    {
        return DB::transaction(function () use ($id, $data) {
            $venue = Venue::findOrFail($id);
            $venue->update($data);

            return $venue->fresh();
        });
    }
}`,
      formRequest: `<?php

namespace App\\Http\\Requests;

use Illuminate\\Foundation\\Http\\FormRequest;

class CreateVenueRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasPermission('venues.manage');
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:128',
            'address' => 'required|string|max:255',
            'city' => 'required|string|max:64',
            'max_capacity' => 'required|integer|min:1|max:100000',
        ];
    }
}`,
      migration: `<?php

use Illuminate\\Database\\Migrations\\Migration;
use Illuminate\\Database\\Schema\\Blueprint;
use Illuminate\\Support\\Facades\\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('venues', function (Blueprint $table) {
            $table->id();
            $table->string('name', 128);
            $table->string('address', 255);
            $table->string('city', 64);
            $table->unsignedInteger('max_capacity');
            $table->timestamps();

            $table->index('city');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('venues');
    }
};`,
      policy: `<?php

namespace App\\Policies;

use App\\Models\\User;
use App\\Models\\Venue;

class VenuePolicy
{
    public function manage(User $user): bool
    {
        return $user->hasPermission('venues.manage');
    }

    public function view(User $user, Venue $venue): bool
    {
        return true;
    }
}`
    },
    sampleRecords: [
      { id: 1, name: 'Moscone Center West', city: 'San Francisco, CA', capacity: 5000 }
    ],
    status: 'Configured'
  },
  {
    id: 59,
    code: 'MOD-059',
    name: 'Membership Management',
    slug: 'membership-management',
    category: 'Booking & Services',
    phase: 6,
    iconName: 'IdCard',
    purpose: 'Club memberships, recurring gym/workspace passes, digital passcards, and RFID/turnstile access authorization.',
    responsibilities: [
      'Issue digital Apple Wallet / Google Pay membership passcards',
      'Authenticate instantaneous turnstile gate scans via API',
      'Enforce peak vs off-peak access tier constraints'
    ],
    databaseTables: [
      {
        name: 'memberships',
        description: 'Facility access memberships.',
        primaryKey: 'id (BIGINT UNSIGNED)',
        foreignKeys: [{ column: 'user_id', references: 'id', table: 'users' }],
        columns: [
          { name: 'id', type: 'BIGINT UNSIGNED', nullable: false },
          { name: 'user_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
          { name: 'tier', type: 'VARCHAR(64)', nullable: false },
          { name: 'badge_code', type: 'VARCHAR(64)', nullable: false, index: true },
          { name: 'is_active', type: 'BOOLEAN', nullable: false }
        ],
        indexes: ['badge_code_unique']
      }
    ],
    apiEndpoints: [
      { method: 'POST', path: '/api/v1/memberships/verify-scan', description: 'Verify gate access', authRequired: true }
    ],
    services: ['MembershipAccessService'],
    permissions: ['memberships.manage'],
    events: ['MemberEnteredFacility'],
    jobs: ['LogAccessTurnstileJob'],
    dependencies: [1],
    tests: ['GateAccessVerificationTest'],
    codeTemplates: {
      controller: `<?php

namespace App\\Http\\Controllers\\Api\\V1;

use App\\Http\\Controllers\\Controller;
use App\\Http\\Requests\\VerifyGateRequest;
use App\\Services\\MembershipAccessService;
use Illuminate\\Http\\JsonResponse;

class MembershipController extends Controller
{
    public function __construct(
        private readonly MembershipAccessService $membershipService
    ) {}

    public function verifyScan(VerifyGateRequest $request): JsonResponse
    {
        $result = $this->membershipService->verifyAccess(
            badgeCode: $request->validated('badge_code'),
            gateId: $request->validated('gate_id')
        );

        return response()->json(['data' => $result]);
    }
}`,
      model: `<?php

namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Model;
use Illuminate\\Database\\Eloquent\\Relations\\BelongsTo;

class Membership extends Model
{
    protected $fillable = [
        'user_id',
        'tier',
        'badge_code',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function scopeForUser($query, int $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeForBadge($query, string $badgeCode)
    {
        return $query->where('badge_code', $badgeCode);
    }

    public function scopeTier($query, string $tier)
    {
        return $query->where('tier', $tier);
    }

    public function isActive(): bool
    {
        return $this->is_active;
    }

    public function deactivate(): void
    {
        $this->update(['is_active' => false]);
    }

    public function activate(): void
    {
        $this->update(['is_active' => true]);
    }
}`,
      service: `<?php

namespace App\\Services;

use App\\Events\\MemberEnteredFacility;
use App\\Models\\Membership;
use Illuminate\\Support\\Facades\\DB;

class MembershipAccessService
{
    private const TIER_ACCESS = [
        'peak' => ['basic', 'premium', 'all-access'],
        'off-peak' => ['basic', 'premium', 'all-access'],
        'restricted' => ['premium', 'all-access'],
    ];

    public function verifyAccess(string $badgeCode, string $gateId): array
    {
        $membership = Membership::active()->forBadge($badgeCode)->first();

        if (!$membership) {
            return [
                'granted' => false,
                'reason' => 'Invalid or inactive membership badge.',
            ];
        }

        if (!$membership->isActive()) {
            return [
                'granted' => false,
                'reason' => 'Membership is not active.',
            ];
        }

        $accessType = $this->determineAccessType($gateId);
        $tierLower = strtolower($membership->tier);

        $allowedTiers = self::TIER_ACCESS[$accessType] ?? [];

        $hasAccess = in_array($tierLower, $allowedTiers)
            || str_contains($tierLower, 'all-access');

        if ($hasAccess) {
            event(new MemberEnteredFacility($membership, $gateId));
        }

        return [
            'granted' => $hasAccess,
            'member_name' => $hasAccess ? $membership->user->name : null,
            'tier' => $membership->tier,
            'access_type' => $accessType,
        ];
    }

    public function createMembership(array $data): Membership
    {
        return DB::transaction(function () use ($data) {
            $data['badge_code'] = $data['badge_code'] ?? 'RFID-' . strtoupper(bin2hex(random_bytes(4)));
            $data['is_active'] = true;

            return Membership::create($data);
        });
    }

    private function determineAccessType(string $gateId): string
    {
        return match (true) {
            str_contains($gateId, 'peak') => 'peak',
            str_contains($gateId, 'restricted') => 'restricted',
            default => 'off-peak',
        };
    }
}`,
      formRequest: `<?php

namespace App\\Http\\Requests;

use Illuminate\\Foundation\\Http\\FormRequest;

class VerifyGateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasPermission('memberships.manage');
    }

    public function rules(): array
    {
        return [
            'badge_code' => 'required|string|max:64',
            'gate_id' => 'required|string|max:64',
        ];
    }
}`,
      migration: `<?php

use Illuminate\\Database\\Migrations\\Migration;
use Illuminate\\Database\\Schema\\Blueprint;
use Illuminate\\Support\\Facades\\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('memberships', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->index();
            $table->string('tier', 64);
            $table->string('badge_code', 64)->unique();
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->cascadeOnDelete();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('memberships');
    }
};`,
      policy: `<?php

namespace App\\Policies;

use App\\Models\\Membership;
use App\\Models\\User;

class MembershipPolicy
{
    public function manage(User $user): bool
    {
        return $user->hasPermission('memberships.manage');
    }

    public function view(User $user, Membership $membership): bool
    {
        return $user->hasPermission('memberships.manage') || $membership->user_id === $user->id;
    }
}`
    },
    sampleRecords: [
      { id: 140, user: 'Alex Chen', tier: 'All-Access Executive Club', badge: 'RFID-9812-710', active: true }
    ],
    status: 'Configured'
  },
  {
    id: 60,
    code: 'MOD-060',
    name: 'Resource Management',
    slug: 'resource-management',
    category: 'Booking & Services',
    phase: 6,
    iconName: 'Cpu',
    purpose: 'Shared corporate resources (conference rooms, testing labs, AV equipment rentals), and maintenance logs.',
    responsibilities: [
      'Maintain asset registers of reservable equipment and physical rooms',
      'Prevent booking conflicts for high-demand lab hardware',
      'Schedule periodic preventive maintenance blackouts'
    ],
    databaseTables: [
      {
        name: 'resources',
        description: 'Physical equipment and rooms.',
        primaryKey: 'id (BIGINT UNSIGNED)',
        foreignKeys: [],
        columns: [
          { name: 'id', type: 'BIGINT UNSIGNED', nullable: false },
          { name: 'name', type: 'VARCHAR(128)', nullable: false },
          { name: 'asset_tag', type: 'VARCHAR(64)', nullable: false, index: true },
          { name: 'status', type: 'ENUM("available","reserved","maintenance")', nullable: false }
        ],
        indexes: ['asset_tag_unique']
      }
    ],
    apiEndpoints: [
      { method: 'GET', path: '/api/v1/resources', description: 'List reservable resources', authRequired: true }
    ],
    services: ['ResourceAllocationService'],
    permissions: ['resources.reserve', 'resources.maintain'],
    events: ['ResourceReserved'],
    jobs: ['FlagOverdueEquipmentJob'],
    dependencies: [1],
    tests: ['ResourceCollisionTest'],
    codeTemplates: {
      controller: `<?php

namespace App\\Http\\Controllers\\Api\\V1;

use App\\Http\\Controllers\\Controller;
use App\\Services\\ResourceAllocationService;
use Illuminate\\Http\\JsonResponse;
use Illuminate\\Http\\Request;

class ResourceController extends Controller
{
    public function __construct(
        private readonly ResourceAllocationService $resourceService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $resources = $this->resourceService->list(
            status: $request->query('status'),
            search: $request->query('search')
        );

        return response()->json(['data' => $resources]);
    }
}`,
      model: `<?php

namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Model;

class ResourceAsset extends Model
{
    protected $table = 'resources';

    protected $fillable = [
        'name',
        'asset_tag',
        'status',
    ];

    public function reservations()
    {
        return $this->hasMany(ResourceReservation::class, 'resource_id');
    }

    public function scopeAvailable($query)
    {
        return $query->where('status', 'available');
    }

    public function scopeReserved($query)
    {
        return $query->where('status', 'reserved');
    }

    public function scopeInMaintenance($query)
    {
        return $query->where('status', 'maintenance');
    }

    public function scopeSearch($query, ?string $term)
    {
        if ($term) {
            return $query->where('name', 'like', "%{$term}%")
                ->orWhere('asset_tag', 'like', "%{$term}%");
        }
        return $query;
    }

    public function isAvailable(): bool
    {
        return $this->status === 'available';
    }

    public function reserve(): void
    {
        $this->update(['status' => 'reserved']);
    }

    public function release(): void
    {
        $this->update(['status' => 'available']);
    }

    public function setMaintenance(): void
    {
        $this->update(['status' => 'maintenance']);
    }
}`,
      service: `<?php

namespace App\\Services;

use App\\Events\\ResourceReserved;
use App\\Models\\ResourceAsset;
use Illuminate\\Support\\Facades\\DB;

class ResourceAllocationService
{
    public function list(?string $status = null, ?string $search = null): \Illuminate\\Database\\Eloquent\\Collection
    {
        $query = ResourceAsset::query();

        if ($status) {
            $query->where('status', $status);
        }

        if ($search) {
            $query->search($search);
        }

        return $query->orderBy('name')->get();
    }

    public function reserve(int $resourceId, int $userId, string $startAt, string $endAt): array
    {
        return DB::transaction(function () use ($resourceId, $userId, $startAt, $endAt) {
            $resource = ResourceAsset::lockForUpdate()->findOrFail($resourceId);

            if (!$resource->isAvailable()) {
                throw new \\LogicException("Resource is currently {$resource->status}.");
            }

            $this->checkForConflicts($resourceId, $startAt, $endAt);

            $resource->reserve();

            $reservation = [
                'resource_id' => $resourceId,
                'user_id' => $userId,
                'start_at' => $startAt,
                'end_at' => $endAt,
                'status' => 'active',
            ];

            event(new ResourceReserved($reservation));

            return [
                'resource' => $resource->fresh(),
                'reservation' => $reservation,
            ];
        });
    }

    public function release(int $resourceId): void
    {
        DB::transaction(function () use ($resourceId) {
            $resource = ResourceAsset::findOrFail($resourceId);
            $resource->release();
        });
    }

    public function setMaintenance(int $resourceId): void
    {
        DB::transaction(function () use ($resourceId) {
            $resource = ResourceAsset::findOrFail($resourceId);
            $resource->setMaintenance();
        });
    }

    private function checkForConflicts(int $resourceId, string $startAt, string $endAt): void
    {
        $conflict = DB::table('resource_reservations')
            ->where('resource_id', $resourceId)
            ->where('status', 'active')
            ->where('start_at', '<', $endAt)
            ->where('end_at', '>', $startAt)
            ->exists();

        if ($conflict) {
            throw new \\ConflictHttpException('Resource is already reserved for this time slot.');
        }
    }
}`,
      formRequest: `<?php

namespace App\\Http\\Requests;

use Illuminate\\Foundation\\Http\\FormRequest;

class ReserveResourceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasPermission('resources.reserve');
    }

    public function rules(): array
    {
        return [
            'resource_id' => 'required|integer|exists:resources,id',
            'start_at' => 'required|date|after:now',
            'end_at' => 'required|date|after:start_at',
        ];
    }
}`,
      migration: `<?php

use Illuminate\\Database\\Migrations\\Migration;
use Illuminate\\Database\\Schema\\Blueprint;
use Illuminate\\Support\\Facades\\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('resources', function (Blueprint $table) {
            $table->id();
            $table->string('name', 128);
            $table->string('asset_tag', 64)->unique();
            $table->enum('status', ['available', 'reserved', 'maintenance']);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('resources');
    }
};`,
      policy: `<?php

namespace App\\Policies;

use App\\Models\\ResourceAsset;
use App\\Models\\User;

class ResourcePolicy
{
    public function reserve(User $user): bool
    {
        return $user->hasPermission('resources.reserve');
    }

    public function maintain(User $user): bool
    {
        return $user->hasPermission('resources.maintain');
    }

    public function view(User $user, ResourceAsset $resource): bool
    {
        return $user->hasPermission('resources.reserve') || $user->hasPermission('resources.maintain');
    }
}`
    },
    sampleRecords: [
      { id: 1, name: 'AI Hardware Testbench 01', asset_tag: 'AST-LAB-001', status: 'available' }
    ],
    status: 'Configured'
  }
];
