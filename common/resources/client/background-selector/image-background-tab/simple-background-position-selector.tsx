import {RadioGroup} from '@common/ui/forms/radio-group/radio-group';
import {Radio} from '@common/ui/forms/radio-group/radio';
import {Trans} from '@common/i18n/trans';
import {MessageDescriptor} from '@common/i18n/message-descriptor';
import {message} from '@common/i18n/message';

import {BgSelectorTabProps} from '@common/background-selector/bg-selector-tab-props';
import {BackgroundSelectorConfig} from '@common/background-selector/background-selector-config';

const BackgroundPositions: Record<
  'cover' | 'contain' | 'repeat',
  {
    label: MessageDescriptor;
    bgConfig: Partial<BackgroundSelectorConfig>;
  }
> = {
  cover: {
    label: message('Stretch to fit'),
    bgConfig: {
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
    },
  },
  contain: {
    label: message('Fit image'),
    bgConfig: {
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'contain',
      backgroundPosition: 'center top',
    },
  },
  repeat: {
    label: message('Repeat image'),
    bgConfig: {
      backgroundRepeat: 'repeat',
      backgroundSize: undefined,
      backgroundPosition: 'left top',
    },
  },
};

export function SimpleBackgroundPositionSelector({
  value: imageBgValue,
  onChange,
}: BgSelectorTabProps<BackgroundSelectorConfig>) {
  const selectedPosition = positionKeyFromValue(imageBgValue);
  return (
    <div className="mt-20 border-t pt-14">
      <RadioGroup size="sm" disabled={!imageBgValue}>
        {Object.entries(BackgroundPositions).map(([key, position]) => (
          <Radio
            key={key}
            name="background-position"
            value={key}
            checked={key === selectedPosition}
            onChange={e => {
              if (imageBgValue) {
                onChange?.({
                  ...imageBgValue,
                  ...position.bgConfig,
                });
              }
            }}
          >
            <Trans {...position.label} />
          </Radio>
        ))}
      </RadioGroup>
    </div>
  );
}

function positionKeyFromValue(
  value?: BackgroundSelectorConfig,
): keyof typeof BackgroundPositions {
  if (value?.backgroundSize === 'cover') {
    return 'cover';
  } else if (value?.backgroundSize === 'contain') {
    return 'contain';
  } else {
    return 'repeat';
  }
}
