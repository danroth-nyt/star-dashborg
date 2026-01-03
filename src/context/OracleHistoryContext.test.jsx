import { describe, it, expect } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { OracleHistoryProvider, useOracleHistoryContext } from './OracleHistoryContext';

// Test component that uses the context
function TestConsumer() {
  const history = useOracleHistoryContext();
  
  if (!history) {
    return <div>No context</div>;
  }
  
  return (
    <div>
      <div data-testid="total-results">{history.totalResults}</div>
      <div data-testid="current-index">{history.currentIndex}</div>
      <div data-testid="current-result">
        {history.currentResult ? JSON.stringify(history.currentResult) : 'null'}
      </div>
      <button 
        data-testid="add-result" 
        onClick={() => history.addResult({ id: Date.now(), value: 'Test' })}
      >
        Add Result
      </button>
      <button 
        data-testid="navigate-back" 
        onClick={() => history.navigateTo(history.currentIndex + 1)}
      >
        Back
      </button>
    </div>
  );
}

describe('OracleHistoryContext', () => {
  describe('OracleHistoryProvider', () => {
    it('should provide context to children', () => {
      render(
        <OracleHistoryProvider>
          <TestConsumer />
        </OracleHistoryProvider>
      );
      
      expect(screen.getByTestId('total-results')).toHaveTextContent('0');
      expect(screen.getByTestId('current-index')).toHaveTextContent('0');
      expect(screen.getByTestId('current-result')).toHaveTextContent('null');
    });

    it('should allow adding results through context', () => {
      render(
        <OracleHistoryProvider>
          <TestConsumer />
        </OracleHistoryProvider>
      );
      
      const addButton = screen.getByTestId('add-result');
      
      act(() => {
        addButton.click();
      });
      
      expect(screen.getByTestId('total-results')).toHaveTextContent('1');
      expect(screen.getByTestId('current-result')).not.toHaveTextContent('null');
    });

    it('should handle navigation through context', () => {
      render(
        <OracleHistoryProvider>
          <TestConsumer />
        </OracleHistoryProvider>
      );
      
      const addButton = screen.getByTestId('add-result');
      const navigateBackButton = screen.getByTestId('navigate-back');
      
      // Add multiple results
      act(() => {
        addButton.click();
      });
      
      act(() => {
        addButton.click();
      });
      
      expect(screen.getByTestId('current-index')).toHaveTextContent('0');
      
      // Navigate back
      act(() => {
        navigateBackButton.click();
      });
      
      expect(screen.getByTestId('current-index')).toHaveTextContent('1');
    });
  });

  describe('useOracleHistoryContext', () => {
    it('should return null when used outside provider', () => {
      render(<TestConsumer />);
      
      expect(screen.getByText('No context')).toBeInTheDocument();
    });

    it('should return history object when used inside provider', () => {
      render(
        <OracleHistoryProvider>
          <TestConsumer />
        </OracleHistoryProvider>
      );
      
      expect(screen.queryByText('No context')).not.toBeInTheDocument();
      expect(screen.getByTestId('total-results')).toBeInTheDocument();
    });
  });

  describe('integration with components', () => {
    it('should maintain separate history per provider instance', () => {
      function MultipleProviders() {
        return (
          <div>
            <OracleHistoryProvider>
              <div data-testid="provider-1">
                <TestConsumer />
              </div>
            </OracleHistoryProvider>
            <OracleHistoryProvider>
              <div data-testid="provider-2">
                <TestConsumer />
              </div>
            </OracleHistoryProvider>
          </div>
        );
      }
      
      render(<MultipleProviders />);
      
      const provider1 = screen.getByTestId('provider-1');
      const provider2 = screen.getByTestId('provider-2');
      
      // Both should start with 0 results
      expect(provider1.querySelector('[data-testid="total-results"]')).toHaveTextContent('0');
      expect(provider2.querySelector('[data-testid="total-results"]')).toHaveTextContent('0');
      
      // Add result to provider 1
      const addButton1 = provider1.querySelector('[data-testid="add-result"]');
      act(() => {
        addButton1.click();
      });
      
      // Provider 1 should have 1 result, provider 2 should still have 0
      expect(provider1.querySelector('[data-testid="total-results"]')).toHaveTextContent('1');
      expect(provider2.querySelector('[data-testid="total-results"]')).toHaveTextContent('0');
    });

    it('should handle maxHistory limit from provider', () => {
      render(
        <OracleHistoryProvider>
          <TestConsumer />
        </OracleHistoryProvider>
      );
      
      const addButton = screen.getByTestId('add-result');
      
      // Add 12 results (max is 10)
      act(() => {
        for (let i = 0; i < 12; i++) {
          addButton.click();
        }
      });
      
      // Should only keep 10
      expect(screen.getByTestId('total-results')).toHaveTextContent('10');
    });
  });
});
