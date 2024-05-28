import React, {ReactNode} from 'react';
import {Button} from '../../buttons/button';
import {ErrorOutlineIcon} from '@common/icons/material/ErrorOutline';
import {DialogFooter} from './dialog-footer';
import {useDialogContext} from './dialog-context';
import {Dialog} from './dialog';
import {DialogHeader} from './dialog-header';
import {DialogBody} from './dialog-body';
import {Trans} from '@common/i18n/trans';

interface Props {
  className?: string;
  title: ReactNode;
  body: ReactNode;
  confirm: ReactNode;
  isDanger?: boolean;
  isLoading?: boolean;
  onConfirm?: () => void;
}
export function ConfirmationDialog({
  className,
  title,
  body,
  confirm,
  isDanger,
  isLoading,
  onConfirm,
}: Props) {
  const {close} = useDialogContext();
  return (
    <Dialog className={className} size="sm" role="alertdialog">
      <DialogHeader
        color={isDanger ? 'text-danger' : null}
        leftAdornment={<ErrorOutlineIcon className="icon-sm" />}
      >
        {title}
      </DialogHeader>
      <DialogBody>{body}</DialogBody>
      <DialogFooter>
        <Button
          variant="text"
          onClick={() => {
            close(false);
          }}
        >
          <Trans message="Cancel" />
        </Button>
        <Button
          disabled={isLoading}
          variant="flat"
          color={isDanger ? 'danger' : 'primary'}
          onClick={() => {
            onConfirm?.();
            // if callback is passed in, caller is responsible for closing the dialog
            if (!onConfirm) {
              close(true);
            }
          }}
        >
          {confirm}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
