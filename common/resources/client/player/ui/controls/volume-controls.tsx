import {Slider} from '@common/ui/forms/slider/slider';
import {usePlayerActions} from '@common/player/hooks/use-player-actions';
import {usePlayerStore} from '@common/player/hooks/use-player-store';
import {IconButton} from '@common/ui/buttons/icon-button';
import {BaseSliderProps} from '@common/ui/forms/slider/base-slider';
import {ButtonProps} from '@common/ui/buttons/button';
import {MediaMuteIcon} from '@common/icons/media/media-mute';
import {MediaVolumeLowIcon} from '@common/icons/media/media-volume-low';
import {MediaVolumeHighIcon} from '@common/icons/media/media-volume-high';
import {Tooltip} from '@common/ui/tooltip/tooltip';
import {Trans} from '@common/i18n/trans';
import clsx from 'clsx';

interface Props {
  trackColor?: BaseSliderProps['trackColor'];
  fillColor?: BaseSliderProps['fillColor'];
  buttonColor?: ButtonProps['color'];
  className?: string;
}
export function VolumeControls({
  trackColor,
  fillColor,
  buttonColor,
  className,
}: Props) {
  const volume = usePlayerStore(s => s.volume);
  const player = usePlayerActions();
  const playerReady = usePlayerStore(s => s.providerReady);

  return (
    <div className={clsx('flex w-min items-center gap-4', className)}>
      <ToggleMuteButton color={buttonColor} />
      <Slider
        isDisabled={!playerReady}
        showThumbOnHoverOnly
        thumbSize="w-14 h-14"
        trackColor={trackColor}
        fillColor={fillColor}
        minValue={0}
        maxValue={100}
        className="flex-auto"
        width="w-96"
        value={volume}
        onChange={value => {
          player.setVolume(value);
        }}
      />
    </div>
  );
}

interface ToggleMuteButtonProps {
  color?: ButtonProps['color'];
  size?: ButtonProps['size'];
  iconSize?: ButtonProps['size'];
}
export function ToggleMuteButton({
  color,
  size = 'sm',
  iconSize = 'md',
}: ToggleMuteButtonProps) {
  const isMuted = usePlayerStore(s => s.muted);
  const volume = usePlayerStore(s => s.volume);
  const player = usePlayerActions();
  const playerReady = usePlayerStore(s => s.providerReady);

  if (isMuted) {
    return (
      <Tooltip label={<Trans message="Unmute" />} usePortal={false}>
        <IconButton
          disabled={!playerReady}
          color={color}
          size={size}
          iconSize={iconSize}
          onClick={() => player.setMuted(false)}
        >
          <MediaMuteIcon />
        </IconButton>
      </Tooltip>
    );
  }
  return (
    <Tooltip label={<Trans message="Mute" />}>
      <IconButton
        disabled={!playerReady}
        color={color}
        size={size}
        iconSize={iconSize}
        onClick={() => player.setMuted(true)}
      >
        {volume < 40 ? <MediaVolumeLowIcon /> : <MediaVolumeHighIcon />}
      </IconButton>
    </Tooltip>
  );
}
