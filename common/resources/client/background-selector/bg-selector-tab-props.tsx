import {BackgroundSelectorConfig} from '@common/background-selector/background-selector-config';

export interface BgSelectorTabProps<T extends BackgroundSelectorConfig> {
  value?: T;
  onChange: (value: T | null) => void;
  className?: string;
  isInsideDialog?: boolean;
  positionSelector?: 'simple' | 'advanced';
  diskPrefix?: string;
}
