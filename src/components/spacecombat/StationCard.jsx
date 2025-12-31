import { User, UserX, Zap, Rocket } from 'lucide-react';
import { useParty } from '../../context/PartyContext';
import { useSpaceCombat } from '../../context/SpaceCombatContext';
import { useGame } from '../../context/GameContext';
import { hasUpgrade } from '../../utils/shipUpgrades';

export default function StationCard({ station, assignedCharacterId, onAssign, onUnassign, children }) {
  const { partyMembers } = useParty();
  const { spaceCombat } = useSpaceCombat();
  const { gameState } = useGame();
  
  const ship = gameState.ship || { heroicUpgrades: [], purchasedUpgrades: [], turboLaserStation: null };
  
  const assignedCharacter = partyMembers.find(m => m.id === assignedCharacterId);
  const isManned = !!assignedCharacter;

  // Get available party members not assigned to any station
  const availableMembers = partyMembers.filter(member => 
    !Object.values(spaceCombat.stationAssignments).includes(member.id)
  );

  return (
    <div 
      className={`bg-bg-secondary/90 backdrop-blur-sm border-3 p-3 transition-all ${
        isManned 
          ? 'border-accent-cyan glow-cyan' 
          : 'border-gray-600 hover:border-accent-yellow/50'
      }`}
    >
      {/* Station Header */}
      <div className="flex items-center justify-between mb-3 pb-2 border-b-2 border-gray-700">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className={`font-orbitron font-bold text-sm uppercase ${
              isManned ? 'text-accent-cyan' : 'text-gray-400'
            }`}>
              {station.name}
            </h3>
            
            {/* Upgrade Indicators */}
            {station.id === 'pilot' && hasUpgrade(ship, 'boosterRockets') && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-orbitron font-bold uppercase bg-accent-yellow/20 border border-accent-yellow/50 text-accent-yellow rounded" title="Booster Rockets: Steady affects D2 attacks">
                <Rocket className="w-2.5 h-2.5" />
                Boosters
              </span>
            )}
            
            {(station.id === 'gunner1' || station.id === 'gunner2') && 
             hasUpgrade(ship, 'turboLasers') && 
             ship.turboLaserStation === station.id && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-orbitron font-bold uppercase bg-accent-red/20 border border-accent-red/50 text-accent-red rounded animate-pulse" title="Turbo Lasers: Deals D8 damage">
                <Zap className="w-2.5 h-2.5" />
                Turbo
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            {station.description}
          </p>
        </div>
        
        {/* Assignment status */}
        <div className="flex items-center gap-2">
          {isManned ? (
            <User className="w-4 h-4 text-accent-cyan" />
          ) : (
            <UserX className="w-4 h-4 text-gray-600" />
          )}
        </div>
      </div>

      {/* Character Assignment */}
      <div className="mb-3">
        {isManned ? (
          <div className="flex items-center justify-between p-2 bg-accent-cyan/10 border-2 border-accent-cyan/30 rounded">
            <div>
              <p className="text-sm font-orbitron text-accent-cyan font-bold">
                {assignedCharacter.name}
              </p>
              <p className="text-xs text-gray-400">
                {assignedCharacter.class ? assignedCharacter.class.charAt(0).toUpperCase() + assignedCharacter.class.slice(1) : 'Rebel'}
              </p>
            </div>
            <button
              onClick={() => onUnassign(station.id)}
              className="px-2 py-1 text-xs font-orbitron text-accent-red border-2 border-accent-red/30 hover:bg-accent-red hover:text-bg-primary transition-all"
            >
              UNASSIGN
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-xs text-gray-500 font-orbitron uppercase">
              Station Unmanned
            </p>
            
            {availableMembers.length > 0 ? (
              <div className="space-y-1 max-h-24 overflow-y-auto">
                {availableMembers.map(member => (
                  <button
                    key={member.id}
                    onClick={() => onAssign(station.id, member.id)}
                    className="w-full px-2 py-1 text-xs font-orbitron text-left text-accent-yellow border-2 border-accent-yellow/30 hover:bg-accent-yellow hover:text-bg-primary transition-all"
                  >
                    Assign: {member.name}
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-600 italic">
                All rebels assigned
              </p>
            )}
          </div>
        )}
      </div>

      {/* Station-specific content (actions) */}
      <div className={`${!isManned ? 'opacity-40 pointer-events-none' : ''}`}>
        {children}
      </div>
    </div>
  );
}
