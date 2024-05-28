import React, {MutableRefObject, ReactNode, Suspense, useState} from 'react';
import {Dialog} from '../ui/overlays/dialog/dialog';
import {DialogHeader} from '../ui/overlays/dialog/dialog-header';
import {Trans} from '../i18n/trans';
import {DialogBody} from '../ui/overlays/dialog/dialog-body';
import {ProgressCircle} from '../ui/progress/progress-circle';
import {useDialogContext} from '../ui/overlays/dialog/dialog-context';
import {DialogFooter} from '../ui/overlays/dialog/dialog-footer';
import {Button} from '../ui/buttons/button';
import type ReactAce from 'react-ace';

const AceEditor = React.lazy(() => import('./ace-editor'));

interface TextEditorSourcecodeDialogProps {
  defaultValue: string;
  mode?: 'css' | 'html' | 'php_laravel_blade';
  title: ReactNode;
  onSave?: (value?: string) => void;
  isSaving?: boolean;
  footerStartAction?: ReactNode;
  beautify?: boolean;
  editorRef?: MutableRefObject<ReactAce | null>;
}
export function AceDialog({
  defaultValue,
  mode = 'html',
  title,
  onSave,
  isSaving,
  footerStartAction,
  beautify,
  editorRef,
}: TextEditorSourcecodeDialogProps) {
  const [value, setValue] = useState(defaultValue);
  const [isValid, setIsValid] = useState<boolean>(true);

  return (
    <Dialog size="fullscreen" className="h-full w-full">
      <DialogHeader>{title}</DialogHeader>
      <DialogBody className="relative flex-auto" padding="p-0">
        <Suspense
          fallback={
            <div className="flex h-400 w-full items-center justify-center">
              <ProgressCircle
                aria-label="Loading editor..."
                isIndeterminate
                size="md"
              />
            </div>
          }
        >
          <AceEditor
            beautify={beautify}
            mode={mode}
            onChange={newValue => setValue(newValue)}
            defaultValue={value || ''}
            onIsValidChange={setIsValid}
            editorRef={editorRef}
          />
        </Suspense>
      </DialogBody>
      <Footer
        disabled={!isValid || isSaving}
        value={value}
        onSave={onSave}
        startAction={footerStartAction}
      />
    </Dialog>
  );
}

interface FooterProps {
  disabled: boolean | undefined;
  value?: string;
  onSave?: (value?: string) => void;
  startAction?: ReactNode;
}
function Footer({disabled, value, onSave, startAction}: FooterProps) {
  const {close} = useDialogContext();
  return (
    <DialogFooter dividerTop startAction={startAction}>
      <Button onClick={() => close()}>
        <Trans message="Cancel" />
      </Button>
      <Button
        disabled={disabled}
        variant="flat"
        color="primary"
        onClick={() => {
          if (onSave) {
            onSave(value);
          } else {
            close(value);
          }
        }}
      >
        <Trans message="Save" />
      </Button>
    </DialogFooter>
  );
}
