import {useQuery} from '@tanstack/react-query';
import {BackendResponse} from '@common/http/backend-response/backend-response';
import {
  NotificationSubscription,
  NotificationSubscriptionGroup,
} from '@common/notifications/subscriptions/notification-subscription';
import {apiClient} from '@common/http/query-client';

export interface FetchNotificationSubscriptionsResponse
  extends BackendResponse {
  available_channels: string[];
  subscriptions: NotificationSubscriptionGroup[];
  user_selections: NotificationSubscription[];
}

function fetchNotificationSubscriptions(): Promise<FetchNotificationSubscriptionsResponse> {
  return apiClient
    .get('notifications/me/subscriptions')
    .then(response => response.data);
}

export function useNotificationSubscriptions() {
  return useQuery({
    queryKey: ['notification-subscriptions'],
    queryFn: () => fetchNotificationSubscriptions(),
    staleTime: Infinity,
  });
}
