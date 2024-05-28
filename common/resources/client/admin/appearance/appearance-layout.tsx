import {Link, Navigate, Outlet, useLocation} from 'react-router-dom';
import {useEffect, useRef} from 'react';
import {IconButton} from '../../ui/buttons/icon-button';
import {CloseIcon} from '../../icons/material/Close';
import {Button} from '../../ui/buttons/button';
import {appearanceState, AppearanceValues} from './appearance-store';
import {useSaveAppearanceChanges} from './requests/save-appearance-changes';
import {useAppearanceValues} from './requests/appearance-values';
import {Trans} from '../../i18n/trans';
import {useForm, useFormContext} from 'react-hook-form';
import {Form} from '../../ui/forms/form';
import {ProgressCircle} from '../../ui/progress/progress-circle';
import {SectionHeader} from './section-header';
import {FileUploadProvider} from '../../uploads/uploader/file-upload-provider';
import {useAppearanceEditorMode} from './commands/use-appearance-editor-mode';
import {StaticPageTitle} from '../../seo/static-page-title';
import {useSettings} from '../../core/settings/use-settings';

export function AppearanceLayout() {
  const {isAppearanceEditorActive} = useAppearanceEditorMode();
  const {data} = useAppearanceValues();
  const {base_url} = useSettings();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const {pathname} = useLocation();

  useEffect(() => {
    // only set defaults snapshot once on route init
    if (data?.defaults && !appearanceState().defaults) {
      appearanceState().setDefaults(data.defaults);
    }
  }, [data]);

  useEffect(() => {
    if (iframeRef.current) {
      appearanceState().setIframeWindow(iframeRef.current.contentWindow!);
    }
  }, []);

  useEffect(() => {
    const sectionName = pathname.split('/')[3];
    appearanceState().preview.navigate(sectionName);
  }, [pathname]);

  // make sure appearance editor iframe can't be nested
  if (isAppearanceEditorActive) {
    return <Navigate to="/admin" />;
  }

  return (
    <div className="h-screen items-center md:flex">
      <StaticPageTitle>
        <Trans message="Appearance" />
      </StaticPageTitle>
      <Sidebar values={data?.values} />
      <div className="relative h-full flex-auto">
        <iframe
          ref={iframeRef}
          className="h-full w-full max-md:hidden"
          src={`${base_url}?appearanceEditor=true`}
        />
      </div>
    </div>
  );
}

interface SidebarProps {
  values: AppearanceValues | undefined;
}
function Sidebar({values}: SidebarProps) {
  const spinner = (
    <div className="flex h-full flex-auto items-center justify-center">
      <ProgressCircle isIndeterminate aria-label="Loading editor" />
    </div>
  );

  return (
    <div className="relative z-10 h-full w-full border-r bg shadow-lg @container md:w-320">
      {values ? <AppearanceForm defaultValues={values} /> : spinner}
    </div>
  );
}

interface AppearanceFormProps {
  defaultValues: AppearanceValues;
}

function AppearanceForm({defaultValues}: AppearanceFormProps) {
  const form = useForm<AppearanceValues>({defaultValues});
  const {watch, reset} = form;
  const saveChanges = useSaveAppearanceChanges();

  useEffect(() => {
    const subscription = watch(value => {
      appearanceState().preview.setValues(value as AppearanceValues);
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  return (
    <Form
      className="flex h-full flex-col"
      form={form}
      onSubmit={values => {
        saveChanges.mutate(values, {
          onSuccess: () => reset(values),
        });
      }}
    >
      <Header isLoading={saveChanges.isPending} />
      <SectionHeader />
      <div className="flex-auto overflow-y-auto px-14 py-20">
        <FileUploadProvider>
          <Outlet />
        </FileUploadProvider>
      </div>
    </Form>
  );
}

interface HeaderProps {
  isLoading: boolean;
}
function Header({isLoading}: HeaderProps) {
  const {
    formState: {dirtyFields},
  } = useFormContext<AppearanceValues>();
  const isDirty = Object.keys(dirtyFields).length;
  return (
    <div className="flex h-50 flex-shrink-0 items-center border-b pr-10">
      <IconButton
        border="border-r"
        className="text-muted"
        elementType={Link}
        to=".."
      >
        <CloseIcon />
      </IconButton>
      <div className="pl-10">
        <Trans message="Appearance editor" />
      </div>
      <Button
        variant="flat"
        color="primary"
        className="ml-auto block"
        disabled={!isDirty || isLoading}
        type="submit"
      >
        {isDirty ? <Trans message="Save" /> : <Trans message="Saved" />}
      </Button>
    </div>
  );
}
