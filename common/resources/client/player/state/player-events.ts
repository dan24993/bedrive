import {AudioTrack, MediaStreamType} from '@common/player/state/player-state';
import {YouTubePlayerState} from '@common/player/providers/youtube/youtube-types';
import {MediaItem} from '@common/player/media-item';

export interface PlayerEvents {
  play: void;
  pause: void;
  error: {sourceEvent?: any; fatal?: boolean} | void;
  buffering: {isBuffering: boolean};
  buffered: {seconds: number};
  progress: {currentTime: number};
  playbackRateChange: {rate: number};
  playbackRates: {rates: number[]};
  playbackQualityChange: {quality: string};
  playbackQualities: {qualities: string[]};
  textTracks: {tracks: TextTrack[]};
  currentTextTrackChange: {trackId: number};
  textTrackVisibilityChange: {isVisible: boolean};
  audioTracks: {tracks: AudioTrack[]};
  currentAudioTrackChange: {trackId: number};
  durationChange: {duration: number};
  streamTypeChange: {streamType: MediaStreamType};
  posterLoaded: {url: string};
  seek: {time: number};
  playbackEnd: void;
  beforeCued: {previous: MediaItem | undefined};
  cued: void;
  providerReady: {el: HTMLElement};
  youtubeStateChange: {state: YouTubePlayerState};
}
