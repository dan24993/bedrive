import {BackendResponse} from '@common/http/backend-response/backend-response';
import {useMutation} from '@tanstack/react-query';
import {toast} from '@common/ui/toast/toast';
import {message} from '@common/i18n/message';
import {apiClient, queryClient} from '@common/http/query-client';
import {showHttpErrorToast} from '@common/utils/http/show-http-error-toast';
import {User} from '@common/auth/user';

interface Response extends BackendResponse {}

interface Payload {
  user: User;
}

export function useUnfollowUser() {
  return useMutation({
    mutationFn: (payload: Payload) => unfollowUser(payload),
    onSuccess: async (response, {user}) => {
      await queryClient.invalidateQueries({queryKey: ['users']});
      toast(
        message('Stopped following :name', {values: {name: user.display_name}}),
      );
    },
    onError: r => showHttpErrorToast(r),
  });
}

function unfollowUser({user}: Payload): Promise<Response> {
  return apiClient.post(`users/${user.id}/unfollow`).then(r => r.data);
}
