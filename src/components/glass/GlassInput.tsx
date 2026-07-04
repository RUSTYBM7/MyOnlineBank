import { cn } from '@/lib/utils';
import { forwardRef, type InputHTMLAttributes } from 'react';

interface GlassInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  theme?: 'green' | 'navy';
}

const GlassInput = forwardRef<HTMLInputElement, GlassInputProps>(
  ({ className, label, error, icon, theme = 'green', ...props }, ref) => {
    // OrbitPay Design Token Theme Styles
    const themeStyles = {
      green: {
        label: 'text-emerald-800/80',
        icon: 'text-emerald-600/50',
        input: 'text-emerald-900 placeholder:text-emerald-700/30',
        focus: 'border-emerald-500/50 focus:border-emerald-500 focus:ring-emerald-500/20',
      },
      navy: {
        label: 'text-orbit-800/80',
        icon: 'text-orbit-500/50',
        input: 'text-orbit-900 placeholder:text-orbit-700/30',
        focus: 'border-orbit-400/50 focus:border-orbit-400 focus:ring-orbit-400/20',
      },
    };

    const styles = themeStyles[theme];

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className={cn('block text-sm font-medium px-1', styles.label)}>
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className={cn('absolute left-4 top-1/2 -translate-y-1/2', styles.icon)}>
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              'w-full glass-input px-4 py-3.5',
              styles.input,
              'focus:outline-none transition-all duration-200',
              icon && 'pl-11',
              error && 'border-red-400/50 focus:border-red-400',
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <p className="text-xs text-red-500 px-1">{error}</p>
        )}
      </div>
    );
  }
);

GlassInput.displayName = 'GlassInput';

export default GlassInput;
