import { useState } from 'react';
import { Minus, Plus, HelpCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function Panel({ title, children, className, variant = 'cyan', defaultCollapsed = false, collapsed, onCollapsedChange, maxHeightExpanded, minHeightExpanded, onHelpClick, draggable, onDragStart, onDragEnd }) {
  const [internalCollapsed, setInternalCollapsed] = useState(defaultCollapsed);
  
  // Use controlled state if provided, otherwise use internal state
  const isCollapsed = collapsed !== undefined ? collapsed : internalCollapsed;
  const setIsCollapsed = (value) => {
    if (collapsed !== undefined && onCollapsedChange) {
      onCollapsedChange(value);
    } else {
      setInternalCollapsed(value);
    }
  };

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
        <div 
          draggable={draggable}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          className={cn(
            'px-4 py-2 font-orbitron font-bold uppercase text-lg shrink-0 flex items-center justify-between h-[52px]',
            textColors[variant],
            'bg-bg-primary',
            'overflow-hidden',
            !isCollapsed && `border-b-3 ${borderColors[variant]}`,
            draggable && 'cursor-grab active:cursor-grabbing'
          )}
        >
          <span className="break-words flex-1">{title}</span>
          <div className="flex items-center gap-1">
            {onHelpClick && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onHelpClick();
                }}
                className={cn(
                  'p-1 hover:bg-current/10 transition-all duration-200 rounded',
                  textColors[variant]
                )}
                aria-label="Show help"
              >
                <HelpCircle className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className={cn(
                'p-1 hover:bg-current/10 transition-all duration-200 rounded',
                textColors[variant]
              )}
              aria-label={isCollapsed ? 'Expand panel' : 'Collapse panel'}
            >
              {isCollapsed ? (
                <Plus className="w-4 h-4" />
              ) : (
                <Minus className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      )}
      {!isCollapsed && (
        <div 
          className={cn(
            "p-4 flex-1 overflow-auto accordion-reveal relative",
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

