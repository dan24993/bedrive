import {useMutation} from '@tanstack/react-query';
import {apiClient, queryClient} from '@common/http/query-client';
import {useTrans} from '@common/i18n/use-trans';
import {BackendResponse} from '@common/http/backend-response/backend-response';
import {toast} from '@common/ui/toast/toast';
import {message} from '@common/i18n/message';
import {Tag} from '@common/tags/tag';
import {DatatableDataQueryKey} from '@common/datatable/requests/paginated-resources';
import {onFormQueryError} from '@common/errors/on-form-query-error';
import {UseFormReturn} from 'react-hook-form';
import {slugifyString} from '@common/utils/string/slugify-string';

interface Response extends BackendResponse {
  tag: Tag;
}

interface Payload extends Partial<Tag> {}

export function useCreateNewTag(form: UseFormReturn<Payload>) {
  const {trans} = useTrans();
  return useMutation({
    mutationFn: (props: Payload) => createNewTag(props),
    onSuccess: () => {
      toast(trans(message('Tag created')));
      queryClient.invalidateQueries({queryKey: DatatableDataQueryKey('tags')});
    },
    onError: err => onFormQueryError(err, form),
  });
}

function createNewTag(payload: Payload): Promise<Response> {
  payload.name = slugifyString(payload.name!);
  return apiClient.post('tags', payload).then(r => r.data);
}
