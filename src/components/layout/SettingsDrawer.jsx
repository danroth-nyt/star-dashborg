import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useGame } from '../../context/GameContext';
import Accordion from '../ui/Accordion';

export default function SettingsDrawer({ isOpen, onClose }) {
  const { gameState, togglePVOracles } = useGame();

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-black transition-opacity duration-300",
          isOpen ? "opacity-70 pointer-events-auto z-[9998]" : "opacity-0 pointer-events-none z-[-1]"
        )}
        onClick={onClose}
        style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
      />

      {/* Drawer - Floating over content */}
      <div
        className={cn(
          "fixed w-full md:w-[480px] bg-bg-primary border-l-3 border-accent-cyan transform transition-transform duration-300 ease-in-out scanlines overflow-hidden flex flex-col",
          isOpen ? "translate-x-0 z-[9999]" : "translate-x-full z-[-1]"
        )}
        style={{ 
          position: 'fixed',
          top: 0,
          right: 0,
          height: '100vh',
          maxHeight: '100vh'
        }}
      >
        {/* Header */}
        <div className="border-b-3 border-accent-cyan bg-bg-secondary p-4 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-accent-cyan font-orbitron font-bold text-xl uppercase text-glow-cyan">
              Settings
            </h2>
            <p className="text-gray-400 text-xs font-orbitron mt-1">
              Configure Your Dashboard
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-accent-red hover:text-accent-red hover:bg-accent-red hover:bg-opacity-20 p-2 transition-colors border-2 border-accent-red"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 p-4">
          {/* Content Sources Section */}
          <Accordion title="Content Sources" defaultOpen={true}>
            <div className="space-y-4">
              <div className="text-gray-400 text-sm mb-4">
                Toggle additional content from compatible sourcebooks and supplements.
              </div>

              {/* Perilous Void Toggle */}
              <label className="flex items-start gap-3 cursor-pointer p-3 border-2 border-accent-yellow bg-bg-secondary hover:bg-accent-yellow hover:bg-opacity-10 transition-colors">
                <input
                  type="checkbox"
                  checked={gameState.includePVOracles}
                  onChange={(e) => togglePVOracles(e.target.checked)}
                  className="w-5 h-5 mt-0.5 accent-accent-yellow cursor-pointer flex-shrink-0"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-accent-yellow font-orbitron text-sm font-bold uppercase">
                      The Perilous Void
                    </span>
                    {gameState.includePVOracles && (
                      <span className="text-accent-yellow text-xs px-2 py-0.5 border border-accent-yellow rounded">
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <p className="text-gray-400 text-xs mt-1">
                    Adds 10 opening scenes (d20→d30) and Inciting Incident generator for campaign setup
                  </p>
                  {gameState.includePVOracles && (
                    <div className="text-accent-yellow text-xs mt-2 space-y-1">
                      <div>• Opening Scene: d30 table</div>
                      <div>• Mission Generator: Inciting tab</div>
                      <div>• Game Flow: Inciting Incident option</div>
                    </div>
                  )}
                </div>
              </label>

              {/* Future source placeholder */}
              <div className="p-3 border-2 border-gray-600 bg-bg-secondary opacity-50">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    disabled
                    className="w-5 h-5 mt-0.5 cursor-not-allowed"
                  />
                  <div>
                    <span className="text-gray-500 font-orbitron text-sm font-bold uppercase">
                      Additional Sources
                    </span>
                    <p className="text-gray-600 text-xs mt-1">
                      More sourcebook integrations coming soon...
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Accordion>

          {/* Display Preferences Section - Placeholder */}
          <Accordion title="Display Preferences" defaultOpen={false}>
            <div className="space-y-4">
              <div className="text-gray-400 text-sm mb-4">
                Customize the appearance and behavior of your dashboard.
              </div>
              
              <div className="p-3 border-2 border-gray-600 bg-bg-secondary opacity-50">
                <span className="text-gray-500 font-orbitron text-sm">
                  Display options coming soon...
                </span>
              </div>
            </div>
          </Accordion>

          {/* Game Options Section - Placeholder */}
          <Accordion title="Game Options" defaultOpen={false}>
            <div className="space-y-4">
              <div className="text-gray-400 text-sm mb-4">
                Configure house rules and gameplay variants.
              </div>
              
              <div className="p-3 border-2 border-gray-600 bg-bg-secondary opacity-50">
                <span className="text-gray-500 font-orbitron text-sm">
                  Game options coming soon...
                </span>
              </div>
            </div>
          </Accordion>

          {/* Info Footer */}
          <div className="mt-6 p-4 border-2 border-accent-cyan bg-bg-secondary">
            <div className="text-accent-cyan font-orbitron text-xs uppercase mb-2">
              About Settings
            </div>
            <p className="text-gray-300 text-sm">
              Settings are saved automatically and synced across your session. Changes take effect immediately.
            </p>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}
