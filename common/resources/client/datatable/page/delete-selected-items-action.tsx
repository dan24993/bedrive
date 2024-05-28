import {Button} from '../../ui/buttons/button';
import {Trans} from '../../i18n/trans';
import {ConfirmationDialog} from '../../ui/overlays/dialog/confirmation-dialog';
import {DialogTrigger} from '../../ui/overlays/dialog/dialog-trigger';
import React from 'react';
import {useDeleteSelectedRows} from '../requests/delete-selected-rows';
import {useDataTable} from './data-table-context';
import {useDialogContext} from '@common/ui/overlays/dialog/dialog-context';

export function DeleteSelectedItemsAction() {
  return (
    <DialogTrigger type="modal">
      <Button variant="flat" color="danger" className="ml-auto">
        <Trans message="Delete" />
      </Button>
      <DeleteItemsDialog />
    </DialogTrigger>
  );
}

function DeleteItemsDialog() {
  const deleteSelectedRows = useDeleteSelectedRows();
  const {selectedRows} = useDataTable();
  const {close} = useDialogContext();
  return (
    <ConfirmationDialog
      isLoading={deleteSelectedRows.isPending}
      title={
        <Trans
          message="Delete [one 1 item|other :count items]?"
          values={{count: selectedRows.length}}
        />
      }
      body={
        <Trans message="This will permanently remove the items and cannot be undone." />
      }
      confirm={<Trans message="Delete" />}
      isDanger
      onConfirm={() => {
        deleteSelectedRows.mutate(undefined, {onSuccess: () => close()});
      }}
    />
  );
}
