import {
  keepPreviousData,
  useQuery,
  UseQueryOptions,
} from '@tanstack/react-query';
import {PaginatedBackendResponse} from '../../http/backend-response/pagination-response';
import {apiClient} from '../../http/query-client';

export interface GetDatatableDataParams {
  orderBy?: string;
  orderDir?: 'asc' | 'desc';
  filters?: string | null;
  query?: string;
  with?: string;
  perPage?: number | string | null;
  page?: number | string;
  [key: string]: string | number | boolean | undefined | null;
}

export const DatatableDataQueryKey = (
  endpoint: string,
  params?: GetDatatableDataParams | Record<string, string | number | boolean>,
) => {
  // split endpoint by slash, so we can clear cache from the root later,
  // for example, 'link-group' will clear 'link-group/1/links' endpoint
  const key: (string | GetDatatableDataParams)[] = endpoint.split('/');
  if (params) {
    key.push(params);
  }
  return key;
};

export function useDatatableData<T = object>(
  endpoint: string,
  params: GetDatatableDataParams,
  options?: Omit<
    UseQueryOptions<
      PaginatedBackendResponse<T>,
      unknown,
      PaginatedBackendResponse<T>,
      any[]
    >,
    'queryKey' | 'queryFn'
  >,
  onLoad?: (data: PaginatedBackendResponse<T>) => void,
) {
  return useQuery({
    queryKey: DatatableDataQueryKey(endpoint, params),
    queryFn: ({signal}) => paginate<T>(endpoint, params, onLoad, signal),
    placeholderData: keepPreviousData,
    ...options,
  });
}

async function paginate<T>(
  endpoint: string,
  params: GetDatatableDataParams,
  onLoad?: (data: PaginatedBackendResponse<T>) => void,
  signal?: AbortSignal,
): Promise<PaginatedBackendResponse<T>> {
  if (params.query) {
    await new Promise(resolve => setTimeout(resolve, 300));
  }
  const response = await apiClient
    .get(endpoint, {params, signal: params.query ? signal : undefined})
    .then(response => response.data);
  onLoad?.(response);
  return response;
}
