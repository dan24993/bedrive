import {useMutation} from '@tanstack/react-query';
import {BackendResponse} from '@common/http/backend-response/backend-response';
import {CustomPage} from '../custom-page';
import {apiClient, queryClient} from '@common/http/query-client';
import {showHttpErrorToast} from '@common/utils/http/show-http-error-toast';
import {DatatableDataQueryKey} from '@common/datatable/requests/paginated-resources';
import {toast} from '@common/ui/toast/toast';
import {message} from '@common/i18n/message';
import {useParams} from 'react-router-dom';
import {CreateCustomPagePayload} from '@common/admin/custom-pages/requests/use-create-custom-page';

interface Response extends BackendResponse {
  page: CustomPage;
}

export function useUpdateCustomPage(endpoint?: string) {
  const {pageId} = useParams();
  const finalEndpoint = `${endpoint || 'custom-pages'}/${pageId}`;
  return useMutation({
    mutationFn: (payload: CreateCustomPagePayload) =>
      updatePage(payload, finalEndpoint),
    onError: err => showHttpErrorToast(err),
    onSuccess: async () => {
      await queryClient.invalidateQueries({queryKey: ['custom-pages']});
      await queryClient.invalidateQueries({
        queryKey: DatatableDataQueryKey(finalEndpoint),
      });
      toast(message('Page updated'));
    },
  });
}

function updatePage(
  payload: CreateCustomPagePayload,
  endpoint: string,
): Promise<Response> {
  return apiClient.put(`${endpoint}`, payload).then(r => r.data);
}
