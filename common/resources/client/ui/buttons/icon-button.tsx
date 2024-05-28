import React, {cloneElement, forwardRef, ReactElement} from 'react';
import clsx from 'clsx';
import {ButtonSize, getButtonSizeStyle} from './button-size';
import {ButtonBase, ButtonBaseProps} from './button-base';
import {BadgeProps} from '@common/ui/badge/badge';

export interface IconButtonProps extends ButtonBaseProps {
  children: ReactElement;
  padding?: string;
  size?: ButtonSize | null;
  iconSize?: ButtonSize | null;
  equalWidth?: boolean;
  badge?: ReactElement<BadgeProps>;
}
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      children,
      size = 'md',
      // only set icon size based on button size if "ButtonSize" is passed in and not custom className
      iconSize = size && size.length <= 3 ? size : 'md',
      variant = 'text',
      radius = 'rounded-button',
      className,
      padding,
      equalWidth = true,
      badge,
      ...other
    },
    ref,
  ) => {
    const mergedClassName = clsx(
      getButtonSizeStyle(size, {padding, equalWidth, variant}),
      className,
      badge && 'relative',
    );

    return (
      <ButtonBase
        {...other}
        ref={ref}
        radius={radius}
        variant={variant}
        className={mergedClassName}
      >
        {cloneElement(children, {size: iconSize})}
        {badge}
      </ButtonBase>
    );
  },
);
