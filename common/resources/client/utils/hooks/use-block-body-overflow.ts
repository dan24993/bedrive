import {useEffect} from 'react';

export function useBlockBodyOverflow(disable: boolean = false) {
  useEffect(() => {
    if (disable) {
      document.documentElement.classList.remove('no-page-overflow');
    } else {
      document.documentElement.classList.add('no-page-overflow');
    }
    return () => {
      document.documentElement.classList.remove('no-page-overflow');
    };
  }, [disable]);
}
