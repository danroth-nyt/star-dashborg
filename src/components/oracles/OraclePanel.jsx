import { useGame } from '../../context/GameContext';
import { rollTable, rollAffirmation, generateMission } from '../../data/oracles';
import Accordion from '../ui/Accordion';
import Button from '../ui/Button';

export default function OraclePanel() {
  const { addLog } = useGame();

  const oracleCategories = [
    {
      title: 'Space Mishaps',
      tableId: 'spaceMishaps',
    },
    {
      title: 'NPC Names',
      tableId: 'npcNames',
    },
    {
      title: 'Locations',
      tableId: 'locations',
    },
    {
      title: 'Complications',
      tableId: 'complications',
    },
  ];

  const handleOracleRoll = (title, tableId) => {
    const result = rollTable(tableId);
    addLog(`${title}: ${result}`, 'roll');
  };

  const handleAffirmationRoll = () => {
    const result = rollAffirmation();
    addLog(`Oracle says: ${result}`, 'roll');
  };

  const handleMissionGeneration = () => {
    const mission = generateMission();
    addLog(
      `Mission Generated: ${mission.type} a ${mission.target} at ${mission.location}`,
      'mission'
    );
  };

  return (
    <div className="space-y-2">
      {/* Affirmation Oracle */}
      <Accordion title="Yes/No Oracle" defaultOpen={false}>
        <Button
          onClick={handleAffirmationRoll}
          variant="primary"
          className="w-full"
        >
          Ask the Oracle
        </Button>
      </Accordion>

      {/* Mission Generator */}
      <Accordion title="Mission Generator" defaultOpen={false}>
        <Button
          onClick={handleMissionGeneration}
          variant="secondary"
          className="w-full"
        >
          Generate Mission
        </Button>
      </Accordion>

      {/* Oracle Tables */}
      {oracleCategories.map((category) => (
        <Accordion key={category.tableId} title={category.title} defaultOpen={false}>
          <Button
            onClick={() => handleOracleRoll(category.title, category.tableId)}
            variant="ghost"
            className="w-full"
          >
            Roll on Table
          </Button>
        </Accordion>
      ))}

      <div className="mt-4 p-3 bg-bg-secondary border-2 border-accent-yellow text-xs text-gray-400 font-orbitron">
        <p className="mb-1">
          <strong className="text-accent-yellow">Note:</strong> Oracle tables contain
          sample data.
        </p>
        <p>
          Populate <code className="text-accent-cyan">src/data/oracles.js</code> with
          content from Star Borg PDFs.
        </p>
      </div>
    </div>
  );
}

