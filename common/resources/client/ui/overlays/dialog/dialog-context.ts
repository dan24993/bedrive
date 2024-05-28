import React, {ComponentPropsWithRef, useContext} from 'react';

export type DialogType = 'modal' | 'popover' | 'tray';

export interface DialogContextValue<T = unknown> {
  labelId: string;
  descriptionId: string;
  type: DialogType;
  isDismissable?: boolean;
  close: (value?: T) => void;
  value: T;
  setValue: (value: T) => void;
  initialValue: T;
  formId: string;
  dialogProps: ComponentPropsWithRef<'div'>;
  disableInitialTransition?: boolean;
}

export const DialogContext = React.createContext<DialogContextValue>(null!);

export function useDialogContext<T = unknown>() {
  return useContext(DialogContext) as DialogContextValue<T>;
}
