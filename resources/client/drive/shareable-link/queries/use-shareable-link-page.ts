import {keepPreviousData, useInfiniteQuery} from '@tanstack/react-query';
import {useParams} from 'react-router-dom';
import type {FetchShareableLinkResponse} from './use-entry-shareable-link';
import type {DriveEntry} from '../../files/drive-entry';
import {DriveQueryKeys} from '../../drive-query-keys';
import {
  linkPageState,
  useLinkPageStore,
} from '../shareable-link-page/link-page-store';
import {LengthAwarePaginationResponse} from '@common/http/backend-response/pagination-response';
import {apiClient} from '@common/http/query-client';
import {getBootstrapData} from '@common/core/bootstrap-data/use-backend-bootstrap-data';

export interface FetchShareableLinkPageResponse
  extends FetchShareableLinkResponse {
  folderChildren: LengthAwarePaginationResponse<DriveEntry>;
  passwordInvalid: boolean;
}

export function useShareableLinkPage() {
  const {hash} = useParams();
  const {orderBy, orderDir} = useLinkPageStore(s => s.activeSort);
  const order = `${orderBy}:${orderDir}`;
  const isPasswordProtected = useLinkPageStore(s => s.isPasswordProtected);
  const password = useLinkPageStore(s => s.password);

  const query = useInfiniteQuery({
    queryKey: DriveQueryKeys.fetchShareableLink({hash, sort: order}),
    queryFn: async ({pageParam = 1}) => {
      const response = await fetchLinkByHash({
        hash: hash!,
        page: pageParam,
        order,
        password,
      });
      if (response.passwordInvalid) {
        linkPageState().setIsPasswordProtected(true);
      }
      return response;
    },
    initialData: () => {
      const data = getBootstrapData().loaders?.shareableLinkPage;
      if (data && data.link?.hash === hash) {
        if (data.passwordInvalid) {
          linkPageState().setIsPasswordProtected(true);
        }
        return {
          pageParams: [undefined, 1],
          pages: [data],
        };
      }
    },
    initialPageParam: 1,
    getNextPageParam: lastResponse => {
      if (!lastResponse.folderChildren) return undefined;
      const currentPage = lastResponse.folderChildren.current_page;
      const lastPage = lastResponse.folderChildren.last_page;
      if (currentPage >= lastPage) {
        return undefined;
      }
      return currentPage + 1;
    },
    // disable query if link is password protected and correct
    // password was not entered yet, to prevent unnecessary requests
    enabled: (!!hash && !isPasswordProtected) || password != null,
    placeholderData: keepPreviousData,
  });

  return {
    ...query,
    link: query.data?.pages[0].link,
    entries: query.data?.pages.flatMap(p => p.folderChildren?.data),
  };
}

interface FetchLinkByHashParams {
  hash: string;
  page?: number;
  order?: string;
  password?: string | null;
}
function fetchLinkByHash({
  hash,
  page = 1,
  order,
  password,
}: FetchLinkByHashParams): Promise<FetchShareableLinkPageResponse> {
  return apiClient
    .get(`shareable-links/${hash}`, {
      params: {loader: 'shareableLinkPage', page, order, password},
    })
    .then(response => response.data);
}
