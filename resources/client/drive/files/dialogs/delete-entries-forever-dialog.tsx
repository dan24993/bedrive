import {DriveEntry} from '../drive-entry';
import {ConfirmationDialog} from '@common/ui/overlays/dialog/confirmation-dialog';
import {Trans} from '@common/i18n/trans';
import {useDeleteEntries} from '../queries/use-delete-entries';
import {driveState} from '../../drive-store';
import {useDialogContext} from '@common/ui/overlays/dialog/dialog-context';

interface DeleteEntriesForeverDialogProps {
  entries: DriveEntry[];
}
export function DeleteEntriesForeverDialog({
  entries,
}: DeleteEntriesForeverDialogProps) {
  const deleteEntries = useDeleteEntries();
  const {close} = useDialogContext();

  const message =
    entries.length === 1 ? (
      <Trans
        message="‘:name‘ will be deleted forever and you won't be able to restore it."
        values={{name: entries[0].name}}
      />
    ) : (
      <Trans
        message=":count items will be deleted forever and you won't be able to restore them."
        values={{count: entries.length}}
      />
    );

  return (
    <ConfirmationDialog
      isDanger
      title={<Trans message="Delete forever?" />}
      body={message}
      confirm={<Trans message="Delete forever" />}
      isLoading={deleteEntries.isPending}
      onConfirm={() => {
        deleteEntries.mutate(
          {
            entryIds: entries.map(e => e.id),
            deleteForever: true,
          },
          {
            onSuccess: () => {
              close();
              driveState().selectEntries([]);
            },
          },
        );
      }}
    />
  );
}
