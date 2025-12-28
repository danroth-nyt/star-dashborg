import { useState } from 'react';
import Button from '../ui/Button';
import OracleResultDisplay from './OracleResultDisplay';
import { rollOnTable, rollDice } from '../../data/oracles';
import { useGame } from '../../context/GameContext';

export default function OracleTable({ 
  title, 
  table, 
  variant = 'cyan',
  diceType = 'd6',
  rollFunction = null,
  formatResult = null,
  setOracleResult = null
}) {
  const { addLog } = useGame();
  const [result, setResult] = useState(null);

  const handleRoll = () => {
    let rollResult;
    
    if (rollFunction) {
      // Use custom roll function if provided
      rollResult = rollFunction();
    } else if (Array.isArray(table)) {
      // Roll on array-based table
      rollResult = rollOnTable(table);
    } else {
      // Shouldn't happen, but fallback
      rollResult = 'Error: Invalid table';
    }

    // Format result if formatter provided
    const formattedResult = formatResult ? formatResult(rollResult) : rollResult;
    
    // Always set local result for display
    setResult(formattedResult);
    
    // Optionally set parent result if provided (for centralized display)
    if (setOracleResult) {
      setOracleResult(formattedResult);
    }
    
    // Log to session
    const logMessage = typeof formattedResult === 'string' 
      ? `${title}: ${formattedResult}`
      : `${title}: ${JSON.stringify(formattedResult)}`;
    addLog(logMessage, 'roll');
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-orbitron uppercase text-gray-300">
          {title}
        </span>
        <span className="text-xs font-orbitron text-gray-500">
          {diceType}
        </span>
      </div>
      
      <Button
        onClick={handleRoll}
        variant={variant === 'cyan' ? 'ghost' : variant === 'yellow' ? 'secondary' : 'danger'}
        className="w-full"
      >
        ROLL
      </Button>

      {result && (
        <OracleResultDisplay 
          result={result} 
          variant={variant}
          className="mt-3"
        />
      )}
    </div>
  );
}

