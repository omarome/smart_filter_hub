import { useEffect } from 'react';
export const useClickOutside = (isActive, containerRef, suggestionsRef, onClose) => {
  useEffect(() => {
    if (!isActive) return;

    const handleClickOutside = (event) => {
      const target = event.target;
      const isClickInsideInput = containerRef.current?.contains(target);
      const isClickInsideSuggestions = suggestionsRef.current?.contains(target);
      
      if (!isClickInsideInput && !isClickInsideSuggestions) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isActive, containerRef, suggestionsRef, onClose]);
};
