import React, {useContext} from 'react';
import {GetDatatableDataParams} from '../requests/paginated-resources';
import {UseQueryResult} from '@tanstack/react-query';
import {PaginatedBackendResponse} from '../../http/backend-response/pagination-response';

export interface DataTableContextValue<T = unknown, A = unknown> {
  selectedRows: (string | number)[];
  setSelectedRows: (keys: (string | number)[]) => void;
  endpoint: string;
  params: GetDatatableDataParams;
  setParams: (value: GetDatatableDataParams) => void;
  query: UseQueryResult<PaginatedBackendResponse<T> & A, unknown>;
}

export const DataTableContext = React.createContext<DataTableContextValue>(
  null!,
);

export function useDataTable<T = unknown, A = unknown>() {
  return useContext(DataTableContext) as DataTableContextValue<T, A>;
}
