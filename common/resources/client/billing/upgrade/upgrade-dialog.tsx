import {ReactNode} from 'react';
import {useDialogContext} from '@common/ui/overlays/dialog/dialog-context';
import {Dialog} from '@common/ui/overlays/dialog/dialog';
import {DialogHeader} from '@common/ui/overlays/dialog/dialog-header';
import {Trans} from '@common/i18n/trans';
import {DialogBody} from '@common/ui/overlays/dialog/dialog-body';
import {SvgImage} from '@common/ui/images/svg-image/svg-image';
import upgradeSvg from '@common/billing/upgrade/upgrade.svg';
import {DialogFooter} from '@common/ui/overlays/dialog/dialog-footer';
import {Button} from '@common/ui/buttons/button';
import {Link} from 'react-router-dom';

interface UpgradeDialogProps {
  message?: ReactNode;
  messageSuffix?: ReactNode;
}
export function UpgradeDialog({message, messageSuffix}: UpgradeDialogProps) {
  const {close} = useDialogContext();

  return (
    <Dialog size="sm">
      <DialogHeader>
        <Trans message="Join the PROs" />
      </DialogHeader>
      <DialogBody>
        <div className="mb-20 text-center">
          <SvgImage src={upgradeSvg} className="mx-auto" height="h-100" />
        </div>
        <div>
          {message} {messageSuffix}
        </div>
      </DialogBody>
      <DialogFooter>
        <Button
          variant="text"
          size="xs"
          onClick={() => {
            close();
          }}
        >
          <Trans message="Maybe later" />
        </Button>
        <Button
          autoFocus
          variant="flat"
          size="xs"
          color="primary"
          elementType={Link}
          to="/pricing"
          target="_blank"
          onClick={() => close()}
        >
          <Trans message="Find out more" />
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
