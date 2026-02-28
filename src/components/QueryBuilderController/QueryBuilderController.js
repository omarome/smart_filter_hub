import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { QueryBuilder, ValueEditor } from 'react-querybuilder';
import PropTypes from 'prop-types';
import CollapseButton from '../CollapseButton/CollapseButton';
import AutocompleteValueEditor from '../AutocompleteValueEditor/AutocompleteValueEditor';
import { countRules } from '../../utils/queryUtils';
import '../../styles/QueryBuilderController.less';
import '../../styles/QueryBuilderController.query-builder.less';

/**
 * QueryBuilderController
 *
 * Wraps React Query Builder with:
 * - a collapsible panel
 * - autocomplete value editor integration
 * - tracking of open suggestion popovers for layout adjustments.
 */
const QueryBuilderController = ({
  fields,
  operators,
  initialQuery = { combinator: 'and', rules: [] },
  onQueryChange,
  label = 'Advanced filters',
  ...queryBuilderProps
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [query, setQuery] = useState(initialQuery);
  const openSuggestionsRef = useRef(new Set());
  const [hasSuggestionsOpen, setHasSuggestionsOpen] = useState(false);
  const containerRef = useRef(null);

  const handleToggle = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  const handleQueryChange = useCallback(
    (newQuery) => {
      setQuery(newQuery);
      if (onQueryChange) {
        onQueryChange(newQuery);
      }
    },
    [onQueryChange]
  );

  const rulesCount = useMemo(() => countRules(query), [query]);

  const expandedLabel = `Hide ${label}`;
  const collapsedLabel = `${label} [${rulesCount} selected]`;

  // Callback to handle suggestion state changes using Set to track editor IDs
  const handleSuggestionsChange = useCallback((hasSuggestions, editorId) => {
    if (hasSuggestions) {
      openSuggestionsRef.current.add(editorId);
    } else {
      openSuggestionsRef.current.delete(editorId);
    }
    // Update state to trigger re-render
    setHasSuggestionsOpen(openSuggestionsRef.current.size > 0);
  }, []);

  // Custom controls to use AutocompleteValueEditor for text inputs.
  // IMPORTANT: We import the library's default ValueEditor and use it as the
  // fallback.  Using `props.schema.controls.valueEditor` would recursively
  // call *this* custom component and freeze the UI.
  const customControls = useMemo(() => ({
    valueEditor: (props) => {
      const { fieldData, type, values, operator } = props;

      // Boolean / radio fields → always use the library's default editor
      if (
        type === 'checkbox' ||
        type === 'radio' ||
        fieldData?.valueEditorType === 'radio' ||
        fieldData?.valueEditorType === 'checkbox' ||
        fieldData?.type === 'boolean'
      ) {
        return <ValueEditor {...props} />;
      }

      // Null-check operators don't need a value editor
      if (operator === 'null' || operator === 'notNull') {
        return <ValueEditor {...props} />;
      }

      // Use autocomplete for text inputs when suggestion values are available
      const shouldUseAutocomplete =
        (type === 'text' || !type) &&
        values &&
        Array.isArray(values) &&
        values.length > 0;

      if (shouldUseAutocomplete) {
        return <AutocompleteValueEditor {...props} onSuggestionsChange={handleSuggestionsChange} />;
      }

      // Fall back to the library's default value editor
      return <ValueEditor {...props} />;
    },
  }), [handleSuggestionsChange]);

  // Determine value editor type from field configuration.
  // Operators are already set per-field in queryConfig.js (the library reads
  // field.operators natively), so no getOperators callback is needed.
  const getValueEditorType = useCallback((_field, _operator, { fieldData }) => {
    // If the field already declares a valueEditorType (radio, checkbox, select, etc.)
    // honour it directly — this is the library's recommended pattern.
    if (fieldData?.valueEditorType) {
      return fieldData.valueEditorType;
    }

    return 'text';
  }, []);

  // Close panel when clicking outside for better UX
  useEffect(() => {
    if (!isExpanded) return;

    const handleClickOutside = (event) => {
      if (!containerRef.current) return;

      const target = event.target;

      // Don't close when clicking inside autocomplete suggestions portal
      if (
        target &&
        typeof target.closest === 'function' &&
        target.closest('.autocomplete-value-editor__suggestions')
      ) {
        return;
      }

      if (!containerRef.current.contains(target)) {
        setIsExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside, true);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true);
    };
  }, [isExpanded]);

  return (
    <div
      className="query-builder-controller"
      ref={containerRef}
      data-testid="query-builder-controller"
    >
      <CollapseButton
        isExpanded={isExpanded}
        onToggle={handleToggle}
        expandedLabel={expandedLabel}
        collapsedLabel={collapsedLabel}
        data-testid="advanced-filters-toggle"
      />

      {isExpanded && (
        <div 
          className={`query-builder-controller__content ${hasSuggestionsOpen ? 'query-builder-controller__content--has-suggestions' : ''}`}
          data-testid="query-builder-content"
        >
          <QueryBuilder
            fields={fields}
            operators={operators}
            query={query}
            onQueryChange={handleQueryChange}
            showCombinatorsBetweenRules={true}
            showNotToggle={true}
            getValueEditorType={getValueEditorType}
            controlElements={customControls}
            {...queryBuilderProps}
          />
        </div>
      )}
    </div>
  );
};

QueryBuilderController.propTypes = {
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      label: PropTypes.string,
    })
  ).isRequired,
  operators: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      label: PropTypes.string,
    })
  ).isRequired,
  initialQuery: PropTypes.object,
  onQueryChange: PropTypes.func,
  label: PropTypes.string,
};

export default QueryBuilderController;
