import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, ShoppingCart, Coins, Check, Zap, Award, Lock, Star, Target, Settings } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { useCharacter } from '../../context/CharacterContext';
import { SHOP_CATEGORIES, getUpgradeById } from '../../data/shipShopData';
import { SHIP_UPGRADES } from '../../data/spaceCombatData';
import { canPurchase, hasUpgrade, getAvailableHeroicSlots } from '../../utils/shipUpgrades';
import Button from '../ui/Button';

export default function UpgradeShop({ isOpen, onClose }) {
  const { gameState, updateGameState, addLog } = useGame();
  const { character, updateField } = useCharacter();
  const [activeCategory, setActiveCategory] = useState('galaxyRewards');
  const [purchaseSuccess, setPurchaseSuccess] = useState(null);
  const [selectedReward, setSelectedReward] = useState(null);
  const [rewardClaimed, setRewardClaimed] = useState(false);

  // Handle ESC key to close
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Get player bits from active character
  const playerBits = character?.bits || 0;
  const ship = gameState.ship || {};
  const availableRewardSlots = getAvailableHeroicSlots(ship);

  const handlePurchase = async (upgradeId) => {
    const upgrade = getUpgradeById(upgradeId);
    
    // Check if character exists
    if (!character) {
      addLog('No active character to purchase from', 'error');
      return;
    }
    
    if (!canPurchase(playerBits, upgrade.cost)) {
      addLog(`Not enough Bits to purchase ${upgrade.name}`, 'error');
      return;
    }

    // Deduct bits from character
    try {
      await updateField('bits', playerBits - upgrade.cost);
    } catch (error) {
      console.error('Failed to deduct bits:', error);
      addLog('Failed to complete purchase', 'error');
      return;
    }

    // Add to purchased upgrades or torpedo inventory
    updateGameState((prevState) => {
      const newShip = { ...prevState.ship };

      if (upgrade.category === 'torpedo') {
        // Add to torpedo inventory
        newShip.torpedoInventory = {
          ...newShip.torpedoInventory,
          [upgradeId]: (newShip.torpedoInventory[upgradeId] || 0) + 1,
        };
      } else {
        // Add to purchased upgrades
        if (!newShip.purchasedUpgrades.includes(upgradeId)) {
          newShip.purchasedUpgrades = [...newShip.purchasedUpgrades, upgradeId];
        }
      }

      return { ...prevState, ship: newShip };
    });

    addLog(`Purchased ${upgrade.name} for ${upgrade.cost} Bits`, 'info');
    
    // Show success feedback
    setPurchaseSuccess(upgradeId);
    setTimeout(() => setPurchaseSuccess(null), 2000);
  };

  const category = SHOP_CATEGORIES.find(cat => cat.id === activeCategory);
  const isGalaxyRewardsTab = activeCategory === 'galaxyRewards';

  const handleClaimReward = () => {
    if (!selectedReward || availableRewardSlots === 0) return;

    updateGameState((prevState) => {
      const newShip = {
        ...prevState.ship,
        heroicUpgrades: [...prevState.ship.heroicUpgrades, selectedReward],
      };
      return { ...prevState, ship: newShip };
    });

    const upgradeName = SHIP_UPGRADES[selectedReward].name;
    addLog(`Heroic upgrade installed: ${upgradeName}!`, 'success');

    setRewardClaimed(true);
    setTimeout(() => {
      setRewardClaimed(false);
      setSelectedReward(null);
    }, 2000);
  };

  const modalContent = (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 md:p-12 lg:p-16 animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className={`bg-bg-secondary/95 backdrop-blur-md border-3 w-full h-full max-w-[1000px] max-h-[82vh] overflow-hidden flex flex-col shadow-2xl ${
          isGalaxyRewardsTab ? 'border-violet-400 shadow-violet-400/30' : 'border-accent-cyan shadow-accent-cyan/30'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`border-b-3 p-6 flex items-center justify-between flex-shrink-0 ${
          isGalaxyRewardsTab ? 'border-violet-400/30 bg-gradient-to-r from-violet-500/10 to-transparent' : 'border-accent-cyan/30 bg-gradient-to-r from-accent-cyan/5 to-transparent'
        }`}>
          <div className="flex items-center gap-4">
            {isGalaxyRewardsTab ? (
              <Award className="w-8 h-8 text-violet-400 drop-shadow-glow" />
            ) : (
              <ShoppingCart className="w-8 h-8 text-accent-cyan" />
            )}
            <div>
              <h2 className={`font-orbitron font-black text-2xl md:text-3xl tracking-wider ${
                isGalaxyRewardsTab ? 'text-violet-400' : 'text-accent-cyan text-glow-cyan'
              }`}>
                {isGalaxyRewardsTab ? 'GALAXY REWARDS' : 'UPGRADE SHOP'}
              </h2>
              <p className="text-sm text-gray-400 font-orbitron mt-1">
                {isGalaxyRewardsTab ? 'Heroic Upgrades for Saving the Galaxy' : '"What A Piece Of Junk!"'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {!isGalaxyRewardsTab && (
              <div className="flex items-center gap-3 px-4 py-2 border-3 border-accent-yellow bg-accent-yellow/15 shadow-lg shadow-accent-yellow/20">
                <Coins className="w-5 h-5 text-accent-yellow" />
                <span className="font-orbitron text-accent-yellow font-bold text-lg">
                  {playerBits} Bits
                </span>
              </div>
            )}
            
            {isGalaxyRewardsTab && (
              <div className="flex items-center gap-3 px-4 py-2 border-3 border-violet-400 bg-violet-500/15 shadow-lg shadow-violet-500/20">
                <Star className="w-5 h-5 text-violet-400" />
                <span className="font-orbitron text-violet-400 font-bold text-lg">
                  {availableRewardSlots} Available
                </span>
              </div>
            )}
            
            <button
              onClick={onClose}
              className="p-3 text-gray-400 hover:text-accent-red hover:bg-accent-red/10 border-2 border-transparent hover:border-accent-red transition-all rounded"
              title="Close (ESC)"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="border-b-2 border-gray-700 flex bg-bg-primary/30 flex-shrink-0">
          {SHOP_CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            const isGalaxyTab = cat.id === 'galaxyRewards';
            
            // Define icons for each category
            const getTabIcon = () => {
              switch(cat.id) {
                case 'galaxyRewards': return Award;
                case 'torpedoes': return Zap;
                case 'turrets': return Target;
                case 'misc': return Settings;
                default: return ShoppingCart;
              }
            };
            const TabIcon = getTabIcon();
            
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex-1 px-4 py-4 font-orbitron text-sm transition-all duration-200 relative group ${
                  isActive
                    ? isGalaxyTab
                      ? 'bg-violet-500/20 text-violet-400 border-b-3 border-violet-400'
                      : 'bg-accent-cyan/20 text-accent-cyan border-b-3 border-accent-cyan'
                    : 'text-gray-400 hover:text-text-primary hover:bg-white/5'
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <TabIcon className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                    isActive ? 'animate-pulse' : ''
                  }`} />
                  <span className="hidden sm:inline">{cat.name}</span>
                </div>
                {isActive && (
                  <div className={`absolute bottom-0 left-0 right-0 h-1 ${
                    isGalaxyTab ? 'bg-violet-400' : 'bg-accent-cyan'
                  } shadow-lg ${
                    isGalaxyTab ? 'shadow-violet-500/50' : 'shadow-accent-cyan/50'
                  }`} />
                )}
              </button>
            );
          })}
        </div>

        {/* Category Description */}
        <div className={`px-6 py-4 border-b-2 border-gray-700 flex-shrink-0 ${
          isGalaxyRewardsTab 
            ? 'bg-gradient-to-r from-violet-500/10 to-transparent' 
            : 'bg-bg-primary/50'
        }`}>
          <p className="text-base text-gray-300 font-orbitron">{category.description}</p>
        </div>

        {/* Items Grid */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {isGalaxyRewardsTab ? (
              // Render Galaxy Rewards (Heroic Upgrades)
              Object.entries(SHIP_UPGRADES).map(([upgradeId, upgrade]) => {
                const isUnlocked = hasUpgrade(ship, upgradeId);
                const canClaim = availableRewardSlots > 0 && !isUnlocked;
                const isSelected = selectedReward === upgradeId;

                return (
                  <button
                    key={upgradeId}
                    onClick={() => canClaim && setSelectedReward(upgradeId)}
                    disabled={!canClaim || rewardClaimed}
                    className={`border-3 p-5 transition-all duration-300 flex flex-col group relative overflow-hidden text-left ${
                      isUnlocked
                        ? 'border-violet-400 bg-gradient-to-br from-violet-500/15 to-violet-500/5 cursor-default'
                        : isSelected
                        ? 'border-violet-400 bg-violet-500/20 scale-105 shadow-lg shadow-violet-500/30 cursor-pointer'
                        : canClaim
                        ? 'border-gray-700 bg-gray-900/50 hover:border-violet-400/50 hover:bg-violet-500/5 cursor-pointer'
                        : 'border-gray-700 bg-gray-900/50 cursor-not-allowed opacity-75'
                    } ${rewardClaimed ? 'opacity-50' : ''}`}
                  >
                    {/* Decorative corner accent */}
                    {isUnlocked && (
                      <div className="absolute top-0 right-0 w-16 h-16 bg-violet-500/10 transform rotate-45 translate-x-8 -translate-y-8" />
                    )}
                    {isSelected && (
                      <div className="absolute top-0 right-0 w-16 h-16 bg-violet-500/20 transform rotate-45 translate-x-8 -translate-y-8" />
                    )}
                    
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4 relative z-10">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-orbitron font-bold text-base mb-1 flex items-center gap-2">
                          <span className={isUnlocked ? 'text-violet-400' : isSelected ? 'text-violet-300' : 'text-gray-300'}>
                            {upgrade.name}
                          </span>
                        </h3>
                      </div>
                      
                      {isUnlocked ? (
                        <Star className="w-5 h-5 text-violet-400 fill-violet-400 flex-shrink-0 ml-2" />
                      ) : isSelected ? (
                        <Star className="w-5 h-5 text-violet-400 flex-shrink-0 ml-2" />
                      ) : (
                        <Lock className="w-5 h-5 text-gray-500 flex-shrink-0 ml-2" />
                      )}
                    </div>

                    {/* Description */}
                    <p className={`text-sm mb-4 flex-1 leading-relaxed ${
                      isUnlocked ? 'text-gray-300' : 'text-gray-500'
                    }`}>
                      {upgrade.description}
                    </p>

                    {/* Status Badge */}
                    <div className={`text-center py-3 px-4 rounded transition-all ${
                      isUnlocked 
                        ? 'bg-violet-500/25 text-violet-400 border-2 border-violet-400/70 shadow-lg shadow-violet-500/20' 
                        : isSelected
                        ? 'bg-violet-500/30 text-violet-300 border-2 border-violet-400 shadow-lg shadow-violet-500/30'
                        : canClaim
                        ? 'bg-gray-800/50 text-gray-400 border-2 border-gray-700/50 group-hover:border-violet-400/30'
                        : 'bg-gray-800/50 text-gray-500 border-2 border-gray-700/50'
                    }`}>
                      <p className="text-sm font-orbitron font-bold uppercase tracking-wide">
                        {isUnlocked ? (
                          <span className="flex items-center justify-center gap-2">
                            <Check className="w-5 h-5" />
                            Installed
                          </span>
                        ) : isSelected ? (
                          <span className="flex items-center justify-center gap-2">
                            <Star className="w-5 h-5" />
                            Selected
                          </span>
                        ) : canClaim ? (
                          <span className="flex items-center justify-center gap-2">
                            <Award className="w-5 h-5" />
                            Click to Select
                          </span>
                        ) : (
                          <span className="flex items-center justify-center gap-2">
                            <Lock className="w-5 h-5" />
                            Save Galaxy to Unlock
                          </span>
                        )}
                      </p>
                    </div>
                  </button>
                );
              })
            ) : (
              // Render Shop Items (Original)
              category.items.map((itemId) => {
              const item = getUpgradeById(itemId);
              const owned = gameState.ship.purchasedUpgrades.includes(itemId) || 
                          (gameState.ship.torpedoInventory[itemId] || 0) > 0;
              const torpedoCount = gameState.ship.torpedoInventory[itemId] || 0;
              const canAfford = canPurchase(playerBits, item.cost);
              const justPurchased = purchaseSuccess === itemId;

              return (
                <div
                  key={itemId}
                  className={`border-3 p-5 transition-all duration-300 flex flex-col relative overflow-hidden group ${
                    justPurchased
                      ? 'border-accent-yellow bg-accent-yellow/20 scale-105 shadow-lg shadow-accent-yellow/30'
                      : owned
                      ? 'border-accent-cyan/50 bg-accent-cyan/5'
                      : 'border-gray-700 hover:border-accent-cyan/50 hover:shadow-lg hover:shadow-accent-cyan/10 card-hover'
                  }`}
                >
                  {/* Category Badge */}
                  <div className="absolute top-3 right-3 z-10">
                    {item.category === 'torpedo' && (
                      <div className="px-2 py-1 bg-accent-red/20 border border-accent-red/40 rounded text-xs font-orbitron text-accent-red flex items-center gap-1">
                        <Zap className="w-3 h-3" />
                        Torpedo
                      </div>
                    )}
                    {item.category === 'turret' && (
                      <div className="px-2 py-1 bg-accent-cyan/20 border border-accent-cyan/40 rounded text-xs font-orbitron text-accent-cyan flex items-center gap-1">
                        <Target className="w-3 h-3" />
                        Turret
                      </div>
                    )}
                    {item.category === 'misc' && (
                      <div className="px-2 py-1 bg-gray-600/20 border border-gray-500/40 rounded text-xs font-orbitron text-gray-400 flex items-center gap-1">
                        <Settings className="w-3 h-3" />
                        Misc
                      </div>
                    )}
                  </div>

                  {/* Header: Name */}
                  <div className="mb-3 pr-20">
                    <h3 className="font-orbitron font-bold text-text-primary text-base">
                      {item.name}
                    </h3>
                  </div>

                  {/* Damage & Inventory Display */}
                  <div className="flex items-center gap-2 mb-3">
                    {item.damage && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 text-sm text-accent-red font-orbitron bg-accent-red/15 border border-accent-red/40 rounded shadow-sm">
                        <Zap className="w-3 h-3" />
                        {item.damage}
                      </span>
                    )}
                    {item.category === 'torpedo' && torpedoCount > 0 && (
                      <span className="inline-flex items-center gap-1 px-3 py-1 text-sm text-accent-cyan font-orbitron bg-accent-cyan/15 border border-accent-cyan/40 rounded shadow-sm">
                        Owned: {torpedoCount}
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-300 mb-4 flex-1 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Effect - Stacked above button */}
                  {item.effect && (
                    <div className="mb-4 pb-4 border-b border-gray-700/50">
                      <p className="text-xs mb-1 font-orbitron text-gray-500 uppercase tracking-wider">Effect</p>
                      <p className="text-sm text-accent-cyan font-orbitron">
                        {item.effect}
                      </p>
                    </div>
                  )}

                  {/* Price & Purchase Section */}
                  <div className="flex items-center justify-between gap-3 mt-auto">
                    <div className="flex items-center gap-2 px-3 py-2 bg-accent-yellow/10 border border-accent-yellow/30 rounded">
                      <Coins className="w-4 h-4 text-accent-yellow" />
                      <span className="font-orbitron font-bold text-accent-yellow">
                        {item.cost} Bits
                      </span>
                    </div>
                    
                    <Button
                      variant={canAfford && character ? 'primary' : 'ghost'}
                      onClick={() => handlePurchase(itemId)}
                      disabled={!canAfford || justPurchased || !character}
                      className={`flex-1 px-4 py-2 text-sm ${
                        justPurchased ? 'bg-accent-yellow border-accent-yellow text-bg-primary' : ''
                      }`}
                    >
                      {justPurchased ? (
                        <span className="flex items-center justify-center gap-2">
                          <Check className="w-4 h-4" />
                          Purchased!
                        </span>
                      ) : !character ? (
                        'No Character'
                      ) : canAfford ? (
                        'Purchase'
                      ) : (
                        'Too Expensive'
                      )}
                    </Button>
                  </div>
                </div>
              );
            })
            )}
          </div>
        </div>

        {/* Footer */}
        {isGalaxyRewardsTab && selectedReward && availableRewardSlots > 0 ? (
          <div className="border-t-3 border-violet-400/30 p-4 bg-violet-500/10 flex-shrink-0 flex items-center justify-between">
            <p className="text-sm text-gray-400 font-orbitron">
              {rewardClaimed ? 'Heroic upgrade installed!' : 'Confirm your selection to install the upgrade'}
            </p>
            <Button
              variant="primary"
              onClick={handleClaimReward}
              disabled={rewardClaimed}
              className={`flex items-center gap-2 px-6 ${
                rewardClaimed
                  ? 'bg-violet-500 border-violet-500'
                  : 'border-violet-400 text-violet-400 bg-violet-500/20 hover:bg-violet-500/30 glow-pulse'
              }`}
            >
              {rewardClaimed ? (
                <>
                  <Check className="w-5 h-5" />
                  Installed!
                </>
              ) : (
                <>
                  <Award className="w-5 h-5" />
                  Claim Reward
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="border-t-3 border-gray-700 p-4 bg-bg-primary/50 flex-shrink-0 flex items-center justify-between">
            <p className="text-sm text-gray-500 font-orbitron">
              {isGalaxyRewardsTab 
                ? availableRewardSlots > 0 
                  ? 'Select an upgrade above to claim your reward'
                  : 'Save the galaxy to earn heroic upgrades!'
                : 'Prices are for black market goods - no refunds!'}
            </p>
            <p className="text-xs text-gray-600 font-orbitron">
              Press <kbd className="px-2 py-1 bg-gray-800 border border-gray-700 rounded">ESC</kbd> to close
            </p>
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
