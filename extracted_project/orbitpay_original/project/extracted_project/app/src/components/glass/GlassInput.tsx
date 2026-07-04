import { cn } from '@/lib/utils';
import { forwardRef, type InputHTMLAttributes } from 'react';

interface GlassInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const GlassInput = forwardRef<HTMLInputElement, GlassInputProps>(
  ({ className, label, error, icon, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="block text-sm font-medium text-[#0A0A0A]/70 px-1">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0A0A0A]/40">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={cn(
              'w-full glass-input px-4 py-3.5 text-[#0A0A0A] placeholder:text-[#0A0A0A]/30',
              'focus:outline-none transition-all duration-200',
              icon && 'pl-11',
              error && 'border-[#FF6B6B]/50 focus:border-[#FF6B6B]',
              className
            )}
            {...props}
          />
        </div>
        {error && (
          <p className="text-xs text-[#FF6B6B] px-1">{error}</p>
        )}
      </div>
    );
  }
);

GlassInput.displayName = 'GlassInput';

export default GlassInput;
