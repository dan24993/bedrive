import {MessageDescriptor} from '@common/i18n/message-descriptor';

export interface BackgroundSelectorConfig extends EditableBackgroundProps {
  type: 'image' | 'gradient' | 'color';
  id: string;
  label: MessageDescriptor;
}

export interface EditableBackgroundProps {
  backgroundColor?: string;
  backgroundAttachment?: 'scroll' | 'fixed' | 'local' | 'initial' | 'inherit';
  backgroundSize?: 'auto' | 'cover' | 'contain' | 'initial' | 'inherit';
  backgroundRepeat?: 'repeat' | 'no-repeat' | 'repeat-x' | 'repeat-y';
  backgroundPosition?: string;
  backgroundImage?: string;
  color?: string;
}
