import {useQuery} from '@tanstack/react-query';
import {apiClient} from '@common/http/query-client';
import {BackendResponse} from '@common/http/backend-response/backend-response';
import {useParams} from 'react-router-dom';
import {Channel} from '@common/channels/channel';
import {useChannelQueryParams} from '@common/channels/use-channel-query-params';
import {isSsr} from '@common/utils/dom/is-ssr';
import {getBootstrapData} from '@common/core/bootstrap-data/use-backend-bootstrap-data';

export interface GetChannelResponse extends BackendResponse {
  channel: Channel;
}

export function useChannel(
  slugOrId: string | number | undefined,
  loader: 'channelPage' | 'editChannelPage' | 'editUserListPage',
  userParams?: Record<string, string | null>,
) {
  const params = useParams();
  const channelId = slugOrId || params.slugOrId!;
  const queryParams = useChannelQueryParams(undefined, userParams);
  return useQuery({
    // only refetch when channel ID or restriction changes and not query params.
    // content will be re-fetched in channel content components
    // on SSR use query params as well, to avoid caching wrong data when query params change
    queryKey: isSsr()
      ? channelQueryKey(channelId, queryParams)
      : channelQueryKey(channelId, {restriction: queryParams.restriction}),

    queryFn: () => fetchChannel(channelId, {...queryParams, loader}),
    initialData: () => {
      // @ts-ignore
      const data = getBootstrapData().loaders?.[loader];
      const isSameChannel =
        data?.channel.id == channelId || data?.channel.slug == channelId;
      const isSameRestriction =
        !queryParams.restriction ||
        data?.channel.restriction?.name === queryParams.restriction;
      if (isSameChannel && isSameRestriction) {
        return data;
      }
    },
  });
}

export function channelQueryKey(
  slugOrId: number | string,
  params?: Record<string, string | null>,
) {
  return ['channel', `${slugOrId}`, params];
}

export function channelEndpoint(slugOrId: number | string) {
  return `channel/${slugOrId}`;
}

function fetchChannel(
  slugOrId: number | string,
  params: Record<string, string | number | undefined | null> = {},
): Promise<GetChannelResponse> {
  return apiClient
    .get(channelEndpoint(slugOrId), {params})
    .then(response => response.data);
}
