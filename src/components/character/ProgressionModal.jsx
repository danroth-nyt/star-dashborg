import { useState, useEffect } from 'react';
import { X, Award, Dices, TrendingUp, Star, Check, AlertCircle } from 'lucide-react';
import { useCharacter } from '../../context/CharacterContext';
import { useParty } from '../../context/PartyContext';
import { useGame } from '../../context/GameContext';
import { 
  getAvailableAdvancements, 
  getStatIncreaseOptions, 
  implementAdvancement 
} from '../../data/progressionData';
import { rollD } from '../../utils/dice';
import Button from '../ui/Button';

export default function ProgressionModal({ isOpen, onClose }) {
  const { character, claimPromotion } = useCharacter();
  const { refreshPartyMembers } = useParty();
  const { addLog } = useGame();

  // Progression state
  const [step, setStep] = useState(1); // 1: HP roll, 2: stat selection, 3: advancement choice, 4: confirm
  const [hpRoll, setHpRoll] = useState(null);
  const [isRolling, setIsRolling] = useState(false);
  const [selectedStats, setSelectedStats] = useState([]);
  const [selectedAdvancement, setSelectedAdvancement] = useState(null);
  const [advancementResult, setAdvancementResult] = useState(null);
  const [isClaiming, setIsClaiming] = useState(false);
  const [claimed, setClaimed] = useState(false);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setHpRoll(null);
      setIsRolling(false);
      setSelectedStats([]);
      setSelectedAdvancement(null);
      setAdvancementResult(null);
      setIsClaiming(false);
      setClaimed(false);
    }
  }, [isOpen]);

  if (!isOpen || !character) return null;

  const alreadyTaken = (character.advancementOptions || []).map(opt => opt.id);
  const availableAdvancements = getAvailableAdvancements(character.class, alreadyTaken);
  const availableStats = getStatIncreaseOptions(character.stats);

  // Step 1: Roll HP
  const handleRollHP = () => {
    setIsRolling(true);
    
    // Animate dice roll
    let rollCount = 0;
    const rollInterval = setInterval(() => {
      setHpRoll(Math.floor(Math.random() * 6) + 1);
      rollCount++;
      
      if (rollCount > 10) {
        clearInterval(rollInterval);
        const finalRoll = rollD(6);
        setHpRoll(finalRoll);
        setIsRolling(false);
        
        // Auto-advance after showing result
        setTimeout(() => {
          setStep(2);
        }, 1500);
      }
    }, 100);
  };

  // Step 2: Select stats
  const handleStatToggle = (stat) => {
    if (selectedStats.includes(stat)) {
      setSelectedStats(selectedStats.filter(s => s !== stat));
    } else if (selectedStats.length < 2) {
      setSelectedStats([...selectedStats, stat]);
    }
  };

  const handleContinueFromStats = () => {
    if (selectedStats.length === 2) {
      setStep(3);
    }
  };

  // Step 3: Select advancement
  const handleAdvancementSelect = (advancementId) => {
    setSelectedAdvancement(advancementId);
    
    // Implement the advancement to see what we get
    const result = implementAdvancement(advancementId, character.class);
    setAdvancementResult(result);
  };

  const handleContinueFromAdvancement = () => {
    if (selectedAdvancement) {
      setStep(4);
    }
  };

  // Step 4: Confirm and claim
  const handleConfirmPromotion = async () => {
    try {
      setIsClaiming(true);

      await claimPromotion({
        hpIncrease: hpRoll,
        statIncreases: selectedStats,
        advancementId: selectedAdvancement,
        advancementResult: advancementResult,
      });

      // Force refresh party members to ensure sync
      refreshPartyMembers();

      // Log the promotion
      const statText = selectedStats.map(s => s.toUpperCase()).join(' and ');
      addLog(
        `${character.name} claimed promotion: +${hpRoll} HP, +1 ${statText}, gained ${advancementResult.advancement.name}`,
        'success'
      );

      setClaimed(true);

      // Close after showing success
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Failed to claim promotion:', error);
      alert('Failed to claim promotion. Please try again.');
      setIsClaiming(false);
    }
  };

  // Format modifier with +/- prefix
  const formatModifier = (value) => {
    if (value > 0) return `+${value}`;
    if (value === 0) return '0';
    return `${value}`;
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-bg-secondary border-3 border-purple-500 max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="border-b-3 border-purple-500/30 p-4 bg-purple-900/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Award className="w-8 h-8 text-purple-400 animate-pulse" />
              <div>
                <h2 className="font-orbitron font-bold text-purple-300 text-2xl">
                  REBEL PROMOTION
                </h2>
                <p className="text-sm text-gray-400 font-orbitron">
                  {character.name} - {character.className}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              disabled={isClaiming}
              className="p-2 text-gray-400 hover:text-accent-red transition-colors disabled:opacity-50"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="p-4 bg-bg-primary border-b-2 border-gray-700">
          <div className="flex items-center justify-center gap-2">
            {[1, 2, 3, 4].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-orbitron font-bold text-sm border-2 transition-all ${
                    step > stepNum
                      ? 'bg-purple-500 border-purple-500 text-white'
                      : step === stepNum
                      ? 'bg-purple-600 border-purple-500 text-white animate-pulse'
                      : 'bg-transparent border-gray-600 text-gray-600'
                  }`}
                >
                  {step > stepNum ? <Check className="w-4 h-4" /> : stepNum}
                </div>
                {stepNum < 4 && (
                  <div
                    className={`w-8 h-0.5 mx-1 transition-all ${
                      step > stepNum ? 'bg-purple-500' : 'bg-gray-600'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="text-center text-xs text-gray-400 font-mono mt-2">
            {step === 1 && 'Roll HP Increase'}
            {step === 2 && 'Select Stat Increases'}
            {step === 3 && 'Choose Advancement'}
            {step === 4 && 'Confirm Promotion'}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Step 1: HP Roll */}
          {step === 1 && (
            <div className="text-center space-y-6">
              <div>
                <h3 className="text-xl font-orbitron font-bold text-accent-cyan mb-2">
                  Roll for HP Increase
                </h3>
                <p className="text-sm text-gray-400">
                  Roll D6 to increase your maximum HP
                </p>
              </div>

              <div className="flex flex-col items-center gap-4">
                {hpRoll !== null ? (
                  <div className={`text-8xl font-orbitron font-bold ${isRolling ? 'text-gray-400' : 'text-accent-yellow text-glow-yellow'}`}>
                    {hpRoll}
                  </div>
                ) : (
                  <Dices className="w-24 h-24 text-gray-600" />
                )}

                {!isRolling && hpRoll === null && (
                  <Button
                    onClick={handleRollHP}
                    variant="primary"
                    className="px-8 py-3 text-lg glow-pulse-cyan"
                  >
                    <Dices className="w-6 h-6 mr-2" />
                    ROLL D6
                  </Button>
                )}

                {!isRolling && hpRoll !== null && (
                  <div className="text-purple-400 font-orbitron">
                    HP: {character.hp_max} → {character.hp_max + hpRoll}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Stat Selection */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-orbitron font-bold text-accent-cyan mb-2">
                  Select Two Ability Scores to Increase
                </h3>
                <p className="text-sm text-gray-400">
                  Choose 2 stats to increase by +1 (max +6)
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {Object.entries(character.stats).map(([stat, value]) => {
                  const isSelected = selectedStats.includes(stat);
                  const isDisabled = value >= 6 || (!isSelected && selectedStats.length >= 2);

                  return (
                    <button
                      key={stat}
                      onClick={() => handleStatToggle(stat)}
                      disabled={isDisabled}
                      className={`p-4 border-3 transition-all ${
                        isSelected
                          ? 'border-accent-cyan bg-accent-cyan/20 scale-105'
                          : isDisabled
                          ? 'border-gray-700 bg-gray-900/50 opacity-50 cursor-not-allowed'
                          : 'border-gray-700 hover:border-accent-cyan/50 hover:bg-accent-cyan/5'
                      }`}
                    >
                      <div className="text-xs font-mono text-gray-400 uppercase mb-2">
                        {stat}
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-2xl font-orbitron font-bold text-text-primary">
                          {formatModifier(value)}
                        </span>
                        {!isDisabled && (
                          <>
                            <TrendingUp className="w-5 h-5 text-accent-cyan" />
                            <span className="text-2xl font-orbitron font-bold text-accent-cyan">
                              {formatModifier(value + 1)}
                            </span>
                          </>
                        )}
                      </div>
                      {value >= 6 && (
                        <div className="text-xs text-accent-yellow mt-2">MAX</div>
                      )}
                      {isSelected && (
                        <div className="mt-2">
                          <Check className="w-5 h-5 text-accent-cyan mx-auto" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {availableStats.length < 2 && (
                <div className="bg-purple-900/30 border-2 border-purple-500 p-3 rounded flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-purple-300">
                    Some stats are already at maximum (+6). Select any available stats.
                  </p>
                </div>
              )}

              <div className="text-center">
                <Button
                  onClick={handleContinueFromStats}
                  disabled={selectedStats.length !== 2}
                  variant="primary"
                  className="px-8"
                >
                  Continue →
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Advancement Selection */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-orbitron font-bold text-accent-cyan mb-2">
                  Choose Class Advancement
                </h3>
                <p className="text-sm text-gray-400">
                  Select one advancement option for your {character.className}
                </p>
              </div>

              {availableAdvancements.length === 0 ? (
                <div className="text-center py-8">
                  <Star className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                  <p className="text-gray-400">No advancements available</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {availableAdvancements.map((advancement) => {
                    const isSelected = selectedAdvancement === advancement.id;

                    return (
                      <button
                        key={advancement.id}
                        onClick={() => handleAdvancementSelect(advancement.id)}
                        className={`w-full border-3 p-4 text-left transition-all ${
                          isSelected
                            ? 'border-purple-500 bg-purple-900/30 scale-105'
                            : 'border-gray-700 hover:border-purple-500/50 hover:bg-purple-900/20'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-orbitron font-bold text-text-primary">
                            {advancement.name}
                          </h4>
                          {isSelected && (
                            <Star className="w-5 h-5 text-purple-400 fill-purple-400" />
                          )}
                        </div>

                        <p className="text-sm text-gray-400 mb-2">
                          {advancement.description}
                        </p>

                        <div className="flex items-center gap-2 text-xs">
                          <span className="text-accent-cyan font-orbitron">
                            {advancement.effect}
                          </span>
                        </div>

                        {/* Show rolled result if selected */}
                        {isSelected && advancementResult?.rolledFeature && (
                          <div className="mt-3 pt-3 border-t border-purple-500/30">
                            <div className="text-xs text-purple-400 uppercase mb-1">
                              Rolled Result:
                            </div>
                            <div className="text-sm text-purple-300 font-bold">
                              {advancementResult.rolledFeature.name}
                            </div>
                            {advancementResult.rolledFeature.description && (
                              <div className="text-xs text-gray-400 mt-1">
                                {advancementResult.rolledFeature.description}
                              </div>
                            )}
                          </div>
                        )}

                        {isSelected && advancementResult?.companion && (
                          <div className="mt-3 pt-3 border-t border-purple-500/30">
                            <div className="text-xs text-purple-400 uppercase mb-1">
                              Companion Gained:
                            </div>
                            <div className="text-sm text-purple-300 font-bold">
                              {advancementResult.companion.name}
                            </div>
                            <div className="text-xs text-gray-400 mt-1">
                              HP: {advancementResult.companion.hp} | Morale: {advancementResult.companion.morale} | 
                              Armor: Tier {advancementResult.companion.armor} | {advancementResult.companion.weapon}
                            </div>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              <div className="text-center">
                <Button
                  onClick={handleContinueFromAdvancement}
                  disabled={!selectedAdvancement}
                  variant="primary"
                  className="px-8"
                >
                  Continue →
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Confirmation */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-xl font-orbitron font-bold text-accent-cyan mb-2">
                  Confirm Promotion
                </h3>
                <p className="text-sm text-gray-400">
                  Review your choices before claiming
                </p>
              </div>

              <div className="space-y-4">
                {/* HP Summary */}
                <div className="bg-accent-red/10 border-2 border-accent-red p-4">
                  <div className="text-xs font-mono text-accent-red uppercase mb-2">
                    Hit Points
                  </div>
                  <div className="text-2xl font-orbitron font-bold text-accent-red">
                    {character.hp_max} → {character.hp_max + hpRoll} (+{hpRoll})
                  </div>
                </div>

                {/* Stats Summary */}
                <div className="bg-accent-cyan/10 border-2 border-accent-cyan p-4">
                  <div className="text-xs font-mono text-accent-cyan uppercase mb-2">
                    Ability Scores
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedStats.map(stat => (
                      <div key={stat} className="flex items-center gap-2">
                        <span className="text-sm font-mono text-gray-400 uppercase">
                          {stat}:
                        </span>
                        <span className="font-orbitron font-bold text-accent-cyan">
                          {formatModifier(character.stats[stat])} → {formatModifier(character.stats[stat] + 1)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Advancement Summary */}
                <div className="bg-purple-900/30 border-2 border-purple-500 p-4">
                  <div className="text-xs font-mono text-purple-400 uppercase mb-2">
                    Class Advancement
                  </div>
                  <div className="font-orbitron font-bold text-purple-300 mb-1">
                    {advancementResult?.advancement.name}
                  </div>
                  <div className="text-sm text-gray-400">
                    {advancementResult?.advancement.description}
                  </div>
                </div>
              </div>

              <div className="text-center pt-4">
                {!claimed ? (
                  <Button
                    onClick={handleConfirmPromotion}
                    disabled={isClaiming}
                    variant="primary"
                    className="px-12 py-3 text-lg bg-purple-600 hover:bg-purple-500 border-purple-500 text-white shadow-lg shadow-purple-500/50"
                  >
                    {isClaiming ? (
                      <>
                        <Dices className="w-6 h-6 mr-2 animate-spin" />
                        Claiming...
                      </>
                    ) : (
                      <>
                        <Award className="w-6 h-6 mr-2" />
                        CLAIM PROMOTION
                      </>
                    )}
                  </Button>
                ) : (
                  <div className="text-2xl font-orbitron font-bold text-purple-300 animate-pulse">
                    <Check className="w-8 h-8 inline-block mr-2" />
                    PROMOTION CLAIMED!
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
