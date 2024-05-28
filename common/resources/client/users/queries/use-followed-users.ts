import {useQuery} from '@tanstack/react-query';
import {apiClient} from '@common/http/query-client';
import {BackendResponse} from '@common/http/backend-response/backend-response';
import {useAuth} from '@common/auth/use-auth';
import {User} from '@common/auth/user';

interface Response extends BackendResponse {
  ids: number[];
}

export function useFollowedUsers() {
  const {user} = useAuth();
  return useQuery({
    queryKey: ['users', 'followed', 'ids'],
    queryFn: () => fetchIds(),
    enabled: !!user,
  });
}

export function useIsUserFollowing(user: User) {
  const {data, isLoading} = useFollowedUsers();
  return {
    isLoading,
    isFollowing: !!data?.ids.includes(user.id),
  };
}

function fetchIds() {
  return apiClient
    .get<Response>(`users/me/followed-users/ids`)
    .then(response => response.data);
}
