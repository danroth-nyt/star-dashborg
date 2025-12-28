import { useState, useRef, useEffect } from 'react';
import { Minimize2, Maximize2 } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function Panel({ title, children, className, variant = 'cyan', defaultCollapsed = false, maxHeightExpanded, minHeightExpanded }) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const contentRef = useRef(null);
  const [scrollState, setScrollState] = useState({ isScrolled: false, hasMore: false });

  useEffect(() => {
    const element = contentRef.current;
    if (!element || isCollapsed) return;

    const handleScroll = () => {
      const isScrolled = element.scrollTop > 10;
      const hasMore = element.scrollHeight - element.scrollTop - element.clientHeight > 10;
      setScrollState({ isScrolled, hasMore });
    };

    // Initial check
    handleScroll();

    element.addEventListener('scroll', handleScroll);
    // Check on content changes
    const observer = new ResizeObserver(handleScroll);
    observer.observe(element);

    return () => {
      element.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, [isCollapsed]);

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
          ref={contentRef}
          className={cn(
            "p-4 flex-1 overflow-auto relative accordion-reveal",
            maxHeightExpanded,
            minHeightExpanded
          )}
          data-scrolled={scrollState.isScrolled}
          data-has-more={scrollState.hasMore}
        >
          {/* Scroll shadow top */}
          <div className="absolute top-0 left-0 right-0 h-8 pointer-events-none bg-gradient-to-b from-bg-secondary to-transparent opacity-0 transition-opacity duration-300 scroll-shadow-top z-10" />
          
          {children}
          
          {/* Scroll shadow bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-8 pointer-events-none bg-gradient-to-t from-bg-secondary to-transparent opacity-0 transition-opacity duration-300 scroll-shadow-bottom z-10" />
        </div>
      )}
    </div>
  );
}

