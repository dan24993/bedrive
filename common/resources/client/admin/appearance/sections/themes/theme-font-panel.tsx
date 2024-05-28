import {FontSelector} from '@common/ui/font-selector/font-selector';
import {useFormContext} from 'react-hook-form';
import {
  appearanceState,
  AppearanceValues,
} from '@common/admin/appearance/appearance-store';
import {useParams} from 'react-router-dom';

type Font = 'appearance.themes.all.1.font';

export function ThemeFontPanel() {
  const {setValue, watch} = useFormContext<AppearanceValues>();
  const {themeIndex} = useParams();
  const key = `appearance.themes.all.${themeIndex}.font` as Font;
  return (
    <FontSelector
      value={watch(key)}
      onChange={font => {
        setValue(key, font, {shouldDirty: true});
        appearanceState().preview.setThemeFont(font);
      }}
    />
  );
}
