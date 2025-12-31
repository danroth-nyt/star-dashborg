import { Star, Plus, Minus, Award } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { useParty } from '../../context/PartyContext';
import { getUnclaimedPromotions } from '../../data/progressionData';

export default function GalaxySaveTracker() {
  const { gameState, updateGameState, addLog } = useGame();
  const { partyMembers } = useParty();

  const galaxiesSaved = gameState.ship?.galaxiesSaved || 0;

  // Calculate how many party members have unclaimed promotions
  const membersWithPromotions = partyMembers.filter(member => {
    const unclaimed = getUnclaimedPromotions(member, galaxiesSaved);
    return unclaimed > 0;
  }).length;

  const handleIncrement = () => {
    updateGameState((state) => ({
      ...state,
      ship: {
        ...state.ship,
        galaxiesSaved: (state.ship?.galaxiesSaved || 0) + 1,
      },
    }));
    addLog('Galaxy saved! Characters can now claim promotions.', 'success');
  };

  const handleDecrement = () => {
    const current = galaxiesSaved;
    if (current > 0) {
      updateGameState((state) => ({
        ...state,
        ship: {
          ...state.ship,
          galaxiesSaved: Math.max(0, (state.ship?.galaxiesSaved || 0) - 1),
        },
      }));
      addLog('Galaxy save count decreased.', 'info');
    }
  };

  return (
    <div className="bg-bg-secondary border-2 border-accent-yellow p-2">
      {/* Header & Counter in one row */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5">
          <Star className="w-4 h-4 text-accent-yellow" />
          <h3 className="font-orbitron font-bold text-accent-yellow uppercase text-xs">
            Galaxies Saved
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDecrement}
            disabled={galaxiesSaved === 0}
            className="p-1 bg-accent-red/20 border border-accent-red text-accent-red hover:bg-accent-red hover:text-bg-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-accent-red/20 disabled:hover:text-accent-red"
            title="Decrease"
          >
            <Minus className="w-3 h-3" />
          </button>

          <div className="text-2xl font-orbitron font-bold text-accent-yellow text-glow-yellow min-w-[2rem] text-center">
            {galaxiesSaved}
          </div>

          <button
            onClick={handleIncrement}
            className="p-1 bg-accent-cyan/20 border border-accent-cyan text-accent-cyan hover:bg-accent-cyan hover:text-bg-primary transition-all"
            title="Increase"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Promotion Alert - Compact */}
      {membersWithPromotions > 0 && (
        <div className="bg-purple-900/30 border border-purple-500 rounded px-2 py-1 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Award className="w-3 h-3 text-purple-400 animate-pulse" />
            <span className="text-xs text-purple-300 font-orbitron font-bold">
              {membersWithPromotions} ready to promote
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
