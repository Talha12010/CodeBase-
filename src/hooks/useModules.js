import { useState, useMemo, useCallback } from 'react';
import { ALL_MODULES, MODULE_BY_ID } from '../data/allModules';

export function useModuleSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredModules = useMemo(() => {
    return ALL_MODULES.filter((m) => {
      const matchesCategory = selectedCategory === 'All' || m.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
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
  }, [searchQuery, selectedCategory]);

  const resetFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedCategory('All');
  }, []);

  return {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    filteredModules,
    resetFilters,
  };
}

export function useSelectedModule() {
  const [selectedModule, setSelectedModule] = useState(null);

  const handleSelectDependency = useCallback((depId) => {
    const dep = MODULE_BY_ID.get(depId);
    if (dep) {
      setSelectedModule(dep);
    }
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedModule(null);
  }, []);

  return {
    selectedModule,
    setSelectedModule,
    handleSelectDependency,
    clearSelection,
  };
}
