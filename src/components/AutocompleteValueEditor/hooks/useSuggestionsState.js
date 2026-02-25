import { useEffect, useRef } from 'react';
export const useSuggestionsState = (
  showSuggestions,
  filteredSuggestionsLength,
  onSuggestionsChange,
  editorId
) => {
  const prevSuggestionsStateRef = useRef(false);
  
  useEffect(() => {
    if (!onSuggestionsChange) return;
    
    const hasSuggestions = showSuggestions && filteredSuggestionsLength > 0;
    
    // Only call callback if state actually changed
    if (hasSuggestions !== prevSuggestionsStateRef.current) {
      prevSuggestionsStateRef.current = hasSuggestions;
      onSuggestionsChange(hasSuggestions, editorId);
    }
    
    // Cleanup: notify parent that suggestions are closed when component unmounts
    return () => {
      if (prevSuggestionsStateRef.current) {
        onSuggestionsChange(false, editorId);
        prevSuggestionsStateRef.current = false;
      }
    };
  }, [showSuggestions, filteredSuggestionsLength, onSuggestionsChange, editorId]);
};
