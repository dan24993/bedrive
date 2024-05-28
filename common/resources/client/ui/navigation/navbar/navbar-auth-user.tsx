import {useAuth} from '@common/auth/use-auth';
import {useThemeSelector} from '@common/ui/themes/theme-selector-context';
import {Badge} from '@common/ui/badge/badge';
import {IconButton} from '@common/ui/buttons/icon-button';
import {PersonIcon} from '@common/icons/material/Person';
import {ButtonBase} from '@common/ui/buttons/button-base';
import {ArrowDropDownIcon} from '@common/icons/material/ArrowDropDown';
import {ReactElement} from 'react';
import {ListboxItemProps} from '@common/ui/forms/listbox/item';
import {NavbarAuthMenu} from '@common/ui/navigation/navbar/navbar-auth-menu';

export interface NavbarAuthUserProps {
  items?: ReactElement<ListboxItemProps>[];
}
export function NavbarAuthUser({items = []}: NavbarAuthUserProps) {
  const {user} = useAuth();
  const {selectedTheme} = useThemeSelector();
  if (!selectedTheme || !user) return null;
  const hasUnreadNotif = !!user.unread_notifications_count;

  const mobileButton = (
    <IconButton
      size="md"
      className="md:hidden"
      role="presentation"
      aria-label="toggle authentication menu"
      badge={
        hasUnreadNotif ? (
          <Badge>{user.unread_notifications_count}</Badge>
        ) : undefined
      }
    >
      <PersonIcon />
    </IconButton>
  );
  const desktopButton = (
    <ButtonBase className="flex items-center max-md:hidden" role="presentation">
      <img
        className="mr-12 h-32 w-32 flex-shrink-0 rounded object-cover"
        src={user.avatar}
        alt=""
      />
      <span className="mr-2 block max-w-124 overflow-x-hidden overflow-ellipsis text-sm">
        {user.display_name}
      </span>
      <ArrowDropDownIcon className="block icon-sm" />
    </ButtonBase>
  );

  return (
    <NavbarAuthMenu items={items}>
      <span role="button">
        {mobileButton}
        {desktopButton}
      </span>
    </NavbarAuthMenu>
  );
}
