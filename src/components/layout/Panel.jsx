import { cn } from '../../lib/utils';

export default function Panel({ title, children, className, variant = 'cyan' }) {
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
    <div className={cn('border-3', borderColors[variant], 'bg-bg-secondary', className)}>
      {title && (
        <div className={cn(
          'px-4 py-2 font-orbitron font-bold uppercase text-lg border-b-3',
          borderColors[variant],
          textColors[variant],
          'bg-bg-primary'
        )}>
          {title}
        </div>
      )}
      <div className="p-4">
        {children}
      </div>
    </div>
  );
}

