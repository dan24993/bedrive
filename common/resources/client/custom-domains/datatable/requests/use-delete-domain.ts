import {useMutation} from '@tanstack/react-query';
import {apiClient, queryClient} from '@common/http/query-client';
import {useTrans} from '@common/i18n/use-trans';
import {BackendResponse} from '@common/http/backend-response/backend-response';
import {showHttpErrorToast} from '@common/utils/http/show-http-error-toast';
import {message} from '@common/i18n/message';
import {toast} from '@common/ui/toast/toast';
import {DatatableDataQueryKey} from '@common/datatable/requests/paginated-resources';
import {CustomDomain} from '@common/custom-domains/custom-domain';
import {removeProtocol} from '@common/utils/urls/remove-protocol';

interface Response extends BackendResponse {}

interface Payload {
  domain: CustomDomain;
}

export function useDeleteDomain() {
  const {trans} = useTrans();
  return useMutation({
    mutationFn: (props: Payload) => deleteDomain(props),
    onSuccess: (response, props) => {
      toast.positive(
        trans(
          message('“:domain” removed', {
            values: {domain: removeProtocol(props.domain.host)},
          }),
        ),
      );
      queryClient.invalidateQueries({
        queryKey: DatatableDataQueryKey('custom-domain'),
      });
    },
    onError: err => showHttpErrorToast(err),
  });
}

function deleteDomain({domain}: Payload): Promise<Response> {
  return apiClient.delete(`custom-domain/${domain.id}`).then(r => r.data);
}
