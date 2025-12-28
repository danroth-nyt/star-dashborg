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
    <div className="h-full flex flex-col">
      <textarea
        value={localJournal}
        onChange={(e) => setLocalJournal(e.target.value)}
        placeholder="Take notes about your mission here... Changes sync automatically."
        className="w-full h-full px-3 py-2 bg-bg-primary border-2 border-accent-yellow text-text-primary focus:outline-none focus:border-accent-cyan font-mono text-sm resize-none"
      />
      <div className="text-xs text-gray-500 mt-2 font-orbitron">
        {localJournal !== gameState.journal ? (
          <span className="text-accent-yellow">● Saving...</span>
        ) : (
          <span className="text-accent-cyan">● Synced</span>
        )}
      </div>
    </div>
  );
}

