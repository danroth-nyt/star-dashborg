import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { isUserTyping } from '../../lib/keyboardUtils';

export default function QuickReferenceDrawer({ isOpen, onClose }) {
  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      
      // Skip if user is typing
      if (isUserTyping()) return;
      
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
          "fixed w-full md:w-[480px] bg-bg-primary border-r-3 border-accent-yellow transform transition-transform duration-300 ease-in-out scanlines overflow-hidden flex flex-col",
          isOpen ? "translate-x-0 z-[9999]" : "-translate-x-full z-[-1]"
        )}
        style={{ 
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100vh',
          maxHeight: '100vh'
        }}
      >
        {/* Header */}
        <div className="border-b-3 border-accent-yellow bg-bg-secondary p-4 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-accent-yellow font-orbitron font-bold text-xl uppercase text-glow-yellow">
              Quick Reference
            </h2>
            <p className="text-gray-400 text-xs font-orbitron mt-1">
              Essential Rules & Mechanics
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
        <div className="overflow-y-auto flex-1 p-4 space-y-4 text-sm">
          {/* Difficulty Ratings */}
          <div>
            <h3 className="font-orbitron font-bold text-accent-cyan uppercase mb-2 text-xs">
              Difficulty Ratings
            </h3>
            <div className="grid grid-cols-2 gap-1 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-400">Routine:</span>
                <span className="text-text-primary font-mono">DR 8</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Easy:</span>
                <span className="text-text-primary font-mono">DR 10</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Normal:</span>
                <span className="text-text-primary font-mono font-bold">DR 12</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Difficult:</span>
                <span className="text-text-primary font-mono">DR 14</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Complicated:</span>
                <span className="text-text-primary font-mono">DR 16</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Impossible:</span>
                <span className="text-text-primary font-mono">DR 18</span>
              </div>
            </div>
          </div>

          {/* Solo Hit Results */}
          <div className="border-t border-accent-yellow/30 pt-3">
            <h3 className="font-orbitron font-bold text-accent-cyan uppercase mb-2 text-xs">
              Solo Test Results (D20 + Ability)
            </h3>
            <div className="space-y-1">
              <div className="flex items-start gap-2">
                <span className="text-accent-cyan font-mono font-bold">12+</span>
                <div>
                  <span className="font-bold text-accent-cyan">STRONG HIT:</span>
                  <span className="text-gray-300 ml-1">Things go exactly as planned.</span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-accent-yellow font-mono font-bold">9-11</span>
                <div>
                  <span className="font-bold text-accent-yellow">WEAK HIT:</span>
                  <span className="text-gray-300 ml-1">Good, but not completely as planned.</span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-accent-red font-mono font-bold">8&lt;</span>
                <div>
                  <span className="font-bold text-accent-red">FAIL:</span>
                  <span className="text-gray-300 ml-1">Things are not going your way.</span>
                </div>
              </div>
            </div>
          </div>

          {/* Combat Tests */}
          <div className="border-t border-accent-yellow/30 pt-3">
            <h3 className="font-orbitron font-bold text-accent-cyan uppercase mb-2 text-xs">
              Combat Tests (DR12 Default)
            </h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-400">Melee:</span>
                <span className="text-text-primary font-mono">STR</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Ranged:</span>
                <span className="text-text-primary font-mono">PRS</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Throw:</span>
                <span className="text-text-primary font-mono">AGI</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Defense:</span>
                <span className="text-text-primary font-mono">AGI</span>
              </div>
            </div>
          </div>

          {/* Armor Tiers */}
          <div className="border-t border-accent-yellow/30 pt-3">
            <h3 className="font-orbitron font-bold text-accent-cyan uppercase mb-2 text-xs">
              Armor Tiers
            </h3>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-400">Tier 1 (Light):</span>
                <span className="text-text-primary font-mono">-D2 damage</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Tier 2 (Medium):</span>
                <span className="text-text-primary font-mono">-D4 damage</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Tier 3 (Heavy):</span>
                <span className="text-text-primary font-mono">-D6 damage</span>
              </div>
              <div className="text-gray-500 text-xs mt-1">
                * Reduced one tier on Defense blunder
              </div>
            </div>
          </div>

          {/* Resting */}
          <div className="border-t border-accent-yellow/30 pt-3">
            <h3 className="font-orbitron font-bold text-accent-cyan uppercase mb-2 text-xs">
              Resting & Recovery
            </h3>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-400">Catch Breath:</span>
                <span className="text-text-primary font-mono">Restore D4 HP</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Night's Sleep:</span>
                <span className="text-text-primary font-mono">Restore D6 HP</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Healing Tank (1 week):</span>
                <span className="text-text-primary font-mono">Full HP</span>
              </div>
            </div>
          </div>

          {/* Destiny Points */}
          <div className="border-t border-accent-yellow/30 pt-3">
            <h3 className="font-orbitron font-bold text-accent-cyan uppercase mb-2 text-xs">
              Destiny Points
            </h3>
            <div className="space-y-2 text-xs">
              <p className="text-gray-300">
                Start with <span className="text-accent-yellow font-bold">D2 Destiny Points</span>. 
                Regain by rolling D2 after spending all and resting.
              </p>
              <div className="text-gray-300">
                <span className="font-bold text-accent-cyan">Use Destiny to:</span>
                <div className="ml-4 mt-1 space-y-0.5">
                  • Deal maximum damage with one attack<br />
                  • Reroll a dice roll (yours or someone else's)<br />
                  • Lower damage dealt to you by D6<br />
                  • Neutralize a Crit or Blunder<br />
                  • -4DR to one test (before rolling)
                </div>
              </div>
            </div>
          </div>

          {/* Critical & Blunder */}
          <div className="border-t border-accent-yellow/30 pt-3">
            <h3 className="font-orbitron font-bold text-accent-cyan uppercase mb-2 text-xs">
              Natural 20 / Natural 1
            </h3>
            <div className="space-y-2 text-xs">
              <div>
                <span className="font-bold text-accent-cyan">CRIT (20):</span>
                <div className="text-gray-300 ml-4">
                  • Attack: Double damage, reduce armor 1 tier<br />
                  • Defense: Gain free attack<br />
                  • Other: Outrageous success
                </div>
              </div>
              <div>
                <span className="font-bold text-accent-red">BLUNDER (1):</span>
                <div className="text-gray-300 ml-4">
                  • Roll on Blunder table (d4)
                </div>
              </div>
            </div>
          </div>

          {/* Morale */}
          <div className="border-t border-accent-yellow/30 pt-3">
            <h3 className="font-orbitron font-bold text-accent-cyan uppercase mb-2 text-xs">
              Enemy Morale
            </h3>
            <div className="text-xs space-y-1">
              <p className="text-gray-300">Roll 2D6 when:</p>
              <div className="text-gray-400 ml-4">
                • Leader killed<br />
                • Half group eliminated<br />
                • Single enemy at 1/3 HP
              </div>
              <p className="text-gray-300 mt-2">
                If roll &gt; enemy MRL: Roll D6<br />
                <span className="ml-4">1-4 = Flees, 5-6 = Surrenders</span>
              </p>
            </div>
          </div>

          {/* Threat Die */}
          <div className="border-t border-accent-yellow/30 pt-3">
            <h3 className="font-orbitron font-bold text-accent-cyan uppercase mb-2 text-xs">
              Threat Die Triggers
            </h3>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-accent-red font-bold">INCREASE:</span>
                <div className="text-gray-400 ml-2 mt-1">
                  • New Danger Clock<br />
                  • Roll Blunder<br />
                  • Begin Escape
                </div>
              </div>
              <div>
                <span className="text-accent-cyan font-bold">DECREASE:</span>
                <div className="text-gray-400 ml-2 mt-1">
                  • Complete Mission<br />
                  • Resolve Clock<br />
                  • Roll Critical<br />
                  • Catch Breath
                </div>
              </div>
            </div>
            <p className="text-gray-400 text-xs mt-2">
              When TD = 6: Advance ALL Clocks +1, OR fill ONE Clock
            </p>
          </div>

          {/* Bits Currency */}
          <div className="border-t border-accent-yellow/30 pt-3">
            <h3 className="font-orbitron font-bold text-accent-cyan uppercase mb-2 text-xs">
              Bits ∆ (Currency)
            </h3>
            <div className="space-y-2 text-xs">
              <p className="text-gray-300">
                The standard currency of the galaxy. Rebels either have Bits or they don't.
              </p>
              <div className="text-gray-300">
                <span className="font-bold text-accent-yellow">Starting Bits (Roll D6):</span>
                <div className="ml-4 mt-1">
                  <span className="text-accent-red">1-3:</span> No Bits<br />
                  <span className="text-accent-cyan">4-6:</span> You got Bits ∆
                </div>
              </div>
              <div className="text-gray-400 text-xs border-t border-gray-700 pt-2 mt-2">
                <span className="font-bold text-accent-yellow">∆</span> = Costs all the bits you have<br />
                <span className="font-bold text-accent-yellow">∆∆</span> = Costs all the bits the party has
              </div>
            </div>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}
