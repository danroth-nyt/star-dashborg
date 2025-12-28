import { useState } from 'react';
import Button from '../../ui/Button';
import OracleResultDisplay from '../OracleResultDisplay';
import { generatePlanet, generateSettlement, generateScene, rollOnTable } from '../../../data/oracles';
import { worldOracles } from '../../../data/oracles';
import { useGame } from '../../../context/GameContext';

export default function PlanetGenerator() {
  const { addLog } = useGame();
  const [result, setResult] = useState(null);
  const [generatorType, setGeneratorType] = useState('planet'); // 'planet', 'settlement', 'scene'

  const handleGeneratePlanet = () => {
    const planet = generatePlanet();
    setResult(planet);
    addLog(`Planet: ${planet.name} - ${planet.terrain}, ${planet.weather}`, 'mission');
  };

  const handleGenerateSettlement = () => {
    const settlement = generateSettlement();
    setResult(settlement);
    addLog(`Settlement: ${settlement.name} - ${settlement.knownFor}`, 'mission');
  };

  const handleGenerateScene = () => {
    const scene = generateScene();
    setResult({
      location: scene.location,
      tone: scene.tone,
      obstacle: scene.obstacle
    });
    addLog(`Scene: ${scene.location} - ${scene.tone} - ${scene.obstacle}`, 'mission');
  };

  const handleGeneratePlanetFeature = () => {
    const feature = rollOnTable(worldOracles.planetFeatures);
    setResult({ result: 'Planet Feature', detail: feature });
    addLog(`Planet Feature: ${feature}`, 'mission');
  };

  const handleGenerateBackwater = () => {
    const backwater = rollOnTable(worldOracles.backwaters);
    setResult({ result: 'Backwater Location', detail: backwater });
    addLog(`Backwater: ${backwater}`, 'mission');
  };

  const handleGenerateBackalley = () => {
    const backalley = rollOnTable(worldOracles.backalleys);
    setResult({ result: 'Back Alley Detail', detail: backalley });
    addLog(`Back Alley: ${backalley}`, 'mission');
  };

  const handleGenerateHiddenFeature = () => {
    const feature = rollOnTable(worldOracles.hiddenFeatures);
    setResult({ result: 'Hidden Feature', detail: feature });
    addLog(`Hidden Feature: ${feature}`, 'mission');
  };

  const handleGenerateLocationDanger = () => {
    const danger = rollOnTable(worldOracles.locationDangers);
    setResult({ result: 'Location Danger', detail: danger });
    addLog(`Danger: ${danger}`, 'mission');
  };

  return (
    <div className="space-y-4">
      {/* Generator Type Selector */}
      <div className="grid grid-cols-3 gap-2">
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
        <button
          onClick={() => setGeneratorType('scene')}
          className={`px-1 sm:px-2 py-1 text-[10px] sm:text-xs font-orbitron uppercase border-2 transition-colors leading-tight ${
            generatorType === 'scene'
              ? 'bg-accent-cyan text-bg-primary border-accent-cyan'
              : 'bg-transparent text-accent-cyan border-accent-cyan hover:bg-accent-cyan hover:text-bg-primary'
          }`}
        >
          Scene
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
      
      {generatorType === 'scene' && (
        <Button onClick={handleGenerateScene} variant="primary" className="w-full">
          Generate Scene
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

      {/* Result Display */}
      {result && (
        <OracleResultDisplay 
          result={result}
          variant="cyan"
        />
      )}
    </div>
  );
}

