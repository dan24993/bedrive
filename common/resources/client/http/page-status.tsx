import {FullPageLoader} from '@common/ui/progress/full-page-loader';
import {errorStatusIs} from '@common/utils/http/error-status-is';
import {NotFoundPage} from '@common/ui/not-found-page/not-found-page';
import {PageErrorMessage} from '@common/errors/page-error-message';
import React, {ReactNode} from 'react';
import {UseQueryResult} from '@tanstack/react-query';
import {Navigate} from 'react-router-dom';
import {useAuth} from '@common/auth/use-auth';
import useSpinDelay from '@common/utils/hooks/use-spin-delay';

interface Props {
  query: UseQueryResult;
  show404?: boolean;
  redirectOn404?: string;
  loaderClassName?: string;
  loaderIsScreen?: boolean;
  loader?: ReactNode;
  delayedSpinner?: boolean;
}
export function PageStatus({
  query,
  show404 = true,
  loader,
  loaderClassName,
  loaderIsScreen = true,
  delayedSpinner = true,
  redirectOn404,
}: Props) {
  const {isLoggedIn} = useAuth();

  const showSpinner = useSpinDelay(query.isLoading, {
    delay: 500,
    minDuration: 200,
  });

  if (query.isLoading) {
    if (!showSpinner && delayedSpinner) {
      return null;
    }
    return (
      loader || (
        <FullPageLoader className={loaderClassName} screen={loaderIsScreen} />
      )
    );
  }

  if (
    query.isError &&
    (errorStatusIs(query.error, 401) || errorStatusIs(query.error, 403)) &&
    !isLoggedIn
  ) {
    return <Navigate to="/login" replace />;
  }

  if (show404 && query.isError && errorStatusIs(query.error, 404)) {
    if (redirectOn404) {
      return <Navigate to={redirectOn404} replace />;
    }
    return <NotFoundPage />;
  }

  return <PageErrorMessage />;
}
