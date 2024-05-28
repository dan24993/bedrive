import {ColumnConfig} from '@common/datatable/column-config';
import {Trans} from '@common/i18n/trans';
import {NameWithAvatar} from '@common/datatable/column-templates/name-with-avatar';
import {Tooltip} from '@common/ui/tooltip/tooltip';
import {IconButton} from '@common/ui/buttons/icon-button';
import React, {ReactNode} from 'react';
import {useRerunScheduledCommand} from '@common/admin/logging/schedule/use-rerurun-scheduled-command';
import {OutgoingEmailLogItem} from '@common/admin/logging/outgoing-email/outgoing-email-log-item';
import {FormattedRelativeTime} from '@common/i18n/formatted-relative-time';
import {Chip, ChipProps} from '@common/ui/forms/input-field/chip-field/chip';
import {VisibilityIcon} from '@common/icons/material/Visibility';
import {DialogTrigger} from '@common/ui/overlays/dialog/dialog-trigger';
import {OutgoingEmailLogEntryDialog} from '@common/admin/logging/outgoing-email/outgoing-email-log-entry-dialog';

export const OutgoingEmailLogDatatableColumns: ColumnConfig<OutgoingEmailLogItem>[] =
  [
    {
      key: 'message_id',
      allowsSorting: true,
      visibleInMode: 'all',
      width: 'flex-3 min-w-200',
      header: () => <Trans message="Subject" />,
      body: item => (
        <NameWithAvatar label={item.subject} description={item.message_id} />
      ),
    },
    {
      key: 'status',
      allowsSorting: true,
      header: () => <Trans message="Status" />,
      body: item => {
        switch (item.status) {
          case 'sent':
            return (
              <StatusChip color="positive">
                <Trans message="Sent" />
              </StatusChip>
            );
          case 'not-sent':
            return (
              <StatusChip color={undefined}>
                <Trans message="Not sent" />
              </StatusChip>
            );
          case 'error':
            return (
              <StatusChip color="danger">
                <Trans message="Error" />
              </StatusChip>
            );
        }
      },
    },
    {
      key: 'from',
      allowsSorting: true,
      header: () => <Trans message="From" />,
      body: item => item.from,
    },
    {
      key: 'to',
      allowsSorting: true,
      header: () => <Trans message="To" />,
      body: item => item.to,
    },
    {
      key: 'created_at',
      allowsSorting: true,
      header: () => <Trans message="Date" />,
      body: item => <FormattedRelativeTime date={item.created_at} />,
    },
    {
      key: 'actions',
      header: () => <Trans message="Actions" />,
      hideHeader: true,
      align: 'end',
      width: 'w-42 flex-shrink-0',
      visibleInMode: 'all',
      body: item => <PreviewEmailButton item={item} />,
    },
  ];

interface PreviewButtonProps {
  item: OutgoingEmailLogItem;
}
function PreviewEmailButton({item}: PreviewButtonProps) {
  const rerunCommand = useRerunScheduledCommand();
  return (
    <DialogTrigger type="modal">
      <Tooltip label={<Trans message="Preview" />}>
        <IconButton
          size="md"
          className="text-muted"
          disabled={rerunCommand.isPending}
          onClick={() => {
            rerunCommand.mutate({id: item.id});
          }}
        >
          <VisibilityIcon />
        </IconButton>
      </Tooltip>
      <OutgoingEmailLogEntryDialog logItemId={item.id} />
    </DialogTrigger>
  );
}

interface StatusChipProps {
  color: ChipProps['color'];
  children: ReactNode;
}
function StatusChip({color, children}: StatusChipProps) {
  return (
    <Chip color={color} size="xs" className="w-max min-w-50 text-center">
      {children}
    </Chip>
  );
}
