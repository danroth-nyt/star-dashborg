import { cn } from '../../lib/utils';

const diceShapes = {
  4: (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <polygon 
        points="50,15 85,85 15,85" 
        fill="#0a0a0a" 
        fillOpacity="0.9"
        stroke="currentColor" 
        strokeWidth="2"
      />
      <text x="50" y="70" textAnchor="middle" fill="#ffffff" style={{fontSize: '28px', fontWeight: 900}}>4</text>
    </svg>
  ),
  6: (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <rect 
        x="20" y="20" 
        width="60" height="60" 
        fill="#0a0a0a" 
        fillOpacity="0.9"
        stroke="currentColor" 
        strokeWidth="2"
        rx="4"
      />
      <text x="50" y="58" textAnchor="middle" fill="#ffffff" style={{fontSize: '28px', fontWeight: 900}}>6</text>
    </svg>
  ),
  8: (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <polygon 
        points="25,50 50,15 75,50 50,85" 
        fill="#0a0a0a" 
        fillOpacity="0.9"
        stroke="currentColor" 
        strokeWidth="2"
      />
      <text x="50" y="58" textAnchor="middle" fill="#ffffff" style={{fontSize: '28px', fontWeight: 900}}>8</text>
    </svg>
  ),
  10: (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <polygon 
        points="50,10 80,35 80,65 50,90 20,65 20,35" 
        fill="#0a0a0a" 
        fillOpacity="0.9"
        stroke="currentColor" 
        strokeWidth="2"
      />
      <text x="50" y="58" textAnchor="middle" fill="#ffffff" style={{fontSize: '24px', fontWeight: 900}}>10</text>
    </svg>
  ),
  12: (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <polygon 
        points="50,10 70,20 82,35 82,65 70,80 50,90 30,80 18,65 18,35 30,20" 
        fill="#0a0a0a" 
        fillOpacity="0.9"
        stroke="currentColor" 
        strokeWidth="2"
      />
      <text x="50" y="58" textAnchor="middle" fill="#ffffff" style={{fontSize: '24px', fontWeight: 900}}>12</text>
    </svg>
  ),
  20: (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      {/* D20 icosahedron - hexagonal outer shape with dark fill */}
      <polygon 
        points="50,8 82,25 82,70 50,87 18,70 18,25" 
        fill="#0a0a0a" 
        fillOpacity="0.9"
        stroke="currentColor" 
        strokeWidth="2"
      />
      
      {/* Top triangle pointing up */}
      <polygon points="50,8 18,25 82,25" fill="none" stroke="currentColor" strokeWidth="2" />
      
      {/* Center triangle pointing down - larger for text clearance */}
      <polygon points="50,32 25,65 75,65" fill="#0a0a0a" fillOpacity="0.95" stroke="currentColor" strokeWidth="2" />
      
      {/* Left side triangle */}
      <polygon points="18,25 18,70 25,65" fill="none" stroke="currentColor" strokeWidth="2" />
      
      {/* Right side triangle */}
      <polygon points="82,25 75,65 82,70" fill="none" stroke="currentColor" strokeWidth="2" />
      
      {/* Connect center to outer - only lines that don't interfere with text */}
      <line x1="50" y1="32" x2="50" y2="8" stroke="currentColor" strokeWidth="2" />
      <line x1="25" y1="65" x2="18" y2="25" stroke="currentColor" strokeWidth="2" />
      <line x1="75" y1="65" x2="82" y2="25" stroke="currentColor" strokeWidth="2" />
      
      {/* Bottom connections */}
      <line x1="25" y1="65" x2="50" y2="87" stroke="currentColor" strokeWidth="2" />
      <line x1="75" y1="65" x2="50" y2="87" stroke="currentColor" strokeWidth="2" />
      <line x1="18" y1="70" x2="25" y2="65" stroke="currentColor" strokeWidth="2" />
      <line x1="82" y1="70" x2="75" y2="65" stroke="currentColor" strokeWidth="2" />
      
      <text x="50" y="56" textAnchor="middle" fill="#ffffff" style={{fontSize: '24px', fontWeight: 900}}>20</text>
    </svg>
  ),
  100: (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle 
        cx="50" cy="50" r="40" 
        fill="#0a0a0a" 
        fillOpacity="0.9"
        stroke="currentColor" 
        strokeWidth="2"
      />
      <text x="50" y="58" textAnchor="middle" fill="#ffffff" style={{fontSize: '22px', fontWeight: 900}}>100</text>
    </svg>
  ),
  '2d6': (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      {/* First die */}
      <rect 
        x="15" y="25" 
        width="32" height="32" 
        fill="#0a0a0a" 
        fillOpacity="0.9"
        stroke="currentColor" 
        strokeWidth="2"
        rx="3"
      />
      {/* Second die (offset) */}
      <rect 
        x="53" y="43" 
        width="32" height="32" 
        fill="#0a0a0a" 
        fillOpacity="0.9"
        stroke="currentColor" 
        strokeWidth="2"
        rx="3"
      />
      {/* Number 6 on first die */}
      <text x="31" y="48" textAnchor="middle" fill="#ffffff" style={{fontSize: '18px', fontWeight: 900}}>6</text>
      {/* Number 6 on second die */}
      <text x="69" y="66" textAnchor="middle" fill="#ffffff" style={{fontSize: '18px', fontWeight: 900}}>6</text>
    </svg>
  ),
};

export default function Dice({ 
  sides, 
  variant = 'cyan', 
  isRolling = false, 
  onClick,
  className,
  index = 0
}) {
  const variantStyles = {
    cyan: 'text-accent-cyan',
    yellow: 'text-accent-yellow',
    red: 'text-accent-red',
  };

  // Calculate animation delay and initial rotation based on index
  // Stagger delays: 0s, 0.4s, 0.8s, etc. (cycles within 3s animation)
  const animationDelay = `${(index * 0.4) % 3}s`;
  
  // Vary initial rotation: -4deg to +4deg based on index (subtle variation)
  const initialRotation = ((index * 3) % 9) - 4;

  return (
    <button
      onClick={onClick}
      disabled={isRolling}
      className={cn(
        'relative aspect-square bg-transparent',
        'transition-all duration-300 ease-out',
        'hover:scale-110 active:scale-95',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'group',
        variantStyles[variant],
        isRolling && 'dice-rolling',
        !isRolling && 'dice-idle',
        className
      )}
      style={{
        '--dice-delay': animationDelay,
        '--dice-rotation': `${initialRotation}deg`
      }}
    >
      <div className="absolute inset-0 flex items-center justify-center p-2">
        {diceShapes[sides]}
      </div>
    </button>
  );
}

