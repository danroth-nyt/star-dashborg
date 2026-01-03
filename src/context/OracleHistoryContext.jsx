import { createContext, useContext } from 'react';
import { useOracleHistory } from '../hooks/useOracleHistory';

/**
 * Context for sharing oracle history within a tab
 * Each tab in OracleCompendium has its own isolated history
 */
export const OracleHistoryContext = createContext(null);

/**
 * Provider component that wraps a tab and provides history management
 */
export function OracleHistoryProvider({ children }) {
  const history = useOracleHistory(10);
  
  return (
    <OracleHistoryContext.Provider value={history}>
      {children}
    </OracleHistoryContext.Provider>
  );
}

/**
 * Hook to access oracle history within a tab
 * Returns null if used outside of OracleHistoryProvider
 */
export function useOracleHistoryContext() {
  return useContext(OracleHistoryContext);
}
