import { cn } from '@/lib/utils';
import type { ReactNode, ButtonHTMLAttributes } from 'react';

interface GlassButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'default' | 'primary' | 'gradient' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
}

const GlassButton = ({
  children,
  className,
  variant = 'default',
  size = 'md',
  fullWidth = false,
  icon,
  iconPosition = 'left',
  disabled,
  ...props
}: GlassButtonProps) => {
  const variants = {
    default: 'glass-button bg-white/[0.15] hover:bg-white/[0.25] text-[#0A0A0A]',
    primary: 'bg-[#0A0A0A] hover:bg-[#1A1A1A] text-white border-transparent',
    gradient: 'gradient-mint-lavender text-[#0A0A0A] border-transparent hover:opacity-90',
    danger: 'bg-[#FF6B6B]/90 hover:bg-[#FF6B6B] text-white border-transparent',
    ghost: 'bg-transparent hover:bg-white/[0.1] border-transparent text-[#0A0A0A]',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm rounded-xl',
    md: 'px-6 py-3 text-base rounded-2xl',
    lg: 'px-8 py-4 text-lg rounded-3xl',
  };

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 border active:scale-[0.98]',
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      disabled={disabled}
      {...props}
    >
      {icon && iconPosition === 'left' && icon}
      {children}
      {icon && iconPosition === 'right' && icon}
    </button>
  );
};

export default GlassButton;
