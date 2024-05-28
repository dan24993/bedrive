import {useMutation} from '@tanstack/react-query';
import {BackendResponse} from '@common/http/backend-response/backend-response';
import {AppearanceValues} from '@common/admin/appearance/appearance-store';
import {toast} from '@common/ui/toast/toast';
import {apiClient, queryClient} from '@common/http/query-client';
import {showHttpErrorToast} from '@common/utils/http/show-http-error-toast';
import {message} from '@common/i18n/message';

interface Response extends BackendResponse {}

export function useSaveAppearanceChanges() {
  return useMutation({
    mutationFn: (values: Partial<AppearanceValues>) =>
      saveAppearanceChanges(values),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['admin/appearance/values'],
      });
      toast(message('Changes saved'));
    },
    onError: err => showHttpErrorToast(err),
  });
}

function saveAppearanceChanges(
  changes: Partial<AppearanceValues>,
): Promise<Response> {
  return apiClient.post(`admin/appearance`, {changes}).then(r => r.data);
}
