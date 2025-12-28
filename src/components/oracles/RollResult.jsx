import { useEffect, useState } from 'react';
import { cn } from '../../lib/utils';

export default function RollResult({ result, diceType, sides, rolls, rollMode, onComplete }) {
  const [isRevealing, setIsRevealing] = useState(true);
  const [showEffect, setShowEffect] = useState(false);
  const [showFlash, setShowFlash] = useState(false);

  const isCrit = sides === 20 && result === 20;
  const isFumble = sides === 20 && result === 1;
  const isHigh = result > sides * 0.75;
  const isLow = result <= sides * 0.25;
  const hasAdvDis = rollMode === 'advantage' || rollMode === 'disadvantage';
  const isD100 = sides === 100;

  useEffect(() => {
    // Reveal animation
    const revealTimer = setTimeout(() => {
      setIsRevealing(false);
      
      // Trigger special effect for crit/fumble
      if (isCrit || isFumble) {
        setShowEffect(true);
        setShowFlash(true);
        setTimeout(() => setShowFlash(false), 400);
      }
    }, isD100 ? 400 : 300);

    // Complete callback
    const completeTimer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 2500);

    return () => {
      clearTimeout(revealTimer);
      clearTimeout(completeTimer);
    };
  }, [result, isCrit, isFumble, isD100, onComplete]);

  const getVariantColor = () => {
    if (isCrit) return 'text-accent-yellow';
    if (isFumble) return 'text-accent-red';
    if (isHigh) return 'text-accent-cyan';
    if (isLow) return 'text-gray-400';
    return 'text-accent-cyan';
  };

  const getGlowClass = () => {
    if (isCrit) return 'text-glow-yellow';
    if (isFumble) return 'text-glow-red';
    return 'text-glow-cyan';
  };

  // Split D100 result into digits for staggered reveal
  const resultDigits = isD100 ? result.toString().padStart(3, '0').split('') : [result.toString()];

  return (
    <div className="relative w-full py-3 px-3 bg-bg-secondary/30 backdrop-blur-sm border-2 border-accent-cyan/50 overflow-hidden">
      {/* Screen flash overlay for crit/fumble */}
      {showFlash && (
        <div className={cn(
          'fixed inset-0 pointer-events-none z-50',
          isCrit ? 'bg-accent-yellow screen-flash-yellow' : 'bg-accent-red screen-flash-red'
        )} />
      )}

      {/* Background glow effect */}
      <div className={cn(
        'absolute inset-0 opacity-30 transition-opacity duration-500',
        isCrit && 'bg-gradient-radial from-accent-yellow/40 to-transparent animate-pulse',
        isFumble && 'bg-gradient-radial from-accent-red/40 to-transparent',
        !isCrit && !isFumble && 'bg-gradient-radial from-accent-cyan/20 to-transparent'
      )} />

      {/* Crit burst effect */}
      {showEffect && isCrit && (
        <div className="absolute inset-0 crit-burst pointer-events-none" />
      )}

      {/* Fumble shake container */}
      <div className={cn(
        'relative z-10',
        showEffect && isFumble && 'fumble-shake'
      )}>
        {/* Dice type label with mode indicator */}
        <div className="text-center mb-0.5">
          <span className={cn(
            'text-xs font-orbitron uppercase tracking-wider opacity-70',
            getVariantColor()
          )}>
            {diceType}
            {hasAdvDis && (
              <span className={cn(
                'ml-1',
                rollMode === 'advantage' ? 'text-accent-yellow' : 'text-accent-red'
              )}>
                ({rollMode === 'advantage' ? 'ADV' : 'DIS'})
              </span>
            )}
          </span>
        </div>

        {/* Result number with both rolls if advantage/disadvantage */}
        <div className="text-center">
          {isD100 && !isRevealing ? (
            <span className={cn(
              'font-orbitron font-black text-5xl',
              getVariantColor(),
              getGlowClass()
            )}>
              {resultDigits.map((digit, idx) => (
                <span key={idx} className={`inline-block digit-reveal-${idx + 1}`}>
                  {digit}
                </span>
              ))}
            </span>
          ) : (
            <span className={cn(
              'font-orbitron font-black transition-all duration-300',
              'inline-block',
              isRevealing ? 'text-4xl scale-0 opacity-0' : 'text-5xl scale-100 opacity-100 result-reveal',
              getVariantColor(),
              getGlowClass()
            )}>
              {result}
            </span>
          )}
          
          {/* Show discarded roll when advantage/disadvantage */}
          {!isRevealing && hasAdvDis && rolls && (
            <span className={cn(
              'ml-2 text-2xl font-orbitron font-bold opacity-50',
              getVariantColor()
            )}>
              [{rolls.find(r => r !== result)}]
            </span>
          )}
        </div>

        {/* Special text for crit/fumble */}
        {!isRevealing && (isCrit || isFumble) && (
          <div className={cn(
            'text-center mt-0.5 slide-up',
            'text-xs font-orbitron uppercase tracking-widest',
            isCrit ? 'text-accent-yellow' : 'text-accent-red'
          )}>
            {isCrit ? '★ CRITICAL ★' : '✕ FAILURE ✕'}
          </div>
        )}
      </div>

      {/* Scanline effect overlay */}
      <div className="absolute inset-0 pointer-events-none scan-effect opacity-30" />
    </div>
  );
}

