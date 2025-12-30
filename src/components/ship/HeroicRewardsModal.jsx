import { useState } from 'react';
import { X, Award, Star, Check } from 'lucide-react';
import { useGame } from '../../context/GameContext';
import { SHIP_UPGRADES } from '../../data/spaceCombatData';
import { hasUpgrade } from '../../utils/shipUpgrades';
import Button from '../ui/Button';

export default function HeroicRewardsModal({ isOpen, onClose }) {
  const { gameState, updateGameState, addLog } = useGame();
  const [selectedUpgrade, setSelectedUpgrade] = useState(null);
  const [claimed, setClaimed] = useState(false);

  if (!isOpen) return null;

  const ship = gameState.ship;
  const availableUpgrades = Object.entries(SHIP_UPGRADES).filter(
    ([id]) => !hasUpgrade(ship, id)
  );

  const handleClaim = () => {
    if (!selectedUpgrade) return;

    updateGameState((prevState) => {
      const newShip = {
        ...prevState.ship,
        heroicUpgrades: [...prevState.ship.heroicUpgrades, selectedUpgrade],
      };
      return { ...prevState, ship: newShip };
    });

    const upgradeName = SHIP_UPGRADES[selectedUpgrade].name;
    addLog(`Heroic upgrade installed: ${upgradeName}!`, 'success');

    setClaimed(true);
    setTimeout(() => {
      setClaimed(false);
      setSelectedUpgrade(null);
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-bg-secondary border-3 border-accent-yellow max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="border-b-3 border-accent-yellow/30 p-4 bg-accent-yellow/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Award className="w-8 h-8 text-accent-yellow glow-pulse-yellow" />
              <div>
                <h2 className="font-orbitron font-bold text-accent-yellow text-2xl">
                  GALAXY SAVED!
                </h2>
                <p className="text-sm text-gray-400 font-orbitron">
                  Choose one heroic upgrade for your ship
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-accent-red transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Celebration Message */}
        <div className="p-4 bg-gradient-to-b from-accent-yellow/20 to-transparent border-b-2 border-gray-700">
          <p className="text-center text-text-primary font-orbitron">
            Your heroic actions have earned you the right to install{' '}
            <span className="text-accent-yellow font-bold">
              special modifications
            </span>{' '}
            to your ship!
          </p>
        </div>

        {/* Upgrades List */}
        <div className="flex-1 overflow-y-auto p-4">
          {availableUpgrades.length === 0 ? (
            <div className="text-center py-12">
              <Star className="w-16 h-16 mx-auto mb-4 text-accent-yellow opacity-50" />
              <p className="text-gray-400 font-orbitron">
                All heroic upgrades have been installed!
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Your ship is fully upgraded with heroic modifications.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableUpgrades.map(([id, upgrade]) => {
                const isSelected = selectedUpgrade === id;

                return (
                  <button
                    key={id}
                    onClick={() => setSelectedUpgrade(id)}
                    disabled={claimed}
                    className={`border-3 p-4 text-left transition-all ${
                      isSelected
                        ? 'border-accent-yellow bg-accent-yellow/20 scale-105 glow-yellow'
                        : 'border-gray-700 hover:border-accent-yellow/50 hover:bg-accent-yellow/5'
                    } ${claimed ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-orbitron font-bold text-text-primary">
                        {upgrade.name}
                      </h3>
                      {isSelected && (
                        <Star className="w-5 h-5 text-accent-yellow fill-accent-yellow" />
                      )}
                    </div>

                    <p className="text-sm text-gray-400 mb-3">
                      {upgrade.description}
                    </p>

                    <div className="flex items-center gap-2 text-xs text-accent-cyan">
                      <span className="opacity-70">Effect:</span>
                      <span className="font-orbitron">{upgrade.effect}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer with Action Button */}
        {availableUpgrades.length > 0 && (
          <div className="border-t-3 border-accent-yellow/30 p-4 bg-bg-primary/50">
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-400 font-orbitron">
                {selectedUpgrade
                  ? 'Confirm your selection to install the upgrade'
                  : 'Select an upgrade above to claim your reward'}
              </p>

              <Button
                variant="primary"
                onClick={handleClaim}
                disabled={!selectedUpgrade || claimed}
                className={`flex items-center gap-2 px-6 ${
                  claimed
                    ? 'bg-accent-yellow border-accent-yellow'
                    : selectedUpgrade
                    ? 'glow-pulse-yellow border-accent-yellow text-accent-yellow'
                    : ''
                }`}
              >
                {claimed ? (
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
          </div>
        )}
      </div>
    </div>
  );
}
