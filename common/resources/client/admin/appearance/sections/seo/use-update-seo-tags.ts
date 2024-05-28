import {useMutation, useQueryClient} from '@tanstack/react-query';
import {apiClient} from '@common/http/query-client';
import {BackendResponse} from '@common/http/backend-response/backend-response';
import {showHttpErrorToast} from '@common/utils/http/show-http-error-toast';
import {toast} from '@common/ui/toast/toast';
import {message} from '@common/i18n/message';

interface Response extends BackendResponse {}

export function useUpdateSeoTags(name: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: {tags: string}) => updateTags(name, payload.tags),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['admin', 'seo-tags', name],
      });
      toast(message('Updated SEO tags'));
    },
    onError: err => showHttpErrorToast(err),
  });
}

function updateTags(name: string, tags: string): Promise<Response> {
  return apiClient
    .put(`admin/appearance/seo-tags/${name}`, {tags})
    .then(r => r.data);
}
