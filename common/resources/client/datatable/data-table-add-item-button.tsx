import {AddIcon} from '../icons/material/Add';
import {Button} from '../ui/buttons/button';
import React, {ReactElement, ReactNode} from 'react';
import {useIsMobileMediaQuery} from '../utils/hooks/is-mobile-media-query';
import {IconButton} from '../ui/buttons/icon-button';
import {To} from 'react-router-dom';
import {ButtonBaseProps} from '../ui/buttons/button-base';

export interface DataTableAddItemButtonProps {
  children: ReactNode;
  to?: To;
  href?: string;
  download?: boolean | string;
  elementType?: ButtonBaseProps['elementType'];
  onClick?: ButtonBaseProps['onClick'];
  icon?: ReactElement;
  disabled?: boolean;
}
export const DataTableAddItemButton = React.forwardRef<
  HTMLButtonElement,
  DataTableAddItemButtonProps
>(
  (
    {children, to, elementType, onClick, href, download, icon, disabled},
    ref,
  ) => {
    const isMobile = useIsMobileMediaQuery();

    if (isMobile) {
      return (
        <IconButton
          ref={ref}
          variant="flat"
          color="primary"
          className="flex-shrink-0"
          size="sm"
          to={to}
          href={href}
          download={download}
          elementType={elementType}
          onClick={onClick}
          disabled={disabled}
        >
          {icon || <AddIcon />}
        </IconButton>
      );
    }

    return (
      <Button
        ref={ref}
        startIcon={icon || <AddIcon />}
        variant="flat"
        color="primary"
        size="sm"
        to={to}
        href={href}
        download={download}
        elementType={elementType}
        onClick={onClick}
        disabled={disabled}
      >
        {children}
      </Button>
    );
  },
);
