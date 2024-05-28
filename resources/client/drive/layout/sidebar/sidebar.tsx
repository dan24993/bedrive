import React from 'react';
import {StorageMeter} from './storage-summary/storage-meter';
import {WorkspaceSelector} from '@common/workspace/workspace-selector';
import {RootFolderPage} from '../../drive-page/drive-page';
import {SidebarMenu} from './sidebar-menu';
import {useNavigate} from '@common/utils/hooks/use-navigate';
import {CreateNewButton} from '../create-new-button';
import {Button} from '@common/ui/buttons/button';
import {Link} from 'react-router-dom';
import {Trans} from '@common/i18n/trans';
import {useAuth} from '@common/auth/use-auth';
import clsx from 'clsx';
import {useSettings} from '@common/core/settings/use-settings';

interface SidebarProps {
  className?: string;
}
export function Sidebar({className}: SidebarProps) {
  const {isSubscribed} = useAuth();
  const {billing} = useSettings();
  return (
    <div
      className={clsx(
        className,
        'flex flex-col gap-20 border-r bg-alt text-sm font-medium text-muted',
      )}
    >
      <div className="compact-scrollbar flex-auto overflow-y-auto">
        <CreateNewButton className="px-12 pt-28 text-center" />
        <SidebarMenu />
        <StorageMeter />
        {billing.enable ? (
          <div className="mt-14 pl-60">
            <Button
              elementType={Link}
              to={isSubscribed ? '/billing/change-plan' : '/pricing'}
              variant="outline"
              color="primary"
              size="xs"
            >
              <Trans message="Upgrade" />
            </Button>
          </div>
        ) : null}
      </div>
      <WorkspaceSwitcher />
    </div>
  );
}

function WorkspaceSwitcher() {
  const navigate = useNavigate();
  return (
    <WorkspaceSelector
      onChange={() => {
        navigate(RootFolderPage.path);
      }}
      className="mt-auto w-full flex-shrink-0 border-t px-24 py-18"
    />
  );
}
