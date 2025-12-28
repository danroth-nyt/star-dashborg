import { rollAffirmation, rollEventOracle, rollSceneShakeup } from '../../data/oracles';
import { useGame } from '../../context/GameContext';

export default function OracleQuickBar({ setOracleResult }) {
  const { addLog, gameState } = useGame();

  const handleAskOracle = () => {
    const oracleResult = rollAffirmation();
    if (setOracleResult) {
      setOracleResult(oracleResult);
    }
    addLog(`Oracle (${oracleResult.roll}): ${oracleResult.result} - ${oracleResult.detail}`, 'roll');
  };

  const handleSceneShakeup = () => {
    const threatDie = gameState.threatDie || 1;
    const shakeupResult = rollSceneShakeup(threatDie);
    const result = {
      roll: shakeupResult.roll,
      result: 'Scene Shakeup',
      detail: shakeupResult.result
    };
    if (setOracleResult) {
      setOracleResult(result);
    }
    addLog(`Scene Shakeup (${shakeupResult.roll}): ${shakeupResult.result}`, 'roll');
  };

  const handleEvent = () => {
    const event = rollEventOracle();
    if (setOracleResult) {
      setOracleResult(event);
    }
    addLog(`Event (${event.roll}): ${event.verb} ${event.subject}`, 'roll');
  };

  return (
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
  );
}

