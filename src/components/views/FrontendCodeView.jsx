import React, { useState, useMemo } from 'react';
import {
  Code2,
  Search,
  Filter,
  Copy,
  Check,
  Play,
  Layers,
  FileCode,
  CheckCircle2,
  ExternalLink,
  Laptop,
  Cpu,
  ShieldCheck,
  Sparkles,
  Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ALL_MODULES, MODULE_DOMAINS } from '../../data/allModules';
import { generateFrontendCode } from '../../utils/frontendCodeGenerator';

import { LiveModuleFrontend } from '../features/module-catalog/LiveModuleFrontend';
import { useDebounce } from '../../hooks/useDebounce';

export const FrontendCodeView = () => {
  const [selectedModule, setSelectedModule] = useState(null);
  const [activeFile, setActiveFile] = useState('component');
  const [searchModule, setSearchModule] = useState('');
  const [copied, setCopied] = useState(false);

  const debouncedSearch = useDebounce(searchModule, 150);

  const filteredModules = useMemo(() => {
    return ALL_MODULES.filter((m) =>
      !debouncedSearch ||
      m.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      m.code.toLowerCase().includes(debouncedSearch.toLowerCase())
    );
  }, [debouncedSearch]);


  const frontendCode = useMemo(() => {
    return selectedModule ? generateFrontendCode(selectedModule) : null;
  }, [selectedModule]);

  // Code shown in the Component.tsx tab — always just the component
  const activeComponentCode = useMemo(() => {
    if (!selectedModule || !frontendCode) return null;
    return frontendCode.component;
  }, [selectedModule, frontendCode]);


  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (filename, content) => {
    const blob = new Blob([content], { type: 'text/typescript;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <style>{`
        .fcv-container { max-width: 80rem; margin-left: auto; margin-right: auto; padding-left: 1rem; padding-right: 1rem; padding-top: 1.5rem; padding-bottom: 1.5rem; display: flex; flex-direction: column; gap: 1.5rem; }
        .fcv-header { padding-bottom: 0.75rem; border-bottom: 1px solid #27272a; }
        .fcv-title { font-size: 1.25rem; font-weight: 700; color: #fff; display: flex; align-items: center; gap: 0.5rem; }
        .fcv-title-icon { width: 1.25rem; height: 1.25rem; color: #fff; }
        .fcv-subtitle { font-size: 0.75rem; color: #a1a1aa; margin-top: 0.125rem; }
        .fcv-grid { display: grid; gap: 1.5rem; }
        .fcv-sidebar { display: flex; flex-direction: column; gap: 0.75rem; }
        .fcv-search-container { position: relative; }
        .fcv-search-icon { width: 1rem; height: 1rem; position: absolute; left: 0.75rem; top: 50%; transform: translateY(-50%); color: #71717a; }
        .fcv-search-input { width: 100%; background-color: #09090b; border: 1px solid #27272a; border-radius: 0.5rem; padding-left: 2.25rem; padding-right: 1rem; padding-top: 0.375rem; padding-bottom: 0.375rem; font-size: 0.75rem; color: #fff; transition: border-color 0.2s; outline: none; }
        .fcv-search-input::placeholder { color: #71717a; }
        .fcv-search-input:focus { border-color: #fff; }
        .fcv-module-list { max-height: 500px; overflow-y: auto; display: flex; flex-direction: column; gap: 0.25rem; }
        .fcv-module-btn { width: 100%; text-align: left; padding: 0.625rem; border-radius: 0.5rem; font-size: 0.75rem; transition: all 0.2s; cursor: pointer; background: transparent; border: 1px solid transparent; }
        .fcv-module-btn-active { background-color: #fff; color: #000; font-weight: 700; }
        .fcv-module-btn-inactive { background-color: #09090b; color: #d4d4d8; border: 1px solid #27272a; }
        .fcv-module-btn-inactive:hover { background-color: #18181b; border-color: #52525b; }
        .fcv-module-btn-inner { display: flex; align-items: center; gap: 0.5rem; }
        .fcv-module-code { font-family: monospace; font-size: 10px; font-weight: 700; }
        .fcv-module-name { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .fcv-main { display: flex; flex-direction: column; gap: 1rem; }
        .fcv-tabs-row { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.75rem; }
        .fcv-tabs { display: flex; align-items: center; gap: 0.25rem; background-color: #000; padding: 0.25rem; border-radius: 0.5rem; border: 1px solid #27272a; font-size: 0.75rem; overflow-x: auto; }
        .fcv-tab { padding-left: 0.75rem; padding-right: 0.75rem; padding-top: 0.25rem; padding-bottom: 0.25rem; border-radius: 0.25rem; transition: all 0.2s; cursor: pointer; white-space: nowrap; background: transparent; border: none; color: #a1a1aa; }
        .fcv-tab:hover { color: #fff; }
        .fcv-tab-active { background-color: #fff; color: #000; font-weight: 700; box-shadow: 0 1px 2px rgba(0,0,0,0.3); }
        .fcv-tab-actions { display: flex; align-items: center; gap: 0.5rem; }
        .fcv-action-btn-download { padding-left: 0.625rem; padding-right: 0.625rem; padding-top: 0.375rem; padding-bottom: 0.375rem; background-color: #18181b; border: 1px solid #3f3f46; font-size: 0.75rem; font-weight: 600; border-radius: 0.5rem; display: flex; align-items: center; gap: 0.375rem; color: #d4d4d8; transition: all 0.2s; cursor: pointer; }
        .fcv-action-btn-download:hover { background-color: #27272a; color: #fff; }
        .fcv-action-btn-copy { padding-left: 0.75rem; padding-right: 0.75rem; padding-top: 0.375rem; padding-bottom: 0.375rem; background-color: #fff; border: none; font-weight: 600; border-radius: 0.5rem; font-size: 0.75rem; display: flex; align-items: center; gap: 0.375rem; color: #000; transition: all 0.2s; cursor: pointer; }
        .fcv-action-btn-copy:hover { background-color: #e4e4e7; }
        .fcv-action-icon { width: 0.875rem; height: 0.875rem; }
        .fcv-code-panel { position: relative; background-color: #000; border: 1px solid #27272a; border-radius: 0.75rem; overflow: hidden; font-family: monospace; font-size: 0.75rem; }
        .fcv-code-header { padding-left: 1rem; padding-right: 1rem; padding-top: 0.5rem; padding-bottom: 0.5rem; background-color: #09090b; border-bottom: 1px solid #27272a; color: #a1a1aa; display: flex; align-items: center; justify-content: space-between; font-size: 11px; }
        .fcv-code-path { color: #d4d4d8; }
        .fcv-code-badge { color: #fff; font-family: monospace; background-color: #18181b; padding-left: 0.5rem; padding-right: 0.5rem; padding-top: 0.125rem; padding-bottom: 0.125rem; border-radius: 0.25rem; border: 1px solid #27272a; }
        .fcv-code-content { padding: 1rem; color: #e4e4e7; overflow-x: auto; max-height: 600px; line-height: 1.625; user-select: text; }
        .fcv-empty { text-align: center; padding: 4rem 0; background-color: #09090b; border-radius: 1rem; border: 1px solid #27272a; display: flex; flex-direction: column; gap: 0.75rem; }
        .fcv-empty-icon { width: 2rem; height: 2rem; color: #52525b; margin: 0 auto; }
        .fcv-empty-title { font-size: 1rem; font-weight: 600; color: #d4d4d8; }
        .fcv-empty-desc { font-size: 0.75rem; color: #71717a; max-width: 24rem; margin: 0 auto; }
        @media (min-width: 1024px) { .fcv-container { padding-left: 2rem; padding-right: 2rem; } .fcv-grid { grid-template-columns: repeat(4, 1fr); } }
        @media (min-width: 640px) { .fcv-container { padding-left: 1.5rem; padding-right: 1.5rem; } }
        @media (min-width: 1024px) { .fcv-main-span { grid-column: span 3; } }
      `}</style>
      <div className="fcv-container">
        {/* Header */}
        <div className="fcv-header">
          <h2 className="fcv-title">
            <Laptop className="fcv-title-icon" />
            Frontend Code & SDK Generator
          </h2>
          <p className="fcv-subtitle">
            Generate React 19 frontend code for any module. All-in-one component with tests and live preview.
          </p>
        </div>

        <div className="fcv-grid">
          {/* Module Picker */}
          <div className="fcv-sidebar">
            <div className="fcv-search-container">
              <Search className="fcv-search-icon" />
              <input
                type="text"
                value={searchModule}
                onChange={(e) => setSearchModule(e.target.value)}
                placeholder="Search modules..."
                className="fcv-search-input"
              />
            </div>

            <div className="fcv-module-list">
              {filteredModules.slice(0, 30).map((mod) => (
                <button
                  key={mod.id}
                  onClick={() => { setSelectedModule(mod); setActiveFile('component'); }}
                  className={`fcv-module-btn ${selectedModule?.id === mod.id ? 'fcv-module-btn-active' : 'fcv-module-btn-inactive'}`}
                >
                  <div className="fcv-module-btn-inner">
                    <span className="fcv-module-code">{mod.code}</span>
                    <span className="fcv-module-name">{mod.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Code Viewer */}
          <div className="fcv-main-span" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {selectedModule && frontendCode ? (
              <>
                {/* File Tabs */}
                <div className="fcv-tabs-row">
                  <div className="fcv-tabs">
                    {[
                      { id: 'component', label: 'Component.tsx' },
                      { id: 'test', label: 'Test.tsx' },
                      { id: 'live', label: 'Live UI' }
                    ].map((f) => (

                      <button
                        key={f.id}
                        onClick={() => setActiveFile(f.id)}
                        className={`fcv-tab ${activeFile === f.id ? 'fcv-tab-active' : ''}`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>

                  {activeFile !== 'live' && (
                    <div className="fcv-tab-actions">
                      <motion.button
                        onClick={() =>
                          handleDownload(
                            activeFile === 'component'
                              ? `${selectedModule.name.replace(/\s+/g, '')}Manager.tsx`
                              : `${selectedModule.name.replace(/\s+/g, '')}.test.tsx`,
                            activeFile === 'component'
                              ? activeComponentCode
                              : frontendCode.test
                          )
                        }
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="fcv-action-btn-download"
                      >
                        <Download className="fcv-action-icon" />
                        Download
                      </motion.button>
                      <motion.button
                      onClick={() =>
                          handleCopy(
                            activeFile === 'component'
                              ? activeComponentCode
                              : frontendCode.test
                          )
                        }
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="fcv-action-btn-copy"
                      >
                        {copied ? <Check className="fcv-action-icon" /> : <Copy className="fcv-action-icon" />}
                        {copied ? 'Copied' : 'Copy'}
                      </motion.button>
                    </div>
                  )}
                </div>

                {/* Code Display */}
                {activeFile === 'live' ? (
                  <LiveModuleFrontend module={selectedModule} />
                ) : (
                  <div className="fcv-code-panel">
                    <div className="fcv-code-header">
                      <span className="fcv-code-path">
                        src/modules/{selectedModule.slug}/
                        {activeFile === 'component'
                          ? `${selectedModule.name.replace(/\s+/g, '')}Manager.tsx`
                          : `${selectedModule.name.replace(/\s+/g, '')}.test.tsx`}
                      </span>
                      <span className="fcv-code-badge">
                        React 19 · JavaScript
                      </span>
                    </div>
                    <pre className="fcv-code-content">
                      <code>
                        {activeFile === 'component'
                          ? activeComponentCode
                          : frontendCode.test}
                      </code>
                    </pre>
                  </div>
                )}
              </>
            ) : (
              <div className="fcv-empty">
                <Code2 className="fcv-empty-icon" />
                <h3 className="fcv-empty-title">Select a module to generate frontend code</h3>
                <p className="fcv-empty-desc">
                  Choose any of the {ALL_MODULES.length} enterprise modules from the list to view generated React component, hook, API client, types, and test files.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
