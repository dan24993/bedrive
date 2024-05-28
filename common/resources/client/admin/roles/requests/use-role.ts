import {useQuery} from '@tanstack/react-query';
import {BackendResponse} from '@common/http/backend-response/backend-response';
import {apiClient} from '@common/http/query-client';
import {Role} from '@common/auth/role';
import {useParams} from 'react-router-dom';

const Endpoint = (id: number | string) => `roles/${id}`;

export interface FetchRoleResponse extends BackendResponse {
  role: Role;
}

export function useRole() {
  const {roleId} = useParams();
  return useQuery({
    queryKey: [Endpoint(roleId!)],
    queryFn: () => fetchRole(roleId!),
  });
}

function fetchRole(roleId: number | string): Promise<FetchRoleResponse> {
  return apiClient.get(Endpoint(roleId)).then(response => response.data);
}
