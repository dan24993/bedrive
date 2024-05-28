import {RefObject, useEffect, useRef} from 'react';

export interface AutoFocusProps {
  autoFocus?: boolean;
  autoSelectText?: boolean;
  disabled?: boolean;
}
export function useAutoFocus(
  {autoFocus, autoSelectText}: AutoFocusProps,
  ref: RefObject<HTMLElement>
) {
  const autoFocusRef = useRef(autoFocus);

  useEffect(() => {
    if (autoFocusRef.current && ref.current) {
      // run inside animation frame to prevent issues when opening
      // dialog with via keyboard shortcut and focusing input
      requestAnimationFrame(() => {
        ref.current?.focus();
        if (autoSelectText && ref.current?.nodeName.toLowerCase() === 'input') {
          (ref.current as HTMLInputElement).select();
        }
      });
    }
    autoFocusRef.current = false;
  }, [ref, autoSelectText]);
}
