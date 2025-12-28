import { useState } from 'react';
import Button from '../../ui/Button';
import OracleResultDisplay from '../OracleResultDisplay';
import { generateMonster } from '../../../data/oracles';
import { useGame } from '../../../context/GameContext';

export default function MonsterGenerator() {
  const { addLog } = useGame();
  const [result, setResult] = useState(null);

  const handleGenerateMonster = () => {
    const monster = generateMonster();
    setResult(monster);
    addLog(`Monster: ${monster.name} - ${monster.beast}`, 'mission');
  };

  return (
    <div className="space-y-4">
      <Button onClick={handleGenerateMonster} variant="danger" className="w-full">
        GENERATE MONSTER
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

