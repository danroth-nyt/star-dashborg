import { useState } from 'react';
import { Ship, Star, Zap, Settings, ShoppingCart, Dices } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { SHIP_UPGRADES } from '../../data/spaceCombatData';
import { getUpgradeById } from '../../data/shipShopData';
import { getAllUpgrades, getTotalTorpedoCount, getAvailableHeroicSlots } from '../../utils/shipUpgrades';
import { generateShipName } from '../../data/oracles';
import Button from '../ui/Button';
import UpgradeShop from './UpgradeShop';

export default function ShipManager() {
  const { gameState, updateGameState } = useGame();
  const [shopOpen, setShopOpen] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState('');
  
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

  // Ship name handlers
  const handleRerollName = () => {
    const newName = generateShipName();
    updateGameState((state) => ({
      ...state,
      ship: { ...state.ship, name: newName }
    }));
  };

  const handleStartEdit = () => {
    setEditedName(ship.name);
    setIsEditingName(true);
  };

  const handleSaveName = () => {
    if (editedName.trim()) {
      updateGameState((state) => ({
        ...state,
        ship: { ...state.ship, name: editedName.trim() }
      }));
    }
    setIsEditingName(false);
  };

  const handleCancelEdit = () => {
    setIsEditingName(false);
    setEditedName('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSaveName();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  return (
    <div className="space-y-4">
      {/* Ship Name and Status */}
      <div className="border-b-2 border-accent-cyan/30 pb-3">
        <div className="flex items-center gap-2 mb-2">
          <Ship className="w-5 h-5 text-accent-cyan flex-shrink-0" />
          {isEditingName ? (
            <input
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              onBlur={handleSaveName}
              onKeyDown={handleKeyDown}
              autoFocus
              className="flex-1 bg-bg-primary border-2 border-accent-cyan text-accent-cyan font-orbitron font-bold text-lg px-2 py-1 focus:outline-none focus:border-accent-yellow"
            />
          ) : (
            <h3 
              onClick={handleStartEdit}
              className="font-orbitron font-bold text-accent-cyan text-lg cursor-pointer hover:text-accent-yellow transition-colors"
              title="Click to edit ship name"
            >
              {ship.name}
            </h3>
          )}
          <button
            onClick={handleRerollName}
            className="flex-shrink-0 p-1.5 text-accent-cyan hover:text-accent-yellow hover:bg-accent-cyan/10 transition-all border-2 border-transparent hover:border-accent-cyan rounded"
            title="Generate new ship name"
          >
            <Dices className="w-4 h-4" />
          </button>
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
          className="flex-1 flex items-center justify-center gap-2 relative"
        >
          <ShoppingCart className="w-4 h-4" />
          Upgrade Shop
          {availableRewards > 0 && (
            <span className="absolute -top-2 -right-2 bg-violet-500 text-white text-xs px-2 py-0.5 rounded-full font-bold shadow-lg shadow-violet-500/50 animate-pulse">
              {availableRewards}
            </span>
          )}
        </Button>
      </div>

      {/* Heroic Upgrades */}
      {ship.heroicUpgrades.length > 0 && (
        <div className="border-3 border-accent-yellow bg-accent-yellow/10 p-3">
          <h4 className="text-xs font-orbitron font-bold text-accent-yellow uppercase mb-2 flex items-center gap-2">
            <Star className="w-4 h-4" />
            Heroic Upgrades
          </h4>
          <div className="space-y-3">
            {ship.heroicUpgrades.map((upgradeId) => {
              const upgrade = SHIP_UPGRADES[upgradeId];
              return (
                <div key={upgradeId} className="border-l-2 border-accent-yellow pl-2">
                  <div className="flex items-start gap-2">
                    <span className="text-accent-yellow mt-0.5">›</span>
                    <div className="flex-1">
                      <p className="text-sm text-accent-yellow font-orbitron font-bold">
                        {upgrade?.name || upgradeId}
                      </p>
                      {upgrade?.description && (
                        <p className="text-xs text-gray-300 mt-1">
                          {upgrade.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Purchased Upgrades */}
      {ship.purchasedUpgrades.length > 0 && (
        <div className="border-3 border-accent-cyan bg-accent-cyan/10 p-3">
          <h4 className="text-xs font-orbitron font-bold text-accent-cyan uppercase mb-2 flex items-center gap-2">
            <ShoppingCart className="w-4 h-4" />
            Purchased Upgrades
          </h4>
          <div className="space-y-3">
            {ship.purchasedUpgrades.map((upgradeId, index) => {
              const upgrade = getUpgradeById(upgradeId);
              return (
                <div key={`${upgradeId}-${index}`} className="border-l-2 border-accent-cyan pl-2">
                  <div className="flex items-start gap-2">
                    <span className="text-accent-cyan mt-0.5">›</span>
                    <div className="flex-1">
                      <p className="text-sm text-accent-cyan font-orbitron font-bold">
                        {upgrade?.name || upgradeId}
                      </p>
                      {upgrade?.description && (
                        <p className="text-xs text-gray-300 mt-1">
                          {upgrade.description}
                        </p>
                      )}
                      {upgrade?.effect && (
                        <p className="text-xs text-accent-cyan/80 mt-1 italic">
                          Effect: {upgrade.effect}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Torpedo Inventory */}
      {torpedoCount > 0 && (
        <div className="border-3 border-gray-700 bg-bg-primary/50 p-3">
          <h4 className="text-xs font-orbitron font-bold text-gray-400 uppercase mb-2 flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Torpedo Inventory
          </h4>
          <div className="space-y-2">
            {Object.entries(ship.torpedoInventory).map(([type, count]) => {
              if (count === 0) return null;
              const torpedo = getUpgradeById(type);
              return (
                <div key={type} className="border-l-2 border-gray-600 pl-2">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <p className="text-sm text-text-primary font-orbitron">
                        {torpedo?.name || type}
                      </p>
                      {torpedo?.damage && (
                        <p className="text-xs text-accent-red mt-0.5">
                          {torpedo.damage} damage
                        </p>
                      )}
                    </div>
                    <span className="text-accent-cyan font-orbitron font-bold ml-2">
                      ×{count}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Turbo Laser Configuration */}
      {allUpgrades.includes('turboLasers') && (
        <div className="border-3 border-accent-red bg-accent-red/10 p-3">
          <h4 className="text-xs font-orbitron font-bold text-accent-red uppercase mb-2">
            Turbo Laser Configuration
          </h4>
          {ship.turboLaserStation ? (
            <div className="space-y-2">
              <p className="text-sm text-text-primary">
                Assigned to: <span className="text-accent-red font-orbitron font-bold">
                  {ship.turboLaserStation === 'gunner1' ? 'Gunner 1' : 'Gunner 2'}
                </span>
              </p>
              <p className="text-xs text-gray-400">
                This gunner deals D8 damage instead of D6
              </p>
              <Button
                onClick={() => {
                  updateGameState((state) => ({
                    ...state,
                    ship: { ...state.ship, turboLaserStation: null }
                  }));
                }}
                variant="secondary"
                size="sm"
                className="w-full mt-2"
              >
                Reconfigure
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-xs text-gray-400 mb-3">
                Choose which gunner station gets upgraded damage (D8 instead of D6):
              </p>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={() => {
                    updateGameState((state) => ({
                      ...state,
                      ship: { ...state.ship, turboLaserStation: 'gunner1' }
                    }));
                  }}
                  variant="primary"
                  size="sm"
                >
                  Gunner 1
                </Button>
                <Button
                  onClick={() => {
                    updateGameState((state) => ({
                      ...state,
                      ship: { ...state.ship, turboLaserStation: 'gunner2' }
                    }));
                  }}
                  variant="primary"
                  size="sm"
                >
                  Gunner 2
                </Button>
              </div>
            </div>
          )}
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
      <UpgradeShop 
        isOpen={shopOpen} 
        onClose={() => setShopOpen(false)}
      />
    </div>
  );
}
