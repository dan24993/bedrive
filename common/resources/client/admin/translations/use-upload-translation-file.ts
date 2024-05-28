import {useMutation} from '@tanstack/react-query';
import {toast} from '../../ui/toast/toast';
import {BackendResponse} from '../../http/backend-response/backend-response';
import {apiClient, queryClient} from '../../http/query-client';
import {message} from '../../i18n/message';
import {DatatableDataQueryKey} from '../../datatable/requests/paginated-resources';
import {Localization} from '../../i18n/localization';
import {showHttpErrorToast} from '../../utils/http/show-http-error-toast';
import {getLocalWithLinesQueryKey} from './use-locale-with-lines';
import {UploadedFile} from '@common/uploads/uploaded-file';

interface Response extends BackendResponse {
  localization: Localization;
}

interface Payload {
  file: UploadedFile;
  localeId: string | number;
}

export function useUploadTranslationFile() {
  return useMutation({
    mutationFn: (payload: Payload) => uploadFile(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: DatatableDataQueryKey('localizations'),
      });
      await queryClient.invalidateQueries({
        queryKey: getLocalWithLinesQueryKey(),
      });
      toast(message('Translation file uploaded'));
    },
    onError: r => showHttpErrorToast(r),
  });
}

function uploadFile({localeId, file}: Payload): Promise<Response> {
  const data = new FormData();
  data.append('file', file.native);
  return apiClient
    .post(`localizations/${localeId}/upload`, data)
    .then(r => r.data);
}
