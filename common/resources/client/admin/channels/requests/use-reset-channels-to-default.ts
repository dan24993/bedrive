import {useMutation} from '@tanstack/react-query';
import {useTrans} from '@common/i18n/use-trans';
import {toast} from '@common/ui/toast/toast';
import {message} from '@common/i18n/message';
import {apiClient, queryClient} from '@common/http/query-client';
import {DatatableDataQueryKey} from '@common/datatable/requests/paginated-resources';
import {BackendResponse} from '@common/http/backend-response/backend-response';
import {showHttpErrorToast} from '@common/utils/http/show-http-error-toast';

interface Response extends BackendResponse {}

export function useResetChannelsToDefault() {
  const {trans} = useTrans();
  return useMutation({
    mutationFn: () => resetChannels(),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: DatatableDataQueryKey('channel'),
      });
      toast(trans(message('Channels reset to default')));
    },
    onError: err => showHttpErrorToast(err),
  });
}

function resetChannels(): Promise<Response> {
  return apiClient.post('channel/reset-to-default').then(r => r.data);
}
