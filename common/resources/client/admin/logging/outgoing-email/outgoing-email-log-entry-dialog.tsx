import {Dialog} from '@common/ui/overlays/dialog/dialog';
import {DialogHeader} from '@common/ui/overlays/dialog/dialog-header';
import {Trans} from '@common/i18n/trans';
import {DialogBody} from '@common/ui/overlays/dialog/dialog-body';
import {Button} from '@common/ui/buttons/button';
import {useOutgoingEmailLogItemWithMime} from '@common/admin/logging/outgoing-email/use-outgoing-email-log-item-with-mime';
import {ProgressCircle} from '@common/ui/progress/progress-circle';
import {downloadFileFromUrl} from '@common/uploads/utils/download-file-from-url';
import {useSettings} from '@common/core/settings/use-settings';

interface Props {
  logItemId: number;
}
export function OutgoingEmailLogEntryDialog({logItemId}: Props) {
  const {data} = useOutgoingEmailLogItemWithMime(logItemId);
  const {base_url} = useSettings();
  return (
    <Dialog size="fullscreen">
      <DialogHeader
        showDivider
        padding="px-24 py-10"
        actions={
          <Button
            variant="outline"
            size="xs"
            disabled={!data}
            type="button"
            onClick={
              data
                ? () =>
                    downloadFileFromUrl(
                      `${base_url}/api/v1/logs/outgoing-email/${logItemId}/download`,
                    )
                : undefined
            }
          >
            <Trans message="Download" />
          </Button>
        }
      >
        <Trans message="Email preview" />
      </DialogHeader>
      <DialogBody>
        {data ? (
          <iframe
            srcDoc={data.logItem.parsed_message!.body.html}
            className="h-max w-full border-none"
            onLoad={e => {
              const iframe = e.target as HTMLIFrameElement;
              iframe.style.height =
                iframe.contentWindow!.document.body.scrollHeight + 'px';
            }}
          />
        ) : (
          <div className="flex min-h-200 items-center justify-center">
            <ProgressCircle isIndeterminate />
          </div>
        )}
      </DialogBody>
    </Dialog>
  );
}
