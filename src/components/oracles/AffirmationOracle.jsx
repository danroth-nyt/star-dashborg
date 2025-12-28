import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { rollAffirmation } from '../../data/oracles';
import Button from '../ui/Button';
import OracleResultDisplay from './OracleResultDisplay';

export default function AffirmationOracle() {
  const { addLog } = useGame();
  const [result, setResult] = useState(null);

  const handleRoll = () => {
    const oracleResult = rollAffirmation();
    setResult(oracleResult);
    addLog(`Oracle (${oracleResult.roll}): ${oracleResult.result} - ${oracleResult.detail} | Size: ${oracleResult.size} | Weather: ${oracleResult.weather} | NPC: ${oracleResult.npcReaction}`, 'roll');
  };

  return (
    <div className="space-y-4">
      <Button onClick={handleRoll} variant="primary" className="w-full">
        Ask the Oracle
      </Button>

      {result && (
        <OracleResultDisplay 
          result={result}
          variant="cyan"
        />
      )}
    </div>
  );
}

