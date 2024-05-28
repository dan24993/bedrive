import {useQuery} from '@tanstack/react-query';
import {PaginatedBackendResponse} from '@common/http/backend-response/pagination-response';
import {DatabaseNotification} from '@common/notifications/database-notification';
import {apiClient} from '@common/http/query-client';

const Endpoint = 'notifications';

export interface FetchUserNotificationsResponse
  extends PaginatedBackendResponse<DatabaseNotification> {
  //
}

interface Payload {
  perPage?: number;
}

export function useUserNotifications(payload?: Payload) {
  return useQuery({
    queryKey: useUserNotifications.key,
    queryFn: () => fetchUserNotifications(payload),
  });
}

function fetchUserNotifications(
  payload?: Payload,
): Promise<FetchUserNotificationsResponse> {
  return apiClient
    .get(Endpoint, {params: payload})
    .then(response => response.data);
}

useUserNotifications.key = [Endpoint];
