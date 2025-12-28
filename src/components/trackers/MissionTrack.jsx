import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { Plus, Trash2, Target } from 'lucide-react';
import Button from '../ui/Button';
import { rollDice } from '../../data/oracles';

export default function MissionTrack() {
  const { gameState, updateGameState, addLog } = useGame();
  const [newMissionTitle, setNewMissionTitle] = useState('');
  const [newMissionLength, setNewMissionLength] = useState(6);
  const [showError, setShowError] = useState(false);

  const addMission = () => {
    if (!newMissionTitle.trim()) {
      setShowError(true);
      setTimeout(() => setShowError(false), 400);
      return;
    }

    const newMission = {
      id: Date.now().toString(),
      title: newMissionTitle,
      length: newMissionLength,
      progress: 0,
    };

    updateGameState({
      missions: [...gameState.missions, newMission],
    });

    addLog(`New mission added: ${newMissionTitle}`, 'mission');
    setNewMissionTitle('');
  };

  const updateProgress = (missionId, progress) => {
    const mission = gameState.missions.find((m) => m.id === missionId);
    const updatedMissions = gameState.missions.map((mission) =>
      mission.id === missionId ? { ...mission, progress } : mission
    );

    updateGameState({ missions: updatedMissions });

    if (progress === mission.length) {
      addLog(`Mission completed: ${mission.title}`, 'success');
    }
  };

  const deleteMission = (missionId) => {
    const mission = gameState.missions.find((m) => m.id === missionId);
    updateGameState({
      missions: gameState.missions.filter((m) => m.id !== missionId),
    });
    addLog(`Mission removed: ${mission.title}`, 'info');
  };

  const attemptCompletion = (missionId) => {
    const mission = gameState.missions.find((m) => m.id === missionId);
    if (!mission) return;

    // Determine DR based on mission length
    const drMap = {
      4: 10,   // Short
      6: 12,   // Average
      8: 14,   // Long
      10: 16   // Galaxy Saving
    };
    const dr = drMap[mission.length] || 12;

    // Roll D20 + current progress
    const d20 = rollDice(20);
    const total = d20 + mission.progress;
    const success = total >= dr;

    if (success) {
      addLog(`Mission completion [${d20}] + [${mission.progress}] = ${total} vs DR${dr} ✓ SUCCESS! "${mission.title}" completed!`, 'success');
      // Remove mission on success
      updateGameState({
        missions: gameState.missions.filter((m) => m.id !== missionId),
      });
    } else {
      addLog(`Mission completion [${d20}] + [${mission.progress}] = ${total} vs DR${dr} ✗ FAIL. Remove 1 progress, increase Threat Die.`, 'danger');
      // Remove 1 progress on fail
      const updatedMissions = gameState.missions.map((m) =>
        m.id === missionId ? { ...m, progress: Math.max(0, m.progress - 1) } : m
      );
      updateGameState({ missions: updatedMissions });
    }
  };

  return (
    <div className="space-y-4">
      {/* Add Mission Form */}
      <div className="space-y-2">
        <input
          type="text"
          placeholder="Enter mission objective..."
          value={newMissionTitle}
          onChange={(e) => setNewMissionTitle(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addMission()}
          className={`w-full px-3 py-2 bg-bg-primary border-2 border-accent-cyan text-text-primary focus:outline-none focus:border-accent-yellow focus:shadow-[0_0_15px_rgba(255,252,0,0.4)] transition-all duration-300 font-orbitron ${
            showError ? 'input-shake border-accent-red' : ''
          }`}
        />
        <div className="flex gap-2">
          <select
            value={newMissionLength}
            onChange={(e) => setNewMissionLength(Number(e.target.value))}
            className="flex-1 px-3 py-2 bg-bg-primary border-2 border-accent-cyan text-text-primary focus:outline-none focus:border-accent-yellow focus:shadow-[0_0_15px_rgba(255,252,0,0.4)] transition-all duration-300 font-orbitron [&>option]:bg-bg-secondary [&>option]:text-text-primary"
          >
            <option value={4} className="bg-bg-secondary text-text-primary">Short / Easy (DR10)</option>
            <option value={6} className="bg-bg-secondary text-text-primary">Average / Normal (DR12)</option>
            <option value={8} className="bg-bg-secondary text-text-primary">Long / Difficult (DR14)</option>
            <option value={10} className="bg-bg-secondary text-text-primary">Galaxy Saving (DR16)</option>
          </select>
          <Button onClick={addMission} variant="primary" className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add
          </Button>
        </div>
      </div>

      {/* Mission List */}
      <div className="space-y-3">
        {gameState.missions.length === 0 ? (
          <div className="text-center py-8 space-y-2">
            <div className="text-accent-cyan/30 text-4xl mb-2">★</div>
            <p className="text-gray-500 font-orbitron text-sm">NO ACTIVE MISSIONS</p>
            <p className="text-gray-600 text-xs">Add a mission to track your progress</p>
          </div>
        ) : (
          gameState.missions.map((mission) => (
            <div key={mission.id} className="bg-bg-primary p-3 border-2 border-accent-cyan">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-orbitron font-bold text-accent-cyan">
                  {mission.title}
                </h4>
                <button
                  onClick={() => deleteMission(mission.id)}
                  className="text-accent-red hover:text-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="flex gap-1">
                {Array.from({ length: mission.length }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => updateProgress(mission.id, i + 1)}
                    className={`flex-1 h-6 border-2 transition-all duration-200 ${
                      i < mission.progress
                        ? 'bg-accent-cyan border-accent-cyan segment-fill'
                        : 'bg-transparent border-accent-cyan hover:bg-accent-cyan hover:bg-opacity-30 hover:scale-105'
                    } ${i === mission.progress - 1 ? 'ripple' : ''} ${
                      mission.progress === mission.length && i === mission.length - 1 ? 'completion-bounce' : ''
                    }`}
                  />
                ))}
              </div>
              
              {/* Progress Test Button */}
              <div className="mt-2 flex items-center justify-between text-xs">
                <span className="text-gray-400 font-orbitron">
                  Progress: {mission.progress} | DR{mission.length === 4 ? '10' : mission.length === 6 ? '12' : mission.length === 8 ? '14' : '16'}
                </span>
                <button
                  onClick={() => attemptCompletion(mission.id)}
                  className="px-2 py-1 bg-transparent border-2 border-accent-yellow text-accent-yellow hover:bg-accent-yellow hover:text-bg-primary transition-all font-orbitron font-bold uppercase text-xs flex items-center gap-1"
                >
                  <Target className="w-3 h-3" />
                  Attempt
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

