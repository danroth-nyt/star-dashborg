import { useState } from 'react';
import { ChevronDown, ChevronRight, BookOpen, Shield, Dice5, Zap, AlertTriangle as AlertTriangleIcon } from 'lucide-react';
import { 
  MORALE_RULES, 
  SPACE_COMBAT_RULES, 
  ENEMY_ARMOR_TIERS,
  FIGHTER_BUILDS_ARRAY,
  ENEMY_SHIPS
} from '../../data/enemyShipData';

// Accordion section component
function DocSection({ title, icon: Icon, children, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className="border border-gray-700 rounded">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-2 p-3 text-left hover:bg-gray-800/50 transition-colors"
      >
        {isOpen ? (
          <ChevronDown className="w-4 h-4 text-gray-400" />
        ) : (
          <ChevronRight className="w-4 h-4 text-gray-400" />
        )}
        <Icon className="w-4 h-4 text-accent-cyan" />
        <span className="font-orbitron text-sm text-text-primary">{title}</span>
      </button>
      
      {isOpen && (
        <div className="px-4 pb-4 text-xs text-gray-300 space-y-2">
          {children}
        </div>
      )}
    </div>
  );
}

export default function EnemyDocsPanel() {
  return (
    <div className="space-y-3">
      {/* Morale Rules */}
      <DocSection title="Morale Rules" icon={Dice5} defaultOpen={true}>
        <div className="space-y-3">
          <div>
            <p className="font-bold text-accent-yellow mb-1">When to Test Morale:</p>
            <ul className="list-disc list-inside space-y-0.5 text-gray-400">
              {MORALE_RULES.triggers.map((trigger, i) => (
                <li key={i}>{trigger}</li>
              ))}
            </ul>
          </div>
          
          <div>
            <p className="font-bold text-accent-cyan mb-1">How to Check:</p>
            <p className="text-gray-400">{MORALE_RULES.check}</p>
          </div>
          
          <div>
            <p className="font-bold text-accent-red mb-1">If Demoralized (roll d6):</p>
            <ul className="space-y-0.5 text-gray-400">
              {MORALE_RULES.outcomes.map((outcome, i) => (
                <li key={i}>
                  <span className="font-mono text-accent-cyan">{outcome.roll}:</span> {outcome.result}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="bg-accent-yellow/10 border border-accent-yellow/30 p-2 rounded">
            <p className="text-accent-yellow">
              <span className="font-bold">Squadthink:</span> {MORALE_RULES.squadthink}
            </p>
          </div>
        </div>
      </DocSection>
      
      {/* Armor Tiers */}
      <DocSection title="Armor Tiers" icon={Shield}>
        <div className="space-y-2">
          {Object.values(ENEMY_ARMOR_TIERS).map((tier) => (
            <div key={tier.tier} className="flex items-center gap-3">
              <span className={`w-16 font-mono ${
                tier.tier === 0 ? 'text-gray-500' : 'text-accent-cyan'
              }`}>
                {tier.label}
              </span>
              <span className="text-gray-400">
                {tier.reduction > 0 
                  ? `Reduces damage by 1-${tier.reduction} (roll ${tier.dice})`
                  : 'No damage reduction'
                }
              </span>
            </div>
          ))}
        </div>
      </DocSection>
      
      {/* Fighter Builds */}
      <DocSection title="Fighter Builds (d6)" icon={Zap}>
        <div className="space-y-2">
          {FIGHTER_BUILDS_ARRAY.map((build) => (
            <div key={build.id} className="border-l-2 border-accent-yellow pl-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-accent-yellow text-[10px]">
                  {build.roll}
                </span>
                <span className="font-bold text-text-primary">
                  {build.name}
                </span>
              </div>
              <p className="text-gray-400 text-[10px]">{build.effect}</p>
            </div>
          ))}
        </div>
      </DocSection>
      
      {/* Ship Stats Reference */}
      <DocSection title="Enemy Ship Stats" icon={BookOpen}>
        <div className="space-y-3">
          {Object.values(ENEMY_SHIPS).map((ship) => (
            <div key={ship.id} className="border border-gray-700 p-2 rounded">
              <h4 className="font-orbitron font-bold text-text-primary text-sm">
                {ship.name}
              </h4>
              <div className="grid grid-cols-4 gap-2 mt-1 text-[10px]">
                <div>
                  <span className="text-gray-500">HP:</span>{' '}
                  <span className="text-accent-cyan font-mono">{ship.hp || '∞'}</span>
                </div>
                <div>
                  <span className="text-gray-500">MRL:</span>{' '}
                  <span className="text-accent-yellow font-mono">{ship.morale || '-'}</span>
                </div>
                <div>
                  <span className="text-gray-500">ARM:</span>{' '}
                  <span className="text-accent-cyan font-mono">{ship.armor || 0}</span>
                </div>
                <div>
                  <span className="text-gray-500">DR:</span>{' '}
                  <span className={`font-mono ${ship.dr === 14 ? 'text-accent-red' : 'text-text-primary'}`}>
                    {ship.dr}
                  </span>
                </div>
              </div>
              <div className="mt-1 text-[10px]">
                <span className="text-gray-500">Weapon:</span>{' '}
                <span className="text-text-primary">{ship.weapon.name} ({ship.weapon.damage})</span>
              </div>
              {ship.traits.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-1">
                  {ship.traits.map((trait, i) => (
                    <span key={i} className="px-1 py-0.5 bg-gray-800 text-gray-400 text-[9px] rounded">
                      {trait}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </DocSection>
      
      {/* Special Rules */}
      <DocSection title="Special Rules" icon={AlertTriangleIcon}>
        <div className="space-y-3">
          {Object.values(SPACE_COMBAT_RULES).map((rule) => (
            <div key={rule.title}>
              <p className="font-bold text-accent-red">{rule.title}</p>
              <p className="text-gray-400">{rule.description}</p>
            </div>
          ))}
        </div>
      </DocSection>
      
      {/* DR Reference */}
      <DocSection title="Difficulty Ratings (DR)" icon={BookOpen}>
        <div className="space-y-1">
          <p><span className="font-mono text-accent-cyan">DR 12:</span> Normal enemies</p>
          <p><span className="font-mono text-accent-red">DR 14:</span> Elite enemies (Predator Leader, Dragoon, Bounty Hunter)</p>
          <div className="mt-2 text-gray-500 text-[10px]">
            <p>Players roll D20 + Ability ≥ DR to succeed.</p>
            <p>Defense typically uses AGI.</p>
          </div>
        </div>
      </DocSection>
    </div>
  );
}
