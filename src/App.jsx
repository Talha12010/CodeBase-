import React, { useState, useMemo, useCallback, useRef, lazy, Suspense } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Header } from './components/layout/Header';
import { ModuleCard } from './components/ui/ModuleCard';
import { ModuleDetailModal } from './components/features/module-detail/ModuleDetailModal';
import { ALL_MODULES, MODULE_BY_ID } from './data/allModules';
import { useDebounce } from './hooks/useDebounce';
import { Search, Layers, Server } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const FrontendCodeView = lazy(() => import('./components/views/FrontendCodeView.jsx').then(m => ({ default: m.FrontendCodeView })));
const ArchitectureView = lazy(() => import('./components/views/ArchitectureView.jsx').then(m => ({ default: m.ArchitectureView })));
const DatabaseSchemaView = lazy(() => import('./components/views/DatabaseSchemaView.jsx').then(m => ({ default: m.DatabaseSchemaView })));
const ApiWorkbenchView = lazy(() => import('./components/views/ApiWorkbenchView.jsx').then(m => ({ default: m.ApiWorkbenchView })));
const SystemGovernanceView = lazy(() => import('./components/views/SystemGovernanceView.jsx').then(m => ({ default: m.SystemGovernanceView })));

const CARD_HEIGHT = 260;
const CARD_MIN_WIDTH = 280;
const GAP = 20;

function ViewLoader() {
  return (
    <div className="app-view-loader">
      <div className="app-spinner" />
    </div>
  );
}

export default function App() {
  const [activeView, setActiveView] = useState('modules');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedModule, setSelectedModule] = useState(null);

  const debouncedQuery = useDebounce(searchQuery, 150);

  const filteredModules = useMemo(() => {
    return ALL_MODULES.filter((m) => {
      const matchesCategory = selectedCategory === 'All' || m.category === selectedCategory;
      const q = debouncedQuery.toLowerCase().trim();
      if (!q) return matchesCategory;

      const matchesQuery =
        m.name.toLowerCase().includes(q) ||
        m.code.toLowerCase().includes(q) ||
        m.slug.toLowerCase().includes(q) ||
        m.category.toLowerCase().includes(q) ||
        m.purpose.toLowerCase().includes(q) ||
        m.services.some((s) => s.toLowerCase().includes(q)) ||
        m.databaseTables.some((t) => t.name.toLowerCase().includes(q)) ||
        m.apiEndpoints.some((e) => e.path.toLowerCase().includes(q));

      return matchesCategory && matchesQuery;
    });
  }, [debouncedQuery, selectedCategory]);

  const handleSelectDependency = useCallback((depId) => {
    const dep = MODULE_BY_ID.get(depId);
    if (dep) setSelectedModule(dep);
  }, []);

  const handleSelectModule = useCallback((m) => setSelectedModule(m), []);
  const handleCloseModal = useCallback(() => setSelectedModule(null), []);

  const parentRef = useRef(null);

  const columnCount = useMemo(() => {
    if (!parentRef.current) return 4;
    const w = parentRef.current.clientWidth;
    return Math.max(1, Math.floor((w + GAP) / (CARD_MIN_WIDTH + GAP)));
  }, []);

  const rowCount = Math.ceil(filteredModules.length / columnCount);

  const rowVirtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => CARD_HEIGHT + GAP,
    overscan: 3,
  });

  return (
    <>
    <style>{`
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      .app-base {
        min-height: 100vh;
        width: 100%;
        background-color: #000;
        color: #fff;
        display: flex;
        flex-direction: column;
      }
      .app-base::selection {
        background: #fff;
        color: #000;
      }
      .app-main {
        flex: 1 1 0%;
        padding-bottom: 4rem;
      }
      .app-module-container {
        max-width: 80rem;
        margin-left: auto;
        margin-right: auto;
        padding-left: 1rem;
        padding-right: 1rem;
        padding-top: 1.5rem;
        padding-bottom: 1.5rem;
      }
      @media (min-width: 640px) {
        .app-module-container {
          padding-left: 1.5rem;
          padding-right: 1.5rem;
        }
      }
      @media (min-width: 1024px) {
        .app-module-container {
          padding-left: 2rem;
          padding-right: 2rem;
        }
      }
      .app-module-container > * + * {
        margin-top: 1.5rem;
      }
      .app-module-header {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        padding-bottom: 0.75rem;
        border-bottom-width: 1px;
        border-color: #27272a;
      }
      @media (min-width: 640px) {
        .app-module-header {
          flex-direction: row;
          align-items: center;
        }
      }
      .app-module-header > *:first-child {
        flex: 1 1 0%;
        justify-content: space-between;
      }
      .app-module-title {
        font-size: 1.25rem;
        font-weight: 700;
        color: #fff;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
      .app-module-icon {
        width: 1.25rem;
        height: 1.25rem;
        color: #fff;
      }
      .app-module-subtitle {
        font-size: 0.75rem;
        color: #a1a1aa;
        margin-top: 0.125rem;
      }
      .app-filter-status {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.75rem;
      }
      .app-filter-label {
        color: #71717a;
      }
      .app-filter-value {
        padding: 0.25rem 0.625rem;
        border-radius: 0.25rem;
        background-color: #18181b;
        border-width: 1px;
        border-color: #3f3f46;
        color: #fff;
        font-weight: 500;
      }
      .app-empty-state {
        text-align: center;
        padding-top: 4rem;
        padding-bottom: 4rem;
        background-color: #09090b;
        border-radius: 1rem;
        border-width: 1px;
        border-color: #27272a;
      }
      .app-empty-state > * + * {
        margin-top: 0.75rem;
      }
      .app-empty-state-icon {
        width: 2rem;
        height: 2rem;
        color: #52525b;
        margin-left: auto;
        margin-right: auto;
      }
      .app-empty-state-title {
        font-size: 1rem;
        font-weight: 600;
        color: #d4d4d8;
      }
      .app-empty-state-description {
        font-size: 0.75rem;
        color: #71717a;
        max-width: 24rem;
        margin-left: auto;
        margin-right: auto;
      }
      .app-reset-button {
        padding: 0.5rem 1rem;
        background-color: #fff;
        color: #000;
        font-size: 0.75rem;
        font-weight: 700;
        border-radius: 0.5rem;
        transition: color 0.15s, background-color 0.15s, border-color 0.15s;
        cursor: pointer;
      }
      .app-reset-button:hover {
        background-color: #e5e5e5;
      }
      .app-virtual-list {
        overflow: auto;
        scrollbar-width: none;
      }
      .app-virtual-list::-webkit-scrollbar {
        display: none;
      }
      .app-footer {
        border-top-width: 1px;
        border-color: #27272a;
        background-color: #000;
        padding-top: 1.5rem;
        padding-bottom: 1.5rem;
        font-size: 0.75rem;
        color: #71717a;
      }
      .app-footer-container {
        max-width: 80rem;
        margin-left: auto;
        margin-right: auto;
        padding-left: 1rem;
        padding-right: 1rem;
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }
      @media (min-width: 640px) {
        .app-footer-container {
          padding-left: 1.5rem;
          padding-right: 1.5rem;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
        }
      }
      .app-footer-left {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
      .app-footer-icon {
        width: 1rem;
        height: 1rem;
        color: #fff;
      }
      .app-footer-brand {
        font-weight: 600;
        color: #d4d4d8;
      }
      .app-footer-tech {
        display: flex;
        align-items: center;
        gap: 1rem;
        font-size: 11px;
        font-family: monospace;
        color: #a1a1aa;
      }
      .app-view-loader {
        display: flex;
        align-items: center;
        justify-content: center;
        padding-top: 8rem;
        padding-bottom: 8rem;
      }
      .app-spinner {
        animation: spin 1s linear infinite;
        border-radius: 9999px;
        height: 1.5rem;
        width: 1.5rem;
        border-bottom-width: 2px;
        border-color: #fff;
      }
    `}</style>
    <div className="app-base">
      <Header
        activeView={activeView}
        setActiveView={setActiveView}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        totalModules={ALL_MODULES.length}
      />

      <main className="app-main">
        <AnimatePresence mode="wait">
          {activeView === 'modules' && (
            <motion.div
              key="modules"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="app-module-container"
            >
              <div className="app-module-header">
                <div>
                  <h2 className="app-module-title">
                    <Layers className="app-module-icon" />
                    Enterprise Module Catalog
                  </h2>
                  <p className="app-module-subtitle">
                    Showing {filteredModules.length} of {ALL_MODULES.length} business modules &bull; 100% Modular Monolith compliance
                  </p>
                </div>
                <div className="app-filter-status">
                  <span className="app-filter-label">Filter Status:</span>
                  <span className="app-filter-value">
                    {selectedCategory}
                  </span>
                </div>
              </div>

              {filteredModules.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="app-empty-state"
                >
                  <Search className="app-empty-state-icon" />
                  <h3 className="app-empty-state-title">No modules match your filter</h3>
                  <p className="app-empty-state-description">
                    Try clearing your search query or selecting &quot;All Domains&quot; to browse all {ALL_MODULES.length} enterprise business modules.
                  </p>
                  <button
                    onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}
                    className="app-reset-button"
                  >
                    Reset All Filters
                  </button>
                </motion.div>
              ) : (
                <div
                  ref={parentRef}
                  className="app-virtual-list"
                  style={{ height: 'calc(100vh - 260px)' }}
                >
                  <div
                    style={{ height: rowVirtualizer.getTotalSize(), position: 'relative', width: '100%' }}
                  >
                    {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                      const startIndex = virtualRow.index * columnCount;
                      const rowItems = filteredModules.slice(startIndex, startIndex + columnCount);
                      return (
                        <div
                          key={virtualRow.key}
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: virtualRow.size,
                            transform: `translateY(${virtualRow.start}px)`,
                            display: 'grid',
                            gridTemplateColumns: `repeat(${columnCount}, 1fr)`,
                            gap: `${GAP}px`,
                          }}
                        >
                          {rowItems.map((mod) => (
                            <div key={mod.id} style={{ height: CARD_HEIGHT, overflow: 'hidden' }}>
                              <ModuleCard
                                module={mod}
                                onSelect={handleSelectModule}
                              />
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {activeView === 'frontend' && (
            <motion.div key="frontend" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18 }}>
              <Suspense fallback={<ViewLoader />}><FrontendCodeView /></Suspense>
            </motion.div>
          )}

          {activeView === 'architecture' && (
            <motion.div key="architecture" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18 }}>
              <Suspense fallback={<ViewLoader />}><ArchitectureView /></Suspense>
            </motion.div>
          )}

          {activeView === 'database' && (
            <motion.div key="database" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18 }}>
              <Suspense fallback={<ViewLoader />}><DatabaseSchemaView /></Suspense>
            </motion.div>
          )}

          {activeView === 'api' && (
            <motion.div key="api" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18 }}>
              <Suspense fallback={<ViewLoader />}><ApiWorkbenchView /></Suspense>
            </motion.div>
          )}

          {activeView === 'governance' && (
            <motion.div key="governance" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18 }}>
              <Suspense fallback={<ViewLoader />}><SystemGovernanceView /></Suspense>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <ModuleDetailModal
        module={selectedModule}
        onClose={handleCloseModal}
        onSelectDependency={handleSelectDependency}
      />

      <footer className="app-footer">
        <div className="app-footer-container">
          <div className="app-footer-left">
            <Server className="app-footer-icon" />
            <span className="app-footer-brand">Nexus Enterprise Architecture</span>
            <span>&bull; {ALL_MODULES.length} Enterprise Business Modules</span>
          </div>
          <div className="app-footer-tech">
            <span>Laravel 11.x</span>
            <span>PHP 8.3+</span>
            <span>MySQL 8.0</span>
            <span>React 19</span>
            <span>Internal CSS</span>
          </div>
        </div>
      </footer>
    </div>
    </>
  );
}