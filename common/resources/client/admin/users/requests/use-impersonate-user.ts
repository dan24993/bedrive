import {useMutation} from '@tanstack/react-query';
import {toast} from '@common/ui/toast/toast';
import {apiClient} from '@common/http/query-client';
import {message} from '@common/i18n/message';
import {BackendResponse} from '@common/http/backend-response/backend-response';
import {User} from '@common/auth/user';
import {showHttpErrorToast} from '@common/utils/http/show-http-error-toast';

interface Response extends BackendResponse {
  user: User;
}

interface Payload {
  userId: string | number;
}

export function useImpersonateUser() {
  return useMutation({
    mutationFn: (payload: Payload) => impersonateUser(payload),
    onSuccess: async response => {
      toast(message(`Impersonating User "${response.user.display_name}"`));
      window.location.href = '/';
    },
    onError: r => showHttpErrorToast(r),
  });
}

function impersonateUser(payload: Payload) {
  return apiClient
    .post<Response>(`admin/users/impersonate/${payload.userId}`, payload)
    .then(r => r.data);
}
