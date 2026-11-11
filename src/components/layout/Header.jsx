import React from 'react';
import { Search, Server, Database, Code2, ShieldCheck, Cpu, LayoutGrid, CheckCircle2, Laptop } from 'lucide-react';
import { motion } from 'motion/react';
import { MODULE_DOMAINS } from '../../data/allModules';

export const Header = ({
  activeView,
  setActiveView,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  totalModules
}) => {
  const navItems = [
    { id: 'modules', label: 'Enterprise Modules', icon: LayoutGrid },
    { id: 'frontend', label: 'Frontend Code & SDK', icon: Laptop },
    { id: 'architecture', label: 'Architecture & Rules', icon: Cpu },
    { id: 'database', label: 'MySQL Schema', icon: Database },
    { id: 'api', label: 'API v1 Workbench', icon: Code2 },
    { id: 'governance', label: 'System Governance', icon: ShieldCheck }
  ];

  return (
    <header className="header-root">
      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        .header-root {
          border-bottom-width: 1px;
          border-bottom-style: solid;
          border-color: #27272a;
          background-color: #000;
          position: sticky;
          top: 0;
          z-index: 40;
          width: 100%;
        }
        .header-top {
          max-width: 80rem;
          margin-left: auto;
          margin-right: auto;
          padding-left: 1rem;
          padding-right: 1rem;
          padding-top: 0.75rem;
          padding-bottom: 0.75rem;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          border-bottom-width: 1px;
          border-bottom-style: solid;
          border-color: rgba(39,39,42,0.8);
        }
        @media (min-width: 640px) {
          .header-top { padding-left: 1.5rem; padding-right: 1.5rem; }
        }
        @media (min-width: 1024px) {
          .header-top { padding-left: 2rem; padding-right: 2rem; }
        }
        .header-logo-area {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }
        .header-logo-motion {
          height: 2.5rem;
          width: 2.5rem;
          border-radius: 0.75rem;
          background-color: #fff;
          color: #000;
          padding: 0.125rem;
          box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05), 0 0 15px rgba(255,255,255,0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
        .header-logo-inner {
          height: 100%;
          width: 100%;
          background-color: #000;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-width: 1px;
          border-style: solid;
          border-color: #27272a;
        }
        .header-logo-icon {
          width: 1.25rem;
          height: 1.25rem;
          color: #fff;
        }
        .header-title-group {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .header-title {
          font-size: 1.125rem;
          line-height: 1.75rem;
          font-weight: 700;
          color: #fff;
          letter-spacing: -0.025em;
        }
        .header-badge {
          padding-left: 0.5rem;
          padding-right: 0.5rem;
          padding-top: 0.125rem;
          padding-bottom: 0.125rem;
          font-size: 0.75rem;
          line-height: 1rem;
          font-weight: 600;
          border-radius: 9999px;
          background-color: rgba(255,255,255,0.1);
          color: #fff;
          border-width: 1px;
          border-style: solid;
          border-color: rgba(255,255,255,0.2);
          display: flex;
          align-items: center;
          gap: 0.375rem;
        }
        .header-badge-dot {
          width: 0.375rem;
          height: 0.375rem;
          border-radius: 9999px;
          background-color: #fff;
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .header-subtitle {
          font-size: 0.75rem;
          line-height: 1rem;
          color: #a1a1aa;
        }
        .header-stats {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          font-size: 0.75rem;
          line-height: 1rem;
          color: #d4d4d8;
        }
        .header-stat {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .header-stat-label {
          color: #71717a;
        }
        .header-stat-value {
          font-family: monospace;
          font-weight: 700;
          color: #fff;
          background-color: #18181b;
          padding-left: 0.5rem;
          padding-right: 0.5rem;
          padding-top: 0.125rem;
          padding-bottom: 0.125rem;
          border-radius: 0.25rem;
          border-width: 1px;
          border-style: solid;
          border-color: #3f3f46;
        }
        .header-stat-domains {
          display: none;
        }
        @media (min-width: 768px) {
          .header-stat-domains { display: flex; }
        }
        .header-stat-arch {
          display: none;
        }
        @media (min-width: 640px) {
          .header-stat-arch { display: flex; }
        }
        .header-stat-arch-value {
          font-family: monospace;
          font-weight: 500;
          color: #fff;
          border-bottom-width: 1px;
          border-bottom-style: solid;
          border-color: rgba(255,255,255,0.4);
          padding-bottom: 0.125rem;
        }
        .header-nav-row {
          max-width: 80rem;
          margin-left: auto;
          margin-right: auto;
          padding-left: 1rem;
          padding-right: 1rem;
          padding-top: 0.625rem;
          padding-bottom: 0.625rem;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
        }
        @media (min-width: 640px) {
          .header-nav-row { padding-left: 1.5rem; padding-right: 1.5rem; }
        }
        @media (min-width: 1024px) {
          .header-nav-row { padding-left: 2rem; padding-right: 2rem; }
        }
        .header-nav {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          overflow-x: auto;
          padding-top: 0.25rem;
          padding-bottom: 0.25rem;
          scrollbar-width: none;
          position: relative;
        }
        .header-nav::-webkit-scrollbar { display: none; }
        .header-nav-btn {
          position: relative;
          padding-left: 0.875rem;
          padding-right: 0.875rem;
          padding-top: 0.375rem;
          padding-bottom: 0.375rem;
          border-radius: 0.5rem;
          font-size: 0.75rem;
          font-weight: 500;
          transition: color 0.15s, background-color 0.15s;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          white-space: nowrap;
          cursor: pointer;
          color: #000;
          background-color: #fff;
        }
        .header-nav-btn:hover {
          color: #fff;
          background-color: #000;
        }
        .header-nav-btn-active {
          background-color: #000;
          color: #fff;
          font-weight: 600;
        }
        .header-nav-btn-active:hover {
          color: #fff;
          background-color: #18181b;
        }
        .header-nav-icon {
          width: 1rem;
          height: 1rem;
          color: #000;
        }
        .header-nav-icon-active {
          color: #fff;
        }
        .header-search-wrap {
          position: relative;
          flex: 1 1 0%;
          max-width: 28rem;
          min-width: 240px;
        }
        .header-search-icon {
          position: absolute;
          left: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          width: 1rem;
          height: 1rem;
          color: #71717a;
        }
        .header-search-input {
          width: 100%;
          background-color: #09090b;
          border-width: 1px;
          border-style: solid;
          border-color: #27272a;
          border-radius: 0.5rem;
          padding-left: 2.25rem;
          padding-right: 1rem;
          padding-top: 0.375rem;
          padding-bottom: 0.375rem;
          font-size: 0.75rem;
          color: #fff;
          transition: all 0.15s;
          font-family: monospace;
        }
        .header-search-input::placeholder { color: #71717a; }
        .header-search-input:focus { outline: none; border-color: #fff; box-shadow: 0 0 0 1px #fff; }
        .header-search-clear {
          position: absolute;
          right: 0.625rem;
          top: 50%;
          transform: translateY(-50%);
          font-size: 0.75rem;
          color: #a1a1aa;
          font-family: monospace;
        }
        .header-search-clear:hover { color: #fff; }
        .header-domain-bar {
          max-width: 80rem;
          margin-left: auto;
          margin-right: auto;
          padding-left: 1rem;
          padding-right: 1rem;
          padding-top: 0.5rem;
          padding-bottom: 0.5rem;
          border-top-width: 1px;
          border-top-style: solid;
          border-color: #18181b;
          display: flex;
          align-items: center;
          gap: 0.375rem;
          overflow-x: auto;
          scrollbar-width: none;
          font-size: 0.75rem;
        }
        .header-domain-bar::-webkit-scrollbar { display: none; }
        @media (min-width: 640px) {
          .header-domain-bar { padding-left: 1.5rem; padding-right: 1.5rem; }
        }
        @media (min-width: 1024px) {
          .header-domain-bar { padding-left: 2rem; padding-right: 2rem; }
        }
        .header-domain-label {
          color: #71717a;
          margin-right: 0.5rem;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }
        .header-domain-all-btn {
          padding-left: 0.625rem;
          padding-right: 0.625rem;
          padding-top: 0.25rem;
          padding-bottom: 0.25rem;
          border-radius: 0.375rem;
          transition: all 0.15s;
          white-space: nowrap;
          cursor: pointer;
          color: #000;
          background-color: #fff;
        }
        .header-domain-all-btn:hover {
          color: #fff;
          background-color: #000;
        }
        .header-domain-all-btn-active {
          background-color: #000;
          color: #fff;
          font-weight: 700;
        }
        .header-domain-all-btn-active:hover {
          color: #fff;
          background-color: #18181b;
        }
        .header-domain-btn {
          padding-left: 0.625rem;
          padding-right: 0.625rem;
          padding-top: 0.25rem;
          padding-bottom: 0.25rem;
          border-radius: 0.375rem;
          transition: all 0.15s;
          white-space: nowrap;
          display: flex;
          align-items: center;
          gap: 0.375rem;
          cursor: pointer;
          color: #000;
          background-color: #fff;
          border-width: 1px;
          border-style: solid;
          border-color: #e5e5e5;
        }
        .header-domain-btn:hover {
          color: #fff;
          background-color: #000;
          border-color: #000;
        }
        .header-domain-btn-active {
          background-color: #000;
          color: #fff;
          border-color: #000;
          font-weight: 600;
        }
        .header-domain-btn-active:hover {
          color: #fff;
          background-color: #18181b;
        }
        .header-domain-range {
          font-size: 10px;
          color: #71717a;
          font-family: monospace;
        }
      `}</style>
      <div className="header-top">
        <div className="header-logo-area">
          <motion.div
            whileHover={{ scale: 1.05, rotate: 2 }}
            whileTap={{ scale: 0.95 }}
            className="header-logo-motion"
          >
            <div className="header-logo-inner">
              <Server className="header-logo-icon" />
            </div>
          </motion.div>
          <div>
            <div className="header-title-group">
              <h1 className="header-title">Nexus Enterprise</h1>
              <span className="header-badge">
                <span className="header-badge-dot" />
                Production Monolith
              </span>
            </div>
            <p className="header-subtitle">
              {totalModules} High-Cohesion Modules &bull; Laravel 11.x &bull; MySQL 8.0 &bull; React 19 JavaScript
            </p>
          </div>
        </div>

        <div className="header-stats">
          <div className="header-stat">
            <span className="header-stat-label">Modules:</span>
            <span className="header-stat-value">
              {totalModules} Active
            </span>
          </div>
          <div className="header-stat header-stat-domains">
            <span className="header-stat-label">Domains:</span>
            <span className="header-stat-value">
              {MODULE_DOMAINS.length}
            </span>
          </div>
          <div className="header-stat header-stat-arch">
            <span className="header-stat-label">Architecture:</span>
            <span className="header-stat-arch-value">Modular Monolith</span>
          </div>
        </div>
      </div>

      <div className="header-nav-row">
        <nav className="header-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <motion.button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.97 }}
                className={`header-nav-btn ${isActive ? 'header-nav-btn-active' : ''}`}
              >
                <Icon className={`header-nav-icon ${isActive ? 'header-nav-icon-active' : ''}`} />
                <span>{item.label}</span>
              </motion.button>
            );
          })}
        </nav>

        <div className="header-search-wrap">
          <Search className="header-search-icon" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search all ${totalModules} modules, tables, endpoints, services...`}
            className="header-search-input"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="header-search-clear"
            >
              &times;
            </button>
          )}
        </div>
      </div>

      {activeView === 'modules' && (
        <div className="header-domain-bar">
          <span className="header-domain-label">Domains:</span>
          <motion.button
            onClick={() => setSelectedCategory('All')}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.96 }}
            className={`header-domain-all-btn ${selectedCategory === 'All' ? 'header-domain-all-btn-active' : ''}`}
          >
            All ({totalModules})
          </motion.button>
          {MODULE_DOMAINS.map((domain) => (
            <motion.button
              key={domain.id}
              onClick={() => setSelectedCategory(domain.name)}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.96 }}
              className={`header-domain-btn ${selectedCategory === domain.name ? 'header-domain-btn-active' : ''}`}
            >
              <span>{domain.name}</span>
              <span className="header-domain-range">({domain.range})</span>
            </motion.button>
          ))}
        </div>
      )}
    </header>
  );
};
