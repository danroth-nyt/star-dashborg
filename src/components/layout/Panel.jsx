import { HelpCircle, GripVertical } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function Panel({ title, children, className, variant = 'cyan', onHelpClick, draggable, onDragStart, onDragEnd }) {

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
      'border-3 flex flex-col relative transition-all duration-300 bg-bg-secondary h-full overflow-hidden',
      borderColors[variant],
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
            `border-b-3 ${borderColors[variant]}`,
            draggable && 'cursor-grab active:cursor-grabbing'
          )}
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {draggable && <GripVertical className="w-4 h-4 opacity-50 shrink-0" />}
            <span className="break-words truncate">{title}</span>
          </div>
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
        </div>
      )}
      <div 
        className="p-4 flex-1 overflow-auto accordion-reveal relative"
      >
        {children}
      </div>
    </div>
  );
}

