import { useState } from 'react';
import { Ship, Star, Zap, Settings, ShoppingCart, Award } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { SHIP_UPGRADES } from '../../data/spaceCombatData';
import { getAllUpgrades, getTotalTorpedoCount, getAvailableHeroicSlots } from '../../utils/shipUpgrades';
import Button from '../ui/Button';
import UpgradeShop from './UpgradeShop';
import HeroicRewardsModal from './HeroicRewardsModal';

export default function ShipManager() {
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

  const getUpgradeName = (upgradeId) => {
    return SHIP_UPGRADES[upgradeId]?.name || upgradeId;
  };

  return (
    <div className="space-y-4">
      {/* Ship Name and Status */}
      <div className="border-b-2 border-accent-cyan/30 pb-3">
        <div className="flex items-center gap-2 mb-2">
          <Ship className="w-5 h-5 text-accent-cyan" />
          <h3 className="font-orbitron font-bold text-accent-cyan text-lg">
            {ship.name}
          </h3>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-400">
          <span className="flex items-center gap-1">
            <Star className="w-4 h-4 text-accent-yellow" />
            {ship.galaxiesSaved} Galaxies Saved
          </span>
          <span className="flex items-center gap-1">
            <Settings className="w-4 h-4 text-accent-cyan" />
            {allUpgrades.length} Upgrades
          </span>
          <span className="flex items-center gap-1">
            <Zap className="w-4 h-4 text-accent-yellow" />
            {torpedoCount} Torpedoes
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button
          variant="primary"
          onClick={() => setShopOpen(true)}
          className="flex-1 flex items-center justify-center gap-2"
        >
          <ShoppingCart className="w-4 h-4" />
          Upgrade Shop
        </Button>
        
        {availableRewards > 0 && (
          <Button
            variant="secondary"
            onClick={() => setRewardsOpen(true)}
            className="flex-1 flex items-center justify-center gap-2 glow-pulse-yellow border-accent-yellow text-accent-yellow"
          >
            <Award className="w-4 h-4" />
            Claim Reward ({availableRewards})
          </Button>
        )}
      </div>

      {/* Heroic Upgrades */}
      {ship.heroicUpgrades.length > 0 && (
        <div className="border-3 border-accent-yellow bg-accent-yellow/10 p-3">
          <h4 className="text-xs font-orbitron font-bold text-accent-yellow uppercase mb-2 flex items-center gap-2">
            <Star className="w-4 h-4" />
            Heroic Upgrades
          </h4>
          <ul className="space-y-1">
            {ship.heroicUpgrades.map((upgradeId) => (
              <li key={upgradeId} className="text-sm text-text-primary flex items-start gap-2">
                <span className="text-accent-yellow">›</span>
                <span>{getUpgradeName(upgradeId)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Purchased Upgrades */}
      {ship.purchasedUpgrades.length > 0 && (
        <div className="border-3 border-accent-cyan bg-accent-cyan/10 p-3">
          <h4 className="text-xs font-orbitron font-bold text-accent-cyan uppercase mb-2 flex items-center gap-2">
            <ShoppingCart className="w-4 h-4" />
            Purchased Upgrades
          </h4>
          <ul className="space-y-1">
            {ship.purchasedUpgrades.map((upgradeId, index) => (
              <li key={`${upgradeId}-${index}`} className="text-sm text-text-primary flex items-start gap-2">
                <span className="text-accent-cyan">›</span>
                <span>{upgradeId}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Torpedo Inventory */}
      {torpedoCount > 0 && (
        <div className="border-3 border-gray-700 bg-bg-primary/50 p-3">
          <h4 className="text-xs font-orbitron font-bold text-gray-400 uppercase mb-2 flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Torpedo Inventory
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(ship.torpedoInventory).map(([type, count]) => (
              count > 0 && (
                <div key={type} className="flex justify-between items-center text-sm">
                  <span className="text-gray-400 capitalize">{type}:</span>
                  <span className="text-accent-cyan font-orbitron">{count}</span>
                </div>
              )
            ))}
          </div>
        </div>
      )}

      {/* Turbo Laser Configuration */}
      {ship.turboLaserStation && (
        <div className="border-3 border-accent-red bg-accent-red/10 p-3">
          <h4 className="text-xs font-orbitron font-bold text-accent-red uppercase mb-1">
            Turbo Laser Configuration
          </h4>
          <p className="text-sm text-text-primary">
            Station: <span className="text-accent-red font-orbitron">{ship.turboLaserStation}</span>
          </p>
        </div>
      )}

      {/* No Upgrades Message */}
      {allUpgrades.length === 0 && (
        <div className="text-center py-6 text-gray-500 text-sm">
          <Ship className="w-12 h-12 mx-auto mb-2 opacity-30" />
          <p>No upgrades installed yet.</p>
          <p className="text-xs mt-1">Visit the shop or complete missions!</p>
        </div>
      )}

      {/* Modals */}
      <UpgradeShop isOpen={shopOpen} onClose={() => setShopOpen(false)} />
      <HeroicRewardsModal isOpen={rewardsOpen} onClose={() => setRewardsOpen(false)} />
    </div>
  );
}
