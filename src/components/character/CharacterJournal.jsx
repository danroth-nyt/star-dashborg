import { useState, useEffect } from 'react';
import { useCharacter } from '../../context/CharacterContext';
import { useDebounce } from '../../hooks/useDebounce';

export default function CharacterJournal() {
  const { character, updateField } = useCharacter();
  const [localJournal, setLocalJournal] = useState(character?.journal || '');
  const debouncedJournal = useDebounce(localJournal, 2000);

  // Update local state when character changes from database
  useEffect(() => {
    if (character?.journal !== localJournal && character?.journal !== debouncedJournal) {
      setLocalJournal(character?.journal || '');
    }
  }, [character?.journal]);

  // Save to Supabase when debounced value changes
  useEffect(() => {
    if (character && debouncedJournal !== character.journal) {
      updateField('journal', debouncedJournal);
    }
  }, [debouncedJournal]);

  if (!character) {
    return null;
  }

  const isSaving = localJournal !== character.journal;

  return (
    <div className="flex flex-col gap-2 min-h-[200px]">
      <textarea
        value={localJournal}
        onChange={(e) => setLocalJournal(e.target.value)}
        placeholder=">> PERSONAL LOG: Track your character's thoughts, goals, relationships, secrets, and discoveries..."
        className="flex-1 w-full px-3 py-2 bg-bg-primary border-2 border-accent-yellow text-text-primary focus:outline-none focus:border-accent-cyan focus:shadow-[0_0_15px_rgba(0,240,255,0.4)] transition-all duration-300 font-mono text-sm resize-y min-h-[180px]"
      />
      <div className="text-xs text-gray-500 font-orbitron">
        {isSaving ? (
          <span className="text-accent-yellow animate-pulse">● Saving...</span>
        ) : (
          <span className="text-accent-cyan">● Synced</span>
        )}
      </div>
    </div>
  );
}
