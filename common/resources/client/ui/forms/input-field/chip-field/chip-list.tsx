import React, {
  Children,
  cloneElement,
  isValidElement,
  ReactElement,
} from 'react';
import clsx from 'clsx';
import type {ChipProps} from './chip';

export interface ChipListProps {
  className?: string;
  children?: ReactElement | ReactElement[];
  size?: ChipProps['size'];
  radius?: ChipProps['radius'];
  color?: ChipProps['color'];
  selectable?: ChipProps['selectable'];
  wrap?: boolean;
}
export function ChipList({
  className,
  children,
  size,
  color,
  radius,
  selectable,
  wrap = true,
}: ChipListProps) {
  return (
    <div
      className={clsx(
        'flex items-center gap-8',
        wrap && 'flex-wrap',
        className,
      )}
    >
      {Children.map(children, chip => {
        if (isValidElement<ChipProps>(chip)) {
          return cloneElement<ChipProps>(chip, {
            size,
            color,
            selectable,
            radius,
          });
        }
      })}
    </div>
  );
}
