import {Trans} from '@common/i18n/trans';
import {ReactNode} from 'react';
import {UpgradeDialog} from '@common/billing/upgrade/upgrade-dialog';

interface FeatureLockedDialogProps {
  message?: ReactNode;
  messageSuffix?: ReactNode;
}
export function FeatureLockedDialog({
  message,
  messageSuffix,
}: FeatureLockedDialogProps) {
  return (
    <UpgradeDialog
      message={message}
      messageSuffix={
        messageSuffix === undefined ? (
          <Trans message="Upgrade to unlock this feature and many more." />
        ) : (
          messageSuffix
        )
      }
    />
  );
}
