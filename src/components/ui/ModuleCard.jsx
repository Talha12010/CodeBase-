import React, { useCallback } from 'react';
import { Database, Network, ChevronRight, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { ModuleIcon } from './ModuleIcon';

export const ModuleCard = React.memo(({ module, onSelect }) => {
  const handleClick = useCallback(() => onSelect(module), [module, onSelect]);

  return (
    <motion.div
      onClick={handleClick}
      whileHover={{ y: -4, transition: { duration: 0.18 } }}
      whileTap={{ scale: 0.98 }}
      className="mc-card"
    >
      <style>{`
        @keyframes mc-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .mc-card {
          position: relative;
          background-color: #09090b;
          border: 1px solid #27272a;
          border-radius: 0.75rem;
          padding: 1.25rem;
          transition: color 0.2s, background-color 0.2s, border-color 0.2s;
          cursor: pointer;
          box-shadow: 0 1px 2px rgba(0,0,0,0.05);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .mc-card:hover {
          background-color: #18181b;
          border-color: rgba(255,255,255,0.5);
          box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 0 15px rgba(255,255,255,0.05);
        }

        .mc-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 0.75rem;
          margin-bottom: 0.75rem;
        }

        .mc-header-left {
          display: flex;
          align-items: center;
          gap: 0.625rem;
        }

        .mc-icon-box {
          height: 2.25rem;
          width: 2.25rem;
          border-radius: 0.5rem;
          background-color: #18181b;
          border: 1px solid #3f3f46;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .mc-card:hover .mc-icon-box {
          transform: scale(1.05);
          background-color: #fff;
          color: #000;
        }

        .mc-title-row {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .mc-code {
          font-family: monospace;
          font-size: 11px;
          font-weight: 700;
          color: #fff;
          background-color: #18181b;
          padding: 0.125rem 0.375rem;
          border-radius: 0.25rem;
          border: 1px solid #3f3f46;
        }

        .mc-phase {
          font-size: 11px;
          color: #a1a1aa;
        }

        .mc-title {
          font-size: 0.875rem;
          font-weight: 600;
          color: #f4f4f5;
          margin-top: 0.125rem;
          transition: color 0.2s;
        }

        .mc-card:hover .mc-title {
          color: #fff;
        }

        .mc-badge {
          padding: 0.125rem 0.5rem;
          font-size: 10px;
          font-weight: 600;
          border-radius: 9999px;
          background-color: #18181b;
          color: #d4d4d8;
          border: 1px solid #3f3f46;
        }

        .mc-description {
          font-size: 0.75rem;
          color: #a1a1aa;
          line-height: 1.625;
          margin-bottom: 1rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .mc-card:hover .mc-description {
          color: #d4d4d8;
        }

        .mc-stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 0.5rem;
          padding: 0.625rem 0.75rem;
          background-color: #000;
          border-radius: 0.5rem;
          border: 1px solid rgba(39,39,42,0.8);
          text-align: center;
          margin-bottom: 0.75rem;
        }

        .mc-stat-label {
          font-size: 10px;
          color: #71717a;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.25rem;
        }

        .mc-stat-label svg {
          width: 0.625rem;
          height: 0.625rem;
          color: #a1a1aa;
        }

        .mc-stat-value {
          font-family: monospace;
          font-size: 0.75rem;
          font-weight: 600;
          color: #fff;
        }

        .mc-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.75rem;
          color: #a1a1aa;
          padding-top: 0.25rem;
          border-top: 1px solid rgba(39,39,42,0.8);
        }

        .mc-service {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          font-size: 11px;
          color: #a1a1aa;
          max-width: 170px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .mc-service-text {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .mc-inspect {
          color: #d4d4d8;
          display: flex;
          align-items: center;
          gap: 0.125rem;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .mc-card:hover .mc-inspect {
          color: #fff;
        }

        .mc-inspect svg {
          width: 0.875rem;
          height: 0.875rem;
          transition: transform 0.2s;
        }

        .mc-card:hover .mc-inspect svg {
          transform: translateX(0.25rem);
        }

        .mc-icon-inner {
          width: 1rem;
          height: 1rem;
        }
      `}</style>
      <div>
        <div className="mc-header">
          <div className="mc-header-left">
            <div className="mc-icon-box">
              <ModuleIcon name={module.iconName} className="mc-icon-inner" />
            </div>
            <div>
              <div className="mc-title-row">
                <span className="mc-code">
                  {module.code}
                </span>
                <span className="mc-phase">Phase {module.phase}</span>
              </div>
              <h3 className="mc-title">
                {module.name}
              </h3>
            </div>
          </div>

          <span className="mc-badge">
            {module.category}
          </span>
        </div>

        <p className="mc-description">
          {module.purpose}
        </p>
      </div>

      <div>
        <div className="mc-stats-grid">
          <div>
            <div className="mc-stat-label">
              <Database />
              Tables
            </div>
            <div className="mc-stat-value">
              {module.databaseTables.length}
            </div>
          </div>
          <div>
            <div className="mc-stat-label">
              <Network />
              APIs
            </div>
            <div className="mc-stat-value">
              {module.apiEndpoints.length}
            </div>
          </div>
          <div>
            <div className="mc-stat-label">
              <CheckCircle2 />
              Services
            </div>
            <div className="mc-stat-value">
              {module.services.length}
            </div>
          </div>
        </div>

        <div className="mc-footer">
          <div className="mc-service">
            <span className="mc-service-text">Service: {module.services[0] || 'DomainService'}</span>
          </div>
          <span className="mc-inspect">
            Inspect <ChevronRight />
          </span>
        </div>
      </div>
    </motion.div>
  );
});
ModuleCard.displayName = 'ModuleCard';
