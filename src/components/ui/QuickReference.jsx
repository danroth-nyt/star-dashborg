import { useState } from 'react';
import { ChevronDown, ChevronUp, BookOpen } from 'lucide-react';

export default function QuickReference() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-2 border-accent-yellow bg-bg-secondary">
      {/* Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-accent-yellow hover:bg-opacity-10 transition-all"
      >
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-accent-yellow" />
          <span className="font-orbitron font-bold text-accent-yellow uppercase">
            Quick Reference
          </span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-accent-yellow" />
        ) : (
          <ChevronDown className="w-5 h-5 text-accent-yellow" />
        )}
      </button>

      {/* Content */}
      {isOpen && (
        <div className="px-4 pb-4 space-y-4 text-sm">
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
        </div>
      )}
    </div>
  );
}
