import { useCallback } from 'react';
export const useKeyboardNavigation = (
  showSuggestions,
  filteredSuggestions,
  selectedIndex,
  setSelectedIndex,
  handleSuggestionSelect,
  setShowSuggestions,
  inputValue
) => {
  return useCallback((e) => {
    if (!showSuggestions || filteredSuggestions.length === 0) {
      if (e.key === 'Enter' && inputValue) {
        setShowSuggestions(false);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < filteredSuggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < filteredSuggestions.length) {
          handleSuggestionSelect(filteredSuggestions[selectedIndex]);
        } else if (filteredSuggestions.length > 0) {
          // Auto-select first suggestion
          handleSuggestionSelect(filteredSuggestions[0]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setShowSuggestions(false);
        setSelectedIndex(-1);
        break;
      default:
        break;
    }
  }, [
    showSuggestions,
    filteredSuggestions,
    selectedIndex,
    setSelectedIndex,
    handleSuggestionSelect,
    setShowSuggestions,
    inputValue,
  ]);
};
