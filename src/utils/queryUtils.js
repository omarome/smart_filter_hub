/**
 * Utility functions for query operations
 */
export const countRules = (query) => {
  if (!query || !query.rules) return 0;

  let count = 0;
  const traverse = (rule) => {
    if (rule.rules) {
      // This is a rule group, traverse its children
      rule.rules.forEach(traverse);
    } else if (rule.field && rule.operator) {
      // This is an actual rule
      count++;
    }
  };

  traverse(query);
  return count;
};

export const formatQueryString = (query) => {
  if (!query || !query.rules || query.rules.length === 0) {
    return 'No filters applied';
  }

  // This is a simplified formatter - you can enhance it based on your needs
  return JSON.stringify(query, null, 2);
};
