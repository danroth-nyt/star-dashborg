import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { rollAffirmation } from '../../data/oracles';
import Button from '../ui/Button';

export default function AffirmationOracle() {
  const { addLog } = useGame();
  const [result, setResult] = useState(null);

  const handleRoll = () => {
    const oracleResult = rollAffirmation();
    setResult(oracleResult);
    addLog(`Oracle says: ${oracleResult}`, 'roll');
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <Button onClick={handleRoll} variant="primary">
        Ask the Oracle
      </Button>

      {result && (
        <div className="text-center">
          <p className="text-accent-cyan text-2xl font-orbitron font-bold text-glow-cyan">
            {result}
          </p>
        </div>
      )}
    </div>
  );
}

