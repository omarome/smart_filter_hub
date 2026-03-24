import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { QueryBuilder, ValueEditor } from 'react-querybuilder';
import PropTypes from 'prop-types';
import { LucideX, LucideFilter } from 'lucide-react';
import CollapseButton from '../CollapseButton/CollapseButton';
import AutocompleteValueEditor from '../AutocompleteValueEditor/AutocompleteValueEditor';
import { countRules } from '../../utils/queryUtils';
import '../../styles/QueryBuilderController.less';
import '../../styles/QueryBuilderController.query-builder.less';

/**
 * QueryBuilderController
 *
 * Presentational wrapper around React Query Builder:
 * - collapsible panel
 * - autocomplete value editor for text fields
 * - tracks open suggestion popovers for layout adjustments
 *
 * Query state is owned by the **parent** (controlled mode).
 * This component never holds its own copy of the query.
 */
const QueryBuilderController = ({
  fields,
  query,
  onQueryChange,
  label = 'Advanced filters',
  ...queryBuilderProps
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [localQuery, setLocalQuery] = useState(query);
  const openSuggestionsRef = useRef(new Set());
  const [hasSuggestionsOpen, setHasSuggestionsOpen] = useState(false);

  const handleToggle = useCallback(() => {
    // When opening, snapshot the current query properties
    if (!isModalOpen) {
      if (query.rules.length === 0 && fields.length > 0) {
        setLocalQuery({
          ...query,
          rules: [{ field: fields[0].name, operator: '=', value: '' }]
        });
      } else {
        setLocalQuery(query);
      }
      setIsModalOpen(true);
    } else {
      setIsModalOpen(false);
    }
  }, [isModalOpen, query, fields]);

  const handleApply = useCallback(() => {
    onQueryChange(localQuery);
    setIsModalOpen(false);
  }, [localQuery, onQueryChange]);

  // Derive rule count from the query prop (single source of truth)
  const rulesCount = useMemo(() => countRules(query), [query]);

  const expandedLabel = `Hide ${label}`;
  const collapsedLabel = (
    <span className="collapse-button__label-wrapper">
      <span className="collapse-button__label-text">{label}</span>
      {rulesCount > 0 && <span className="collapse-button__label-count">[{rulesCount} selected]</span>}
    </span>
  );

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
  // We keep the component stable (AutocompleteValueEditor) for all potential
  // autocomplete fields, even if data hasn't loaded yet.
  const customControls = useMemo(() => ({
    removeRuleAction: (props) => (
      <button
        type="button"
        className={props.className}
        title={props.title}
        onClick={(e) => props.handleOnClick(e)}
        data-testid="remove-rule"
      >
        <span className="remove-rule-text">Remove Rule</span>
      </button>
    ),
    valueEditor: (props) => {
      const { fieldData, type, operator } = props;

      // Non-text editors (select, radio, checkbox) → use the library's default
      if (
        type === 'select' ||
        type === 'radio' ||
        fieldData?.valueEditorType === 'select' ||
        fieldData?.valueEditorType === 'radio' ||
        fieldData?.type === 'boolean'
      ) {
        return <ValueEditor {...props} />;
      }

      // Null-check operators don't need a value editor
      if (operator === 'null' || operator === 'notNull') {
        return <ValueEditor {...props} />;
      }

      // Use autocomplete for text inputs. We no longer check for values.length here
      // to keep the component from unmounting/remounting when data arrives.
      const isTextField = type === 'text' || !type;

      if (isTextField) {
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

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  return (
    <div className="query-builder-controller" data-testid="query-builder-controller">
      <CollapseButton
        isExpanded={isModalOpen}
        onToggle={handleToggle}
        expandedLabel={expandedLabel}
        collapsedLabel={collapsedLabel}
        data-testid="advanced-filters-toggle"
      />

      {isModalOpen && createPortal(
        <div className="query-builder-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div 
            className="query-builder-modal-content" 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="query-builder-modal-header">
              <h2><LucideFilter size={18} /> {label}</h2>
              <button className="close-modal-btn" onClick={() => setIsModalOpen(false)}>
                <LucideX size={20} />
              </button>
            </div>
            
            <div className={`query-builder-modal-body query-builder-controller__content ${hasSuggestionsOpen ? 'query-builder-controller__content--has-suggestions' : ''}`}>
              <QueryBuilder
                fields={fields}
                query={localQuery}
                onQueryChange={setLocalQuery}
                showCombinatorsBetweenRules={true}
                showNotToggle={true}
                getValueEditorType={getValueEditorType}
                controlElements={customControls}
                {...queryBuilderProps}
              />
            </div>
            
            <div className="query-builder-modal-footer">
              <button className="cancel-btn" onClick={() => setIsModalOpen(false)}>Cancel</button>
              <button className="apply-btn" onClick={handleApply}>Apply Filters</button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

QueryBuilderController.propTypes = {
  /** Field definitions (with per-field operators, validators, etc.) */
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      label: PropTypes.string,
    })
  ).isRequired,
  /** Controlled query object — parent is the single source of truth */
  query: PropTypes.object.isRequired,
  /** Called whenever the query changes */
  onQueryChange: PropTypes.func.isRequired,
  /** Label shown on the collapse button */
  label: PropTypes.string,
};

export default QueryBuilderController;
