import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  Search,
  Plus,
  RefreshCw,
  Trash2,
  CheckCircle2,
  Database,
  Code2,
  Layers,
  X,
  SlidersHorizontal,
  FileCode
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useModuleRecords } from '../../../hooks/useModuleApi';

export const LiveModuleFrontend = ({
  module,
  onViewSourceCode
}) => {
  const {
    records,
    isLoading,
    error,
    fetchRecords,
    createRecord,
    updateRecordStatus,
    deleteRecord,
    clearError
  } = useModuleRecords(module.slug, module.name, module.sampleRecords || []);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newStatus, setNewStatus] = useState('active');
  const [selectedRecord, setSelectedRecord] = useState(null);

  useEffect(() => {
    fetchRecords({ search: searchTerm, status: statusFilter !== 'all' ? statusFilter : undefined });
  }, [fetchRecords, searchTerm, statusFilter]);

  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      const matchesSearch =
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(r.id).includes(searchTerm);
      const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [records, searchTerm, statusFilter]);

  const handleRefresh = () => {
    fetchRecords({ search: searchTerm, status: statusFilter !== 'all' ? statusFilter : undefined });
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      await createRecord({
        name: newTitle.trim(),
        status: newStatus
      });
      setNewTitle('');
      setIsCreateModalOpen(false);
    } catch (err) {
      console.error('Create failed:', err);
    }
  };

  const handleToggleStatus = async (id) => {
    const record = records.find((r) => r.id === id);
    if (!record) return;

    const nextStatus = record.status === 'active' ? 'suspended' : record.status === 'suspended' ? 'pending' : 'active';
    await updateRecordStatus(id, nextStatus);
  };

  const handleDelete = async (id) => {
    if (selectedRecord?.id === id) {
      setSelectedRecord(null);
    }
    await deleteRecord(id);
  };

  return (
    <div
      id={`${module.slug}-frontend-preview`}
      className="lmf-container"
    >
      <style>{`
        @keyframes lmf-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes lmf-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .lmf-container {
          width: 100%;
          background-color: #000;
          border: 1px solid #27272a;
          border-radius: 1rem;
          padding: 1.25rem;
          color: #fff;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
          position: relative;
        }
        @media (min-width: 640px) {
          .lmf-container { padding: 1.5rem; }
        }

        .lmf-topbar {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          border-bottom: 1px solid #27272a;
          padding-bottom: 1.25rem;
        }
        @media (min-width: 640px) {
          .lmf-topbar { flex-direction: row; align-items: center; }
        }

        .lmf-topbar-info {
          display: flex;
          flex-direction: column;
        }
        .lmf-topbar-info > * + * {
          margin-top: 0.25rem;
        }

        .lmf-meta-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .lmf-module-code {
          font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace;
          font-size: 0.75rem;
          font-weight: 700;
          color: #fff;
          background-color: #18181b;
          padding: 0.125rem 0.5rem;
          border-radius: 0.25rem;
          border: 1px solid #3f3f46;
        }

        .lmf-tech-label {
          font-size: 11px;
          color: #a1a1aa;
          font-weight: 500;
        }

        .lmf-badge-pill {
          padding: 0.125rem 0.5rem;
          font-size: 10px;
          font-weight: 600;
          border-radius: 9999px;
          background-color: #27272a;
          color: #fff;
          border: 1px solid #52525b;
        }

        .lmf-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #fff;
          letter-spacing: -0.025em;
        }

        .lmf-description {
          font-size: 0.75rem;
          color: #a1a1aa;
          max-width: 42rem;
          line-height: 1.625;
        }

        .lmf-actions {
          display: flex;
          align-items: center;
          gap: 0.625rem;
        }

        .lmf-btn-icon {
          padding: 0.5rem;
          border-radius: 0.5rem;
          background-color: #18181b;
          border: 1px solid #3f3f46;
          color: #d4d4d8;
          transition-property: color, background-color;
          transition-duration: 150ms;
          cursor: pointer;
        }
        .lmf-btn-icon:hover {
          background-color: #27272a;
          color: #fff;
        }

        .lmf-btn-secondary {
          padding: 0.5rem 0.75rem;
          background-color: #18181b;
          border: 1px solid #3f3f46;
          font-size: 0.75rem;
          font-weight: 600;
          border-radius: 0.5rem;
          display: flex;
          align-items: center;
          gap: 0.375rem;
          transition-property: color, background-color;
          transition-duration: 150ms;
          cursor: pointer;
        }
        .lmf-btn-secondary:hover {
          background-color: #27272a;
        }

        .lmf-btn-primary {
          padding: 0.5rem 0.875rem;
          background-color: #fff;
          color: #000;
          font-weight: 700;
          font-size: 0.75rem;
          border-radius: 0.5rem;
          display: flex;
          align-items: center;
          gap: 0.375rem;
          transition-property: color, background-color;
          transition-duration: 150ms;
          cursor: pointer;
          box-shadow: 0 4px 6px -1px rgba(255, 255, 255, 0.1), 0 2px 4px -2px rgba(255, 255, 255, 0.1);
        }
        .lmf-btn-primary:hover {
          background-color: #e4e4e7;
        }

        .lmf-filterbar {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
        }

        .lmf-search-wrapper {
          position: relative;
          flex: 1;
          max-width: 24rem;
          min-width: 200px;
        }

        .lmf-search-icon {
          width: 1rem;
          height: 1rem;
          position: absolute;
          left: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          color: #71717a;
        }

        .lmf-search-input {
          width: 100%;
          background-color: #09090b;
          border: 1px solid #27272a;
          border-radius: 0.5rem;
          padding-left: 2.25rem;
          padding-right: 1rem;
          padding-top: 0.375rem;
          padding-bottom: 0.375rem;
          font-size: 0.75rem;
          color: #fff;
          outline: none;
          transition-property: border-color;
          transition-duration: 150ms;
        }
        .lmf-search-input::placeholder {
          color: #71717a;
        }
        .lmf-search-input:focus {
          border-color: #fff;
        }

        .lmf-status-tabs {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          background-color: #09090b;
          padding: 0.25rem;
          border-radius: 0.5rem;
          border: 1px solid #27272a;
          font-size: 0.75rem;
        }

        .lmf-status-tab {
          padding: 0.25rem 0.625rem;
          border-radius: 0.25rem;
          color: #a1a1aa;
          text-transform: capitalize;
          cursor: pointer;
          transition-property: color, background-color;
          transition-duration: 150ms;
        }
        .lmf-status-tab:hover {
          color: #fff;
        }
        .lmf-status-tab--active {
          background-color: #fff;
          color: #000;
          font-weight: 700;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .lmf-record-count {
          font-size: 0.75rem;
          font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace;
          color: #a1a1aa;
        }

        .lmf-record-count-val {
          color: #fff;
          font-weight: 700;
        }

        .lmf-table-wrap {
          border: 1px solid #27272a;
          border-radius: 0.75rem;
          overflow: hidden;
          background-color: #09090b;
        }

        .lmf-table-scroll {
          overflow-x: auto;
        }

        .lmf-table {
          width: 100%;
          text-align: left;
          font-size: 0.75rem;
          font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace;
        }

        .lmf-table-head {
          background-color: #000;
          color: #a1a1aa;
          border-bottom: 1px solid #27272a;
          font-weight: 600;
        }

        .lmf-table-cell {
          padding: 0.75rem 1rem;
        }

        .lmf-table-body {
          border-top: 1px solid rgba(39, 39, 42, 0.6);
        }

        .lmf-table-row {
          transition-property: background-color;
          transition-duration: 150ms;
        }
        .lmf-table-row:hover {
          background-color: rgba(24, 24, 27, 0.5);
        }

        .lmf-table-cell-id {
          padding: 0.75rem 1rem;
          color: #fff;
          font-weight: 700;
          font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace;
        }

        .lmf-table-cell-name {
          padding: 0.75rem 1rem;
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif;
          font-weight: 500;
          color: #fff;
        }

        .lmf-name-inner {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .lmf-selected-dot {
          width: 0.375rem;
          height: 0.375rem;
          border-radius: 9999px;
          background-color: #fff;
          animation: lmf-pulse 2s infinite;
        }

        .lmf-status-badge {
          padding: 0.125rem 0.5rem;
          font-size: 10px;
          font-weight: 700;
          border-radius: 0.25rem;
          text-transform: uppercase;
        }

        .lmf-badge-active {
          background-color: #fff;
          color: #000;
          border: 1px solid #fff;
        }

        .lmf-badge-pending {
          background-color: #27272a;
          color: #fff;
          border: 1px solid #52525b;
        }

        .lmf-badge-suspended {
          background-color: #000;
          color: #a1a1aa;
          border: 1px solid #27272a;
        }

        .lmf-table-cell-date {
          padding: 0.75rem 1rem;
          color: #a1a1aa;
        }

        .lmf-table-cell-actions {
          padding: 0.75rem 1rem;
          text-align: right;
        }

        .lmf-actions-row {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 0.375rem;
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif;
        }

        .lmf-btn-sm {
          padding: 0.25rem 0.625rem;
          font-size: 11px;
          border-radius: 0.25rem;
          background-color: #18181b;
          border: 1px solid #3f3f46;
          color: #e4e4e7;
          transition-property: color, background-color;
          transition-duration: 150ms;
          cursor: pointer;
        }
        .lmf-btn-sm:hover {
          background-color: #27272a;
        }

        .lmf-btn-sm--inspect {
          padding: 0.25rem 0.5rem;
          font-size: 11px;
          border-radius: 0.25rem;
          background-color: #18181b;
          border: 1px solid #3f3f46;
          color: #d4d4d8;
          transition-property: color, background-color;
          transition-duration: 150ms;
          cursor: pointer;
        }
        .lmf-btn-sm--inspect:hover {
          background-color: #27272a;
        }

        .lmf-btn-delete {
          padding: 0.375rem;
          color: #71717a;
          transition-property: color;
          transition-duration: 150ms;
          cursor: pointer;
        }
        .lmf-btn-delete:hover {
          color: #fff;
        }

        .lmf-loading-cell {
          padding: 2.5rem;
          text-align: center;
          color: #71717a;
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif;
        }

        .lmf-loading-text {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          animation: lmf-pulse 2s infinite;
        }

        .lmf-spin {
          animation: lmf-spin 1s linear infinite;
        }

        .lmf-empty-cell {
          padding: 2.5rem;
          text-align: center;
          color: #71717a;
          font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif;
        }

        .lmf-inspector {
          background-color: #09090b;
          border: 1px solid #27272a;
          border-radius: 0.75rem;
          padding: 1rem;
          font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace;
          font-size: 0.75rem;
        }

        .lmf-inspector-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #27272a;
          padding-bottom: 0.5rem;
        }

        .lmf-inspector-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .lmf-close-btn {
          color: #a1a1aa;
          cursor: pointer;
        }
        .lmf-close-btn:hover {
          color: #fff;
        }

        .lmf-json {
          color: #d4d4d8;
          max-height: 10rem;
          overflow-y: auto;
          line-height: 1.625;
          padding-top: 0.25rem;
        }

        .lmf-overlay {
          position: fixed;
          inset: 0;
          z-index: 50;
          background-color: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
        }

        .lmf-modal {
          background-color: #09090b;
          border: 1px solid #27272a;
          border-radius: 1rem;
          max-width: 28rem;
          width: 100%;
          padding: 1.5rem;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
        }

        .lmf-modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #27272a;
          padding-bottom: 0.75rem;
        }

        .lmf-modal-title {
          font-size: 1rem;
          font-weight: 700;
          color: #fff;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .lmf-form {
          display: flex;
          flex-direction: column;
        }

        .lmf-form-field {
          margin-bottom: 1rem;
        }

        .lmf-label {
          display: block;
          font-size: 0.75rem;
          color: #a1a1aa;
          margin-bottom: 0.25rem;
        }

        .lmf-input {
          width: 100%;
          background-color: #000;
          border: 1px solid #27272a;
          border-radius: 0.5rem;
          padding: 0.5rem 0.75rem;
          font-size: 0.75rem;
          color: #fff;
          outline: none;
          transition-property: border-color;
          transition-duration: 150ms;
        }
        .lmf-input:focus {
          border-color: #fff;
        }

        .lmf-radio-group {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .lmf-radio-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.75rem;
          color: #d4d4d8;
          cursor: pointer;
        }

        .lmf-radio {
          accent-color: #fff;
        }

        .lmf-modal-footer {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 0.5rem;
          padding-top: 0.75rem;
          border-top: 1px solid #27272a;
        }

        .lmf-btn-cancel {
          padding: 0.375rem 0.875rem;
          border-radius: 0.5rem;
          font-size: 0.75rem;
          color: #a1a1aa;
          cursor: pointer;
        }
        .lmf-btn-cancel:hover {
          color: #fff;
        }

        .lmf-btn-save {
          padding: 0.375rem 1rem;
          background-color: #fff;
          color: #000;
          font-weight: 700;
          font-size: 0.75rem;
          border-radius: 0.5rem;
          transition-property: color, background-color;
          transition-duration: 150ms;
          cursor: pointer;
        }
        .lmf-btn-save:hover {
          background-color: #e4e4e7;
        }
        .lmf-error-banner {
          padding: 0.75rem 1rem;
          background-color: #18181b;
          border: 1px solid #3f3f46;
          border-radius: 0.5rem;
          color: #fff;
          font-size: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1rem;
        }
        .lmf-error-dismiss {
          color: #a1a1aa;
          cursor: pointer;
          background: none;
          border: none;
          font-size: 0.75rem;
        }
        .lmf-error-dismiss:hover {
          color: #fff;
        }
      `}</style>

      {/* Error Banner */}
      {error && (
        <div className="lmf-error-banner">
          <span>{error}</span>
          <button onClick={clearError} className="lmf-error-dismiss">Dismiss</button>
        </div>
      )}

      {/* Top Bar / App Header */}
      <div className="lmf-topbar">
        <div className="lmf-topbar-info">
          <div className="lmf-meta-row">
            <span className="lmf-module-code">
              {module.code}
            </span>
            <span className="lmf-tech-label">React 19 &bull; JavaScript &bull; Internal CSS</span>
            <span className="lmf-badge-pill">
              Interactive Preview
            </span>
          </div>
          <h3 className="lmf-title">{module.name} Frontend</h3>
          <p className="lmf-description">
            {module.purpose}
          </p>
        </div>

        <div className="lmf-actions">
          <motion.button
            id={`${module.slug}-refresh-action`}
            onClick={handleRefresh}
            disabled={isLoading}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="lmf-btn-icon"
            title="Simulate TanStack Query Invalidation / Refetch"
          >
            <RefreshCw size={16} style={{ color: '#fff' }} className={isLoading ? 'lmf-spin' : ''} />
          </motion.button>

          {onViewSourceCode && (
            <motion.button
              onClick={() => onViewSourceCode('component')}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="lmf-btn-secondary"
            >
              <FileCode size={14} style={{ color: '#a1a1aa' }} />
              View TSX
            </motion.button>
          )}

          <motion.button
            id={`${module.slug}-open-add-modal`}
            onClick={() => setIsCreateModalOpen(true)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="lmf-btn-primary"
          >
            <Plus size={16} style={{ color: '#000' }} />
            Add Record
          </motion.button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="lmf-filterbar">
        <div className="lmf-search-wrapper">
          <Search className="lmf-search-icon" />
          <input
            id={`${module.slug}-search-field`}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={`Filter ${module.name} records...`}
            className="lmf-search-input"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="lmf-status-tabs">
          {(['all', 'active', 'pending', 'suspended']).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`lmf-status-tab ${statusFilter === st ? 'lmf-status-tab--active' : ''}`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="lmf-record-count">
          Total: <span className="lmf-record-count-val">{filteredRecords.length}</span> / {records.length}
        </div>
      </div>

      {/* Interactive Table */}
      <div className="lmf-table-wrap">
        <div className="lmf-table-scroll">
          <table className="lmf-table">
            <thead className="lmf-table-head">
              <tr>
                <th className="lmf-table-cell">Entity ID</th>
                <th className="lmf-table-cell">Primary Attribute</th>
                <th className="lmf-table-cell">Lifecycle Status</th>
                <th className="lmf-table-cell">Created</th>
                <th className="lmf-table-cell" style={{ textAlign: 'right' }}>Quick Actions</th>
              </tr>
            </thead>
            <tbody className="lmf-table-body">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="lmf-loading-cell">
                    <div className="lmf-loading-text">
                      <RefreshCw size={16} style={{ color: '#fff' }} className="lmf-spin" />
                      Simulating async Axios request with Sanctum token...
                    </div>
                  </td>
                </tr>
              ) : filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={5} className="lmf-empty-cell">
                    No matching records found. Click &quot;Add Record&quot; to insert one.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((r) => (
                  <motion.tr
                    key={r.id}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="lmf-table-row"
                  >
                    <td className="lmf-table-cell-id">
                      #{r.id}
                    </td>
                    <td className="lmf-table-cell-name">
                      <div className="lmf-name-inner">
                        <span>{r.name}</span>
                        {r.id === selectedRecord?.id && (
                          <span className="lmf-selected-dot" />
                        )}
                      </div>
                    </td>
                    <td className="lmf-table-cell">
                      <span
                        className={`lmf-status-badge ${
                          r.status === 'active'
                            ? 'lmf-badge-active'
                            : r.status === 'pending'
                            ? 'lmf-badge-pending'
                            : 'lmf-badge-suspended'
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                    <td className="lmf-table-cell-date">
                      {r.created_at}
                    </td>
                    <td className="lmf-table-cell-actions">
                      <div className="lmf-actions-row">
                        <motion.button
                          onClick={() => handleToggleStatus(r.id)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="lmf-btn-sm"
                          title="Simulate status transition mutation"
                        >
                          Toggle Status
                        </motion.button>
                        <motion.button
                          onClick={() => setSelectedRecord(r)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="lmf-btn-sm--inspect"
                          title="Inspect Record Payload"
                        >
                          Inspect
                        </motion.button>
                        <motion.button
                          onClick={() => handleDelete(r.id)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="lmf-btn-delete"
                          title="Delete Record"
                        >
                          <Trash2 size={14} />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected Record Inspector Drawer */}
      {selectedRecord && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="lmf-inspector"
        >
          <div className="lmf-inspector-header">
            <div className="lmf-inspector-title">
              <Code2 size={16} style={{ color: '#fff' }} />
              <span className="font-bold text-white">Record Payload Inspector: #{selectedRecord.id}</span>
            </div>
            <button
              onClick={() => setSelectedRecord(null)}
              className="lmf-close-btn"
            >
              <X size={16} />
            </button>
          </div>
          <pre className="lmf-json">
            {JSON.stringify(selectedRecord, null, 2)}
          </pre>
        </motion.div>
      )}

      {/* Create Record Modal Dialog */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="lmf-overlay">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="lmf-modal"
            >
              <div className="lmf-modal-header">
                <h4 className="lmf-modal-title">
                  <Plus size={16} style={{ color: '#fff' }} />
                  Add {module.name} Record
                </h4>
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="lmf-close-btn"
                >
              <X size={16} />
                </button>
              </div>

              <form onSubmit={handleCreate} className="lmf-form">
                <div className="lmf-form-field">
                  <label className="lmf-label">
                    Record Identifier / Title
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder={`e.g. ${module.name} Unit Alpha`}
                    className="lmf-input"
                  />
                </div>

                <div className="lmf-form-field">
                  <label className="lmf-label">Initial Status</label>
                  <div className="lmf-radio-group">
                    <label className="lmf-radio-label">
                      <input
                        type="radio"
                        name="status"
                        checked={newStatus === 'active'}
                        onChange={() => setNewStatus('active')}
                        className="lmf-radio"
                      />
                      <span>Active</span>
                    </label>
                    <label className="lmf-radio-label" style={{ marginLeft: '1rem' }}>
                      <input
                        type="radio"
                        name="status"
                        checked={newStatus === 'pending'}
                        onChange={() => setNewStatus('pending')}
                        className="lmf-radio"
                      />
                      <span>Pending</span>
                    </label>
                  </div>
                </div>

                <div className="lmf-modal-footer">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="lmf-btn-cancel"
                  >
                    Cancel
                  </button>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="lmf-btn-save"
                  >
                    Save &amp; Mount to State
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
