import {usePlayerStore} from '@common/player/hooks/use-player-store';
import clsx from 'clsx';
import {HTMLAttributes, ReactElement} from 'react';

interface Props extends HTMLAttributes<HTMLDivElement> {
  hideDuringPlayback?: boolean;
  fallback?: ReactElement;
}
export function PlayerPoster({
  className,
  hideDuringPlayback = true,
  fallback,
  ...domProps
}: Props) {
  const posterUrl = usePlayerStore(s => s.posterUrl);
  const shouldHidePoster = usePlayerStore(
    s =>
      hideDuringPlayback && s.playbackStarted && s.providerName !== 'htmlAudio',
  );
  if (!posterUrl && !fallback) return null;
  return (
    <div
      {...domProps}
      className={clsx(
        'pointer-events-none flex max-h-full w-full items-center justify-center bg-black transition-opacity',
        shouldHidePoster ? 'opacity-0' : 'opacity-100',
        className,
      )}
    >
      {posterUrl ? (
        <img
          loading="lazy"
          src={posterUrl}
          alt=""
          className="max-h-full w-full flex-shrink-0 object-cover"
        />
      ) : (
        fallback
      )}
    </div>
  );
}
