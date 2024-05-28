import {useMutation} from '@tanstack/react-query';
import {apiClient, queryClient} from '@common/http/query-client';
import {showHttpErrorToast} from '@common/utils/http/show-http-error-toast';
import {toast} from '@common/ui/toast/toast';
import {useTrans} from '@common/i18n/use-trans';
import {message} from '@common/i18n/message';
import {DatatableDataQueryKey} from '@common/datatable/requests/paginated-resources';

interface Payload {
  identifier: string;
}

export function useDeleteErrorLog() {
  const {trans} = useTrans();
  return useMutation({
    mutationFn: (payload: Payload) => deleteLogFile(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: DatatableDataQueryKey('logs/error'),
      });
      toast(trans(message('Log file deleted')));
    },
    onError: err => showHttpErrorToast(err),
  });
}

function deleteLogFile({identifier}: Payload) {
  return apiClient.delete(`logs/error/${identifier}`).then(r => r.data);
}
