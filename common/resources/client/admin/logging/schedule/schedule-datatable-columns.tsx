import {ColumnConfig} from '@common/datatable/column-config';
import {Trans} from '@common/i18n/trans';
import {NameWithAvatar} from '@common/datatable/column-templates/name-with-avatar';
import {BooleanIndicator} from '@common/datatable/column-templates/boolean-indicator';
import {FormattedNumber} from '@common/i18n/formatted-number';
import {Tooltip} from '@common/ui/tooltip/tooltip';
import {IconButton} from '@common/ui/buttons/icon-button';
import React from 'react';
import {ScheduleLogItem} from '@common/admin/logging/schedule/schedule-log-item';
import {useRerunScheduledCommand} from '@common/admin/logging/schedule/use-rerurun-scheduled-command';
import {EventRepeatIcon} from '@common/icons/material/EventRepeat';
import {FormattedRelativeTime} from '@common/i18n/formatted-relative-time';

export const ScheduleDatatableColumns: ColumnConfig<ScheduleLogItem>[] = [
  {
    key: 'command',
    allowsSorting: true,
    visibleInMode: 'all',
    width: 'flex-3 min-w-200',
    header: () => <Trans message="Name" />,
    body: item => (
      <NameWithAvatar label={item.command} description={item.output} />
    ),
  },
  {
    key: 'ran_at',
    allowsSorting: true,
    header: () => <Trans message="Ran at" />,
    body: item => <FormattedRelativeTime date={item.ran_at} />,
  },
  {
    key: 'duration',
    allowsSorting: true,
    header: () => <Trans message="Duration" />,
    body: item => `${item.duration}ms`,
  },
  {
    key: 'exit_code',
    allowsSorting: true,
    header: () => <Trans message="Completed" />,
    body: item => <BooleanIndicator value={item.exit_code === 0} />,
  },
  {
    key: 'count_in_last_hour',
    allowsSorting: true,
    header: () => <Trans message="Runs recently" />,
    body: item => <FormattedNumber value={item.count_in_last_hour} />,
  },
  {
    key: 'actions',
    header: () => <Trans message="Actions" />,
    hideHeader: true,
    align: 'end',
    width: 'w-42 flex-shrink-0',
    visibleInMode: 'all',
    body: item => <RerunButton item={item} />,
  },
];

interface RerunButtonProps {
  item: ScheduleLogItem;
}
function RerunButton({item}: RerunButtonProps) {
  const rerunCommand = useRerunScheduledCommand();
  return (
    <Tooltip label={<Trans message="Rerun now" />}>
      <IconButton
        size="md"
        className="text-muted"
        disabled={rerunCommand.isPending}
        onClick={() => {
          rerunCommand.mutate({id: item.id});
        }}
      >
        <EventRepeatIcon />
      </IconButton>
    </Tooltip>
  );
}
