import clsx from 'clsx';
import {CustomMenu} from '../../menus/custom-menu';
import {LocaleSwitcher} from '../../i18n/locale-switcher';
import {Button} from '../buttons/button';
import {DarkModeIcon} from '../../icons/material/DarkMode';
import {LightbulbIcon} from '../../icons/material/Lightbulb';
import {Trans} from '../../i18n/trans';
import {useThemeSelector} from '../themes/theme-selector-context';
import {useSettings} from '../../core/settings/use-settings';

interface Props {
  className?: string;
  padding?: string;
}

export function Footer({className, padding}: Props) {
  const year = new Date().getFullYear();
  const {branding} = useSettings();
  return (
    <footer
      className={clsx(
        'text-sm',
        padding ? padding : 'pb-28 pt-54 md:pb-54',
        className,
      )}
    >
      <Menus />
      <div className="items-center justify-between gap-30 text-center text-muted md:flex md:text-left">
        <Trans
          message="Copyright © :year :name, All Rights Reserved"
          values={{year, name: branding.site_name}}
        />
        <div>
          <ThemeSwitcher />
          <LocaleSwitcher />
        </div>
      </div>
    </footer>
  );
}

function Menus() {
  const settings = useSettings();
  const primaryMenu = settings.menus.find(m => m.positions?.includes('footer'));
  const secondaryMenu = settings.menus.find(
    m => m.positions?.includes('footer-secondary'),
  );

  if (!primaryMenu && !secondaryMenu) return null;

  return (
    <div className="mb-14 items-center justify-between gap-30 overflow-x-auto border-b pb-14 md:flex">
      {primaryMenu && (
        <CustomMenu menu={primaryMenu} className="text-primary" />
      )}
      {secondaryMenu && (
        <CustomMenu menu={secondaryMenu} className="mb:mt-0 mt-14 text-muted" />
      )}
    </div>
  );
}

function ThemeSwitcher() {
  const {themes} = useSettings();
  const {selectedTheme, selectTheme} = useThemeSelector();
  if (!selectedTheme || !themes?.user_change) return null;

  return (
    <Button
      variant="text"
      startIcon={selectedTheme.is_dark ? <DarkModeIcon /> : <LightbulbIcon />}
      onClick={() => {
        if (selectedTheme.is_dark) {
          selectTheme('light');
        } else {
          selectTheme('dark');
        }
      }}
    >
      {selectedTheme.is_dark ? (
        <Trans message="Light mode" />
      ) : (
        <Trans message="Dark mode" />
      )}
    </Button>
  );
}
