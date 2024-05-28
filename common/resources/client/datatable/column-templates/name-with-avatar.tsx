import React, {ReactNode} from 'react';
import {Avatar, AvatarProps} from '../../ui/images/avatar';
import {Skeleton} from '@common/ui/skeleton/skeleton';
import clsx from 'clsx';

interface Props {
  image?: string;
  label: ReactNode;
  description?: ReactNode;
  labelClassName?: string;
  avatarSize?: AvatarProps['size'];
}
export function NameWithAvatar({
  image,
  label,
  description,
  labelClassName,
  avatarSize = 'md',
}: Props) {
  return (
    <div className="flex items-center gap-12">
      {image && (
        <Avatar size={avatarSize} className="flex-shrink-0" src={image} />
      )}
      <div className="min-w-0 overflow-hidden">
        <div
          className={clsx(labelClassName, 'overflow-hidden overflow-ellipsis')}
        >
          {label}
        </div>
        {description && (
          <div className="overflow-hidden overflow-ellipsis text-xs text-muted">
            {description}
          </div>
        )}
      </div>
    </div>
  );
}

export function NameWithAvatarPlaceholder({
  labelClassName,
  showDescription,
}: Partial<Props> & {
  showDescription?: boolean;
}) {
  return (
    <div className="flex w-full max-w-4/5 items-center gap-12">
      <Skeleton size="w-40 h-40 md:w-32 md:h-32" variant="rect" />
      <div className="flex-auto">
        <div className={clsx(labelClassName, 'leading-3')}>
          <Skeleton />
        </div>
        {showDescription && (
          <div className="mt-4 leading-3 text-muted">{<Skeleton />}</div>
        )}
      </div>
    </div>
  );
}
