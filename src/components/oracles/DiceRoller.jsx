import { useGame } from '../../context/GameContext';
import { rollDice } from '../../data/oracles';
import Button from '../ui/Button';

export default function DiceRoller() {
  const { addLog } = useGame();

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
    const result = rollDice(sides);
    addLog(`Rolled ${label}: ${result}`, 'roll');
  };

  return (
    <div className="grid grid-cols-3 gap-2">
      {diceTypes.map(({ sides, label }) => (
        <button
          key={sides}
          onClick={() => handleRoll(sides, label)}
          className="aspect-square bg-bg-primary border-2 border-accent-cyan hover:bg-accent-cyan hover:text-bg-primary transition-all font-orbitron font-bold text-lg"
        >
          {label}
        </button>
      ))}
      <button
        onClick={() => {
          const d6results = [rollDice(6), rollDice(6)];
          const total = d6results.reduce((a, b) => a + b, 0);
          addLog(`Rolled 2D6: [${d6results.join(', ')}] = ${total}`, 'roll');
        }}
        className="col-span-2 bg-bg-primary border-2 border-accent-cyan hover:bg-accent-cyan hover:text-bg-primary transition-all font-orbitron font-bold text-lg py-3"
      >
        2D6
      </button>
    </div>
  );
}

