import {Trans} from '@common/i18n/trans';
import {ButtonBase} from '@common/ui/buttons/button-base';
import {ReactNode} from 'react';
import clsx from 'clsx';
import {useFormContext} from 'react-hook-form';
import {AppearanceValues} from '@common/admin/appearance/appearance-store';
import {message} from '@common/i18n/message';
import {useParams} from 'react-router-dom';

const radiusMap = {
  'rounded-none': {
    label: message('Square'),
    value: '0px',
  },
  'rounded-sm': {
    label: message('Small'),
    value: '0.125rem',
  },
  'rounded-md': {
    label: message('Medium'),
    value: '0.25rem',
  },
  'rounded-lg': {
    label: message('Large'),
    value: '0.5rem',
  },
  'rounded-xl': {
    label: message('Larger'),
    value: '0.75rem',
  },
  'rounded-full': {
    label: message('Pill'),
    value: '9999px',
  },
};

export function ThemeRadiusPanel() {
  return (
    <div className="space-y-24">
      <RadiusSelector
        label={<Trans message="Button rounding" />}
        name="button-radius"
      />
      <RadiusSelector
        label={<Trans message="Input rounding" />}
        name="input-radius"
      />
      <RadiusSelector
        label={<Trans message="Panel rounding" />}
        name="panel-radius"
        hidePill
      />
    </div>
  );
}

interface RadiusSelectorProps {
  label: ReactNode;
  name: string;
  hidePill?: boolean;
}
function RadiusSelector({label, name, hidePill}: RadiusSelectorProps) {
  const {themeIndex} = useParams();
  const {watch, setValue} = useFormContext<AppearanceValues>();
  const formKey =
    `appearance.themes.all.${themeIndex}.values.--be-${name}` as 'appearance.themes.all.1.values.--be-button-radius';
  const currentValue = watch(formKey);
  return (
    <div>
      <div className="mb-10 text-sm font-semibold">{label}</div>
      <div className="grid grid-cols-3 gap-10 text-sm">
        {Object.entries(radiusMap)
          .filter(([key]) => !hidePill || !key.includes('full'))
          .map(([key, {label, value}]) => (
            <PreviewButton
              key={key}
              radius={key}
              isActive={value === currentValue}
              onClick={() => {
                setValue(formKey, value, {shouldDirty: true});
              }}
            >
              <Trans {...label} />
            </PreviewButton>
          ))}
      </div>
    </div>
  );
}

interface PreviewButtonProps {
  radius: string;
  children: ReactNode;
  isActive: boolean;
  onClick: () => void;
}
function PreviewButton({
  radius,
  children,
  isActive,
  onClick,
}: PreviewButtonProps) {
  return (
    <ButtonBase
      display="block"
      className={clsx(
        'h-36 border-2 hover:bg-hover',
        radius,
        isActive && 'border-primary',
      )}
      onClick={onClick}
    >
      {children}
    </ButtonBase>
  );
}
