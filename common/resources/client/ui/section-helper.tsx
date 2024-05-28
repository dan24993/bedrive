import {ReactNode} from 'react';
import clsx from 'clsx';
import {IconButton} from '@common/ui/buttons/icon-button';
import {CloseIcon} from '@common/icons/material/Close';

export interface SectionHelperProps {
  title?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  color?: 'positive' | 'danger' | 'warning' | 'primary' | 'neutral' | 'bgAlt';
  className?: string;
  size?: 'sm' | 'md';
  leadingIcon?: ReactNode;
  onClose?: () => void;
}
export function SectionHelper({
  title,
  description,
  actions,
  color = 'primary',
  className,
  size = 'md',
  leadingIcon,
  onClose,
}: SectionHelperProps) {
  return (
    <div
      className={clsx(
        className,
        'rounded-panel px-10 pb-10',
        leadingIcon || onClose ? 'py-4' : 'py-10',
        size === 'sm' ? 'text-xs' : 'text-sm',
        color === 'positive' && 'bg-positive/focus',
        color === 'warning' && 'bg-warning/focus',
        color === 'danger' && 'bg-danger/focus',
        color === 'primary' && 'bg-primary/focus',
        color === 'neutral' && 'border bg',
        color === 'bgAlt' && 'border bg-alt',
      )}
    >
      {title && (
        <div className="mb-4 flex items-center gap-6">
          {leadingIcon}
          <div className="font-medium">{title}</div>
          {onClose ? (
            <IconButton size="xs" className="ml-auto" onClick={() => onClose()}>
              <CloseIcon />
            </IconButton>
          ) : null}
        </div>
      )}
      {description && <div>{description}</div>}
      {actions && <div className="mt-14">{actions}</div>}
    </div>
  );
}
