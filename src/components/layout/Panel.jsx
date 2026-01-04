import { useEffect } from 'react';
import { HelpCircle, GripVertical, ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function Panel({ 
  title, 
  children, 
  className, 
  variant = 'cyan', 
  onHelpClick, 
  draggable, 
  onDragStart, 
  onDragEnd, 
  collapsible, 
  collapsed, 
  onCollapsedChange, 
  mobileMaxHeight,
  // Touch drag props for mobile
  touchDraggable,
  panelId,
  isDragging,
  isDropTarget
}) {

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

  const showGrip = draggable || touchDraggable;

  // #region agent log
  useEffect(() => {
    if (touchDraggable && panelId) {
      fetch('http://127.0.0.1:7243/ingest/796fb027-eb71-4dd1-95d0-a5c2bee24805',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'Panel.jsx:40',message:'Panel rendered with touch drag',data:{panelId:panelId,touchDraggable:touchDraggable},timestamp:Date.now(),sessionId:'debug-session',hypothesisId:'H2'})}).catch(()=>{});
    }
  }, [touchDraggable, panelId]);
  // #endregion

  return (
    <div className={cn(
      'border-3 flex flex-col relative transition-all duration-300 bg-bg-secondary overflow-hidden',
      collapsed ? 'h-auto' : 'h-full',
      borderColors[variant],
      isDragging && 'opacity-50 scale-[0.98]',
      isDropTarget && 'ring-2 ring-accent-cyan ring-offset-2 ring-offset-bg-primary',
      className
    )}>
      {title && (
        <div 
          draggable={draggable}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          data-panel-header={touchDraggable ? true : undefined}
          data-panel-id={touchDraggable ? panelId : undefined}
          className={cn(
            'px-4 py-2 font-orbitron font-bold uppercase text-lg shrink-0 flex items-center justify-between h-[52px]',
            textColors[variant],
            'bg-bg-primary',
            'overflow-hidden',
            !collapsed && `border-b-3 ${borderColors[variant]}`,
            (draggable || touchDraggable) && 'cursor-grab active:cursor-grabbing',
            touchDraggable && 'select-none'
          )}
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {showGrip && (
              <div className="flex items-center justify-center shrink-0 p-1 -ml-1 rounded hover:bg-current/10 active:bg-current/20 transition-colors">
                <GripVertical className="w-5 h-5 opacity-60" />
              </div>
            )}
            <span className="break-words truncate">{title}</span>
          </div>
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
            {collapsible && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (onCollapsedChange) {
                    onCollapsedChange(!collapsed);
                  }
                }}
                className={cn(
                  'p-1 hover:bg-current/10 transition-all duration-200 rounded',
                  textColors[variant]
                )}
                aria-label={collapsed ? 'Expand panel' : 'Collapse panel'}
              >
                <ChevronDown className={cn(
                  'w-4 h-4 transition-transform duration-200',
                  !collapsed && 'rotate-180'
                )} />
              </button>
            )}
          </div>
        </div>
      )}
      {!collapsed && (
        <div 
          className={cn(
            "p-4 flex-1 overflow-y-auto overflow-x-hidden accordion-reveal relative overscroll-contain",
            mobileMaxHeight && "scroll-smooth"
          )}
          style={mobileMaxHeight ? { 
            maxHeight: mobileMaxHeight,
            touchAction: 'pan-y',
            isolation: 'isolate'
          } : undefined}
        >
          {children}
        </div>
      )}
    </div>
  );
}

