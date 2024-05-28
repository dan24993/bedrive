import {useMutation} from '@tanstack/react-query';
import {BackendResponse} from '@common/http/backend-response/backend-response';
import {useLogout} from '@common/auth/requests/logout';
import {toast} from '@common/ui/toast/toast';
import {useAuth} from '@common/auth/use-auth';
import {apiClient} from '@common/http/query-client';
import {showHttpErrorToast} from '@common/utils/http/show-http-error-toast';

interface Response extends BackendResponse {}

export function useDeleteAccount() {
  const {user} = useAuth();
  const logout = useLogout();
  return useMutation({
    mutationFn: () => deleteAccount(user!.id),
    onSuccess: () => {
      toast('Account deleted');
      logout.mutate();
    },
    onError: err => showHttpErrorToast(err),
  });
}

function deleteAccount(userId: number): Promise<Response> {
  return apiClient
    .delete(`users/${userId}`, {params: {deleteCurrentUser: true}})
    .then(r => r.data);
}
