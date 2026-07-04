import { cn } from '@/lib/utils';
import type { ReactNode, ButtonHTMLAttributes } from 'react';

interface GlassButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'default' | 'primary' | 'gradient' | 'danger' | 'ghost' | 'navy' | 'accent';
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
  // OrbitPay Design Token Button Variants
  const variants = {
    default: 'glass-button bg-white/[0.15] hover:bg-white/[0.25] text-emerald-800',
    primary: 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white border-transparent shadow-lg shadow-emerald-500/25',
    gradient: 'gradient-mint-lavender text-white border-transparent hover:opacity-90 shadow-lg',
    danger: 'bg-[#FF6B6B]/90 hover:bg-[#FF6B6B] text-white border-transparent',
    ghost: 'bg-transparent hover:bg-emerald-50 border-transparent text-emerald-700',
    // OrbitPay Brand Variants
    navy: 'bg-[#0A1F44] hover:bg-[#0E2B5E] text-white border-transparent shadow-lg shadow-orbit-800/25',
    accent: 'bg-gradient-to-r from-[#4A90E2] to-[#3570C0] hover:from-[#6BA5E7] hover:to-[#4A90E2] text-white border-transparent shadow-lg shadow-accent-500/25',
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
