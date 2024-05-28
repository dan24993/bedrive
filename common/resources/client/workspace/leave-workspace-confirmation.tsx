import {ConfirmationDialog} from '../ui/overlays/dialog/confirmation-dialog';
import {Trans} from '../i18n/trans';

interface Props {
  onConfirm?: () => void;
  isLoading?: boolean;
}
export function LeaveWorkspaceConfirmation({onConfirm, isLoading}: Props) {
  return (
    <ConfirmationDialog
      isDanger
      title={<Trans message="Leave workspace" />}
      isLoading={isLoading}
      onConfirm={onConfirm}
      body={
        <div>
          <Trans message="Are you sure you want to leave this workspace?" />
          <div className="mt-8 font-semibold">
            <Trans message="All resources you've created in the workspace will be transferred to workspace owner." />
          </div>
        </div>
      }
      confirm={<Trans message="Leave" />}
    />
  );
}
