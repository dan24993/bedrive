import {Link, useNavigate, useParams} from 'react-router-dom';
import {Fragment, ReactNode, useEffect, useState} from 'react';
import {
  appearanceState,
  AppearanceValues,
} from '@common/admin/appearance/appearance-store';
import {AppearanceButton} from '@common/admin/appearance/appearance-button';
import {ColorIcon} from '@common/admin/appearance/sections/themes/color-icon';
import {CssTheme} from '@common/ui/themes/css-theme';
import {colorToThemeValue} from '@common/ui/themes/utils/color-to-theme-value';
import {ThemeSettingsDialogTrigger} from '@common/admin/appearance/sections/themes/theme-settings-dialog-trigger';
import {ThemeMoreOptionsButton} from '@common/admin/appearance/sections/themes/theme-more-options-button';
import {ColorPickerDialog} from '@common/ui/color-picker/color-picker-dialog';
import {DialogTrigger} from '@common/ui/overlays/dialog/dialog-trigger';
import {useFormContext} from 'react-hook-form';
import {Trans} from '@common/i18n/trans';
import {NavbarColorPicker} from '@common/admin/appearance/sections/themes/navbar-color-picker';
import {message} from '@common/i18n/message';
import {themeValueToHex} from '@common/ui/themes/utils/theme-value-to-hex';

const colorList = [
  {
    label: message('Background'),
    key: '--be-background',
  },
  {
    label: message('Background alt'),
    key: '--be-background-alt',
  },
  {
    label: message('Foreground'),
    key: '--be-foreground-base',
  },
  {
    label: message('Accent light'),
    key: '--be-primary-light',
  },
  {
    label: message('Accent'),
    key: '--be-primary',
  },
  {
    label: message('Accent dark'),
    key: '--be-primary-dark',
  },
  {
    label: message('Text on accent'),
    key: '--be-on-primary',
  },
  {
    label: message('Chip'),
    key: '--be-background-chip',
  },
];

export function ThemeEditor() {
  const navigate = useNavigate();
  const {themeIndex} = useParams();
  const {getValues, watch} = useFormContext<AppearanceValues>();

  const theme = getValues(`appearance.themes.all.${+themeIndex!}`);
  const selectedFont = watch(
    `appearance.themes.all.${+themeIndex!}.font.family`,
  );

  // go to theme list, if theme can't be found
  useEffect(() => {
    if (!theme) {
      navigate('/admin/appearance/themes');
    }
  }, [navigate, theme]);

  // select theme in preview on initial render
  useEffect(() => {
    if (theme?.id) {
      appearanceState().preview.setActiveTheme(theme.id);
    }
  }, [theme?.id]);

  if (!theme) return null;

  return (
    <Fragment>
      <div className="mb-20 flex items-center justify-between gap-10">
        <ThemeSettingsDialogTrigger />
        <ThemeMoreOptionsButton />
      </div>
      <div>
        <AppearanceButton
          elementType={Link}
          to="font"
          description={selectedFont ? selectedFont : <Trans message="System" />}
        >
          <Trans message="Font" />
        </AppearanceButton>
        <AppearanceButton elementType={Link} to="radius">
          <Trans message="Rounding" />
        </AppearanceButton>
        <div className="mb-6 mt-22 text-sm font-semibold">
          <Trans message="Colors" />
        </div>
        <NavbarColorPicker />
        {colorList.map(color => (
          <ColorPickerTrigger
            key={color.key}
            colorName={color.key}
            label={<Trans {...color.label} />}
            initialThemeValue={theme.values[color.key]}
            theme={theme}
          />
        ))}
      </div>
    </Fragment>
  );
}

interface ColorPickerTriggerProps {
  label: ReactNode;
  theme: CssTheme;
  colorName: string;
  initialThemeValue: string;
}
function ColorPickerTrigger({
  label,
  theme,
  colorName,
  initialThemeValue,
}: ColorPickerTriggerProps) {
  const {setValue} = useFormContext<AppearanceValues>();
  const {themeIndex} = useParams();
  const [selectedThemeValue, setSelectedThemeValue] =
    useState<string>(initialThemeValue);

  // set color as css variable in preview and on button preview, but not in appearance values
  // this way color change can be canceled when color picker is closed and applied explicitly via apply button
  const selectThemeValue = (themeValue: string) => {
    setSelectedThemeValue(themeValue);
    appearanceState().preview.setThemeValue(colorName, themeValue);
  };

  useEffect(() => {
    // need to update the color here so changes via "reset colors" button are reflected
    setSelectedThemeValue(initialThemeValue);
  }, [initialThemeValue]);

  return (
    <DialogTrigger
      value={themeValueToHex(selectedThemeValue)}
      type="popover"
      placement="right"
      offset={10}
      onValueChange={newColor => {
        selectThemeValue(colorToThemeValue(newColor));
      }}
      onClose={(newColor, {valueChanged, initialValue}) => {
        if (newColor && valueChanged) {
          setValue(
            `appearance.themes.all.${+themeIndex!}.values.${colorName}`,
            colorToThemeValue(newColor),
            {shouldDirty: true},
          );
          setValue('appearance.themes.selectedThemeId', theme.id);
        } else {
          // reset to initial value, if apply button was not clicked
          selectThemeValue(initialValue);
        }
      }}
    >
      <AppearanceButton
        className="capitalize"
        startIcon={
          <ColorIcon
            viewBox="0 0 48 48"
            className="icon-lg"
            style={{fill: `rgb(${selectedThemeValue})`}}
          />
        }
      >
        {label}
      </AppearanceButton>
      <ColorPickerDialog />
    </DialogTrigger>
  );
}
