import { useState } from 'react';
import { rollAffirmation, rollEventOracle, rollSceneShakeup } from '../../data/oracles';
import { useGame } from '../../context/GameContext';

export default function OracleQuickBar({ setOracleResult }) {
  const { addLog, gameState } = useGame();
  const [rollMode, setRollMode] = useState('normal'); // 'normal', 'advantage', 'disadvantage'

  const handleAskOracle = () => {
    let oracleResult, logMessage;

    if (rollMode === 'advantage' || rollMode === 'disadvantage') {
      // Roll twice for advantage/disadvantage
      const roll1 = rollAffirmation();
      const roll2 = rollAffirmation();
      const finalRoll = rollMode === 'advantage' ? 
        (roll1.roll > roll2.roll ? roll1 : roll2) : 
        (roll1.roll < roll2.roll ? roll1 : roll2);
      
      // Add both rolls to the result for display
      oracleResult = {
        ...finalRoll,
        rolls: [roll1.roll, roll2.roll],
        rollMode
      };
      
      const modeLabel = rollMode === 'advantage' ? 'ADV' : 'DIS';
      logMessage = `Oracle (${modeLabel}) [${roll1.roll}, ${roll2.roll}] = ${finalRoll.roll}: ${finalRoll.result} - ${finalRoll.detail}`;
    } else {
      // Normal single roll
      oracleResult = rollAffirmation();
      logMessage = `Oracle (${oracleResult.roll}): ${oracleResult.result} - ${oracleResult.detail}`;
    }

    if (setOracleResult) {
      setOracleResult(oracleResult);
    }
    addLog(logMessage, 'roll');
  };

  const handleSceneShakeup = () => {
    const threatDie = gameState.threatDie || 1;
    const shakeupCheck = rollSceneShakeup(threatDie);
    
    if (shakeupCheck.success) {
      const result = {
        roll: shakeupCheck.total,
        result: 'Scene Shakeup',
        detail: shakeupCheck.shakeup.result,
        checkRoll: shakeupCheck.checkRoll,
        threatDie,
        shakeupD20: shakeupCheck.shakeup.d20,
        shakeupRoll: shakeupCheck.shakeup.roll
      };
      if (setOracleResult) {
        setOracleResult(result);
      }
      addLog(`Scene Shakeup Check [${shakeupCheck.checkRoll}] + [${threatDie}] = ${shakeupCheck.total} ✓ → Shakeup [${shakeupCheck.shakeup.d20}] + [${threatDie}] = ${shakeupCheck.shakeup.roll}: ${shakeupCheck.shakeup.result}`, 'roll');
    } else {
      const result = {
        roll: shakeupCheck.total,
        result: 'No Scene Shakeup',
        detail: `Rolled [${shakeupCheck.checkRoll}] + [${threatDie}] = ${shakeupCheck.total}, need 15+`,
        checkRoll: shakeupCheck.checkRoll,
        threatDie,
        success: false
      };
      if (setOracleResult) {
        setOracleResult(result);
      }
      addLog(`Scene Shakeup Check [${shakeupCheck.checkRoll}] + [${threatDie}] = ${shakeupCheck.total} ✗ No shakeup`, 'roll');
    }
  };

  const handleEvent = () => {
    const event = rollEventOracle();
    if (setOracleResult) {
      setOracleResult(event);
    }
    addLog(`Event (${event.roll}): ${event.verb} ${event.subject} - ${event.specific}`, 'roll');
  };

  return (
    <div className="grid grid-cols-3 gap-2">
      {/* Ask Oracle Column with Mode Toggle */}
      <div className="space-y-1">
        <button
          onClick={handleAskOracle}
          className="w-full px-3 py-2 bg-accent-cyan text-bg-primary border-2 border-accent-cyan hover:bg-transparent hover:text-accent-cyan transition-all font-orbitron font-bold uppercase text-xs"
        >
          Ask Oracle
        </button>
        {/* Oracle Roll Mode Toggle - fits width of Ask Oracle button */}
        <div className="grid grid-cols-3 gap-1">
          <button
            onClick={() => setRollMode('normal')}
            className={`px-1 py-1 font-orbitron font-bold uppercase text-xs border-2 transition-all ${
              rollMode === 'normal'
                ? 'bg-accent-cyan text-bg-primary border-accent-cyan'
                : 'bg-transparent text-accent-cyan border-accent-cyan hover:bg-accent-cyan/20'
            }`}
          >
            Norm
          </button>
          <button
            onClick={() => setRollMode('advantage')}
            className={`px-1 py-1 font-orbitron font-bold uppercase text-xs border-2 transition-all ${
              rollMode === 'advantage'
                ? 'bg-accent-yellow text-bg-primary border-accent-yellow'
                : 'bg-transparent text-accent-yellow border-accent-yellow hover:bg-accent-yellow/20'
            }`}
          >
            Adv
          </button>
          <button
            onClick={() => setRollMode('disadvantage')}
            className={`px-1 py-1 font-orbitron font-bold uppercase text-xs border-2 transition-all ${
              rollMode === 'disadvantage'
                ? 'bg-accent-red text-bg-primary border-accent-red'
                : 'bg-transparent text-accent-red border-accent-red hover:bg-accent-red/20'
            }`}
          >
            Dis
          </button>
        </div>
      </div>

      {/* Shakeup Button */}
      <button
        onClick={handleSceneShakeup}
        className="px-3 py-2 bg-accent-yellow text-bg-primary border-2 border-accent-yellow hover:bg-transparent hover:text-accent-yellow transition-all font-orbitron font-bold uppercase text-xs"
      >
        Shakeup
      </button>

      {/* Event Button */}
      <button
        onClick={handleEvent}
        className="px-3 py-2 bg-accent-red text-bg-primary border-2 border-accent-red hover:bg-transparent hover:text-accent-red transition-all font-orbitron font-bold uppercase text-xs"
      >
        Event
      </button>
    </div>
  );
}

