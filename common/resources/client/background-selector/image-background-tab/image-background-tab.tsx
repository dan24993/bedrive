import {DialogTrigger} from '@common/ui/overlays/dialog/dialog-trigger';
import {Trans} from '@common/i18n/trans';
import {UploadIcon} from '@common/icons/material/Upload';
import {useForm} from 'react-hook-form';
import {useDialogContext} from '@common/ui/overlays/dialog/dialog-context';
import {Dialog} from '@common/ui/overlays/dialog/dialog';
import {DialogHeader} from '@common/ui/overlays/dialog/dialog-header';
import {DialogBody} from '@common/ui/overlays/dialog/dialog-body';
import {Form} from '@common/ui/forms/form';
import {FileUploadProvider} from '@common/uploads/uploader/file-upload-provider';
import {FormImageSelector} from '@common/ui/images/image-selector';
import {DialogFooter} from '@common/ui/overlays/dialog/dialog-footer';
import {Button} from '@common/ui/buttons/button';
import {
  BaseImageBg,
  ImageBackgrounds,
} from '@common/background-selector/image-backgrounds';
import {BackgroundSelectorButton} from '@common/background-selector/background-selector-button';
import {cssPropsFromBgConfig} from '@common/background-selector/css-props-from-bg-config';
import {SimpleBackgroundPositionSelector} from '@common/background-selector/image-background-tab/simple-background-position-selector';
import {BgSelectorTabProps} from '@common/background-selector/bg-selector-tab-props';
import {BackgroundSelectorConfig} from '@common/background-selector/background-selector-config';
import {AdvancedBackgroundPositionSelector} from '@common/background-selector/image-background-tab/advanced-background-position-selector';
import {urlFromBackgroundImage} from '@common/background-selector/bg-config-from-css-props';

export function ImageBackgroundTab({
  value,
  onChange,
  className,
  positionSelector,
  diskPrefix,
  isInsideDialog,
}: BgSelectorTabProps<BackgroundSelectorConfig>) {
  return (
    <div>
      <div className={className}>
        <CustomImageTrigger
          value={value}
          onChange={onChange}
          diskPrefix={diskPrefix}
          hideFooter={isInsideDialog}
        />
        {ImageBackgrounds.map(background => (
          <BackgroundSelectorButton
            key={background.id}
            onClick={() =>
              onChange?.({
                ...BaseImageBg,
                ...background,
              })
            }
            isActive={value?.id === background.id}
            style={{
              ...cssPropsFromBgConfig(background),
              backgroundAttachment: 'initial',
            }}
            label={<Trans {...background.label} />}
          />
        ))}
      </div>
      {positionSelector === 'advanced' ? (
        <AdvancedBackgroundPositionSelector value={value} onChange={onChange} />
      ) : (
        <SimpleBackgroundPositionSelector value={value} onChange={onChange} />
      )}
    </div>
  );
}

interface CustomImageTrigger {
  value?: BackgroundSelectorConfig;
  onChange?: (value: BackgroundSelectorConfig | null) => void;
  diskPrefix?: string;
  hideFooter?: boolean;
}
function CustomImageTrigger({
  value,
  onChange,
  diskPrefix,
  hideFooter,
}: CustomImageTrigger) {
  // only seed form with custom uploaded image
  value = value?.id === BaseImageBg.id ? value : undefined;
  return (
    <DialogTrigger
      type="popover"
      onClose={(imageUrl?: string) => {
        onChange?.(
          imageUrl
            ? {
                ...BaseImageBg,
                backgroundImage: `url(${imageUrl})`,
              }
            : null,
        );
      }}
    >
      <BackgroundSelectorButton
        label={<Trans {...BaseImageBg.label} />}
        isActive={
          value?.id === BaseImageBg.id && value?.backgroundImage !== 'none'
        }
        className="border-2 border-dashed"
        style={cssPropsFromBgConfig(value)}
      >
        <span className="inline-block rounded bg-black/20 p-10 text-white">
          <UploadIcon size="lg" />
        </span>
      </BackgroundSelectorButton>
      <CustomImageDialog
        value={value}
        diskPrefix={diskPrefix}
        hideFooter={hideFooter}
      />
    </DialogTrigger>
  );
}

interface CustomImageDialogProps {
  value?: BackgroundSelectorConfig;
  diskPrefix?: string;
  hideFooter?: boolean;
}
export function CustomImageDialog({
  value,
  diskPrefix,
  hideFooter,
}: CustomImageDialogProps) {
  const defaultValue =
    !value?.backgroundImage || !value.backgroundImage.includes('url(')
      ? undefined
      : urlFromBackgroundImage(value.backgroundImage);
  const form = useForm<{imageUrl: string}>({
    defaultValues: {imageUrl: defaultValue},
  });
  const {close, formId} = useDialogContext();
  return (
    <Dialog size="sm">
      <DialogHeader>
        <Trans message="Upload image" />
      </DialogHeader>
      <DialogBody>
        <Form
          id={formId}
          form={form}
          onSubmit={values => close(values.imageUrl)}
        >
          <FileUploadProvider>
            <FormImageSelector
              autoFocus
              name="imageUrl"
              diskPrefix={diskPrefix || 'biolinks'}
              showRemoveButton
              onChange={hideFooter ? imageUrl => close(imageUrl) : undefined}
            />
          </FileUploadProvider>
        </Form>
      </DialogBody>
      {!hideFooter && (
        <DialogFooter>
          <Button onClick={() => close()}>
            <Trans message="Cancel" />
          </Button>
          <Button variant="flat" color="primary" type="submit" form={formId}>
            <Trans message="Select" />
          </Button>
        </DialogFooter>
      )}
    </Dialog>
  );
}
