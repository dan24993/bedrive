import {message} from '@common/i18n/message';
import {useParams} from 'react-router-dom';
import {useFormContext} from 'react-hook-form';
import {AppearanceValues} from '@common/admin/appearance/appearance-store';
import {Menu, MenuTrigger} from '@common/ui/navigation/menu/menu-trigger';
import {AppearanceButton} from '@common/admin/appearance/appearance-button';
import {ColorIcon} from '@common/admin/appearance/sections/themes/color-icon';
import clsx from 'clsx';
import {Trans} from '@common/i18n/trans';
import {Item} from '@common/ui/forms/listbox/item';

const navbarColorMap = [
  {
    label: message('Accent'),
    value: 'primary',
    bgColor: 'bg-primary',
    previewBgColor: 'text-primary',
  },
  {
    label: message('Background'),
    value: 'bg',
    bgColor: 'bg-background',
    previewBgColor: 'text-background',
  },
  {
    label: message('Background alt'),
    value: 'bg-alt',
    bgColor: 'bg-alt',
    previewBgColor: 'text-background-alt',
  },
  {
    label: message('Transparent'),
    value: 'transparent',
    bgColor: 'bg-transparent',
    previewBgColor: 'text-transparent',
  },
];

export function NavbarColorPicker() {
  const {themeIndex} = useParams();
  const {watch, setValue} = useFormContext<AppearanceValues>();
  const key =
    `appearance.themes.all.${themeIndex!}.values.--be-navbar-color` as 'appearance.themes.all.1.values.--be-navbar-color';
  const selectedValue = watch(key);
  const previewColor = navbarColorMap.find(({value}) => value === selectedValue)
    ?.previewBgColor;
  return (
    <MenuTrigger
      placement="right"
      selectionMode="single"
      selectedValue={selectedValue}
      onSelectionChange={value => {
        setValue(key, value as string, {shouldDirty: true});
      }}
    >
      <AppearanceButton
        startIcon={
          <ColorIcon
            viewBox="0 0 48 48"
            className={clsx('icon-lg', previewColor)}
          />
        }
      >
        <Trans message="Navbar" />
      </AppearanceButton>
      <Menu>
        {navbarColorMap.map(({label, value, bgColor}) => (
          <Item
            key={value}
            value={value}
            startIcon={
              <div className={clsx('h-20 w-20 rounded border', bgColor)} />
            }
          >
            <Trans {...label} />
          </Item>
        ))}
      </Menu>
    </MenuTrigger>
  );
}
