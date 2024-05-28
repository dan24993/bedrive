import {hashKey, keepPreviousData, useQuery} from '@tanstack/react-query';
import {apiClient} from '@common/http/query-client';
import {Channel, ChannelContentItem} from '@common/channels/channel';
import {
  channelEndpoint,
  channelQueryKey,
} from '@common/channels/requests/use-channel';
import {PaginatedBackendResponse} from '@common/http/backend-response/pagination-response';
import {useRef} from 'react';
import {useChannelQueryParams} from '@common/channels/use-channel-query-params';

interface Response<T extends ChannelContentItem = ChannelContentItem>
  extends PaginatedBackendResponse<T> {}

export function useChannelContent<
  T extends ChannelContentItem = ChannelContentItem,
>(channel: Channel<T>) {
  const queryParams = useChannelQueryParams(channel);
  const queryKey = channelQueryKey(channel.id, queryParams);
  const initialQueryKey = useRef(hashKey(queryKey)).current;

  return useQuery({
    queryKey: channelQueryKey(channel.id, queryParams),
    queryFn: () => fetchChannelContent<T>(channel.id, queryParams),
    placeholderData: keepPreviousData,
    initialData: () => {
      if (hashKey(queryKey) === initialQueryKey) {
        return channel.content?.data;
      }
      return undefined;
    },
  });
}

function fetchChannelContent<T extends ChannelContentItem = ChannelContentItem>(
  slugOrId: number | string,
  params: any,
) {
  return apiClient
    .get<Response<T>>(channelEndpoint(slugOrId), {
      params: {
        ...params,
        paginate: 'simple',
        returnContentOnly: 'true',
      },
    })
    .then(response => response.data.pagination.data);
}
