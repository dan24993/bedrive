import clsx from 'clsx';

interface SkeletonProps {
  variant?: 'avatar' | 'text' | 'rect' | 'icon';
  animation?: 'pulsate' | 'wave' | null; // disable animation completely with null
  className?: string;
  size?: string;
  display?: string;
  radius?: string;
  style?: React.CSSProperties;
}
export function Skeleton({
  variant = 'text',
  animation = 'wave',
  size,
  className,
  display = 'block',
  radius = 'rounded',
  style,
}: SkeletonProps) {
  return (
    <span
      style={style}
      className={clsx(
        'skeleton relative overflow-hidden bg-fg-base/4 bg-no-repeat will-change-transform',
        radius,
        skeletonSize({variant, size}),
        display,
        variant === 'text' && 'origin-[0_55%] scale-y-[0.6]',
        variant === 'avatar' && 'flex-shrink-0',
        variant === 'icon' && 'mx-8 flex-shrink-0',
        animation === 'wave' && 'skeleton-wave',
        animation === 'pulsate' && 'skeleton-pulsate',
        className,
      )}
      aria-busy
      aria-live="polite"
    />
  );
}

interface SkeletonSizeProps {
  variant: SkeletonProps['variant'];
  size: SkeletonProps['size'];
}
function skeletonSize({variant, size}: SkeletonSizeProps): string | undefined {
  if (size) {
    return size;
  }

  switch (variant) {
    case 'avatar':
      return 'h-40 w-40';
    case 'icon':
      return 'h-24 h-24';
    case 'rect':
      return 'h-full w-full';
    default:
      return 'w-full';
  }
}
