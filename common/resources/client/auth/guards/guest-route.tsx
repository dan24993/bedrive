import {useAuth} from '../use-auth';
import {ReactElement, useContext} from 'react';
import {Navigate, Outlet, useLocation} from 'react-router-dom';
import {useAppearanceEditorMode} from '../../admin/appearance/commands/use-appearance-editor-mode';
import {SiteConfigContext} from '@common/core/settings/site-config-context';

interface GuestRouteProps {
  children: ReactElement;
}
export function GuestRoute({children}: GuestRouteProps) {
  const {isLoggedIn, getRedirectUri} = useAuth();
  const {isAppearanceEditorActive} = useAppearanceEditorMode();
  const redirectUri = getRedirectUri();
  const {auth} = useContext(SiteConfigContext);
  const {pathname} = useLocation();

  if (isLoggedIn && !isAppearanceEditorActive) {
    // prevent recursive redirects
    if (redirectUri !== pathname) {
      return <Navigate to={redirectUri} replace />;
    } else if (auth.secondaryRedirectUri) {
      return <Navigate to={auth.secondaryRedirectUri} replace />;
    }
  }

  return children || <Outlet />;
}
