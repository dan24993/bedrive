import {DataTablePage} from '@common/datatable/page/data-table-page';
import {Trans} from '@common/i18n/trans';
import {DataTableEmptyStateMessage} from '@common/datatable/page/data-table-emty-state-message';
import React from 'react';
import openedImage from '@common/admin/logging/outgoing-email/opened.svg';
import {DataTableAddItemButton} from '@common/datatable/data-table-add-item-button';
import {DownloadIcon} from '@common/icons/material/Download';
import {OutgoingEmailLogDatatableColumns} from '@common/admin/logging/outgoing-email/outgoing-email-log-datatable-columns';
import {OutgoingEmailLogDatatableFilters} from '@common/admin/logging/outgoing-email/outgoing-email-log-datatable-filters';

export function OutgoingEmailLogDatatable() {
  return (
    <DataTablePage
      padding="pt-12 md:pt-24"
      endpoint="logs/outgoing-email"
      title={<Trans message="Outgoing email" />}
      columns={OutgoingEmailLogDatatableColumns}
      filters={OutgoingEmailLogDatatableFilters}
      actions={<Actions />}
      enableSelection={false}
      emptyStateMessage={
        <DataTableEmptyStateMessage
          image={openedImage}
          title={<Trans message="No outgoing emails have been logged yet" />}
          filteringTitle={<Trans message="No matching emails" />}
        />
      }
    />
  );
}

function Actions() {
  return (
    <DataTableAddItemButton
      elementType="a"
      href="api/v1/logs/outgoing-email/download"
      download
      icon={<DownloadIcon />}
    >
      <Trans message="Download log" />
    </DataTableAddItemButton>
  );
}
