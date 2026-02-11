import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

interface SparkleOverlayProps {
  intensity?: 'subtle' | 'medium' | 'high';
  showCorners?: boolean;
  className?: string;
}

export function SparkleOverlay({ 
  intensity = 'medium', 
  showCorners = false,
  className = ''
}: SparkleOverlayProps) {
  const prefersReducedMotion = usePrefersReducedMotion();

  const opacityMap = {
    subtle: 'opacity-20',
    medium: 'opacity-30',
    high: 'opacity-40'
  };

  return (
    <>
      {/* Seamless sparkle texture overlay */}
      <div 
        className={`absolute inset-0 pointer-events-none z-0 ${opacityMap[intensity]} ${
          prefersReducedMotion ? '' : 'sparkle-shimmer'
        } ${className}`}
        style={{
          backgroundImage: 'url(/assets/generated/sparkle-overlay-seamless.dim_1024x1024.png)',
          backgroundRepeat: 'repeat',
          backgroundSize: '512px 512px',
          mixBlendMode: 'screen'
        }}
      />
      
      {/* Glitter haze overlay for depth */}
      <div 
        className={`absolute inset-0 pointer-events-none z-0 ${opacityMap[intensity]} ${className}`}
        style={{
          backgroundImage: 'url(/assets/generated/glitter-haze-overlay.dim_1920x1080.png)',
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          mixBlendMode: 'screen'
        }}
      />

      {/* Corner accents for premium feel */}
      {showCorners && (
        <>
          <div 
            className={`absolute top-0 left-0 w-64 h-64 pointer-events-none z-0 ${opacityMap[intensity]} ${className}`}
            style={{
              backgroundImage: 'url(/assets/generated/sparkle-corners-set.dim_1024x1024.png)',
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'contain',
              backgroundPosition: 'top left',
              mixBlendMode: 'screen'
            }}
          />
          <div 
            className={`absolute bottom-0 right-0 w-64 h-64 pointer-events-none z-0 ${opacityMap[intensity]} ${className}`}
            style={{
              backgroundImage: 'url(/assets/generated/sparkle-corners-set.dim_1024x1024.png)',
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'contain',
              backgroundPosition: 'bottom right',
              mixBlendMode: 'screen',
              transform: 'rotate(180deg)'
            }}
          />
        </>
      )}
    </>
  );
}
