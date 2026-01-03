import { useState } from 'react';
import Button from '../../ui/Button';
import OracleResultDisplay from '../OracleResultDisplay';
import { generateMission, generateQuickMission, generateVillain, rollOnTable, generateIncitingIncident } from '../../../data/oracles';
import { missionGenerators } from '../../../data/oracles';
import { useGame } from '../../../context/GameContext';
import { useOracleHistoryContext } from '../../../context/OracleHistoryContext';

export default function MissionGenerator() {
  const { addLog, gameState } = useGame();
  const history = useOracleHistoryContext();
  const [missionType, setMissionType] = useState('detailed'); // 'detailed', 'quick', 'villain', 'scenario', or 'inciting'

  const handleGenerateMission = () => {
    const mission = generateMission();
    if (history) history.addResult(mission);
    addLog(`Mission: ${mission.type} ${mission.goods} at ${mission.spot} for ${mission.reward}`, 'mission');
  };

  const handleGenerateQuickMission = () => {
    const mission = generateQuickMission();
    if (history) history.addResult(mission);
    addLog(`Quick Mission: ${mission.action} ${mission.target}`, 'mission');
  };

  const handleGenerateVillain = () => {
    const villain = generateVillain();
    if (history) history.addResult(villain);
    addLog(`Villain: ${villain.villain} wants to ${villain.goal} via ${villain.plan} using ${villain.means}`, 'mission');
  };

  const handleGenerateScenario = () => {
    const scenario = rollOnTable(missionGenerators.scenarios);
    const result = { 
      result: scenario.title, 
      detail: scenario.desc 
    };
    if (history) history.addResult(result);
    addLog(`Scenario: ${scenario.title}`, 'mission');
  };

  const handleGenerateIncitingIncident = () => {
    const incident = generateIncitingIncident(gameState.includePVOracles, gameState.includeStarforgedOracles);
    if (!incident) {
      // Both sources disabled
      const result = { result: 'No inciting incident sources enabled. Enable Perilous Void or Starforged in Settings (gear icon in the header).' };
      if (history) history.addResult(result);
      return;
    }
    if (history) history.addResult(incident);
    addLog(`Inciting Incident [${incident.diceType} ${incident.roll}]: ${incident.incident}`, 'mission');
  };

  // Show Inciting tab if either PV or Starforged is enabled
  const showIncitingTab = gameState.includePVOracles || gameState.includeStarforgedOracles;

  return (
    <div className="space-y-4">
      {/* Mission Type Selector */}
      <div className={`grid gap-1 sm:gap-2 ${showIncitingTab ? 'grid-cols-5' : 'grid-cols-4'}`}>
        <button
          onClick={() => setMissionType('detailed')}
          className={`px-1 sm:px-2 py-1 text-[10px] sm:text-xs font-orbitron uppercase border-2 transition-colors leading-tight ${
            missionType === 'detailed'
              ? 'bg-accent-cyan text-bg-primary border-accent-cyan'
              : 'bg-transparent text-accent-cyan border-accent-cyan hover:bg-accent-cyan hover:text-bg-primary'
          }`}
        >
          Detailed
        </button>
        <button
          onClick={() => setMissionType('quick')}
          className={`px-1 sm:px-2 py-1 text-[10px] sm:text-xs font-orbitron uppercase border-2 transition-colors leading-tight ${
            missionType === 'quick'
              ? 'bg-accent-cyan text-bg-primary border-accent-cyan'
              : 'bg-transparent text-accent-cyan border-accent-cyan hover:bg-accent-cyan hover:text-bg-primary'
          }`}
        >
          Quick
        </button>
        <button
          onClick={() => setMissionType('villain')}
          className={`px-1 sm:px-2 py-1 text-[10px] sm:text-xs font-orbitron uppercase border-2 transition-colors leading-tight ${
            missionType === 'villain'
              ? 'bg-accent-red text-bg-primary border-accent-red'
              : 'bg-transparent text-accent-red border-accent-red hover:bg-accent-red hover:text-bg-primary'
          }`}
        >
          Villain
        </button>
        {showIncitingTab && (
          <button
            onClick={() => setMissionType('inciting')}
            className={`px-1 sm:px-2 py-1 text-[10px] sm:text-xs font-orbitron uppercase border-2 transition-colors leading-tight ${
              missionType === 'inciting'
                ? 'bg-accent-yellow text-bg-primary border-accent-yellow'
                : 'bg-transparent text-accent-yellow border-accent-yellow hover:bg-accent-yellow hover:text-bg-primary'
            }`}
          >
            Inciting
          </button>
        )}
        <button
          onClick={() => setMissionType('scenario')}
          className={`px-1 sm:px-2 py-1 text-[10px] sm:text-xs font-orbitron uppercase border-2 transition-colors leading-tight ${
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
      
      {missionType === 'inciting' && (
        <Button onClick={handleGenerateIncitingIncident} variant="secondary" className="w-full">
          Generate Inciting Incident
        </Button>
      )}
      
      {missionType === 'scenario' && (
        <Button onClick={handleGenerateScenario} variant="secondary" className="w-full">
          Generate Campaign Scenario
        </Button>
      )}

      {/* Result Display */}
      {history && history.currentResult && (
        <OracleResultDisplay 
          result={history.currentResult}
          variant={missionType === 'villain' ? 'red' : (missionType === 'scenario' || missionType === 'inciting') ? 'yellow' : 'cyan'}
          currentIndex={history.currentIndex}
          totalResults={history.totalResults}
          onNavigate={history.navigateTo}
        />
      )}
    </div>
  );
}

