import React, { useState, useMemo, useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Database, Search, Copy, Check } from 'lucide-react';
import { ALL_MODULES, MODULE_DOMAINS } from '../../data/allModules';
import { useDebounce } from '../../hooks/useDebounce';

export const DatabaseSchemaView = () => {
  const [searchTable, setSearchTable] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('All');
  const [copiedTable, setCopiedTable] = useState(null);

  const debouncedSearch = useDebounce(searchTable, 150);

  const allTablesWithModule = useMemo(() => {
    return ALL_MODULES.flatMap((mod) =>
      mod.databaseTables.map((tbl) => ({
        ...tbl,
        moduleCode: mod.code,
        moduleName: mod.name,
        category: mod.category,
        phase: mod.phase
      }))
    );
  }, []);

  const filteredTables = useMemo(() => {
    return allTablesWithModule.filter((tbl) => {
      const matchesDomain = selectedDomain === 'All' || tbl.category === selectedDomain;
      const q = debouncedSearch.toLowerCase();
      const matchesSearch =
        !q ||
        tbl.name.toLowerCase().includes(q) ||
        tbl.description.toLowerCase().includes(q) ||
        tbl.moduleName.toLowerCase().includes(q);
      return matchesDomain && matchesSearch;
    });
  }, [allTablesWithModule, selectedDomain, debouncedSearch]);

  const parentRef = useRef(null);

  const rowVirtualizer = useVirtualizer({
    count: filteredTables.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 200,
    overscan: 5,
  });

  const handleCopyDdl = (tbl) => {
    const columns = tbl.columns.map((col) => {
      let def = `  \`${col.name}\` ${col.type}`;
      if (!col.nullable) def += ' NOT NULL';
      if (col.index) def += ' INDEX';
      return def;
    }).join(',\n');

    const ddl = `CREATE TABLE \`${tbl.name}\` (\n${columns},\n  PRIMARY KEY (${tbl.primaryKey})\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`;

    navigator.clipboard.writeText(ddl);
    setCopiedTable(tbl.name);
    setTimeout(() => setCopiedTable(null), 2000);
  };

  return (
    <>
      <style>{`
        .dsv-container { max-width: 80rem; margin-left: auto; margin-right: auto; padding-left: 1rem; padding-right: 1rem; padding-top: 1.5rem; padding-bottom: 1.5rem; display: flex; flex-direction: column; gap: 1.5rem; }
        .dsv-header { display: flex; flex-direction: column; padding-bottom: 0.75rem; border-bottom: 1px solid #27272a; gap: 1rem; }
        .dsv-title { font-size: 1.25rem; font-weight: 700; color: #fff; display: flex; align-items: center; gap: 0.5rem; }
        .dsv-title-icon { width: 1.25rem; height: 1.25rem; color: #fff; }
        .dsv-subtitle { font-size: 0.75rem; color: #a1a1aa; margin-top: 0.125rem; }
        .dsv-filter-bar { display: flex; flex-wrap: wrap; align-items: center; gap: 0.75rem; }
        .dsv-search-container { position: relative; flex: 1; max-width: 20rem; min-width: 200px; }
        .dsv-search-icon { width: 1rem; height: 1rem; position: absolute; left: 0.75rem; top: 50%; transform: translateY(-50%); color: #71717a; }
        .dsv-search-input { width: 100%; background-color: #09090b; border: 1px solid #27272a; border-radius: 0.5rem; padding-left: 2.25rem; padding-right: 1rem; padding-top: 0.375rem; padding-bottom: 0.375rem; font-size: 0.75rem; color: #fff; transition: border-color 0.2s; outline: none; }
        .dsv-search-input::placeholder { color: #71717a; }
        .dsv-search-input:focus { border-color: #fff; }
        .dsv-domain-btns { display: flex; align-items: center; gap: 0.375rem; overflow-x: auto; font-size: 0.75rem; }
        .dsv-domain-btn { padding-left: 0.625rem; padding-right: 0.625rem; padding-top: 0.25rem; padding-bottom: 0.25rem; border-radius: 0.375rem; transition: all 0.2s; white-space: nowrap; cursor: pointer; background: transparent; border: 1px solid transparent; color: #a1a1aa; }
        .dsv-domain-btn:hover { color: #fff; background-color: #18181b; }
        .dsv-domain-btn-active { background-color: #fff; color: #000; font-weight: 700; border: 1px solid transparent; }
        .dsv-domain-btn-selected { background-color: #27272a; color: #fff; border: 1px solid #52525b; font-weight: 600; }
        .dsv-table-scroll { overflow: auto; scrollbar-width: none; display: grid; gap: 1rem; }
        .dsv-table-scroll::-webkit-scrollbar { display: none; }
        .dsv-table-card { background-color: #000; border: 1px solid #27272a; border-radius: 0.75rem; overflow: hidden; }
        .dsv-table-header { padding-left: 1rem; padding-right: 1rem; padding-top: 0.75rem; padding-bottom: 0.75rem; background-color: #09090b; border-bottom: 1px solid #27272a; display: flex; align-items: center; justify-content: space-between; }
        .dsv-table-header-left { display: flex; align-items: center; gap: 0.75rem; }
        .dsv-table-header-icon { width: 1rem; height: 1rem; color: #fff; }
        .dsv-table-name { font-family: monospace; font-size: 0.875rem; font-weight: 700; color: #fff; }
        .dsv-table-desc { font-size: 0.75rem; color: #a1a1aa; }
        .dsv-table-header-right { display: flex; align-items: center; gap: 0.5rem; }
        .dsv-module-badge { font-family: monospace; font-size: 10px; color: #a1a1aa; background-color: #18181b; padding-left: 0.375rem; padding-right: 0.375rem; padding-top: 0.125rem; padding-bottom: 0.125rem; border-radius: 0.25rem; border: 1px solid #27272a; }
        .dsv-copy-btn { padding: 0.375rem; color: #a1a1aa; transition: color 0.2s; cursor: pointer; background: transparent; border: none; }
        .dsv-copy-btn:hover { color: #fff; }
        .dsv-copy-icon { width: 0.875rem; height: 0.875rem; }
        .dsv-table-container { overflow-x: auto; }
        .dsv-table { width: 100%; text-align: left; font-size: 0.75rem; font-family: monospace; }
        .dsv-table thead { background-color: rgba(24, 24, 27, 0.5); color: #a1a1aa; border-bottom: 1px solid #27272a; }
        .dsv-table th { padding-top: 0.5rem; padding-bottom: 0.5rem; padding-left: 1rem; padding-right: 1rem; }
        .dsv-table td { padding-top: 0.5rem; padding-bottom: 0.5rem; padding-left: 1rem; padding-right: 1rem; }
        .dsv-table tr { border-bottom: 1px solid rgba(39, 39, 42, 0.5); }
        .dsv-table tbody tr:hover { background-color: rgba(24, 24, 27, 0.3); }
        .dsv-col-name { color: #fff; font-weight: 600; }
        .dsv-col-type { color: #d4d4d8; }
        .dsv-col-nullable { color: #a1a1aa; }
        .dsv-index-badge { color: #fff; font-size: 10px; background-color: #27272a; padding-left: 0.375rem; padding-right: 0.375rem; padding-top: 0.125rem; padding-bottom: 0.125rem; border-radius: 0.25rem; border: 1px solid #52525b; }
        .dsv-no-index { color: #52525b; }
        .dsv-fk-bar { padding-left: 1rem; padding-right: 1rem; padding-top: 0.5rem; padding-bottom: 0.5rem; background-color: #09090b; border-top: 1px solid #27272a; font-size: 11px; font-family: monospace; color: #a1a1aa; }
        .dsv-fk-label { color: #fff; font-weight: 600; }
        .dsv-fk-badge { background-color: #18181b; color: #d4d4d8; padding-left: 0.375rem; padding-right: 0.375rem; padding-top: 0.125rem; padding-bottom: 0.125rem; border-radius: 0.25rem; border: 1px solid #27272a; margin-right: 0.25rem; }
        @media (min-width: 1024px) { .dsv-container { padding-left: 2rem; padding-right: 2rem; } }
        @media (min-width: 640px) { .dsv-container { padding-left: 1.5rem; padding-right: 1.5rem; } .dsv-header { flex-direction: row; align-items: center; justify-content: space-between; } }
      `}</style>
      <div className="dsv-container">
        <div className="dsv-header">
          <div>
            <h2 className="dsv-title">
              <Database className="dsv-title-icon" />
              MySQL Schema Inspector
            </h2>
            <p className="dsv-subtitle">
              {filteredTables.length} tables across {ALL_MODULES.length} modules &bull; MySQL 8.0 InnoDB
            </p>
          </div>
        </div>

        <div className="dsv-filter-bar">
          <div className="dsv-search-container">
            <Search className="dsv-search-icon" />
            <input
              type="text"
              value={searchTable}
              onChange={(e) => setSearchTable(e.target.value)}
              placeholder="Search tables, columns, modules..."
              className="dsv-search-input"
            />
          </div>

          <div className="dsv-domain-btns">
            <button
              onClick={() => setSelectedDomain('All')}
              className={`dsv-domain-btn ${selectedDomain === 'All' ? 'dsv-domain-btn-active' : ''}`}
            >
              All
            </button>
            {MODULE_DOMAINS.slice(0, 10).map((d) => (
              <button
                key={d.id}
                onClick={() => setSelectedDomain(d.name)}
                className={`dsv-domain-btn ${selectedDomain === d.name ? 'dsv-domain-btn-selected' : ''}`}
              >
                {d.name}
              </button>
            ))}
          </div>
        </div>

        <div
          ref={parentRef}
          className="dsv-table-scroll"
          style={{ height: 'calc(100vh - 320px)' }}
        >
          <div style={{ height: rowVirtualizer.getTotalSize(), position: 'relative', width: '100%' }}>
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const tbl = filteredTables[virtualRow.index];
              return (
                <div
                  key={`${tbl.moduleCode}-${tbl.name}`}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    transform: `translateY(${virtualRow.start}px)`,
                  }}
                >
                  <div className="dsv-table-card">
                    <div className="dsv-table-header">
                      <div className="dsv-table-header-left">
                        <Database className="dsv-table-header-icon" />
                        <span className="dsv-table-name">{tbl.name}</span>
                        <span className="dsv-table-desc">&bull; {tbl.description}</span>
                      </div>
                      <div className="dsv-table-header-right">
                        <span className="dsv-module-badge">
                          {tbl.moduleCode}
                        </span>
                        <button
                          onClick={() => handleCopyDdl(tbl)}
                          className="dsv-copy-btn"
                          title="Copy DDL"
                        >
                          {copiedTable === tbl.name ? <Check className="dsv-copy-icon" /> : <Copy className="dsv-copy-icon" />}
                        </button>
                      </div>
                    </div>

                    <div className="dsv-table-container">
                      <table className="dsv-table">
                        <thead>
                          <tr>
                            <th>Column</th>
                            <th>Type</th>
                            <th>Nullable</th>
                            <th>Indexed</th>
                          </tr>
                        </thead>
                        <tbody>
                          {tbl.columns.map((col, cIdx) => (
                            <tr key={cIdx}>
                              <td className="dsv-col-name">{col.name}</td>
                              <td className="dsv-col-type">{col.type}</td>
                              <td className="dsv-col-nullable">{col.nullable ? 'YES' : 'NO'}</td>
                              <td>
                                {col.index ? (
                                  <span className="dsv-index-badge">INDEX</span>
                                ) : (
                                  <span className="dsv-no-index">-</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {tbl.foreignKeys.length > 0 && (
                      <div className="dsv-fk-bar">
                        <span className="dsv-fk-label">FK: </span>
                        {tbl.foreignKeys.map((fk, fIdx) => (
                          <span key={fIdx} className="dsv-fk-badge">
                            {fk.column} &rarr; {fk.table}({fk.references})
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};
