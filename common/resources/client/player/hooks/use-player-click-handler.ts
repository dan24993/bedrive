import {useCallback, useRef} from 'react';
import {usePlayerActions} from '@common/player/hooks/use-player-actions';

export function usePlayerClickHandler() {
  const clickRef = useRef(0);
  const player = usePlayerActions();

  const togglePlay = useCallback(() => {
    if (player.getState().isPlaying) {
      player.pause();
    } else {
      player.play();
    }
  }, [player]);

  return useCallback(() => {
    if (!player.getState().providerReady) return;
    clickRef.current += 1;
    togglePlay();
    if (clickRef.current === 1) {
      setTimeout(() => {
        if (clickRef.current > 1) {
          player.toggleFullscreen();
        }
        clickRef.current = 0;
      }, 300);
    }
  }, [player, togglePlay]);
}
