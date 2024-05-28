import {ReactNode, Ref} from 'react';
import clsx from 'clsx';

export interface ChartLayoutProps {
  title: ReactNode;
  description?: ReactNode;
  className?: string;
  children: ReactNode;
  contentIsFlex?: boolean;
  contentClassName?: string;
  minHeight?: string;
  contentRef?: Ref<HTMLDivElement>;
  isLoading?: boolean;
}
export function ChartLayout(props: ChartLayoutProps) {
  const {
    title,
    description,
    children,
    className,
    contentIsFlex = true,
    contentClassName,
    contentRef,
    minHeight = 'min-h-440',
  } = props;

  return (
    <div
      className={clsx(
        'rounded-panel flex h-full flex-auto flex-col border bg',
        minHeight,
        className,
      )}
    >
      <div className="flex flex-shrink-0 items-center justify-between p-14 text-xs">
        <div className="text-sm font-semibold">{title}</div>
        {description && <div className="text-muted">{description}</div>}
      </div>
      <div
        ref={contentRef}
        className={clsx(
          'relative p-14',
          contentIsFlex && 'flex flex-auto items-center justify-center',
          contentClassName,
        )}
      >
        {children}
      </div>
    </div>
  );
}
