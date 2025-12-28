import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function Accordion({ title, children, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-3 border-accent-yellow mb-2">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between bg-bg-secondary hover:bg-accent-yellow hover:text-bg-primary transition-all duration-200 font-orbitron font-bold uppercase text-sm active:scale-[0.99]"
      >
        <span>{title}</span>
        <ChevronDown
          className={cn(
            'w-5 h-5 transition-all duration-300',
            isOpen && 'transform rotate-180'
          )}
        />
      </button>
      {isOpen && (
        <div className="p-4 bg-bg-primary border-t-3 border-accent-yellow accordion-reveal overflow-hidden">
          {children}
        </div>
      )}
    </div>
  );
}

