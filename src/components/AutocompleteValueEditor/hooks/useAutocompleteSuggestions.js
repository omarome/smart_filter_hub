import { useMemo } from 'react';
export const useAutocompleteSuggestions = (values, inputValue) => {
  // Extract suggestions from values array
  const suggestions = useMemo(() => {
    if (values && values.length > 0) {
      return values.map(v => typeof v === 'object' ? (v.label || v.name || v.value) : String(v));
    }
    return [];
  }, [values]);

  // Filter suggestions based on input
  const filteredSuggestions = useMemo(() => {
    if (!inputValue || inputValue.trim() === '') {
      return suggestions;
    }
    const lowerInput = inputValue.toLowerCase();
    return suggestions.filter(suggestion => 
      String(suggestion).toLowerCase().includes(lowerInput)
    );
  }, [inputValue, suggestions]);

  return { suggestions, filteredSuggestions };
};
