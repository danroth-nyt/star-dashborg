import { useState, useEffect } from 'react';
import { X, Zap } from 'lucide-react';
import { useSpaceCombat } from '../../context/SpaceCombatContext';
import { useParty } from '../../context/PartyContext';
import Button from '../ui/Button';
import ShipStatus from './ShipStatus';
import StationGrid from './StationGrid';
import CombatLog from './CombatLog';
import SpaceCombatShipPanel from './SpaceCombatShipPanel';

export default function SpaceCombatView() {
  const { spaceCombat, exitCombat } = useSpaceCombat();
  const { partyMembers } = useParty();
  const [isExiting, setIsExiting] = useState(false);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      // ESC to exit combat (with confirmation)
      if (e.key === 'Escape' && !isExiting) {
        handleExitCombat();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isExiting]);

  const handleExitCombat = () => {
    if (confirm('Exit space combat? Progress will be saved.')) {
      setIsExiting(true);
      setTimeout(() => {
        exitCombat();
        setIsExiting(false);
      }, 300);
    }
  };

  return (
    <div className={`min-h-screen bg-space-background relative overflow-hidden ${isExiting ? 'fade-out' : 'fade-in'}`}>
      {/* Animated star field background */}
      <div className="stars-layer-1"></div>
      <div className="stars-layer-2"></div>
      <div className="stars-layer-3"></div>

      {/* Scanlines overlay */}
      <div className="scanlines-combat"></div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="border-b-3 border-accent-red bg-bg-secondary/90 backdrop-blur-sm p-3 md:p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-accent-red rounded-full glow-pulse-red"></div>
              <div>
                <h1 className="font-orbitron font-black text-xl md:text-3xl text-accent-red text-glow-red tracking-wider">
                  SPACE COMBAT
                </h1>
                <p className="text-accent-cyan text-xs md:text-sm font-orbitron">
                  BATTLE STATIONS ACTIVE
                </p>
              </div>
            </div>

            <Button
              variant="ghost"
              onClick={handleExitCombat}
              className="flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              <span className="hidden sm:inline">Exit Combat</span>
            </Button>
          </div>
        </header>

        {/* Combat Interface */}
        <div className="flex-1 p-4 lg:p-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
              {/* Left Column - Ship Status & Upgrades */}
              <div className="lg:col-span-4 space-y-4">
                <ShipStatus />
                
                {/* Quick Stats */}
                <div className="bg-bg-secondary/80 backdrop-blur-sm border-3 border-accent-cyan p-4 space-y-3">
                  <h3 className="font-orbitron font-bold text-accent-cyan text-sm uppercase">
                    Quick Stats
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Crew:</span>
                      <span className="text-accent-cyan font-orbitron">
                        {partyMembers.length} Rebel{partyMembers.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Stations Manned:</span>
                      <span className="text-accent-yellow font-orbitron">
                        {Object.values(spaceCombat.stationAssignments).filter(Boolean).length}/6
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Torpedoes:</span>
                      <span className="text-accent-cyan font-orbitron flex items-center gap-1">
                        <Zap className="w-3 h-3" />
                        {spaceCombat.torpedoesLoaded}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Ship Upgrades Manager - Compact */}
                <div className="bg-bg-secondary/80 backdrop-blur-sm border-3 border-accent-cyan p-3">
                  <SpaceCombatShipPanel />
                </div>

                {/* Combat Notes */}
                <div className="bg-bg-secondary/80 backdrop-blur-sm border-3 border-gray-700 p-4">
                  <p className="text-xs text-gray-400 font-orbitron uppercase mb-3">
                    Combat Notes:
                  </p>
                  <ul className="space-y-2 text-xs text-gray-400">
                    <li className="flex items-start gap-2">
                      <span className="text-accent-cyan">•</span>
                      <span>Solo rebels can make 2 actions per turn</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent-cyan">•</span>
                      <span>Changing stations takes 1 round</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent-cyan">•</span>
                      <span>Failed defense rolls degrade ship armor by 1 tier</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-accent-yellow">•</span>
                      <span>Hyperdrive takes 3 rounds to charge - dangerous with 4+ enemies!</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Center Column - Station Grid */}
              <div className="lg:col-span-5">
                <StationGrid />
              </div>

              {/* Right Column - Combat Log */}
              <div className="lg:col-span-3">
                <CombatLog />
              </div>
            </div>
          </div>
        </div>

        {/* Combat Tips Footer */}
        <footer className="border-t-3 border-accent-cyan bg-bg-secondary/90 backdrop-blur-sm p-2 md:p-3">
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs md:text-sm text-gray-400 font-orbitron">
            <span className="flex items-center gap-1">
              <span className="text-accent-cyan">›</span>
              Ship starts at Tier 2 armor
            </span>
            <span className="hidden md:inline">|</span>
            <span className="flex items-center gap-1">
              <span className="text-accent-cyan">›</span>
              Armor reduces 1 tier per failed defense
            </span>
            <span className="hidden lg:inline">|</span>
            <span className="flex items-center gap-1">
              <span className="text-accent-cyan">›</span>
              Press ESC to exit
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}
