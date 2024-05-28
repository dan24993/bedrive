import {useQuery} from '@tanstack/react-query';
import {apiClient} from '@common/http/query-client';
import {PaginationResponse} from '@common/http/backend-response/pagination-response';
import {BackendResponse} from '@common/http/backend-response/backend-response';
import {Tag} from '@common/tags/tag';

interface Response extends BackendResponse {
  pagination: PaginationResponse<Tag>;
}

interface Params {
  type?: string;
  notType?: string;
  perPage?: number;
  query?: string;
}

export function useTags(params: Params) {
  return useQuery({
    queryKey: ['tags', params],
    queryFn: () => fetchTags(params),
  });
}

function fetchTags(params: Params) {
  return apiClient
    .get<Response>(`tags`, {
      params: {paginate: 'simple', ...params},
    })
    .then(response => response.data);
}
