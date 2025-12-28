import { useState } from 'react';
import Button from '../../ui/Button';
import OracleResultDisplay from '../OracleResultDisplay';
import { generateCrimeLord } from '../../../data/oracles';
import { useGame } from '../../../context/GameContext';

export default function CrimeLordGenerator() {
  const { addLog } = useGame();
  const [result, setResult] = useState(null);

  const handleGenerateCrimeLord = () => {
    const lord = generateCrimeLord();
    setResult(lord);
    addLog(`Crime Lord: ${lord.name}`, 'mission');
  };

  return (
    <div className="space-y-4">
      <Button onClick={handleGenerateCrimeLord} variant="danger" className="w-full">
        GENERATE CRIME LORD
      </Button>

      {/* Result Display */}
      {result && (
        <OracleResultDisplay 
          result={result}
          variant="red"
        />
      )}
    </div>
  );
}

