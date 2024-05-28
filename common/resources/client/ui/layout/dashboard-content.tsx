import {cloneElement, ReactElement} from 'react';
import clsx from 'clsx';

interface DashboardContentProps {
  children: ReactElement<{className: string}>;
  isScrollable?: boolean;
}
export function DashboardContent({
  children,
  isScrollable = true,
}: DashboardContentProps) {
  return cloneElement(children, {
    className: clsx(
      children.props.className,
      isScrollable && 'overflow-y-auto stable-scrollbar',
      'dashboard-grid-content'
    ),
  });
}
