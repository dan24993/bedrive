import React, {Fragment} from 'react';
import {Trans} from '@common/i18n/trans';
import {DataTableEmptyStateMessage} from '@common/datatable/page/data-table-emty-state-message';
import playlist from './playlist.svg';
import {DataTableAddItemButton} from '@common/datatable/data-table-add-item-button';
import {InfoDialogTrigger} from '@common/ui/overlays/dialog/info-dialog-trigger/info-dialog-trigger';
import {Link} from 'react-router-dom';
import {ChannelsDatatableColumns} from '@common/admin/channels/channels-datatable-columns';
import {ConfirmationDialog} from '@common/ui/overlays/dialog/confirmation-dialog';
import {DialogTrigger} from '@common/ui/overlays/dialog/dialog-trigger';
import {Tooltip} from '@common/ui/tooltip/tooltip';
import {IconButton} from '@common/ui/buttons/icon-button';
import {useResetChannelsToDefault} from '@common/admin/channels/requests/use-reset-channels-to-default';
import {useDialogContext} from '@common/ui/overlays/dialog/dialog-context';
import {RestartAltIcon} from '@common/icons/material/RestartAlt';
import {DataTablePage} from '@common/datatable/page/data-table-page';
import {DeleteSelectedItemsAction} from '@common/datatable/page/delete-selected-items-action';

export function ChannelsDatatablePage() {
  return (
    <DataTablePage
      endpoint="channel"
      title={<Trans message="Channels" />}
      headerContent={<InfoTrigger />}
      headerItemsAlign="items-center"
      queryParams={{type: 'channel'}}
      columns={ChannelsDatatableColumns}
      actions={<Actions />}
      selectedActions={<DeleteSelectedItemsAction />}
      emptyStateMessage={
        <DataTableEmptyStateMessage
          image={playlist}
          title={<Trans message="No channels have been created yet" />}
          filteringTitle={<Trans message="No matching channels" />}
        />
      }
    />
  );
}

function InfoTrigger() {
  return (
    <InfoDialogTrigger
      title={<Trans message="Channels" />}
      body={
        <Trans message="Channels are used to display either all content of specific type or manually cured content. They can be shown as separate page or nested." />
      }
    />
  );
}

function Actions() {
  return (
    <Fragment>
      <DialogTrigger type="modal">
        <Tooltip label={<Trans message="Reset channels" />}>
          <IconButton
            variant="outline"
            color="primary"
            className="flex-shrink-0"
            size="sm"
          >
            <RestartAltIcon />
          </IconButton>
        </Tooltip>
        <ResetChannelsDialog />
      </DialogTrigger>
      <DataTableAddItemButton elementType={Link} to="new">
        <Trans message="Add new channel" />
      </DataTableAddItemButton>
    </Fragment>
  );
}

function ResetChannelsDialog() {
  const {close} = useDialogContext();
  const resetChannels = useResetChannelsToDefault();
  return (
    <ConfirmationDialog
      isLoading={resetChannels.isPending}
      onConfirm={() => {
        resetChannels.mutate(undefined, {onSuccess: () => close()});
      }}
      isDanger
      title={<Trans message="Reset channels" />}
      body={
        <Trans message="Are you sure you want to reset channels to default ones? This will delete any manually created channels and any configuration changes made to them." />
      }
      confirm={<Trans message="Reset" />}
    />
  );
}
