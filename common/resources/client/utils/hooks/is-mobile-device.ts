import {useIsSSR} from '@react-aria/ssr';
import {getBootstrapData} from '@common/core/bootstrap-data/use-backend-bootstrap-data';

const MOBILE_SCREEN_WIDTH = 768;

export function useIsMobileDevice(): boolean {
  const isSSR = useIsSSR();
  if (isSSR || typeof window === 'undefined') {
    return getBootstrapData().is_mobile_device;
  }

  return window.screen.width <= MOBILE_SCREEN_WIDTH;
}
