
export const modulesDomain1_2 = [
  // DOMAIN 1: IDENTITY & ACCESS (01-10)
  {
    id: 1,
    code: 'MOD-001',
    name: 'Identity Management',
    slug: 'identity-management',
    category: 'Identity & Access',
    phase: 1,
    iconName: 'UserCheck',
    purpose: 'Centralized lifecycle management for user accounts, global identifiers, identity verification, and multi-tenant credentials.',
    responsibilities: [
      'Manage universal user identifier (UUID) generation and tracking',
      'Handle account state transitions (Active, Pending, Suspended, Archived)',
      'Manage identity federation credentials and linked accounts',
      'Orchestrate identity verification workflows and KYC attributes'
    ],
    databaseTables: [
      {
        name: 'users',
        description: 'Core platform user account table with identity anchors.',
        primaryKey: 'id (BIGINT UNSIGNED)',
        foreignKeys: [],
        columns: [
          { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
          { name: 'uuid', type: 'CHAR(36)', nullable: false, index: true },
          { name: 'email', type: 'VARCHAR(255)', nullable: false, index: true },
          { name: 'phone', type: 'VARCHAR(32)', nullable: true },
          { name: 'status', type: 'ENUM("pending","active","suspended","banned")', nullable: false },
          { name: 'email_verified_at', type: 'TIMESTAMP', nullable: true },
          { name: 'created_at', type: 'TIMESTAMP', nullable: false },
          { name: 'updated_at', type: 'TIMESTAMP', nullable: false },
          { name: 'deleted_at', type: 'TIMESTAMP', nullable: true }
        ],
        indexes: ['users_email_unique', 'users_uuid_unique', 'idx_users_status']
      },
      {
        name: 'user_identities',
        description: 'Federated and third-party identity bindings.',
        primaryKey: 'id (BIGINT UNSIGNED)',
        foreignKeys: [{ column: 'user_id', references: 'id', table: 'users' }],
        columns: [
          { name: 'id', type: 'BIGINT UNSIGNED', nullable: false },
          { name: 'user_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
          { name: 'provider', type: 'VARCHAR(64)', nullable: false },
          { name: 'provider_id', type: 'VARCHAR(255)', nullable: false },
          { name: 'created_at', type: 'TIMESTAMP', nullable: false }
        ],
        indexes: ['user_provider_unique', 'idx_user_identities_user_id']
      }
    ],
    apiEndpoints: [
      { method: 'GET', path: '/api/v1/identity/users', description: 'Paginated user list with filter scopes', authRequired: true, permission: 'identity.view' },
      { method: 'POST', path: '/api/v1/identity/users', description: 'Create and provision user identity', authRequired: true, permission: 'identity.create' },
      { method: 'GET', path: '/api/v1/identity/users/{id}', description: 'Retrieve user details and identities', authRequired: true, permission: 'identity.view' },
      { method: 'PATCH', path: '/api/v1/identity/users/{id}/status', description: 'Transition account status', authRequired: true, permission: 'identity.suspend' }
    ],
    services: ['UserIdentityService', 'AccountLifecycleService', 'IdentityVerificationService'],
    permissions: ['identity.view', 'identity.create', 'identity.update', 'identity.suspend', 'identity.delete'],
    events: ['UserIdentityCreated', 'UserIdentitySuspended', 'UserIdentityVerified'],
    jobs: ['PruneStaleIdentitiesJob', 'SyncIdentityFederationJob'],
    dependencies: [],
    tests: ['UserIdentityServiceTest', 'IdentityLifecycleFeatureTest', 'UserStatusTransitionPolicyTest'],
    codeTemplates: {
      controller: `namespace Modules\\IdentityManagement\\Controllers;

use App\\Http\\Controllers\\Controller;
use Modules\\IdentityManagement\\Services\\UserIdentityService;
use Modules\\IdentityManagement\\Requests\\CreateUserRequest;
use Modules\\IdentityManagement\\Resources\\UserResource;
use Illuminate\\Http\\JsonResponse;

class IdentityController extends Controller
{
    public function __construct(
        protected UserIdentityService $identityService
    ) {}

    public function index(): JsonResponse
    {
        $this->authorize('identity.view');
        $users = $this->identityService->getPaginatedUsers();
        return response()->json([
            'success' => true,
            'data' => UserResource::collection($users)
        ]);
    }

    public function store(CreateUserRequest $request): JsonResponse
    {
        $user = $this->identityService->provisionUser($request->validated());
        return response()->json([
            'success' => true,
            'data' => new UserResource($user)
        ], 201);
    }
}`,
      model: `namespace Modules\\IdentityManagement\\Models;

use Illuminate\\Database\\Eloquent\\Model;
use Illuminate\\Database\\Eloquent\\SoftDeletes;
use Illuminate\\Database\\Eloquent\\Relations\\HasMany;

class User extends Model
{
    use SoftDeletes;

    protected $fillable = ['uuid', 'email', 'phone', 'status', 'email_verified_at'];
    protected $casts = ['email_verified_at' => 'datetime'];

    public function identities(): HasMany
    {
        return $this->hasMany(UserIdentity::class);
    }
}`,
      service: `namespace Modules\\IdentityManagement\\Services;

use Modules\\IdentityManagement\\Models\\User;
use Modules\\IdentityManagement\\Events\\UserIdentityCreated;
use Illuminate\\Support\\Str;
use Illuminate\\Support\\Facades\\DB;

class UserIdentityService
{
    public function provisionUser(array $attributes): User
    {
        return DB::transaction(function () use ($attributes) {
            $user = User::create([
                'uuid' => (string) Str::uuid(),
                'email' => $attributes['email'],
                'status' => 'pending'
            ]);
            event(new UserIdentityCreated($user));
            return $user;
        });
    }
}`,
      formRequest: `namespace Modules\\IdentityManagement\\Requests;

use Illuminate\\Foundation\\Http\\FormRequest;

class CreateUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('identity.create') ?? false;
    }

    public function rules(): array
    {
        return [
            'email' => ['required', 'string', 'email:rfc,dns', 'max:255', 'unique:users,email'],
            'phone' => ['nullable', 'string', 'max:32']
        ];
    }
}`,
      migration: `Schema::create('users', function (Blueprint $table) {
    $table->id();
    $table->uuid('uuid')->unique();
    $table->string('email')->unique();
    $table->string('phone')->nullable();
    $table->enum('status', ['pending', 'active', 'suspended', 'banned'])->default('pending');
    $table->timestamp('email_verified_at')->nullable();
    $table->timestamps();
    $table->softDeletes();
    $table->index('status');
});`,
      policy: `namespace Modules\\IdentityManagement\\Policies;

use Modules\\IdentityManagement\\Models\\User;

class IdentityPolicy
{
    public function view(User $user): bool
    {
        return $user->hasPermissionTo('identity.view');
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('identity.create');
    }
}`,
      reactComponent: `import React, { useState, useEffect } from 'react';
import { useUsers } from '../../hooks/useUsers';
import { UserTable } from './UserTable';
import { CreateUserModal } from './CreateUserModal';
import { StatusBadge } from '../ui/StatusBadge';
import { Pagination } from '../ui/Pagination';

export function IdentityManagement() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { users, total, loading, error, refetch } = useUsers({ page, search });

  useEffect(() => {
    const loginAsync = async () => {
      const res = await fetch('http://localhost:5000/api/login');
      console.log('Login response:', res);
    };
    loginAsync();
  }, []);

  const handleUserCreated = () => {
    setShowCreateModal(false);
    refetch();
  };

  if (error) return <div className="error-banner">Error: {error.message}</div>;

  return (
    <div className="identity-management">
      <header className="module-header">
        <h1>Identity Management</h1>
        <div className="header-actions">
          <input
            type="search"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
          <button onClick={() => setShowCreateModal(true)} className="btn-primary">
            Create User
          </button>
        </div>
      </header>

      {loading ? (
        <div className="skeleton-loader" />
      ) : (
        <>
          <UserTable users={users} onStatusChange={refetch} />
          <Pagination
            current={page}
            total={total}
            pageSize={25}
            onChange={setPage}
          />
        </>
      )}

      {showCreateModal && (
        <CreateUserModal
          onClose={() => setShowCreateModal(false)}
          onCreated={handleUserCreated}
        />
      )}
    </div>
  );
}`,
      reactHook: `import { useState, useEffect, useCallback } from 'react';

export function useUsers({ page = 1, search = '', status = null }) {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page, per_page: 25 });
      if (search) params.append('search', search);
      if (status) params.append('status', status);

      const response = await fetch(\`/api/v1/identity/users?\${params}\`, {
        headers: {
          'Authorization': \`Bearer \${localStorage.getItem('token')}\`,
          'Accept': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Failed to fetch users');

      const data = await response.json();
      setUsers(data.data);
      setTotal(data.meta.total);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [page, search, status]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const updateUserStatus = async (userId, newStatus) => {
    await fetch(\`/api/v1/identity/users/\${userId}/status\`, {
      method: 'PATCH',
      headers: {
        'Authorization': \`Bearer \${localStorage.getItem('token')}\`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: newStatus }),
    });
    fetchUsers();
  };

  return { users, total, loading, error, refetch: fetchUsers, updateUserStatus };
}`,
      reactStyles: `.identity-management {
  padding: 24px;
}

.module-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.module-header h1 {
  font-size: 24px;
  font-weight: 600;
  color: #1a1a2e;
}

.header-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.search-input {
  padding: 8px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 14px;
  width: 280px;
}

.search-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.btn-primary {
  padding: 8px 16px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}

.btn-primary:hover {
  background: #2563eb;
}

.error-banner {
  padding: 12px 16px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 6px;
  color: #dc2626;
}

.skeleton-loader {
  height: 400px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 8px;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}`
    },
    sampleRecords: [
      { id: 101, uuid: 'usr-9281a7-4c12', email: 'alex.chen@nexus-enterprise.io', status: 'active', verified: true, role: 'Super Admin' },
      { id: 102, uuid: 'usr-3312b9-7f44', email: 'sarah.connor@corp.internal', status: 'active', verified: true, role: 'Enterprise Manager' },
      { id: 103, uuid: 'usr-8109cc-9e21', email: 'marcus.vance@techlead.co', status: 'pending', verified: false, role: 'Developer' }
    ],
    status: 'Active'
  },
  {
    id: 2,
    code: 'MOD-002',
    name: 'Authentication',
    slug: 'authentication',
    category: 'Identity & Access',
    phase: 1,
    iconName: 'Lock',
    purpose: 'Secure credential verification, password hashing, Sanctum token management, and multi-factor authentication.',
    responsibilities: [
      'Authenticate users via email/password, social OAuth, or magic links',
      'Issue and invalidate Laravel Sanctum personal access tokens',
      'Enforce Two-Factor Authentication (TOTP / Google Authenticator)',
      'Protect endpoints against credential stuffing and brute-force attacks'
    ],
    databaseTables: [
      {
        name: 'personal_access_tokens',
        description: 'Sanctum Bearer token storage with cryptographic hashing.',
        primaryKey: 'id (BIGINT UNSIGNED)',
        foreignKeys: [],
        columns: [
          { name: 'id', type: 'BIGINT UNSIGNED', nullable: false },
          { name: 'tokenable_type', type: 'VARCHAR(255)', nullable: false, index: true },
          { name: 'tokenable_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
          { name: 'name', type: 'VARCHAR(255)', nullable: false },
          { name: 'token', type: 'CHAR(64)', nullable: false, index: true },
          { name: 'abilities', type: 'TEXT', nullable: true },
          { name: 'last_used_at', type: 'TIMESTAMP', nullable: true },
          { name: 'expires_at', type: 'TIMESTAMP', nullable: true }
        ],
        indexes: ['pat_token_unique', 'idx_tokenable']
      },
      {
        name: 'two_factor_credentials',
        description: 'Encrypted TOTP secret keys and recovery codes.',
        primaryKey: 'id (BIGINT UNSIGNED)',
        foreignKeys: [{ column: 'user_id', references: 'id', table: 'users' }],
        columns: [
          { name: 'id', type: 'BIGINT UNSIGNED', nullable: false },
          { name: 'user_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
          { name: 'secret', type: 'TEXT', nullable: false },
          { name: 'recovery_codes', type: 'JSON', nullable: true },
          { name: 'confirmed_at', type: 'TIMESTAMP', nullable: true }
        ],
        indexes: ['two_factor_user_id_unique']
      }
    ],
    apiEndpoints: [
      { method: 'POST', path: '/api/v1/auth/register', description: 'New account onboarding', authRequired: false },
      { method: 'POST', path: '/api/v1/auth/login', description: 'Sanctum token generation', authRequired: false },
      { method: 'POST', path: '/api/v1/auth/logout', description: 'Revoke active Bearer token', authRequired: true },
      { method: 'POST', path: '/api/v1/auth/2fa/verify', description: 'Confirm time-based 6-digit OTP', authRequired: true }
    ],
    services: ['AuthenticationService', 'TwoFactorService', 'PasswordResetService'],
    permissions: ['auth.login', 'auth.impersonate', 'auth.revoke-tokens'],
    events: ['UserLoggedIn', 'UserLoggedOut', 'FailedLoginAttemptDetected', 'TwoFactorEnabled'],
    jobs: ['SendPasswordResetEmailJob', 'PruneExpiredTokensJob'],
    dependencies: [1],
    tests: ['AuthLoginFeatureTest', 'SanctumTokenRevocationTest', 'TwoFactorVerificationTest'],
    codeTemplates: {
      controller: `namespace Modules\\Authentication\\Controllers;

use App\\Http\\Controllers\\Controller;
use Modules\\Authentication\\Services\\AuthenticationService;
use Modules\\Authentication\\Services\\TwoFactorService;
use Modules\\Authentication\\Requests\\RegisterRequest;
use Modules\\Authentication\\Requests\\LoginRequest;
use Modules\\Authentication\\Requests\\TwoFactorVerifyRequest;
use Illuminate\\Http\\JsonResponse;
use Illuminate\\Http\\Request;

class AuthController extends Controller
{
    public function __construct(
        protected AuthenticationService $authService,
        protected TwoFactorService $twoFactorService
    ) {}

    public function register(RegisterRequest $request): JsonResponse
    {
        $result = $this->authService->register($request->validated(), $request->ip());
        return response()->json([
            'success' => true,
            'message' => 'Account created successfully.',
            'token' => $result['token'],
            'user' => $result['user']
        ], 201);
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $result = $this->authService->authenticate(
            $request->validated('email'),
            $request->validated('password'),
            $request->ip()
        );

        if ($result['requires_2fa'] ?? false) {
            return response()->json([
                'success' => true,
                'requires_2fa' => true,
                'temp_token' => $result['temp_token']
            ]);
        }

        return response()->json([
            'success' => true,
            'token' => $result['token'],
            'user' => $result['user']
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $this->authService->revokeToken($request->user());
        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully.'
        ]);
    }

    public function verify2fa(TwoFactorVerifyRequest $request): JsonResponse
    {
        $result = $this->twoFactorService->verify(
            $request->validated('temp_token'),
            $request->validated('code'),
            $request->ip()
        );

        return response()->json([
            'success' => true,
            'token' => $result['token'],
            'user' => $result['user']
        ]);
    }
}`,
      model: `namespace Modules\\Authentication\\Models;

use Illuminate\\Database\\Eloquent\\Model;
use Illuminate\\Database\\Eloquent\\Relations\\BelongsTo;
use Modules\\IdentityManagement\\Models\\User;

class TwoFactorCredential extends Model
{
    protected $table = 'two_factor_credentials';

    protected $fillable = ['user_id', 'secret', 'recovery_codes', 'confirmed_at'];

    protected $casts = [
        'recovery_codes' => 'array',
        'confirmed_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}`,
      service: `namespace Modules\\Authentication\\Services;

use Modules\\IdentityManagement\\Models\\User;
use Modules\\Authentication\\Events\\UserLoggedIn;
use Modules\\Authentication\\Events\\UserLoggedOut;
use Modules\\Authentication\\Events\\FailedLoginAttemptDetected;
use Modules\\Authentication\\Events\\TwoFactorEnabled;
use Illuminate\\Support\\Facades\\Hash;
use Illuminate\\Support\\Facades\\DB;
use Illuminate\\Support\\Str;
use Illuminate\\Validation\\ValidationException;
use Laravel\\Sanctum\\PersonalAccessToken;

class AuthenticationService
{
    public function register(array $attributes, string $ip): array
    {
        return DB::transaction(function () use ($attributes, $ip) {
            $user = User::create([
                'uuid' => (string) Str::uuid(),
                'email' => $attributes['email'],
                'phone' => $attributes['phone'] ?? null,
                'password' => Hash::make($attributes['password']),
                'status' => 'pending',
            ]);

            $token = $user->createToken('web-access')->plainTextToken;

            return ['token' => $token, 'user' => $user];
        });
    }

    public function authenticate(string $email, string $password, string $ip): array
    {
        $user = User::where('email', $email)->first();

        if (!$user || !Hash::check($password, $user->password)) {
            event(new FailedLoginAttemptDetected(['email' => $email, 'ip' => $ip]));
            throw ValidationException::withMessages(['email' => ['Invalid credentials provided.']]);
        }

        if ($user->twoFactorCredential && !$user->twoFactorCredential->confirmed_at) {
            $tempToken = Str::random(64);
            cache()->put("2fa_pending:{$tempToken}", $user->id, 300);
            return ['requires_2fa' => true, 'temp_token' => $tempToken];
        }

        $token = $user->createToken('web-access')->plainTextToken;
        event(new UserLoggedIn($user, ['ip' => $ip]));

        return ['token' => $token, 'user' => $user];
    }

    public function revokeToken(User $user): void
    {
        $user->currentAccessToken()->delete();
        event(new UserLoggedOut($user));
    }
}`,
      formRequest: `namespace Modules\\Authentication\\Requests;

use Illuminate\\Foundation\\Http\\FormRequest;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'email' => ['required', 'string', 'email:rfc,dns', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'phone' => ['nullable', 'string', 'max:32'],
        ];
    }
}

namespace Modules\\Authentication\\Requests;

use Illuminate\\Foundation\\Http\\FormRequest;

class LoginRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'email' => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
        ];
    }
}

namespace Modules\\Authentication\\Requests;

use Illuminate\\Foundation\\Http\\FormRequest;

class TwoFactorVerifyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'temp_token' => ['required', 'string'],
            'code' => ['required', 'string', 'size:6'],
        ];
    }
}`,
      migration: `Schema::create('personal_access_tokens', function (Blueprint $table) {
    $table->id();
    $table->morphs('tokenable');
    $table->string('name');
    $table->string('token', 64)->unique();
    $table->text('abilities')->nullable();
    $table->timestamp('last_used_at')->nullable();
    $table->timestamp('expires_at')->nullable();
    $table->timestamps();
});

Schema::create('two_factor_credentials', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
    $table->text('secret');
    $table->json('recovery_codes')->nullable();
    $table->timestamp('confirmed_at')->nullable();
    $table->timestamps();
    $table->unique('user_id');
});`,
      policy: `namespace Modules\\Authentication\\Policies;

use Modules\\IdentityManagement\\Models\\User;

class AuthPolicy
{
    public function login(User $user): bool
    {
        return $user->status === 'active';
    }

    public function impersonate(User $user): bool
    {
        return $user->hasPermissionTo('auth.impersonate');
    }

    public function revokeTokens(User $user): bool
    {
        return $user->hasPermissionTo('auth.revoke-tokens');
    }
}`,
      reactComponent: `import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { TwoFactorForm } from './TwoFactorForm';

export function Authentication() {
  const [mode, setMode] = useState('login');
  const { login, register, verify2fa, loading, error } = useAuth();
  const [requires2fa, setRequires2fa] = useState(false);
  const [tempToken, setTempToken] = useState(null);

  useEffect(() => {
    const loginAsync = async () => {
      const res = await fetch('http://localhost:5000/api/login');
      console.log('Login response:', res);
    };
    loginAsync();
  }, []);

  const handleLogin = async (email, password) => {
    const result = await login(email, password);
    if (result.requires_2fa) {
      setRequires2fa(true);
      setTempToken(result.temp_token);
    }
  };

  const handle2faVerify = async (code) => {
    await verify2fa(tempToken, code);
  };

  const handleRegister = async (data) => {
    await register(data);
    setMode('login');
  };

  return (
    <div className="authentication">
      <div className="auth-container">
        <div className="auth-header">
          <h1>{mode === 'login' ? 'Sign In' : 'Create Account'}</h1>
          <p>Enterprise Identity Platform</p>
        </div>

        {error && <div className="auth-error">{error.message}</div>}

        {requires2fa ? (
          <TwoFactorForm onSubmit={handle2faVerify} loading={loading} />
        ) : mode === 'login' ? (
          <>
            <LoginForm onSubmit={handleLogin} loading={loading} />
            <p className="auth-switch">
              Don't have an account?{' '}
              <button onClick={() => setMode('register')}>Register</button>
            </p>
          </>
        ) : (
          <>
            <RegisterForm onSubmit={handleRegister} loading={loading} />
            <p className="auth-switch">
              Already have an account?{' '}
              <button onClick={() => setMode('login')}>Sign In</button>
            </p>
          </>
        )}
      </div>
    </div>
  );
}`,
      reactHook: `import { useState, useCallback } from 'react';

const API_BASE = '/api/v1/auth';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(\`\${API_BASE}/login\`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Login failed');

      if (data.requires_2fa) {
        return { requires_2fa: true, temp_token: data.temp_token };
      }

      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser(data.user);
      return data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async ({ email, password, phone }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(\`\${API_BASE}/register\`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, phone }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Registration failed');
      return data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const verify2fa = useCallback(async (tempToken, code) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(\`\${API_BASE}/2fa/verify\`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ temp_token: tempToken, code }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || '2FA verification failed');

      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser(data.user);
      return data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await fetch(\`\${API_BASE}/logout\`, {
      method: 'POST',
      headers: { 'Authorization': \`Bearer \${token}\` },
    });
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  }, [token]);

  return { user, token, loading, error, login, register, verify2fa, logout };
}`,
      reactStyles: `.authentication {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.auth-container {
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 420px;
}

.auth-header {
  text-align: center;
  margin-bottom: 32px;
}

.auth-header h1 {
  font-size: 28px;
  color: #1a1a2e;
  margin-bottom: 8px;
}

.auth-header p {
  color: #6b7280;
  font-size: 14px;
}

.auth-error {
  padding: 12px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  color: #dc2626;
  font-size: 14px;
  margin-bottom: 16px;
}

.auth-switch {
  text-align: center;
  margin-top: 24px;
  color: #6b7280;
  font-size: 14px;
}

.auth-switch button {
  background: none;
  border: none;
  color: #3b82f6;
  cursor: pointer;
  font-weight: 500;
}

.auth-switch button:hover {
  text-decoration: underline;
}`
    },
    sampleRecords: [
      { token_id: 'tok-9918', user: 'alex.chen@nexus-enterprise.io', device: 'Chrome on macOS (192.168.1.10)', status: 'Active', expires_in: '6 days' },
      { token_id: 'tok-4412', user: 'sarah.connor@corp.internal', device: 'Firefox on Linux (10.0.4.12)', status: 'Active', expires_in: '2 days' }
    ],
    status: 'Active'
  },
  {
    id: 3,
    code: 'MOD-003',
    name: 'Authorization',
    slug: 'authorization',
    category: 'Identity & Access',
    phase: 1,
    iconName: 'ShieldCheck',
    purpose: 'Centralized access control decision engine, gate definitions, contextual evaluation, and policy enforcement.',
    responsibilities: [
      'Evaluate authorization decisions across all enterprise modules',
      'Enforce ABAC (Attribute-Based Access Control) alongside RBAC',
      'Audit unauthorized access attempts and permission denials',
      'Provide abilities matrix to frontend application clients'
    ],
    databaseTables: [
      {
        name: 'authorization_policies',
        description: 'Dynamic policy declarations and attribute requirements.',
        primaryKey: 'id (BIGINT UNSIGNED)',
        foreignKeys: [],
        columns: [
          { name: 'id', type: 'BIGINT UNSIGNED', nullable: false },
          { name: 'module_code', type: 'VARCHAR(32)', nullable: false, index: true },
          { name: 'action', type: 'VARCHAR(64)', nullable: false },
          { name: 'rules', type: 'JSON', nullable: false },
          { name: 'is_active', type: 'BOOLEAN', nullable: false }
        ],
        indexes: ['idx_module_action']
      }
    ],
    apiEndpoints: [
      { method: 'POST', path: '/api/v1/authorization/evaluate', description: 'Batch evaluate user abilities', authRequired: true },
      { method: 'GET', path: '/api/v1/authorization/my-abilities', description: 'List permitted actions for current user', authRequired: true }
    ],
    services: ['PolicyEvaluationService', 'AbilitiesResolutionService'],
    permissions: ['authorization.evaluate', 'authorization.override'],
    events: ['UnauthorizedAccessAttempted', 'PolicyEvaluated'],
    jobs: ['CompileAuthorizationCacheJob'],
    dependencies: [1, 4, 5],
    tests: ['PolicyEvaluationServiceTest', 'AuthorizationGateTest'],
    codeTemplates: {
      controller: `namespace Modules\\Authorization\\Controllers;

use App\\Http\\Controllers\\Controller;
use Modules\\Authorization\\Services\\PolicyEvaluationService;
use Modules\\Authorization\\Services\\AbilitiesResolutionService;
use Modules\\Authorization\\Requests\\EvaluateAbilitiesRequest;
use Illuminate\\Http\\JsonResponse;
use Illuminate\\Http\\Request;

class AuthorizationController extends Controller
{
    public function __construct(
        protected PolicyEvaluationService $policyService,
        protected AbilitiesResolutionService $abilitiesService
    ) {}

    public function evaluate(EvaluateAbilitiesRequest $request): JsonResponse
    {
        $this->authorize('authorization.evaluate');

        $results = $this->policyService->batchEvaluate(
            $request->user(),
            $request->validated('checks')
        );

        return response()->json([
            'success' => true,
            'data' => $results
        ]);
    }

    public function myAbilities(Request $request): JsonResponse
    {
        $abilities = $this->abilitiesService->resolveForUser($request->user());

        return response()->json([
            'success' => true,
            'data' => $abilities
        ]);
    }
}`,
      model: `namespace Modules\\Authorization\\Models;

use Illuminate\\Database\\Eloquent\\Model;

class AuthorizationPolicy extends Model
{
    protected $table = 'authorization_policies';

    protected $fillable = ['module_code', 'action', 'rules', 'is_active'];

    protected $casts = [
        'rules' => 'array',
        'is_active' => 'boolean',
    ];

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeForModule($query, string $moduleCode)
    {
        return $query->where('module_code', $moduleCode);
    }
}`,
      service: `namespace Modules\\Authorization\\Services;

use Modules\\Authorization\\Models\\AuthorizationPolicy;
use Modules\\Authorization\\Events\\PolicyEvaluated;
use Modules\\Authorization\\Events\\UnauthorizedAccessAttempted;
use Modules\\IdentityManagement\\Models\\User;
use Illuminate\\Support\\Facades\\Cache;

class PolicyEvaluationService
{
    public function batchEvaluate(User $user, array $checks): array
    {
        $results = [];

        foreach ($checks as $check) {
            $moduleCode = $check['module'] ?? '';
            $action = $check['action'] ?? '';

            $allowed = $this->evaluate($user, $moduleCode, $action, $check['context'] ?? []);

            $results[] = [
                'module' => $moduleCode,
                'action' => $action,
                'allowed' => $allowed,
            ];

            if (!$allowed) {
                event(new UnauthorizedAccessAttempted([
                    'user_id' => $user->id,
                    'module' => $moduleCode,
                    'action' => $action,
                ]));
            }
        }

        event(new PolicyEvaluated(['user_id' => $user->id, 'results' => $results]));

        return $results;
    }

    public function evaluate(User $user, string $moduleCode, string $action, array $context = []): bool
    {
        $cacheKey = "policy:{$moduleCode}:{$action}";
        $policy = Cache::tags(['policies'])->remember($cacheKey, 3600, function () use ($moduleCode, $action) {
            return AuthorizationPolicy::active()
                ->forModule($moduleCode)
                ->where('action', $action)
                ->first();
        });

        if (!$policy) {
            return $user->hasPermissionTo("{$moduleCode}.{$action}");
        }

        $rules = $policy->rules;
        foreach ($rules as $rule) {
            if (!$this->evaluateRule($user, $rule, $context)) {
                return false;
            }
        }

        return true;
    }

    protected function evaluateRule(User $user, array $rule, array $context): bool
    {
        $attribute = $rule['attribute'] ?? '';
        $operator = $rule['operator'] ?? '==';
        $value = $rule['value'] ?? null;

        return match($operator) {
            '==' => $context[$attribute] == $value,
            '!=' => $context[$attribute] != $value,
            '<=' => ($context[$attribute] ?? 0) <= $value,
            '>=' => ($context[$attribute] ?? 0) >= $value,
            'in' => in_array($context[$attribute], (array) $value),
            default => true,
        };
    }
}`,
      formRequest: `namespace Modules\\Authorization\\Requests;

use Illuminate\\Foundation\\Http\\FormRequest;

class EvaluateAbilitiesRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('authorization.evaluate') ?? false;
    }

    public function rules(): array
    {
        return [
            'checks' => ['required', 'array', 'min:1'],
            'checks.*.module' => ['required', 'string', 'max:32'],
            'checks.*.action' => ['required', 'string', 'max:64'],
            'checks.*.context' => ['nullable', 'array'],
        ];
    }
}`,
      migration: `Schema::create('authorization_policies', function (Blueprint $table) {
    $table->id();
    $table->string('module_code', 32);
    $table->string('action', 64);
    $table->json('rules');
    $table->boolean('is_active')->default(true);
    $table->timestamps();
    $table->index(['module_code', 'action']);
});`,
      policy: `namespace Modules\\Authorization\\Policies;

use Modules\\IdentityManagement\\Models\\User;

class AuthorizationPolicy
{
    public function evaluate(User $user): bool
    {
        return $user->hasPermissionTo('authorization.evaluate');
    }

    public function override(User $user): bool
    {
        return $user->hasPermissionTo('authorization.override');
    }
}`,
      reactComponent: `import React, { useState, useEffect } from 'react';
import { useAuthorization } from '../../hooks/useAuthorization';
import { AbilitiesTable } from './AbilitiesTable';
import { PolicyEvaluator } from './PolicyEvaluator';
import { StatusBadge } from '../ui/StatusBadge';

export function AuthorizationDashboard() {
  const [abilities, setAbilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const { evaluate, results } = useAuthorization();

  useEffect(() => {
    const loginAsync = async () => {
      const res = await fetch('http://localhost:5000/api/login');
      console.log('Login response:', res);
    };
    loginAsync();
  }, []);

  useEffect(() => {
    fetchAbilities();
  }, []);

  const fetchAbilities = async () => {
    setLoading(true);
    const response = await fetch('/api/v1/authorization/my-abilities', {
      headers: { 'Authorization': \`Bearer \${localStorage.getItem('token')}\` },
    });
    const data = await response.json();
    setAbilities(data.data);
    setLoading(false);
  };

  return (
    <div className="authorization-dashboard">
      <header className="module-header">
        <h1>Authorization Dashboard</h1>
      </header>
      {loading ? (
        <div className="skeleton-loader" />
      ) : (
        <>
          <AbilitiesTable abilities={abilities} />
          <PolicyEvaluator onEvaluate={evaluate} results={results} />
        </>
      )}
    </div>
  );
}`,
      reactHook: `import { useState, useCallback } from 'react';

export function useAuthorization() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const evaluate = useCallback(async (checks) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/v1/authorization/evaluate', {
        method: 'POST',
        headers: {
          'Authorization': \`Bearer \${localStorage.getItem('token')}\`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ checks }),
      });
      if (!response.ok) throw new Error('Evaluation failed');
      const data = await response.json();
      setResults(data.data);
      return data.data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { results, loading, error, evaluate };
}`,
      reactStyles: `.authorization-dashboard {
  padding: 24px;
}

.module-header {
  margin-bottom: 24px;
}

.module-header h1 {
  font-size: 24px;
  font-weight: 600;
  color: #1a1a2e;
}

.skeleton-loader {
  height: 400px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 8px;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}`
    },
    sampleRecords: [
      { rule_id: 'POL-01', module: 'Financial', action: 'wallets.transfer', condition: 'amount <= limit && 2fa_confirmed', status: 'Enforced' },
      { rule_id: 'POL-02', module: 'Commerce', action: 'orders.cancel', condition: 'status == "pending" || is_admin', status: 'Enforced' }
    ],
    status: 'Active'
  },
  {
    id: 4,
    code: 'MOD-004',
    name: 'Role Management',
    slug: 'role-management',
    category: 'Identity & Access',
    phase: 1,
    iconName: 'Users',
    purpose: 'Define enterprise roles, establish role hierarchies, and bind permissions to roles.',
    responsibilities: [
      'Create, update, and deprecate system and tenant-specific roles',
      'Manage role inheritance hierarchies (e.g. Super Admin > Org Admin > Manager)',
      'Assign roles to users within specific organizational scopes'
    ],
    databaseTables: [
      {
        name: 'roles',
        description: 'System roles and tenant roles.',
        primaryKey: 'id (BIGINT UNSIGNED)',
        foreignKeys: [],
        columns: [
          { name: 'id', type: 'BIGINT UNSIGNED', nullable: false },
          { name: 'name', type: 'VARCHAR(64)', nullable: false },
          { name: 'slug', type: 'VARCHAR(64)', nullable: false, index: true },
          { name: 'description', type: 'VARCHAR(255)', nullable: true },
          { name: 'is_system', type: 'BOOLEAN', nullable: false },
          { name: 'created_at', type: 'TIMESTAMP', nullable: false }
        ],
        indexes: ['roles_slug_unique']
      },
      {
        name: 'role_user',
        description: 'User to role pivot mapping.',
        primaryKey: 'Composite (user_id, role_id)',
        foreignKeys: [
          { column: 'user_id', references: 'id', table: 'users' },
          { column: 'role_id', references: 'id', table: 'roles' }
        ],
        columns: [
          { name: 'user_id', type: 'BIGINT UNSIGNED', nullable: false },
          { name: 'role_id', type: 'BIGINT UNSIGNED', nullable: false }
        ],
        indexes: ['idx_role_user']
      }
    ],
    apiEndpoints: [
      { method: 'GET', path: '/api/v1/roles', description: 'List all system roles', authRequired: true, permission: 'roles.view' },
      { method: 'POST', path: '/api/v1/roles', description: 'Create custom role', authRequired: true, permission: 'roles.create' },
      { method: 'POST', path: '/api/v1/roles/{id}/assign', description: 'Assign role to user', authRequired: true, permission: 'roles.assign' }
    ],
    services: ['RoleHierarchyService', 'RoleAssignmentService'],
    permissions: ['roles.view', 'roles.create', 'roles.edit', 'roles.delete', 'roles.assign'],
    events: ['RoleCreated', 'RoleAssignedToUser'],
    jobs: ['RecalculateUserEffectiveRolesJob'],
    dependencies: [1, 5],
    tests: ['RoleHierarchyTest', 'RoleAssignmentFeatureTest'],
    codeTemplates: {
      controller: `namespace Modules\\RoleManagement\\Controllers;

use App\\Http\\Controllers\\Controller;
use Modules\\RoleManagement\\Services\\RoleHierarchyService;
use Modules\\RoleManagement\\Services\\RoleAssignmentService;
use Modules\\RoleManagement\\Requests\\CreateRoleRequest;
use Modules\\RoleManagement\\Requests\\AssignRoleRequest;
use Modules\\RoleManagement\\Resources\\RoleResource;
use Illuminate\\Http\\JsonResponse;
use Illuminate\\Http\\Request;

class RoleController extends Controller
{
    public function __construct(
        protected RoleHierarchyService $roleService,
        protected RoleAssignmentService $assignmentService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $this->authorize('roles.view');

        $roles = $this->roleService->getPaginatedRoles($request->query('per_page', 25));

        return response()->json([
            'success' => true,
            'data' => RoleResource::collection($roles)
        ]);
    }

    public function store(CreateRoleRequest $request): JsonResponse
    {
        $role = $this->roleService->createRole($request->validated());

        return response()->json([
            'success' => true,
            'data' => new RoleResource($role)
        ], 201);
    }

    public function assign(AssignRoleRequest $request, int $id): JsonResponse
    {
        $role = $this->roleService->findById($id);
        $this->assignmentService->assignToUser($role, $request->validated('user_id'));

        return response()->json([
            'success' => true,
            'message' => 'Role assigned successfully.'
        ]);
    }
}`,
      model: `namespace Modules\\RoleManagement\\Models;

use Illuminate\\Database\\Eloquent\\Model;
use Illuminate\\Database\\Eloquent\\Relations\\BelongsToMany;
use Modules\\IdentityManagement\\Models\\User;

class Role extends Model
{
    protected $fillable = ['name', 'slug', 'description', 'is_system'];

    protected $casts = [
        'is_system' => 'boolean',
    ];

    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'role_user')->withTimestamps();
    }

    public function permissions(): BelongsToMany
    {
        return $this->belongsToMany(Permission::class, 'permission_role')->withTimestamps();
    }

    public function scopeSystem($query)
    {
        return $query->where('is_system', true);
    }
}`,
      service: `namespace Modules\\RoleManagement\\Services;

use Modules\\RoleManagement\\Models\\Role;
use Modules\\RoleManagement\\Events\\RoleCreated;
use Modules\\RoleManagement\\Events\\RoleAssignedToUser;
use Illuminate\\Support\\Facades\\DB;

class RoleHierarchyService
{
    public function getPaginatedRoles(int $perPage = 25)
    {
        return Role::with('permissions')->orderBy('name')->paginate($perPage);
    }

    public function findById(int $id): Role
    {
        return Role::findOrFail($id);
    }

    public function createRole(array $attributes): Role
    {
        return DB::transaction(function () use ($attributes) {
            $role = Role::create($attributes);
            event(new RoleCreated($role));
            return $role;
        });
    }

    public function getEffectiveRoles(int $userId): array
    {
        $roles = Role::whereHas('users', fn($q) => $q->where('user_id', $userId))
            ->with('permissions')
            ->get();

        return $roles->pluck('permissions')->flatten()->unique('id')->toArray();
    }
}

class RoleAssignmentService
{
    public function assignToUser(Role $role, int $userId): void
    {
        DB::transaction(function () use ($role, $userId) {
            $role->users()->syncWithoutDetaching([$userId]);
            event(new RoleAssignedToUser($role, $userId));
        });
    }

    public function removeFromUser(Role $role, int $userId): void
    {
        $role->users()->detach($userId);
    }
}`,
      formRequest: `namespace Modules\\RoleManagement\\Requests;

use Illuminate\\Foundation\\Http\\FormRequest;

class CreateRoleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('roles.create') ?? false;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:64', 'unique:roles,name'],
            'slug' => ['required', 'string', 'max:64', 'unique:roles,slug'],
            'description' => ['nullable', 'string', 'max:255'],
            'is_system' => ['boolean'],
        ];
    }
}

namespace Modules\\RoleManagement\\Requests;

use Illuminate\\Foundation\\Http\\FormRequest;

class AssignRoleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('roles.assign') ?? false;
    }

    public function rules(): array
    {
        return [
            'user_id' => ['required', 'integer', 'exists:users,id'],
        ];
    }
}`,
      migration: `Schema::create('roles', function (Blueprint $table) {
    $table->id();
    $table->string('name', 64)->unique();
    $table->string('slug', 64)->unique();
    $table->string('description')->nullable();
    $table->boolean('is_system')->default(false);
    $table->timestamps();
});

Schema::create('role_user', function (Blueprint $table) {
    $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
    $table->foreignId('role_id')->constrained('roles')->cascadeOnDelete();
    $table->primary(['user_id', 'role_id']);
    $table->timestamps();
});`,
      policy: `namespace Modules\\RoleManagement\\Policies;

use Modules\\IdentityManagement\\Models\\User;

class RolePolicy
{
    public function view(User $user): bool
    {
        return $user->hasPermissionTo('roles.view');
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('roles.create');
    }

    public function edit(User $user): bool
    {
        return $user->hasPermissionTo('roles.edit');
    }

    public function delete(User $user): bool
    {
        return $user->hasPermissionTo('roles.delete');
    }

    public function assign(User $user): bool
    {
        return $user->hasPermissionTo('roles.assign');
    }
}`,
      reactComponent: `import React, { useState, useEffect } from 'react';
import { useRoles } from '../../hooks/useRoles';
import { RoleTable } from './RoleTable';
import { AssignRoleModal } from './AssignRoleModal';
import { CreateRoleModal } from './CreateRoleModal';

export function RoleManagement() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const { fetchRoles, assignRole, createRole } = useRoles();

  useEffect(() => {
    const loginAsync = async () => {
      const res = await fetch('http://localhost:5000/api/login');
      console.log('Login response:', res);
    };
    loginAsync();
  }, []);

  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    setLoading(true);
    const data = await fetchRoles();
    setRoles(data);
    setLoading(false);
  };

  const handleAssign = (role) => {
    setSelectedRole(role);
    setShowAssignModal(true);
  };

  return (
    <div className="role-management">
      <header className="module-header">
        <h1>Role Management</h1>
        <button onClick={() => setShowCreateModal(true)} className="btn-primary">
          Create Role
        </button>
      </header>
      {loading ? (
        <div className="skeleton-loader" />
      ) : (
        <RoleTable roles={roles} onAssign={handleAssign} />
      )}
      {showAssignModal && (
        <AssignRoleModal
          role={selectedRole}
          onClose={() => setShowAssignModal(false)}
          onAssigned={loadRoles}
        />
      )}
      {showCreateModal && (
        <CreateRoleModal
          onClose={() => setShowCreateModal(false)}
          onCreated={loadRoles}
        />
      )}
    </div>
  );
}`,
      reactHook: `import { useState, useCallback } from 'react';

export function useRoles() {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRoles = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/v1/roles', {
        headers: { 'Authorization': \`Bearer \${localStorage.getItem('token')}\` },
      });
      const data = await response.json();
      setRoles(data.data);
      return data.data;
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createRole = useCallback(async (roleData) => {
    const response = await fetch('/api/v1/roles', {
      method: 'POST',
      headers: {
        'Authorization': \`Bearer \${localStorage.getItem('token')}\`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(roleData),
    });
    return response.json();
  }, []);

  const assignRole = useCallback(async (roleId, userId) => {
    const response = await fetch(\`/api/v1/roles/\${roleId}/assign\`, {
      method: 'POST',
      headers: {
        'Authorization': \`Bearer \${localStorage.getItem('token')}\`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ user_id: userId }),
    });
    return response.json();
  }, []);

  return { roles, loading, error, fetchRoles, createRole, assignRole };
}`,
      reactStyles: `.role-management {
  padding: 24px;
}

.module-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.module-header h1 {
  font-size: 24px;
  font-weight: 600;
  color: #1a1a2e;
}

.btn-primary {
  padding: 8px 16px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}

.btn-primary:hover {
  background: #2563eb;
}

.skeleton-loader {
  height: 400px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 8px;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}`
    },
    sampleRecords: [
      { id: 1, name: 'Super Administrator', slug: 'super-admin', permissions_count: 340, users_count: 2, is_system: true },
      { id: 2, name: 'Organization Admin', slug: 'org-admin', permissions_count: 180, users_count: 14, is_system: true },
      { id: 3, name: 'Commerce Manager', slug: 'commerce-manager', permissions_count: 65, users_count: 28, is_system: false }
    ],
    status: 'Active'
  },
  {
    id: 5,
    code: 'MOD-005',
    name: 'Permission Management',
    slug: 'permission-management',
    category: 'Identity & Access',
    phase: 1,
    iconName: 'Key',
    purpose: 'Granular, atomic permission registry mapped to business modules and action verbs.',
    responsibilities: [
      'Maintain authoritative catalog of granular permissions',
      'Bind and unbind permissions to roles and user overrides',
      'Manage Redis cache tags for high-speed sub-millisecond lookups'
    ],
    databaseTables: [
      {
        name: 'permissions',
        description: 'Atomic system permissions.',
        primaryKey: 'id (BIGINT UNSIGNED)',
        foreignKeys: [],
        columns: [
          { name: 'id', type: 'BIGINT UNSIGNED', nullable: false },
          { name: 'name', type: 'VARCHAR(64)', nullable: false },
          { name: 'slug', type: 'VARCHAR(64)', nullable: false, index: true },
          { name: 'module_code', type: 'VARCHAR(32)', nullable: false, index: true },
          { name: 'description', type: 'VARCHAR(255)', nullable: true }
        ],
        indexes: ['permissions_slug_unique', 'idx_perm_module']
      },
      {
        name: 'permission_role',
        description: 'Role to permission pivot table.',
        primaryKey: 'Composite (permission_id, role_id)',
        foreignKeys: [
          { column: 'permission_id', references: 'id', table: 'permissions' },
          { column: 'role_id', references: 'id', table: 'roles' }
        ],
        columns: [
          { name: 'permission_id', type: 'BIGINT UNSIGNED', nullable: false },
          { name: 'role_id', type: 'BIGINT UNSIGNED', nullable: false }
        ],
        indexes: ['idx_perm_role']
      }
    ],
    apiEndpoints: [
      { method: 'GET', path: '/api/v1/permissions', description: 'List permissions grouped by module', authRequired: true, permission: 'permissions.view' },
      { method: 'POST', path: '/api/v1/permissions/sync-role', description: 'Batch update role permissions', authRequired: true, permission: 'permissions.grant' }
    ],
    services: ['PermissionRegistryService', 'PermissionCacheService'],
    permissions: ['permissions.view', 'permissions.create', 'permissions.grant'],
    events: ['PermissionGrantedToRole', 'PermissionRevoked', 'PermissionCacheFlushed'],
    jobs: ['FlushPermissionCacheJob'],
    dependencies: [1],
    tests: ['PermissionCacheTest', 'PermissionRegistryTest'],
    codeTemplates: {
      controller: `namespace Modules\\PermissionManagement\\Controllers;

use App\\Http\\Controllers\\Controller;
use Modules\\PermissionManagement\\Services\\PermissionRegistryService;
use Modules\\PermissionManagement\\Services\\PermissionCacheService;
use Modules\\PermissionManagement\\Requests\\SyncRolePermissionsRequest;
use Modules\\PermissionManagement\\Resources\\PermissionResource;
use Illuminate\\Http\\JsonResponse;

class PermissionController extends Controller
{
    public function __construct(
        protected PermissionRegistryService $registryService,
        protected PermissionCacheService $cacheService
    ) {}

    public function index(): JsonResponse
    {
        $this->authorize('permissions.view');

        $permissions = $this->registryService->getGroupedByModule();

        return response()->json([
            'success' => true,
            'data' => $permissions
        ]);
    }

    public function syncRole(SyncRolePermissionsRequest $request): JsonResponse
    {
        $this->authorize('permissions.grant');

        $this->registryService->syncToRole(
            $request->validated('role_id'),
            $request->validated('permission_ids')
        );

        $this->cacheService->flush();

        return response()->json([
            'success' => true,
            'message' => 'Role permissions synced successfully.'
        ]);
    }
}`,
      model: `namespace Modules\\PermissionManagement\\Models;

use Illuminate\\Database\\Eloquent\\Model;
use Illuminate\\Database\\Eloquent\\Relations\\BelongsToMany;

class Permission extends Model
{
    protected $fillable = ['name', 'slug', 'module_code', 'description'];

    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class, 'permission_role')->withTimestamps();
    }

    public function scopeForModule($query, string $moduleCode)
    {
        return $query->where('module_code', $moduleCode);
    }
}`,
      service: `namespace Modules\\PermissionManagement\\Services;

use Modules\\PermissionManagement\\Models\\Permission;
use Modules\\PermissionManagement\\Events\\PermissionGrantedToRole;
use Modules\\PermissionManagement\\Events\\PermissionRevoked;
use Modules\\PermissionManagement\\Events\\PermissionCacheFlushed;
use Illuminate\\Support\\Facades\\Cache;
use Illuminate\\Support\\Facades\\DB;

class PermissionRegistryService
{
    public function getGroupedByModule(): array
    {
        return Cache::tags(['permissions'])->remember('permissions:grouped', 3600, function () {
            return Permission::query()
                ->orderBy('module_code')
                ->orderBy('name')
                ->get()
                ->groupBy('module_code')
                ->map(fn($perms) => $perms->map(fn($p) => [
                    'id' => $p->id,
                    'name' => $p->name,
                    'slug' => $p->slug,
                    'description' => $p->description,
                ])->toArray())
                ->toArray();
        });
    }

    public function syncToRole(int $roleId, array $permissionIds): void
    {
        DB::transaction(function () use ($roleId, $permissionIds) {
            $role = Role::findOrFail($roleId);
            $role->permissions()->sync($permissionIds);

            foreach ($permissionIds as $permId) {
                event(new PermissionGrantedToRole($roleId, $permId));
            }
        });
    }
}

class PermissionCacheService
{
    public function flush(): void
    {
        Cache::tags(['permissions'])->flush();
        event(new PermissionCacheFlushed());
    }

    public function getForUser(int $userId): array
    {
        $cacheKey = "user_permissions:{$userId}";
        return Cache::tags(['user_permissions'])->remember($cacheKey, 1800, function () use ($userId) {
            return DB::table('permission_role')
                ->join('roles', 'roles.id', '=', 'permission_role.role_id')
                ->join('role_user', 'role_user.role_id', '=', 'roles.id')
                ->join('permissions', 'permissions.id', '=', 'permission_role.permission_id')
                ->where('role_user.user_id', $userId)
                ->pluck('permissions.slug')
                ->toArray();
        });
    }
}`,
      formRequest: `namespace Modules\\PermissionManagement\\Requests;

use Illuminate\\Foundation\\Http\\FormRequest;

class SyncRolePermissionsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('permissions.grant') ?? false;
    }

    public function rules(): array
    {
        return [
            'role_id' => ['required', 'integer', 'exists:roles,id'],
            'permission_ids' => ['required', 'array'],
            'permission_ids.*' => ['integer', 'exists:permissions,id'],
        ];
    }
}`,
      migration: `Schema::create('permissions', function (Blueprint $table) {
    $table->id();
    $table->string('name', 64)->unique();
    $table->string('slug', 64)->unique();
    $table->string('module_code', 32)->index();
    $table->string('description')->nullable();
    $table->timestamps();
});

Schema::create('permission_role', function (Blueprint $table) {
    $table->foreignId('permission_id')->constrained('permissions')->cascadeOnDelete();
    $table->foreignId('role_id')->constrained('roles')->cascadeOnDelete();
    $table->primary(['permission_id', 'role_id']);
    $table->timestamps();
});`,
      policy: `namespace Modules\\PermissionManagement\\Policies;

use Modules\\IdentityManagement\\Models\\User;

class PermissionPolicy
{
    public function view(User $user): bool
    {
        return $user->hasPermissionTo('permissions.view');
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('permissions.create');
    }

    public function grant(User $user): bool
    {
        return $user->hasPermissionTo('permissions.grant');
    }
}`,
      reactComponent: `import React, { useState, useEffect } from 'react';
import { usePermissions } from '../../hooks/usePermissions';
import { PermissionGrid } from './PermissionGrid';
import { SyncPermissionsModal } from './SyncPermissionsModal';

export function PermissionManagement() {
  const [permissions, setPermissions] = useState({});
  const [loading, setLoading] = useState(true);
  const [showSyncModal, setShowSyncModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const { fetchPermissions, syncPermissions } = usePermissions();

  useEffect(() => {
    const loginAsync = async () => {
      const res = await fetch('http://localhost:5000/api/login');
      console.log('Login response:', res);
    };
    loginAsync();
  }, []);

  useEffect(() => {
    loadPermissions();
  }, []);

  const loadPermissions = async () => {
    setLoading(true);
    const data = await fetchPermissions();
    setPermissions(data);
    setLoading(false);
  };

  return (
    <div className="permission-management">
      <header className="module-header">
        <h1>Permission Management</h1>
        <button onClick={() => setShowSyncModal(true)} className="btn-primary">
          Sync Role Permissions
        </button>
      </header>
      {loading ? (
        <div className="skeleton-loader" />
      ) : (
        <PermissionGrid permissions={permissions} />
      )}
      {showSyncModal && (
        <SyncPermissionsModal
          onClose={() => setShowSyncModal(false)}
          onSynced={loadPermissions}
        />
      )}
    </div>
  );
}`,
      reactHook: `import { useState, useCallback } from 'react';

export function usePermissions() {
  const [permissions, setPermissions] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPermissions = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/v1/permissions', {
        headers: { 'Authorization': \`Bearer \${localStorage.getItem('token')}\` },
      });
      const data = await response.json();
      setPermissions(data.data);
      return data.data;
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const syncPermissions = useCallback(async (roleId, permissionIds) => {
    const response = await fetch('/api/v1/permissions/sync-role', {
      method: 'POST',
      headers: {
        'Authorization': \`Bearer \${localStorage.getItem('token')}\`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ role_id: roleId, permission_ids: permissionIds }),
    });
    return response.json();
  }, []);

  return { permissions, loading, error, fetchPermissions, syncPermissions };
}`,
      reactStyles: `.permission-management {
  padding: 24px;
}

.module-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.module-header h1 {
  font-size: 24px;
  font-weight: 600;
  color: #1a1a2e;
}

.btn-primary {
  padding: 8px 16px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}

.btn-primary:hover {
  background: #2563eb;
}

.skeleton-loader {
  height: 400px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 8px;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}`
    },
    sampleRecords: [
      { id: 101, slug: 'identity.view', module: 'Identity Management', description: 'View user identities' },
      { id: 102, slug: 'orders.create', module: 'Order Management', description: 'Create and place customer orders' },
      { id: 103, slug: 'wallets.transfer', module: 'Wallet Management', description: 'Authorize ledger fund transfers' }
    ],
    status: 'Active'
  },
  {
    id: 6,
    code: 'MOD-006',
    name: 'Organization Management',
    slug: 'organization-management',
    category: 'Identity & Access',
    phase: 2,
    iconName: 'Building2',
    purpose: 'Multi-tenant enterprise organizations, corporate hierarchies, and workspace scoping.',
    responsibilities: [
      'Tenant provisioning, slug reservation, and domain verification',
      'Organization subscription quotas and resource allocations',
      'Multi-tenant database schema or scoped query separation'
    ],
    databaseTables: [
      {
        name: 'organizations',
        description: 'Enterprise organization tenants.',
        primaryKey: 'id (BIGINT UNSIGNED)',
        foreignKeys: [],
        columns: [
          { name: 'id', type: 'BIGINT UNSIGNED', nullable: false },
          { name: 'uuid', type: 'CHAR(36)', nullable: false, index: true },
          { name: 'name', type: 'VARCHAR(255)', nullable: false },
          { name: 'slug', type: 'VARCHAR(128)', nullable: false, index: true },
          { name: 'plan_tier', type: 'VARCHAR(32)', nullable: false },
          { name: 'status', type: 'ENUM("active","suspended","trial")', nullable: false }
        ],
        indexes: ['org_uuid_unique', 'org_slug_unique']
      }
    ],
    apiEndpoints: [
      { method: 'GET', path: '/api/v1/organizations', description: 'List organizations', authRequired: true, permission: 'org.view' },
      { method: 'POST', path: '/api/v1/organizations', description: 'Provision new tenant', authRequired: true, permission: 'org.create' }
    ],
    services: ['OrganizationProvisioningService', 'TenantIsolationService'],
    permissions: ['org.view', 'org.create', 'org.update', 'org.delete'],
    events: ['OrganizationProvisioned', 'OrganizationPlanChanged'],
    jobs: ['SetupTenantResourcesJob'],
    dependencies: [1, 4],
    tests: ['OrganizationIsolationTest', 'OrganizationProvisioningTest'],
    codeTemplates: {
      controller: `namespace Modules\\OrganizationManagement\\Controllers;

use App\\Http\\Controllers\\Controller;
use Modules\\OrganizationManagement\\Services\\OrganizationProvisioningService;
use Modules\\OrganizationManagement\\Requests\\CreateOrganizationRequest;
use Modules\\OrganizationManagement\\Resources\\OrganizationResource;
use Illuminate\\Http\\JsonResponse;
use Illuminate\\Http\\Request;

class OrganizationController extends Controller
{
    public function __construct(
        protected OrganizationProvisioningService $orgService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $this->authorize('org.view');

        $organizations = $this->orgService->getPaginated($request->query('per_page', 25));

        return response()->json([
            'success' => true,
            'data' => OrganizationResource::collection($organizations)
        ]);
    }

    public function store(CreateOrganizationRequest $request): JsonResponse
    {
        $organization = $this->orgService->provision($request->validated());

        return response()->json([
            'success' => true,
            'data' => new OrganizationResource($organization)
        ], 201);
    }
}`,
      model: `namespace Modules\\OrganizationManagement\\Models;

use Illuminate\\Database\\Eloquent\\Model;
use Illuminate\\Database\\Eloquent\\SoftDeletes;
use Illuminate\\Database\\Eloquent\\Relations\\HasMany;

class Organization extends Model
{
    use SoftDeletes;

    protected $fillable = ['uuid', 'name', 'slug', 'plan_tier', 'status'];

    protected $casts = [
        'status' => 'string',
    ];

    public function teams(): HasMany
    {
        return $this->hasMany(Team::class);
    }

    public function users(): HasMany
    {
        return $this->hasMany(OrganizationUser::class);
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }
}`,
      service: `namespace Modules\\OrganizationManagement\\Services;

use Modules\\OrganizationManagement\\Models\\Organization;
use Modules\\OrganizationManagement\\Events\\OrganizationProvisioned;
use Modules\\OrganizationManagement\\Events\\OrganizationPlanChanged;
use Illuminate\\Support\\Facades\\DB;
use Illuminate\\Support\\Str;

class OrganizationProvisioningService
{
    public function getPaginated(int $perPage = 25)
    {
        return Organization::with('teams')->orderBy('name')->paginate($perPage);
    }

    public function provision(array $attributes): Organization
    {
        return DB::transaction(function () use ($attributes) {
            $organization = Organization::create([
                'uuid' => (string) Str::uuid(),
                'name' => $attributes['name'],
                'slug' => $attributes['slug'],
                'plan_tier' => $attributes['plan_tier'] ?? 'free',
                'status' => 'active',
            ]);

            event(new OrganizationProvisioned($organization));

            return $organization;
        });
    }

    public function changePlan(Organization $organization, string $newPlan): Organization
    {
        $organization->update(['plan_tier' => $newPlan]);
        event(new OrganizationPlanChanged($organization, $newPlan));
        return $organization;
    }
}

class TenantIsolationService
{
    public function getScopeForUser(int $userId): int
    {
        return DB::table('organization_user')
            ->where('user_id', $userId)
            ->value('organization_id') ?? 0;
    }
}`,
      formRequest: `namespace Modules\\OrganizationManagement\\Requests;

use Illuminate\\Foundation\\Http\\FormRequest;

class CreateOrganizationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('org.create') ?? false;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:128', 'unique:organizations,slug'],
            'plan_tier' => ['nullable', 'string', 'max:32'],
        ];
    }
}`,
      migration: `Schema::create('organizations', function (Blueprint $table) {
    $table->id();
    $table->uuid('uuid')->unique();
    $table->string('name');
    $table->string('slug', 128)->unique();
    $table->string('plan_tier', 32)->default('free');
    $table->enum('status', ['active', 'suspended', 'trial'])->default('active');
    $table->timestamps();
    $table->softDeletes();
});`,
      policy: `namespace Modules\\OrganizationManagement\\Policies;

use Modules\\IdentityManagement\\Models\\User;

class OrganizationPolicy
{
    public function view(User $user): bool
    {
        return $user->hasPermissionTo('org.view');
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('org.create');
    }

    public function update(User $user): bool
    {
        return $user->hasPermissionTo('org.update');
    }

    public function delete(User $user): bool
    {
        return $user->hasPermissionTo('org.delete');
    }
}`,
      reactComponent: `import React, { useState, useEffect } from 'react';
import { useOrganizations } from '../../hooks/useOrganizations';
import { OrgList } from './OrgList';
import { CreateOrgForm } from './CreateOrgForm';

export function OrganizationManagement() {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { fetchOrganizations, createOrganization } = useOrganizations();

  useEffect(() => {
    const loginAsync = async () => {
      const res = await fetch('http://localhost:5000/api/login');
      console.log('Login response:', res);
    };
    loginAsync();
  }, []);

  useEffect(() => {
    loadOrganizations();
  }, []);

  const loadOrganizations = async () => {
    setLoading(true);
    const data = await fetchOrganizations();
    setOrganizations(data);
    setLoading(false);
  };

  const handleCreated = () => {
    setShowCreateForm(false);
    loadOrganizations();
  };

  return (
    <div className="organization-management">
      <header className="module-header">
        <h1>Organization Management</h1>
        <button onClick={() => setShowCreateForm(true)} className="btn-primary">
          Create Organization
        </button>
      </header>
      {loading ? (
        <div className="skeleton-loader" />
      ) : (
        <OrgList organizations={organizations} />
      )}
      {showCreateForm && (
        <CreateOrgForm
          onClose={() => setShowCreateForm(false)}
          onCreated={handleCreated}
        />
      )}
    </div>
  );
}`,
      reactHook: `import { useState, useCallback } from 'react';

export function useOrganizations() {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchOrganizations = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/v1/organizations', {
        headers: { 'Authorization': \`Bearer \${localStorage.getItem('token')}\` },
      });
      const data = await response.json();
      setOrganizations(data.data);
      return data.data;
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createOrganization = useCallback(async (orgData) => {
    const response = await fetch('/api/v1/organizations', {
      method: 'POST',
      headers: {
        'Authorization': \`Bearer \${localStorage.getItem('token')}\`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orgData),
    });
    return response.json();
  }, []);

  return { organizations, loading, error, fetchOrganizations, createOrganization };
}`,
      reactStyles: `.organization-management {
  padding: 24px;
}

.module-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.module-header h1 {
  font-size: 24px;
  font-weight: 600;
  color: #1a1a2e;
}

.btn-primary {
  padding: 8px 16px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}

.btn-primary:hover {
  background: #2563eb;
}

.skeleton-loader {
  height: 400px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 8px;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}`
    },
    sampleRecords: [
      { id: 1, name: 'Acme Global Corp', slug: 'acme-global', plan_tier: 'Enterprise Platinum', status: 'active', members_count: 142 },
      { id: 2, name: 'Starlight Media Labs', slug: 'starlight-media', plan_tier: 'Growth Tier', status: 'active', members_count: 38 }
    ],
    status: 'Active'
  },
  {
    id: 7,
    code: 'MOD-007',
    name: 'Team Management',
    slug: 'team-management',
    category: 'Identity & Access',
    phase: 2,
    iconName: 'UserGroup',
    purpose: 'Sub-organizational team structuring, member invitations, and departmental grouping.',
    responsibilities: [
      'Manage departmental rosters and project working groups',
      'Send and validate team invitations with expiration tokens',
      'Team-level access segregation for documents, projects, and assets'
    ],
    databaseTables: [
      {
        name: 'teams',
        description: 'Teams belonging to organizations.',
        primaryKey: 'id (BIGINT UNSIGNED)',
        foreignKeys: [{ column: 'organization_id', references: 'id', table: 'organizations' }],
        columns: [
          { name: 'id', type: 'BIGINT UNSIGNED', nullable: false },
          { name: 'organization_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
          { name: 'name', type: 'VARCHAR(128)', nullable: false },
          { name: 'leader_id', type: 'BIGINT UNSIGNED', nullable: true }
        ],
        indexes: ['idx_teams_org']
      }
    ],
    apiEndpoints: [
      { method: 'GET', path: '/api/v1/teams', description: 'List teams within current tenant', authRequired: true },
      { method: 'POST', path: '/api/v1/teams', description: 'Create team', authRequired: true }
    ],
    services: ['TeamRosterService', 'TeamInvitationService'],
    permissions: ['teams.view', 'teams.create', 'teams.invite'],
    events: ['TeamCreated', 'MemberAddedToTeam'],
    jobs: ['SendTeamInviteEmailJob'],
    dependencies: [1, 6],
    tests: ['TeamMembershipTest'],
    codeTemplates: {
      controller: `namespace Modules\\TeamManagement\\Controllers;

use App\\Http\\Controllers\\Controller;
use Modules\\TeamManagement\\Services\\TeamRosterService;
use Modules\\TeamManagement\\Services\\TeamInvitationService;
use Modules\\TeamManagement\\Requests\\CreateTeamRequest;
use Modules\\TeamManagement\\Resources\\TeamResource;
use Illuminate\\Http\\JsonResponse;
use Illuminate\\Http\\Request;

class TeamController extends Controller
{
    public function __construct(
        protected TeamRosterService $rosterService,
        protected TeamInvitationService $invitationService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $this->authorize('teams.view');

        $teams = $this->rosterService->getPaginated($request->user()->currentOrganization, $request->query('per_page', 25));

        return response()->json([
            'success' => true,
            'data' => TeamResource::collection($teams)
        ]);
    }

    public function store(CreateTeamRequest $request): JsonResponse
    {
        $team = $this->rosterService->createTeam(
            $request->user()->currentOrganization,
            $request->validated()
        );

        return response()->json([
            'success' => true,
            'data' => new TeamResource($team)
        ], 201);
    }
}`,
      model: `namespace Modules\\TeamManagement\\Models;

use Illuminate\\Database\\Eloquent\\Model;
use Illuminate\\Database\\Eloquent\\Relations\\BelongsTo;
use Illuminate\\Database\\Eloquent\\Relations\\BelongsToMany;
use Modules\\IdentityManagement\\Models\\User;

class Team extends Model
{
    protected $fillable = ['organization_id', 'name', 'leader_id'];

    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    public function leader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'leader_id');
    }

    public function members(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'team_members')->withTimestamps();
    }
}`,
      service: `namespace Modules\\TeamManagement\\Services;

use Modules\\TeamManagement\\Models\\Team;
use Modules\\OrganizationManagement\\Models\\Organization;
use Modules\\TeamManagement\\Events\\TeamCreated;
use Modules\\TeamManagement\\Events\\MemberAddedToTeam;
use Illuminate\\Support\\Facades\\DB;

class TeamRosterService
{
    public function getPaginated(Organization $organization, int $perPage = 25)
    {
        return Team::where('organization_id', $organization->id)
            ->with(['leader', 'members'])
            ->orderBy('name')
            ->paginate($perPage);
    }

    public function createTeam(Organization $organization, array $attributes): Team
    {
        return DB::transaction(function () use ($organization, $attributes) {
            $team = Team::create([
                'organization_id' => $organization->id,
                'name' => $attributes['name'],
                'leader_id' => $attributes['leader_id'] ?? null,
            ]);

            event(new TeamCreated($team));

            return $team;
        });
    }

    public function addMember(Team $team, int $userId): void
    {
        $team->members()->syncWithoutDetaching([$userId]);
        event(new MemberAddedToTeam($team, $userId));
    }

    public function removeMember(Team $team, int $userId): void
    {
        $team->members()->detach($userId);
    }
}

class TeamInvitationService
{
    public function sendInvite(Team $team, string $email, int $invitedBy): void
    {
        // Generate token, store invitation, dispatch email job
    }
}`,
      formRequest: `namespace Modules\\TeamManagement\\Requests;

use Illuminate\\Foundation\\Http\\FormRequest;

class CreateTeamRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('teams.create') ?? false;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:128'],
            'leader_id' => ['nullable', 'integer', 'exists:users,id'],
        ];
    }
}`,
      migration: `Schema::create('teams', function (Blueprint $table) {
    $table->id();
    $table->foreignId('organization_id')->constrained('organizations')->cascadeOnDelete();
    $table->string('name', 128);
    $table->foreignId('leader_id')->nullable()->constrained('users')->nullOnDelete();
    $table->timestamps();
    $table->index('organization_id');
});

Schema::create('team_members', function (Blueprint $table) {
    $table->foreignId('team_id')->constrained('teams')->cascadeOnDelete();
    $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
    $table->primary(['team_id', 'user_id']);
    $table->timestamps();
});`,
      policy: `namespace Modules\\TeamManagement\\Policies;

use Modules\\IdentityManagement\\Models\\User;

class TeamPolicy
{
    public function view(User $user): bool
    {
        return $user->hasPermissionTo('teams.view');
    }

    public function create(User $user): bool
    {
        return $user->hasPermissionTo('teams.create');
    }

    public function invite(User $user): bool
    {
        return $user->hasPermissionTo('teams.invite');
    }
}`,
      reactComponent: `import React, { useState, useEffect } from 'react';
import { useTeams } from '../../hooks/useTeams';
import { TeamRoster } from './TeamRoster';
import { InviteMemberModal } from './InviteMemberModal';
import { CreateTeamModal } from './CreateTeamModal';

export function TeamManagement() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const { fetchTeams, inviteMember } = useTeams();

  useEffect(() => {
    const loginAsync = async () => {
      const res = await fetch('http://localhost:5000/api/login');
      console.log('Login response:', res);
    };
    loginAsync();
  }, []);

  useEffect(() => {
    loadTeams();
  }, []);

  const loadTeams = async () => {
    setLoading(true);
    const data = await fetchTeams();
    setTeams(data);
    setLoading(false);
  };

  const handleInvite = (team) => {
    setSelectedTeam(team);
    setShowInviteModal(true);
  };

  return (
    <div className="team-management">
      <header className="module-header">
        <h1>Team Management</h1>
        <button onClick={() => setShowCreateModal(true)} className="btn-primary">
          Create Team
        </button>
      </header>
      {loading ? (
        <div className="skeleton-loader" />
      ) : (
        <TeamRoster teams={teams} onInvite={handleInvite} />
      )}
      {showInviteModal && (
        <InviteMemberModal
          team={selectedTeam}
          onClose={() => setShowInviteModal(false)}
          onInvited={loadTeams}
        />
      )}
      {showCreateModal && (
        <CreateTeamModal
          onClose={() => setShowCreateModal(false)}
          onCreated={loadTeams}
        />
      )}
    </div>
  );
}`,
      reactHook: `import { useState, useCallback } from 'react';

export function useTeams() {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTeams = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/v1/teams', {
        headers: { 'Authorization': \`Bearer \${localStorage.getItem('token')}\` },
      });
      const data = await response.json();
      setTeams(data.data);
      return data.data;
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createTeam = useCallback(async (teamData) => {
    const response = await fetch('/api/v1/teams', {
      method: 'POST',
      headers: {
        'Authorization': \`Bearer \${localStorage.getItem('token')}\`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(teamData),
    });
    return response.json();
  }, []);

  const inviteMember = useCallback(async (teamId, email) => {
    const response = await fetch(\`/api/v1/teams/\${teamId}/invite\`, {
      method: 'POST',
      headers: {
        'Authorization': \`Bearer \${localStorage.getItem('token')}\`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    return response.json();
  }, []);

  return { teams, loading, error, fetchTeams, createTeam, inviteMember };
}`,
      reactStyles: `.team-management {
  padding: 24px;
}

.module-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.module-header h1 {
  font-size: 24px;
  font-weight: 600;
  color: #1a1a2e;
}

.btn-primary {
  padding: 8px 16px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}

.btn-primary:hover {
  background: #2563eb;
}

.skeleton-loader {
  height: 400px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 8px;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}`
    },
    sampleRecords: [
      { id: 201, organization: 'Acme Global Corp', name: 'Cloud Architecture & SRE', leader: 'Sarah Connor', members: 12 },
      { id: 202, organization: 'Acme Global Corp', name: 'Product Engineering', leader: 'Alex Chen', members: 24 }
    ],
    status: 'Active'
  },
  {
    id: 8,
    code: 'MOD-008',
    name: 'Profile Management',
    slug: 'profile-management',
    category: 'Identity & Access',
    phase: 2,
    iconName: 'BadgeCheck',
    purpose: 'User profile metadata, avatars, regional locales, timezones, and public bio displays.',
    responsibilities: [
      'Maintain user display profiles and social links',
      'Store localization preferences (language, currency, timezone)',
      'Upload and resize user profile avatars'
    ],
    databaseTables: [
      {
        name: 'user_profiles',
        description: 'Detailed user profile data.',
        primaryKey: 'id (BIGINT UNSIGNED)',
        foreignKeys: [{ column: 'user_id', references: 'id', table: 'users' }],
        columns: [
          { name: 'id', type: 'BIGINT UNSIGNED', nullable: false },
          { name: 'user_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
          { name: 'display_name', type: 'VARCHAR(128)', nullable: false },
          { name: 'avatar_url', type: 'VARCHAR(512)', nullable: true },
          { name: 'bio', type: 'TEXT', nullable: true },
          { name: 'timezone', type: 'VARCHAR(64)', nullable: false },
          { name: 'locale', type: 'VARCHAR(16)', nullable: false }
        ],
        indexes: ['user_profiles_user_unique']
      }
    ],
    apiEndpoints: [
      { method: 'GET', path: '/api/v1/profiles/{username}', description: 'Public profile fetch', authRequired: false },
      { method: 'PATCH', path: '/api/v1/profiles/me', description: 'Update current profile', authRequired: true }
    ],
    services: ['UserProfileService', 'AvatarStorageService'],
    permissions: ['profile.view', 'profile.edit-own', 'profile.edit-any'],
    events: ['ProfileUpdated', 'AvatarChanged'],
    jobs: ['ResizeAvatarImagesJob'],
    dependencies: [1],
    tests: ['ProfileUpdateTest'],
    codeTemplates: {
      controller: `namespace Modules\\ProfileManagement\\Controllers;

use App\\Http\\Controllers\\Controller;
use Modules\\ProfileManagement\\Services\\UserProfileService;
use Modules\\ProfileManagement\\Requests\\UpdateProfileRequest;
use Modules\\ProfileManagement\\Resources\\UserProfileResource;
use Illuminate\\Http\\JsonResponse;
use Illuminate\\Http\\Request;

class ProfileController extends Controller
{
    public function __construct(
        protected UserProfileService $profileService
    ) {}

    public function show(string $username): JsonResponse
    {
        $profile = $this->profileService->getByUsername($username);

        return response()->json([
            'success' => true,
            'data' => new UserProfileResource($profile)
        ]);
    }

    public function update(UpdateProfileRequest $request): JsonResponse
    {
        $profile = $this->profileService->updateProfile(
            $request->user(),
            $request->validated()
        );

        return response()->json([
            'success' => true,
            'data' => new UserProfileResource($profile)
        ]);
    }
}`,
      model: `namespace Modules\\ProfileManagement\\Models;

use Illuminate\\Database\\Eloquent\\Model;
use Illuminate\\Database\\Eloquent\\Relations\\BelongsTo;
use Modules\\IdentityManagement\\Models\\User;

class UserProfile extends Model
{
    protected $table = 'user_profiles';

    protected $fillable = ['user_id', 'display_name', 'avatar_url', 'bio', 'timezone', 'locale'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}`,
      service: `namespace Modules\\ProfileManagement\\Services;

use Modules\\ProfileManagement\\Models\\UserProfile;
use Modules\\IdentityManagement\\Models\\User;
use Modules\\ProfileManagement\\Events\\ProfileUpdated;
use Modules\\ProfileManagement\\Events\\AvatarChanged;
use Illuminate\\Support\\Facades\\DB;

class UserProfileService
{
    public function getByUsername(string $username): UserProfile
    {
        return UserProfile::where('display_name', $username)->firstOrFail();
    }

    public function getOrCreate(User $user): UserProfile
    {
        return UserProfile::firstOrCreate(
            ['user_id' => $user->id],
            [
                'display_name' => $user->email,
                'timezone' => 'UTC',
                'locale' => 'en',
            ]
        );
    }

    public function updateProfile(User $user, array $attributes): UserProfile
    {
        return DB::transaction(function () use ($user, $attributes) {
            $profile = $this->getOrCreate($user);
            $oldAvatar = $profile->avatar_url;

            $profile->update($attributes);

            if (isset($attributes['avatar_url']) && $attributes['avatar_url'] !== $oldAvatar) {
                event(new AvatarChanged($profile));
            }

            event(new ProfileUpdated($profile));

            return $profile;
        });
    }
}

class AvatarStorageService
{
    public function store(User $user, $file): string
    {
        $path = $file->store('avatars/' . $user->id, 'public');
        return $path;
    }
}`,
      formRequest: `namespace Modules\\ProfileManagement\\Requests;

use Illuminate\\Foundation\\Http\\FormRequest;

class UpdateProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'display_name' => ['sometimes', 'string', 'max:128', 'unique:user_profiles,display_name,' . $this->user()?->id . ',user_id'],
            'avatar_url' => ['nullable', 'string', 'max:512'],
            'bio' => ['nullable', 'string', 'max:1000'],
            'timezone' => ['required', 'string', 'max:64'],
            'locale' => ['required', 'string', 'max:16'],
        ];
    }
}`,
      migration: `Schema::create('user_profiles', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
    $table->string('display_name', 128);
    $table->string('avatar_url', 512)->nullable();
    $table->text('bio')->nullable();
    $table->string('timezone', 64)->default('UTC');
    $table->string('locale', 16)->default('en');
    $table->timestamps();
    $table->unique('user_id');
});`,
      policy: `namespace Modules\\ProfileManagement\\Policies;

use Modules\\IdentityManagement\\Models\\User;

class ProfilePolicy
{
    public function view(User $user, User $targetUser): bool
    {
        if ($user->id === $targetUser->id) {
            return true;
        }
        return $user->hasPermissionTo('profile.view');
    }

    public function editOwn(User $user): bool
    {
        return $user->hasPermissionTo('profile.edit-own');
    }

    public function editAny(User $user): bool
    {
        return $user->hasPermissionTo('profile.edit-any');
    }
}`,
      reactComponent: `import React, { useState, useEffect } from 'react';
import { useProfile } from '../../hooks/useProfile';
import { ProfileForm } from './ProfileForm';
import { AvatarUpload } from './AvatarUpload';

export function ProfileManagement() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const { fetchProfile, updateProfile, uploadAvatar } = useProfile();

  useEffect(() => {
    const loginAsync = async () => {
      const res = await fetch('http://localhost:5000/api/login');
      console.log('Login response:', res);
    };
    loginAsync();
  }, []);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    const data = await fetchProfile();
    setProfile(data);
    setLoading(false);
  };

  const handleUpdate = async (updates) => {
    await updateProfile(updates);
    loadProfile();
  };

  const handleAvatarUpload = async (file) => {
    await uploadAvatar(file);
    loadProfile();
  };

  return (
    <div className="profile-management">
      <header className="module-header">
        <h1>Profile Management</h1>
      </header>
      {loading ? (
        <div className="skeleton-loader" />
      ) : (
        <>
          <AvatarUpload
            currentAvatar={profile?.avatar_url}
            onUpload={handleAvatarUpload}
          />
          <ProfileForm profile={profile} onUpdate={handleUpdate} />
        </>
      )}
    </div>
  );
}`,
      reactHook: `import { useState, useCallback } from 'react';

export function useProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/v1/profiles/me', {
        headers: { 'Authorization': \`Bearer \${localStorage.getItem('token')}\` },
      });
      const data = await response.json();
      setProfile(data.data);
      return data.data;
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (updates) => {
    const response = await fetch('/api/v1/profiles/me', {
      method: 'PATCH',
      headers: {
        'Authorization': \`Bearer \${localStorage.getItem('token')}\`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });
    return response.json();
  }, []);

  const uploadAvatar = useCallback(async (file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    const response = await fetch('/api/v1/profiles/me/avatar', {
      method: 'POST',
      headers: { 'Authorization': \`Bearer \${localStorage.getItem('token')}\` },
      body: formData,
    });
    return response.json();
  }, []);

  return { profile, loading, error, fetchProfile, updateProfile, uploadAvatar };
}`,
      reactStyles: `.profile-management {
  padding: 24px;
  max-width: 600px;
}

.module-header {
  margin-bottom: 24px;
}

.module-header h1 {
  font-size: 24px;
  font-weight: 600;
  color: #1a1a2e;
}

.skeleton-loader {
  height: 400px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 8px;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}`
    },
    sampleRecords: [
      { user_id: 101, display_name: 'Alex Chen', timezone: 'UTC-07:00 America/Los_Angeles', locale: 'en-US', avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb' },
      { user_id: 102, display_name: 'Sarah Connor', timezone: 'UTC+00:00 Europe/London', locale: 'en-GB', avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d' }
    ],
    status: 'Active'
  },
  {
    id: 9,
    code: 'MOD-009',
    name: 'Security Management',
    slug: 'security-management',
    category: 'Identity & Access',
    phase: 2,
    iconName: 'ShieldAlert',
    purpose: 'Platform security auditing, active session revocation, IP address filtering, and credential health.',
    responsibilities: [
      'Log security-sensitive events (password changes, 2FA alterations)',
      'Detect anomalous login locations and IP velocity spikes',
      'Provide one-click "Log out of all devices" session purging'
    ],
    databaseTables: [
      {
        name: 'security_events',
        description: 'Tamper-resistant security incident log.',
        primaryKey: 'id (BIGINT UNSIGNED)',
        foreignKeys: [{ column: 'user_id', references: 'id', table: 'users' }],
        columns: [
          { name: 'id', type: 'BIGINT UNSIGNED', nullable: false },
          { name: 'user_id', type: 'BIGINT UNSIGNED', nullable: true, index: true },
          { name: 'event_type', type: 'VARCHAR(64)', nullable: false, index: true },
          { name: 'ip_address', type: 'VARCHAR(45)', nullable: false },
          { name: 'severity', type: 'ENUM("low","medium","high","critical")', nullable: false },
          { name: 'payload', type: 'JSON', nullable: true },
          { name: 'created_at', type: 'TIMESTAMP', nullable: false }
        ],
        indexes: ['idx_sec_events_type_time']
      }
    ],
    apiEndpoints: [
      { method: 'GET', path: '/api/v1/security/sessions', description: 'List active sessions', authRequired: true },
      { method: 'DELETE', path: '/api/v1/security/sessions/{id}', description: 'Kill remote session', authRequired: true },
      { method: 'GET', path: '/api/v1/security/events', description: 'Security audit stream', authRequired: true, permission: 'security.audit' }
    ],
    services: ['SecurityMonitoringService', 'SessionRevocationService'],
    permissions: ['security.audit', 'security.block-ip', 'security.terminate-sessions'],
    events: ['SuspiciousActivityDetected', 'SessionTerminatedRemotely'],
    jobs: ['AnalyzeSecurityThreatsJob'],
    dependencies: [1, 2],
    tests: ['SecurityAuditTest', 'SessionRevocationTest'],
    codeTemplates: {
      controller: `namespace Modules\\SecurityManagement\\Controllers;

use App\\Http\\Controllers\\Controller;
use Modules\\SecurityManagement\\Services\\SecurityMonitoringService;
use Modules\\SecurityManagement\\Services\\SessionRevocationService;
use Modules\\SecurityManagement\\Requests\\SecurityFilterRequest;
use Modules\\SecurityManagement\\Resources\\SecurityEventResource;
use Illuminate\\Http\\JsonResponse;
use Illuminate\\Http\\Request;

class SecurityController extends Controller
{
    public function __construct(
        protected SecurityMonitoringService $monitoringService,
        protected SessionRevocationService $sessionService
    ) {}

    public function sessions(Request $request): JsonResponse
    {
        $sessions = $this->sessionService->getActiveSessions($request->user());

        return response()->json([
            'success' => true,
            'data' => $sessions
        ]);
    }

    public function destroySession(Request $request, int $id): JsonResponse
    {
        $this->sessionService->revokeSession($request->user(), $id);

        return response()->json([
            'success' => true,
            'message' => 'Session terminated successfully.'
        ]);
    }

    public function events(SecurityFilterRequest $request): JsonResponse
    {
        $this->authorize('security.audit');

        $events = $this->monitoringService->getFilteredEvents($request->validated());

        return response()->json([
            'success' => true,
            'data' => SecurityEventResource::collection($events)
        ]);
    }
}`,
      model: `namespace Modules\\SecurityManagement\\Models;

use Illuminate\\Database\\Eloquent\\Model;
use Illuminate\\Database\\Eloquent\\Relations\\BelongsTo;
use Modules\\IdentityManagement\\Models\\User;

class SecurityEvent extends Model
{
    protected $table = 'security_events';

    protected $fillable = ['user_id', 'event_type', 'ip_address', 'severity', 'payload'];

    protected $casts = [
        'payload' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function scopeForType($query, string $type)
    {
        return $query->where('event_type', $type);
    }

    public function scopeHighSeverity($query)
    {
        return $query->whereIn('severity', ['high', 'critical']);
    }
}`,
      service: `namespace Modules\\SecurityManagement\\Services;

use Modules\\SecurityManagement\\Models\\SecurityEvent;
use Modules\\SecurityManagement\\Events\\SuspiciousActivityDetected;
use Modules\\SecurityManagement\\Events\\SessionTerminatedRemotely;
use Illuminate\\Support\\Facades\\DB;
use Laravel\\Sanctum\\PersonalAccessToken;

class SecurityMonitoringService
{
    public function logEvent(array $attributes): SecurityEvent
    {
        $event = SecurityEvent::create($attributes);

        if (in_array($event->severity, ['high', 'critical'])) {
            event(new SuspiciousActivityDetected($event));
        }

        return $event;
    }

    public function getFilteredEvents(array $filters)
    {
        $query = SecurityEvent::with('user');

        if (isset($filters['event_type'])) {
            $query->forType($filters['event_type']);
        }

        if (isset($filters['severity'])) {
            $query->where('severity', $filters['severity']);
        }

        if (isset($filters['user_id'])) {
            $query->where('user_id', $filters['user_id']);
        }

        return $query->orderBy('created_at', 'desc')->paginate($filters['per_page'] ?? 50);
    }

    public function detectAnomalies(string $email, string $ip): void
    {
        $recentAttempts = SecurityEvent::where('event_type', 'FAILED_LOGIN')
            ->where('ip_address', $ip)
            ->where('created_at', '>=', now()->subMinutes(15))
            ->count();

        if ($recentAttempts >= 5) {
            $this->logEvent([
                'event_type' => 'BRUTE_FORCE_DETECTED',
                'ip_address' => $ip,
                'severity' => 'critical',
                'payload' => ['email' => $email, 'attempts' => $recentAttempts],
            ]);
        }
    }
}

class SessionRevocationService
{
    public function getActiveSessions($user): array
    {
        return PersonalAccessToken::where('tokenable_id', $user->id)
            ->where('last_used_at', '>=', now()->subHours(24))
            ->get()
            ->map(fn($token) => [
                'id' => $token->id,
                'name' => $token->name,
                'last_used_at' => $token->last_used_at,
                'expires_at' => $token->expires_at,
            ])
            ->toArray();
    }

    public function revokeSession($user, int $tokenId): void
    {
        $token = PersonalAccessToken::where('tokenable_id', $user->id)
            ->where('id', $tokenId)
            ->firstOrFail();

        $token->delete();
        event(new SessionTerminatedRemotely($user, $tokenId));
    }

    public function revokeAllSessions($user): void
    {
        PersonalAccessToken::where('tokenable_id', $user->id)->delete();
    }
}`,
      formRequest: `namespace Modules\\SecurityManagement\\Requests;

use Illuminate\\Foundation\\Http\\FormRequest;

class SecurityFilterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('security.audit') ?? false;
    }

    public function rules(): array
    {
        return [
            'event_type' => ['nullable', 'string', 'max:64'],
            'severity' => ['nullable', 'string', 'in:low,medium,high,critical'],
            'user_id' => ['nullable', 'integer', 'exists:users,id'],
            'per_page' => ['nullable', 'integer', 'min:1', 'max:100'],
        ];
    }
}`,
      migration: `Schema::create('security_events', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
    $table->string('event_type', 64)->index();
    $table->string('ip_address', 45);
    $table->enum('severity', ['low', 'medium', 'high', 'critical']);
    $table->json('payload')->nullable();
    $table->timestamp('created_at');
    $table->index(['event_type', 'created_at']);
});`,
      policy: `namespace Modules\\SecurityManagement\\Policies;

use Modules\\IdentityManagement\\Models\\User;

class SecurityPolicy
{
    public function audit(User $user): bool
    {
        return $user->hasPermissionTo('security.audit');
    }

    public function blockIp(User $user): bool
    {
        return $user->hasPermissionTo('security.block-ip');
    }

    public function terminateSessions(User $user): bool
    {
        return $user->hasPermissionTo('security.terminate-sessions');
    }
}`,
      reactComponent: `import React, { useState, useEffect } from 'react';
import { useSecurity } from '../../hooks/useSecurity';
import { SessionList } from './SessionList';
import { SecurityEventsTable } from './SecurityEventsTable';
import { SeverityBadge } from '../ui/SeverityBadge';

export function SecurityDashboard() {
  const [sessions, setSessions] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const { fetchSessions, terminateSession, fetchEvents } = useSecurity();

  useEffect(() => {
    const loginAsync = async () => {
      const res = await fetch('http://localhost:5000/api/login');
      console.log('Login response:', res);
    };
    loginAsync();
  }, []);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [sessionsData, eventsData] = await Promise.all([
      fetchSessions(),
      fetchEvents(),
    ]);
    setSessions(sessionsData);
    setEvents(eventsData);
    setLoading(false);
  };

  const handleTerminate = async (sessionId) => {
    await terminateSession(sessionId);
    loadData();
  };

  return (
    <div className="security-dashboard">
      <header className="module-header">
        <h1>Security Dashboard</h1>
      </header>
      {loading ? (
        <div className="skeleton-loader" />
      ) : (
        <>
          <section className="sessions-section">
            <h2>Active Sessions</h2>
            <SessionList sessions={sessions} onTerminate={handleTerminate} />
          </section>
          <section className="events-section">
            <h2>Security Events</h2>
            <SecurityEventsTable events={events} />
          </section>
        </>
      )}
    </div>
  );
}`,
      reactHook: `import { useState, useCallback } from 'react';

export function useSecurity() {
  const [sessions, setSessions] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchSessions = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/v1/security/sessions', {
        headers: { 'Authorization': \`Bearer \${localStorage.getItem('token')}\` },
      });
      const data = await response.json();
      setSessions(data.data);
      return data.data;
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const terminateSession = useCallback(async (sessionId) => {
    await fetch(\`/api/v1/security/sessions/\${sessionId}\`, {
      method: 'DELETE',
      headers: { 'Authorization': \`Bearer \${localStorage.getItem('token')}\` },
    });
  }, []);

  const fetchEvents = useCallback(async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await fetch(\`/api/v1/security/events?\${params}\`, {
      headers: { 'Authorization': \`Bearer \${localStorage.getItem('token')}\` },
    });
    const data = await response.json();
    setEvents(data.data);
    return data.data;
  }, []);

  return { sessions, events, loading, error, fetchSessions, terminateSession, fetchEvents };
}`,
      reactStyles: `.security-dashboard {
  padding: 24px;
}

.module-header {
  margin-bottom: 24px;
}

.module-header h1 {
  font-size: 24px;
  font-weight: 600;
  color: #1a1a2e;
}

.sessions-section,
.events-section {
  margin-bottom: 32px;
}

.sessions-section h2,
.events-section h2 {
  font-size: 18px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 16px;
}

.skeleton-loader {
  height: 400px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 8px;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}`
    },
    sampleRecords: [
      { id: 901, event_type: '2FA_ENROLLED', user: 'alex.chen@nexus-enterprise.io', ip: '192.168.1.10', severity: 'low', timestamp: '2026-09-09 10:45:00' },
      { id: 902, event_type: 'FAILED_PASSWORD_BURST', user: 'unknown@external.net', ip: '185.220.101.5', severity: 'high', timestamp: '2026-09-09 11:12:30' }
    ],
    status: 'Active'
  },
  {
    id: 10,
    code: 'MOD-010',
    name: 'Compliance Management',
    slug: 'compliance-management',
    category: 'Identity & Access',
    phase: 2,
    iconName: 'FileCheck',
    purpose: 'Regulatory compliance (GDPR, CCPA, HIPAA, SOC2), consent tracking, and data erasure workflows.',
    responsibilities: [
      'Handle Right-to-be-Forgotten data deletion requests',
      'Orchestrate bulk user data export archives (JSON/ZIP)',
      'Record versioned terms of service and privacy consent agreements'
    ],
    databaseTables: [
      {
        name: 'compliance_records',
        description: 'Audit records for privacy requests and legal consent.',
        primaryKey: 'id (BIGINT UNSIGNED)',
        foreignKeys: [{ column: 'user_id', references: 'id', table: 'users' }],
        columns: [
          { name: 'id', type: 'BIGINT UNSIGNED', nullable: false },
          { name: 'user_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
          { name: 'request_type', type: 'ENUM("export","erasure","rectification")', nullable: false },
          { name: 'status', type: 'ENUM("pending","processing","completed","rejected")', nullable: false },
          { name: 'completed_at', type: 'TIMESTAMP', nullable: true }
        ],
        indexes: ['idx_compliance_user_type']
      }
    ],
    apiEndpoints: [
      { method: 'POST', path: '/api/v1/compliance/export-data', description: 'Request full GDPR data package', authRequired: true },
      { method: 'POST', path: '/api/v1/compliance/erasure-request', description: 'Submit right-to-be-forgotten ticket', authRequired: true }
    ],
    services: ['GdprService', 'DataPortabilityService', 'ConsentTrackerService'],
    permissions: ['compliance.view', 'compliance.process-erasure'],
    events: ['DataExportRequested', 'ErasureRequestApproved'],
    jobs: ['CompileUserDataExportJob', 'ExecuteAnonymizationJob'],
    dependencies: [1, 8],
    tests: ['GdprErasureTest', 'DataExportArchiveTest'],
    codeTemplates: {
      controller: `namespace Modules\\ComplianceManagement\\Controllers;

use App\\Http\\Controllers\\Controller;
use Modules\\ComplianceManagement\\Services\\GdprService;
use Modules\\ComplianceManagement\\Services\\DataPortabilityService;
use Modules\\ComplianceManagement\\Requests\\ExportDataRequest;
use Modules\\ComplianceManagement\\Requests\\ErasureRequest;
use Illuminate\\Http\\JsonResponse;

class ComplianceController extends Controller
{
    public function __construct(
        protected GdprService $gdprService,
        protected DataPortabilityService $portabilityService
    ) {}

    public function exportData(ExportDataRequest $request): JsonResponse
    {
        $record = $this->portabilityService->createExportRequest($request->user());

        return response()->json([
            'success' => true,
            'message' => 'Data export request submitted. You will be notified when ready.',
            'data' => ['record_id' => $record->id, 'status' => $record->status]
        ], 201);
    }

    public function erasureRequest(ErasureRequest $request): JsonResponse
    {
        $record = $this->gdprService->submitErasureRequest($request->user(), $request->validated('reason'));

        return response()->json([
            'success' => true,
            'message' => 'Erasure request submitted for review.',
            'data' => ['record_id' => $record->id, 'status' => $record->status]
        ], 201);
    }
}`,
      model: `namespace Modules\\ComplianceManagement\\Models;

use Illuminate\\Database\\Eloquent\\Model;
use Illuminate\\Database\\Eloquent\\Relations\\BelongsTo;
use Modules\\IdentityManagement\\Models\\User;

class ComplianceRecord extends Model
{
    protected $table = 'compliance_records';

    protected $fillable = ['user_id', 'request_type', 'status', 'completed_at'];

    protected $casts = [
        'completed_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }
}`,
      service: `namespace Modules\\ComplianceManagement\\Services;

use Modules\\ComplianceManagement\\Models\\ComplianceRecord;
use Modules\\ComplianceManagement\\Events\\DataExportRequested;
use Modules\\ComplianceManagement\\Events\\ErasureRequestApproved;
use Modules\\IdentityManagement\\Models\\User;
use Illuminate\\Support\\Facades\\DB;

class GdprService
{
    public function submitErasureRequest(User $user, ?string $reason): ComplianceRecord
    {
        return DB::transaction(function () use ($user, $reason) {
            $record = ComplianceRecord::create([
                'user_id' => $user->id,
                'request_type' => 'erasure',
                'status' => 'pending',
            ]);

            event(new ErasureRequestApproved($record));

            return $record;
        });
    }

    public function approveErasure(ComplianceRecord $record): void
    {
        $record->update(['status' => 'processing']);
        // Dispatch ExecuteAnonymizationJob
    }

    public function completeErasure(ComplianceRecord $record): void
    {
        $record->update([
            'status' => 'completed',
            'completed_at' => now(),
        ]);
    }
}

class DataPortabilityService
{
    public function createExportRequest(User $user): ComplianceRecord
    {
        return DB::transaction(function () use ($user) {
            $record = ComplianceRecord::create([
                'user_id' => $user->id,
                'request_type' => 'export',
                'status' => 'pending',
            ]);

            event(new DataExportRequested($record));

            return $record;
        });
    }

    public function generateArchive(User $user): string
    {
        $data = [
            'user' => $user->toArray(),
            'profile' => $user->profile?->toArray(),
            'exported_at' => now()->toISOString(),
        ];

        return json_encode($data);
    }
}`,
      formRequest: `namespace Modules\\ComplianceManagement\\Requests;

use Illuminate\\Foundation\\Http\\FormRequest;

class ExportDataRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [];
    }
}

namespace Modules\\ComplianceManagement\\Requests;

use Illuminate\\Foundation\\Http\\FormRequest;

class ErasureRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'reason' => ['nullable', 'string', 'max:1000'],
        ];
    }
}`,
      migration: `Schema::create('compliance_records', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
    $table->enum('request_type', ['export', 'erasure', 'rectification']);
    $table->enum('status', ['pending', 'processing', 'completed', 'rejected'])->default('pending');
    $table->timestamp('completed_at')->nullable();
    $table->timestamps();
    $table->index(['user_id', 'request_type']);
});`,
      policy: `namespace Modules\\ComplianceManagement\\Policies;

use Modules\\IdentityManagement\\Models\\User;

class CompliancePolicy
{
    public function view(User $user): bool
    {
        return $user->hasPermissionTo('compliance.view');
    }

    public function processErasure(User $user): bool
    {
        return $user->hasPermissionTo('compliance.process-erasure');
    }
}`,
      reactComponent: `import React, { useState, useEffect } from 'react';
import { useCompliance } from '../../hooks/useCompliance';
import { ComplianceRequestsList } from './ComplianceRequestsList';
import { ExportDataButton } from './ExportDataButton';
import { ErasureRequestForm } from './ErasureRequestForm';

export function ComplianceManagement() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showErasureForm, setShowErasureForm] = useState(false);
  const { fetchRequests, requestDataExport, submitErasureRequest } = useCompliance();

  useEffect(() => {
    const loginAsync = async () => {
      const res = await fetch('http://localhost:5000/api/login');
      console.log('Login response:', res);
    };
    loginAsync();
  }, []);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    setLoading(true);
    const data = await fetchRequests();
    setRequests(data);
    setLoading(false);
  };

  const handleExport = async () => {
    await requestDataExport();
    loadRequests();
  };

  const handleErasureSubmit = async (reason) => {
    await submitErasureRequest(reason);
    setShowErasureForm(false);
    loadRequests();
  };

  return (
    <div className="compliance-management">
      <header className="module-header">
        <h1>Compliance Management</h1>
        <div className="header-actions">
          <ExportDataButton onExport={handleExport} />
          <button onClick={() => setShowErasureForm(true)} className="btn-danger">
            Request Erasure
          </button>
        </div>
      </header>
      {loading ? (
        <div className="skeleton-loader" />
      ) : (
        <ComplianceRequestsList requests={requests} />
      )}
      {showErasureForm && (
        <ErasureRequestForm
          onClose={() => setShowErasureForm(false)}
          onSubmit={handleErasureSubmit}
        />
      )}
    </div>
  );
}`,
      reactHook: `import { useState, useCallback } from 'react';

export function useCompliance() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/v1/compliance/requests', {
        headers: { 'Authorization': \`Bearer \${localStorage.getItem('token')}\` },
      });
      const data = await response.json();
      setRequests(data.data);
      return data.data;
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const requestDataExport = useCallback(async () => {
    const response = await fetch('/api/v1/compliance/export-data', {
      method: 'POST',
      headers: {
        'Authorization': \`Bearer \${localStorage.getItem('token')}\`,
        'Content-Type': 'application/json',
      },
    });
    return response.json();
  }, []);

  const submitErasureRequest = useCallback(async (reason) => {
    const response = await fetch('/api/v1/compliance/erasure-request', {
      method: 'POST',
      headers: {
        'Authorization': \`Bearer \${localStorage.getItem('token')}\`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ reason }),
    });
    return response.json();
  }, []);

  return { requests, loading, error, fetchRequests, requestDataExport, submitErasureRequest };
}`,
      reactStyles: `.compliance-management {
  padding: 24px;
}

.module-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.module-header h1 {
  font-size: 24px;
  font-weight: 600;
  color: #1a1a2e;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.btn-danger {
  padding: 8px 16px;
  background: #dc2626;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}

.btn-danger:hover {
  background: #b91c1c;
}

.skeleton-loader {
  height: 400px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 8px;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}`
    },
    sampleRecords: [
      { id: 501, user: 'sarah.connor@corp.internal', request_type: 'export', status: 'completed', completed_at: '2026-09-08 14:20:00' },
      { id: 502, user: 'david.miller@client.com', request_type: 'erasure', status: 'pending', completed_at: null }
    ],
    status: 'Active'
  },

  // DOMAIN 2: SOCIAL (11-20)
  {
    id: 11,
    code: 'MOD-011',
    name: 'Social Networking',
    slug: 'social-networking',
    category: 'Social',
    phase: 2,
    iconName: 'Share2',
    purpose: 'Manage bidirectional relationships, followers, friend connections, mutual contact discovery, and the social graph.',
    responsibilities: [
      'Manage follow/unfollow and friend request handshakes',
      'Provide indexed lookups for follower/following lists',
      'Compute mutual connection suggestions and degrees of separation'
    ],
    databaseTables: [
      {
        name: 'user_relationships',
        description: 'Graph edges connecting platform users.',
        primaryKey: 'id (BIGINT UNSIGNED)',
        foreignKeys: [
          { column: 'follower_id', references: 'id', table: 'users' },
          { column: 'following_id', references: 'id', table: 'users' }
        ],
        columns: [
          { name: 'id', type: 'BIGINT UNSIGNED', nullable: false },
          { name: 'follower_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
          { name: 'following_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
          { name: 'status', type: 'ENUM("pending","accepted","blocked")', nullable: false },
          { name: 'created_at', type: 'TIMESTAMP', nullable: false }
        ],
        indexes: ['user_rel_unique', 'idx_following_status']
      }
    ],
    apiEndpoints: [
      { method: 'POST', path: '/api/v1/social/follow', description: 'Follow target user', authRequired: true },
      { method: 'DELETE', path: '/api/v1/social/unfollow/{id}', description: 'Unfollow user', authRequired: true },
      { method: 'GET', path: '/api/v1/social/followers', description: 'Get my followers', authRequired: true }
    ],
    services: ['SocialGraphService', 'RelationshipRuleService'],
    permissions: ['social.connect', 'social.block'],
    events: ['UserFollowed', 'UserUnfollowed'],
    jobs: ['RecomputeMutualConnectionsJob'],
    dependencies: [1],
    tests: ['SocialGraphServiceTest', 'FollowFlowTest'],
    codeTemplates: {
      controller: `namespace Modules\\SocialNetworking\\Controllers;

use App\\Http\\Controllers\\Controller;
use Modules\\SocialNetworking\\Services\\SocialGraphService;
use Modules\\SocialNetworking\\Requests\\FollowUserRequest;
use Illuminate\\Http\\JsonResponse;
use Illuminate\\Http\\Request;

class SocialNetworkingController extends Controller
{
    public function __construct(
        protected SocialGraphService $socialService
    ) {}

    public function follow(FollowUserRequest $request): JsonResponse
    {
        $this->authorize('social.connect');

        $relationship = $this->socialService->follow(
            $request->user(),
            $request->validated('following_id')
        );

        return response()->json([
            'success' => true,
            'message' => 'Follow request sent.',
            'data' => ['status' => $relationship->status]
        ], 201);
    }

    public function unfollow(Request $request, int $id): JsonResponse
    {
        $this->authorize('social.connect');

        $this->socialService->unfollow($request->user(), $id);

        return response()->json([
            'success' => true,
            'message' => 'Unfollowed successfully.'
        ]);
    }

    public function followers(Request $request): JsonResponse
    {
        $followers = $this->socialService->getFollowers($request->user());

        return response()->json([
            'success' => true,
            'data' => $followers
        ]);
    }
}`,
      model: `namespace Modules\\SocialNetworking\\Models;

use Illuminate\\Database\\Eloquent\\Model;
use Illuminate\\Database\\Eloquent\\Relations\\BelongsTo;
use Modules\\IdentityManagement\\Models\\User;

class UserRelationship extends Model
{
    protected $table = 'user_relationships';

    protected $fillable = ['follower_id', 'following_id', 'status'];

    protected $casts = [
        'status' => 'string',
    ];

    public function follower(): BelongsTo
    {
        return $this->belongsTo(User::class, 'follower_id');
    }

    public function following(): BelongsTo
    {
        return $this->belongsTo(User::class, 'following_id');
    }

    public function scopeAccepted($query)
    {
        return $query->where('status', 'accepted');
    }
}`,
      service: `namespace Modules\\SocialNetworking\\Services;

use Modules\\SocialNetworking\\Models\\UserRelationship;
use Modules\\IdentityManagement\\Models\\User;
use Modules\\SocialNetworking\\Events\\UserFollowed;
use Modules\\SocialNetworking\\Events\\UserUnfollowed;
use Illuminate\\Support\\Facades\\DB;

class SocialGraphService
{
    public function follow(User $follower, int $followingId): UserRelationship
    {
        return DB::transaction(function () use ($follower, $followingId) {
            $existing = UserRelationship::where('follower_id', $follower->id)
                ->where('following_id', $followingId)
                ->first();

            if ($existing) {
                return $existing;
            }

            $relationship = UserRelationship::create([
                'follower_id' => $follower->id,
                'following_id' => $followingId,
                'status' => 'accepted',
            ]);

            event(new UserFollowed($follower, $followingId));

            return $relationship;
        });
    }

    public function unfollow(User $follower, int $followingId): void
    {
        UserRelationship::where('follower_id', $follower->id)
            ->where('following_id', $followingId)
            ->delete();

        event(new UserUnfollowed($follower, $followingId));
    }

    public function getFollowers(User $user): array
    {
        return UserRelationship::where('following_id', $user->id)
            ->accepted()
            ->with('follower:id,uuid,email')
            ->get()
            ->pluck('follower')
            ->toArray();
    }

    public function getFollowingCount(User $user): int
    {
        return UserRelationship::where('follower_id', $user->id)->accepted()->count();
    }

    public function areMutual(User $userA, User $userB): bool
    {
        return UserRelationship::where('follower_id', $userA->id)
            ->where('following_id', $userB->id)
            ->accepted()
            ->exists()
            && UserRelationship::where('follower_id', $userB->id)
            ->where('following_id', $userA->id)
            ->accepted()
            ->exists();
    }
}`,
      formRequest: `namespace Modules\\SocialNetworking\\Requests;

use Illuminate\\Foundation\\Http\\FormRequest;

class FollowUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('social.connect') ?? false;
    }

    public function rules(): array
    {
        return [
            'following_id' => ['required', 'integer', 'exists:users,id'],
        ];
    }
}`,
      migration: `Schema::create('user_relationships', function (Blueprint $table) {
    $table->id();
    $table->foreignId('follower_id')->constrained('users')->cascadeOnDelete();
    $table->foreignId('following_id')->constrained('users')->cascadeOnDelete();
    $table->enum('status', ['pending', 'accepted', 'blocked'])->default('pending');
    $table->timestamps();
    $table->unique(['follower_id', 'following_id']);
    $table->index(['following_id', 'status']);
});`,
      policy: `namespace Modules\\SocialNetworking\\Policies;

use Modules\\IdentityManagement\\Models\\User;

class SocialPolicy
{
    public function connect(User $user): bool
    {
        return $user->hasPermissionTo('social.connect');
    }

    public function block(User $user): bool
    {
        return $user->hasPermissionTo('social.block');
    }
}`
    },
    sampleRecords: [
      { id: 1001, follower: 'Alex Chen', following: 'Sarah Connor', status: 'accepted', since: '3 months ago' },
      { id: 1002, follower: 'Marcus Vance', following: 'Alex Chen', status: 'accepted', since: '1 week ago' }
    ],
    status: 'Active'
  },
  {
    id: 12,
    code: 'MOD-012',
    name: 'Content Management',
    slug: 'content-management',
    category: 'Social',
    phase: 2,
    iconName: 'FileText',
    purpose: 'User-generated posts, rich text articles, activity feeds, reactions, and timeline distribution.',
    responsibilities: [
      'Publish, edit, and moderate user posts and media attachments',
      'Fan-out feed updates to followers via background jobs',
      'Aggregate reactions (likes, upvotes, bookmarks) with caching'
    ],
    databaseTables: [
      {
        name: 'posts',
        description: 'Primary user-authored posts.',
        primaryKey: 'id (BIGINT UNSIGNED)',
        foreignKeys: [{ column: 'user_id', references: 'id', table: 'users' }],
        columns: [
          { name: 'id', type: 'BIGINT UNSIGNED', nullable: false },
          { name: 'uuid', type: 'CHAR(36)', nullable: false, index: true },
          { name: 'user_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
          { name: 'content', type: 'TEXT', nullable: false },
          { name: 'visibility', type: 'ENUM("public","followers","private")', nullable: false },
          { name: 'likes_count', type: 'INT UNSIGNED', nullable: false },
          { name: 'comments_count', type: 'INT UNSIGNED', nullable: false }
        ],
        indexes: ['idx_posts_user_created']
      }
    ],
    apiEndpoints: [
      { method: 'GET', path: '/api/v1/content/feed', description: 'Retrieve personalized activity timeline', authRequired: true },
      { method: 'POST', path: '/api/v1/content/posts', description: 'Publish post', authRequired: true }
    ],
    services: ['PostCreationService', 'FeedFanoutService'],
    permissions: ['content.create', 'content.edit-own', 'content.delete-any'],
    events: ['PostPublished', 'PostReacted'],
    jobs: ['FanOutPostToFollowersJob'],
    dependencies: [1, 11],
    tests: ['PostCreationTest', 'FeedFanoutTest'],
    codeTemplates: {
      controller: `namespace Modules\\ContentManagement\\Controllers;

use App\\Http\\Controllers\\Controller;
use Modules\\ContentManagement\\Services\\PostCreationService;
use Modules\\ContentManagement\\Services\\FeedFanoutService;
use Modules\\ContentManagement\\Requests\\CreatePostRequest;
use Modules\\ContentManagement\\Resources\\PostResource;
use Illuminate\\Http\\JsonResponse;
use Illuminate\\Http\\Request;

class ContentController extends Controller
{
    public function __construct(
        protected PostCreationService $postService,
        protected FeedFanoutService $feedService
    ) {}

    public function feed(Request $request): JsonResponse
    {
        $posts = $this->feedService->getPersonalizedFeed(
            $request->user(),
            $request->query('per_page', 20)
        );

        return response()->json([
            'success' => true,
            'data' => PostResource::collection($posts)
        ]);
    }

    public function store(CreatePostRequest $request): JsonResponse
    {
        $post = $this->postService->publish($request->user(), $request->validated());

        return response()->json([
            'success' => true,
            'data' => new PostResource($post)
        ], 201);
    }
}`,
      model: `namespace Modules\\ContentManagement\\Models;

use Illuminate\\Database\\Eloquent\\Model;
use Illuminate\\Database\\Eloquent\\SoftDeletes;
use Illuminate\\Database\\Eloquent\\Relations\\BelongsTo;
use Modules\\IdentityManagement\\Models\\User;

class Post extends Model
{
    use SoftDeletes;

    protected $fillable = ['uuid', 'user_id', 'content', 'visibility', 'likes_count', 'comments_count'];

    protected $casts = [
        'likes_count' => 'integer',
        'comments_count' => 'integer',
    ];

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function scopePublic($query)
    {
        return $query->where('visibility', 'public');
    }
}`,
      service: `namespace Modules\\ContentManagement\\Services;

use Modules\\ContentManagement\\Models\\Post;
use Modules\\ContentManagement\\Events\\PostPublished;
use Modules\\ContentManagement\\Events\\PostReacted;
use Modules\\IdentityManagement\\Models\\User;
use Illuminate\\Support\\Facades\\DB;
use Illuminate\\Support\\Str;

class PostCreationService
{
    public function publish(User $author, array $attributes): Post
    {
        return DB::transaction(function () use ($author, $attributes) {
            $post = Post::create([
                'uuid' => (string) Str::uuid(),
                'user_id' => $author->id,
                'content' => $attributes['content'],
                'visibility' => $attributes['visibility'] ?? 'public',
                'likes_count' => 0,
                'comments_count' => 0,
            ]);

            event(new PostPublished($post));

            return $post;
        });
    }

    public function deletePost(Post $post): void
    {
        $post->delete();
    }

    public function reactToPost(Post $post, User $user): void
    {
        event(new PostReacted($post, $user));
        $post->increment('likes_count');
    }
}

class FeedFanoutService
{
    public function getPersonalizedFeed(User $user, int $perPage = 20)
    {
        $followingIds = $user->following()->pluck('id')->toArray();

        return Post::whereIn('user_id', $followingIds)
            ->orWhere('visibility', 'public')
            ->with('author:id,uuid,email')
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    public function fanOut(Post $post): void
    {
        // Dispatch FanOutPostToFollowersJob
    }
}`,
      formRequest: `namespace Modules\\ContentManagement\\Requests;

use Illuminate\\Foundation\\Http\\FormRequest;

class CreatePostRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('content.create') ?? false;
    }

    public function rules(): array
    {
        return [
            'content' => ['required', 'string', 'max:5000'],
            'visibility' => ['nullable', 'string', 'in:public,followers,private'],
        ];
    }
}`,
      migration: `Schema::create('posts', function (Blueprint $table) {
    $table->id();
    $table->uuid('uuid')->unique();
    $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
    $table->text('content');
    $table->enum('visibility', ['public', 'followers', 'private'])->default('public');
    $table->unsignedInteger('likes_count')->default(0);
    $table->unsignedInteger('comments_count')->default(0);
    $table->timestamps();
    $table->softDeletes();
    $table->index(['user_id', 'created_at']);
});`,
      policy: `namespace Modules\\ContentManagement\\Policies;

use Modules\\IdentityManagement\\Models\\User;
use Modules\\ContentManagement\\Models\\Post;

class PostPolicy
{
    public function create(User $user): bool
    {
        return $user->hasPermissionTo('content.create');
    }

    public function editOwn(User $user, Post $post): bool
    {
        return $user->id === $post->user_id && $user->hasPermissionTo('content.edit-own');
    }

    public function deleteAny(User $user): bool
    {
        return $user->hasPermissionTo('content.delete-any');
    }
}`
    },
    sampleRecords: [
      { id: 41, author: 'Alex Chen', snippet: 'Announcing Nexus Enterprise Architecture with comprehensive modular domains...', likes: 84, comments: 16, visibility: 'public' },
      { id: 42, author: 'Sarah Connor', snippet: 'Deep dive into MySQL 8.0 indexing strategies for modular monoliths.', likes: 112, comments: 23, visibility: 'public' }
    ],
    status: 'Active'
  },
  {
    id: 13,
    code: 'MOD-013',
    name: 'Community Management',
    slug: 'community-management',
    category: 'Social',
    phase: 2,
    iconName: 'Compass',
    purpose: 'Public and gated topic communities, rules enforcement, membership rosters, and club hubs.',
    responsibilities: [
      'Community provisioning with custom branding and rules',
      'Moderator delegation and member approval queues',
      'Community discovery rankings and category grouping'
    ],
    databaseTables: [
      {
        name: 'communities',
        description: 'Interest-based community hubs.',
        primaryKey: 'id (BIGINT UNSIGNED)',
        foreignKeys: [{ column: 'owner_id', references: 'id', table: 'users' }],
        columns: [
          { name: 'id', type: 'BIGINT UNSIGNED', nullable: false },
          { name: 'name', type: 'VARCHAR(128)', nullable: false },
          { name: 'slug', type: 'VARCHAR(128)', nullable: false, index: true },
          { name: 'owner_id', type: 'BIGINT UNSIGNED', nullable: false },
          { name: 'privacy', type: 'ENUM("public","private","secret")', nullable: false },
          { name: 'members_count', type: 'INT UNSIGNED', nullable: false }
        ],
        indexes: ['comm_slug_unique']
      }
    ],
    apiEndpoints: [
      { method: 'GET', path: '/api/v1/communities', description: 'Browse community directories', authRequired: false },
      { method: 'POST', path: '/api/v1/communities/{id}/join', description: 'Join or request membership', authRequired: true }
    ],
    services: ['CommunityService', 'CommunityModerationRuleService'],
    permissions: ['community.create', 'community.manage'],
    events: ['CommunityCreated', 'CommunityMemberJoined'],
    jobs: ['RecalculateCommunityRankingsJob'],
    dependencies: [1],
    tests: ['CommunityMembershipPolicyTest'],
    codeTemplates: {
      controller: `namespace Modules\\CommunityManagement\\Controllers;

use App\\Http\\Controllers\\Controller;
use Modules\\CommunityManagement\\Services\\CommunityService;
use Modules\\CommunityManagement\\Requests\\CreateCommunityRequest;
use Modules\\CommunityManagement\\Resources\\CommunityResource;
use Illuminate\\Http\\JsonResponse;
use Illuminate\\Http\\Request;

class CommunityController extends Controller
{
    public function __construct(
        protected CommunityService $communityService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $communities = $this->communityService->getPaginated($request->query('per_page', 25));

        return response()->json([
            'success' => true,
            'data' => CommunityResource::collection($communities)
        ]);
    }

    public function join(Request $request, int $id): JsonResponse
    {
        $community = $this->communityService->findById($id);
        $this->authorize('community.manage', $community);

        $this->communityService->join($community, $request->user());

        return response()->json([
            'success' => true,
            'message' => 'Join request submitted.'
        ]);
    }
}`,
      model: `namespace Modules\\CommunityManagement\\Models;

use Illuminate\\Database\\Eloquent\\Model;
use Illuminate\\Database\\Eloquent\\Relations\\BelongsTo;
use Illuminate\\Database\\Eloquent\\Relations\\BelongsToMany;
use Modules\\IdentityManagement\\Models\\User;

class Community extends Model
{
    protected $fillable = ['name', 'slug', 'owner_id', 'privacy', 'members_count'];

    protected $casts = [
        'members_count' => 'integer',
    ];

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function members(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'community_members')->withTimestamps();
    }

    public function scopePublic($query)
    {
        return $query->where('privacy', 'public');
    }
}`,
      service: `namespace Modules\\CommunityManagement\\Services;

use Modules\\CommunityManagement\\Models\\Community;
use Modules\\CommunityManagement\\Events\\CommunityCreated;
use Modules\\CommunityManagement\\Events\\CommunityMemberJoined;
use Modules\\IdentityManagement\\Models\\User;
use Illuminate\\Support\\Facades\\DB;

class CommunityService
{
    public function getPaginated(int $perPage = 25)
    {
        return Community::withCount('members')->orderBy('name')->paginate($perPage);
    }

    public function findById(int $id): Community
    {
        return Community::findOrFail($id);
    }

    public function create(array $attributes, User $owner): Community
    {
        return DB::transaction(function () use ($attributes, $owner) {
            $community = Community::create([
                'name' => $attributes['name'],
                'slug' => $attributes['slug'],
                'owner_id' => $owner->id,
                'privacy' => $attributes['privacy'] ?? 'public',
                'members_count' => 1,
            ]);

            $community->members()->attach($owner->id);

            event(new CommunityCreated($community));

            return $community;
        });
    }

    public function join(Community $community, User $user): void
    {
        $community->members()->syncWithoutDetaching([$user->id]);
        $community->increment('members_count');

        event(new CommunityMemberJoined($community, $user));
    }
}`,
      formRequest: `namespace Modules\\CommunityManagement\\Requests;

use Illuminate\\Foundation\\Http\\FormRequest;

class CreateCommunityRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('community.create') ?? false;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:128'],
            'slug' => ['required', 'string', 'max:128', 'unique:communities,slug'],
            'privacy' => ['nullable', 'string', 'in:public,private,secret'],
        ];
    }
}`,
      migration: `Schema::create('communities', function (Blueprint $table) {
    $table->id();
    $table->string('name', 128);
    $table->string('slug', 128)->unique();
    $table->foreignId('owner_id')->constrained('users')->cascadeOnDelete();
    $table->enum('privacy', ['public', 'private', 'secret'])->default('public');
    $table->unsignedInteger('members_count')->default(0);
    $table->timestamps();
});

Schema::create('community_members', function (Blueprint $table) {
    $table->foreignId('community_id')->constrained('communities')->cascadeOnDelete();
    $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
    $table->primary(['community_id', 'user_id']);
    $table->timestamps();
});`,
      policy: `namespace Modules\\CommunityManagement\\Policies;

use Modules\\IdentityManagement\\Models\\User;
use Modules\\CommunityManagement\\Models\\Community;

class CommunityPolicy
{
    public function create(User $user): bool
    {
        return $user->hasPermissionTo('community.create');
    }

    public function manage(User $user, Community $community): bool
    {
        return $user->hasPermissionTo('community.manage')
            || $community->owner_id === $user->id;
    }
}`
    },
    sampleRecords: [
      { id: 12, name: 'Laravel High-Performance Guild', slug: 'laravel-guild', members_count: 3420, privacy: 'public' },
      { id: 13, name: 'Enterprise Architects Forum', slug: 'enterprise-architects', members_count: 890, privacy: 'private' }
    ],
    status: 'Active'
  },
  {
    id: 14,
    code: 'MOD-014',
    name: 'Group Management',
    slug: 'group-management',
    category: 'Social',
    phase: 2,
    iconName: 'FolderKanban',
    purpose: 'Granular sub-groups, working taskforces, study groups, and scoped cohorts.',
    responsibilities: [
      'Manage focused sub-groups nested within communities or standalone',
      'Facilitate group-scoped collaboration and announcements',
      'Track cohort activity and completion rates'
    ],
    databaseTables: [
      {
        name: 'groups',
        description: 'Focused working cohorts.',
        primaryKey: 'id (BIGINT UNSIGNED)',
        foreignKeys: [{ column: 'community_id', references: 'id', table: 'communities' }],
        columns: [
          { name: 'id', type: 'BIGINT UNSIGNED', nullable: false },
          { name: 'community_id', type: 'BIGINT UNSIGNED', nullable: true },
          { name: 'name', type: 'VARCHAR(128)', nullable: false },
          { name: 'privacy', type: 'ENUM("open","closed")', nullable: false }
        ],
        indexes: ['idx_groups_community']
      }
    ],
    apiEndpoints: [
      { method: 'GET', path: '/api/v1/groups', description: 'List accessible groups', authRequired: true },
      { method: 'POST', path: '/api/v1/groups', description: 'Form new group', authRequired: true }
    ],
    services: ['GroupService'],
    permissions: ['groups.create', 'groups.manage'],
    events: ['GroupCreated'],
    jobs: ['SyncGroupCohortsJob'],
    dependencies: [1, 13],
    tests: ['GroupIsolationTest'],
    codeTemplates: {
      controller: `namespace Modules\\GroupManagement\\Controllers;

use App\\Http\\Controllers\\Controller;
use Modules\\GroupManagement\\Services\\GroupService;
use Modules\\GroupManagement\\Requests\\CreateGroupRequest;
use Modules\\GroupManagement\\Resources\\GroupResource;
use Illuminate\\Http\\JsonResponse;
use Illuminate\\Http\\Request;

class GroupController extends Controller
{
    public function __construct(
        protected GroupService $groupService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $this->authorize('groups.create');

        $groups = $this->groupService->getPaginated($request->query('per_page', 25));

        return response()->json([
            'success' => true,
            'data' => GroupResource::collection($groups)
        ]);
    }

    public function store(CreateGroupRequest $request): JsonResponse
    {
        $group = $this->groupService->create($request->validated(), $request->user());

        return response()->json([
            'success' => true,
            'data' => new GroupResource($group)
        ], 201);
    }
}`,
      model: `namespace Modules\\GroupManagement\\Models;

use Illuminate\\Database\\Eloquent\\Model;
use Illuminate\\Database\\Eloquent\\Relations\\BelongsTo;
use Illuminate\\Database\\Eloquent\\Relations\\BelongsToMany;

class Group extends Model
{
    protected $fillable = ['community_id', 'name', 'privacy'];

    public function community(): BelongsTo
    {
        return $this->belongsTo(Community::class);
    }

    public function members(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'group_members')->withTimestamps();
    }
}`,
      service: `namespace Modules\\GroupManagement\\Services;

use Modules\\GroupManagement\\Models\\Group;
use Modules\\GroupManagement\\Events\\GroupCreated;
use Modules\\IdentityManagement\\Models\\User;
use Illuminate\\Support\\Facades\\DB;

class GroupService
{
    public function getPaginated(int $perPage = 25)
    {
        return Group::with('community')->orderBy('name')->paginate($perPage);
    }

    public function create(array $attributes, User $creator): Group
    {
        return DB::transaction(function () use ($attributes, $creator) {
            $group = Group::create([
                'community_id' => $attributes['community_id'] ?? null,
                'name' => $attributes['name'],
                'privacy' => $attributes['privacy'] ?? 'open',
            ]);

            $group->members()->attach($creator->id);

            event(new GroupCreated($group));

            return $group;
        });
    }

    public function addMember(Group $group, int $userId): void
    {
        $group->members()->syncWithoutDetaching([$userId]);
    }
}`,
      formRequest: `namespace Modules\\GroupManagement\\Requests;

use Illuminate\\Foundation\\Http\\FormRequest;

class CreateGroupRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('groups.create') ?? false;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:128'],
            'community_id' => ['nullable', 'integer', 'exists:communities,id'],
            'privacy' => ['nullable', 'string', 'in:open,closed'],
        ];
    }
}`,
      migration: `Schema::create('groups', function (Blueprint $table) {
    $table->id();
    $table->foreignId('community_id')->nullable()->constrained('communities')->nullOnDelete();
    $table->string('name', 128);
    $table->enum('privacy', ['open', 'closed'])->default('open');
    $table->timestamps();
    $table->index('community_id');
});

Schema::create('group_members', function (Blueprint $table) {
    $table->foreignId('group_id')->constrained('groups')->cascadeOnDelete();
    $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
    $table->primary(['group_id', 'user_id']);
    $table->timestamps();
});`,
      policy: `namespace Modules\\GroupManagement\\Policies;

use Modules\\IdentityManagement\\Models\\User;

class GroupPolicy
{
    public function create(User $user): bool
    {
        return $user->hasPermissionTo('groups.create');
    }

    public function manage(User $user): bool
    {
        return $user->hasPermissionTo('groups.manage');
    }
}`
    },
    sampleRecords: [
      { id: 81, name: 'Phase 1 Security Working Group', community: 'Enterprise Architects Forum', members: 14, privacy: 'closed' }
    ],
    status: 'Configured'
  },
  {
    id: 15,
    code: 'MOD-015',
    name: 'Forum Management',
    slug: 'forum-management',
    category: 'Social',
    phase: 2,
    iconName: 'MessagesSquare',
    purpose: 'Hierarchical discussion boards, categorised threads, nested replies, voting, and solution marking.',
    responsibilities: [
      'Category taxonomies and thread moderation (pin, lock, split)',
      'Thread reply tree rendering with Markdown formatting',
      'Marking verified solutions and reputation scoring'
    ],
    databaseTables: [
      {
        name: 'forums',
        description: 'Forum categories and discussion topics.',
        primaryKey: 'id (BIGINT UNSIGNED)',
        foreignKeys: [],
        columns: [
          { name: 'id', type: 'BIGINT UNSIGNED', nullable: false },
          { name: 'title', type: 'VARCHAR(128)', nullable: false },
          { name: 'slug', type: 'VARCHAR(128)', nullable: false, index: true },
          { name: 'topics_count', type: 'INT UNSIGNED', nullable: false },
          { name: 'posts_count', type: 'INT UNSIGNED', nullable: false }
        ],
        indexes: ['forums_slug_unique']
      }
    ],
    apiEndpoints: [
      { method: 'GET', path: '/api/v1/forums', description: 'Fetch forum channels', authRequired: false },
      { method: 'POST', path: '/api/v1/forums/topics', description: 'Start discussion thread', authRequired: true }
    ],
    services: ['ForumDiscussionService'],
    permissions: ['forums.post', 'forums.moderate'],
    events: ['ForumTopicCreated', 'BestAnswerMarked'],
    jobs: ['IndexForumTopicSearchJob'],
    dependencies: [1],
    tests: ['ForumThreadLockingTest'],
    codeTemplates: {
      controller: `namespace Modules\\ForumManagement\\Controllers;

use App\\Http\\Controllers\\Controller;
use Modules\\ForumManagement\\Services\\ForumDiscussionService;
use Modules\\ForumManagement\\Requests\\CreateTopicRequest;
use Modules\\ForumManagement\\Resources\\ForumResource;
use Illuminate\\Http\\JsonResponse;
use Illuminate\\Http\\Request;

class ForumController extends Controller
{
    public function __construct(
        protected ForumDiscussionService $forumService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $forums = $this->forumService->getPaginated($request->query('per_page', 25));

        return response()->json([
            'success' => true,
            'data' => ForumResource::collection($forums)
        ]);
    }

    public function storeTopic(CreateTopicRequest $request): JsonResponse
    {
        $this->authorize('forums.post');

        $topic = $this->forumService->createTopic(
            $request->validated('forum_id'),
            $request->user(),
            $request->validated()
        );

        return response()->json([
            'success' => true,
            'data' => $topic
        ], 201);
    }
}`,
      model: `namespace Modules\\ForumManagement\\Models;

use Illuminate\\Database\\Eloquent\\Model;

class Forum extends Model
{
    protected $fillable = ['title', 'slug', 'topics_count', 'posts_count'];

    protected $casts = [
        'topics_count' => 'integer',
        'posts_count' => 'integer',
    ];

    public function topics()
    {
        return $this->hasMany(ForumTopic::class);
    }
}

namespace Modules\\ForumManagement\\Models;

use Illuminate\\Database\\Eloquent\\Model;
use Illuminate\\Database\\Eloquent\\Relations\\BelongsTo;

class ForumTopic extends Model
{
    protected $table = 'forum_topics';

    protected $fillable = ['forum_id', 'user_id', 'title', 'slug', 'is_pinned', 'is_locked'];

    protected $casts = [
        'is_pinned' => 'boolean',
        'is_locked' => 'boolean',
    ];

    public function forum(): BelongsTo
    {
        return $this->belongsTo(Forum::class);
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}`,
      service: `namespace Modules\\ForumManagement\\Services;

use Modules\\ForumManagement\\Models\\Forum;
use Modules\\ForumManagement\\Models\\ForumTopic;
use Modules\\ForumManagement\\Events\\ForumTopicCreated;
use Modules\\ForumManagement\\Events\\BestAnswerMarked;
use Modules\\IdentityManagement\\Models\\User;
use Illuminate\\Support\\Facades\\DB;
use Illuminate\\Support\\Str;

class ForumDiscussionService
{
    public function getPaginated(int $perPage = 25)
    {
        return Forum::withCount('topics')->orderBy('title')->paginate($perPage);
    }

    public function createTopic(int $forumId, User $author, array $attributes): ForumTopic
    {
        return DB::transaction(function () use ($forumId, $author, $attributes) {
            $forum = Forum::findOrFail($forumId);

            $topic = ForumTopic::create([
                'forum_id' => $forumId,
                'user_id' => $author->id,
                'title' => $attributes['title'],
                'slug' => Str::slug($attributes['title']),
            ]);

            $forum->increment('topics_count');

            event(new ForumTopicCreated($topic));

            return $topic;
        });
    }

    public function markBestAnswer(ForumTopic $topic, int $postId): void
    {
        event(new BestAnswerMarked($topic, $postId));
    }
}`,
      formRequest: `namespace Modules\\ForumManagement\\Requests;

use Illuminate\\Foundation\\Http\\FormRequest;

class CreateTopicRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('forums.post') ?? false;
    }

    public function rules(): array
    {
        return [
            'forum_id' => ['required', 'integer', 'exists:forums,id'],
            'title' => ['required', 'string', 'max:128'],
        ];
    }
}`,
      migration: `Schema::create('forums', function (Blueprint $table) {
    $table->id();
    $table->string('title', 128);
    $table->string('slug', 128)->unique();
    $table->unsignedInteger('topics_count')->default(0);
    $table->unsignedInteger('posts_count')->default(0);
    $table->timestamps();
});

Schema::create('forum_topics', function (Blueprint $table) {
    $table->id();
    $table->foreignId('forum_id')->constrained('forums')->cascadeOnDelete();
    $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
    $table->string('title', 128);
    $table->string('slug', 128);
    $table->boolean('is_pinned')->default(false);
    $table->boolean('is_locked')->default(false);
    $table->timestamps();
    $table->index(['forum_id', 'created_at']);
});`,
      policy: `namespace Modules\\ForumManagement\\Policies;

use Modules\\IdentityManagement\\Models\\User;

class ForumPolicy
{
    public function post(User $user): bool
    {
        return $user->hasPermissionTo('forums.post');
    }

    public function moderate(User $user): bool
    {
        return $user->hasPermissionTo('forums.moderate');
    }
}`
    },
    sampleRecords: [
      { id: 1, title: 'Architecture Decisions (ADRs)', topics: 48, posts: 312 },
      { id: 2, title: 'Database Optimization & Indexing', topics: 124, posts: 940 }
    ],
    status: 'Configured'
  },
  {
    id: 16,
    code: 'MOD-016',
    name: 'Blog Management',
    slug: 'blog-management',
    category: 'Social',
    phase: 2,
    iconName: 'BookOpen',
    purpose: 'Long-form editorial publication, drafts, publication scheduling, tags, canonical URLs, and SEO metadata.',
    responsibilities: [
      'Editorial workflow (Draft, In-Review, Scheduled, Published)',
      'SEO title, meta description, and OpenGraph tags rendering',
      'Reading time computation and structured schema markup'
    ],
    databaseTables: [
      {
        name: 'blog_articles',
        description: 'Published articles and editorial drafts.',
        primaryKey: 'id (BIGINT UNSIGNED)',
        foreignKeys: [{ column: 'author_id', references: 'id', table: 'users' }],
        columns: [
          { name: 'id', type: 'BIGINT UNSIGNED', nullable: false },
          { name: 'author_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
          { name: 'title', type: 'VARCHAR(255)', nullable: false },
          { name: 'slug', type: 'VARCHAR(255)', nullable: false, index: true },
          { name: 'body', type: 'LONGTEXT', nullable: false },
          { name: 'status', type: 'ENUM("draft","review","scheduled","published")', nullable: false }
        ],
        indexes: ['blog_slug_unique', 'idx_articles_status_pub']
      }
    ],
    apiEndpoints: [
      { method: 'GET', path: '/api/v1/blogs/articles', description: 'List published articles', authRequired: false },
      { method: 'POST', path: '/api/v1/blogs/articles', description: 'Create draft or publish article', authRequired: true }
    ],
    services: ['EditorialService', 'SlugGenerationService'],
    permissions: ['blog.author', 'blog.publish'],
    events: ['ArticlePublished'],
    jobs: ['PublishScheduledArticlesJob'],
    dependencies: [1],
    tests: ['ArticlePublishingLifecycleTest'],
    codeTemplates: {
      controller: `namespace Modules\\BlogManagement\\Controllers;

use App\\Http\\Controllers\\Controller;
use Modules\\BlogManagement\\Services\\EditorialService;
use Modules\\BlogManagement\\Requests\\CreateArticleRequest;
use Modules\\BlogManagement\\Resources\\ArticleResource;
use Illuminate\\Http\\JsonResponse;
use Illuminate\\Http\\Request;

class BlogController extends Controller
{
    public function __construct(
        protected EditorialService $editorialService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $articles = $this->editorialService->getPublished($request->query('per_page', 20));

        return response()->json([
            'success' => true,
            'data' => ArticleResource::collection($articles)
        ]);
    }

    public function store(CreateArticleRequest $request): JsonResponse
    {
        $this->authorize('blog.author');

        $article = $this->editorialService->createArticle($request->user(), $request->validated());

        return response()->json([
            'success' => true,
            'data' => new ArticleResource($article)
        ], 201);
    }
}`,
      model: `namespace Modules\\BlogManagement\\Models;

use Illuminate\\Database\\Eloquent\\Model;
use Illuminate\\Database\\Eloquent\\SoftDeletes;
use Illuminate\\Database\\Eloquent\\Relations\\BelongsTo;
use Modules\\IdentityManagement\\Models\\User;

class BlogArticle extends Model
{
    use SoftDeletes;

    protected $table = 'blog_articles';

    protected $fillable = ['author_id', 'title', 'slug', 'body', 'status'];

    protected $casts = [
        'status' => 'string',
    ];

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    public function scopePublished($query)
    {
        return $query->where('status', 'published');
    }

    public function scopeDraft($query)
    {
        return $query->where('status', 'draft');
    }
}`,
      service: `namespace Modules\\BlogManagement\\Services;

use Modules\\BlogManagement\\Models\\BlogArticle;
use Modules\\BlogManagement\\Events\\ArticlePublished;
use Modules\\IdentityManagement\\Models\\User;
use Illuminate\\Support\\Facades\\DB;
use Illuminate\\Support\\Str;

class EditorialService
{
    public function getPublished(int $perPage = 20)
    {
        return BlogArticle::published()
            ->with('author:id,uuid,email')
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    public function createArticle(User $author, array $attributes): BlogArticle
    {
        return DB::transaction(function () use ($author, $attributes) {
            $status = $attributes['status'] ?? 'draft';

            $article = BlogArticle::create([
                'author_id' => $author->id,
                'title' => $attributes['title'],
                'slug' => Str::slug($attributes['title']),
                'body' => $attributes['body'],
                'status' => $status,
            ]);

            if ($status === 'published') {
                event(new ArticlePublished($article));
            }

            return $article;
        });
    }

    public function publish(BlogArticle $article): void
    {
        $article->update(['status' => 'published']);
        event(new ArticlePublished($article));
    }
}

class SlugGenerationService
{
    public function generate(string $title): string
    {
        return Str::slug($title);
    }
}`,
      formRequest: `namespace Modules\\BlogManagement\\Requests;

use Illuminate\\Foundation\\Http\\FormRequest;

class CreateArticleRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('blog.author') ?? false;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'body' => ['required', 'string', 'max:50000'],
            'status' => ['nullable', 'string', 'in:draft,review,scheduled,published'],
        ];
    }
}`,
      migration: `Schema::create('blog_articles', function (Blueprint $table) {
    $table->id();
    $table->foreignId('author_id')->constrained('users')->cascadeOnDelete();
    $table->string('title');
    $table->string('slug')->unique();
    $table->longText('body');
    $table->enum('status', ['draft', 'review', 'scheduled', 'published'])->default('draft');
    $table->timestamps();
    $table->softDeletes();
    $table->index(['status', 'created_at']);
});`,
      policy: `namespace Modules\\BlogManagement\\Policies;

use Modules\\IdentityManagement\\Models\\User;

class BlogPolicy
{
    public function author(User $user): bool
    {
        return $user->hasPermissionTo('blog.author');
    }

    public function publish(User $user): bool
    {
        return $user->hasPermissionTo('blog.publish');
    }
}`
    },
    sampleRecords: [
      { id: 301, title: 'Architecting Enterprise Modules with Zero Bleed', author: 'Alex Chen', status: 'published', views: 4200 }
    ],
    status: 'Configured'
  },
  {
    id: 17,
    code: 'MOD-017',
    name: 'Media Management',
    slug: 'media-management',
    category: 'Social',
    phase: 2,
    iconName: 'Image',
    purpose: 'Media storage, multipart uploads, image optimization, responsive variant generation, and cloud CDN distribution.',
    responsibilities: [
      'Presigned upload URLs for S3/MinIO cloud disks',
      'MIME type inspection, virus scanning, and EXIF sanitization',
      'Generation of WebP/AVIF variants and thumbnails'
    ],
    databaseTables: [
      {
        name: 'media_files',
        description: 'Uploaded assets and variants.',
        primaryKey: 'id (BIGINT UNSIGNED)',
        foreignKeys: [{ column: 'user_id', references: 'id', table: 'users' }],
        columns: [
          { name: 'id', type: 'BIGINT UNSIGNED', nullable: false },
          { name: 'user_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
          { name: 'filename', type: 'VARCHAR(255)', nullable: false },
          { name: 'disk', type: 'VARCHAR(32)', nullable: false },
          { name: 'mime_type', type: 'VARCHAR(128)', nullable: false },
          { name: 'file_size', type: 'BIGINT UNSIGNED', nullable: false },
          { name: 'storage_path', type: 'VARCHAR(512)', nullable: false }
        ],
        indexes: ['idx_media_user']
      }
    ],
    apiEndpoints: [
      { method: 'POST', path: '/api/v1/media/upload', description: 'Upload binary asset', authRequired: true },
      { method: 'GET', path: '/api/v1/media/{id}', description: 'Get asset URL and metadata', authRequired: false }
    ],
    services: ['MediaStorageService', 'ImageTransformService'],
    permissions: ['media.upload', 'media.delete-own'],
    events: ['MediaUploaded', 'MediaTranscoded'],
    jobs: ['ProcessMediaOptimizationJob'],
    dependencies: [1],
    tests: ['SecureMediaUploadTest'],
    codeTemplates: {
      controller: `namespace Modules\\MediaManagement\\Controllers;

use App\\Http\\Controllers\\Controller;
use Modules\\MediaManagement\\Services\\MediaStorageService;
use Modules\\MediaManagement\\Services\\ImageTransformService;
use Modules\\MediaManagement\\Requests\\UploadMediaRequest;
use Modules\\MediaManagement\\Resources\\MediaFileResource;
use Illuminate\\Http\\JsonResponse;
use Illuminate\\Http\\Request;

class MediaController extends Controller
{
    public function __construct(
        protected MediaStorageService $storageService,
        protected ImageTransformService $transformService
    ) {}

    public function upload(UploadMediaRequest $request): JsonResponse
    {
        $this->authorize('media.upload');

        $mediaFile = $this->storageService->store(
            $request->user(),
            $request->file('file')
        );

        return response()->json([
            'success' => true,
            'data' => new MediaFileResource($mediaFile)
        ], 201);
    }

    public function show(int $id): JsonResponse
    {
        $mediaFile = $this->storageService->getById($id);

        return response()->json([
            'success' => true,
            'data' => new MediaFileResource($mediaFile)
        ]);
    }
}`,
      model: `namespace Modules\\MediaManagement\\Models;

use Illuminate\\Database\\Eloquent\\Model;
use Illuminate\\Database\\Eloquent\\Relations\\BelongsTo;
use Modules\\IdentityManagement\\Models\\User;

class MediaFile extends Model
{
    protected $table = 'media_files';

    protected $fillable = ['user_id', 'filename', 'disk', 'mime_type', 'file_size', 'storage_path'];

    protected $casts = [
        'file_size' => 'integer',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}`,
      service: `namespace Modules\\MediaManagement\\Services;

use Modules\\MediaManagement\\Models\\MediaFile;
use Modules\\MediaManagement\\Events\\MediaUploaded;
use Modules\\MediaManagement\\Events\\MediaTranscoded;
use Modules\\IdentityManagement\\Models\\User;
use Illuminate\\Support\\Facades\\DB;
use Illuminate\\Http\\UploadedFile;

class MediaStorageService
{
    public function store(User $user, UploadedFile $file): MediaFile
    {
        return DB::transaction(function () use ($user, $file) {
            $path = $file->store('media/' . $user->id, 'public');

            $mediaFile = MediaFile::create([
                'user_id' => $user->id,
                'filename' => $file->getClientOriginalName(),
                'disk' => 'public',
                'mime_type' => $file->getMimeType(),
                'file_size' => $file->getSize(),
                'storage_path' => $path,
            ]);

            event(new MediaUploaded($mediaFile));

            return $mediaFile;
        });
    }

    public function getById(int $id): MediaFile
    {
        return MediaFile::findOrFail($id);
    }

    public function delete(MediaFile $mediaFile): void
    {
        \Storage::disk($mediaFile->disk)->delete($mediaFile->storage_path);
        $mediaFile->delete();
    }
}

class ImageTransformService
{
    public function createThumbnail(string $path, int $width = 200): string
    {
        // Generate responsive thumbnail variant
        return $path;
    }
}`,
      formRequest: `namespace Modules\\MediaManagement\\Requests;

use Illuminate\\Foundation\\Http\\FormRequest;

class UploadMediaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('media.upload') ?? false;
    }

    public function rules(): array
    {
        return [
            'file' => ['required', 'file', 'max:10240', 'mimes:jpg,jpeg,png,gif,webp,svg,pdf,mp4'],
        ];
    }
}`,
      migration: `Schema::create('media_files', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
    $table->string('filename');
    $table->string('disk', 32)->default('public');
    $table->string('mime_type', 128);
    $table->unsignedBigInteger('file_size');
    $table->string('storage_path', 512);
    $table->timestamps();
    $table->index('user_id');
});`,
      policy: `namespace Modules\\MediaManagement\\Policies;

use Modules\\IdentityManagement\\Models\\User;
use Modules\\MediaManagement\\Models\\MediaFile;

class MediaPolicy
{
    public function upload(User $user): bool
    {
        return $user->hasPermissionTo('media.upload');
    }

    public function deleteOwn(User $user, MediaFile $mediaFile): bool
    {
        return $user->id === $mediaFile->user_id && $user->hasPermissionTo('media.delete-own');
    }
}`
    },
    sampleRecords: [
      { id: 881, filename: 'erd-schema-v1.webp', mime: 'image/webp', size: '240 KB', storage: 's3://nexus-assets/' }
    ],
    status: 'Configured'
  },
  {
    id: 18,
    code: 'MOD-018',
    name: 'Live Streaming',
    slug: 'live-streaming',
    category: 'Social',
    phase: 2,
    iconName: 'Radio',
    purpose: 'Live video broadcasts, RTMP ingest keys, HLS distribution, viewer counts, and broadcast archiving.',
    responsibilities: [
      'Generate and rotate secure RTMP stream keys',
      'Track live broadcast states and concurrent viewers',
      'Archive completed streams to on-demand VOD storage'
    ],
    databaseTables: [
      {
        name: 'live_streams',
        description: 'Live broadcast records and ingest endpoints.',
        primaryKey: 'id (BIGINT UNSIGNED)',
        foreignKeys: [{ column: 'host_id', references: 'id', table: 'users' }],
        columns: [
          { name: 'id', type: 'BIGINT UNSIGNED', nullable: false },
          { name: 'host_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
          { name: 'stream_key', type: 'CHAR(64)', nullable: false },
          { name: 'title', type: 'VARCHAR(255)', nullable: false },
          { name: 'viewer_count', type: 'INT UNSIGNED', nullable: false },
          { name: 'status', type: 'ENUM("idle","live","ended")', nullable: false }
        ],
        indexes: ['stream_key_unique']
      }
    ],
    apiEndpoints: [
      { method: 'POST', path: '/api/v1/streams/start', description: 'Signal stream start', authRequired: true },
      { method: 'POST', path: '/api/v1/streams/stop', description: 'Terminate stream broadcast', authRequired: true }
    ],
    services: ['StreamBroadcastService'],
    permissions: ['stream.broadcast', 'stream.moderate'],
    events: ['StreamStarted', 'StreamEnded'],
    jobs: ['ArchiveStreamRecordingJob'],
    dependencies: [1, 17],
    tests: ['StreamKeyAuthTest'],
    codeTemplates: {
      controller: `namespace Modules\\LiveStreaming\\Controllers;

use App\\Http\\Controllers\\Controller;
use Modules\\LiveStreaming\\Services\\StreamBroadcastService;
use Modules\\LiveStreaming\\Requests\\StartStreamRequest;
use Modules\\LiveStreaming\\Resources\\LiveStreamResource;
use Illuminate\\Http\\JsonResponse;
use Illuminate\\Http\\Request;

class StreamController extends Controller
{
    public function __construct(
        protected StreamBroadcastService $streamService
    ) {}

    public function start(StartStreamRequest $request): JsonResponse
    {
        $this->authorize('stream.broadcast');

        $stream = $this->streamService->startStream(
            $request->user(),
            $request->validated()
        );

        return response()->json([
            'success' => true,
            'data' => new LiveStreamResource($stream)
        ], 201);
    }

    public function stop(Request $request): JsonResponse
    {
        $this->authorize('stream.broadcast');

        $stream = $this->streamService->stopStream($request->user());

        return response()->json([
            'success' => true,
            'data' => new LiveStreamResource($stream)
        ]);
    }
}`,
      model: `namespace Modules\\LiveStreaming\\Models;

use Illuminate\\Database\\Eloquent\\Model;
use Illuminate\\Database\\Eloquent\\Relations\\BelongsTo;
use Modules\\IdentityManagement\\Models\\User;

class LiveStream extends Model
{
    protected $table = 'live_streams';

    protected $fillable = ['host_id', 'stream_key', 'title', 'viewer_count', 'status'];

    protected $casts = [
        'viewer_count' => 'integer',
    ];

    public function host(): BelongsTo
    {
        return $this->belongsTo(User::class, 'host_id');
    }

    public function scopeLive($query)
    {
        return $query->where('status', 'live');
    }
}`,
      service: `namespace Modules\\LiveStreaming\\Services;

use Modules\\LiveStreaming\\Models\\LiveStream;
use Modules\\LiveStreaming\\Events\\StreamStarted;
use Modules\\LiveStreaming\\Events\\StreamEnded;
use Modules\\IdentityManagement\\Models\\User;
use Illuminate\\Support\\Facades\\DB;
use Illuminate\\Support\\Str;

class StreamBroadcastService
{
    public function startStream(User $host, array $attributes): LiveStream
    {
        return DB::transaction(function () use ($host, $attributes) {
            $streamKey = Str::random(64);

            $stream = LiveStream::create([
                'host_id' => $host->id,
                'stream_key' => $streamKey,
                'title' => $attributes['title'],
                'viewer_count' => 0,
                'status' => 'live',
            ]);

            event(new StreamStarted($stream));

            return $stream;
        });
    }

    public function stopStream(User $host): LiveStream
    {
        $stream = LiveStream::where('host_id', $host->id)
            ->where('status', 'live')
            ->firstOrFail();

        $stream->update(['status' => 'ended']);

        event(new StreamEnded($stream));

        return $stream;
    }

    public function incrementViewerCount(LiveStream $stream): void
    {
        $stream->increment('viewer_count');
    }
}`,
      formRequest: `namespace Modules\\LiveStreaming\\Requests;

use Illuminate\\Foundation\\Http\\FormRequest;

class StartStreamRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('stream.broadcast') ?? false;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
        ];
    }
}`,
      migration: `Schema::create('live_streams', function (Blueprint $table) {
    $table->id();
    $table->foreignId('host_id')->constrained('users')->cascadeOnDelete();
    $table->char('stream_key', 64)->unique();
    $table->string('title');
    $table->unsignedInteger('viewer_count')->default(0);
    $table->enum('status', ['idle', 'live', 'ended'])->default('idle');
    $table->timestamps();
    $table->index('host_id');
});`,
      policy: `namespace Modules\\LiveStreaming\\Policies;

use Modules\\IdentityManagement\\Models\\User;

class StreamPolicy
{
    public function broadcast(User $user): bool
    {
        return $user->hasPermissionTo('stream.broadcast');
    }

    public function moderate(User $user): bool
    {
        return $user->hasPermissionTo('stream.moderate');
    }
}`
    },
    sampleRecords: [
      { id: 44, title: 'System Architecture Live Q&A', status: 'idle', viewer_count: 0 }
    ],
    status: 'Configured'
  },
  {
    id: 19,
    code: 'MOD-019',
    name: 'Creator Management',
    slug: 'creator-management',
    category: 'Social',
    phase: 2,
    iconName: 'Sparkles',
    purpose: 'Digital creator accounts, subscriber tiers, tip jars, perk delivery, and monthly payouts.',
    responsibilities: [
      'Manage creator monetization onboarding and verification',
      'Configurable monthly patron subscription tiers',
      'Exclusive digital content gating and reward fulfillment'
    ],
    databaseTables: [
      {
        name: 'creator_profiles',
        description: 'Creator payout and tier settings.',
        primaryKey: 'id (BIGINT UNSIGNED)',
        foreignKeys: [{ column: 'user_id', references: 'id', table: 'users' }],
        columns: [
          { name: 'id', type: 'BIGINT UNSIGNED', nullable: false },
          { name: 'user_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
          { name: 'tier', type: 'VARCHAR(32)', nullable: false },
          { name: 'payout_status', type: 'ENUM("verified","pending","restricted")', nullable: false },
          { name: 'total_supporters', type: 'INT UNSIGNED', nullable: false }
        ],
        indexes: ['idx_creator_user']
      }
    ],
    apiEndpoints: [
      { method: 'GET', path: '/api/v1/creators/{id}', description: 'Fetch creator tier roster', authRequired: false },
      { method: 'POST', path: '/api/v1/creators/tiers', description: 'Configure creator tier', authRequired: true }
    ],
    services: ['CreatorEconomyService'],
    permissions: ['creator.monetize', 'creator.manage-tiers'],
    events: ['SupporterSubscribed'],
    jobs: ['CalculateCreatorMonthlyPayoutJob'],
    dependencies: [1],
    tests: ['CreatorTierAllocationTest'],
    codeTemplates: {
      controller: `namespace Modules\\CreatorManagement\\Controllers;

use App\\Http\\Controllers\\Controller;
use Modules\\CreatorManagement\\Services\\CreatorEconomyService;
use Modules\\CreatorManagement\\Requests\\CreateTierRequest;
use Modules\\CreatorManagement\\Resources\\CreatorProfileResource;
use Illuminate\\Http\\JsonResponse;
use Illuminate\\Http\\Request;

class CreatorController extends Controller
{
    public function __construct(
        protected CreatorEconomyService $creatorService
    ) {}

    public function show(int $id): JsonResponse
    {
        $profile = $this->creatorService->getById($id);

        return response()->json([
            'success' => true,
            'data' => new CreatorProfileResource($profile)
        ]);
    }

    public function storeTier(CreateTierRequest $request): JsonResponse
    {
        $this->authorize('creator.manage-tiers');

        $profile = $this->creatorService->createTier(
            $request->user(),
            $request->validated()
        );

        return response()->json([
            'success' => true,
            'data' => new CreatorProfileResource($profile)
        ], 201);
    }
}`,
      model: `namespace Modules\\CreatorManagement\\Models;

use Illuminate\\Database\\Eloquent\\Model;
use Illuminate\\Database\\Eloquent\\Relations\\BelongsTo;
use Modules\\IdentityManagement\\Models\\User;

class CreatorProfile extends Model
{
    protected $table = 'creator_profiles';

    protected $fillable = ['user_id', 'tier', 'payout_status', 'total_supporters'];

    protected $casts = [
        'total_supporters' => 'integer',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function scopeVerified($query)
    {
        return $query->where('payout_status', 'verified');
    }
}`,
      service: `namespace Modules\\CreatorManagement\\Services;

use Modules\\CreatorManagement\\Models\\CreatorProfile;
use Modules\\CreatorManagement\\Events\\SupporterSubscribed;
use Modules\\IdentityManagement\\Models\\User;
use Illuminate\\Support\\Facades\\DB;

class CreatorEconomyService
{
    public function getById(int $id): CreatorProfile
    {
        return CreatorProfile::with('user:id,uuid,email')->findOrFail($id);
    }

    public function getOrCreate(User $user): CreatorProfile
    {
        return CreatorProfile::firstOrCreate(
            ['user_id' => $user->id],
            [
                'tier' => 'free',
                'payout_status' => 'pending',
                'total_supporters' => 0,
            ]
        );
    }

    public function createTier(User $user, array $attributes): CreatorProfile
    {
        return DB::transaction(function () use ($user, $attributes) {
            $profile = $this->getOrCreate($user);

            $profile->update([
                'tier' => $attributes['tier'],
            ]);

            return $profile;
        });
    }

    public function incrementSupporters(CreatorProfile $profile): void
    {
        $profile->increment('total_supporters');
        event(new SupporterSubscribed($profile));
    }
}`,
      formRequest: `namespace Modules\\CreatorManagement\\Requests;

use Illuminate\\Foundation\\Http\\FormRequest;

class CreateTierRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('creator.manage-tiers') ?? false;
    }

    public function rules(): array
    {
        return [
            'tier' => ['required', 'string', 'max:32'],
        ];
    }
}`,
      migration: `Schema::create('creator_profiles', function (Blueprint $table) {
    $table->id();
    $table->foreignId('user_id')->constrained('users')->cascadeOnDelete();
    $table->string('tier', 32)->default('free');
    $table->enum('payout_status', ['verified', 'pending', 'restricted'])->default('pending');
    $table->unsignedInteger('total_supporters')->default(0);
    $table->timestamps();
    $table->index('user_id');
    $table->unique('user_id');
});`,
      policy: `namespace Modules\\CreatorManagement\\Policies;

use Modules\\IdentityManagement\\Models\\User;

class CreatorPolicy
{
    public function monetize(User $user): bool
    {
        return $user->hasPermissionTo('creator.monetize');
    }

    public function manageTiers(User $user): bool
    {
        return $user->hasPermissionTo('creator.manage-tiers');
    }
}`
    },
    sampleRecords: [
      { id: 18, creator: 'DevAdvocate Labs', tier: 'Pro Patron', total_supporters: 420, payout_status: 'verified' }
    ],
    status: 'Configured'
  },
  {
    id: 20,
    code: 'MOD-020',
    name: 'Influencer Management',
    slug: 'influencer-management',
    category: 'Social',
    phase: 2,
    iconName: 'Megaphone',
    purpose: 'Brand partnership briefs, influencer matching, deliverable proof verification, and ROI attribution.',
    responsibilities: [
      'Draft and negotiate brand sponsorship agreements',
      'Verify social post links and campaign deliverables',
      'Aggregate click-through rates and campaign revenue attribution'
    ],
    databaseTables: [
      {
        name: 'influencer_campaigns',
        description: 'Sponsorship engagements and deliverables.',
        primaryKey: 'id (BIGINT UNSIGNED)',
        foreignKeys: [{ column: 'influencer_id', references: 'id', table: 'users' }],
        columns: [
          { name: 'id', type: 'BIGINT UNSIGNED', nullable: false },
          { name: 'influencer_id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
          { name: 'campaign_name', type: 'VARCHAR(255)', nullable: false },
          { name: 'budget', type: 'DECIMAL(12,2)', nullable: false },
          { name: 'status', type: 'ENUM("draft","active","review","completed")', nullable: false }
        ],
        indexes: ['idx_influencer_status']
      }
    ],
    apiEndpoints: [
      { method: 'GET', path: '/api/v1/influencers/campaigns', description: 'List brand partnerships', authRequired: true },
      { method: 'POST', path: '/api/v1/influencers/campaigns', description: 'Create sponsorship brief', authRequired: true }
    ],
    services: ['InfluencerCampaignService'],
    permissions: ['influencer.manage', 'campaign.create'],
    events: ['CampaignBriefAccepted'],
    jobs: ['AggregateCampaignEngagementJob'],
    dependencies: [1, 19],
    tests: ['CampaignDeliverableFulfillmentTest'],
    codeTemplates: {
      controller: `namespace Modules\\InfluencerManagement\\Controllers;

use App\\Http\\Controllers\\Controller;
use Modules\\InfluencerManagement\\Services\\InfluencerCampaignService;
use Modules\\InfluencerManagement\\Requests\\CreateCampaignBriefRequest;
use Modules\\InfluencerManagement\\Resources\\CampaignResource;
use Illuminate\\Http\\JsonResponse;
use Illuminate\\Http\\Request;

class InfluencerController extends Controller
{
    public function __construct(
        protected InfluencerCampaignService $campaignService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $this->authorize('influencer.manage');

        $campaigns = $this->campaignService->getPaginated(
            $request->user(),
            $request->query('per_page', 25)
        );

        return response()->json([
            'success' => true,
            'data' => CampaignResource::collection($campaigns)
        ]);
    }

    public function store(CreateCampaignBriefRequest $request): JsonResponse
    {
        $this->authorize('campaign.create');

        $campaign = $this->campaignService->createBrief(
            $request->user(),
            $request->validated()
        );

        return response()->json([
            'success' => true,
            'data' => new CampaignResource($campaign)
        ], 201);
    }
}`,
      model: `namespace Modules\\InfluencerManagement\\Models;

use Illuminate\\Database\\Eloquent\\Model;
use Illuminate\\Database\\Eloquent\\Relations\\BelongsTo;
use Modules\\IdentityManagement\\Models\\User;

class InfluencerCampaign extends Model
{
    protected $table = 'influencer_campaigns';

    protected $fillable = ['influencer_id', 'campaign_name', 'budget', 'status'];

    protected $casts = [
        'budget' => 'decimal:2',
    ];

    public function influencer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'influencer_id');
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }
}`,
      service: `namespace Modules\\InfluencerManagement\\Services;

use Modules\\InfluencerManagement\\Models\\InfluencerCampaign;
use Modules\\InfluencerManagement\\Events\\CampaignBriefAccepted;
use Modules\\IdentityManagement\\Models\\User;
use Illuminate\\Support\\Facades\\DB;

class InfluencerCampaignService
{
    public function getPaginated(User $user, int $perPage = 25)
    {
        return InfluencerCampaign::where('influencer_id', $user->id)
            ->with('influencer:id,uuid,email')
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    public function createBrief(User $influencer, array $attributes): InfluencerCampaign
    {
        return DB::transaction(function () use ($influencer, $attributes) {
            $campaign = InfluencerCampaign::create([
                'influencer_id' => $influencer->id,
                'campaign_name' => $attributes['campaign_name'],
                'budget' => $attributes['budget'],
                'status' => 'draft',
            ]);

            event(new CampaignBriefAccepted($campaign));

            return $campaign;
        });
    }

    public function approveBrief(InfluencerCampaign $campaign): void
    {
        $campaign->update(['status' => 'active']);
    }

    public function completeCampaign(InfluencerCampaign $campaign): void
    {
        $campaign->update(['status' => 'completed']);
    }
}`,
      formRequest: `namespace Modules\\InfluencerManagement\\Requests;

use Illuminate\\Foundation\\Http\\FormRequest;

class CreateCampaignBriefRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('campaign.create') ?? false;
    }

    public function rules(): array
    {
        return [
            'campaign_name' => ['required', 'string', 'max:255'],
            'budget' => ['required', 'numeric', 'min:0', 'max:999999999.99'],
        ];
    }
}`,
      migration: `Schema::create('influencer_campaigns', function (Blueprint $table) {
    $table->id();
    $table->foreignId('influencer_id')->constrained('users')->cascadeOnDelete();
    $table->string('campaign_name');
    $table->decimal('budget', 12, 2);
    $table->enum('status', ['draft', 'active', 'review', 'completed'])->default('draft');
    $table->timestamps();
    $table->index(['influencer_id', 'status']);
});`,
      policy: `namespace Modules\\InfluencerManagement\\Policies;

use Modules\\IdentityManagement\\Models\\User;

class InfluencerPolicy
{
    public function manage(User $user): bool
    {
        return $user->hasPermissionTo('influencer.manage');
    }

    public function createCampaign(User $user): bool
    {
        return $user->hasPermissionTo('campaign.create');
    }
}`
    },
    sampleRecords: [
      { id: 91, campaign_name: 'Summer SaaS Tech Sprint', budget: '$12,500.00', status: 'active' }
    ],
    status: 'Configured'
  }
];
