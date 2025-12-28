import { cn } from '../../lib/utils';

export default function Button({ 
  children, 
  variant = 'primary', 
  className, 
  onClick,
  disabled,
  ...props 
}) {
  const baseStyles = 'px-3 sm:px-4 py-2 font-orbitron font-bold uppercase text-xs sm:text-sm border-3 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] active:shadow-inner leading-tight';
  
  const variants = {
    primary: 'bg-accent-cyan text-bg-primary border-accent-cyan hover:bg-transparent hover:text-accent-cyan hover:shadow-[0_0_15px_rgba(0,240,255,0.6)]',
    secondary: 'bg-accent-yellow text-bg-primary border-accent-yellow hover:bg-transparent hover:text-accent-yellow hover:shadow-[0_0_15px_rgba(255,252,0,0.6)]',
    danger: 'bg-accent-red text-bg-primary border-accent-red hover:bg-transparent hover:text-accent-red hover:shadow-[0_0_15px_rgba(255,0,60,0.6)]',
    ghost: 'bg-transparent text-accent-cyan border-accent-cyan hover:bg-accent-cyan hover:text-bg-primary hover:shadow-[0_0_15px_rgba(0,240,255,0.6)]',
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], className)}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

