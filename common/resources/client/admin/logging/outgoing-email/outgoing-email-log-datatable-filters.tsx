import {
  BackendFilter,
  FilterControlType,
  FilterOperator,
} from '@common/datatable/filters/backend-filter';
import {message} from '@common/i18n/message';
import {createdAtFilter} from '@common/datatable/filters/timestamp-filters';

export const OutgoingEmailLogDatatableFilters: BackendFilter[] = [
  {
    key: 'status',
    label: message('Status'),
    description: message('Status of the outgoing email'),
    defaultOperator: FilterOperator.eq,
    control: {
      type: FilterControlType.Select,
      defaultValue: '01',
      options: [
        {
          key: '01',
          label: message('Not sent'),
          value: 'no-sent',
        },
        {
          key: '02',
          label: message('Sent'),
          value: 'sent',
        },
        {
          key: '03',
          label: message('Error'),
          value: 'error',
        },
      ],
    },
  },
  createdAtFilter({
    description: message('Date email send was attempted'),
  }),
];
