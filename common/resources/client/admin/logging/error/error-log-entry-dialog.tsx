import {Dialog} from '@common/ui/overlays/dialog/dialog';
import {DialogHeader} from '@common/ui/overlays/dialog/dialog-header';
import {Trans} from '@common/i18n/trans';
import {ErrorLogItem} from '@common/admin/logging/error/error-log-item';
import {DialogBody} from '@common/ui/overlays/dialog/dialog-body';
import {Button} from '@common/ui/buttons/button';

interface Props {
  error: ErrorLogItem;
}
export function ErrorLogEntryDialog({error}: Props) {
  return (
    <Dialog size="fullscreen">
      <DialogHeader
        showDivider
        padding="px-24 py-10"
        actions={
          <Button
            variant="outline"
            size="xs"
            onClick={() => downloadLogItem(error)}
          >
            <Trans message="Download" />
          </Button>
        }
      >
        <Trans message="Error details" />
      </DialogHeader>
      <DialogBody>
        <pre className="whitespace-pre-wrap break-words text-xs leading-5">
          {error.exception}
        </pre>
      </DialogBody>
    </Dialog>
  );
}

function downloadLogItem(item: ErrorLogItem) {
  const el = document.createElement('a');
  el.setAttribute(
    'href',
    'data:text/plain;charset=utf-8,' + encodeURIComponent(item.exception),
  );
  el.setAttribute('download', `error-${item.id}.log`);

  el.style.display = 'none';
  document.body.appendChild(el);
  el.click();
  document.body.removeChild(el);
}
