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
  glowColor?: string;
  as?: ElementType;
  onClick?: () => void;
  style?: React.CSSProperties;
}

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
      glowColor = 'rgba(168, 230, 207, 0.15)',
      onClick,
      style,
      as: Component = 'div',
    },
    ref
  ) => {
    const glassStyle: React.CSSProperties = {
      background: `rgba(255, 255, 255, ${opacity})`,
      backdropFilter: `blur(${blur}px) saturate(180%)`,
      WebkitBackdropFilter: `blur(${blur}px) saturate(180%)`,
      border: `1.2px solid rgba(255, 255, 255, ${borderOpacity})`,
      borderRadius,
      boxShadow: shadow
        ? `0 8px 32px ${glowColor}, inset 0 1px 0 rgba(255, 255, 255, ${borderOpacity - 0.1})`
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
