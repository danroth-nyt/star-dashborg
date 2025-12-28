import { useState } from 'react';
import { rollAffirmation, rollEventOracle, rollSceneShakeup, rollDice } from '../../data/oracles';
import { useGame } from '../../context/GameContext';
import OracleResultDisplay from './OracleResultDisplay';

export default function OracleQuickBar() {
  const { addLog, gameState } = useGame();
  const [result, setResult] = useState(null);

  const handleAskOracle = () => {
    const oracleResult = rollAffirmation();
    setResult(oracleResult);
    addLog(`Oracle (${oracleResult.roll}): ${oracleResult.result} - ${oracleResult.detail}`, 'roll');
  };

  const handleSceneShakeup = () => {
    const threatDie = gameState.threatDie || 1;
    const shakeupResult = rollSceneShakeup(threatDie);
    setResult({
      roll: shakeupResult.roll,
      result: 'Scene Shakeup',
      detail: shakeupResult.result
    });
    addLog(`Scene Shakeup (${shakeupResult.roll}): ${shakeupResult.result}`, 'roll');
  };

  const handleEvent = () => {
    const event = rollEventOracle();
    setResult(event);
    addLog(`Event (${event.roll}): ${event.verb} ${event.subject}`, 'roll');
  };

  const handleQuickDice = (sides) => {
    const roll = rollDice(sides);
    setResult({
      roll: roll,
      result: `D${sides}`,
      detail: `Rolled ${roll}`
    });
    addLog(`D${sides}: ${roll}`, 'roll');
  };

  return (
    <div className="space-y-3">
      {/* Main Quick Actions */}
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={handleAskOracle}
          className="px-3 py-2 bg-accent-cyan text-bg-primary border-2 border-accent-cyan hover:bg-transparent hover:text-accent-cyan transition-all font-orbitron font-bold uppercase text-xs glow-cyan"
        >
          Ask Oracle
        </button>
        <button
          onClick={handleSceneShakeup}
          className="px-3 py-2 bg-accent-yellow text-bg-primary border-2 border-accent-yellow hover:bg-transparent hover:text-accent-yellow transition-all font-orbitron font-bold uppercase text-xs glow-yellow"
        >
          Shakeup
        </button>
        <button
          onClick={handleEvent}
          className="px-3 py-2 bg-accent-red text-bg-primary border-2 border-accent-red hover:bg-transparent hover:text-accent-red transition-all font-orbitron font-bold uppercase text-xs glow-red"
        >
          Event
        </button>
      </div>

      {/* Quick Dice */}
      <div className="grid grid-cols-6 gap-1">
        {[4, 6, 8, 10, 12, 20].map((sides) => (
          <button
            key={sides}
            onClick={() => handleQuickDice(sides)}
            className="aspect-square bg-bg-primary border-2 border-accent-cyan hover:bg-accent-cyan hover:text-bg-primary transition-all font-orbitron font-bold text-xs flex items-center justify-center"
          >
            D{sides}
          </button>
        ))}
      </div>

      {/* Result Display */}
      {result && (
        <OracleResultDisplay 
          result={result}
          variant={result.result === 'Scene Shakeup' ? 'yellow' : result.verb ? 'red' : 'cyan'}
        />
      )}
    </div>
  );
}

