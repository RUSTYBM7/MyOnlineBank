import { cn } from '@/lib/utils';
import { forwardRef, type ReactNode, type ElementType } from 'react';

interface GlassSurfaceProps {
  children: ReactNode;
  className?: string;
  blur?: number;
  opacity?: number;
  borderOpacity?: number;
  borderRadius?: string;
  padding?: string;
  shadow?: boolean;
  glowColor?: 'green' | 'navy' | 'accent' | 'custom';
  customGlowColor?: string;
  as?: ElementType;
  onClick?: () => void;
  style?: React.CSSProperties;
}

// OrbitPay Design Token Glow Colors
const glowColors = {
  green: 'rgba(16, 185, 129, 0.15)',   // Primary green glass theme
  navy: 'rgba(10, 31, 68, 0.12)',       // OrbitPay navy blue
  accent: 'rgba(74, 144, 226, 0.15)',    // OrbitPay accent blue
  custom: undefined,                      // Use customGlowColor
};

const GlassSurface = forwardRef<HTMLDivElement, GlassSurfaceProps>(
  (
    {
      children,
      className,
      blur = 20,
      opacity = 0.15,
      borderOpacity = 0.35,
      borderRadius = '24px',
      padding,
      shadow = true,
      glowColor = 'green',
      customGlowColor,
      onClick,
      style,
      as: Component = 'div',
    },
    ref
  ) => {
    const resolvedGlowColor = customGlowColor || glowColors[glowColor];

    const glassStyle: React.CSSProperties = {
      background: `rgba(255, 255, 255, ${opacity})`,
      backdropFilter: `blur(${blur}px) saturate(180%)`,
      WebkitBackdropFilter: `blur(${blur}px) saturate(180%)`,
      border: `1.2px solid rgba(16, 185, 129, ${borderOpacity * 0.5})`,
      borderRadius,
      boxShadow: shadow
        ? `0 8px 32px ${resolvedGlowColor}, inset 0 1px 0 rgba(255, 255, 255, ${borderOpacity - 0.1})`
        : 'none',
      padding,
      ...style,
    };

    return (
      <Component
        ref={ref}
        className={cn('relative overflow-hidden', className)}
        style={glassStyle}
        onClick={onClick}
      >
        {children}
      </Component>
    );
  }
);

GlassSurface.displayName = 'GlassSurface';

export default GlassSurface;
