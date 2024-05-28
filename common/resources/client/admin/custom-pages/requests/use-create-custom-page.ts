import {useMutation} from '@tanstack/react-query';
import {BackendResponse} from '@common/http/backend-response/backend-response';
import {CustomPage} from '../custom-page';
import {apiClient, queryClient} from '@common/http/query-client';
import {showHttpErrorToast} from '@common/utils/http/show-http-error-toast';
import {DatatableDataQueryKey} from '@common/datatable/requests/paginated-resources';
import {toast} from '@common/ui/toast/toast';
import {message} from '@common/i18n/message';

interface Response extends BackendResponse {
  page: CustomPage;
}

export interface CreateCustomPagePayload {
  title?: string;
  body?: string;
  slug?: string;
  hide_nav?: boolean;
}

export function useCreateCustomPage(endpoint?: string) {
  const finalEndpoint = endpoint || 'custom-pages';
  return useMutation({
    mutationFn: (payload: CreateCustomPagePayload) =>
      createPage(payload, finalEndpoint),
    onError: err => showHttpErrorToast(err),
    onSuccess: async () => {
      await queryClient.invalidateQueries({queryKey: ['custom-pages']});
      await queryClient.invalidateQueries({
        queryKey: DatatableDataQueryKey(finalEndpoint),
      });
      toast(message('Page created'));
    },
  });
}

function createPage(
  payload: CreateCustomPagePayload,
  endpoint: string,
): Promise<Response> {
  return apiClient.post(`${endpoint}`, payload).then(r => r.data);
}
