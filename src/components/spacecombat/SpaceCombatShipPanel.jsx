import { useState } from 'react';
import { createPortal } from 'react-dom';
import { Ship, Star, Zap, ShoppingCart, Award, Settings, X } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { SHIP_UPGRADES } from '../../data/spaceCombatData';
import { getUpgradeById } from '../../data/shipShopData';
import { getAllUpgrades, getTotalTorpedoCount, getAvailableHeroicSlots } from '../../utils/shipUpgrades';
import Button from '../ui/Button';
import UpgradeShop from '../ship/UpgradeShop';
import HeroicRewardsModal from '../ship/HeroicRewardsModal';

export default function SpaceCombatShipPanel() {
  const { gameState } = useGame();
  const [shopOpen, setShopOpen] = useState(false);
  const [rewardsOpen, setRewardsOpen] = useState(false);
  const [selectedUpgrade, setSelectedUpgrade] = useState(null);
  
  const ship = gameState.ship || {
    name: 'The Rebel Corvette',
    heroicUpgrades: [],
    purchasedUpgrades: [],
    torpedoInventory: { standard: 0, cluster: 0, hunterKiller: 0, chaff: 0, ion: 0 },
    turboLaserStation: null,
    galaxiesSaved: 0,
  };
  
  const allUpgrades = getAllUpgrades(ship);
  const torpedoCount = getTotalTorpedoCount(ship);
  const availableRewards = getAvailableHeroicSlots(ship);

  // Helper to get short display name for upgrades
  const getShortName = (upgradeId) => {
    const upgrade = getUpgradeById(upgradeId) || SHIP_UPGRADES[upgradeId];
    if (!upgrade?.name) return upgradeId;
    
    // Special cases for common upgrade patterns
    const name = upgrade.name;
    if (name.includes('and')) {
      // "Harpoon and Tow Cable" -> "Harpoon & Tow"
      const parts = name.split(' and ');
      return `${parts[0]} & ${parts[1]?.split(' ')[0] || ''}`;
    }
    
    // For single or two-word names, return as is
    const words = name.split(' ');
    if (words.length <= 2) return name;
    
    // For longer names, truncate intelligently
    if (name.length <= 15) return name;
    return words.slice(0, 2).join(' ');
  };

  return (
    <div className="space-y-3">
      {/* Compact Header */}
      <div className="border-b-2 border-accent-cyan/30 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 flex-1">
            <Ship className="w-4 h-4 text-accent-cyan flex-shrink-0" />
            <span className="font-orbitron font-bold text-accent-cyan text-sm truncate">
              {ship.name}
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span className="flex items-center gap-1" title={`${allUpgrades.length} upgrades installed`}>
              <Settings className="w-3 h-3 text-accent-cyan" />
              {allUpgrades.length}
            </span>
            <span className="flex items-center gap-1" title={`${ship.galaxiesSaved} galaxies saved`}>
              <Star className="w-3 h-3 text-accent-yellow" />
              {ship.galaxiesSaved}
            </span>
            <span className="flex items-center gap-1" title={`${torpedoCount} torpedoes in inventory`}>
              <Zap className="w-3 h-3 text-accent-yellow" />
              {torpedoCount}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons - Compact */}
      <div className="flex gap-2">
        <Button
          variant="primary"
          onClick={() => setShopOpen(true)}
          className="flex-1 px-2 py-2 text-xs flex items-center justify-center gap-1"
        >
          <ShoppingCart className="w-3 h-3" />
          Shop
        </Button>
        
        {availableRewards > 0 && (
          <Button
            variant="secondary"
            onClick={() => setRewardsOpen(true)}
            className="flex-1 px-2 py-2 text-xs flex items-center justify-center gap-1 glow-pulse-yellow border-accent-yellow text-accent-yellow"
          >
            <Award className="w-3 h-3" />
            Reward ({availableRewards})
          </Button>
        )}
      </div>

      {/* Current Upgrades - Compact */}
      {allUpgrades.length > 0 && (
        <div className="text-xs space-y-1">
          {ship.heroicUpgrades.length > 0 && (
            <div>
              <p className="font-orbitron text-accent-yellow text-[10px] uppercase mb-1">Heroic:</p>
              <div className="flex flex-wrap gap-1">
                {ship.heroicUpgrades.map((id) => {
                  const upgrade = SHIP_UPGRADES[id];
                  return (
                    <button
                      key={id}
                      onClick={() => setSelectedUpgrade({ ...upgrade, id, isHeroic: true })}
                      className="px-2 py-1 bg-accent-yellow/20 border border-accent-yellow/50 text-accent-yellow font-orbitron text-[11px] rounded hover:bg-accent-yellow/30 hover:border-accent-yellow transition-all cursor-pointer whitespace-nowrap"
                      title={upgrade?.name || id}
                    >
                      {getShortName(id)}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
          
          {ship.purchasedUpgrades.length > 0 && (
            <div>
              <p className="font-orbitron text-accent-cyan text-[10px] uppercase mb-1">Purchased:</p>
              <div className="flex flex-wrap gap-1">
                {ship.purchasedUpgrades.map((id, idx) => {
                  const upgrade = getUpgradeById(id);
                  return (
                    <button
                      key={`${id}-${idx}`}
                      onClick={() => setSelectedUpgrade({ ...upgrade, id, isHeroic: false })}
                      className="px-2 py-1 bg-accent-cyan/20 border border-accent-cyan/50 text-accent-cyan font-orbitron text-[11px] rounded hover:bg-accent-cyan/30 hover:border-accent-cyan transition-all cursor-pointer whitespace-nowrap"
                      title={upgrade?.name || id}
                    >
                      {getShortName(id)}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Upgrade Detail Popover - Rendered via Portal to document.body */}
      {selectedUpgrade && createPortal(
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[99999] flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setSelectedUpgrade(null)}
        >
          <div 
            className={`bg-bg-secondary border-3 max-w-lg w-full max-h-[80vh] overflow-y-auto p-5 shadow-2xl relative custom-scrollbar ${
              selectedUpgrade.isHeroic ? 'border-accent-yellow shadow-accent-yellow/20' : 'border-accent-cyan shadow-accent-cyan/20'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-3 mb-3">
              <h3 className={`font-orbitron font-bold text-base uppercase flex-1 leading-tight ${
                selectedUpgrade.isHeroic ? 'text-accent-yellow' : 'text-accent-cyan'
              }`}>
                {selectedUpgrade.name || selectedUpgrade.id}
              </h3>
              <button
                onClick={() => setSelectedUpgrade(null)}
                className="text-gray-400 hover:text-accent-red transition-colors flex-shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Category Badge */}
            {selectedUpgrade.category && (
              <div className="mb-3">
                <span className="inline-block px-2 py-1 bg-gray-700/50 border border-gray-600 text-gray-300 font-orbitron text-[10px] uppercase rounded">
                  {selectedUpgrade.category}
                </span>
              </div>
            )}

            {/* Damage */}
            {selectedUpgrade.damage && (
              <div className="mb-3 pb-3 border-b border-gray-700">
                <p className="text-xs font-orbitron text-gray-500 uppercase mb-1">Damage</p>
                <p className="text-accent-red font-orbitron font-bold text-lg">
                  {selectedUpgrade.damage}
                </p>
              </div>
            )}

            {/* Description */}
            {selectedUpgrade.description && (
              <div className="mb-3 pb-3 border-b border-gray-700">
                <p className="text-xs font-orbitron text-gray-500 uppercase mb-1">Description</p>
                <p className="text-sm text-gray-300 leading-relaxed">
                  {selectedUpgrade.description}
                </p>
              </div>
            )}

            {/* Effect */}
            {selectedUpgrade.effect && (
              <div className="mb-3">
                <p className="text-xs font-orbitron text-gray-500 uppercase mb-1">Effect</p>
                <p className={`text-sm font-orbitron ${
                  selectedUpgrade.isHeroic ? 'text-accent-yellow/90' : 'text-accent-cyan/90'
                }`}>
                  {selectedUpgrade.effect}
                </p>
              </div>
            )}

            {/* Close Button */}
            <div className="mt-4 pt-3 border-t border-gray-700">
              <Button
                variant="ghost"
                onClick={() => setSelectedUpgrade(null)}
                className="w-full text-xs"
              >
                Close
              </Button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Modals */}
      <UpgradeShop isOpen={shopOpen} onClose={() => setShopOpen(false)} />
      <HeroicRewardsModal isOpen={rewardsOpen} onClose={() => setRewardsOpen(false)} />
    </div>
  );
}
