import Button from '../../ui/Button';
import { generateCrimeLord } from '../../../data/oracles';
import { useGame } from '../../../context/GameContext';
import { useOracleHistoryContext } from '../../../context/OracleHistoryContext';

export default function CrimeLordGenerator() {
  const { addLog } = useGame();
  const history = useOracleHistoryContext();

  const handleGenerateCrimeLord = () => {
    const lord = generateCrimeLord();
    if (history) history.addResult(lord);
    addLog(`Crime Lord: ${lord.name}`, 'mission');
  };

  return (
    <div className="space-y-4">
      <Button onClick={handleGenerateCrimeLord} variant="danger" className="w-full">
        GENERATE CRIME LORD
      </Button>

    </div>
  );
}

