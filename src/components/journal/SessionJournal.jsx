import { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { useDebounce } from '../../hooks/useDebounce';

export default function SessionJournal() {
  const { gameState, updateGameState } = useGame();
  const [localJournal, setLocalJournal] = useState(gameState.journal || '');
  const debouncedJournal = useDebounce(localJournal, 2000);

  // Update local state when gameState changes from other users
  useEffect(() => {
    if (gameState.journal !== localJournal && gameState.journal !== debouncedJournal) {
      setLocalJournal(gameState.journal);
    }
  }, [gameState.journal]);

  // Save to Supabase when debounced value changes
  useEffect(() => {
    if (debouncedJournal !== gameState.journal) {
      updateGameState({ journal: debouncedJournal });
    }
  }, [debouncedJournal]);

  return (
    <div className="absolute inset-0 flex flex-col gap-2">
      <textarea
        value={localJournal}
        onChange={(e) => setLocalJournal(e.target.value)}
        placeholder=">> MISSION LOG: Document your journey, decisions, and discoveries..."
        className="flex-1 w-full px-3 py-2 bg-bg-primary border-2 border-accent-yellow text-text-primary focus:outline-none focus:border-accent-cyan focus:shadow-[0_0_15px_rgba(0,240,255,0.4)] transition-all duration-300 font-mono text-sm resize-none min-h-0"
      />
      <div className="text-xs text-gray-500 font-orbitron shrink-0">
        {localJournal !== gameState.journal ? (
          <span className="text-accent-yellow animate-pulse">● Saving...</span>
        ) : (
          <span className="text-accent-cyan">● Synced</span>
        )}
      </div>
    </div>
  );
}

