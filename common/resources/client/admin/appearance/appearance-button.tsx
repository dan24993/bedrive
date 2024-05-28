import clsx from 'clsx';
import {forwardRef, ReactNode} from 'react';
import {KeyboardArrowRightIcon} from '../../icons/material/KeyboardArrowRight';
import {ButtonBase, ButtonBaseProps} from '../../ui/buttons/button-base';

interface Props extends ButtonBaseProps {
  startIcon?: ReactNode;
  description?: ReactNode;
}
export const AppearanceButton = forwardRef<HTMLButtonElement, Props>(
  ({startIcon, children, className, description, ...other}, ref) => {
    return (
      <ButtonBase
        ref={ref}
        display="flex"
        className={clsx(
          'relative mb-10 h-54 w-full items-center gap-10 rounded-input border bg px-14 text-sm hover:bg-hover',
          className,
        )}
        variant={null}
        {...other}
      >
        {startIcon}
        <span className="block min-w-0">
          <span className="block">{children}</span>
          {description && (
            <span className="block overflow-hidden overflow-ellipsis whitespace-nowrap text-xs text-muted">
              {description}
            </span>
          )}
        </span>
        <KeyboardArrowRightIcon
          aria-hidden
          className="ml-auto text-muted icon-sm"
        />
      </ButtonBase>
    );
  },
);
