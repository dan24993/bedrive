import {ColumnConfig} from '@common/datatable/column-config';
import {Trans} from '@common/i18n/trans';
import React from 'react';
import {ErrorLogItem} from '@common/admin/logging/error/error-log-item';
import {InfoIcon} from '@common/icons/material/Info';
import {ErrorIcon} from '@common/icons/material/Error';
import clsx from 'clsx';
import {FormattedRelativeTime} from '@common/i18n/formatted-relative-time';

export const ErrorLogDatatableColumns: ColumnConfig<ErrorLogItem>[] = [
  {
    key: 'message',
    visibleInMode: 'all',
    width: 'flex-3 min-w-200',
    header: () => <Trans message="Message" />,
    body: item => item.message,
  },
  {
    key: 'datetime',
    header: () => <Trans message="Date" />,
    body: item => <FormattedRelativeTime date={item.datetime} />,
  },
  {
    key: 'severity',
    header: () => <Trans message="Severity" />,
    body: item => {
      return (
        <span
          className={clsx(
            'flex items-center gap-6 text-xs capitalize',
            item.level === 'error' ? 'text-danger' : 'text-primary',
          )}
        >
          {item.level === 'error' ? (
            <ErrorIcon size="sm" />
          ) : (
            <InfoIcon size="sm" />
          )}
          {item.level}
        </span>
      );
    },
  },
];
