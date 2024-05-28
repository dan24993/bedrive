import {CssTheme} from '../css-theme';
import {setThemeValue} from './set-theme-value';
import {themeEl} from '@common/core/root-el';

export function applyThemeToDom(theme: CssTheme) {
  Object.entries(theme.values).forEach(([key, value]) => {
    setThemeValue(key, value);
  });
  if (theme.is_dark) {
    themeEl.classList.add('dark');
  } else {
    themeEl.classList.remove('dark');
  }
}
