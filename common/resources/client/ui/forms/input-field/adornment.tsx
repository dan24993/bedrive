import React from 'react';
import clsx from 'clsx';

type AdornmentProps = {
  children: React.ReactNode;
  direction: 'start' | 'end';
  position?: string;
  className?: string;
};
export function Adornment({
  children,
  direction,
  className,
  position = direction === 'start' ? 'left-0' : 'right-0',
}: AdornmentProps) {
  if (!children) return null;
  return (
    <div
      className={clsx(
        'pointer-events-none absolute top-0 z-10 flex h-full min-w-42 items-center justify-center text-muted',
        position,
        className
      )}
    >
      {children}
    </div>
  );
}
