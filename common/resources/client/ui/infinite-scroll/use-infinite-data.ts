import {
  hashKey,
  InfiniteData,
  keepPreviousData,
  useInfiniteQuery,
  UseInfiniteQueryResult,
} from '@tanstack/react-query';
import {apiClient} from '@common/http/query-client';
import {BackendResponse} from '@common/http/backend-response/backend-response';
import {
  hasNextPage,
  PaginationResponse,
} from '@common/http/backend-response/pagination-response';
import {useMemo, useRef, useState} from 'react';
import {SortDescriptor} from '@common/ui/tables/types/sort-descriptor';
import {GetDatatableDataParams} from '@common/datatable/requests/paginated-resources';
import {QueryKey} from '@tanstack/query-core/src/types';

export type UseInfiniteDataResult<
  T,
  E extends object = object,
> = UseInfiniteQueryResult<InfiniteData<PaginationResponse<T> & E>> & {
  items: T[];
  totalItems: number | null;
  // initial load is done and no results were returned from backend
  noResults: boolean;
  // true when changing filters or sorting, not on initial load, background fetch or infinite load
  isReloading: boolean;
  sortDescriptor: SortDescriptor;
  setSortDescriptor: (sortDescriptor: SortDescriptor) => void;
  searchQuery: string;
  setSearchQuery: (searchQuery: string) => void;
};

function buildQueryKey(
  {
    queryKey,
    defaultOrderDir,
    defaultOrderBy,
    queryParams,
  }: UseInfiniteDataProps<any>,
  sortDescriptor: SortDescriptor,
  searchQuery: string = '',
) {
  // make sure to always set default order dir and col so query keys are consistent
  if (!sortDescriptor.orderBy) {
    sortDescriptor.orderBy = defaultOrderBy;
  }
  if (!sortDescriptor.orderDir) {
    sortDescriptor.orderDir = defaultOrderDir;
  }
  return [...queryKey, sortDescriptor, searchQuery, queryParams];
}

interface Response<T> extends BackendResponse {
  pagination: PaginationResponse<T>;
}

export interface UseInfiniteDataProps<T> {
  initialPage?: PaginationResponse<T> | null;
  queryKey: QueryKey;
  queryParams?: Record<string, string | number | null>;
  endpoint: string;
  defaultOrderBy?: SortDescriptor['orderBy'];
  defaultOrderDir?: SortDescriptor['orderDir'];
  // whether user can sort items manually (table header, dropdown, etc)
  willSortOrFilter?: boolean;
  // ordering is not available with cursor pagination
  paginate?: 'simple' | 'lengthAware' | 'cursor';
  transformResponse?: (response: Response<T>) => Response<T>;
}
export function useInfiniteData<T, E extends object = {}>(
  props: UseInfiniteDataProps<T>,
): UseInfiniteDataResult<T, E> {
  const {
    initialPage,
    endpoint,
    defaultOrderBy,
    defaultOrderDir,
    queryParams,
    paginate,
    transformResponse,
    willSortOrFilter = false,
  } = props;
  const [searchQuery, setSearchQuery] = useState('');
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    orderBy: defaultOrderBy,
    orderDir: defaultOrderDir,
  });

  const queryKey = buildQueryKey(props, sortDescriptor, searchQuery);
  const initialQueryKey = useRef(hashKey(queryKey)).current;

  const query = useInfiniteQuery({
    placeholderData: willSortOrFilter ? keepPreviousData : undefined,
    queryKey,
    queryFn: ({pageParam, signal}) => {
      const params: GetDatatableDataParams = {
        ...queryParams,
        perPage: initialPage?.per_page || queryParams?.perPage,
        query: (queryParams?.query as string) ?? searchQuery,
        paginate,
        ...sortDescriptor,
      };
      if (paginate === 'cursor') {
        params.cursor = pageParam;
      } else {
        params.page = pageParam || 1;
      }
      return fetchData<T>(endpoint, params, transformResponse, signal);
    },
    initialPageParam: paginate === 'cursor' ? '' : 1,
    getNextPageParam: lastResponse => {
      if (!hasNextPage(lastResponse.pagination)) {
        return null;
      }
      if ('next_cursor' in lastResponse.pagination) {
        return lastResponse.pagination.next_cursor;
      }
      return lastResponse.pagination.current_page + 1;
    },
    initialData: () => {
      // initial data will be for initial query key only, remove
      // initial data if query key changes, so query is reset
      if (!initialPage || hashKey(queryKey) !== initialQueryKey) {
        return undefined;
      }

      return {
        pageParams: [undefined, 1],
        pages: [{pagination: initialPage}],
      };
    },
  });

  const items = useMemo(() => {
    return query.data?.pages.flatMap(p => p.pagination.data) || [];
  }, [query.data?.pages]);

  const firstPage = query.data?.pages[0].pagination;
  const totalItems =
    firstPage && 'total' in firstPage && firstPage.total
      ? firstPage.total
      : null;

  return {
    ...query,
    items,
    totalItems,
    noResults: query.data?.pages?.[0].pagination.data.length === 0,
    // can't use "isRefetching", it's true for some reason when changing sorting or filters
    isReloading:
      query.isFetching && !query.isFetchingNextPage && query.isPlaceholderData,
    sortDescriptor,
    setSortDescriptor,
    searchQuery,
    setSearchQuery,
  } as UseInfiniteDataResult<T, E>;
}

async function fetchData<T>(
  endpoint: string,
  params: GetDatatableDataParams,
  transformResponse?: UseInfiniteDataProps<T>['transformResponse'],
  signal?: AbortSignal,
): Promise<Response<T>> {
  if (params.query) {
    await new Promise(resolve => setTimeout(resolve, 300));
  }
  return apiClient
    .get(endpoint, {params, signal: params.query ? signal : undefined})
    .then(r => {
      if (transformResponse) {
        return transformResponse(r.data);
      }
      return r.data;
    });
}
