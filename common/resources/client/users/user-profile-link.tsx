import {Link, LinkProps} from 'react-router-dom';
import clsx from 'clsx';
import React, {useContext, useMemo} from 'react';
import {User} from '@common/auth/user';
import {SiteConfigContext} from '@common/core/settings/site-config-context';

interface UserProfileLinkProps extends Omit<LinkProps, 'to'> {
  user: User;
  className?: string;
}
export function UserProfileLink({
  user,
  className,
  ...linkProps
}: UserProfileLinkProps) {
  const {auth} = useContext(SiteConfigContext);
  const finalUri = useMemo(() => {
    return auth.getUserProfileLink!(user);
  }, [auth, user]);

  return (
    <Link
      {...linkProps}
      className={clsx('hover:underline', className)}
      to={finalUri}
    >
      {user.display_name}
    </Link>
  );
}
