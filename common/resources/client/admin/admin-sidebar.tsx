import clsx from 'clsx';
import React from 'react';
import {CustomMenu} from '../menus/custom-menu';
import {Trans} from '../i18n/trans';
import {useSettings} from '../core/settings/use-settings';

interface Props {
  className?: string;
  isCompactMode?: boolean;
}
export function AdminSidebar({className, isCompactMode}: Props) {
  const {version} = useSettings();
  return (
    <div
      className={clsx(
        className,
        'relative flex flex-col gap-20 overflow-y-auto border-r bg-alt px-12 pb-16 pt-26 text-sm font-medium text-muted',
      )}
    >
      <CustomMenu
        matchDescendants={to => to === '/admin'}
        menu="admin-sidebar"
        orientation="vertical"
        onlyShowIcons={isCompactMode}
        itemClassName={({isActive}) =>
          clsx(
            'block w-full rounded-button py-12 px-16',
            isActive
              ? 'bg-primary/6 text-primary font-semibold'
              : 'hover:bg-hover',
          )
        }
        gap="gap-8"
      />
      {!isCompactMode && (
        <div className="mt-auto gap-14 px-16 text-xs">
          <Trans message="Version: :number" values={{number: version}} />
        </div>
      )}
    </div>
  );
}
