import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  animate?: boolean;
  glowColor?: 'green' | 'navy' | 'accent' | 'custom';
  customGlowColor?: string;
  intensity?: 'low' | 'medium' | 'high';
  style?: React.CSSProperties;
}

// OrbitPay Design Token Glow Colors
const glowColorMap = {
  green: 'rgba(16, 185, 129, 0.12)',    // Primary green glass theme
  navy: 'rgba(10, 31, 68, 0.10)',        // OrbitPay navy blue
  accent: 'rgba(74, 144, 226, 0.10)',     // OrbitPay accent blue
  custom: undefined,                      // Use customGlowColor
};

const GlassCard = ({
  children,
  className,
  onClick,
  animate = true,
  glowColor = 'green',
  customGlowColor,
  intensity = 'medium',
  style,
}: GlassCardProps) => {
  const intensityMap = {
    low: { bg: 0.08, blur: 16 },
    medium: { bg: 0.12, blur: 24 },
    high: { bg: 0.2, blur: 32 },
  };

  const { bg, blur } = intensityMap[intensity];
  const resolvedGlowColor = customGlowColor || glowColorMap[glowColor];

  const cardStyle: React.CSSProperties = {
    background: `rgba(255, 255, 255, ${bg})`,
    backdropFilter: `blur(${blur}px) saturate(180%)`,
    WebkitBackdropFilter: `blur(${blur}px) saturate(180%)`,
    border: '1px solid rgba(16, 185, 129, 0.2)',
    borderRadius: '24px',
    boxShadow: `0 4px 24px ${resolvedGlowColor}, inset 0 1px 0 rgba(255, 255, 255, 0.15)`,
    ...style,
  };

  const content = (
    <div
      className={cn('relative overflow-hidden', className)}
      style={cardStyle}
      onClick={onClick}
    >
      {children}
    </div>
  );

  if (!animate) return content;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      whileHover={onClick ? { scale: 1.01, y: -2 } : undefined}
      className={cn('relative overflow-hidden', className)}
      style={cardStyle}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;
