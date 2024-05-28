import {
  BackgroundSelectorConfig,
  EditableBackgroundProps,
} from './background-selector-config';

export function cssPropsFromBgConfig(
  bgConfig?: Partial<BackgroundSelectorConfig>,
): EditableBackgroundProps | undefined {
  if (bgConfig) {
    return {
      backgroundImage: bgConfig.backgroundImage,
      backgroundColor: bgConfig.backgroundColor,
      backgroundAttachment: bgConfig.backgroundAttachment,
      backgroundSize: bgConfig.backgroundSize,
      backgroundRepeat: bgConfig.backgroundRepeat,
      backgroundPosition: bgConfig.backgroundPosition,
      color: bgConfig.color,
    };
  }
}
