function toPascalCase(str) {
  return str.replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase()).replace(/^[a-z]/, (c) => c.toUpperCase());
}

export function generateFrontendCode(module) {
  const pascalName = toPascalCase(module.name);
  const entityName = pascalName.endsWith('s') ? pascalName.slice(0, -1) : pascalName;

  const listEndpoint = module.apiEndpoints.find((e) => e.method === 'GET' && !e.path.includes('{')) || {
    method: 'GET',
    path: `/api/v1/${module.slug}`,
    description: `List all ${module.name} records`,
    authRequired: true
  };

  const createEndpoint = module.apiEndpoints.find((e) => e.method === 'POST') || {
    method: 'POST',
    path: `/api/v1/${module.slug}`,
    description: `Create new ${module.name} record`,
    authRequired: true
  };

  const statusEndpoint = module.apiEndpoints.find((e) => e.path.includes('status')) || {
    method: 'PATCH',
    path: `${listEndpoint.path}/{id}/status`,
    description: `Update ${module.name} record status`,
    authRequired: true
  };

  const deleteEndpoint = module.apiEndpoints.find((e) => e.method === 'DELETE' && e.path.includes('{id}')) || {
    method: 'DELETE',
    path: `${listEndpoint.path}/{id}`,
    description: `Delete ${module.name} record`,
    authRequired: true
  };

  const listPath = listEndpoint.path.replace('/api/v1', '');
  const createPath = createEndpoint.path.replace('/api/v1', '');
  const statusPath = statusEndpoint.path.replace('/api/v1', '');
  const deletePath = deleteEndpoint.path.replace('/api/v1', '');

  const component = `/**
 * ${module.code} — ${module.name}
 * ${module.purpose}
 */

// ─────────────────────────────────────────────────────────────────────────────
// 1. Imports
// ─────────────────────────────────────────────────────────────────────────────

import React, { useState, useEffect, useCallback } from 'react';

// ─────────────────────────────────────────────────────────────────────────────
// 2. Constants / Config
// ─────────────────────────────────────────────────────────────────────────────

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

// ─────────────────────────────────────────────────────────────────────────────
// 3. API Functions
// ─────────────────────────────────────────────────────────────────────────────

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('auth_token');
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      ...(token ? { Authorization: \`Bearer \${token}\` } : {}),
      ...options.headers,
    },
    credentials: 'include',
    ...options,
  };

  const response = await fetch(\`\${BASE_URL}\${endpoint}\`, config);

  if (!response.ok) {
    let message = 'API Request Failed';
    try {
      const errBody = await response.json();
      message = errBody.message || errBody.error || message;
    } catch {}
    throw new Error(\`\${response.status}: \${message}\`);
  }

  if (response.status === 204) return null;
  return response.json();
}

async function list${pascalName}(params = {}) {
  const query = new URLSearchParams(params).toString();
  const endpoint = '${listPath}' + (query ? \`?\${query}\` : '');
  return request(endpoint);
}

async function create${entityName}(payload) {
  return request('${createPath}', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

async function update${entityName}Status(id, status) {
  const path = '${statusPath}'.replace('{id}', id);
  return request(path, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

async function delete${entityName}(id) {
  const path = '${deletePath}'.replace('{id}', id);
  return request(path, {
    method: 'DELETE',
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. Custom Hook
// ─────────────────────────────────────────────────────────────────────────────

function use${pascalName}(initialParams = { page: 1, per_page: 15 }) {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [params, setParams] = useState(initialParams);
  const [updatingIds, setUpdatingIds] = useState(new Set());
  const [deletingIds, setDeletingIds] = useState(new Set());

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await list${pascalName}(params);
      setItems(response.data);
      setTotal(response.meta.total);
    } catch (err) {
      setError(err.message || 'Failed to load records');
    } finally {
      setIsLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const createItem = async (dto) => {
    try {
      const result = await create${entityName}(dto);
      const created = result.data || result;
      setItems((prev) => [created, ...prev]);
      setTotal((prev) => prev + 1);
      return created;
    } catch (err) {
      setError(err.message || 'Creation failed');
      throw err;
    }
  };

  const updateStatus = async (id, newStatus) => {
    setUpdatingIds((prev) => new Set(prev).add(id));
    const previousItems = items;

    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );

    try {
      await update${entityName}Status(id, newStatus);
    } catch (err) {
      setItems(previousItems);
      setError(err.message || 'Status update failed');
    } finally {
      setUpdatingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const deleteItem = async (id) => {
    setDeletingIds((prev) => new Set(prev).add(id));
    const previousItems = items;
    const previousTotal = total;

    setItems((prev) => prev.filter((item) => item.id !== id));
    setTotal((prev) => Math.max(0, prev - 1));

    try {
      await delete${entityName}(id);
    } catch (err) {
      setItems(previousItems);
      setTotal(previousTotal);
      setError(err.message || 'Delete failed');
    } finally {
      setDeletingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const clearError = useCallback(() => setError(null), []);

  return {
    items, total, isLoading, error, params, setParams,
    refetch: fetchData, createItem, updateStatus, deleteItem,
    clearError, updatingIds, deletingIds
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// 5–7. Component: State → Handlers → JSX
// ─────────────────────────────────────────────────────────────────────────────

export const ${pascalName}Manager = () => {

  // ── Hook state ──────────────────────────────────────────────────────────

  const {
    items, total, isLoading, error, params, setParams,
    refetch, createItem, updateStatus, deleteItem,
    clearError, updatingIds, deletingIds
  } = use${pascalName}();

  // ── Local state ─────────────────────────────────────────────────────────

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // ── Handlers ────────────────────────────────────────────────────────────

  const handleSearch = (e) => {
    e.preventDefault();
    setParams({ ...params, search: searchTerm, page: 1 });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setIsSubmitting(true);
    try {
      await createItem({ name: newTitle, status: 'active' });
      setNewTitle('');
      setIsModalOpen(false);
    } catch (err) {
      // error already set in hook
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (id, name) => {
    setDeleteConfirm({ id, name: name || \`Record #\${id}\` });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm) return;
    const { id } = deleteConfirm;
    setDeleteConfirm(null);
    try {
      await deleteItem(id);
    } catch (err) {
      // error already set in hook
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirm(null);
  };

  // ── JSX ─────────────────────────────────────────────────────────────────

  return (
    <div id="${module.slug}-manager-root" className="cm-root">

      <div className="cm-header">
        <div className="cm-header-left">
          <div className="cm-header-row">
            <span className="cm-code">${module.code}</span>
            <h2 className="cm-title">${module.name}</h2>
          </div>
          <p className="cm-subtitle">${module.purpose}</p>
        </div>

        <div className="cm-header-actions">
          <button
            id="${module.slug}-refresh-btn"
            onClick={() => refetch()}
            disabled={isLoading}
            className="cm-btn-icon"
            title="Refresh Data"
          >
            <span className={isLoading ? 'cm-spin' : ''}>&#8635;</span>
          </button>

          <button
            id="${module.slug}-create-btn"
            onClick={() => setIsModalOpen(true)}
            className="cm-btn-primary"
          >
            + Add Record
          </button>
        </div>
      </div>

      <div className="cm-filterbar">
        <form onSubmit={handleSearch} className="cm-search-wrap">
          <span className="cm-search-icon">&#128269;</span>
          <input
            id="${module.slug}-search-input"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search records..."
            className="cm-search-input"
          />
        </form>

        <div className="cm-total">
          Total: <span className="cm-total-val">{total}</span> records
        </div>
      </div>

      {error && (
        <div className="cm-error">
          <span className="cm-error-msg">{error}</span>
          <button onClick={() => refetch()} className="cm-error-retry">Retry</button>
          <button onClick={clearError} className="cm-error-dismiss">&#10005;</button>
        </div>
      )}

      <div className="cm-table-wrap">
        <div className="cm-table-scroll">
          <table className="cm-table">
            <thead className="cm-table-head">
              <tr>
                <th className="cm-th">ID</th>
                <th className="cm-th">Entity / Descriptor</th>
                <th className="cm-th">Status</th>
                <th className="cm-th-right">Actions</th>
              </tr>
            </thead>
            <tbody className="cm-table-body">
              {isLoading && items.length === 0 ? (
                <tr>
                  <td colSpan={4} className="cm-loading">
                    <div className="cm-loading-text">
                      <span className="cm-spin">&#8635;</span>
                      Loading records...
                    </div>
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={4} className="cm-empty">
                    No records found. Click &quot;Add Record&quot; to initialize.
                  </td>
                </tr>
              ) : (
                items.map((record) => {
                  const isUpdating = updatingIds.has(record.id);
                  const isDeleting = deletingIds.has(record.id);
                  const isRowBusy = isUpdating || isDeleting;
                  return (
                    <tr key={record.id} className="cm-table-row" style={{ opacity: isDeleting ? 0.5 : 1 }}>
                      <td className="cm-td-id">#{record.id}</td>
                      <td className="cm-td-name">
                        {record.name || record.title || \`${module.name} Item #\${record.id}\`}
                      </td>
                      <td className="cm-td">
                        <span className={\`cm-badge \${record.status === 'active' ? 'cm-badge-active' : 'cm-badge-inactive'}\`}>
                          {record.status || 'Active'}
                        </span>
                      </td>
                      <td className="cm-td-right">
                        <div className="cm-actions-cell">
                          <button
                            onClick={() => updateStatus(record.id, record.status === 'active' ? 'suspended' : 'active')}
                            disabled={isRowBusy}
                            className="cm-btn-sm"
                          >
                            {isUpdating ? 'Saving...' : 'Toggle Status'}
                          </button>
                          <button
                            onClick={() => handleDeleteClick(record.id, record.name || record.title)}
                            disabled={isRowBusy}
                            className="cm-btn-delete"
                            title="Delete"
                          >
                            &#10005;
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="cm-overlay">
          <div className="cm-modal">
            <h3 className="cm-modal-title">Create ${entityName} Record</h3>
            <form onSubmit={handleCreate} className="cm-form">
              <div>
                <label className="cm-label">Record Name / Title</label>
                <input
                  id="${module.slug}-create-name-input"
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Enter record identifier..."
                  className="cm-input"
                />
              </div>

              <div className="cm-modal-actions">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="cm-btn-cancel"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="cm-btn-save"
                >
                  {isSubmitting ? 'Saving...' : 'Save Record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="cm-overlay">
          <div className="cm-modal">
            <h3 className="cm-modal-title">Confirm Delete</h3>
            <p className="cm-confirm-text">
              Are you sure you want to delete <span className="cm-confirm-name">{deleteConfirm.name}</span>? This action cannot be undone.
            </p>
            <div className="cm-modal-actions">
              <button
                type="button"
                onClick={handleDeleteCancel}
                className="cm-btn-cancel"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="cm-btn-danger"
              >
                Delete Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Internal CSS ─────────────────────────────────────────────────── */}
      <style>{\`
        @keyframes cm-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes cm-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }

        .cm-root { width: 100%; background-color: #000; border: 1px solid #27272a; border-radius: 1rem; padding: 1.5rem; color: #fff; display: flex; flex-direction: column; gap: 1.5rem; }

        .cm-header { display: flex; flex-direction: column; gap: 1rem; padding-bottom: 1.25rem; border-bottom: 1px solid #27272a; }
        @media (min-width: 640px) { .cm-header { flex-direction: row; align-items: center; justify-content: space-between; } }
        .cm-header-left { display: flex; flex-direction: column; gap: 0.5rem; }
        .cm-header-row { display: flex; align-items: center; gap: 0.5rem; }
        .cm-header-actions { display: flex; align-items: center; gap: 0.75rem; }

        .cm-code { font-family: monospace; font-size: 0.75rem; font-weight: 700; color: #fff; background-color: #18181b; padding: 0.125rem 0.5rem; border-radius: 0.25rem; border: 1px solid #3f3f46; }
        .cm-title { font-size: 1.25rem; font-weight: 700; color: #fff; letter-spacing: -0.025em; }
        .cm-subtitle { font-size: 0.75rem; color: #a1a1aa; }

        .cm-btn-icon { padding: 0.5rem; border-radius: 0.5rem; background-color: #18181b; border: 1px solid #3f3f46; color: #d4d4d8; cursor: pointer; transition: color 0.15s, background-color 0.15s; }
        .cm-btn-icon:hover { background-color: #27272a; color: #fff; }
        .cm-btn-icon:disabled { opacity: 0.5; cursor: not-allowed; }
        .cm-spin { animation: cm-spin 1s linear infinite; }

        .cm-btn-primary { padding: 0.5rem 0.875rem; background-color: #fff; color: #000; font-weight: 700; font-size: 0.75rem; border-radius: 0.5rem; display: flex; align-items: center; gap: 0.375rem; cursor: pointer; border: none; transition: background-color 0.15s; }
        .cm-btn-primary:hover { background-color: #e4e4e7; }

        .cm-filterbar { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 0.75rem; }
        .cm-search-wrap { position: relative; flex: 1; max-width: 24rem; min-width: 200px; }
        .cm-search-icon { position: absolute; left: 0.75rem; top: 50%; transform: translateY(-50%); color: #71717a; }
        .cm-search-input { width: 100%; background-color: #09090b; border: 1px solid #27272a; border-radius: 0.5rem; padding-left: 2.25rem; padding-right: 1rem; padding-top: 0.375rem; padding-bottom: 0.375rem; font-size: 0.75rem; color: #fff; outline: none; transition: border-color 0.15s; }
        .cm-search-input::placeholder { color: #71717a; }
        .cm-search-input:focus { border-color: #fff; }
        .cm-total { font-size: 0.75rem; color: #a1a1aa; font-family: monospace; }
        .cm-total-val { color: #fff; font-weight: 700; }

        .cm-error { padding: 0.875rem 1rem; background-color: #18181b; border: 1px solid #3f3f46; color: #fff; font-size: 0.75rem; border-radius: 0.75rem; display: flex; align-items: center; justify-content: space-between; }
        .cm-error-msg { flex: 1; min-width: 0; }
        .cm-error-retry { font-family: monospace; text-decoration: underline; cursor: pointer; background: none; border: none; color: #a1a1aa; font-size: 0.75rem; white-space: nowrap; margin-left: 0.75rem; }
        .cm-error-retry:hover { color: #fff; }
        .cm-error-dismiss { font-family: monospace; cursor: pointer; background: none; border: none; color: #71717a; font-size: 0.75rem; padding: 0 0.5rem; white-space: nowrap; }
        .cm-error-dismiss:hover { color: #fff; }

        .cm-table-wrap { border: 1px solid #27272a; border-radius: 0.75rem; overflow: hidden; background-color: #09090b; }
        .cm-table-scroll { overflow-x: auto; }
        .cm-table { width: 100%; text-align: left; font-size: 0.75rem; font-family: monospace; }
        .cm-table-head { background-color: #000; color: #a1a1aa; border-bottom: 1px solid #27272a; font-weight: 600; }
        .cm-th { padding: 0.75rem 1rem; }
        .cm-th-right { padding: 0.75rem 1rem; text-align: right; }
        .cm-table-body > tr + tr { border-top: 1px solid rgba(39, 39, 42, 0.6); }
        .cm-table-row { transition: background-color 0.15s; }
        .cm-table-row:hover { background-color: rgba(24, 24, 27, 0.4); }
        .cm-td { padding: 0.75rem 1rem; }
        .cm-td-id { padding: 0.75rem 1rem; color: #fff; font-weight: 700; }
        .cm-td-name { padding: 0.75rem 1rem; font-weight: 500; color: #fff; }
        .cm-td-right { padding: 0.75rem 1rem; text-align: right; }
        .cm-actions-cell { display: flex; align-items: center; justify-content: flex-end; gap: 0.5rem; }
        .cm-btn-sm { padding: 0.25rem 0.625rem; font-size: 11px; border-radius: 0.25rem; background-color: #18181b; border: 1px solid #3f3f46; color: #e4e4e7; cursor: pointer; transition: color 0.15s, background-color 0.15s; }
        .cm-btn-sm:hover { background-color: #27272a; }
        .cm-btn-sm:disabled { opacity: 0.4; cursor: not-allowed; }
        .cm-btn-sm:disabled:hover { background-color: #18181b; }
        .cm-btn-delete { padding: 0.25rem; color: #71717a; cursor: pointer; background: none; border: none; transition: color 0.15s; }
        .cm-btn-delete:hover { color: #fff; }
        .cm-btn-delete:disabled { opacity: 0.4; cursor: not-allowed; }

        .cm-badge { padding: 0.125rem 0.5rem; font-size: 10px; font-weight: 700; border-radius: 0.25rem; text-transform: uppercase; }
        .cm-badge-active { background-color: #fff; color: #000; border: 1px solid #fff; }
        .cm-badge-inactive { background-color: #18181b; color: #a1a1aa; border: 1px solid #3f3f46; }

        .cm-loading { padding: 2rem; text-align: center; color: #71717a; }
        .cm-loading-text { display: flex; align-items: center; justify-content: center; gap: 0.5rem; animation: cm-pulse 2s infinite; }
        .cm-empty { padding: 2rem; text-align: center; color: #71717a; }

        .cm-overlay { position: fixed; inset: 0; z-index: 50; background-color: rgba(0, 0, 0, 0.8); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; padding: 1rem; }
        .cm-modal { background-color: #09090b; border: 1px solid #27272a; border-radius: 1rem; max-width: 28rem; width: 100%; padding: 1.5rem; display: flex; flex-direction: column; gap: 1rem; }
        .cm-modal-title { font-size: 1rem; font-weight: 700; color: #fff; }
        .cm-form { display: flex; flex-direction: column; gap: 1rem; }
        .cm-label { display: block; font-size: 0.75rem; color: #a1a1aa; margin-bottom: 0.25rem; }
        .cm-input { width: 100%; background-color: #000; border: 1px solid #27272a; border-radius: 0.5rem; padding: 0.5rem 0.75rem; font-size: 0.75rem; color: #fff; outline: none; transition: border-color 0.15s; }
        .cm-input:focus { border-color: #fff; }
        .cm-modal-actions { display: flex; align-items: center; justify-content: flex-end; gap: 0.5rem; padding-top: 0.75rem; border-top: 1px solid #27272a; }
        .cm-btn-cancel { padding: 0.375rem 0.875rem; border-radius: 0.5rem; font-size: 0.75rem; color: #a1a1aa; cursor: pointer; background: none; border: none; }
        .cm-btn-cancel:hover { color: #fff; }
        .cm-btn-save { padding: 0.375rem 1rem; background-color: #fff; color: #000; font-weight: 700; font-size: 0.75rem; border-radius: 0.5rem; cursor: pointer; border: none; transition: background-color 0.15s; }
        .cm-btn-save:hover { background-color: #e4e4e7; }
        .cm-btn-save:disabled { opacity: 0.5; cursor: not-allowed; }
        .cm-confirm-text { font-size: 0.875rem; color: #d4d4d8; margin-bottom: 0.5rem; }
        .cm-confirm-name { font-family: monospace; color: #fff; font-weight: 700; }
        .cm-btn-danger { padding: 0.375rem 1rem; background-color: #dc2626; color: #fff; font-weight: 700; font-size: 0.75rem; border-radius: 0.5rem; cursor: pointer; border: none; transition: background-color 0.15s; }
        .cm-btn-danger:hover { background-color: #b91c1c; }
      \`}</style>
    </div>
  );
};
`;

  const test = `/**
 * Test Suite for ${pascalName}Manager
 * Framework: Vitest + @testing-library/react
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import { ${pascalName}Manager } from './${pascalName}Manager';

const mockFetch = vi.fn();
const originalFetch = global.fetch;

beforeEach(() => {
  mockFetch.mockReset();
  global.fetch = mockFetch;
});

afterEach(() => {
  global.fetch = originalFetch;
});

describe('${pascalName}Manager', () => {
  it('renders module code and name', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: [{ id: 1, name: 'Sample Record', status: 'active' }],
        meta: { current_page: 1, last_page: 1, per_page: 15, total: 1 }
      })
    });

    render(<${pascalName}Manager />);

    expect(screen.getByText('${module.code}')).toBeInTheDocument();
    expect(screen.getByText('${module.name}')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Sample Record')).toBeInTheDocument();
    });
  });

  it('opens create modal and submits', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: [],
        meta: { current_page: 1, last_page: 1, per_page: 15, total: 0 }
      })
    });

    render(<${pascalName}Manager />);

    fireEvent.click(screen.getByRole('button', { name: /Add Record/i }));
    expect(screen.getByText(/Create ${entityName} Record/i)).toBeInTheDocument();

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: { id: 2, name: 'New Record', status: 'active' }
      })
    });

    fireEvent.change(screen.getByPlaceholderText(/Enter record identifier.../i), {
      target: { value: 'New Record' }
    });
    fireEvent.click(screen.getByRole('button', { name: /Save Record/i }));

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/'),
        expect.objectContaining({ method: 'POST' })
      );
    });
  });
});
`;

  return { component, test };
}
