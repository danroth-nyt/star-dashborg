import { useState } from 'react';
import { Ship, Star, Zap, ShoppingCart, Award } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { SHIP_UPGRADES } from '../../data/spaceCombatData';
import { getAllUpgrades, getTotalTorpedoCount, getAvailableHeroicSlots } from '../../utils/shipUpgrades';
import Button from '../ui/Button';
import UpgradeShop from '../ship/UpgradeShop';
import HeroicRewardsModal from '../ship/HeroicRewardsModal';

export default function SpaceCombatShipPanel() {
  const { gameState } = useGame();
  const [shopOpen, setShopOpen] = useState(false);
  const [rewardsOpen, setRewardsOpen] = useState(false);
  
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
            <span className="flex items-center gap-1">
              <Star className="w-3 h-3 text-accent-yellow" />
              {ship.galaxiesSaved}
            </span>
            <span className="flex items-center gap-1">
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
                {ship.heroicUpgrades.map((id) => (
                  <span key={id} className="px-2 py-1 bg-accent-yellow/20 border border-accent-yellow/50 text-accent-yellow font-orbitron text-[10px] rounded">
                    {SHIP_UPGRADES[id]?.name.split(' ')[0]}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {ship.purchasedUpgrades.length > 0 && (
            <div>
              <p className="font-orbitron text-accent-cyan text-[10px] uppercase mb-1">Purchased:</p>
              <div className="flex flex-wrap gap-1">
                {ship.purchasedUpgrades.map((id, idx) => (
                  <span key={`${id}-${idx}`} className="px-2 py-1 bg-accent-cyan/20 border border-accent-cyan/50 text-accent-cyan font-orbitron text-[10px] rounded">
                    {id.split(/(?=[A-Z])/).slice(0, 2).join('')}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      <UpgradeShop isOpen={shopOpen} onClose={() => setShopOpen(false)} />
      <HeroicRewardsModal isOpen={rewardsOpen} onClose={() => setRewardsOpen(false)} />
    </div>
  );
}
