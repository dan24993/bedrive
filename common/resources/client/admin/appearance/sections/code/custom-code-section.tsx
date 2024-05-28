import {AppearanceButton} from '@common/admin/appearance/appearance-button';
import {DialogTrigger} from '@common/ui/overlays/dialog/dialog-trigger';
import {Trans} from '@common/i18n/trans';
import {useFormContext} from 'react-hook-form';
import {
  appearanceState,
  AppearanceValues,
} from '@common/admin/appearance/appearance-store';
import {AceDialog} from '@common/ace-editor/ace-dialog';
import {Fragment} from 'react';

export function CustomCodeSection() {
  return (
    <Fragment>
      <CustomCodeDialogTrigger mode="css" />
      <CustomCodeDialogTrigger mode="html" />
    </Fragment>
  );
}

interface CustomCodeDialogTriggerProps {
  mode: 'html' | 'css';
}
function CustomCodeDialogTrigger({mode}: CustomCodeDialogTriggerProps) {
  const {getValues} = useFormContext<AppearanceValues>();
  const {setValue} = useFormContext<AppearanceValues>();

  const title =
    mode === 'html' ? (
      <Trans message="Custom HTML & JavaScript" />
    ) : (
      <Trans message="Custom CSS" />
    );

  return (
    <DialogTrigger
      type="modal"
      onClose={newValue => {
        if (newValue != null) {
          setValue(`appearance.custom_code.${mode}`, newValue, {
            shouldDirty: true,
          });
          appearanceState().preview.setCustomCode(mode, newValue);
        }
      }}
    >
      <AppearanceButton>{title}</AppearanceButton>
      <AceDialog
        title={title}
        defaultValue={getValues(`appearance.custom_code.${mode}`) || ''}
        mode={mode}
      />
    </DialogTrigger>
  );
}
