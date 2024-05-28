import {DataTablePage} from '@common/datatable/page/data-table-page';
import {Trans} from '@common/i18n/trans';
import {DataTableEmptyStateMessage} from '@common/datatable/page/data-table-emty-state-message';
import React from 'react';
import {ScheduleDatatableColumns} from '@common/admin/logging/schedule/schedule-datatable-columns';
import timelineImage from '@common/admin/logging/schedule/timeline.svg';
import {DataTableAddItemButton} from '@common/datatable/data-table-add-item-button';
import {DownloadIcon} from '@common/icons/material/Download';

export function ScheduleLogDatatable() {
  return (
    <DataTablePage
      padding="pt-12 md:pt-24"
      endpoint="logs/schedule"
      title={<Trans message="CRON schedule log" />}
      columns={ScheduleDatatableColumns}
      actions={<Actions />}
      enableSelection={false}
      emptyStateMessage={
        <DataTableEmptyStateMessage
          image={timelineImage}
          title={<Trans message="No scheduled commands have ran yet" />}
          filteringTitle={<Trans message="No matching scheduled commands" />}
        />
      }
    />
  );
}

function Actions() {
  return (
    <DataTableAddItemButton
      elementType="a"
      href="api/v1/logs/schedule/download"
      download
      icon={<DownloadIcon />}
    >
      <Trans message="Download log" />
    </DataTableAddItemButton>
  );
}
