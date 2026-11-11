import React, { useState, useMemo, useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Globe, Search, Play, Key, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ALL_MODULES, MODULE_DOMAINS } from '../../data/allModules';
import { useDebounce } from '../../hooks/useDebounce';
import { apiRequest } from '../../hooks/useModuleApi';

export const ApiWorkbenchView = () => {
  const [searchEndpoint, setSearchEndpoint] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('All');
  const [selectedDomain, setSelectedDomain] = useState('All');
  const [activeEndpoint, setActiveEndpoint] = useState(null);

  const [simResponse, setSimResponse] = useState(null);
  const [executing, setExecuting] = useState(false);

  const debouncedSearch = useDebounce(searchEndpoint, 150);

  const allEndpoints = useMemo(() => {
    return ALL_MODULES.flatMap((mod) =>
      mod.apiEndpoints.map((ep) => ({
        endpoint: ep,
        moduleCode: mod.code,
        moduleName: mod.name,
        category: mod.category,
        sampleRecords: mod.sampleRecords || []
      }))
    );
  }, []);

  const filteredEndpoints = useMemo(() => {
    return allEndpoints.filter((ep) => {
      const matchesMethod = selectedMethod === 'All' || ep.endpoint.method === selectedMethod;
      const matchesDomain = selectedDomain === 'All' || ep.category === selectedDomain;
      const q = debouncedSearch.toLowerCase();
      const matchesSearch =
        !q ||
        ep.endpoint.path.toLowerCase().includes(q) ||
        ep.endpoint.description.toLowerCase().includes(q) ||
        ep.moduleName.toLowerCase().includes(q);
      return matchesMethod && matchesDomain && matchesSearch;
    });
  }, [allEndpoints, selectedMethod, selectedDomain, debouncedSearch]);

  const parentRef = useRef(null);

  const rowVirtualizer = useVirtualizer({
    count: filteredEndpoints.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 52,
    overscan: 10,
  });

  const handleSimulate = async (ep) => {
    setActiveEndpoint(ep);
    setExecuting(true);
    setSimResponse(null);

    try {
      const startTime = Date.now();
      const data = await apiRequest(ep.endpoint.path);
      const duration = Date.now() - startTime;
      setSimResponse({
        status: 200,
        timeMs: duration,
        body: data,
        isReal: true
      });
    } catch (err) {
      setSimResponse({
        status: err.status || 500,
        timeMs: 0,
        body: { success: false, message: err.message },
        isReal: true,
        error: true
      });
    } finally {
      setExecuting(false);
    }
  };

  return (
    <>
      <style>{`
        @keyframes aw-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes aw-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        .aw-container { max-width: 80rem; margin-left: auto; margin-right: auto; padding-left: 1rem; padding-right: 1rem; padding-top: 1.5rem; padding-bottom: 1.5rem; }
        .aw-header { padding-bottom: 0.75rem; border-bottom: 1px solid #27272a; }
        .aw-title { font-size: 1.25rem; font-weight: 700; color: #fff; display: flex; align-items: center; gap: 0.5rem; }
        .aw-title-icon { width: 1.25rem; height: 1.25rem; color: #fff; }
        .aw-subtitle { font-size: 0.75rem; color: #a1a1aa; margin-top: 0.125rem; }
        .aw-filter-bar { display: flex; flex-wrap: wrap; align-items: center; gap: 0.75rem; }
        .aw-search-container { position: relative; flex: 1; max-width: 20rem; min-width: 200px; }
        .aw-search-icon { width: 1rem; height: 1rem; position: absolute; left: 0.75rem; top: 50%; transform: translateY(-50%); color: #71717a; }
        .aw-search-input { width: 100%; background-color: #09090b; border: 1px solid #27272a; border-radius: 0.5rem; padding-left: 2.25rem; padding-right: 1rem; padding-top: 0.375rem; padding-bottom: 0.375rem; font-size: 0.75rem; color: #fff; transition: border-color 0.2s; outline: none; }
        .aw-search-input::placeholder { color: #71717a; }
        .aw-search-input:focus { border-color: #fff; }
        .aw-method-btns { display: flex; align-items: center; gap: 0.375rem; font-size: 0.75rem; }
        .aw-method-btn { padding-left: 0.625rem; padding-right: 0.625rem; padding-top: 0.25rem; padding-bottom: 0.25rem; border-radius: 0.375rem; transition: all 0.2s; cursor: pointer; background: transparent; border: 1px solid transparent; color: #a1a1aa; }
        .aw-method-btn:hover { color: #fff; background-color: #18181b; }
        .aw-method-btn-active-get { background-color: #27272a; color: #fff; border: 1px solid #52525b; font-weight: 700; }
        .aw-method-btn-active-post { background-color: #fff; color: #000; font-weight: 700; border: 1px solid transparent; }
        .aw-method-btn-active-other { background-color: #18181b; color: #fff; border: 1px solid #3f3f46; font-weight: 700; }
        .aw-domain-select { background-color: #09090b; border: 1px solid #27272a; border-radius: 0.5rem; padding-left: 0.75rem; padding-right: 0.75rem; padding-top: 0.375rem; padding-bottom: 0.375rem; font-size: 0.75rem; color: #fff; outline: none; cursor: pointer; }
        .aw-domain-select:focus { border-color: #fff; }
        .aw-domain-option { background-color: #09090b; color: #fff; }
        .aw-grid { display: grid; gap: 1.5rem; }
        .aw-list { overflow: auto; scrollbar-width: none; }
        .aw-list::-webkit-scrollbar { display: none; }
        .aw-ep-card { padding: 0.75rem; background-color: #000; border: 1px solid #27272a; border-radius: 0.5rem; display: flex; align-items: center; justify-content: space-between; gap: 0.75rem; cursor: pointer; transition: border-color 0.2s; }
        .aw-ep-card:hover { border-color: #52525b; }
        .aw-ep-card-active { border-color: #fff; }
        .aw-ep-left { display: flex; align-items: center; gap: 0.75rem; }
        .aw-method-badge { font-family: monospace; font-size: 11px; font-weight: 700; padding-left: 0.5rem; padding-right: 0.5rem; padding-top: 0.125rem; padding-bottom: 0.125rem; border-radius: 0.25rem; }
        .aw-method-get { background-color: #27272a; color: #fff; border: 1px solid #3f3f46; }
        .aw-method-post { background-color: #fff; color: #000; }
        .aw-method-other { background-color: #18181b; color: #d4d4d8; border: 1px solid #3f3f46; }
        .aw-ep-path { font-family: monospace; font-size: 0.75rem; font-weight: 600; color: #fff; }
        .aw-ep-desc { font-size: 10px; color: #a1a1aa; margin-top: 0.125rem; }
        .aw-ep-right { display: flex; align-items: center; gap: 0.5rem; }
        .aw-ep-icon { width: 0.75rem; height: 0.75rem; color: #71717a; }
        .aw-response-panel { display: flex; flex-direction: column; gap: 1rem; }
        .aw-response-card { background-color: #09090b; border: 1px solid #27272a; border-radius: 0.75rem; padding: 1rem; position: sticky; top: 6rem; }
        .aw-response-title { font-size: 0.75rem; font-weight: 700; color: #fff; margin-bottom: 0.75rem; display: flex; align-items: center; gap: 0.5rem; }
        .aw-response-title-icon { width: 0.875rem; height: 0.875rem; color: #fff; }
        .aw-loading { text-align: center; padding: 2rem 0; font-size: 0.75rem; color: #a1a1aa; }
        .aw-loading-icon { width: 1rem; height: 1rem; margin: 0 auto 0.5rem; color: #fff; animation: aw-spin 1s linear infinite; }
        .aw-pulse { animation: aw-pulse 2s ease-in-out infinite; }
        .aw-empty { text-align: center; padding: 2rem 0; font-size: 0.75rem; color: #71717a; }
        .aw-response-content { display: flex; flex-direction: column; gap: 0.75rem; }
        .aw-response-status-row { display: flex; align-items: center; gap: 0.5rem; }
        .aw-status-badge { background-color: #fff; color: #000; font-weight: 700; padding-left: 0.5rem; padding-right: 0.5rem; padding-top: 0.125rem; padding-bottom: 0.125rem; border-radius: 0.25rem; font-size: 0.75rem; }
        .aw-time-badge { font-size: 0.75rem; color: #a1a1aa; font-family: monospace; }
        .aw-json-pre { font-size: 11px; color: #d4d4d8; background-color: #000; border-radius: 0.5rem; padding: 0.75rem; border: 1px solid #27272a; max-height: 20rem; overflow-y: auto; font-family: monospace; line-height: 1.625; }
        @media (min-width: 1024px) { .aw-container { padding-left: 2rem; padding-right: 2rem; } }
        @media (min-width: 640px) { .aw-container { padding-left: 1.5rem; padding-right: 1.5rem; } }
        @media (min-width: 1024px) { .aw-grid { grid-template-columns: repeat(3, 1fr); } }
        @media (min-width: 1024px) { .aw-list-span { grid-column: span 2; } }
      `}</style>
      <div className="aw-container" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div className="aw-header">
          <h2 className="aw-title">
            <Globe className="aw-title-icon" />
            API v1 Workbench
          </h2>
          <p className="aw-subtitle">
            {filteredEndpoints.length} RESTful endpoints across {ALL_MODULES.length} modules &bull; Simulated request/response
          </p>
        </div>

        <div className="aw-filter-bar">
          <div className="aw-search-container">
            <Search className="aw-search-icon" />
            <input
              type="text"
              value={searchEndpoint}
              onChange={(e) => setSearchEndpoint(e.target.value)}
              placeholder="Search endpoints, paths, modules..."
              className="aw-search-input"
            />
          </div>

          <div className="aw-method-btns">
            {['All', 'GET', 'POST', 'PUT', 'PATCH', 'DELETE'].map((m) => (
              <button
                key={m}
                onClick={() => setSelectedMethod(m)}
                className={`aw-method-btn ${
                  selectedMethod === m
                    ? m === 'GET'
                      ? 'aw-method-btn-active-get'
                      : m === 'POST'
                      ? 'aw-method-btn-active-post'
                      : 'aw-method-btn-active-other'
                    : ''
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          <select
            value={selectedDomain}
            onChange={(e) => setSelectedDomain(e.target.value)}
            className="aw-domain-select"
          >
            <option value="All">All Domains</option>
            {MODULE_DOMAINS.slice(0, 10).map((d) => (
              <option key={d.id} value={d.name}>{d.name}</option>
            ))}
          </select>
        </div>

        <div className="aw-grid">
          <div
            ref={parentRef}
            className="aw-list aw-list-span"
            style={{ height: '600px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}
          >
            <div style={{ height: rowVirtualizer.getTotalSize(), position: 'relative', width: '100%' }}>
              {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                const ep = filteredEndpoints[virtualRow.index];
                return (
                  <div
                    key={`${ep.moduleCode}-${ep.endpoint.path}-${virtualRow.index}`}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      transform: `translateY(${virtualRow.start}px)`,
                    }}
                  >
                    <div
                      onClick={() => handleSimulate(ep)}
                      className={`aw-ep-card ${
                        activeEndpoint?.endpoint.path === ep.endpoint.path && activeEndpoint?.moduleCode === ep.moduleCode
                          ? 'aw-ep-card-active'
                          : ''
                      }`}
                    >
                      <div className="aw-ep-left">
                        <span className={`aw-method-badge ${
                          ep.endpoint.method === 'GET'
                            ? 'aw-method-get'
                            : ep.endpoint.method === 'POST'
                            ? 'aw-method-post'
                            : 'aw-method-other'
                        }`}>
                          {ep.endpoint.method}
                        </span>
                        <div>
                          <span className="aw-ep-path">{ep.endpoint.path}</span>
                          <div className="aw-ep-desc">{ep.endpoint.description} &bull; {ep.moduleName}</div>
                        </div>
                      </div>
                      <div className="aw-ep-right">
                        {ep.endpoint.authRequired && (
                          <Key className="aw-ep-icon" />
                        )}
                        <Play className="aw-ep-icon" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="aw-response-panel">
            <div className="aw-response-card">
              <h3 className="aw-response-title">
                <Play className="aw-response-title-icon" />
                Simulated Response
              </h3>

              {executing && (
                <div className="aw-loading aw-pulse">
                  <RefreshCw className="aw-loading-icon" />
                  Executing request...
                </div>
              )}

              {!executing && !simResponse && (
                <div className="aw-empty">
                  Click an endpoint to simulate a request
                </div>
              )}

              {!executing && simResponse && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="aw-response-content"
                >
                  <div className="aw-response-status-row">
                    <span className="aw-status-badge">{simResponse.status} OK</span>
                    <span className="aw-time-badge">{simResponse.timeMs}ms</span>
                    {simResponse.error && (
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
                  <pre className="aw-json-pre">
                    {JSON.stringify(simResponse.body, null, 2)}
                  </pre>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
