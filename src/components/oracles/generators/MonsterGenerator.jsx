import Button from '../../ui/Button';
import { generateMonster } from '../../../data/oracles';
import { useGame } from '../../../context/GameContext';
import { useOracleHistoryContext } from '../../../context/OracleHistoryContext';

export default function MonsterGenerator() {
  const { addLog } = useGame();
  const history = useOracleHistoryContext();

  const handleGenerateMonster = () => {
    const monster = generateMonster();
    if (history) history.addResult(monster);
    addLog(`Monster: ${monster.name} - ${monster.beast}`, 'mission');
  };

  return (
    <div className="space-y-4">
      <Button onClick={handleGenerateMonster} variant="danger" className="w-full">
        GENERATE MONSTER
      </Button>

    </div>
  );
}

