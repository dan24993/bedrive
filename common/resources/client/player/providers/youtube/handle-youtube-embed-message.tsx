import {
  YoutubeInternalState,
  YouTubeMessage,
  YoutubeMessageInfo,
  YouTubePlayerState,
  YoutubeProviderError,
} from '@common/player/providers/youtube/youtube-types';
import {MutableRefObject, RefObject} from 'react';
import {PlayerStoreApi} from '@common/player/state/player-state';
import {isNumber} from '@common/utils/number/is-number';
import {loadYoutubePoster} from '@common/player/providers/youtube/load-youtube-poster';

export function handleYoutubeEmbedMessage(
  e: MessageEvent,
  internalStateRef: MutableRefObject<YoutubeInternalState>,
  iframeRef: RefObject<HTMLIFrameElement>,
  store: PlayerStoreApi
) {
  const data = (
    typeof e.data === 'string' ? JSON.parse(e.data) : e.data
  ) as YouTubeMessage;
  const info = data.info;
  const internalState = internalStateRef.current;
  const emit = store.getState().emit;
  if (!info) return;

  if (info.videoData?.video_id) {
    internalState.videoId = info.videoData.video_id;
  }

  if (info.videoData?.errorCode) {
    const event: YoutubeProviderError = {
      code: info.videoData.errorCode,
      videoId: internalState.videoId,
    };
    emit('error', {sourceEvent: event});
  }

  if (isNumber(info.duration) && info.duration !== internalState.duration) {
    internalState.duration = info.duration;
    emit('durationChange', {duration: internalState.duration});
  }

  if (
    isNumber(info.currentTime) &&
    info.currentTime !== internalState.currentTime
  ) {
    internalState.currentTime = info.currentTime;
    // don't fire progress events while seeking via seekbar
    if (!store.getState().isSeeking) {
      emit('progress', {currentTime: internalState.currentTime});
    }
  }

  if (isNumber(info.currentTimeLastUpdated)) {
    internalState.lastTimeUpdate = info.currentTimeLastUpdated;
  }

  if (isNumber(info.playbackRate)) {
    if (internalState.playbackRate !== info.playbackRate) {
      emit('playbackRateChange', {rate: info.playbackRate});
    }
    internalState.playbackRate = info.playbackRate;
  }

  if (isNumber(info.videoLoadedFraction)) {
    const buffered = info.videoLoadedFraction * internalState.duration;
    if (internalState.buffered !== buffered) {
      emit('buffered', {
        seconds: info.videoLoadedFraction * internalState.duration,
      });
    }
    internalState.buffered = buffered;
  }

  if (Array.isArray(info.availablePlaybackRates)) {
    emit('playbackRates', {rates: info.availablePlaybackRates});
  }

  if (isNumber(info.playerState)) {
    onYoutubeStateChange(info, internalStateRef, iframeRef, store);
    internalState.state = info.playerState;
  }
}

function onYoutubeStateChange(
  info: YoutubeMessageInfo,
  internalStateRef: MutableRefObject<YoutubeInternalState>,
  iframeRef: RefObject<HTMLIFrameElement>,
  store: PlayerStoreApi
) {
  const emit = store.getState().emit;
  const state = info.playerState!;

  const onCued = async () => {
    // load poster, if needed
    if (info.videoData?.video_id && !store.getState().cuedMedia?.poster) {
      const url = await loadYoutubePoster(info.videoData.video_id);
      if (url) {
        store.getState().emit('posterLoaded', {url});
      }
    }

    // mark provider as ready
    if (!internalStateRef.current.playbackReady) {
      emit('providerReady', {el: iframeRef.current!});
      internalStateRef.current.playbackReady = true;
    }
    emit('cued');
  };

  emit('youtubeStateChange', {state});
  emit('buffering', {isBuffering: state === YouTubePlayerState.Buffering});

  if (state !== YouTubePlayerState.Ended) {
    internalStateRef.current.firedPlaybackEnd = false;
  }

  switch (state) {
    case YouTubePlayerState.Unstarted:
      // When using autoplay, but autoplay fails, player will get "unstarted" event
      onCued();
      break;
    case YouTubePlayerState.Ended:
      // will sometimes fire twice without this, if player starts buffering as a result of seek to the end
      if (!internalStateRef.current.firedPlaybackEnd) {
        emit('playbackEnd');
        internalStateRef.current.firedPlaybackEnd = true;
      }
      break;
    case YouTubePlayerState.Playing:
      // When using autoplay, "cued" event is never fired, handle "cued" here instead
      onCued();
      emit('play');
      break;
    case YouTubePlayerState.Paused:
      emit('pause');
      break;
    case YouTubePlayerState.Cued:
      onCued();
      break;
  }
}
