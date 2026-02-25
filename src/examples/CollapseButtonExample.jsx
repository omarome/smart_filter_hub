import React, { useState } from 'react';
import CollapseButton from '../components/CollapseButton/CollapseButton';

/**
 * Example demonstrating how to use CollapseButton in different contexts
 * This shows the reusability of the CollapseButton component
 */
const CollapseButtonExample = () => {
  const [isDetailsExpanded, setIsDetailsExpanded] = useState(false);
  const [isSettingsExpanded, setIsSettingsExpanded] = useState(false);
  const [isCommentsExpanded, setIsCommentsExpanded] = useState(false);

  return (
    <div style={{ padding: '20px', maxWidth: '600px' }}>
      <h2>CollapseButton Usage Examples</h2>
      
      {/* Example 1: Simple Details Toggle */}
      <section style={{ marginBottom: '20px' }}>
        <CollapseButton
          isExpanded={isDetailsExpanded}
          onToggle={() => setIsDetailsExpanded(!isDetailsExpanded)}
          expandedLabel="Hide Details"
          collapsedLabel="Show Details"
        />
        {isDetailsExpanded && (
          <div style={{ padding: '10px', background: '#f5f5f5', marginTop: '10px' }}>
            <p>These are the details that can be shown or hidden.</p>
          </div>
        )}
      </section>

      {/* Example 2: Settings Panel */}
      <section style={{ marginBottom: '20px' }}>
        <CollapseButton
          isExpanded={isSettingsExpanded}
          onToggle={() => setIsSettingsExpanded(!isSettingsExpanded)}
          expandedLabel="Close Settings"
          collapsedLabel="Open Settings"
        />
        {isSettingsExpanded && (
          <div style={{ padding: '10px', background: '#f5f5f5', marginTop: '10px' }}>
            <h3>Settings</h3>
            <label>
              <input type="checkbox" /> Enable notifications
            </label>
            <br />
            <label>
              <input type="checkbox" /> Dark mode
            </label>
          </div>
        )}
      </section>

      {/* Example 3: Comments Section */}
      <section style={{ marginBottom: '20px' }}>
        <CollapseButton
          isExpanded={isCommentsExpanded}
          onToggle={() => setIsCommentsExpanded(!isCommentsExpanded)}
          expandedLabel="Hide Comments"
          collapsedLabel="Show Comments (5)"
        />
        {isCommentsExpanded && (
          <div style={{ padding: '10px', background: '#f5f5f5', marginTop: '10px' }}>
            <ul>
              <li>Comment 1</li>
              <li>Comment 2</li>
              <li>Comment 3</li>
            </ul>
          </div>
        )}
      </section>
    </div>
  );
};

export default CollapseButtonExample;
