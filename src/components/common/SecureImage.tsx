import { useState } from 'react';
import { cn } from '@/lib/utils';

interface SecureImageProps {
  src: string;
  fallbackSrc?: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
}

/**
 * SecureImage - Production-ready image component with robust fallbacks
 * Features:
 * - Automatic SVG fallback generation
 * - Error recovery
 * - Lazy loading support
 * - Priority loading for above-fold images
 * - Responsive sizing
 */
export function SecureImage({
  src,
  fallbackSrc,
  alt,
  className,
  priority = false,
  sizes = '100vw'
}: SecureImageProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Generate secure SVG fallback based on image type
  const generateFallback = (originalSrc: string): string => {
    const isLogo = originalSrc.includes('logo') || originalSrc.includes('Logo');
    const isOffice = originalSrc.includes('office') || originalSrc.includes('Office');
    const isHQ = originalSrc.includes('hq') || originalSrc.includes('HQ');

    const bgColor = '#0A1F44';
    const accentColor = '#10B981';
    const title = isLogo ? 'OrbitPay' : isOffice ? 'Office' : isHQ ? 'HQ' : 'OrbitPay';
    const subtitle = isLogo ? 'Credit Union' : isOffice ? 'Reception' : isHQ ? 'Frankfurt' : 'Banking';

    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${bgColor};stop-opacity:1" />
          <stop offset="100%" style="stop-color:${accentColor};stop-opacity:1" />
        </linearGradient>
        <filter id="glow"><feGaussianBlur stdDeviation="4" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
      </defs>
      <rect width="800" height="600" fill="url(#bg)"/>
      <g transform="translate(400,200)">
        <circle r="80" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.3)" stroke-width="2" filter="url(#glow)"/>
        <circle r="60" fill="rgba(255,255,255,0.15)"/>
        <path d="M-30 0 L0 -50 L30 0 L0 50 Z" fill="white" opacity="0.9"/>
      </g>
      <text x="400" y="380" font-family="system-ui,sans-serif" font-size="36" font-weight="bold" fill="white" text-anchor="middle">${title}</text>
      <text x="400" y="420" font-family="system-ui,sans-serif" font-size="20" fill="rgba(255,255,255,0.7)" text-anchor="middle">${subtitle}</text>
    </svg>`;

    return `data:image/svg+xml;base64,${btoa(svgContent)}`;
  };

  const handleError = () => {
    setHasError(true);
  };

  const handleLoad = () => {
    setIsLoaded(true);
  };

  // Determine the final source
  let finalSrc = src;
  if (hasError) {
    finalSrc = fallbackSrc || generateFallback(src);
  }

  return (
    <div className={cn('relative overflow-hidden bg-slate-900/50', className)}>
      {/* Loading skeleton */}
      {!isLoaded && (
        <div className="absolute inset-0 skeleton-glass animate-pulse" />
      )}

      <img
        src={finalSrc}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        sizes={sizes}
        onError={handleError}
        onLoad={handleLoad}
        className={cn(
          'w-full h-full object-cover transition-opacity duration-300',
          isLoaded ? 'opacity-100' : 'opacity-0'
        )}
      />

      {/* Error overlay - only show if fallback also fails */}
      {hasError && !finalSrc && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80">
          <div className="text-center p-4">
            <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-xs text-slate-400">{alt}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default SecureImage;
