import React, { useState, useEffect, useCallback } from 'react';
import {
  Activity,
  Power,
  Clock,
  Zap,
  Server,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ALL_MODULES } from '../../data/allModules';
import { useModuleAuditLogs, useSystemHealth, useModuleMaintenance } from '../../hooks/useModuleApi';

export const SystemGovernanceView = () => {
  const [moduleStates, setModuleStates] = useState({
    'MOD-001': 'active',
    'MOD-002': 'active',
    'MOD-041': 'active',
    'MOD-044': 'active',
    'MOD-065': 'active',
    'MOD-100': 'active'
  });

  const [error, setError] = useState(null);
  const { auditLogs, isLoading: auditLoading, fetchAuditLogs } = useModuleAuditLogs();
  const { systemHealth, isLoading: healthLoading, fetchSystemHealth } = useSystemHealth();
  const { toggleModuleMaintenance } = useModuleMaintenance();

  useEffect(() => {
    fetchAuditLogs();
    fetchSystemHealth();
  }, [fetchAuditLogs, fetchSystemHealth]);

  const toggleModuleState = async (code) => {
    const currentState = moduleStates[code] || 'active';
    const nextState = currentState === 'active' ? 'maintenance' : 'active';

    setModuleStates((prev) => ({
      ...prev,
      [code]: nextState
    }));

    try {
      await toggleModuleMaintenance(code);
    } catch (err) {
      setModuleStates((prev) => ({
        ...prev,
        [code]: currentState
      }));
      setError(err.message || 'Failed to toggle module state');
    }
  };

  const criticalModules = ALL_MODULES.filter((m) =>
    ['MOD-001', 'MOD-002', 'MOD-041', 'MOD-044', 'MOD-065', 'MOD-100'].includes(m.code)
  );

  return (
    <>
      <style>{`
        .sgv-container { max-width: 80rem; margin-left: auto; margin-right: auto; padding-left: 1rem; padding-right: 1rem; padding-top: 1.5rem; padding-bottom: 1.5rem; display: flex; flex-direction: column; gap: 1.5rem; }
        .sgv-header { padding-bottom: 0.75rem; border-bottom: 1px solid #27272a; }
        .sgv-title { font-size: 1.25rem; font-weight: 700; color: #fff; display: flex; align-items: center; gap: 0.5rem; }
        .sgv-title-icon { width: 1.25rem; height: 1.25rem; color: #fff; }
        .sgv-subtitle { font-size: 0.75rem; color: #a1a1aa; margin-top: 0.125rem; }
        .sgv-health-grid { display: grid; gap: 1rem; }
        .sgv-health-card { border: 1px solid #27272a; border-radius: 0.75rem; padding: 1rem; }
        .sgv-health-card-bg { background-color: #18181b; }
        .sgv-health-header { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem; }
        .sgv-health-icon { width: 1rem; height: 1rem; color: #fff; }
        .sgv-health-label { font-size: 11px; color: #a1a1aa; text-transform: uppercase; letter-spacing: 0.05em; }
        .sgv-health-value { font-size: 1.125rem; font-weight: 700; color: #fff; }
        .sgv-panel { background-color: #000; border: 1px solid #27272a; border-radius: 0.75rem; overflow: hidden; }
        .sgv-panel-header { padding-left: 1rem; padding-right: 1rem; padding-top: 0.75rem; padding-bottom: 0.75rem; background-color: #09090b; border-bottom: 1px solid #27272a; }
        .sgv-panel-title { font-size: 0.875rem; font-weight: 700; color: #fff; display: flex; align-items: center; gap: 0.5rem; }
        .sgv-panel-title-icon { width: 1rem; height: 1rem; color: #fff; }
        .sgv-divide { border-top: 1px solid rgba(39, 39, 42, 0.6); }
        .sgv-module-row { padding-left: 1rem; padding-right: 1rem; padding-top: 0.75rem; padding-bottom: 0.75rem; display: flex; align-items: center; justify-content: space-between; transition: background-color 0.2s; }
        .sgv-module-row:hover { background-color: rgba(24, 24, 27, 0.3); }
        .sgv-module-left { display: flex; align-items: center; gap: 0.75rem; }
        .sgv-module-code { font-family: monospace; font-size: 0.75rem; font-weight: 700; color: #fff; background-color: #18181b; padding-left: 0.5rem; padding-right: 0.5rem; padding-top: 0.125rem; padding-bottom: 0.125rem; border-radius: 0.25rem; border: 1px solid #3f3f46; }
        .sgv-module-name { font-size: 0.75rem; color: #fff; font-weight: 500; }
        .sgv-module-right { display: flex; align-items: center; gap: 0.75rem; }
        .sgv-state-badge { padding-left: 0.5rem; padding-right: 0.5rem; padding-top: 0.125rem; padding-bottom: 0.125rem; font-size: 10px; font-weight: 700; border-radius: 0.25rem; text-transform: uppercase; }
        .sgv-state-active { background-color: #fff; color: #000; }
        .sgv-state-maintenance { background-color: #27272a; color: #d4d4d8; border: 1px solid #52525b; }
        .sgv-toggle-btn { padding-left: 0.625rem; padding-right: 0.625rem; padding-top: 0.25rem; padding-bottom: 0.25rem; font-size: 11px; border-radius: 0.25rem; transition: all 0.2s; cursor: pointer; }
        .sgv-toggle-btn-active { background-color: #18181b; border: 1px solid #3f3f46; color: #d4d4d8; }
        .sgv-toggle-btn-active:hover { background-color: #27272a; color: #fff; }
        .sgv-toggle-btn-maintenance { background-color: #fff; border: 1px solid #fff; color: #000; font-weight: 700; }
        .sgv-toggle-btn-maintenance:hover { background-color: #e4e4e7; }
        .sgv-audit-row { padding-left: 1rem; padding-right: 1rem; padding-top: 0.75rem; padding-bottom: 0.75rem; display: flex; align-items: center; justify-content: space-between; font-size: 0.75rem; transition: background-color 0.2s; }
        .sgv-audit-row:hover { background-color: rgba(24, 24, 27, 0.3); }
        .sgv-audit-left { display: flex; align-items: center; gap: 1rem; }
        .sgv-audit-id { font-family: monospace; color: #71717a; width: 4rem; }
        .sgv-audit-action { color: #fff; font-weight: 500; }
        .sgv-audit-target { color: #a1a1aa; }
        .sgv-audit-actor { color: #71717a; }
        .sgv-audit-right { display: flex; align-items: center; gap: 0.5rem; }
        .sgv-audit-time { color: #71717a; font-family: monospace; }
        .sgv-audit-status { padding-left: 0.375rem; padding-right: 0.375rem; padding-top: 0.125rem; padding-bottom: 0.125rem; font-size: 10px; font-weight: 700; border-radius: 0.25rem; background-color: #27272a; color: #fff; border: 1px solid #52525b; }
        @media (min-width: 1024px) { .sgv-container { padding-left: 2rem; padding-right: 2rem; } }
        @media (min-width: 640px) { .sgv-container { padding-left: 1.5rem; padding-right: 1.5rem; } .sgv-health-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (min-width: 1024px) { .sgv-health-grid { grid-template-columns: repeat(4, 1fr); } }
        @keyframes sgv-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .sgv-spin { animation: sgv-spin 1s linear infinite; }
      `}</style>
      <div className="sgv-container">
        {/* Header */}
        <div className="sgv-header">
          <h2 className="sgv-title">
            <ShieldCheck className="sgv-title-icon" />
            System Governance & Health
          </h2>
          <p className="sgv-subtitle">
            Super-admin controls, module health monitoring, audit trail, and system-wide operations.
          </p>
        </div>

        {/* Error Banner */}
        {error && (
          <div style={{
            padding: '0.75rem 1rem',
            backgroundColor: '#18181b',
            border: '1px solid #3f3f46',
            borderRadius: '0.5rem',
            color: '#fff',
            fontSize: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <span>{error}</span>
            <button onClick={() => setError(null)} style={{ color: '#a1a1aa', cursor: 'pointer', background: 'none', border: 'none', fontSize: '0.75rem' }}>Dismiss</button>
          </div>
        )}

        {/* System Health Cards */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <div className="sgv-health-grid" style={{ flex: 1 }}>
            {[
              { icon: Activity, label: 'System Status', value: systemHealth?.status || 'Healthy' },
              { icon: Server, label: 'Active Modules', value: `${Object.values(moduleStates).filter((s) => s === 'active').length} / ${Object.keys(moduleStates).length}` },
              { icon: Zap, label: 'Queue Workers', value: systemHealth?.queueWorkers || '4 Active' },
              { icon: Clock, label: 'Uptime', value: systemHealth?.uptime || '99.98%' }
            ].map((card, idx) => (
              <div key={idx} className="sgv-health-card sgv-health-card-bg">
                <div className="sgv-health-header">
                  <card.icon className="sgv-health-icon" />
                  <span className="sgv-health-label">{card.label}</span>
                </div>
                <div className="sgv-health-value">{card.value}</div>
              </div>
            ))}
          </div>
          <button
            onClick={() => { fetchSystemHealth(); fetchAuditLogs(); }}
            disabled={healthLoading || auditLoading}
            style={{ marginLeft: '0.5rem', padding: '0.5rem', background: '#18181b', border: '1px solid #3f3f46', borderRadius: '0.5rem', color: '#d4d4d8', cursor: 'pointer' }}
            title="Refresh System Data"
          >
            <RefreshCw size={16} style={{ color: '#d4d4d8' }} className={(healthLoading || auditLoading) ? 'sgv-spin' : ''} />
          </button>
        </div>

        {/* Critical Module Control */}
        <div className="sgv-panel">
          <div className="sgv-panel-header">
            <h3 className="sgv-panel-title">
              <Power className="sgv-panel-title-icon" />
              Critical Module Control
            </h3>
          </div>
          <div>
            {criticalModules.map((mod, idx) => {
              const state = moduleStates[mod.code] || 'active';
              return (
                <React.Fragment key={mod.id}>
                  {idx > 0 && <div className="sgv-divide" />}
                  <div className="sgv-module-row">
                    <div className="sgv-module-left">
                      <span className="sgv-module-code">
                        {mod.code}
                      </span>
                      <span className="sgv-module-name">{mod.name}</span>
                    </div>
                    <div className="sgv-module-right">
                      <span className={`sgv-state-badge ${
                        state === 'active'
                          ? 'sgv-state-active'
                          : state === 'maintenance'
                          ? 'sgv-state-maintenance'
                          : ''
                      }`}>
                        {state}
                      </span>
                      <button
                        onClick={() => toggleModuleState(mod.code)}
                        className={`sgv-toggle-btn ${
                          state === 'active'
                            ? 'sgv-toggle-btn-active'
                            : 'sgv-toggle-btn-maintenance'
                        }`}
                      >
                        {state === 'active' ? 'Maintenance' : 'Activate'}
                      </button>
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Audit Log */}
        <div className="sgv-panel">
          <div className="sgv-panel-header">
            <h3 className="sgv-panel-title">
              <Activity className="sgv-panel-title-icon" />
              Recent Audit Log
            </h3>
          </div>
          <div>
            {auditLogs.map((log, idx) => (
              <React.Fragment key={log.id}>
                {idx > 0 && <div className="sgv-divide" />}
                <div className="sgv-audit-row">
                  <div className="sgv-audit-left">
                    <span className="sgv-audit-id">#{log.id}</span>
                    <span className="sgv-audit-action">{log.action}</span>
                    <span className="sgv-audit-target">Target: {log.target}</span>
                    <span className="sgv-audit-actor">by {log.actor}</span>
                  </div>
                  <div className="sgv-audit-right">
                    <span className="sgv-audit-time">{new Date(log.timestamp).toLocaleTimeString()}</span>
                    <span className="sgv-audit-status">
                      {log.status}
                    </span>
                  </div>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
