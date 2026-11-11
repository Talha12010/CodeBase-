export function generateNodeBackendCode(module) {
  const pascalName = toPascalCase(module.name);
  const entityName = pascalName.endsWith('s') ? pascalName.slice(0, -1) : pascalName;
  const primaryTable = module.databaseTables[0] || {
    name: `${module.slug.replace(/-/g, '_')}`,
    columns: [
      { name: 'id', type: 'BIGINT UNSIGNED', nullable: false },
      { name: 'name', type: 'VARCHAR(255)', nullable: false },
      { name: 'status', type: 'VARCHAR(50)', nullable: false },
      { name: 'created_at', type: 'TIMESTAMP', nullable: false }
    ],
    primaryKey: 'id'
  };

  const mongooseFields = primaryTable.columns
    .filter(col => col.name !== 'id' && col.name !== '_id' && col.name !== 'created_at' && col.name !== 'updated_at')
    .map(col => {
      const lower = col.type.toLowerCase();
      let mType = 'String';
      if (lower.includes('int') || lower.includes('decimal') || lower.includes('float') || lower.includes('numeric')) {
        mType = 'Number';
      } else if (lower.includes('bool') || lower.includes('tinyint(1)')) {
        mType = 'Boolean';
      } else if (lower.includes('json')) {
        mType = 'Schema.Types.Mixed';
      } else if (lower.includes('date') || lower.includes('time')) {
        mType = 'Date';
      }

      const isRequired = !col.nullable && col.name !== 'status';
      const isIndex = ('index' in col && Boolean(col.index)) ? ', index: true' : '';
      const defValue = col.name === 'status' ? ", default: 'active', enum: ['active', 'pending', 'archived', 'suspended']" : '';

      return `    ${col.name}: { type: ${mType}, required: ${isRequired}${isIndex}${defValue} },`;
    })
    .join('\n');

  const code = `/**
 * ${module.name} (${module.code})
 * Copy-paste ready Node.js + Express + MongoDB backend
 *
 * Setup:
 *   npm init -y
 *   npm install express mongoose
 *   node server.js
 */

const express = require('express');
const mongoose = require('mongoose');
const { Schema } = mongoose;

// ─── Config ──────────────────────────────────────────────────────────────────

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/${module.slug.replace(/-/g, '_')}';

// ─── Mongoose Model ──────────────────────────────────────────────────────────

const ${entityName}Schema = new Schema(
  {
    tenantId: { type: String, required: true, index: true },
${mongooseFields}
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      }
    }
  }
);

const ${entityName} = mongoose.model('${entityName}', ${entityName}Schema);

// ─── Simple Validation ───────────────────────────────────────────────────────

function validate${entityName}(data, isUpdate = false) {
  const errors = [];

  if (!isUpdate) {
    if (!data.name || typeof data.name !== 'string' || data.name.trim().length < 2) {
      errors.push('name must be at least 2 characters');
    }
  } else {
    if (data.name !== undefined && (typeof data.name !== 'string' || data.name.trim().length < 2)) {
      errors.push('name must be at least 2 characters');
    }
  }

  if (data.status !== undefined) {
    const valid = ['active', 'pending', 'archived', 'suspended'];
    if (!valid.includes(data.status)) {
      errors.push('status must be one of: ' + valid.join(', '));
    }
  }

  if (data.description !== undefined && typeof data.description !== 'string') {
    errors.push('description must be a string');
  }

  return errors;
}

// ─── Routes ──────────────────────────────────────────────────────────────────

const app = express();

app.use(express.json());

// CORS (allow all origins for dev)
app.use((_req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (_req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

// GET /api/v1/${module.slug} — List records
app.get('/api/v1/${module.slug}', async (req, res) => {
  try {
    const tenantId = req.query.tenantId || 'tenant_default';
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
    const skip = (page - 1) * limit;

    const filter = { tenantId };

    if (req.query.status) {
      filter.status = req.query.status;
    }

    if (req.query.search) {
      const safe = String(req.query.search).replace(/[.*+?^()[\\\\]{}]/g, '\\\\$&');
      filter.\$or = [
        { name: { \$regex: safe, \$options: 'i' } },
        { code: { \$regex: safe, \$options: 'i' } }
      ];
    }

    const [records, total] = await Promise.all([
      ${entityName}.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      ${entityName}.countDocuments(filter)
    ]);

    res.json({ success: true, data: records, meta: { total, page, limit, module: '${module.code}' } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/v1/${module.slug}/:id — Get one record
app.get('/api/v1/${module.slug}/:id', async (req, res) => {
  try {
    const tenantId = req.query.tenantId || 'tenant_default';
    const record = await ${entityName}.findOne({ _id: req.params.id, tenantId }).lean();

    if (!record) {
      return res.status(404).json({ success: false, error: '${entityName} not found' });
    }

    res.json({ success: true, data: record });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/v1/${module.slug} — Create record
app.post('/api/v1/${module.slug}', async (req, res) => {
  try {
    const errors = validate${entityName}(req.body);
    if (errors.length > 0) {
      return res.status(400).json({ success: false, error: errors.join(', ') });
    }

    const tenantId = req.body.tenantId || 'tenant_default';
    const doc = new ${entityName}({
      ...req.body,
      tenantId,
      status: req.body.status || 'active'
    });

    const saved = await doc.save();
    res.status(201).json({ success: true, data: saved, message: '${entityName} created successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH /api/v1/${module.slug}/:id/status — Update status
app.patch('/api/v1/${module.slug}/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ success: false, error: 'status is required' });
    }

    const valid = ['active', 'pending', 'archived', 'suspended'];
    if (!valid.includes(status)) {
      return res.status(400).json({ success: false, error: 'status must be one of: ' + valid.join(', ') });
    }

    const tenantId = req.body.tenantId || 'tenant_default';
    const record = await ${entityName}.findOneAndUpdate(
      { _id: req.params.id, tenantId },
      { status },
      { new: true }
    );

    if (!record) {
      return res.status(404).json({ success: false, error: '${entityName} not found' });
    }

    res.json({ success: true, data: record, message: '${entityName} status updated to ' + status });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH /api/v1/${module.slug}/:id — Update fields
app.patch('/api/v1/${module.slug}/:id', async (req, res) => {
  try {
    const errors = validate${entityName}(req.body, true);
    if (errors.length > 0) {
      return res.status(400).json({ success: false, error: errors.join(', ') });
    }

    const tenantId = req.body.tenantId || 'tenant_default';
    const { tenantId: _, ...updateData } = req.body;
    const record = await ${entityName}.findOneAndUpdate(
      { _id: req.params.id, tenantId },
      { \$set: updateData },
      { new: true, runValidators: true }
    );

    if (!record) {
      return res.status(404).json({ success: false, error: '${entityName} not found' });
    }

    res.json({ success: true, data: record, message: '${entityName} updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/v1/${module.slug}/:id — Delete record
app.delete('/api/v1/${module.slug}/:id', async (req, res) => {
  try {
    const tenantId = req.body?.tenantId || req.query.tenantId || 'tenant_default';
    const record = await ${entityName}.findOneAndDelete({ _id: req.params.id, tenantId });

    if (!record) {
      return res.status(404).json({ success: false, error: '${entityName} not found' });
    }

    res.json({ success: true, message: '${entityName} deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── Error Handler ───────────────────────────────────────────────────────────

app.use((err, _req, res, _next) => {
  console.error('[Error]', err.message);
  res.status(err.status || 500).json({ success: false, error: err.message || 'Internal server error' });
});

// ─── Start ───────────────────────────────────────────────────────────────────

async function start() {
  await mongoose.connect(MONGO_URI);
  console.log('[MongoDB] Connected to', MONGO_URI);
  app.listen(PORT, () => {
    console.log('[Server] http://localhost:' + PORT);
    console.log('[API]    GET    /api/v1/${module.slug}');
    console.log('[API]    GET    /api/v1/${module.slug}/:id');
    console.log('[API]    POST   /api/v1/${module.slug}');
    console.log('[API]    PATCH  /api/v1/${module.slug}/:id');
    console.log('[API]    PATCH  /api/v1/${module.slug}/:id/status');
    console.log('[API]    DELETE /api/v1/${module.slug}/:id');
  });
}

start().catch((err) => {
  console.error('[Startup] Failed:', err.message);
  process.exit(1);
});
`;

  return { server: code };
}

function toPascalCase(str) {
  return str.replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase()).replace(/^[a-z]/, (c) => c.toUpperCase());
}
