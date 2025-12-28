import { useState } from 'react';
import Button from '../../ui/Button';
import OracleResultDisplay from '../OracleResultDisplay';
import { generateMission, generateQuickMission, generateVillain, rollOnTable } from '../../../data/oracles';
import { missionGenerators } from '../../../data/oracles';
import { useGame } from '../../../context/GameContext';

export default function MissionGenerator() {
  const { addLog } = useGame();
  const [result, setResult] = useState(null);
  const [missionType, setMissionType] = useState('detailed'); // 'detailed', 'quick', or 'villain'

  const handleGenerateMission = () => {
    const mission = generateMission();
    setResult(mission);
    addLog(`Mission: ${mission.type} ${mission.goods} at ${mission.spot} for ${mission.reward}`, 'mission');
  };

  const handleGenerateQuickMission = () => {
    const mission = generateQuickMission();
    setResult(mission);
    addLog(`Quick Mission: ${mission.action} ${mission.target}`, 'mission');
  };

  const handleGenerateVillain = () => {
    const villain = generateVillain();
    setResult(villain);
    addLog(`Villain: ${villain.villain} wants to ${villain.goal} via ${villain.plan} using ${villain.means}`, 'mission');
  };

  const handleGenerateScenario = () => {
    const scenario = rollOnTable(missionGenerators.scenarios);
    setResult({ 
      result: scenario.title, 
      detail: scenario.desc 
    });
    addLog(`Scenario: ${scenario.title}`, 'mission');
  };

  return (
    <div className="space-y-4">
      {/* Mission Type Selector */}
      <div className="grid grid-cols-4 gap-2">
        <button
          onClick={() => setMissionType('detailed')}
          className={`px-2 py-1 text-xs font-orbitron uppercase border-2 transition-colors ${
            missionType === 'detailed'
              ? 'bg-accent-cyan text-bg-primary border-accent-cyan'
              : 'bg-transparent text-accent-cyan border-accent-cyan hover:bg-accent-cyan hover:text-bg-primary'
          }`}
        >
          Detailed
        </button>
        <button
          onClick={() => setMissionType('quick')}
          className={`px-2 py-1 text-xs font-orbitron uppercase border-2 transition-colors ${
            missionType === 'quick'
              ? 'bg-accent-cyan text-bg-primary border-accent-cyan'
              : 'bg-transparent text-accent-cyan border-accent-cyan hover:bg-accent-cyan hover:text-bg-primary'
          }`}
        >
          Quick
        </button>
        <button
          onClick={() => setMissionType('villain')}
          className={`px-2 py-1 text-xs font-orbitron uppercase border-2 transition-colors ${
            missionType === 'villain'
              ? 'bg-accent-red text-bg-primary border-accent-red'
              : 'bg-transparent text-accent-red border-accent-red hover:bg-accent-red hover:text-bg-primary'
          }`}
        >
          Villain
        </button>
        <button
          onClick={() => setMissionType('scenario')}
          className={`px-2 py-1 text-xs font-orbitron uppercase border-2 transition-colors ${
            missionType === 'scenario'
              ? 'bg-accent-yellow text-bg-primary border-accent-yellow'
              : 'bg-transparent text-accent-yellow border-accent-yellow hover:bg-accent-yellow hover:text-bg-primary'
          }`}
        >
          Scenario
        </button>
      </div>

      {/* Generate Button */}
      {missionType === 'detailed' && (
        <Button onClick={handleGenerateMission} variant="primary" className="w-full">
          Generate Detailed Mission
        </Button>
      )}
      
      {missionType === 'quick' && (
        <Button onClick={handleGenerateQuickMission} variant="primary" className="w-full">
          Generate Quick Mission
        </Button>
      )}
      
      {missionType === 'villain' && (
        <Button onClick={handleGenerateVillain} variant="danger" className="w-full">
          Generate Villain Plot
        </Button>
      )}
      
      {missionType === 'scenario' && (
        <Button onClick={handleGenerateScenario} variant="secondary" className="w-full">
          Generate Campaign Scenario
        </Button>
      )}

      {/* Result Display */}
      {result && (
        <OracleResultDisplay 
          result={result}
          variant={missionType === 'villain' ? 'red' : missionType === 'scenario' ? 'yellow' : 'cyan'}
        />
      )}
    </div>
  );
}

