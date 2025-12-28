import { useEffect, useState } from 'react';
import { cn } from '../../lib/utils';

export default function RollResult({ result, diceType, sides, onComplete }) {
  const [isRevealing, setIsRevealing] = useState(true);
  const [showEffect, setShowEffect] = useState(false);

  const isCrit = sides === 20 && result === 20;
  const isFumble = sides === 20 && result === 1;
  const isHigh = result > sides * 0.75;
  const isLow = result <= sides * 0.25;

  useEffect(() => {
    // Reveal animation
    const revealTimer = setTimeout(() => {
      setIsRevealing(false);
      
      // Trigger special effect for crit/fumble
      if (isCrit || isFumble) {
        setShowEffect(true);
      }
    }, 300);

    // Complete callback
    const completeTimer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 2500);

    return () => {
      clearTimeout(revealTimer);
      clearTimeout(completeTimer);
    };
  }, [result, isCrit, isFumble, onComplete]);

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

  return (
    <div className="relative w-full py-3 px-3 bg-bg-secondary/30 backdrop-blur-sm border-2 border-accent-cyan/50 overflow-hidden">
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
        {/* Dice type label */}
        <div className="text-center mb-0.5">
          <span className={cn(
            'text-xs font-orbitron uppercase tracking-wider opacity-70',
            getVariantColor()
          )}>
            {diceType}
          </span>
        </div>

        {/* Result number */}
        <div className="text-center">
          <span className={cn(
            'font-orbitron font-black transition-all duration-300',
            'inline-block',
            isRevealing ? 'text-4xl scale-0 opacity-0' : 'text-5xl scale-100 opacity-100 result-reveal',
            getVariantColor(),
            getGlowClass()
          )}>
            {result}
          </span>
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

