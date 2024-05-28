import {LockIcon} from '@common/icons/material/Lock';
import {Trans} from '@common/i18n/trans';
import {DialogTrigger} from '@common/ui/overlays/dialog/dialog-trigger';
import {ReactNode} from 'react';
import {Tooltip} from '@common/ui/tooltip/tooltip';
import {useSettings} from '@common/core/settings/use-settings';
import {FeatureLockedDialog} from '@common/billing/upgrade/feature-locked-dialog';
import clsx from 'clsx';
import {IconButton} from '@common/ui/buttons/icon-button';
import {Button} from '@common/ui/buttons/button';

interface UpgradeButtonProps {
  message?: ReactNode;
  className?: string;
  iconButton?: boolean;
}
export function NoPermissionButton({
  message,
  className,
  iconButton,
}: UpgradeButtonProps) {
  const {billing} = useSettings();

  if (!billing.enable) {
    return <GenericButton className={className} />;
  }

  return (
    <DialogTrigger type="popover" triggerOnHover>
      {iconButton ? (
        <IconButton className={className} color="primary" size="sm">
          <LockIcon />
        </IconButton>
      ) : (
        <Button
          variant="flat"
          color="primary"
          size="2xs"
          startIcon={<LockIcon />}
          className={className}
        >
          <Trans message="Upgrade" />
        </Button>
      )}
      <FeatureLockedDialog message={message} />
    </DialogTrigger>
  );
}

interface GenericButtonProps {
  className?: string;
}
function GenericButton({className}: GenericButtonProps) {
  return (
    <Tooltip
      label={
        <Trans message="You don't have permissions to access this feature." />
      }
    >
      <LockIcon size="sm" className={clsx('text-muted', className)} />
    </Tooltip>
  );
}
