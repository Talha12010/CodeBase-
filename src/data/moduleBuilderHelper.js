function toPascal(str) {
  return str.replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase()).replace(/^[a-z]/, (c) => c.toUpperCase());
}

function toSnake(str) {
  return str
    .replace(/\W+/g, '_')
    .split(/(?=[A-Z])/)
    .join('_')
    .toLowerCase()
    .replace(/__+/g, '_')
    .replace(/^_|_$/g, '');
}

function laravelColumnType(col) {
  const nullable = col.nullable ? '->nullable()' : '';
  const idx = col.index ? '->index()' : '';
  const t = col.type.toUpperCase().replace(/\s+/g, ' ').trim();
  if (col.name === 'id') return '$table->id();';
  if (col.name === 'tenant_id') return `$table->unsignedBigInteger('tenant_id')${idx};`;
  if (t === 'JSON' || t === 'JSONB') return `$table->json('${col.name}')${nullable};`;
  if (t === 'TEXT' || t === 'LONGTEXT' || t === 'TEXT[]') return `$table->text('${col.name}')${nullable};`;
  if (t.startsWith('UUID')) return `$table->uuid('${col.name}')${nullable}${idx};`;
  if (t.startsWith('CHAR')) {
    const m = t.match(/CHAR\((\d+)\)/);
    return `$table->char('${col.name}', ${m ? m[1] : '36'})${nullable}${idx};`;
  }
  if (t.startsWith('DATE') && !t.startsWith('DATETIME')) return `$table->date('${col.name}')${nullable};`;
  if (t === 'DATETIME') return `$table->dateTime('${col.name}')${nullable};`;
  if (t.startsWith('BIGINT UNSIGNED')) return `$table->unsignedBigInteger('${col.name}')${nullable}${idx};`;
  if (t.startsWith('INT')) return `$table->integer('${col.name}')${nullable};`;
  if (t.startsWith('DECIMAL')) {
    const m = t.match(/DECIMAL\((\d+),(\d+)\)/);
    return `$table->decimal('${col.name}', ${m ? `${m[1]},${m[2]}` : '10,2'})${nullable};`;
  }
  if (t.startsWith('BOOLEAN') || t === 'BOOL') return `$table->boolean('${col.name}')${nullable};`;
  if (t === 'TIMESTAMP' || col.name.endsWith('_at')) return `$table->timestamp('${col.name}')${nullable};`;
  if (t.startsWith('ENUM')) {
    const m = t.match(/ENUM\(([^)]+)\)/);
    return `$table->enum('${col.name}', [${m ? m[1] : '"draft","active"'}])${nullable};`;
  }
  if (t.startsWith('VARCHAR')) {
    const m = t.match(/VARCHAR\((\d+)\)/);
    return `$table->string('${col.name}', ${m ? m[1] : '255'})${nullable}${idx};`;
  }
  return `$table->string('${col.name}')${nullable};`;
}

function phpValidationRule(col) {
  if (col.name === 'id' || col.name === 'created_at' || col.name === 'updated_at') return '';
  const req = col.nullable ? 'nullable' : 'required';
  const t = col.type.toUpperCase().replace(/\s+/g, ' ').trim();
  if (t === 'JSON' || t === 'JSONB') return `'${col.name}' => ['${req}', 'array'],`;
  if (t === 'BOOLEAN' || t === 'BOOL') return `'${col.name}' => ['${req}', 'boolean'],`;
  if (t === 'TEXT' || t === 'LONGTEXT' || t === 'TEXT[]') return `'${col.name}' => ['${req}', 'string'],`;
  if (t.startsWith('UUID')) return `'${col.name}' => ['${req}', 'string', 'uuid'],`;
  if (t.startsWith('INT')) return `'${col.name}' => ['${req}', 'integer'],`;
  if (t.startsWith('DECIMAL')) return `'${col.name}' => ['${req}', 'numeric', 'min:0'],`;
  if (t.startsWith('ENUM')) {
    const m = t.match(/ENUM\(([^)]+)\)/);
    const vals = m ? m[1].replace(/"/g, "'") : "'draft','active'";
    return `'${col.name}' => ['${req}', 'string', 'in:${vals.replace(/'/g, '')}'],`;
  }
  if (t.startsWith('VARCHAR') || t.startsWith('CHAR')) {
    const m = t.match(/(?:VARCHAR|CHAR)\((\d+)\)/);
    const max = m ? m[1] : '255';
    if (col.name.includes('email')) return `'${col.name}' => ['${req}', 'string', 'email', 'max:${max}'],`;
    if (col.name.includes('phone')) return `'${col.name}' => ['${req}', 'string', 'max:${max}'],`;
    if (col.name.includes('url')) return `'${col.name}' => ['${req}', 'string', 'url', 'max:${max}'],`;
    if (col.name.endsWith('_at')) return `'${col.name}' => ['${req}', 'date'],`;
    return `'${col.name}' => ['${req}', 'string', 'max:${max}'],`;
  }
  if (t.startsWith('DATE')) return `'${col.name}' => ['${req}', 'date'],`;
  return `'${col.name}' => ['${req}', 'string', 'max:255'],`;
}

export function buildModule(input) {
  const code = `MOD-${input.id.toString().padStart(3, '0')}`;
  const slug = input.slug || input.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const pascalName = toPascal(input.name);
  const tableName = input.tableName || `${toSnake(input.name)}_records`;
  const icon = input.iconName || 'Layers';

  const defaultColumns = input.tableColumns || [
    { name: 'id', type: 'BIGINT UNSIGNED', nullable: false, index: true },
    { name: 'reference_code', type: 'VARCHAR(64)', nullable: false, index: true },
    { name: 'name', type: 'VARCHAR(255)', nullable: false },
    { name: 'status', type: 'ENUM("draft","pending","active","completed","archived")', nullable: false },
    { name: 'metadata', type: 'JSON', nullable: true },
    { name: 'created_at', type: 'TIMESTAMP', nullable: false },
    { name: 'updated_at', type: 'TIMESTAMP', nullable: false }
  ];

  const primaryTable = {
    name: tableName,
    description: input.tableDescription || `Core datastore for ${input.name} operations.`,
    primaryKey: 'id (BIGINT UNSIGNED)',
    foreignKeys: [{ column: 'tenant_id', references: 'id', table: 'tenants' }],
    columns: defaultColumns,
    indexes: [`${tableName}_ref_unique`, `idx_${tableName}_status`]
  };

  const databaseTables = [primaryTable];
  if (input.secondaryTable) {
    databaseTables.push(input.secondaryTable);
  }

  const defaultEndpoints = input.endpoints || [
    {
      method: 'GET',
      path: `/api/v1/${slug}`,
      description: `List paginated ${input.name} records`,
      permission: `${slug}.view`,
      authRequired: true,
      sampleResponse: { success: true, count: 24, data: [] }
    },
    {
      method: 'POST',
      path: `/api/v1/${slug}`,
      description: `Create new ${input.name} entry`,
      permission: `${slug}.create`,
      authRequired: true,
      sampleRequest: { name: 'Sample Item', status: 'active', metadata: {} },
      sampleResponse: { success: true, id: 1042, code: `${code}-9901` }
    },
    {
      method: 'GET',
      path: `/api/v1/${slug}/{id}`,
      description: `Retrieve specific ${input.name} details by ID`,
      permission: `${slug}.view`,
      authRequired: true
    },
    {
      method: 'PATCH',
      path: `/api/v1/${slug}/{id}/status`,
      description: `Transition status of a ${input.name} item`,
      permission: `${slug}.manage`,
      authRequired: true
    }
  ];

  const services = input.services || [`${pascalName}Service`, `${pascalName}Engine`];
  const permissions = input.permissions || [`${slug}.view`, `${slug}.create`, `${slug}.manage`, `${slug}.delete`];
  const events = input.events || [`${pascalName}Created`, `${pascalName}StatusChanged`, `${pascalName}Processed`];
  const jobs = input.jobs || [`Process${pascalName}Job`, `Audit${pascalName}MetricsJob`];
  const dependencies = input.dependencies || [1];
  const tests = input.tests || [`${pascalName}WorkflowTest`, `${pascalName}AuthorizationTest`];

  const fillableFields = defaultColumns
    .filter(c => c.name !== 'id' && !c.name.endsWith('_at') && c.name !== 'created_at' && c.name !== 'updated_at')
    .map(c => c.name);
  const fillableList = fillableFields.map(f => `        '${f}',`).join('\n');

  const castEntries = [];
  defaultColumns.forEach(c => {
    if (c.type === 'JSON') castEntries.push(`        '${c.name}' => 'array',`);
    if (c.type.startsWith('DECIMAL')) castEntries.push(`        '${c.name}' => 'decimal:2',`);
    if (c.name.endsWith('_at') && c.type === 'TIMESTAMP') castEntries.push(`        '${c.name}' => 'datetime',`);
    if (c.type.startsWith('BOOLEAN')) castEntries.push(`        '${c.name}' => 'boolean',`);
  });
  if (!castEntries.some(e => e.includes('created_at'))) {
    castEntries.push(`        'created_at' => 'datetime',`);
    castEntries.push(`        'updated_at' => 'datetime',`);
  }

  const statusCol = defaultColumns.find(c => c.name === 'status');
  const statusValues = statusCol?.type?.match(/ENUM\(([^)]+)\)/)?.[1] || '"draft","pending","active","completed","archived"';
  const statusArray = statusValues.replace(/"/g, '').split(',').map(s => s.trim());
  const statusValidation = statusArray.join(',');
  const hasStatus = !!statusCol;

  const migrationLines = defaultColumns.map(c => `            ${laravelColumnType(c)}`);
  migrationLines.push("            $table->timestamps();");
  if (!defaultColumns.some(c => c.name === 'deleted_at')) {
    migrationLines.push("            $table->softDeletes();");
  }

  const validationRules = defaultColumns
    .map(c => `            ${phpValidationRule(c)}`)
    .filter(r => r.trim() !== '');

  const foreignKeyCols = defaultColumns.filter(c => c.name.endsWith('_id') && c.name !== 'tenant_id' && c.name !== 'id');
  const relationships = foreignKeyCols.map(c => {
    const relName = c.name.replace('_id', '');
    const relModel = toPascal(relName);
    return `    public function ${relName}(): BelongsTo\n    {\n        return $this->belongsTo(${relModel}::class);\n    }`;
  });

  const hasManyCols = defaultColumns.filter(c => c.name.endsWith('_count'));
  const hasManyRels = hasManyCols.map(c => {
    const singular = c.name.replace('_count', '');
    const relModel = toPascal(singular);
    return `    public function ${singular}s(): HasMany\n    {\n        return $this->hasMany(${relModel}::class);\n    }`;
  });

  const eventImports = events.map(e => `use App\\Modules\\${pascalName}\\Events\\${e};`).join('\n');
  const eventDispatches = events.length > 0
    ? `\n\n            event(new ${events[0]}($record));`
    : '';

  const searchColumns = defaultColumns.filter(c =>
    c.type.startsWith('VARCHAR') && !c.name.endsWith('_id') && c.name !== 'tenant_id'
  );
  const searchWheres = searchColumns.slice(0, 2).map(c =>
    `->when($filters['search'] ?? null, fn($q, $s) => $q->where('${c.name}', 'like', "%{\$s}%"))`
  ).join('\n            ');

  const filterableCols = defaultColumns.filter(c =>
    c.type.startsWith('ENUM') || c.name === 'tenant_id' || c.type.startsWith('INT')
  );
  const filterWheres = filterableCols.map(c =>
    `->when($filters['${c.name}'] ?? null, fn($q, $v) => $q->where('${c.name}', $v))`
  ).join('\n            ');

  const endpointMethods = defaultEndpoints.map(ep => {
    const perm = ep.permission || `${slug}.${ep.method === 'GET' ? 'view' : ep.method === 'POST' ? 'create' : 'manage'}`;
    if (ep.method === 'GET' && ep.path.includes('{id}')) {
      return `    public function show(${pascalName} $record): JsonResponse\n    {\n        $this->authorize('${perm}', $record);\n\n        return response()->json([\n            'success' => true,\n            'data' => $record\n        ]);\n    }`;
    }
    if (ep.method === 'GET') {
      return `    public function index(Request $request): JsonResponse\n    {\n        $this->authorize('${perm}');\n        $records = $this->service->getPaginated($request->all());\n\n        return response()->json([\n            'success' => true,\n            'module' => '${code}',\n            'data' => $records\n        ]);\n    }`;
    }
    if (ep.method === 'POST' && !ep.path.includes('{id}')) {
      return `    public function store(Store${pascalName}Request $request): JsonResponse\n    {\n        $record = $this->service->create($request->validated());\n\n        return response()->json([\n            'success' => true,\n            'message' => '${input.name} successfully created',\n            'data' => $record\n        ], 201);\n    }`;
    }
    if (ep.method === 'PATCH' || ep.method === 'PUT') {
      return `    public function update(Update${pascalName}Request $request, ${pascalName} $record): JsonResponse\n    {\n        $this->authorize('${perm}', $record);\n        $updated = $this->service->update($record, $request->validated());\n\n        return response()->json([\n            'success' => true,\n            'message' => '${input.name} successfully updated',\n            'data' => $updated\n        ]);\n    }`;
    }
    if (ep.method === 'DELETE') {
      return `    public function destroy(${pascalName} $record): JsonResponse\n    {\n        $this->authorize('${perm}', $record);\n        $this->service->delete($record);\n\n        return response()->json([\n            'success' => true,\n            'message' => '${input.name} successfully deleted'\n        ]);\n    }`;
    }
    return '';
  }).filter(Boolean);

  const controllerMethods = endpointMethods.length > 0 ? endpointMethods.join('\n\n') : `    public function index(Request $request): JsonResponse\n    {\n        $this->authorize('${slug}.view');\n        $records = $this->service->getPaginated($request->all());\n\n        return response()->json([\n            'success' => true,\n            'module' => '${code}',\n            'data' => $records\n        ]);\n    }\n\n    public function store(Store${pascalName}Request $request): JsonResponse\n    {\n        $record = $this->service->create($request->validated());\n\n        return response()->json([\n            'success' => true,\n            'message' => '${input.name} successfully created',\n            'data' => $record\n        ], 201);\n    }`;

  const statusTransitionMethod = hasStatus ? `
    public function transitionStatus(${pascalName} $record, string $newStatus): ${pascalName}
    {
        return DB::transaction(function () use ($record, $newStatus) {
            $record->update(['status' => $newStatus]);
            event(new ${events[1] || `${pascalName}StatusChanged`}($record, $newStatus));
            return $record->fresh();
        });
    }` : '';

  const policyMethods = permissions.map(p => {
    const action = p.split('.').pop() || 'view';
    const methodName = action === 'manage' ? 'update' : action === 'create' ? 'create' : action === 'delete' ? 'delete' : 'view';
    return `    public function ${methodName}(User $user, ${pascalName} $model): bool\n    {\n        return $user->hasPermissionTo('${p}');\n    }`;
  }).filter((v, i, a) => a.indexOf(v) === i);

  const codeTemplates = {
    controller: `namespace App\\Modules\\${pascalName}\\Http\\Controllers;

use App\\Http\\Controllers\\Controller;
use App\\Modules\\${pascalName}\\Services\\${pascalName}Service;
use App\\Modules\\${pascalName}\\Requests\\Store${pascalName}Request;
use App\\Modules\\${pascalName}\\Requests\\Update${pascalName}Request;
use App\\Modules\\${pascalName}\\Models\\${pascalName};
use Illuminate\\Http\\JsonResponse;
use Illuminate\\Http\\Request;

final class ${pascalName}Controller extends Controller
{
    public function __construct(
        private readonly ${pascalName}Service $service
    ) {}

${controllerMethods}
}`,
    model: `namespace App\\Modules\\${pascalName}\\Models;

use Illuminate\\Database\\Eloquent\\Model;
use Illuminate\\Database\\Eloquent\\SoftDeletes;
use Illuminate\\Database\\Eloquent\\Factories\\HasFactory;
use Illuminate\\Database\\Eloquent\\Relations\\BelongsTo;
use Illuminate\\Database\\Eloquent\\Relations\\HasMany;

class ${pascalName} extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = '${tableName}';

    protected $fillable = [
${fillableList}
        'tenant_id'
    ];

    protected $casts = [
${castEntries.join('\n')}
    ];

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class);
    }
${relationships.length > 0 ? '\n' + relationships.join('\n\n') : ''}
${hasManyRels.length > 0 ? '\n' + hasManyRels.join('\n\n') : ''}
}`,
    service: `namespace App\\Modules\\${pascalName}\\Services;

use App\\Modules\\${pascalName}\\Models\\${pascalName};
${eventImports}
use Illuminate\\Support\\Facades\\DB;
use Illuminate\\Support\\Str;

final class ${pascalName}Service
{
    public function getPaginated(array $filters = []): mixed
    {
        return ${pascalName}::query()
            ${hasStatus ? `->when($filters['status'] ?? null, fn($q, $s) => $q->where('status', $s))` : ''}
            ${searchWheres}
            ${filterWheres}
            ->latest()
            ->paginate($filters['per_page'] ?? 15);
    }

    public function getById(int $id): ${pascalName}
    {
        return ${pascalName}::findOrFail($id);
    }

    public function create(array $payload): ${pascalName}
    {
        return DB::transaction(function () use ($payload) {
            $payload['reference_code'] = '${code}-' . strtoupper(Str::random(6));
            $record = ${pascalName}::create($payload);${eventDispatches}
            return $record;
        });
    }

    public function update(${pascalName} $record, array $payload): ${pascalName}
    {
        return DB::transaction(function () use ($record, $payload) {
            $record->update($payload);
            ${events[1] ? `event(new ${events[1]}($record));` : ''}
            return $record->fresh();
        });
    }

    public function delete(${pascalName} $record): void
    {
        DB::transaction(function () use ($record) {
            $record->delete();
            ${events[2] || events[0] ? `event(new ${events[2] || events[0]}($record));` : ''}
        });
    }${statusTransitionMethod}
}`,
    formRequest: `namespace App\\Modules\\${pascalName}\\Requests;

use Illuminate\\Foundation\\Http\\FormRequest;

final class Store${pascalName}Request extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('${slug}.create') ?? false;
    }

    public function rules(): array
    {
        return [
${validationRules.join('\n')}
        ];
    }
}

final class Update${pascalName}Request extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()?->can('${slug}.manage') ?? false;
    }

    public function rules(): array
    {
        return [
${validationRules.map(r => r.replace(/\['required'/g, "['sometimes'")).join('\n')}
        ];
    }
}`,
    migration: `use Illuminate\\Database\\Migrations\\Migration;
use Illuminate\\Database\\Schema\\Blueprint;
use Illuminate\\Support\\Facades\\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('${tableName}', function (Blueprint $table) {
${migrationLines.join('\n')}
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('${tableName}');
    }
};`,
    policy: `namespace App\\Modules\\${pascalName}\\Policies;

use App\\Models\\User;
use App\\Modules\\${pascalName}\\Models\\${pascalName};

final class ${pascalName}Policy
{
${policyMethods.join('\n\n')}
}`
  };

  const sampleRecords = input.sampleRecords || [
    {
      id: 101,
      code: `${code}-Alpha`,
      name: `Production ${input.name} Standard`,
      status: 'active',
      updated: '10 mins ago',
      assignedTo: 'SecOps Team'
    },
    {
      id: 102,
      code: `${code}-Beta`,
      name: `High-Availability ${input.name} Node`,
      status: 'active',
      updated: '1 hour ago',
      assignedTo: 'Platform Core'
    },
    {
      id: 103,
      code: `${code}-Gamma`,
      name: `Staging Validation ${input.name}`,
      status: 'pending',
      updated: 'Just now',
      assignedTo: 'Integration QA'
    }
  ];

  return {
    id: input.id,
    code,
    name: input.name,
    slug,
    category: input.category,
    phase: input.phase || Math.min(4, Math.floor((input.id - 1) / 100) + 1),
    iconName: icon,
    purpose: input.purpose,
    responsibilities: input.responsibilities,
    databaseTables,
    apiEndpoints: defaultEndpoints,
    services,
    permissions,
    events,
    jobs,
    dependencies,
    tests,
    codeTemplates,
    sampleRecords,
    status: input.status || 'Active'
  };
}
