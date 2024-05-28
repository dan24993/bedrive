import {useLocation} from 'react-router-dom';
import {RefObject, useEffect} from 'react';
import {usePrevious} from '@common/utils/hooks/use-previous';
import {getScrollParent} from '@react-aria/utils';

export function useScrollToTop(ref?: RefObject<HTMLElement>) {
  const {pathname} = useLocation();

  const previousPathname = usePrevious(pathname);

  useEffect(() => {
    if (previousPathname !== pathname) {
      const scrollParent = ref?.current
        ? getScrollParent(ref.current)
        : document.documentElement;
      scrollParent.scrollTo({
        top: 0,
        left: 0,
      });
    }
  }, [pathname, previousPathname, ref]);
}
