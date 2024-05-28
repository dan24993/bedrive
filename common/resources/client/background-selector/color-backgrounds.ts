import {ColorPresets} from '@common/ui/color-picker/color-presets';
import {message} from '@common/i18n/message';
import {BackgroundSelectorConfig} from '@common/background-selector/background-selector-config';

export const BaseColorBg: BackgroundSelectorConfig = {
  type: 'color',
  id: 'c-custom',
  label: message('Custom color'),
};

export const ColorBackgrounds: BackgroundSelectorConfig[] = ColorPresets.map(
  (preset, index) => {
    return {
      ...BaseColorBg,
      id: `c${index}`,
      backgroundColor: preset.color,
      label: preset.name,
      color: preset.foreground,
    };
  },
);
