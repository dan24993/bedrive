import {Children, cloneElement, ReactElement, ReactNode} from 'react';
import clsx from 'clsx';

interface TimelineProps {
  children: ReactElement<TimelineProps>[];
  className?: string;
}
export function Timeline({children, className}: TimelineProps) {
  const items = Children.toArray(children);
  return (
    <div className={className}>
      {items.map((item, index) =>
        cloneElement(item as any, {
          isLast: index === items.length - 1,
        })
      )}
    </div>
  );
}

interface TimelineItemProps {
  children: ReactNode;
  className?: string;
  isLast?: boolean;
}
export function TimelineItem({children, className, isLast}: TimelineItemProps) {
  return (
    <div className={clsx('flex gap-12', className)}>
      <div>
        <div className="mt-4 h-12 w-12 flex-shrink-0 rounded-full border-[3px]" />
        {!isLast && (
          <div className="mx-auto mt-4 h-[calc(100%-12px)] w-1 bg-chip"></div>
        )}
      </div>
      <div className="flex-auto">{children}</div>
    </div>
  );
}
