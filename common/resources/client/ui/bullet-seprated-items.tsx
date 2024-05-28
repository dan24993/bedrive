import React, {Children, Fragment, ReactNode} from 'react';
import clsx from 'clsx';

interface BulletSeparatedItemsProps {
  children: ReactNode;
  className?: string;
}

export function BulletSeparatedItems({
  children,
  className,
}: BulletSeparatedItemsProps) {
  const items = Children.toArray(children);
  return (
    <div className={clsx('flex items-center gap-4 overflow-hidden', className)}>
      {items.map((child, index) => (
        <Fragment key={index}>
          <div>{child}</div>
          {index < items.length - 1 ? <div>&bull;</div> : null}
        </Fragment>
      ))}
    </div>
  );
}
