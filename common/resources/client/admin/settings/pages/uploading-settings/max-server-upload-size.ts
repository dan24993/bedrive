import {useQuery} from '@tanstack/react-query';
import {BackendResponse} from '@common/http/backend-response/backend-response';
import {apiClient} from '@common/http/query-client';

export interface FetchMaxServerUploadSizeResponse extends BackendResponse {
  maxSize: string;
}

function fetchMaxServerUploadSize(): Promise<FetchMaxServerUploadSizeResponse> {
  return apiClient
    .get('uploads/server-max-file-size')
    .then(response => response.data);
}

export function useMaxServerUploadSize() {
  return useQuery({
    queryKey: ['MaxServerUploadSize'],
    queryFn: () => fetchMaxServerUploadSize(),
  });
}
