import { useState, useCallback } from 'react';

/**
 * Custom hook for managing oracle result history
 * Stores up to maxHistory results and provides navigation
 * 
 * @param {number} maxHistory - Maximum number of results to store (default: 10)
 * @returns {Object} History state and navigation functions
 */
export function useOracleHistory(maxHistory = 10) {
  const [resultHistory, setResultHistory] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Add new result to history (prepends to array)
  const addResult = useCallback((newResult) => {
    setResultHistory(prev => [newResult, ...prev].slice(0, maxHistory));
    setCurrentIndex(0); // Jump to newest result
  }, [maxHistory]);

  // Navigate to specific index in history
  const navigateTo = useCallback((index) => {
    setCurrentIndex(Math.max(0, Math.min(index, resultHistory.length - 1)));
  }, [resultHistory.length]);

  // Get current result from history
  const currentResult = resultHistory[currentIndex] || null;

  return {
    resultHistory,
    currentIndex,
    currentResult,
    addResult,
    navigateTo,
    totalResults: resultHistory.length
  };
}
