import {keepPreviousData, useQuery} from '@tanstack/react-query';
import {apiClient} from '@common/http/query-client';
import {BackendResponse} from '@common/http/backend-response/backend-response';
import {NormalizedModel} from '@common/datatable/filters/normalized-model';

export interface SearchResponse extends BackendResponse {
  results: NormalizedModel[];
}

interface SearchParams {
  query?: string;
  limit?: number;
  modelType: string;
}

export function useAddableContent(params: SearchParams) {
  return useQuery({
    queryKey: ['search', params],
    queryFn: () => search(params),
    //enabled: !!params.query,
    placeholderData: params.query ? keepPreviousData : undefined,
  });
}

function search(params: SearchParams) {
  return apiClient
    .get<SearchResponse>(`channel/search-for-addable-content`, {params})
    .then(response => response.data);
}
