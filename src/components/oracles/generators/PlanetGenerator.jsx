import { useState } from 'react';
import Button from '../../ui/Button';
import { generatePlanet, generateSettlement, rollOnTable } from '../../../data/oracles';
import { worldOracles } from '../../../data/oracles';
import { useGame } from '../../../context/GameContext';
import { useOracleHistoryContext } from '../../../context/OracleHistoryContext';

export default function PlanetGenerator() {
  const { addLog, gameState } = useGame();
  const history = useOracleHistoryContext();
  const [generatorType, setGeneratorType] = useState('planet'); // 'planet', 'settlement'

  const handleGeneratePlanet = () => {
    const planet = generatePlanet();
    if (history) history.addResult(planet);
    addLog(`Planet: ${planet.name} - ${planet.terrain}, ${planet.weather}`, 'mission');
  };

  const handleGenerateSettlement = () => {
    const settlement = generateSettlement(gameState.includePVOracles);
    if (history) history.addResult(settlement);
    addLog(`Settlement: ${settlement.name} (Leader: ${settlement.leader}) - ${settlement.knownFor}`, 'mission');
  };

  const handleGeneratePlanetFeature = () => {
    const feature = rollOnTable(worldOracles.planetFeatures);
    const result = { result: 'Planet Feature', detail: feature };
    if (history) history.addResult(result);
    addLog(`Planet Feature: ${feature}`, 'mission');
  };

  const handleGenerateBackwater = () => {
    const backwater = rollOnTable(worldOracles.backwaters);
    const result = { result: 'Backwater Location', detail: backwater };
    if (history) history.addResult(result);
    addLog(`Backwater: ${backwater}`, 'mission');
  };

  const handleGenerateBackalley = () => {
    const backalley = rollOnTable(worldOracles.backalleys);
    const result = { result: 'Back Alley Detail', detail: backalley };
    if (history) history.addResult(result);
    addLog(`Back Alley: ${backalley}`, 'mission');
  };

  const handleGenerateHiddenFeature = () => {
    const feature = rollOnTable(worldOracles.hiddenFeatures);
    const result = { result: 'Hidden Feature', detail: feature };
    if (history) history.addResult(result);
    addLog(`Hidden Feature: ${feature}`, 'mission');
  };

  const handleGenerateLocationDanger = () => {
    const danger = rollOnTable(worldOracles.locationDangers);
    const result = { result: 'Location Danger', detail: danger };
    if (history) history.addResult(result);
    addLog(`Danger: ${danger}`, 'mission');
  };

  return (
    <div className="space-y-4">
      {/* Generator Type Selector */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => setGeneratorType('planet')}
          className={`px-1 sm:px-2 py-1 text-[10px] sm:text-xs font-orbitron uppercase border-2 transition-colors leading-tight ${
            generatorType === 'planet'
              ? 'bg-accent-cyan text-bg-primary border-accent-cyan'
              : 'bg-transparent text-accent-cyan border-accent-cyan hover:bg-accent-cyan hover:text-bg-primary'
          }`}
        >
          Planet
        </button>
        <button
          onClick={() => setGeneratorType('settlement')}
          className={`px-1 sm:px-2 py-1 text-[10px] sm:text-xs font-orbitron uppercase border-2 transition-colors leading-tight ${
            generatorType === 'settlement'
              ? 'bg-accent-cyan text-bg-primary border-accent-cyan'
              : 'bg-transparent text-accent-cyan border-accent-cyan hover:bg-accent-cyan hover:text-bg-primary'
          }`}
        >
          Settlement
        </button>
      </div>

      {/* Main Generate Button */}
      {generatorType === 'planet' && (
        <Button onClick={handleGeneratePlanet} variant="primary" className="w-full">
          Generate Planet
        </Button>
      )}
      
      {generatorType === 'settlement' && (
        <Button onClick={handleGenerateSettlement} variant="primary" className="w-full">
          Generate Settlement
        </Button>
      )}

      {/* Quick Details */}
      <div className="grid grid-cols-2 gap-2">
        <Button onClick={handleGeneratePlanetFeature} variant="ghost" className="text-[10px] sm:text-xs py-2 px-2 leading-tight">
          Planet Feature
        </Button>
        <Button onClick={handleGenerateBackwater} variant="ghost" className="text-[10px] sm:text-xs py-2 px-2 leading-tight">
          Backwater
        </Button>
        <Button onClick={handleGenerateBackalley} variant="ghost" className="text-[10px] sm:text-xs py-2 px-2 leading-tight">
          Back Alley
        </Button>
        <Button onClick={handleGenerateHiddenFeature} variant="secondary" className="text-[10px] sm:text-xs py-2 px-2 leading-tight whitespace-nowrap overflow-hidden text-ellipsis">
          Hidden Feature
        </Button>
        <Button onClick={handleGenerateLocationDanger} variant="danger" className="text-[10px] sm:text-xs py-2 px-2 col-span-2 leading-tight">
          Location Danger
        </Button>
      </div>

    </div>
  );
}

