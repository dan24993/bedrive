import {useQuery} from '@tanstack/react-query';
import {BackendResponse} from '@common/http/backend-response/backend-response';
import {apiClient} from '@common/http/query-client';
import {AppearanceDefaults, AppearanceValues} from '../appearance-store';

export interface FetchAppearanceValuesResponse extends BackendResponse {
  values: AppearanceValues;
  defaults: AppearanceDefaults;
}

export function useAppearanceValues() {
  return useQuery({
    queryKey: ['admin/appearance/values'],
    queryFn: () => fetchAppearanceValues(),
    staleTime: Infinity,
  });
}

function fetchAppearanceValues(): Promise<FetchAppearanceValuesResponse> {
  return apiClient
    .get('admin/appearance/values')
    .then(response => response.data);
}
