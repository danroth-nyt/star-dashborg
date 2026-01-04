import { useState, useEffect, useCallback } from 'react';
import { X, Volume2, VolumeX, Crosshair } from 'lucide-react';
import { useSpaceCombat } from '../../context/SpaceCombatContext';
import { useSoundEffects } from '../../hooks/useSoundEffects';
import { isUserTyping } from '../../lib/keyboardUtils';
import Button from '../ui/Button';
import ShipStatus from './ShipStatus';
import StationGrid from './StationGrid';
import CombatLog from './CombatLog';
import EnemyRoster from './EnemyRoster';
import EnemyDrawer from './EnemyDrawer';

export default function SpaceCombatView() {
  const { exitCombatView, getActiveEnemyCount } = useSpaceCombat();
  const { toggleMute, getMutedState } = useSoundEffects();
  const [isExiting, setIsExiting] = useState(false);
  const [isMuted, setIsMuted] = useState(getMutedState());
  const [isEnemyDrawerOpen, setIsEnemyDrawerOpen] = useState(false);
  
  const activeEnemyCount = getActiveEnemyCount();

  const handleExitCombatView = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      exitCombatView(); // Exit view for this user only
      setIsExiting(false);
    }, 300);
  }, [exitCombatView]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Skip if user is typing
      if (isUserTyping()) return;
      
      // ESC to exit combat view (no confirmation needed for local exit)
      if (e.key === 'Escape' && !isExiting) {
        handleExitCombatView();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isExiting, handleExitCombatView]);

  const handleToggleSound = () => {
    const newMutedState = toggleMute();
    setIsMuted(newMutedState);
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

            <div className="flex items-center gap-2">
              {/* Enemy Forces Button */}
              <button
                onClick={() => setIsEnemyDrawerOpen(true)}
                className={`relative p-2 transition-colors rounded border-2 ${
                  activeEnemyCount > 0
                    ? 'text-accent-red hover:text-white border-accent-red/50 hover:border-accent-red hover:bg-accent-red/20'
                    : 'text-gray-400 hover:text-accent-cyan border-transparent hover:border-accent-cyan'
                }`}
                title="Manage enemy forces"
              >
                <Crosshair className="w-4 h-4" />
                {activeEnemyCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 text-[10px] font-bold bg-accent-red text-white rounded-full flex items-center justify-center">
                    {activeEnemyCount > 9 ? '9+' : activeEnemyCount}
                  </span>
                )}
              </button>
              
              <button
                onClick={handleToggleSound}
                className="p-2 text-gray-400 hover:text-accent-cyan transition-colors rounded border-2 border-transparent hover:border-accent-cyan"
                title={isMuted ? 'Unmute sounds' : 'Mute sounds'}
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>
              
              <Button
                variant="ghost"
                onClick={handleExitCombatView}
                className="flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                <span className="hidden sm:inline">Exit View</span>
              </Button>
            </div>
          </div>
        </header>

        {/* Combat Interface */}
        <div className="flex-1 p-4 lg:p-6 xl:p-8">
            <div className="max-w-[1920px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 xl:gap-8">
              {/* Left Column - Unified Ship Panel */}
              <div className="lg:col-span-4 xl:col-span-3 space-y-4">
                <ShipStatus />
                
                {/* Enemy Roster (Compact Inline) */}
                <EnemyRoster onOpenDrawer={() => setIsEnemyDrawerOpen(true)} />

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
              <div className="lg:col-span-5 xl:col-span-6">
                <StationGrid />
              </div>

              {/* Right Column - Combat Log */}
              <div className="lg:col-span-3 xl:col-span-3">
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
      
      {/* Enemy Management Drawer */}
      <EnemyDrawer 
        isOpen={isEnemyDrawerOpen} 
        onClose={() => setIsEnemyDrawerOpen(false)} 
      />
    </div>
  );
}
