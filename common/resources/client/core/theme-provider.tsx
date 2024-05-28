import React, {useMemo} from 'react';
import {applyThemeToDom} from '../ui/themes/utils/apply-theme-to-dom';
import {
  ThemeId,
  ThemeSelectorContext,
  ThemeSelectorContextValue,
} from '../ui/themes/theme-selector-context';
import {CssTheme} from '../ui/themes/css-theme';
import {useSettings} from './settings/use-settings';
import {useBootstrapData} from './bootstrap-data/bootstrap-data-context';
import {useCookie} from '@common/utils/hooks/use-cookie';

const STORAGE_KEY = 'be-active-theme';

interface ThemeProviderProps {
  children: any;
}
export function ThemeProvider({children}: ThemeProviderProps) {
  const {themes} = useSettings();
  const canChangeTheme = themes?.user_change;
  const {data} = useBootstrapData();
  const allThemes = useMemo(() => data.themes.all || [], [data.themes.all]);
  const initialThemeId = data.themes.selectedThemeId || undefined;

  const [selectedThemeId, setSelectedThemeId] = useCookie(
    STORAGE_KEY,
    `${initialThemeId}`,
  );

  let selectedTheme = canChangeTheme
    ? allThemes.find(t => t.id == selectedThemeId)
    : allThemes.find(t => t.id == themes?.default_id);
  if (!selectedTheme) {
    selectedTheme = allThemes[0];
  }

  const contextValue: ThemeSelectorContextValue = useMemo(() => {
    return {
      allThemes,
      selectedTheme: selectedTheme!,
      selectTheme: (id: ThemeId) => {
        if (!canChangeTheme) return;
        const theme = findTheme(allThemes, id);
        if (theme) {
          setSelectedThemeId(`${theme.id}`);
          applyThemeToDom(theme);
        }
      },
    };
  }, [allThemes, selectedTheme, setSelectedThemeId, canChangeTheme]);

  return (
    <ThemeSelectorContext.Provider value={contextValue}>
      {children}
    </ThemeSelectorContext.Provider>
  );
}

function findTheme(themes: CssTheme[], id: ThemeId) {
  return themes.find(t => {
    if (id === 'light') {
      return t.default_light === true;
    }
    if (id === 'dark') {
      return t.default_dark === true;
    }
    return t.id === id;
  });
}
