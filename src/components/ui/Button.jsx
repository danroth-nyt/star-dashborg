import { cn } from '../../lib/utils';

export default function Button({ 
  children, 
  variant = 'primary', 
  className, 
  onClick,
  disabled,
  ...props 
}) {
  const baseStyles = 'px-4 py-2 font-orbitron font-bold uppercase text-sm border-3 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-accent-cyan text-bg-primary border-accent-cyan hover:bg-transparent hover:text-accent-cyan glow-cyan',
    secondary: 'bg-accent-yellow text-bg-primary border-accent-yellow hover:bg-transparent hover:text-accent-yellow glow-yellow',
    danger: 'bg-accent-red text-bg-primary border-accent-red hover:bg-transparent hover:text-accent-red glow-red',
    ghost: 'bg-transparent text-accent-cyan border-accent-cyan hover:bg-accent-cyan hover:text-bg-primary',
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

