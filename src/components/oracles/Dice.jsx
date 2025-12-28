import { cn } from '../../lib/utils';

const diceShapes = {
  4: (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <polygon 
        points="50,15 85,85 15,85" 
        fill="currentColor" 
        fillOpacity="0.1"
        stroke="currentColor" 
        strokeWidth="2"
      />
      <text x="50" y="68" textAnchor="middle" className="text-2xl font-bold fill-current">4</text>
    </svg>
  ),
  6: (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <rect 
        x="15" y="15" 
        width="70" height="70" 
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
        points="50,10 80,35 80,65 50,90 20,65 20,35" 
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
        points="25,50 50,15 75,50 50,85" 
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
        points="50,10 70,20 82,35 82,65 70,80 50,90 30,80 18,65 18,35 30,20" 
        fill="currentColor" 
        fillOpacity="0.1"
        stroke="currentColor" 
        strokeWidth="2"
      />
      <text x="50" y="56" textAnchor="middle" className="text-xl font-bold fill-current">12</text>
    </svg>
  ),
  20: (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      {/* D20 icosahedron - hexagonal outer shape */}
      <polygon 
        points="50,5 85,25 85,70 50,90 15,70 15,25" 
        fill="currentColor" 
        fillOpacity="0.1"
        stroke="currentColor" 
        strokeWidth="2"
      />
      {/* Top triangle */}
      <line x1="50" y1="5" x2="15" y2="25" stroke="currentColor" strokeWidth="2" />
      <line x1="50" y1="5" x2="85" y2="25" stroke="currentColor" strokeWidth="2" />
      
      {/* Upper inner lines to center */}
      <line x1="15" y1="25" x2="50" y2="50" stroke="currentColor" strokeWidth="1.5" opacity="0.7" />
      <line x1="85" y1="25" x2="50" y2="50" stroke="currentColor" strokeWidth="1.5" opacity="0.7" />
      <line x1="50" y1="5" x2="50" y2="50" stroke="currentColor" strokeWidth="1.5" opacity="0.7" />
      
      {/* Middle horizontal line */}
      <line x1="15" y1="25" x2="85" y2="70" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
      <line x1="85" y1="25" x2="15" y2="70" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
      
      {/* Lower inner lines from center */}
      <line x1="50" y1="50" x2="15" y2="70" stroke="currentColor" strokeWidth="1.5" opacity="0.7" />
      <line x1="50" y1="50" x2="85" y2="70" stroke="currentColor" strokeWidth="1.5" opacity="0.7" />
      <line x1="50" y1="50" x2="50" y2="90" stroke="currentColor" strokeWidth="1.5" opacity="0.7" />
      
      {/* Bottom triangle */}
      <line x1="50" y1="90" x2="15" y2="70" stroke="currentColor" strokeWidth="2" />
      <line x1="50" y1="90" x2="85" y2="70" stroke="currentColor" strokeWidth="2" />
      
      <text x="50" y="58" textAnchor="middle" className="text-xl font-bold fill-current">20</text>
    </svg>
  ),
  100: (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle 
        cx="50" cy="50" r="40" 
        fill="currentColor" 
        fillOpacity="0.1"
        stroke="currentColor" 
        strokeWidth="2"
      />
      <text x="50" y="58" textAnchor="middle" className="text-lg font-bold fill-current">100</text>
    </svg>
  ),
  '2d6': (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      {/* First die */}
      <rect 
        x="15" y="25" 
        width="32" height="32" 
        fill="currentColor" 
        fillOpacity="0.1"
        stroke="currentColor" 
        strokeWidth="2"
        rx="3"
      />
      {/* Second die (offset) */}
      <rect 
        x="53" y="43" 
        width="32" height="32" 
        fill="currentColor" 
        fillOpacity="0.15"
        stroke="currentColor" 
        strokeWidth="2"
        rx="3"
      />
      {/* Number 6 on first die */}
      <text x="31" y="46" textAnchor="middle" className="text-lg font-bold fill-current">6</text>
      {/* Number 6 on second die */}
      <text x="69" y="64" textAnchor="middle" className="text-lg font-bold fill-current">6</text>
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
    </button>
  );
}

