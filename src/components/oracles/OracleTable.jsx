import Button from '../ui/Button';
import { rollOnTable } from '../../data/oracles';
import { useGame } from '../../context/GameContext';
import { useOracleHistoryContext } from '../../context/OracleHistoryContext';

// Helper to format complex oracle results for logging
function formatLogMessage(title, result) {
  // Simple string results - just return as-is
  if (typeof result === 'string') {
    return `${title}: ${result}`;
  }
  
  // Not an object - fallback to string conversion
  if (typeof result !== 'object' || result === null) {
    return `${title}: ${result}`;
  }
  
  // Ship/Base Location format
  if (result.ship && result.base) {
    let message = `${title}: ${result.ship} | ${result.base}`;
    if (result.obstacleTriggered && result.obstacle) {
      message += ` | ${result.obstacle}`;
    }
    if (result.search) {
      message += ` | ${result.search}`;
    }
    return message;
  }
  
  // NPC/Character results with common properties
  if (result.species || result.role || result.demeanor) {
    const parts = [];
    if (result.species) parts.push(result.species);
    if (result.role) parts.push(result.role);
    if (result.demeanor) parts.push(result.demeanor);
    return `${title}: ${parts.join(' - ')}`;
  }
  
  // Mission results
  if (result.type && result.goods) {
    return `${title}: ${result.type} ${result.goods} at ${result.spot || 'location'} for ${result.reward || 'reward'}`;
  }
  
  // Planet results
  if (result.name && result.terrain) {
    return `${title}: ${result.name} - ${result.terrain}, ${result.weather || ''}`;
  }
  
  // Monster results
  if (result.name && result.beast) {
    return `${title}: ${result.name} - ${result.beast}`;
  }
  
  // Scene results (location, tone, obstacle)
  if (result.location && result.tone && result.obstacle) {
    const rolls = [result.locationRoll, result.toneRoll, result.obstacleRoll].filter(r => r !== undefined);
    const rollStr = rolls.length > 0 ? ` [${rolls.join(', ')}]` : '';
    return `Scene${rollStr}: ${result.location} - ${result.tone} - ${result.obstacle}`;
  }
  
  // Title Generator results (4 columns)
  if (result.titleType && result.col1 && result.col2 && result.col3 && result.col4) {
    const typeName = result.titleType === 'epic' ? 'Epic Title' : 'Episode Title';
    const rolls = [result.col1Roll, result.col2Roll, result.col3Roll, result.col4Roll].filter(r => r !== undefined);
    const rollStr = rolls.length > 0 ? ` [${rolls.join(', ')}]` : '';
    return `${typeName}${rollStr}: ${result.col1} ${result.col2} ${result.col3} ${result.col4}`;
  }
  
  // Generic result/detail format
  if (result.result && result.detail) {
    return `${title}: ${result.result} - ${result.detail}`;
  }
  
  // Single result property
  if (result.result) {
    return `${title}: ${result.result}`;
  }
  
  // Fallback: try to extract meaningful values
  const meaningfulKeys = Object.keys(result).filter(key => 
    !key.includes('Roll') && 
    !key.includes('Triggered') && 
    typeof result[key] === 'string'
  );
  
  if (meaningfulKeys.length > 0) {
    const values = meaningfulKeys.map(key => result[key]).filter(v => v);
    return `${title}: ${values.join(' | ')}`;
  }
  
  // Last resort: JSON stringify
  return `${title}: ${JSON.stringify(result)}`;
}

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
  const history = useOracleHistoryContext();

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
    
    // Add to history context if available
    if (history) {
      history.addResult(formattedResult);
    }
    
    // Optionally set parent result if provided (for centralized display - legacy support)
    if (setOracleResult) {
      setOracleResult(formattedResult);
    }
    
    // Log to session with intelligent formatting
    const logMessage = formatLogMessage(title, formattedResult);
    addLog(logMessage, 'oracle');
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-0.5 sm:gap-0">
        <span className="text-[10px] sm:text-sm font-orbitron uppercase text-gray-300 leading-tight">
          {title}
        </span>
        <span className="text-[9px] sm:text-xs font-orbitron text-gray-500 leading-tight">
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
    </div>
  );
}

