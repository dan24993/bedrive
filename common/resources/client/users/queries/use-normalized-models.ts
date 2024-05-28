import {
  keepPreviousData,
  useQuery,
  UseQueryOptions,
} from '@tanstack/react-query';
import {NormalizedModel} from '../../datatable/filters/normalized-model';
import {apiClient} from '../../http/query-client';
import {BackendResponse} from '../../http/backend-response/backend-response';

interface Response extends BackendResponse {
  results: NormalizedModel[];
}

interface Params {
  query?: string;
  perPage?: number;
  with?: string;
}

export function useNormalizedModels(
  endpoint: string,
  queryParams: Params,
  queryOptions?: Omit<
    UseQueryOptions<Response, unknown, Response, [string, Params]>,
    'queryKey' | 'queryFn'
  > | null,
) {
  return useQuery({
    queryKey: [endpoint, queryParams],
    queryFn: () => fetchModels(endpoint, queryParams),
    placeholderData: keepPreviousData,
    ...queryOptions,
  });
}

async function fetchModels(endpoint: string, params: Params) {
  return apiClient.get<Response>(endpoint, {params}).then(r => r.data);
}
