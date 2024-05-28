import {useMutation} from '@tanstack/react-query';
import {apiClient, queryClient} from '@common/http/query-client';
import {useTrans} from '@common/i18n/use-trans';
import {BackendResponse} from '@common/http/backend-response/backend-response';
import {showHttpErrorToast} from '@common/utils/http/show-http-error-toast';
import {message} from '@common/i18n/message';
import {toast} from '@common/ui/toast/toast';
import {DatatableDataQueryKey} from '@common/datatable/requests/paginated-resources';

interface Response extends BackendResponse {}

interface Payload {
  id: number;
}

export function useRerunScheduledCommand() {
  const {trans} = useTrans();
  return useMutation({
    mutationFn: (payload: Payload) => rerunCommand(payload),
    onSuccess: async (response, props) => {
      await queryClient.invalidateQueries({
        queryKey: DatatableDataQueryKey('logs/schedule'),
      });
      toast.positive(trans(message('Command reran')));
    },
    onError: err => showHttpErrorToast(err),
  });
}

function rerunCommand({id}: Payload): Promise<Response> {
  return apiClient.post(`logs/schedule/rerun/${id}`).then(r => r.data);
}
