import { useEffect, useRef } from 'react';
import { Shield, ShieldAlert, ShieldOff, AlertTriangle, Zap, Rocket, Star } from 'lucide-react';
import { useSpaceCombat } from '../../context/SpaceCombatContext';
import { useGame } from '../../context/GameContext';
import { ARMOR_TIERS } from '../../data/spaceCombatData';
import { getMaxArmorTier, hasUpgrade } from '../../utils/shipUpgrades';
import { useSoundEffects } from '../../hooks/useSoundEffects';

export default function ShipStatus() {
  const { spaceCombat, modifyArmor, chargeHyperdrive, decrementHyperdrive } = useSpaceCombat();
  const { gameState } = useGame();
  const { play } = useSoundEffects();
  const { shipArmor, hyperdriveCharge } = spaceCombat;
  const ship = gameState.ship || { heroicUpgrades: [], purchasedUpgrades: [] };
  const prevArmorRef = useRef(shipArmor);
  const alarmAudioRef = useRef(null);

  const armorTier = ARMOR_TIERS.find(t => t.tier === shipArmor);

  // Play critical alarm when armor drops to 0
  useEffect(() => {
    if (shipArmor === 0 && prevArmorRef.current > 0) {
      if (!alarmAudioRef.current) {
        alarmAudioRef.current = new Audio('/sounds/alarm-critical.mp3');
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

  // Get shield icon based on armor tier
  const getShieldIcon = () => {
    if (shipArmor === 0) return ShieldOff;
    if (shipArmor === 1) return ShieldAlert;
    return Shield;
  };

  const ShieldIcon = getShieldIcon();

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
    <div className="bg-bg-secondary/80 backdrop-blur-sm border-3 border-accent-cyan p-4 space-y-4">
      <h2 className="font-orbitron font-bold text-accent-cyan text-lg uppercase text-center">
        Ship Status
      </h2>

      {/* Ship Visual Representation */}
      <div className="relative flex items-center justify-center py-6">
        {/* Shield effect layers */}
        <div className={`absolute inset-0 flex items-center justify-center ${shipArmor > 0 ? 'shield-active' : ''}`}>
          <div className={`w-40 h-40 rounded-full border-2 ${shipArmor === 3 ? 'border-accent-cyan' : shipArmor === 2 ? 'border-accent-cyan/60' : shipArmor === 1 ? 'border-accent-yellow/60' : 'border-accent-red/60'} ${shipArmor > 0 ? 'shield-pulse' : ''}`}></div>
        </div>
        
        {/* Ship icon in center */}
        <div className="relative z-10">
          <ShieldIcon className={`w-24 h-24 ${getShieldColor()} ${shipArmor > 0 ? getGlowClass() : ''}`} />
        </div>
      </div>

      {/* Armor Tier Display */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-400 font-orbitron">ARMOR TIER:</span>
          <span className={`text-xl font-orbitron font-bold ${getShieldColor()}`}>
            {armorTier.name}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-400 font-orbitron">DAMAGE REDUCTION:</span>
          <span className={`text-lg font-orbitron font-bold ${getShieldColor()}`}>
            {armorTier.damage > 0 ? `-D${armorTier.damage}` : 'NONE'}
          </span>
        </div>

        {/* Visual armor tier indicator */}
        <div className="flex gap-1 mt-3">
          {Array.from({ length: getMaxArmorTier(ship) }, (_, i) => i).map((tier) => (
            <div
              key={tier}
              className={`flex-1 h-3 border-2 transition-all ${
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

        {/* Max Armor Tier Display */}
        <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-700/50">
          <span className="text-xs text-gray-500 font-orbitron">MAX TIER:</span>
          <span className={`text-sm font-orbitron font-bold ${
            getMaxArmorTier(ship) === 3 ? 'text-accent-yellow' : 'text-accent-cyan'
          }`}>
            Tier {getMaxArmorTier(ship)}
            {getMaxArmorTier(ship) === 3 && (
              <span className="ml-1 text-xs">(Overcharged)</span>
            )}
          </span>
        </div>
      </div>

      {/* Active Ship Upgrades */}
      {(hasUpgrade(ship, 'overchargeShields') || hasUpgrade(ship, 'boosterRockets') || 
        hasUpgrade(ship, 'torpedoWinch') || hasUpgrade(ship, 'turboLasers')) && (
        <div className="border-2 border-accent-yellow/40 bg-accent-yellow/5 p-3 space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <Star className="w-4 h-4 text-accent-yellow" />
            <p className="text-xs font-orbitron font-bold uppercase text-accent-yellow">
              Active Upgrades
            </p>
          </div>
          <div className="space-y-1">
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
              <div className="text-xs text-gray-300 font-mono flex items-start gap-2">
                <span className="text-accent-cyan">›</span>
                <span>Turbo Lasers: {ship.turboLaserStation ? `${ship.turboLaserStation} deals D8` : 'Not configured'}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Armor Warning */}
      {shipArmor === 0 && (
        <div className="border-3 border-accent-red bg-accent-red/10 p-3 inline-alert-pulse">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-accent-red flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-accent-red text-xs font-orbitron font-bold uppercase">
                SHIELDS DOWN
              </p>
              <p className="text-text-primary text-xs mt-1">
                No damage reduction! Repair shields immediately!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Armor Manual Controls */}
      <div className="border-t border-gray-700 pt-3 space-y-2">
        <p className="text-xs text-gray-500 font-orbitron uppercase text-center">
          Armor Controls
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => modifyArmor(-1)}
            disabled={shipArmor === 0}
            className="flex-1 px-3 py-2 bg-accent-red/20 border-2 border-accent-red text-accent-red font-orbitron text-xs hover:bg-accent-red hover:text-bg-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            - Tier
          </button>
          <button
            onClick={() => modifyArmor(1)}
            disabled={shipArmor >= getMaxArmorTier(ship)}
            className="flex-1 px-3 py-2 bg-accent-cyan/20 border-2 border-accent-cyan text-accent-cyan font-orbitron text-xs hover:bg-accent-cyan hover:text-bg-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            + Tier
          </button>
        </div>
      </div>

      {/* Hyperdrive Charge Status - Always Visible */}
      <div className={`border-3 p-3 transition-all ${
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
              {hyperdriveCharge === 3 ? 'Hyperdrive Ready' : hyperdriveCharge > 0 ? 'Hyperdrive Charging' : 'Hyperdrive Idle'}
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
        <div className="flex gap-1 mb-3">
          {[1, 2, 3].map((charge) => (
            <div
              key={charge}
              className={`flex-1 h-2 border-2 transition-all ${
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
            className="flex-1 px-3 py-2 bg-accent-red/20 border-2 border-accent-red text-accent-red font-orbitron text-xs hover:bg-accent-red hover:text-bg-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            - Charge
          </button>
          <button
            onClick={() => {
              chargeHyperdrive();
              play('hyperdriveCharge', 0.5);
            }}
            disabled={hyperdriveCharge >= 3}
            className="flex-1 px-3 py-2 bg-accent-yellow/20 border-2 border-accent-yellow text-accent-yellow font-orbitron text-xs hover:bg-accent-yellow hover:text-bg-primary transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          >
            + Charge
          </button>
        </div>

        {hyperdriveCharge === 3 && (
          <p className="text-accent-yellow text-xs mt-2 font-orbitron text-center animate-pulse">
            ⚡ READY TO JUMP! ⚡
          </p>
        )}
        
        {hyperdriveCharge === 3 && (
          <p className="text-accent-red text-xs mt-1 font-orbitron text-center">
            ⚠️ 4+ enemies = ship destroyed
          </p>
        )}
      </div>
    </div>
  );
}
