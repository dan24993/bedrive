import {useQuery} from '@tanstack/react-query';
import {apiClient} from '@common/http/query-client';
import {BackendResponse} from '@common/http/backend-response/backend-response';
import {OutgoingEmailLogItem} from '@common/admin/logging/outgoing-email/outgoing-email-log-item';

interface Response extends BackendResponse {
  logItem: OutgoingEmailLogItem;
}

export function useOutgoingEmailLogItemWithMime(id: number) {
  return useQuery({
    queryKey: ['logs/outgoing-email', id],
    queryFn: () => fetchLogItem(id),
  });
}

function fetchLogItem(id: number) {
  return apiClient.get<Response>(`logs/outgoing-email/${id}`).then(r => r.data);
}
