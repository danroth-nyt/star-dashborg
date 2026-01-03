import { useEffect, useRef, useState } from 'react';
import { Shield, ShieldAlert, ShieldOff, AlertTriangle, Zap, Rocket, Star, Ship, Dices, ShoppingCart } from 'lucide-react';
import { useSpaceCombat } from '../../context/SpaceCombatContext';
import { useGame } from '../../context/GameContext';
import { useParty } from '../../context/PartyContext';
import { ARMOR_TIERS } from '../../data/spaceCombatData';
import { getMaxArmorTier, hasUpgrade, getAvailableHeroicSlots } from '../../utils/shipUpgrades';
import { useSoundEffects } from '../../hooks/useSoundEffects';
import { generateShipName } from '../../data/oracles';
import { getAssetPath } from '../../lib/assetPath';
import UpgradeShop from '../ship/UpgradeShop';
import Button from '../ui/Button';

export default function ShipStatus() {
  const { spaceCombat, modifyArmor, chargeHyperdrive, decrementHyperdrive } = useSpaceCombat();
  const { gameState, updateGameState } = useGame();
  const { partyMembers } = useParty();
  const { play } = useSoundEffects();
  const { shipArmor, hyperdriveCharge } = spaceCombat;
  const ship = gameState.ship || { 
    name: 'The Rebel Corvette',
    heroicUpgrades: [], 
    purchasedUpgrades: [],
    turboLaserStation: null 
  };
  
  const prevArmorRef = useRef(shipArmor);
  const alarmAudioRef = useRef(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [shopOpen, setShopOpen] = useState(false);

  const armorTier = ARMOR_TIERS.find(t => t.tier === shipArmor);
  const availableRewards = getAvailableHeroicSlots(ship);

  // Play critical alarm when armor drops to 0
  useEffect(() => {
    if (shipArmor === 0 && prevArmorRef.current > 0) {
      if (!alarmAudioRef.current) {
        alarmAudioRef.current = new Audio(getAssetPath('sounds/alarm-critical.mp3'));
        alarmAudioRef.current.loop = true;
        alarmAudioRef.current.volume = 0.4;
      }
      alarmAudioRef.current.play().catch(() => {});
    } else if (shipArmor > 0 && alarmAudioRef.current) {
      alarmAudioRef.current.pause();
      alarmAudioRef.current.currentTime = 0;
    }
    
    prevArmorRef.current = shipArmor;
  }, [shipArmor]);

  // Cleanup alarm on unmount
  useEffect(() => {
    return () => {
      if (alarmAudioRef.current) {
        alarmAudioRef.current.pause();
        alarmAudioRef.current = null;
      }
    };
  }, []);

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

  // Get shield icon based on armor tier
  const ShieldIcon = shipArmor === 0 ? ShieldOff : shipArmor === 1 ? ShieldAlert : Shield;

  // Get shield color based on armor tier
  const getShieldColor = () => {
    if (shipArmor === 0) return 'text-accent-red';
    if (shipArmor === 1) return 'text-accent-yellow';
    return 'text-accent-cyan';
  };

  const getGlowClass = () => {
    if (shipArmor === 0) return 'glow-pulse-red';
    if (shipArmor === 1) return 'glow-pulse-yellow';
    return 'glow-pulse-cyan';
  };

  return (
    <div className="bg-bg-secondary/80 backdrop-blur-sm border-3 border-accent-cyan p-4 xl:p-5 space-y-4">
      {/* Ship Name Header with Icon Buttons */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <Ship className="w-5 h-5 xl:w-6 xl:h-6 text-accent-cyan flex-shrink-0" />
          {isEditingName ? (
            <input
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              onBlur={handleSaveName}
              onKeyDown={handleKeyDown}
              autoFocus
              className="flex-1 min-w-0 bg-bg-primary border-2 border-accent-cyan text-accent-cyan font-orbitron font-bold text-base xl:text-lg px-2 py-1 focus:outline-none focus:border-accent-yellow uppercase"
            />
          ) : (
            <h2 
              onClick={handleStartEdit}
              className="font-orbitron font-bold text-accent-cyan text-base xl:text-lg uppercase cursor-pointer hover:text-accent-yellow transition-colors truncate"
              title="Click to edit ship name"
            >
              {ship.name}
            </h2>
          )}
        </div>
        
        {/* Icon Buttons */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={handleRerollName}
            className="p-1.5 text-accent-cyan hover:text-accent-yellow hover:bg-accent-cyan/10 transition-all border-2 border-transparent hover:border-accent-cyan rounded"
            title="Generate new ship name"
          >
            <Dices className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShopOpen(true)}
            className="relative p-1.5 text-accent-cyan hover:text-accent-yellow hover:bg-accent-cyan/10 transition-all border-2 border-transparent hover:border-accent-cyan rounded"
            title="Open upgrade shop"
          >
            <ShoppingCart className="w-4 h-4" />
            {availableRewards > 0 && (
              <span className="absolute -top-1 -right-1 bg-violet-500 text-white text-[10px] px-1 rounded-full font-bold shadow-lg shadow-violet-500/50 animate-pulse leading-none">
                {availableRewards}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Compact Armor Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-center gap-4">
          {/* Compact Shield Visual */}
          <div className="relative flex items-center justify-center">
            <div className={`absolute inset-0 flex items-center justify-center ${shipArmor > 0 ? 'shield-active' : ''}`}>
              <div className={`w-20 h-20 rounded-full border-2 ${shipArmor === 3 ? 'border-accent-cyan' : shipArmor === 2 ? 'border-accent-cyan/60' : shipArmor === 1 ? 'border-accent-yellow/60' : 'border-accent-red/60'} ${shipArmor > 0 ? 'shield-pulse' : ''}`}></div>
            </div>
            <ShieldIcon className={`w-16 h-16 ${getShieldColor()} ${shipArmor > 0 ? getGlowClass() : ''} relative z-10`} />
          </div>
          
          {/* Armor Info */}
          <div className="flex-1 space-y-1">
            <div className="flex items-baseline gap-3">
              <span className={`text-2xl font-orbitron font-bold ${getShieldColor()}`}>
                Tier {shipArmor}
              </span>
              <span className={`text-lg font-orbitron font-bold ${getShieldColor()}`}>
                {armorTier.damage > 0 ? `-D${armorTier.damage}` : '-D0'}
              </span>
            </div>
            <div className="text-xs text-gray-500 font-orbitron">
              MAX: Tier {getMaxArmorTier(ship)}
              {getMaxArmorTier(ship) === 3 && (
                <span className="ml-1 text-accent-yellow">(Overcharged)</span>
              )}
            </div>
          </div>
        </div>

        {/* Horizontal Armor Bar */}
        <div className="space-y-1">
          <div className="flex gap-1">
            {Array.from({ length: getMaxArmorTier(ship) }, (_, i) => i).map((tier) => (
              <div
                key={tier}
                className={`flex-1 h-2 border-2 transition-all rounded-sm ${
                  tier < shipArmor
                    ? shipArmor === 1
                      ? 'bg-accent-yellow border-accent-yellow'
                      : shipArmor === 3
                      ? 'bg-accent-yellow border-accent-yellow'
                      : 'bg-accent-cyan border-accent-cyan'
                    : 'border-gray-600 bg-transparent'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Armor Controls */}
        <div className="flex gap-2">
          <button
            onClick={() => modifyArmor(-1)}
            disabled={shipArmor === 0}
            className="flex-1 px-3 py-1.5 bg-accent-red/20 border-2 border-accent-red text-accent-red font-orbitron text-xs hover:bg-accent-red hover:text-bg-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            - Tier
          </button>
          <button
            onClick={() => modifyArmor(1)}
            disabled={shipArmor >= getMaxArmorTier(ship)}
            className="flex-1 px-3 py-1.5 bg-accent-cyan/20 border-2 border-accent-cyan text-accent-cyan font-orbitron text-xs hover:bg-accent-cyan hover:text-bg-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            + Tier
          </button>
        </div>

        {/* Armor Warning */}
        {shipArmor === 0 && (
          <div className="border-2 border-accent-red bg-accent-red/10 p-2 inline-alert-pulse">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-accent-red flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-accent-red text-xs font-orbitron font-bold uppercase">
                  SHIELDS DOWN
                </p>
                <p className="text-text-primary text-xs">
                  No damage reduction! Repair immediately!
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Active Ship Upgrades with Turbo Laser Config */}
      {(hasUpgrade(ship, 'overchargeShields') || hasUpgrade(ship, 'boosterRockets') || 
        hasUpgrade(ship, 'torpedoWinch') || hasUpgrade(ship, 'turboLasers')) && (
        <div className="border-2 border-accent-yellow/40 bg-accent-yellow/5 p-3 space-y-2">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-accent-yellow" />
            <p className="text-xs font-orbitron font-bold uppercase text-accent-yellow">
              Active Upgrades
            </p>
          </div>
          <div className="space-y-1.5">
            {hasUpgrade(ship, 'overchargeShields') && (
              <div className="text-xs text-gray-300 font-mono flex items-start gap-2">
                <span className="text-accent-cyan">›</span>
                <span>Overcharge Shields: Max Tier 3</span>
              </div>
            )}
            {hasUpgrade(ship, 'boosterRockets') && (
              <div className="text-xs text-gray-300 font-mono flex items-start gap-2">
                <span className="text-accent-cyan">›</span>
                <span>Booster Rockets: Steady affects D2 attacks</span>
              </div>
            )}
            {hasUpgrade(ship, 'torpedoWinch') && (
              <div className="text-xs text-gray-300 font-mono flex items-start gap-2">
                <span className="text-accent-cyan">›</span>
                <span>Torpedo Winch: Any station can load</span>
              </div>
            )}
            {hasUpgrade(ship, 'turboLasers') && (
              <div className="space-y-2">
                <div className="text-xs text-gray-300 font-mono flex items-start gap-2">
                  <span className="text-accent-cyan">›</span>
                  <span>Turbo Lasers: {ship.turboLaserStation ? `${ship.turboLaserStation === 'gunner1' ? 'Gunner 1' : 'Gunner 2'} deals D8` : 'Not configured'}</span>
                </div>
                {!ship.turboLaserStation && (
                  <div className="ml-4 flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => {
                        updateGameState((state) => ({
                          ...state,
                          ship: { ...state.ship, turboLaserStation: 'gunner1' }
                        }));
                      }}
                      className="flex-1 text-xs px-2 py-1 border-accent-red text-accent-red hover:bg-accent-red hover:text-bg-primary"
                    >
                      Gunner 1
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => {
                        updateGameState((state) => ({
                          ...state,
                          ship: { ...state.ship, turboLaserStation: 'gunner2' }
                        }));
                      }}
                      className="flex-1 text-xs px-2 py-1 border-accent-red text-accent-red hover:bg-accent-red hover:text-bg-primary"
                    >
                      Gunner 2
                    </Button>
                  </div>
                )}
                {ship.turboLaserStation && (
                  <div className="ml-4">
                    <button
                      onClick={() => {
                        updateGameState((state) => ({
                          ...state,
                          ship: { ...state.ship, turboLaserStation: null }
                        }));
                      }}
                      className="text-[10px] text-gray-400 hover:text-accent-yellow transition-colors underline"
                    >
                      Reconfigure
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Hyperdrive Section */}
      <div className={`border-2 p-3 transition-all ${
        hyperdriveCharge === 3
          ? 'border-accent-yellow bg-accent-yellow/10'
          : hyperdriveCharge > 0
          ? 'border-accent-yellow/60 bg-accent-yellow/5'
          : 'border-gray-600 bg-gray-900/30'
      }`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Rocket className={`w-4 h-4 ${
              hyperdriveCharge === 3 ? 'text-accent-yellow' :
              hyperdriveCharge > 0 ? 'text-accent-yellow/80' :
              'text-gray-500'
            }`} />
            <p className={`text-xs font-orbitron font-bold uppercase ${
              hyperdriveCharge === 3 ? 'text-accent-yellow' :
              hyperdriveCharge > 0 ? 'text-accent-yellow/80' :
              'text-gray-500'
            }`}>
              Hyperdrive {hyperdriveCharge === 3 ? 'Ready' : hyperdriveCharge > 0 ? 'Charging' : 'Idle'}
            </p>
          </div>
          <span className={`font-orbitron text-sm ${
            hyperdriveCharge === 3 ? 'text-accent-yellow' :
            hyperdriveCharge > 0 ? 'text-accent-yellow/80' :
            'text-gray-500'
          }`}>
            {hyperdriveCharge}/3
          </span>
        </div>
        
        {/* Charge progress bar */}
        <div className="flex gap-1 mb-2">
          {[1, 2, 3].map((charge) => (
            <div
              key={charge}
              className={`flex-1 h-2 border-2 transition-all rounded-sm ${
                charge <= hyperdriveCharge
                  ? hyperdriveCharge === 3
                    ? 'bg-accent-yellow border-accent-yellow hyperdrive-charge-pulse'
                    : 'bg-accent-yellow/80 border-accent-yellow/80'
                  : 'border-gray-600 bg-transparent'
              }`}
            />
          ))}
        </div>

        {/* Manual Controls */}
        <div className="flex gap-2">
          <button
            onClick={() => decrementHyperdrive()}
            disabled={hyperdriveCharge === 0}
            className="flex-1 px-3 py-1.5 bg-accent-red/20 border-2 border-accent-red text-accent-red font-orbitron text-xs hover:bg-accent-red hover:text-bg-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            - Charge
          </button>
          <button
            onClick={() => {
              chargeHyperdrive();
              play('hyperdriveCharge', 0.5);
            }}
            disabled={hyperdriveCharge >= 3}
            className="flex-1 px-3 py-1.5 bg-accent-yellow/20 border-2 border-accent-yellow text-accent-yellow font-orbitron text-xs hover:bg-accent-yellow hover:text-bg-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            + Charge
          </button>
        </div>

        {hyperdriveCharge === 3 && (
          <>
            <p className="text-accent-yellow text-xs mt-2 font-orbitron text-center animate-pulse">
              ⚡ READY TO JUMP! ⚡
            </p>
            <p className="text-accent-red text-xs mt-1 font-orbitron text-center">
              ⚠️ 4+ enemies = ship destroyed
            </p>
          </>
        )}
      </div>

      {/* Quick Stats Footer */}
      <div className="border-t border-gray-700 pt-3">
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-gray-400 font-orbitron">
          <span className="flex items-center gap-1">
            <span className="text-accent-cyan">•</span>
            Crew: {partyMembers?.length || 0} Rebel{(partyMembers?.length || 0) !== 1 ? 's' : ''}
          </span>
          <span className="flex items-center gap-1">
            <span className="text-accent-cyan">•</span>
            Stations: {Object.values(spaceCombat.stationAssignments || {}).filter(Boolean).length}/6
          </span>
          <span className="flex items-center gap-1">
            <span className="text-accent-cyan">•</span>
            Torpedoes: {spaceCombat.torpedoesLoaded || 0}
          </span>
        </div>
      </div>

      {/* Shop Modal */}
      <UpgradeShop 
        isOpen={shopOpen} 
        onClose={() => setShopOpen(false)}
      />
    </div>
  );
}
