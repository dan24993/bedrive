import {useBootstrapData} from '@common/core/bootstrap-data/bootstrap-data-context';
import {useIsDarkMode} from '@common/ui/themes/use-is-dark-mode';

export function useDarkThemeVariables() {
  const {data} = useBootstrapData();
  const isDarkMode = useIsDarkMode();
  // already in dark mode, no need to set variables again
  if (isDarkMode) {
    return undefined;
  }
  return data.themes.all.find(theme => theme.is_dark && theme.default_dark)
    ?.values;
}
