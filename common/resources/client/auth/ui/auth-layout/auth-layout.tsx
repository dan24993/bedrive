import {Link} from 'react-router-dom';
import {ReactNode} from 'react';
import {AuthLayoutFooter} from './auth-layout-footer';
import {useIsDarkMode} from '@common/ui/themes/use-is-dark-mode';
import authBgSvg from './auth-bg.svg';
import {useTrans} from '@common/i18n/use-trans';
import {useSettings} from '@common/core/settings/use-settings';

interface AuthPageProps {
  heading?: ReactNode;
  message?: ReactNode;
  children: ReactNode;
}
export function AuthLayout({heading, children, message}: AuthPageProps) {
  const {branding} = useSettings();
  const isDarkMode = useIsDarkMode();
  const {trans} = useTrans();

  return (
    <main
      className="flex h-screen flex-col items-center overflow-y-auto bg-alt px-14 pt-70 dark:bg-none md:px-10vw"
      style={{backgroundImage: isDarkMode ? undefined : `url("${authBgSvg}")`}}
    >
      <Link
        to="/"
        className="mb-40 block flex-shrink-0"
        aria-label={trans({message: 'Go to homepage'})}
      >
        <img
          src={isDarkMode ? branding.logo_light : branding?.logo_dark}
          className="m-auto block h-42 w-auto"
          alt=""
        />
      </Link>
      <div className="mx-auto w-full max-w-440 rounded-lg bg px-40 pb-32 pt-40 shadow md:shadow-xl">
        {heading && <h1 className="mb-20 text-xl">{heading}</h1>}
        {children}
      </div>
      {message && <div className="mt-36 text-sm">{message}</div>}
      <AuthLayoutFooter />
    </main>
  );
}
