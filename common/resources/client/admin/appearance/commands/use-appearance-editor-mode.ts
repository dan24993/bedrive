import {isSsr} from '@common/utils/dom/is-ssr';

export function useAppearanceEditorMode() {
  return {
    isAppearanceEditorActive:
      !isSsr() &&
      ((window.frameElement as HTMLIFrameElement) || undefined)?.src.includes(
        'appearanceEditor=true'
      ),
  };
}
