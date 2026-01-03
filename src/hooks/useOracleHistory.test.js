import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useOracleHistory } from './useOracleHistory';

describe('useOracleHistory', () => {
  describe('initial state', () => {
    it('should initialize with empty history', () => {
      const { result } = renderHook(() => useOracleHistory());
      
      expect(result.current.resultHistory).toEqual([]);
      expect(result.current.currentIndex).toBe(0);
      expect(result.current.currentResult).toBeNull();
      expect(result.current.totalResults).toBe(0);
    });

    it('should accept custom maxHistory parameter', () => {
      const { result } = renderHook(() => useOracleHistory(5));
      
      expect(result.current.resultHistory).toEqual([]);
    });
  });

  describe('addResult', () => {
    it('should add result to history', () => {
      const { result } = renderHook(() => useOracleHistory());
      
      act(() => {
        result.current.addResult({ roll: 1, value: 'Test Result' });
      });
      
      expect(result.current.resultHistory).toHaveLength(1);
      expect(result.current.resultHistory[0]).toEqual({ roll: 1, value: 'Test Result' });
    });

    it('should prepend new results to history', () => {
      const { result } = renderHook(() => useOracleHistory());
      
      act(() => {
        result.current.addResult({ id: 1 });
        result.current.addResult({ id: 2 });
        result.current.addResult({ id: 3 });
      });
      
      expect(result.current.resultHistory[0]).toEqual({ id: 3 });
      expect(result.current.resultHistory[1]).toEqual({ id: 2 });
      expect(result.current.resultHistory[2]).toEqual({ id: 1 });
    });

    it('should reset currentIndex to 0 when adding new result', () => {
      const { result } = renderHook(() => useOracleHistory());
      
      act(() => {
        result.current.addResult({ id: 1 });
        result.current.addResult({ id: 2 });
      });
      
      act(() => {
        result.current.navigateTo(1); // Navigate to second item
      });
      
      expect(result.current.currentIndex).toBe(1);
      
      act(() => {
        result.current.addResult({ id: 3 }); // Add new result
      });
      
      expect(result.current.currentIndex).toBe(0); // Should reset to 0
    });

    it('should respect maxHistory limit (default 10)', () => {
      const { result } = renderHook(() => useOracleHistory(10));
      
      act(() => {
        for (let i = 1; i <= 15; i++) {
          result.current.addResult({ id: i });
        }
      });
      
      expect(result.current.resultHistory).toHaveLength(10);
      expect(result.current.resultHistory[0].id).toBe(15); // Most recent
      expect(result.current.resultHistory[9].id).toBe(6); // 10th item
    });

    it('should respect custom maxHistory limit', () => {
      const { result } = renderHook(() => useOracleHistory(3));
      
      act(() => {
        result.current.addResult({ id: 1 });
        result.current.addResult({ id: 2 });
        result.current.addResult({ id: 3 });
        result.current.addResult({ id: 4 });
        result.current.addResult({ id: 5 });
      });
      
      expect(result.current.resultHistory).toHaveLength(3);
      expect(result.current.resultHistory[0].id).toBe(5);
      expect(result.current.resultHistory[1].id).toBe(4);
      expect(result.current.resultHistory[2].id).toBe(3);
    });

    it('should update totalResults', () => {
      const { result } = renderHook(() => useOracleHistory());
      
      expect(result.current.totalResults).toBe(0);
      
      act(() => {
        result.current.addResult({ id: 1 });
      });
      
      expect(result.current.totalResults).toBe(1);
      
      act(() => {
        result.current.addResult({ id: 2 });
        result.current.addResult({ id: 3 });
      });
      
      expect(result.current.totalResults).toBe(3);
    });
  });

  describe('navigateTo', () => {
    it('should navigate to valid index', () => {
      const { result } = renderHook(() => useOracleHistory());
      
      act(() => {
        result.current.addResult({ id: 1 });
        result.current.addResult({ id: 2 });
        result.current.addResult({ id: 3 });
      });
      
      act(() => {
        result.current.navigateTo(1);
      });
      
      expect(result.current.currentIndex).toBe(1);
    });

    it('should clamp to 0 for negative indices', () => {
      const { result } = renderHook(() => useOracleHistory());
      
      act(() => {
        result.current.addResult({ id: 1 });
        result.current.addResult({ id: 2 });
      });
      
      act(() => {
        result.current.navigateTo(-5);
      });
      
      expect(result.current.currentIndex).toBe(0);
    });

    it('should clamp to max index for out-of-bounds indices', () => {
      const { result } = renderHook(() => useOracleHistory());
      
      act(() => {
        result.current.addResult({ id: 1 });
        result.current.addResult({ id: 2 });
        result.current.addResult({ id: 3 });
      });
      
      act(() => {
        result.current.navigateTo(10);
      });
      
      expect(result.current.currentIndex).toBe(2); // Max index is 2 (length - 1)
    });

    it('should handle navigation on empty history', () => {
      const { result } = renderHook(() => useOracleHistory());
      
      act(() => {
        result.current.navigateTo(5);
      });
      
      expect(result.current.currentIndex).toBe(0);
    });
  });

  describe('currentResult', () => {
    it('should return null when history is empty', () => {
      const { result } = renderHook(() => useOracleHistory());
      
      expect(result.current.currentResult).toBeNull();
    });

    it('should return the result at currentIndex', () => {
      const { result } = renderHook(() => useOracleHistory());
      
      act(() => {
        result.current.addResult({ id: 1, value: 'First' });
        result.current.addResult({ id: 2, value: 'Second' });
        result.current.addResult({ id: 3, value: 'Third' });
      });
      
      expect(result.current.currentResult).toEqual({ id: 3, value: 'Third' });
      
      act(() => {
        result.current.navigateTo(1);
      });
      
      expect(result.current.currentResult).toEqual({ id: 2, value: 'Second' });
      
      act(() => {
        result.current.navigateTo(2);
      });
      
      expect(result.current.currentResult).toEqual({ id: 1, value: 'First' });
    });

    it('should update currentResult when new result is added', () => {
      const { result } = renderHook(() => useOracleHistory());
      
      act(() => {
        result.current.addResult({ id: 1 });
      });
      
      expect(result.current.currentResult).toEqual({ id: 1 });
      
      act(() => {
        result.current.addResult({ id: 2 });
      });
      
      expect(result.current.currentResult).toEqual({ id: 2 });
    });
  });

  describe('integration scenarios', () => {
    it('should handle complete navigation workflow', () => {
      const { result } = renderHook(() => useOracleHistory(5));
      
      // Add several results
      act(() => {
        result.current.addResult({ roll: 1, name: 'Result 1' });
        result.current.addResult({ roll: 2, name: 'Result 2' });
        result.current.addResult({ roll: 3, name: 'Result 3' });
      });
      
      // Navigate backwards
      act(() => {
        result.current.navigateTo(1);
      });
      expect(result.current.currentResult.name).toBe('Result 2');
      
      act(() => {
        result.current.navigateTo(2);
      });
      expect(result.current.currentResult.name).toBe('Result 1');
      
      // Navigate forward
      act(() => {
        result.current.navigateTo(0);
      });
      expect(result.current.currentResult.name).toBe('Result 3');
      
      // Add new result, should reset to index 0
      act(() => {
        result.current.addResult({ roll: 4, name: 'Result 4' });
      });
      expect(result.current.currentIndex).toBe(0);
      expect(result.current.currentResult.name).toBe('Result 4');
    });

    it('should handle maxHistory overflow correctly', () => {
      const { result } = renderHook(() => useOracleHistory(3));
      
      // Fill to capacity
      act(() => {
        result.current.addResult({ id: 1 });
        result.current.addResult({ id: 2 });
        result.current.addResult({ id: 3 });
      });
      
      expect(result.current.totalResults).toBe(3);
      
      // Navigate to last item
      act(() => {
        result.current.navigateTo(2);
      });
      
      expect(result.current.currentResult.id).toBe(1);
      
      // Add new result, should overflow
      act(() => {
        result.current.addResult({ id: 4 });
      });
      
      expect(result.current.totalResults).toBe(3); // Still 3
      expect(result.current.currentIndex).toBe(0); // Reset to 0
      expect(result.current.currentResult.id).toBe(4); // New result at front
      expect(result.current.resultHistory.find(r => r.id === 1)).toBeUndefined(); // Old result removed
    });
  });
});
