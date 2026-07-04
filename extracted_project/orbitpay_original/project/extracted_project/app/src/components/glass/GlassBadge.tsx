import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface GlassBadgeProps {
  children: ReactNode;
  className?: string;
  variant?: 'mint' | 'lavender' | 'yellow' | 'red' | 'green' | 'default';
  size?: 'sm' | 'md';
}

const GlassBadge = ({
  children,
  className,
  variant = 'default',
  size = 'md',
}: GlassBadgeProps) => {
  const variants = {
    default: 'bg-white/20 text-[#0A0A0A]',
    mint: 'bg-[#A8E6CF]/30 text-[#0A0A0A] border-[#A8E6CF]/40',
    lavender: 'bg-[#DDA0DD]/30 text-[#0A0A0A] border-[#DDA0DD]/40',
    yellow: 'bg-[#F4F7C0]/60 text-[#0A0A0A] border-[#F4F7C0]/50',
    red: 'bg-[#FF6B6B]/20 text-[#FF6B6B] border-[#FF6B6B]/30',
    green: 'bg-[#2ECC71]/20 text-[#2ECC71] border-[#2ECC71]/30',
  };

  const sizes = {
    sm: 'px-2.5 py-0.5 text-xs',
    md: 'px-4 py-1.5 text-sm',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border font-medium backdrop-blur-sm',
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  );
};

export default GlassBadge;
