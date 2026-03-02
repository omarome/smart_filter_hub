import React, { useCallback, useState, useMemo, useEffect, useRef } from 'react';
import 'react-querybuilder/dist/query-builder.css';
import QueryBuilderController from '../QueryBuilderController/QueryBuilderController';
import ResultsTable from '../ResultsTable/ResultsTable';
import DataSourceBanner from '../DataSourceBanner/DataSourceBanner';
import { filterData } from '../../utils/queryFilter';
import { fetchUsers, fetchVariables } from '../../services/userApi';
import { enhanceFieldWithValues } from '../../utils/fieldUtils';
import { buildFieldsFromVariables } from '../../config/queryConfig';
import { mockUsers } from '../../data/mockData';
import { mockVariables } from '../../data/mockVariables';
import '../../styles/CollapsibleList.less';

/**
 * CollapsibleList Component
 *
 * - Tries to fetch data from the backend API
 * - Falls back to mock data when the API is unreachable
 * - Shows a one-time banner indicating the data source
 */
const CollapsibleList = () => {
  const [users, setUsers] = useState([]);
  const [variables, setVariables] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState({
    combinator: 'and',
    rules: [],
  });

  // null = not yet determined, true = live API, false = mock fallback
  const [isLive, setIsLive] = useState(null);
  // Only show the banner once (on initial load)
  const hasLoadedRef = useRef(false);

  // Fetch from API; fall back to mock data on any error
  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      try {
        setIsLoading(true);
        const [usersData, variablesData] = await Promise.all([
          fetchUsers(),
          fetchVariables(),
        ]);
        if (!cancelled) {
          setUsers(usersData);
          setVariables(variablesData);
          setIsLive(true);
        }
      } catch {
        // Backend unreachable — use mock data
        if (!cancelled) {
          setUsers(mockUsers);
          setVariables(mockVariables);
          setIsLive(false);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
          hasLoadedRef.current = true;
        }
      }
    };

    loadData();

    return () => {
      cancelled = true;
    };
  }, []);

  // Build fields from variables, then enhance with autocomplete values from data
  const fields = useMemo(() => {
    const baseFields = buildFieldsFromVariables(variables);
    return baseFields.map((field) => enhanceFieldWithValues(users, field));
  }, [variables, users]);

  const handleQueryChange = useCallback((newQuery) => {
    setQuery(newQuery);
  }, []);

  // Filter data based on query (client-side filtering)
  const filteredData = useMemo(() => {
    return filterData(users, query);
  }, [users, query]);

  // Derive table columns from variables (uses label from the backend / mock)
  const tableColumns = useMemo(() => {
    if (users.length === 0) return [];

    const labelMap = new Map(variables.map((v) => [v.name, v.label]));

    return Object.keys(users[0]).map((key) => ({
      key,
      label: labelMap.get(key) || key,
    }));
  }, [users, variables]);

  return (
    <div className="collapsible-list" data-testid="collapsible-list">
      {isLive !== null && (
        <DataSourceBanner
          isLive={isLive}
          duration={Number(import.meta.env.VITE_BANNER_DURATION) || 3000}
        />
      )}
      <QueryBuilderController
        fields={fields}
        query={query}
        label="Advanced filters"
        onQueryChange={handleQueryChange}
      />
      <ResultsTable
        data={filteredData}
        columns={tableColumns}
        isLoading={isLoading}
      />
    </div>
  );
};

export default CollapsibleList;
