import {useQuery} from '@tanstack/react-query';
import {NormalizedModel} from '../../datatable/filters/normalized-model';
import {apiClient} from '../../http/query-client';
import {BackendResponse} from '../../http/backend-response/backend-response';

interface Response extends BackendResponse {
  model: NormalizedModel;
}

export function useNormalizedModel(
  endpoint: string,
  queryParams?: Record<string, string>,
  queryOptions?: {enabled?: boolean},
) {
  return useQuery({
    queryKey: [endpoint, queryParams],
    queryFn: () => fetchModel(endpoint, queryParams),
    ...queryOptions,
  });
}

async function fetchModel(
  endpoint: string,
  params?: Record<string, string>,
): Promise<Response> {
  return apiClient.get(endpoint, {params}).then(r => r.data);
}
