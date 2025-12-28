import { useState } from 'react';
import { Minimize2, Maximize2 } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function Panel({ title, children, className, variant = 'cyan', defaultCollapsed = false, maxHeightExpanded, minHeightExpanded }) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);

  const borderColors = {
    cyan: 'border-accent-cyan',
    yellow: 'border-accent-yellow',
    red: 'border-accent-red',
  };

  const textColors = {
    cyan: 'text-accent-cyan',
    yellow: 'text-accent-yellow',
    red: 'text-accent-red',
  };

  return (
    <div className={cn(
      'border-3 flex flex-col relative transition-all duration-300',
      borderColors[variant],
      isCollapsed ? 'bg-transparent' : 'bg-bg-secondary',
      isCollapsed ? 'overflow-visible' : 'overflow-hidden flex-1',
      className
    )}>
      {title && (
        <div className={cn(
          'px-4 py-2 font-orbitron font-bold uppercase text-lg shrink-0 flex items-center justify-between h-[52px]',
          textColors[variant],
          'bg-bg-primary',
          'overflow-hidden',
          !isCollapsed && `border-b-3 ${borderColors[variant]}`
        )}>
          <span className="break-words flex-1">{title}</span>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className={cn(
              'ml-2 p-1 hover:bg-current/10 transition-all duration-200 rounded',
              textColors[variant]
            )}
            aria-label={isCollapsed ? 'Expand panel' : 'Collapse panel'}
          >
            {isCollapsed ? (
              <Maximize2 className="w-4 h-4" />
            ) : (
              <Minimize2 className="w-4 h-4" />
            )}
          </button>
        </div>
      )}
      {!isCollapsed && (
        <div 
          className={cn(
            "p-4 flex-1 overflow-auto accordion-reveal",
            maxHeightExpanded,
            minHeightExpanded
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
}

