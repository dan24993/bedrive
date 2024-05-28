import {UseQueryResult} from '@tanstack/react-query';
import {
  hasNextPage,
  LengthAwarePaginationResponse,
  PaginatedBackendResponse,
} from '../http/backend-response/pagination-response';
import {useNumberFormatter} from '../i18n/use-number-formatter';
import {Select} from '../ui/forms/select/select';
import {Trans} from '../i18n/trans';
import {Item} from '../ui/forms/listbox/item';
import {IconButton} from '../ui/buttons/icon-button';
import {KeyboardArrowLeftIcon} from '../icons/material/KeyboardArrowLeft';
import {KeyboardArrowRightIcon} from '../icons/material/KeyboardArrowRight';
import React from 'react';
import {useIsMobileMediaQuery} from '../utils/hooks/is-mobile-media-query';
import clsx from 'clsx';

const defaultPerPage = 15;
const perPageOptions = [{key: 10}, {key: 15}, {key: 20}, {key: 50}, {key: 100}];

type DataTablePaginationFooterProps = {
  query: UseQueryResult<PaginatedBackendResponse<unknown>, unknown>;
  onPerPageChange?: (perPage: number) => void;
  onPageChange?: (page: number) => void;
  className?: string;
};
export function DataTablePaginationFooter({
  query,
  onPerPageChange,
  onPageChange,
  className,
}: DataTablePaginationFooterProps) {
  const isMobile = useIsMobileMediaQuery();
  const numberFormatter = useNumberFormatter();
  const pagination = query.data
    ?.pagination as LengthAwarePaginationResponse<any>;

  if (!pagination) return null;

  const perPageSelect = onPerPageChange ? (
    <Select
      minWidth="min-w-auto"
      selectionMode="single"
      disabled={query.isLoading}
      labelPosition="side"
      size="xs"
      label={<Trans message="Items per page" />}
      selectedValue={pagination.per_page || defaultPerPage}
      onSelectionChange={value => onPerPageChange(value as number)}
    >
      {perPageOptions.map(option => (
        <Item key={option.key} value={option.key}>
          {option.key}
        </Item>
      ))}
    </Select>
  ) : null;

  return (
    <div
      className={clsx(
        'flex h-54 select-none items-center justify-end gap-20 px-20',
        className,
      )}
    >
      {!isMobile && perPageSelect}
      {pagination.from && pagination.to && 'total' in pagination ? (
        <div className="text-sm">
          <Trans
            message=":from - :to of :total"
            values={{
              from: pagination.from,
              to: pagination.to,
              total: numberFormatter.format(pagination.total),
            }}
          />
        </div>
      ) : null}
      <div className="text-muted">
        <IconButton
          disabled={query.isFetching || pagination.current_page < 2}
          onClick={() => {
            onPageChange?.(pagination?.current_page - 1);
          }}
        >
          <KeyboardArrowLeftIcon />
        </IconButton>
        <IconButton
          disabled={query.isFetching || !hasNextPage(pagination)}
          onClick={() => {
            onPageChange?.(pagination?.current_page + 1);
          }}
        >
          <KeyboardArrowRightIcon />
        </IconButton>
      </div>
    </div>
  );
}
