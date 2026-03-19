import React, { useMemo, useCallback, useState, useEffect } from 'react';
import {
  LucideZap,
  LucidePlusCircle,
  LucideFilter,
  LucideUsers,
  LucideClock,
  LucideTrendingDown,
  LucideUserMinus,
  LucideArrowRight,
  LucideTrash2
} from 'lucide-react';
import '../../styles/QuickFilterBuilder.less';

const QuickFilterBuilder = ({ query, onQueryChange, savedViews = [], onSaveView, onDeleteView }) => {
  // ── Local State for Sidebar ────────────────────────────
  const [localSelectedStatuses, setLocalSelectedStatuses] = useState([]);
  const [localAgeRange, setLocalAgeRange] = useState({ min: '', max: '' });
  const [localUserType, setLocalUserType] = useState('');

  // Helper to determine if a saved view is "active" based on current query
  const isSavedViewActive = (savedQueryJson) => {
    try {
      const savedQuery = JSON.parse(savedQueryJson);
      // Simple stringify comparison for exact match
      return JSON.stringify(query.rules) === JSON.stringify(savedQuery.rules) &&
        query.combinator === savedQuery.combinator;
    } catch (e) {
      return false;
    }
  };

  // ── Sync with Global Query Prop ────────────────────────
  // When the query prop changes (e.g. from Advanced Filters), update local state
  useEffect(() => {
    // Extract statuses
    const statusRule = query.rules.find(r => r.field === 'status' && r.operator === 'in');
    const statuses = statusRule?.value ? String(statusRule.value).split(',').map(v => v.trim()) : [];
    setLocalSelectedStatuses(statuses);

    // Extract age range
    const ageRule = query.rules.find(r => r.field === 'age' && r.operator === 'between');
    if (ageRule?.value) {
      const [min, max] = String(ageRule.value).split(',');
      setLocalAgeRange({ min: min || '', max: max || '' });
    } else {
      setLocalAgeRange({ min: '', max: '' });
    }

    // Extract user type
    const userTypeRule = query.rules.find(r => r.field === 'userType' && r.operator === '=');
    setLocalUserType(userTypeRule?.value || '');
  }, [query]);

  // ── Reactive Update Helper ─────────────────────────────
  const updateGlobalQuery = useCallback((statuses, age, type) => {
    // Preserve rules that AREN'T handled by the Quick Filter sidebar
    const otherRules = query.rules.filter(r =>
      r.field !== 'status' && r.field !== 'age' && r.field !== 'userType'
    );
    const newRules = [...otherRules];

    // Add sidebar rules
    if (statuses.length > 0) {
      newRules.push({ field: 'status', operator: 'in', value: statuses.join(',') });
    }
    if (age.min !== '' || age.max !== '') {
      newRules.push({ field: 'age', operator: 'between', value: `${age.min},${age.max}` });
    }
    if (type !== '') {
      newRules.push({ field: 'userType', operator: '=', value: type });
    }

    onQueryChange({ ...query, rules: newRules });
  }, [query, onQueryChange]);

  // ── Local UI Handlers ──────────────────────────────────

  const handleStatusToggle = useCallback((status) => {
    const nextStatuses = localSelectedStatuses.includes(status)
      ? localSelectedStatuses.filter(s => s !== status)
      : [...localSelectedStatuses, status];

    setLocalSelectedStatuses(nextStatuses);
    updateGlobalQuery(nextStatuses, localAgeRange, localUserType);
  }, [localSelectedStatuses, localAgeRange, localUserType, updateGlobalQuery]);

  const handleAgeChange = useCallback((type, value) => {
    const nextAgeRange = { ...localAgeRange, [type]: value };
    setLocalAgeRange(nextAgeRange);
    updateGlobalQuery(localSelectedStatuses, nextAgeRange, localUserType);
  }, [localSelectedStatuses, localAgeRange, localUserType, updateGlobalQuery]);

  const handleUserTypeChange = useCallback((value) => {
    setLocalUserType(value);
    updateGlobalQuery(localSelectedStatuses, localAgeRange, value);
  }, [localSelectedStatuses, localAgeRange, updateGlobalQuery]);

  const handleApplySavedView = useCallback((savedQueryJson) => {
    try {
      if (isSavedViewActive(savedQueryJson)) {
        // If it's already active, clicking it again should clear it
        onQueryChange({ combinator: 'and', rules: [] });
      } else {
        // Otherwise, apply it
        const savedQuery = JSON.parse(savedQueryJson);
        onQueryChange(savedQuery);
      }
    } catch (e) {
      console.error("Failed to parse saved query", e);
    }
  }, [onQueryChange, query]);

  const isStatusChecked = (status) => localSelectedStatuses.includes(status);

  const [searchQuery, setSearchQuery] = useState('');

  // Filter saved views based on search query
  const filteredSavedViews = useMemo(() => {
    return savedViews.filter(view =>
      view.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [savedViews, searchQuery]);

  return (
    <aside className="quick-filter-sidebar">
      {/* Quick Filter Builder Card */}
      <div className="sidebar-card">
        <div className="card-header">
          <h2 className="card-title">Quick Filter Builder</h2>
          <LucideZap size={16} className="title-icon zap-icon" />
        </div>
        <div className="card-body">
          <div className="filter-field">
            <label className="field-label">User Status</label>
            <div className="checkbox-group">
              <label className="checkbox-item">
                <input
                  type="checkbox"
                  checked={isStatusChecked('Active')}
                  onChange={() => handleStatusToggle('Active')}
                />
                <span className="badge badge-active">Active</span>
              </label>
              <label className="checkbox-item">
                <input
                  type="checkbox"
                  checked={isStatusChecked('Inactive')}
                  onChange={() => handleStatusToggle('Inactive')}
                />
                <span className="badge badge-inactive">Inactive</span>
              </label>
              <label className="checkbox-item">
                <input
                  type="checkbox"
                  checked={isStatusChecked('Pending')}
                  onChange={() => handleStatusToggle('Pending')}
                />
                <span className="badge badge-pending">Pending</span>
              </label>
            </div>
          </div>

          <div className="filter-field">
            <label className="field-label">Age Range</label>
            <div className="range-inputs">
              <input
                type="number"
                placeholder="Min"
                className="filter-input"
                value={localAgeRange.min}
                onChange={(e) => handleAgeChange('min', e.target.value)}
              />
              <span className="range-separator">-</span>
              <input
                type="number"
                placeholder="Max"
                className="filter-input"
                value={localAgeRange.max}
                onChange={(e) => handleAgeChange('max', e.target.value)}
              />
            </div>
          </div>


          <div className="filter-field">
            <label className="field-label">User Type</label>
            <select
              className="filter-select"
              value={localUserType}
              onChange={(e) => handleUserTypeChange(e.target.value)}
            >
              <option value="">All Types</option>
              <option value="student">Student</option>
              <option value="employee">Employee</option>
              <option value="unemployed">Unemployed</option>
              <option value="retired">Retired</option>
            </select>
          </div>
        </div>
      </div>

      {/* Saved Filters Card */}
      <div className="sidebar-card saved-filters-section">
        <div className="card-header">
          <h2 className="card-title">Saved Filters</h2>
          <button className="add-filter-btn" onClick={onSaveView} title="Save Current View">
            <LucidePlusCircle size={16} />
          </button>
        </div>

        {savedViews.length > 0 && (
          <div className="saved-filters-search">
            <input
              type="text"
              placeholder="Search saved filters..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="filter-input"
            />
          </div>
        )}

        <nav className="saved-filters-nav custom-scrollbar">
          {savedViews.length === 0 ? (
            <div className="no-filters-msg">No saved views yet.</div>
          ) : filteredSavedViews.length === 0 ? (
            <div className="no-filters-msg">No filters match your search.</div>
          ) : (
            filteredSavedViews.map((view) => {
              const isActive = isSavedViewActive(view.queryJson);
              return (
                <div key={view.id} className={`nav-item-wrapper ${isActive ? 'active' : ''}`}>
                  <button
                    className="nav-item-btn"
                    onClick={() => handleApplySavedView(view.queryJson)}
                    title={view.name}
                  >
                    <div className="nav-label-group">
                      <LucideFilter size={14} />
                      <span className="truncate-text">{view.name}</span>
                    </div>
                  </button>
                  <div className="nav-item-actions">
                    {isActive && <span className="applied-pill">Applied</span>}
                    <button
                      className="delete-view-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm(`Are you sure you want to delete "${view.name}"?`)) {
                          onDeleteView && onDeleteView(view.id);
                        }
                      }}
                      title="Delete saved filter"
                    >
                      <LucideTrash2 size={14} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </nav>
      </div>
    </aside>
  );
};

export default QuickFilterBuilder;
