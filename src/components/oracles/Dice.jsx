import { cn } from '../../lib/utils';

const diceShapes = {
  4: (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <polygon 
        points="50,10 90,90 10,90" 
        fill="currentColor" 
        fillOpacity="0.1"
        stroke="currentColor" 
        strokeWidth="2"
      />
      <text x="50" y="70" textAnchor="middle" className="text-2xl font-bold fill-current">4</text>
    </svg>
  ),
  6: (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <rect 
        x="20" y="20" 
        width="60" height="60" 
        fill="currentColor" 
        fillOpacity="0.1"
        stroke="currentColor" 
        strokeWidth="2"
        rx="4"
      />
      <text x="50" y="58" textAnchor="middle" className="text-2xl font-bold fill-current">6</text>
    </svg>
  ),
  8: (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <polygon 
        points="50,15 75,35 75,65 50,85 25,65 25,35" 
        fill="currentColor" 
        fillOpacity="0.1"
        stroke="currentColor" 
        strokeWidth="2"
      />
      <text x="50" y="58" textAnchor="middle" className="text-2xl font-bold fill-current">8</text>
    </svg>
  ),
  10: (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <polygon 
        points="30,50 50,20 70,50 50,80" 
        fill="currentColor" 
        fillOpacity="0.1"
        stroke="currentColor" 
        strokeWidth="2"
      />
      <text x="50" y="58" textAnchor="middle" className="text-xl font-bold fill-current">10</text>
    </svg>
  ),
  12: (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <polygon 
        points="50,10 70,25 80,45 70,65 50,80 30,65 20,45 30,25" 
        fill="currentColor" 
        fillOpacity="0.1"
        stroke="currentColor" 
        strokeWidth="2"
      />
      <text x="50" y="58" textAnchor="middle" className="text-xl font-bold fill-current">12</text>
    </svg>
  ),
  20: (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle 
        cx="50" cy="50" r="35" 
        fill="currentColor" 
        fillOpacity="0.1"
        stroke="currentColor" 
        strokeWidth="2"
      />
      <text x="50" y="58" textAnchor="middle" className="text-xl font-bold fill-current">20</text>
    </svg>
  ),
  100: (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <rect 
        x="15" y="25" 
        width="70" height="50" 
        fill="currentColor" 
        fillOpacity="0.1"
        stroke="currentColor" 
        strokeWidth="2"
        rx="4"
      />
      <text x="50" y="58" textAnchor="middle" className="text-lg font-bold fill-current">100</text>
    </svg>
  ),
};

export default function Dice({ 
  sides, 
  label, 
  variant = 'cyan', 
  isRolling = false, 
  onClick,
  className 
}) {
  const variantStyles = {
    cyan: 'text-accent-cyan hover:glow-cyan',
    yellow: 'text-accent-yellow hover:glow-yellow',
    red: 'text-accent-red hover:glow-red',
  };

  return (
    <button
      onClick={onClick}
      disabled={isRolling}
      className={cn(
        'relative aspect-square bg-bg-secondary/50 backdrop-blur-sm',
        'transition-all duration-300 ease-out',
        'hover:scale-105 hover:bg-bg-secondary/70',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'group',
        variantStyles[variant],
        isRolling && 'dice-rolling',
        !isRolling && 'dice-idle',
        className
      )}
    >
      <div className="absolute inset-0 flex items-center justify-center p-2">
        {diceShapes[sides]}
      </div>
      
      {/* Glow effect overlay */}
      <div className={cn(
        'absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300',
        'bg-gradient-radial from-current/20 to-transparent'
      )} />
      
      {/* Label */}
      <div className="absolute bottom-1 left-0 right-0 text-center">
        <span className="text-xs font-orbitron font-bold opacity-80">
          {label}
        </span>
      </div>
    </button>
  );
}

