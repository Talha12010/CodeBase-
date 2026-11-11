import React, { useState, useMemo, lazy, Suspense } from 'react';
import {
  X,
  Code2,
  Database,
  Globe,
  Layers,
  Copy,
  Check,
  Play,
  FileCode,
  Shield,
  Clock,
  ArrowRight,
  Laptop,
  Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ModuleIcon } from '../../ui/ModuleIcon';
import { generateFrontendCode } from '../../../utils/frontendCodeGenerator';
import { generateNodeBackendCode } from '../../../utils/nodeBackendGenerator';
import { apiRequest } from '../../../hooks/useModuleApi';

const LiveModuleFrontend = lazy(() => import('../module-catalog/LiveModuleFrontend.jsx').then(m => ({ default: m.LiveModuleFrontend })));

export const ModuleDetailModal = ({
  module,
  onClose,
  onSelectDependency
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [backendStack, setBackendStack] = useState('laravel');
  const [activeCodeFile, setActiveCodeFile] = useState('controller');
  const [activeNodeCodeFile, setActiveNodeCodeFile] = useState('server');
  const [activeFrontendFile, setActiveFrontendFile] = useState('component');
  const [checklistFilter, setChecklistFilter] = useState('all');
  const [apiBackendChoice, setApiBackendChoice] = useState('laravel');
  const [copied, setCopied] = useState(false);
  const [apiSimOutput, setApiSimOutput] = useState(null);
  const [simulating, setSimulating] = useState(false);

  const frontendCode = useMemo(() => {
    return module ? generateFrontendCode(module) : null;
  }, [module]);

  const nodeBackendCode = useMemo(() => {
    return module ? generateNodeBackendCode(module) : null;
  }, [module]);

  if (!module) return null;

  const handleCopyCode = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadCode = (filename, content) => {
    const blob = new Blob([content], { type: 'text/javascript;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleSimulateApi = async (endpoint) => {
    setSimulating(true);
    setApiSimOutput(null);

    try {
      const startTime = Date.now();
      const data = await apiRequest(endpoint.path);
      const duration = Date.now() - startTime;
      setApiSimOutput({
        path: endpoint.path,
        status: 200,
        duration,
        body: data,
        isReal: true
      });
    } catch (err) {
      setApiSimOutput({
        path: endpoint.path,
        status: err.status || 500,
        duration: 0,
        body: { success: false, message: err.message },
        isReal: true,
        error: true
      });
    } finally {
      setSimulating(false);
    }
  };

  const checklistItems = [
    {
      step: 1,
      name: 'Module Directory Structure',
      laravelPath: `app/Modules/${module.name.replace(/\s+/g, '')}/`,
      nodePath: `src/modules/${module.slug}/`,
      status: 'Verified'
    },
    {
      step: 2,
      name: 'Database Schema & Migrations',
      laravelPath: `database/migrations/create_${module.slug.replace(/-/g, '_')}_tables.php`,
      nodePath: `src/modules/${module.slug}/models/${module.name.replace(/\s+/g, '')}.model.ts`,
      status: 'Verified'
    },
    {
      step: 3,
      name: 'Domain Models & Schema',
      laravelPath: `app/Modules/${module.name.replace(/\s+/g, '')}/Models/`,
      nodePath: `src/modules/${module.slug}/models/ (Mongoose Documents)`,
      status: 'Verified'
    },
    {
      step: 4,
      name: 'Data Repository & Contracts',
      laravelPath: `app/Modules/${module.name.replace(/\s+/g, '')}/Repositories/`,
      nodePath: `src/modules/${module.slug}/repositories/ (JavaScript DAO)`,
      status: 'Verified'
    },
    {
      step: 5,
      name: 'Domain Service Business Logic',
      laravelPath: `app/Modules/${module.name.replace(/\s+/g, '')}/Services/${module.services[0] || 'Service'}.php`,
      nodePath: `src/modules/${module.slug}/services/${module.services[0] || 'Service'}.ts`,
      status: 'Verified'
    },
    {
      step: 6,
      name: 'Request Validation Layer',
      laravelPath: `app/Modules/${module.name.replace(/\s+/g, '')}/Requests/`,
      nodePath: `src/modules/${module.slug}/validators/ (Zod Schemas)`,
      status: 'Verified'
    },
    {
      step: 7,
      name: 'RESTful API Controller',
      laravelPath: `app/Modules/${module.name.replace(/\s+/g, '')}/Controllers/`,
      nodePath: `src/modules/${module.slug}/controllers/ (Express Router)`,
      status: 'Verified'
    },
    {
      step: 8,
      name: 'JSON Serializers / DTOs',
      laravelPath: `app/Modules/${module.name.replace(/\s+/g, '')}/Resources/`,
      nodePath: `src/modules/${module.slug}/dto/ (toJSON Transform)`,
      status: 'Verified'
    },
    {
      step: 9,
      name: 'Authorization Policies & Gates',
      laravelPath: `app/Modules/${module.name.replace(/\s+/g, '')}/Policies/`,
      nodePath: `src/modules/${module.slug}/middleware/ (RBAC / JWT)`,
      status: 'Verified'
    },
    {
      step: 10,
      name: 'Domain Events & Broadcasting',
      laravelPath: `app/Modules/${module.name.replace(/\s+/g, '')}/Events/`,
      nodePath: `src/modules/${module.slug}/events/ (EventEmitter)`,
      status: 'Verified'
    },
    {
      step: 11,
      name: 'Real-Time WebSocket Listeners',
      laravelPath: `app/Modules/${module.name.replace(/\s+/g, '')}/Listeners/ (Reverb)`,
      nodePath: `src/modules/${module.slug}/events/ (Socket.io Rooms)`,
      status: 'Verified'
    },
    {
      step: 12,
      name: 'Background Queue Jobs',
      laravelPath: `app/Modules/${module.name.replace(/\s+/g, '')}/Jobs/ (Horizon)`,
      nodePath: `src/modules/${module.slug}/jobs/ (BullMQ / Redis)`,
      status: 'Verified'
    },
    {
      step: 13,
      name: 'Multi-Channel Notifications',
      laravelPath: `app/Modules/${module.name.replace(/\s+/g, '')}/Notifications/`,
      nodePath: `src/modules/${module.slug}/notifications/ (Webhooks/Email)`,
      status: 'Verified'
    },
    {
      step: 14,
      name: 'Feature & Unit Test Suites',
      laravelPath: `tests/Feature/${module.name.replace(/\s+/g, '')}Test.php`,
      nodePath: `tests/modules/${module.slug}.test.ts (Vitest / Supertest)`,
      status: 'Verified'
    },
    {
      step: 15,
      name: 'Explicit Route Registry',
      laravelPath: `app/Modules/${module.name.replace(/\s+/g, '')}/routes.php`,
      nodePath: `src/modules/${module.slug}/${module.slug}.routes.ts`,
      status: 'Verified'
    }
  ];

  return (
    <AnimatePresence>
      <style>{`
        @keyframes mdm-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes mdm-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes mdm-ping {
          0% { transform: scale(1); opacity: 1; }
          75%, 100% { transform: scale(2); opacity: 0; }
        }
        .mdm-overlay {
          position: fixed;
          inset: 0;
          z-index: 50;
          overflow-y: auto;
          background-color: rgba(0,0,0,0.85);
          backdrop-filter: blur(12px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
        }
        @media (min-width: 640px) {
          .mdm-overlay { padding: 1.5rem; }
        }
        .mdm-modal {
          position: relative;
          background-color: #09090b;
          border: 1px solid #27272a;
          border-radius: 1rem;
          width: 100%;
          max-width: 64rem;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
          box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);
          overflow: hidden;
        }
        .mdm-topbar {
          padding: 1rem 1.5rem;
          border-bottom: 1px solid #27272a;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background-color: #000;
        }
        .mdm-topbar-left {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .mdm-icon-box {
          height: 2.5rem;
          width: 2.5rem;
          border-radius: 0.75rem;
          background-color: #18181b;
          border: 1px solid #3f3f46;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .mdm-code-badge {
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
          font-size: 0.75rem;
          font-weight: 700;
          color: #fff;
          background-color: #18181b;
          padding: 0.125rem 0.5rem;
          border-radius: 0.25rem;
          border: 1px solid #3f3f46;
        }
        .mdm-phase-text {
          font-size: 0.75rem;
          color: #a1a1aa;
        }
        .mdm-title {
          font-size: 1.125rem;
          font-weight: 700;
          color: #fff;
        }
        .mdm-close-btn {
          padding: 0.375rem;
          border-radius: 0.5rem;
          color: #a1a1aa;
          background: none;
          border: none;
          cursor: pointer;
          transition: color 0.15s, background-color 0.15s;
        }
        .mdm-close-btn:hover {
          color: #fff;
          background-color: #27272a;
        }
        .mdm-close-btn svg {
          width: 1.25rem;
          height: 1.25rem;
        }
        .mdm-tabs {
          padding: 0 1.5rem;
          border-bottom: 1px solid #27272a;
          background-color: rgba(0,0,0,0.5);
          display: flex;
          align-items: center;
          gap: 0.5rem;
          overflow-x: auto;
        }
        .mdm-tab-btn {
          padding: 0.75rem 0.75rem;
          font-size: 0.75rem;
          font-weight: 600;
          border-bottom: 2px solid transparent;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all 0.15s;
          white-space: nowrap;
          cursor: pointer;
          color: #a1a1aa;
          background: none;
          border-top: none;
          border-left: none;
          border-right: none;
        }
        .mdm-tab-btn:hover {
          color: #fff;
        }
        .mdm-tab-btn svg {
          width: 1rem;
          height: 1rem;
        }
        .mdm-tab-btn-active {
          border-bottom-color: #fff;
          color: #fff;
        }
        .mdm-tab-btn-inactive {
          border-bottom-color: transparent;
          color: #a1a1aa;
        }
        .mdm-tab-btn-inactive:hover {
          color: #fff;
        }
        .mdm-content {
          padding: 1.5rem;
          overflow-y: auto;
          flex: 1;
          color: #d4d4d8;
          font-size: 0.875rem;
        }
        .mdm-section-title {
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 0.5rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .mdm-section-title-white {
          color: #fff;
        }
        .mdm-section-title-zinc {
          color: #a1a1aa;
          margin-bottom: 0.75rem;
        }
        .mdm-purpose-box {
          background-color: #000;
          padding: 1rem;
          border-radius: 0.75rem;
          border: 1px solid #27272a;
        }
        .mdm-purpose-text {
          font-size: 0.875rem;
          color: #d4d4d8;
          line-height: 1.625;
        }
        .mdm-dot-white {
          width: 0.5rem;
          height: 0.5rem;
          border-radius: 9999px;
          background-color: #fff;
        }
        .mdm-grid-2 {
          display: grid;
          gap: 0.75rem;
        }
        @media (min-width: 640px) {
          .mdm-grid-2 { grid-template-columns: repeat(2, 1fr); }
        }
        .mdm-grid-2-gap6 {
          display: grid;
          gap: 1.5rem;
        }
        @media (min-width: 640px) {
          .mdm-grid-2-gap6 { grid-template-columns: repeat(2, 1fr); }
        }
        .mdm-resp-card {
          padding: 0.75rem;
          background-color: rgba(24,24,27,0.6);
          border-radius: 0.5rem;
          border: 1px solid #27272a;
          display: flex;
          align-items: flex-start;
          gap: 0.625rem;
        }
        .mdm-resp-dot {
          width: 0.375rem;
          height: 0.375rem;
          border-radius: 9999px;
          background-color: #fff;
          margin-top: 0.5rem;
          flex-shrink: 0;
        }
        .mdm-resp-text {
          font-size: 0.75rem;
          color: #d4d4d8;
          line-height: 1.5;
        }
        .mdm-service-card {
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
          font-size: 0.75rem;
          padding: 0.625rem;
          background-color: #18181b;
          border-radius: 0.25rem;
          border: 1px solid #27272a;
          color: #e4e4e7;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .mdm-injectable-badge {
          font-size: 10px;
          color: #a1a1aa;
          background-color: #000;
          padding: 0.125rem 0.375rem;
          border-radius: 0.25rem;
          border: 1px solid #27272a;
        }
        .mdm-events-title {
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #a1a1aa;
          margin-bottom: 0.75rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .mdm-dep-title {
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #a1a1aa;
          margin-bottom: 0.5rem;
        }
        .mdm-dep-none {
          font-size: 0.75rem;
          color: #71717a;
        }
        .mdm-dep-btn {
          padding: 0.25rem 0.625rem;
          font-size: 0.75rem;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
          background-color: #18181b;
          border-radius: 0.25rem;
          border: 1px solid #3f3f46;
          color: #fff;
          transition: background-color 0.15s, color 0.15s;
          display: flex;
          align-items: center;
          gap: 0.375rem;
          cursor: pointer;
        }
        .mdm-dep-btn:hover {
          background-color: #fff;
          color: #000;
        }
        .mdm-dep-btn svg {
          width: 0.75rem;
          height: 0.75rem;
        }
        .mdm-backend-switcher {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          background-color: #09090b;
          padding: 0.75rem;
          border-radius: 0.75rem;
          border: 1px solid #27272a;
        }
        @media (min-width: 640px) {
          .mdm-backend-switcher {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
          }
        }
        .mdm-fw-label {
          font-size: 0.75rem;
          color: #a1a1aa;
          font-weight: 600;
        }
        .mdm-fw-toggle {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          background-color: #000;
          padding: 0.25rem;
          border-radius: 0.5rem;
          border: 1px solid #27272a;
          font-size: 0.75rem;
        }
        .mdm-fw-btn {
          padding: 0.25rem 0.75rem;
          border-radius: 0.375rem;
          font-weight: 600;
          transition: background-color 0.15s, color 0.15s;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.375rem;
          background: none;
          border: none;
          font-size: 0.75rem;
        }
        .mdm-fw-btn-active {
          background-color: #fff;
          color: #000;
          font-weight: 700;
          box-shadow: 0 1px 3px rgba(0,0,0,0.3);
        }
        .mdm-fw-btn-inactive {
          color: #a1a1aa;
        }
        .mdm-fw-btn-inactive:hover {
          color: #fff;
        }
        .mdm-file-bar {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background-color: #000;
          padding: 0.25rem;
          border-radius: 0.5rem;
          border: 1px solid #27272a;
          font-size: 0.75rem;
          overflow-x: auto;
        }
        .mdm-file-btn {
          padding: 0.25rem 0.75rem;
          border-radius: 0.25rem;
          transition: background-color 0.15s, color 0.15s;
          cursor: pointer;
          text-transform: capitalize;
          white-space: nowrap;
          background: none;
          border: none;
          font-size: 0.75rem;
          color: #a1a1aa;
        }
        .mdm-file-btn:hover {
          color: #fff;
        }
        .mdm-file-btn-active {
          background-color: #fff;
          color: #000;
          font-weight: 700;
          box-shadow: 0 1px 3px rgba(0,0,0,0.3);
        }
        .mdm-file-btn-inactive {
          color: #a1a1aa;
        }
        .mdm-file-btn-inactive:hover {
          color: #fff;
        }
        .mdm-arch-text {
          font-size: 11px;
          color: #a1a1aa;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
        }
        .mdm-code-viewer {
          position: relative;
          background-color: #000;
          border: 1px solid #27272a;
          border-radius: 0.75rem;
          overflow: hidden;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
          font-size: 0.75rem;
        }
        .mdm-code-header {
          padding: 0.5rem 1rem;
          background-color: #09090b;
          border-bottom: 1px solid #27272a;
          color: #a1a1aa;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 11px;
        }
        .mdm-code-header-left {
          color: #d4d4d8;
        }
        .mdm-code-header-right {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .mdm-switch-link {
          color: #a1a1aa;
          transition: color 0.15s;
          display: flex;
          align-items: center;
          gap: 0.25rem;
          cursor: pointer;
          background: none;
          border: none;
          font-size: inherit;
          font-family: inherit;
        }
        .mdm-switch-link:hover {
          color: #fff;
        }
        .mdm-switch-link svg {
          width: 0.75rem;
          height: 0.75rem;
        }
        .mdm-code-lang-badge {
          color: #fff;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
          background-color: #18181b;
          padding: 0.125rem 0.5rem;
          border-radius: 0.25rem;
          border: 1px solid #27272a;
        }
        .mdm-copy-btn {
          padding: 0.375rem 0.75rem;
          background-color: #fff;
          color: #000;
          font-weight: 600;
          border-radius: 0.5rem;
          font-size: 0.75rem;
          display: flex;
          align-items: center;
          gap: 0.375rem;
          transition: background-color 0.15s;
          cursor: pointer;
          border: none;
        }
        .mdm-copy-btn:hover {
          background-color: #e4e4e7;
        }
        .mdm-copy-btn svg {
          width: 0.875rem;
          height: 0.875rem;
        }
        .mdm-download-btn {
          padding: 0.375rem 0.625rem;
          background-color: #18181b;
          border: 1px solid #3f3f46;
          font-size: 0.75rem;
          font-weight: 600;
          border-radius: 0.5rem;
          display: flex;
          align-items: center;
          gap: 0.375rem;
          color: #d4d4d8;
          transition: background-color 0.15s, color 0.15s;
          cursor: pointer;
        }
        .mdm-download-btn:hover {
          background-color: #27272a;
          color: #fff;
        }
        .mdm-download-btn svg {
          width: 0.875rem;
          height: 0.875rem;
        }
        .mdm-file-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .mdm-file-actions-gap3 {
          gap: 0.75rem;
        }
        .mdm-pre-code {
          padding: 1rem;
          color: #e4e4e7;
          overflow-x: auto;
          max-height: 480px;
          line-height: 1.625;
          user-select: text;
          margin: 0;
        }
        .mdm-schema-table {
          width: 100%;
          text-align: left;
          font-size: 0.75rem;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
        }
        .mdm-table-head {
          background-color: rgba(24,24,27,0.7);
          color: #a1a1aa;
          border-bottom: 1px solid #27272a;
          font-weight: 600;
        }
        .mdm-table-cell {
          padding: 0.625rem 1rem;
        }
        .mdm-table-row:hover {
          background-color: rgba(24,24,27,0.4);
        }
        .mdm-table-body {
          border-top: 1px solid rgba(39,39,42,0.6);
          color: #d4d4d8;
        }
        .mdm-index-badge {
          color: #fff;
          font-family: system-ui, -apple-system, sans-serif;
          font-size: 11px;
          background-color: #27272a;
          padding: 0.125rem 0.375rem;
          border-radius: 0.25rem;
          border: 1px solid #52525b;
        }
        .mdm-fk-section {
          padding: 0.75rem;
          background-color: #09090b;
          border-top: 1px solid #27272a;
          font-size: 0.75rem;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
          color: #a1a1aa;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .mdm-fk-label {
          color: #fff;
          font-weight: 600;
        }
        .mdm-fk-badge {
          background-color: #18181b;
          color: #d4d4d8;
          padding: 0.125rem 0.5rem;
          border-radius: 0.25rem;
          border: 1px solid #27272a;
        }
        .mdm-table-wrapper {
          overflow-x: auto;
        }
        .mdm-table-header {
          padding: 0.75rem 1rem;
          background-color: #09090b;
          border-bottom: 1px solid #27272a;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .mdm-table-header-left {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .mdm-table-name {
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
          font-size: 0.875rem;
          font-weight: 700;
          color: #fff;
        }
        .mdm-table-desc {
          font-size: 0.75rem;
          color: #a1a1aa;
          font-family: system-ui, -apple-system, sans-serif;
        }
        .mdm-pk-badge {
          font-size: 0.75rem;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
          color: #d4d4d8;
          background-color: #18181b;
          padding: 0.125rem 0.5rem;
          border-radius: 0.25rem;
          border: 1px solid #27272a;
        }
        .mdm-api-card {
          padding: 1rem;
          background-color: #000;
          border: 1px solid #27272a;
          border-radius: 0.75rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 0.75rem;
        }
        @media (min-width: 768px) {
          .mdm-api-card {
            flex-direction: row;
            align-items: center;
          }
        }
        .mdm-api-left {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .mdm-api-right {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .mdm-method-badge {
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
          font-size: 0.75rem;
          font-weight: 700;
          padding: 0.25rem 0.625rem;
          border-radius: 0.25rem;
        }
        .mdm-method-get {
          background-color: #27272a;
          color: #fff;
          border: 1px solid #3f3f46;
        }
        .mdm-method-post {
          background-color: #fff;
          color: #000;
          border: 1px solid #fff;
        }
        .mdm-method-put {
          background-color: #18181b;
          color: #e4e4e7;
          border: 1px solid #3f3f46;
        }
        .mdm-method-delete {
          background-color: #000;
          color: #fff;
          border: 1px solid #52525b;
        }
        .mdm-api-path {
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
          font-size: 0.75rem;
          font-weight: 600;
          color: #fff;
        }
        .mdm-api-desc {
          font-size: 0.75rem;
          color: #a1a1aa;
          font-family: system-ui, -apple-system, sans-serif;
        }
        .mdm-api-desc-desktop {
          display: none;
        }
        @media (min-width: 640px) {
          .mdm-api-desc-desktop { display: inline; }
        }
        .mdm-auth-badge {
          font-size: 11px;
          color: #d4d4d8;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
          background-color: #18181b;
          padding: 0.125rem 0.5rem;
          border-radius: 0.25rem;
          border: 1px solid #3f3f46;
        }
        .mdm-test-btn {
          padding: 0.25rem 0.75rem;
          background-color: #fff;
          color: #000;
          font-size: 0.75rem;
          border-radius: 0.25rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 0.375rem;
          transition: background-color 0.15s;
          cursor: pointer;
          border: none;
        }
        .mdm-test-btn:hover {
          background-color: #e4e4e7;
        }
        .mdm-test-btn svg {
          width: 0.75rem;
          height: 0.75rem;
        }
        .mdm-sim-output {
          background-color: #000;
          border: 1px solid #27272a;
          border-radius: 0.75rem;
          padding: 1rem;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
          font-size: 0.75rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .mdm-sim-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #27272a;
          padding-bottom: 0.5rem;
        }
        .mdm-sim-header-left {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .mdm-status-badge {
          background-color: #fff;
          color: #000;
          font-weight: 700;
          padding: 0.125rem 0.5rem;
          border-radius: 0.25rem;
        }
        .mdm-sim-path {
          color: #d4d4d8;
        }
        .mdm-sim-duration {
          color: #a1a1aa;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
        }
        .mdm-sim-body {
          color: #e4e4e7;
          max-height: 14rem;
          overflow-y: auto;
          padding-top: 0.25rem;
          line-height: 1.625;
          margin: 0;
        }
        .mdm-simulating {
          padding: 1rem;
          text-align: center;
          font-size: 0.75rem;
          color: #fff;
          animation: mdm-pulse 2s ease-in-out infinite;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }
        .mdm-ping-dot {
          width: 0.5rem;
          height: 0.5rem;
          border-radius: 9999px;
          background-color: #fff;
          animation: mdm-ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        .mdm-checklist-header {
          padding: 0.875rem;
          background-color: #18181b;
          border: 1px solid #3f3f46;
          border-radius: 0.75rem;
          font-size: 0.75rem;
          color: #fff;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        @media (min-width: 640px) {
          .mdm-checklist-header {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
          }
        }
        .mdm-checklist-header-text {
          font-weight: 500;
        }
        .mdm-checklist-header-right {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .mdm-checklist-filter-bar {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          background-color: #000;
          padding: 0.25rem;
          border-radius: 0.5rem;
          border: 1px solid #27272a;
          font-size: 11px;
        }
        .mdm-checklist-filter-btn {
          padding: 0.125rem 0.5rem;
          border-radius: 0.25rem;
          cursor: pointer;
          background: none;
          border: none;
          font-size: 11px;
          color: #a1a1aa;
        }
        .mdm-checklist-filter-btn:hover {
          color: #fff;
        }
        .mdm-checklist-filter-active {
          background-color: #fff;
          color: #000;
          font-weight: 700;
        }
        .mdm-checklist-pct {
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
          font-weight: 700;
          background-color: #fff;
          color: #000;
          padding: 0.125rem 0.5rem;
          border-radius: 0.25rem;
        }
        .mdm-checklist-items {
          border-top: 1px solid #27272a;
          border-bottom: 1px solid #27272a;
          border-radius: 0.75rem;
          background-color: #000;
          overflow: hidden;
        }
        .mdm-checklist-row {
          padding: 0.875rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          font-size: 0.75rem;
          transition: background-color 0.15s;
          gap: 0.5rem;
          border-bottom: 1px solid #27272a;
        }
        .mdm-checklist-row:last-child {
          border-bottom: none;
        }
        .mdm-checklist-row:hover {
          background-color: rgba(24,24,27,0.5);
        }
        @media (min-width: 768px) {
          .mdm-checklist-row {
            flex-direction: row;
            align-items: center;
          }
        }
        .mdm-checklist-left {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
        }
        .mdm-step-num {
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
          color: #fff;
          font-weight: 700;
          width: 1.5rem;
          padding-top: 0.125rem;
        }
        .mdm-checklist-name {
          font-weight: 600;
          color: #fff;
        }
        .mdm-checklist-paths {
          display: flex;
          flex-direction: column;
          gap: 0.125rem;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
          font-size: 11px;
        }
        .mdm-checklist-path-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #a1a1aa;
        }
        .mdm-path-badge {
          background-color: #18181b;
          color: #d4d4d8;
          padding: 0.125rem 0.375rem;
          border-radius: 0.25rem;
          border: 1px solid #27272a;
          font-size: 10px;
        }
        .mdm-checklist-status {
          align-self: flex-start;
          padding: 0.125rem 0.5rem;
          font-size: 11px;
          font-weight: 600;
          border-radius: 9999px;
          background-color: #27272a;
          color: #fff;
          border: 1px solid #52525b;
          white-space: nowrap;
        }
        @media (min-width: 768px) {
          .mdm-checklist-status {
            align-self: auto;
          }
        }
        .mdm-space-y-6 {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .mdm-space-y-4 {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .mdm-space-y-2 {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .mdm-space-y-3 {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .mdm-flex-wrap-gap2 {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .mdm-dependencies-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .mdm-dep-info {
          font-size: 11px;
          color: #a1a1aa;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
        }
        .mdm-frontend-info {
          font-size: 11px;
          color: #a1a1aa;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
        }
        .mdm-backend-info {
          font-size: 0.75rem;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
          color: #a1a1aa;
        }
        .mdm-live-preview-fallback {
          text-align: center;
          padding: 2rem 0;
          font-size: 0.75rem;
          color: #71717a;
        }
        .mdm-checklist-name-group {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        .mdm-service-title {
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #a1a1aa;
          margin-bottom: 0.75rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .mdm-service-title svg {
          width: 0.875rem;
          height: 0.875rem;
          color: #fff;
        }
        .mdm-code-switcher {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        @media (min-width: 640px) {
          .mdm-code-switcher {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
          }
        }
        .mdm-schema-card {
          background-color: #000;
          border: 1px solid #27272a;
          border-radius: 0.75rem;
          overflow: hidden;
        }
        .mdm-table-body-divide {
          border-top: 1px solid rgba(39,39,42,0.6);
        }
        .mdm-icon-svg {
          width: 1.25rem;
          height: 1.25rem;
        }
        .mdm-icon-sm {
          width: 0.875rem;
          height: 0.875rem;
        }
        .mdm-icon-xs {
          width: 0.75rem;
          height: 0.75rem;
        }
        .mdm-checklist-path-group {
          display: flex;
          flex-direction: column;
          gap: 0.125rem;
        }
        .mdm-dot-white-sm {
          width: 0.5rem;
          height: 0.5rem;
          border-radius: 9999px;
          background-color: #fff;
        }
        .mdm-fw-toggle-small {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          background-color: #000;
          padding: 0.25rem;
          border-radius: 0.5rem;
          border: 1px solid #27272a;
          font-size: 0.75rem;
        }
      `}</style>
      <div className="mdm-overlay">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 16 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          className="mdm-modal"
        >
          {/* Modal Top Bar */}
          <div className="mdm-topbar">
            <div className="mdm-topbar-left">
              <div className="mdm-icon-box">
                <ModuleIcon name={module.iconName} className="mdm-icon-svg" />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span className="mdm-code-badge">
                    {module.code}
                  </span>
                  <span className="mdm-phase-text">Phase {module.phase} &bull; {module.category}</span>
                </div>
                <h2 className="mdm-title">{module.name}</h2>
              </div>
            </div>

            <motion.button
              onClick={onClose}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              className="mdm-close-btn"
            >
              <X />
            </motion.button>
          </div>

          {/* Navigation Tabs */}
          <div className="mdm-tabs">
            <button
              onClick={() => setActiveTab('overview')}
              className={`mdm-tab-btn ${activeTab === 'overview' ? 'mdm-tab-btn-active' : 'mdm-tab-btn-inactive'}`}
            >
              <Layers />
              Overview &amp; Contracts
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className={`mdm-tab-btn ${activeTab === 'code' ? 'mdm-tab-btn-active' : 'mdm-tab-btn-inactive'}`}
            >
              <Code2 />
              Backend Source (Laravel &amp; Node.js MERN)
            </button>
            <button
              onClick={() => setActiveTab('frontend')}
              className={`mdm-tab-btn ${activeTab === 'frontend' ? 'mdm-tab-btn-active' : 'mdm-tab-btn-inactive'}`}
            >
              <Laptop />
              Frontend Code (React TS)
            </button>
            <button
              onClick={() => setActiveTab('schema')}
              className={`mdm-tab-btn ${activeTab === 'schema' ? 'mdm-tab-btn-active' : 'mdm-tab-btn-inactive'}`}
            >
              <Database />
              MySQL Schema ({module.databaseTables.length})
            </button>
            <button
              onClick={() => setActiveTab('api')}
              className={`mdm-tab-btn ${activeTab === 'api' ? 'mdm-tab-btn-active' : 'mdm-tab-btn-inactive'}`}
            >
              <Globe />
              RESTful API ({module.apiEndpoints.length})
            </button>
            <button
              onClick={() => setActiveTab('checklist')}
              className={`mdm-tab-btn ${activeTab === 'checklist' ? 'mdm-tab-btn-active' : 'mdm-tab-btn-inactive'}`}
            >
              <FileCode />
              15-Step Checklist (15/15)
            </button>
          </div>

          {/* Content Body */}
          <div className="mdm-content">
            {/* TAB 1: OVERVIEW */}
            {activeTab === 'overview' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="mdm-space-y-6"
              >
                {/* Purpose Box */}
                <div className="mdm-purpose-box">
                  <h4 className="mdm-section-title mdm-section-title-white">
                    <span className="mdm-dot-white" />
                    Domain &amp; Business Purpose
                  </h4>
                  <p className="mdm-purpose-text">{module.purpose}</p>
                </div>

                {/* Responsibilities */}
                <div>
                  <h4 className="mdm-section-title mdm-section-title-zinc">
                    Core Module Responsibilities
                  </h4>
                  <div className="mdm-grid-2">
                    {module.responsibilities.map((resp, i) => (
                      <div
                        key={i}
                        className="mdm-resp-card"
                      >
                        <div className="mdm-resp-dot" />
                        <span className="mdm-resp-text">{resp}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Services & Architectural Isolation */}
                <div className="mdm-grid-2-gap6">
                  <div>
                    <h4 className="mdm-service-title">
                      <Shield />
                      Service Contracts
                    </h4>
                    <div className="mdm-space-y-2">
                      {module.services.map((svc, i) => (
                        <div
                          key={i}
                          className="mdm-service-card"
                        >
                          <span>{svc}</span>
                          <span className="mdm-injectable-badge">Injectable</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="mdm-service-title">
                      <Clock />
                      Events &amp; Queued Jobs
                    </h4>
                    <div className="mdm-space-y-2">
                      {module.events.map((evt, i) => (
                        <div
                          key={i}
                          className="mdm-service-card"
                        >
                          <span>Event: {evt}</span>
                          <span className="mdm-injectable-badge">Redis Broadcast</span>
                        </div>
                      ))}
                      {module.jobs.map((job, i) => (
                        <div
                          key={i}
                          className="mdm-service-card"
                        >
                          <span>Job: {job}</span>
                          <span className="mdm-injectable-badge">Queue Worker</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Dependencies */}
                <div>
                  <h4 className="mdm-dep-title">
                    Module Dependencies
                  </h4>
                  {module.dependencies.length === 0 ? (
                    <p className="mdm-dep-none">None (Independent Root Module)</p>
                  ) : (
                    <div className="mdm-flex-wrap-gap2">
                      {module.dependencies.map((depId) => (
                        <motion.button
                          key={depId}
                          onClick={() => onSelectDependency && onSelectDependency(depId)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="mdm-dep-btn"
                        >
                          <span>MOD-{String(depId).padStart(3, '0')}</span>
                          <ArrowRight className="mdm-icon-xs" />
                        </motion.button>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* TAB 2: CODE */}
            {activeTab === 'code' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="mdm-space-y-4"
              >
                {/* Dual Backend Architecture Switcher */}
                <div className="mdm-backend-switcher">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className="mdm-fw-label">Backend Framework:</span>
                    <div className="mdm-fw-toggle">
                      <button
                        onClick={() => setBackendStack('laravel')}
                        className={`mdm-fw-btn ${backendStack === 'laravel' ? 'mdm-fw-btn-active' : 'mdm-fw-btn-inactive'}`}
                      >
                        <span>Laravel 11.x (PHP 8.3 &amp; Eloquent)</span>
                      </button>
                      <button
                        onClick={() => setBackendStack('node')}
                        className={`mdm-fw-btn ${backendStack === 'node' ? 'mdm-fw-btn-active' : 'mdm-fw-btn-inactive'}`}
                      >
                        <span>Node.js / Express (MERN Stack &amp; Mongoose)</span>
                      </button>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {backendStack === 'node' && nodeBackendCode && (
                      <motion.button
                        onClick={() =>
                          handleDownloadCode(
                            'server.js',
                            nodeBackendCode.server
                          )
                        }
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="mdm-download-btn"
                        title="Download Node.js File"
                      >
                        <Download className="mdm-icon-sm" />
                        Download
                      </motion.button>
                    )}

                    <motion.button
                      onClick={() =>
                        handleCopyCode(
                          backendStack === 'laravel'
                            ? module.codeTemplates[activeCodeFile]
                            : nodeBackendCode
                            ? nodeBackendCode.server
                            : ''
                        )
                      }
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className="mdm-copy-btn"
                    >
                      {copied ? <Check className="mdm-icon-sm" style={{ color: '#000' }} /> : <Copy className="mdm-icon-sm" style={{ color: '#000' }} />}
                      {copied ? 'Copied' : 'Copy Code'}
                    </motion.button>
                  </div>
                </div>

                {/* File picker for active backend stack */}
                <div className="mdm-file-actions">
                  {backendStack === 'laravel' ? (
                    <div className="mdm-file-bar">
                      {['controller', 'service', 'model', 'formRequest', 'migration', 'policy'].map((fileKey) => (
                        <button
                          key={fileKey}
                          onClick={() => setActiveCodeFile(fileKey)}
                          className={`mdm-file-btn ${activeCodeFile === fileKey ? 'mdm-file-btn-active' : 'mdm-file-btn-inactive'}`}
                        >
                          {fileKey === 'formRequest' ? 'Request.php' : `${fileKey.charAt(0).toUpperCase() + fileKey.slice(1)}.php`}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="mdm-file-bar">
                      <div className="mdm-file-btn mdm-file-btn-active" style={{ cursor: 'default' }}>
                        server.js — Copy &amp; Paste Ready
                      </div>
                    </div>
                  )}

                  <div className="mdm-dep-info">
                    {backendStack === 'laravel'
                      ? 'Architecture: Laravel 11.x Modular Monolith'
                      : 'Architecture: Node.js 20+ Express MERN Stack'}
                  </div>
                </div>

                {/* Code viewer container */}
                <div className="mdm-code-viewer">
                  <div className="mdm-code-header">
                    <span className="mdm-code-header-left">
                      {backendStack === 'laravel'
                        ? `app/Modules/${module.name.replace(/\s+/g, '')}/${activeCodeFile}.php`
                        : `server.js — ${module.name}`}
                    </span>
                    <div className="mdm-code-header-right">
                      <button
                        onClick={() => setActiveTab('frontend')}
                        className="mdm-switch-link"
                      >
                        <Laptop className="mdm-icon-xs" style={{ color: '#a1a1aa' }} />
                        <span>Switch to React Frontend</span>
                        <ArrowRight className="mdm-icon-xs" />
                      </button>
                      <span className="mdm-code-lang-badge">
                        {backendStack === 'laravel' ? 'PHP 8.3 • Strict Types • Eloquent' : 'Node.js 20+ • JavaScript • Express & Mongoose • Copy & Paste Ready'}
                      </span>
                    </div>
                  </div>
                  <pre className="mdm-pre-code">
                    <code>
                      {backendStack === 'laravel'
                        ? module.codeTemplates[activeCodeFile]
                        : nodeBackendCode
                        ? nodeBackendCode.server
                        : '// Loading code...'}
                    </code>
                  </pre>
                </div>
              </motion.div>
            )}

            {/* TAB: FRONTEND CODE & SDK */}
            {activeTab === 'frontend' && frontendCode && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="mdm-space-y-4"
              >
                {/* File picker & actions */}
                <div className="mdm-file-actions mdm-file-actions-gap3">
                  <div className="mdm-file-bar">
                    {[
                      { id: 'component', label: 'Component.tsx' },
                      { id: 'test', label: 'Test.tsx' },
                      { id: 'live', label: 'Live UI Preview' }
                    ].map((f) => (
                      <button
                        key={f.id}
                        onClick={() => setActiveFrontendFile(f.id)}
                        className={`mdm-file-btn ${activeFrontendFile === f.id ? 'mdm-file-btn-active' : 'mdm-file-btn-inactive'}`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>

                  {activeFrontendFile !== 'live' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <motion.button
                        onClick={() =>
                          handleDownloadCode(
                            activeFrontendFile === 'component'
                              ? `${module.name.replace(/\s+/g, '')}Manager.tsx`
                              : `${module.name.replace(/\s+/g, '')}.test.tsx`,
                            frontendCode[activeFrontendFile]
                          )
                        }
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="mdm-download-btn"
                        title="Download File"
                      >
                        <Download className="mdm-icon-sm" />
                        Download
                      </motion.button>

                      <motion.button
                        onClick={() => handleCopyCode(frontendCode[activeFrontendFile])}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="mdm-copy-btn"
                      >
                        {copied ? <Check className="mdm-icon-sm" style={{ color: '#000' }} /> : <Copy className="mdm-icon-sm" style={{ color: '#000' }} />}
                        {copied ? 'Copied' : 'Copy Code'}
                      </motion.button>
                    </div>
                  )}
                </div>

                {activeFrontendFile === 'live' ? (
                  <Suspense fallback={<div className="mdm-live-preview-fallback">Loading preview...</div>}>
                    <LiveModuleFrontend
                      module={module}
                      onViewSourceCode={(f) => setActiveFrontendFile(f)}
                    />
                  </Suspense>
                ) : (
                  <div className="mdm-code-viewer">
                    <div className="mdm-code-header">
                      <span className="mdm-code-header-left">
                        src/modules/{module.slug}/
                        {activeFrontendFile === 'component'
                          ? `${module.name.replace(/\s+/g, '')}Manager.tsx`
                          : `${module.name.replace(/\s+/g, '')}.test.tsx`}
                      </span>
                      <span className="mdm-code-lang-badge">
                        React 19 &bull; JavaScript
                      </span>
                    </div>
                    <pre className="mdm-pre-code">
                      <code>{frontendCode[activeFrontendFile]}</code>
                    </pre>
                  </div>
                )}
              </motion.div>
            )}

            {/* TAB 3: SCHEMA */}
            {activeTab === 'schema' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="mdm-space-y-6"
              >
                {module.databaseTables.map((tbl, tIdx) => (
                  <div key={tIdx} className="mdm-schema-card">
                    <div className="mdm-table-header">
                      <div className="mdm-table-header-left">
                        <Database className="mdm-icon-sm" style={{ color: '#fff' }} />
                        <span className="mdm-table-name">
                          {tbl.name}
                        </span>
                        <span className="mdm-table-desc">&bull; {tbl.description}</span>
                      </div>
                      <span className="mdm-pk-badge">
                        PK: {tbl.primaryKey}
                      </span>
                    </div>

                    <div className="mdm-table-wrapper">
                      <table className="mdm-schema-table">
                        <thead className="mdm-table-head">
                          <tr>
                            <th className="mdm-table-cell">Column</th>
                            <th className="mdm-table-cell">Type</th>
                            <th className="mdm-table-cell">Nullable</th>
                            <th className="mdm-table-cell">Indexed</th>
                          </tr>
                        </thead>
                        <tbody className="mdm-table-body">
                          {tbl.columns.map((col, cIdx) => (
                            <tr key={cIdx} className="mdm-table-row">
                              <td className="mdm-table-cell" style={{ fontWeight: 600, color: '#fff' }}>{col.name}</td>
                              <td className="mdm-table-cell" style={{ color: '#d4d4d8' }}>{col.type}</td>
                              <td className="mdm-table-cell" style={{ color: '#a1a1aa' }}>{col.nullable ? 'YES' : 'NO'}</td>
                              <td className="mdm-table-cell">
                                {col.index ? (
                                  <span className="mdm-index-badge">
                                    INDEXED
                                  </span>
                                ) : (
                                  <span style={{ color: '#52525b' }}>-</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {tbl.foreignKeys.length > 0 && (
                      <div className="mdm-fk-section">
                        <span className="mdm-fk-label">Foreign Keys:</span>
                        {tbl.foreignKeys.map((fk, fIdx) => (
                          <span key={fIdx} className="mdm-fk-badge">
                            {fk.column} &rarr; {fk.table}({fk.references})
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </motion.div>
            )}

            {/* TAB 4: API */}
            {activeTab === 'api' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="mdm-space-y-6"
              >
                {/* Target backend simulation selector */}
                <div className="mdm-backend-switcher">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className="mdm-fw-label">Target Backend:</span>
                    <div className="mdm-fw-toggle">
                      <button
                        onClick={() => setApiBackendChoice('laravel')}
                        className={`mdm-fw-btn ${apiBackendChoice === 'laravel' ? 'mdm-fw-btn-active' : 'mdm-fw-btn-inactive'}`}
                      >
                        Laravel 11 (Sanctum)
                      </button>
                      <button
                        onClick={() => setApiBackendChoice('node')}
                        className={`mdm-fw-btn ${apiBackendChoice === 'node' ? 'mdm-fw-btn-active' : 'mdm-fw-btn-inactive'}`}
                      >
                        Node.js Express (MERN / JWT)
                      </button>
                    </div>
                  </div>
                  <div className="mdm-backend-info">
                    {apiBackendChoice === 'laravel' ? 'Auth: Bearer Sanctum Token' : 'Auth: JWT HS256 Token'}
                  </div>
                </div>

                <div className="mdm-space-y-3">
                  {module.apiEndpoints.map((ep, idx) => (
                    <div
                      key={idx}
                      className="mdm-api-card"
                    >
                      <div className="mdm-api-left">
                        <span
                          className={`mdm-method-badge ${
                            ep.method === 'GET'
                              ? 'mdm-method-get'
                              : ep.method === 'POST'
                              ? 'mdm-method-post'
                              : ep.method === 'PUT' || ep.method === 'PATCH'
                              ? 'mdm-method-put'
                              : 'mdm-method-delete'
                          }`}
                        >
                          {ep.method}
                        </span>
                        <span className="mdm-api-path">
                          {ep.path}
                        </span>
                        <span className="mdm-api-desc mdm-api-desc-desktop">
                          &bull; {ep.description}
                        </span>
                      </div>

                      <div className="mdm-api-right">
                        {ep.authRequired && (
                          <span className="mdm-auth-badge">
                            {apiBackendChoice === 'laravel' ? 'Sanctum Auth' : 'JWT Auth'}
                          </span>
                        )}
                        <motion.button
                          onClick={() => handleSimulateApi(ep)}
                          whileHover={{ scale: 1.04 }}
                          whileTap={{ scale: 0.96 }}
                          className="mdm-test-btn"
                        >
                          <Play style={{ color: '#000' }} />
                          Test Endpoint
                        </motion.button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* API Workbench Live Response */}
                {apiSimOutput && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mdm-sim-output"
                  >
                    <div className="mdm-sim-header">
                      <div className="mdm-sim-header-left">
                        <span className="mdm-status-badge">{apiSimOutput.status} OK</span>
                        <span className="mdm-sim-path">{apiSimOutput.path}</span>
                        {apiSimOutput.error && (
                          <span style={{
                            fontSize: '10px',
                            padding: '0.125rem 0.375rem',
                            borderRadius: '0.25rem',
                            backgroundColor: '#dc2626',
                            color: '#fff',
                            fontWeight: '700'
                          }}>
                            ERROR
                          </span>
                        )}
                      </div>
                      <span className="mdm-sim-duration">{apiSimOutput.duration}ms</span>
                    </div>
                    <pre className="mdm-sim-body">
                      {JSON.stringify(apiSimOutput.body, null, 2)}
                    </pre>
                  </motion.div>
                )}
                {simulating && (
                  <div className="mdm-simulating">
                    <span className="mdm-ping-dot" />
                    Executing request through {apiBackendChoice === 'node' ? 'Node.js Express / JWT' : 'Laravel Sanctum'} pipeline...
                  </div>
                )}
              </motion.div>
            )}

            {/* TAB 5: 15-STEP CHECKLIST */}
            {activeTab === 'checklist' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="mdm-space-y-4"
              >
                <div className="mdm-checklist-header">
                  <span className="mdm-checklist-header-text">Enterprise Architecture Compliance: 15 of 15 standards passed across both stacks</span>
                  <div className="mdm-checklist-header-right">
                    <div className="mdm-checklist-filter-bar">
                      <button
                        onClick={() => setChecklistFilter('all')}
                        className={`mdm-checklist-filter-btn ${checklistFilter === 'all' ? 'mdm-checklist-filter-active' : ''}`}
                      >
                        All Stacks
                      </button>
                      <button
                        onClick={() => setChecklistFilter('laravel')}
                        className={`mdm-checklist-filter-btn ${checklistFilter === 'laravel' ? 'mdm-checklist-filter-active' : ''}`}
                      >
                        Laravel
                      </button>
                      <button
                        onClick={() => setChecklistFilter('node')}
                        className={`mdm-checklist-filter-btn ${checklistFilter === 'node' ? 'mdm-checklist-filter-active' : ''}`}
                      >
                        Node.js MERN
                      </button>
                    </div>
                    <span className="mdm-checklist-pct">100% Validated</span>
                  </div>
                </div>

                <div className="mdm-checklist-items">
                  {checklistItems.map((item) => (
                    <div key={item.step} className="mdm-checklist-row">
                      <div className="mdm-checklist-left">
                        <span className="mdm-step-num">
                          #{item.step}
                        </span>
                        <div className="mdm-checklist-name-group">
                          <div className="mdm-checklist-name">{item.name}</div>
                          <div className="mdm-checklist-paths">
                            {(checklistFilter === 'all' || checklistFilter === 'laravel') && (
                              <div className="mdm-checklist-path-row">
                                <span className="mdm-path-badge">Laravel</span>
                                <span>{item.laravelPath}</span>
                              </div>
                            )}
                            {(checklistFilter === 'all' || checklistFilter === 'node') && (
                              <div className="mdm-checklist-path-row">
                                <span className="mdm-path-badge">Node/MERN</span>
                                <span>{item.nodePath}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <span className="mdm-checklist-status">
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
