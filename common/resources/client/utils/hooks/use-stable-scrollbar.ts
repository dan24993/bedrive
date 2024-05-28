import {useEffect} from 'react';

export function useStableScrollbar(disable: boolean = false) {
  useEffect(() => {
    if (disable) {
      document.documentElement.classList.remove('stable-scrollbar');
    } else {
      document.documentElement.classList.add('stable-scrollbar');
    }
    return () => {
      document.documentElement.classList.remove('stable-scrollbar');
    };
  }, [disable]);
}
