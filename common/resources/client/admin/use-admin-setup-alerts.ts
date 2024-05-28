import {useQuery} from '@tanstack/react-query';
import {apiClient} from '@common/http/query-client';
import {BackendResponse} from '@common/http/backend-response/backend-response';

export interface AdminSetupAlert {
  title: string;
  description: string;
}

interface Response extends BackendResponse {
  alerts: AdminSetupAlert[];
}

export function useAdminSetupAlerts() {
  return useQuery({
    queryKey: ['admin-setup-alerts'],
    queryFn: () => fetchAlerts(),
  });
}

function fetchAlerts() {
  return apiClient
    .get<Response>(`admin/setup-alerts`)
    .then(response => response.data);
}
