import {useMutation} from '@tanstack/react-query';
import {apiClient, queryClient} from '@common/http/query-client';
import {BackendResponse} from '@common/http/backend-response/backend-response';
import {showHttpErrorToast} from '@common/utils/http/show-http-error-toast';
import {DatatableDataQueryKey} from '@common/datatable/requests/paginated-resources';
import {CustomDomain} from '@common/custom-domains/custom-domain';

interface Response extends BackendResponse {
  domain: CustomDomain;
}

interface Payload {
  domainId: number | string;
  host?: string;
  global?: boolean;
  resource_id?: number | null;
  resource_type?: string | null;
}

export function useUpdateDomain() {
  return useMutation({
    mutationFn: (props: Payload) => updateDomain(props),
    onSuccess: (response, props) => {
      return queryClient.invalidateQueries({
        queryKey: DatatableDataQueryKey('custom-domain'),
      });
    },
    onError: err => showHttpErrorToast(err),
  });
}

function updateDomain(payload: Payload): Promise<Response> {
  return apiClient
    .put(`custom-domain/${payload.domainId}`, payload)
    .then(r => r.data);
}
