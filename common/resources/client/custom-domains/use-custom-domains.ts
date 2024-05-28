import {useQuery} from '@tanstack/react-query';
import {CustomDomain} from '@common/custom-domains/custom-domain';
import {apiClient} from '@common/http/query-client';
import {PaginatedBackendResponse} from '@common/http/backend-response/pagination-response';

interface Response<R> extends PaginatedBackendResponse<CustomDomain<R>> {}

interface Payload {
  userId?: number | string;
  perPage?: number | string;
  with?: string;
  workspaceId?: number | string | null;
}

export function useCustomDomains<R>(payload?: Payload) {
  return useQuery({
    queryKey: ['custom-domain', payload],
    queryFn: () => fetchCustomDomains<R>(payload),
  });
}

function fetchCustomDomains<R>(payload?: Payload) {
  return apiClient
    .get<Response<R>>('custom-domain', {params: payload})
    .then(response => response.data);
}
