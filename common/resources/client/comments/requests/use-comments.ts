import {Commentable} from '@common/comments/commentable';
import {Comment} from '@common/comments/comment';
import {useInfiniteData} from '@common/ui/infinite-scroll/use-infinite-data';

interface QueryParams {
  perPage?: number;
}

export function commentsQueryKey(
  commentable: Commentable,
  params: QueryParams = {}
) {
  return ['comment', `${commentable.id}-${commentable.model_type}`, params];
}

export function useComments(
  commentable: Commentable,
  params: QueryParams = {}
) {
  return useInfiniteData<Comment>({
    queryKey: commentsQueryKey(commentable, params),
    endpoint: 'commentable/comments',
    //paginate: 'cursor',
    queryParams: {
      commentable_type: commentable.model_type,
      commentable_id: commentable.id,
      ...params,
    },
  });
}
