import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { Plus, Trash2, Minus, PlusCircle } from 'lucide-react';
import Button from '../ui/Button';

export default function DangerClock() {
  const { gameState, updateGameState, addLog } = useGame();
  const [newClockTitle, setNewClockTitle] = useState('');
  const [newClockSegments, setNewClockSegments] = useState(6);

  const addClock = () => {
    if (!newClockTitle.trim()) return;

    const newClock = {
      id: Date.now().toString(),
      title: newClockTitle,
      segments: newClockSegments,
      filled: 0,
    };

    updateGameState({
      dangerClocks: [...gameState.dangerClocks, newClock],
    });

    addLog(`New danger clock added: ${newClockTitle}`, 'danger');
    setNewClockTitle('');
  };

  const updateClock = (clockId, filled) => {
    const updatedClocks = gameState.dangerClocks.map((clock) =>
      clock.id === clockId ? { ...clock, filled } : clock
    );

    updateGameState({ dangerClocks: updatedClocks });

    const clock = gameState.dangerClocks.find((c) => c.id === clockId);
    if (filled === clock.segments) {
      addLog(`DANGER! Clock filled: ${clock.title}`, 'danger');
    }
  };

  const deleteClock = (clockId) => {
    const clock = gameState.dangerClocks.find((c) => c.id === clockId);
    updateGameState({
      dangerClocks: gameState.dangerClocks.filter((c) => c.id !== clockId),
    });
    addLog(`Danger clock removed: ${clock.title}`, 'info');
  };

  return (
    <div className="space-y-4">
      {/* Add Clock Form */}
      <div className="space-y-2">
        <input
          type="text"
          placeholder="Danger Clock Title"
          value={newClockTitle}
          onChange={(e) => setNewClockTitle(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addClock()}
          className="w-full px-3 py-2 bg-bg-primary border-2 border-accent-red text-text-primary focus:outline-none focus:border-accent-yellow font-orbitron"
        />
        <div className="flex gap-2">
          <select
            value={newClockSegments}
            onChange={(e) => setNewClockSegments(Number(e.target.value))}
            className="flex-1 px-3 py-2 bg-bg-primary border-2 border-accent-red text-text-primary focus:outline-none focus:border-accent-yellow font-orbitron"
          >
            <option value={4}>4 Segments</option>
            <option value={6}>6 Segments</option>
            <option value={8}>8 Segments</option>
          </select>
          <Button onClick={addClock} variant="danger" className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add
          </Button>
        </div>
      </div>

      {/* Clock List */}
      <div className="space-y-3">
        {gameState.dangerClocks.length === 0 ? (
          <p className="text-gray-500 text-center italic">No danger clocks</p>
        ) : (
          gameState.dangerClocks.map((clock) => (
            <div key={clock.id} className="bg-bg-primary p-3 border-2 border-accent-red">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-orbitron font-bold text-accent-red">
                  {clock.title}
                </h4>
                <button
                  onClick={() => deleteClock(clock.id)}
                  className="text-accent-red hover:text-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              
              {/* Clock visualization */}
              <div className="relative w-24 h-24 mx-auto my-3">
                <svg viewBox="0 0 100 100" className="transform -rotate-90">
                  {/* Background circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#1a1a1a"
                    strokeWidth="10"
                  />
                  {/* Filled segments */}
                  {Array.from({ length: clock.segments }).map((_, i) => {
                    const segmentAngle = 360 / clock.segments;
                    const startAngle = i * segmentAngle;
                    const isFilled = i < clock.filled;

                    return (
                      <path
                        key={i}
                        d={describeArc(50, 50, 45, startAngle, startAngle + segmentAngle - 2)}
                        fill="none"
                        stroke={isFilled ? '#ff003c' : '#333'}
                        strokeWidth="10"
                        className="cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => updateClock(clock.id, i + 1)}
                      />
                    );
                  })}
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-orbitron font-bold text-accent-red text-xl">
                    {clock.filled}/{clock.segments}
                  </span>
                </div>
              </div>
              
              {/* Control buttons */}
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => clock.filled > 0 && updateClock(clock.id, clock.filled - 1)}
                  disabled={clock.filled === 0}
                  className="px-3 py-1 bg-bg-primary border-2 border-accent-red text-accent-red hover:bg-accent-red hover:text-bg-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all font-orbitron text-sm flex items-center gap-1"
                >
                  <Minus className="w-3 h-3" />
                  -1
                </button>
                <button
                  onClick={() => clock.filled < clock.segments && updateClock(clock.id, clock.filled + 1)}
                  disabled={clock.filled === clock.segments}
                  className="px-3 py-1 bg-bg-primary border-2 border-accent-red text-accent-red hover:bg-accent-red hover:text-bg-primary disabled:opacity-30 disabled:cursor-not-allowed transition-all font-orbitron text-sm flex items-center gap-1"
                >
                  <PlusCircle className="w-3 h-3" />
                  +1
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// Helper function to draw arc segments
function describeArc(x, y, radius, startAngle, endAngle) {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

  return [
    'M', start.x, start.y,
    'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y
  ].join(' ');
}

function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
  const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
}

