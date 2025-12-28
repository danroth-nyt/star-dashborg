import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { rollDice } from '../../data/oracles';
import Dice from './Dice';
import RollResult from './RollResult';

export default function DiceRoller() {
  const { addLog } = useGame();
  const [rolling, setRolling] = useState(null);
  const [currentResult, setCurrentResult] = useState(null);
  const [recentRolls, setRecentRolls] = useState([]);
  const [rollMode, setRollMode] = useState('normal'); // 'normal', 'advantage', 'disadvantage'

  const diceTypes = [
    { sides: 4, label: 'D4' },
    { sides: 6, label: 'D6' },
    { sides: 8, label: 'D8' },
    { sides: 10, label: 'D10' },
    { sides: 12, label: 'D12' },
    { sides: 20, label: 'D20' },
    { sides: 100, label: 'D100' },
  ];

  const handleRoll = (sides, label) => {
    if (rolling) return;

    setRolling(label);
    
    // Simulate rolling delay
    setTimeout(() => {
      let result, rolls, logMessage;
      
      if (rollMode === 'advantage' || rollMode === 'disadvantage') {
        // Roll twice for advantage/disadvantage
        const roll1 = rollDice(sides);
        const roll2 = rollDice(sides);
        rolls = [roll1, roll2];
        result = rollMode === 'advantage' ? Math.max(roll1, roll2) : Math.min(roll1, roll2);
        
        const modeLabel = rollMode === 'advantage' ? 'ADV' : 'DIS';
        logMessage = `Rolled ${label} (${modeLabel}): [${rolls.join(', ')}] = ${result}`;
      } else {
        // Normal single roll
        result = rollDice(sides);
        logMessage = `Rolled ${label}: ${result}`;
      }
      
      setCurrentResult({ result, diceType: label, sides, rolls, rollMode });
      addLog(logMessage, 'roll');
      
      // Add to recent rolls
      setRecentRolls(prev => [
        { label, result },
        ...prev.slice(0, 4)
      ]);
      
      setRolling(null);
    }, 600);
  };

  const handle2D6Roll = () => {
    if (rolling) return;

    setRolling('2D6');
    
    setTimeout(() => {
      const d6results = [rollDice(6), rollDice(6)];
      const total = d6results.reduce((a, b) => a + b, 0);
      setCurrentResult({ result: total, diceType: '2D6', sides: 12, isMultiple: true });
      addLog(`Rolled 2D6: [${d6results.join(', ')}] = ${total}`, 'roll');
      
      setRecentRolls(prev => [
        { label: '2D6', result: total },
        ...prev.slice(0, 4)
      ]);
      
      setRolling(null);
    }, 600);
  };

  return (
    <div className="space-y-2">
      {/* Result Display Area */}
      {currentResult && (
        <RollResult
          result={currentResult.result}
          diceType={currentResult.diceType}
          sides={currentResult.sides}
          rolls={currentResult.rolls}
          rollMode={currentResult.rollMode}
          onComplete={() => {
            // Keep result visible, just allow new rolls
          }}
        />
      )}

      {/* Roll Mode Toggle */}
      <div className="flex gap-1 justify-center">
        <button
          onClick={() => setRollMode('normal')}
          className={`px-3 py-1 font-orbitron font-bold uppercase text-xs border-2 transition-all ${
            rollMode === 'normal'
              ? 'bg-accent-cyan text-bg-primary border-accent-cyan glow-cyan'
              : 'bg-transparent text-accent-cyan border-accent-cyan hover:bg-accent-cyan/20'
          }`}
        >
          Normal
        </button>
        <button
          onClick={() => setRollMode('advantage')}
          className={`px-3 py-1 font-orbitron font-bold uppercase text-xs border-2 transition-all ${
            rollMode === 'advantage'
              ? 'bg-accent-yellow text-bg-primary border-accent-yellow glow-yellow'
              : 'bg-transparent text-accent-yellow border-accent-yellow hover:bg-accent-yellow/20'
          }`}
        >
          Advantage
        </button>
        <button
          onClick={() => setRollMode('disadvantage')}
          className={`px-3 py-1 font-orbitron font-bold uppercase text-xs border-2 transition-all ${
            rollMode === 'disadvantage'
              ? 'bg-accent-red text-bg-primary border-accent-red glow-red'
              : 'bg-transparent text-accent-red border-accent-red hover:bg-accent-red/20'
          }`}
        >
          Disadvantage
        </button>
      </div>

      {/* Dice Grid */}
      <div className="grid grid-cols-4 gap-2 max-w-lg mx-auto">
        {diceTypes.map(({ sides, label }) => (
          <Dice
            key={sides}
            sides={sides}
            label={label}
            variant="cyan"
            isRolling={rolling === label}
            onClick={() => handleRoll(sides, label)}
          />
        ))}
        
        {/* 2D6 dice in line with D100 */}
        <Dice
          sides="2d6"
          label="2D6"
          variant="cyan"
          isRolling={rolling === '2D6'}
          onClick={handle2D6Roll}
        />
      </div>

      {/* Recent Rolls */}
      {recentRolls.length > 0 && (
        <div className="pt-2 border-t border-accent-cyan/30">
          <div className="flex items-center justify-between text-xs">
            <span className="text-accent-cyan/70 font-orbitron uppercase text-xs">
              Recent:
            </span>
            <div className="flex gap-1">
              {recentRolls.map((roll, idx) => (
                <span
                  key={idx}
                  className="text-accent-cyan font-mono font-bold text-xs"
                >
                  {roll.label.replace('D', '')}:{roll.result}
                  {idx < recentRolls.length - 1 && (
                    <span className="text-accent-cyan/40 mx-1">•</span>
                  )}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

