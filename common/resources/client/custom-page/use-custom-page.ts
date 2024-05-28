import {useQuery} from '@tanstack/react-query';
import {apiClient} from '../http/query-client';
import {BackendResponse} from '../http/backend-response/backend-response';
import {CustomPage} from '../admin/custom-pages/custom-page';
import {useParams} from 'react-router-dom';
import {getBootstrapData} from '@common/core/bootstrap-data/use-backend-bootstrap-data';

const endpoint = (slugOrId: number | string) => `custom-pages/${slugOrId}`;

export interface FetchCustomPageResponse extends BackendResponse {
  page: CustomPage;
}

export function useCustomPage(pageId?: number | string) {
  const params = useParams();
  if (!pageId) {
    pageId = params.pageId;
  }
  return useQuery({
    queryKey: [endpoint(pageId!)],
    queryFn: () => fetchCustomPage(pageId!),
    initialData: () => {
      const data = getBootstrapData().loaders?.customPage;
      if (data?.page && (data.page.id == pageId || data.page.slug == pageId)) {
        return data;
      }
    },
  });
}

function fetchCustomPage(
  slugOrId: number | string,
): Promise<FetchCustomPageResponse> {
  return apiClient.get(endpoint(slugOrId)).then(response => response.data);
}
