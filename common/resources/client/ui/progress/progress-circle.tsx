import React, {ComponentPropsWithoutRef, CSSProperties} from 'react';
import clsx from 'clsx';
import {clamp} from '../../utils/number/clamp';
import {useNumberFormatter} from '../../i18n/use-number-formatter';

export interface ProgressCircleProps extends ComponentPropsWithoutRef<'div'> {
  value?: number;
  minValue?: number;
  maxValue?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg' | string;
  isIndeterminate?: boolean;
  className?: string;
  position?: string;
  trackColor?: string;
  fillColor?: string;
}
export const ProgressCircle = React.forwardRef<
  HTMLDivElement,
  ProgressCircleProps
>((props, ref) => {
  let {
    value = 0,
    minValue = 0,
    maxValue = 100,
    size = 'md',
    isIndeterminate = false,
    className,
    position = 'relative',
    trackColor,
    fillColor = 'border-primary',
    ...domProps
  } = props;

  value = clamp(value, minValue, maxValue);
  const circleSize = getCircleStyle(size);

  const percentage = (value - minValue) / (maxValue - minValue);
  const formatter = useNumberFormatter({style: 'percent'});

  let valueLabel = '';
  if (!isIndeterminate && !valueLabel) {
    valueLabel = formatter.format(percentage);
  }

  const subMask1Style: CSSProperties = {};
  const subMask2Style: CSSProperties = {};
  if (!isIndeterminate) {
    const percentage = ((value - minValue) / (maxValue - minValue)) * 100;
    let angle;
    if (percentage > 0 && percentage <= 50) {
      angle = -180 + (percentage / 50) * 180;
      subMask1Style.transform = `rotate(${angle}deg)`;
      subMask2Style.transform = 'rotate(-180deg)';
    } else if (percentage > 50) {
      angle = -180 + ((percentage - 50) / 50) * 180;
      subMask1Style.transform = 'rotate(0deg)';
      subMask2Style.transform = `rotate(${angle}deg)`;
    }
  }

  return (
    <div
      {...domProps}
      aria-valuenow={isIndeterminate ? undefined : value}
      aria-valuemin={minValue}
      aria-valuemax={maxValue}
      aria-valuetext={isIndeterminate ? undefined : valueLabel}
      role="progressbar"
      ref={ref}
      className={clsx(
        'progress-circle',
        position,
        circleSize,
        isIndeterminate && 'indeterminate',
        className
      )}
    >
      <div className={clsx(circleSize, trackColor, 'rounded-full border-4')} />
      <div
        className={clsx(
          'fills absolute left-0 top-0 h-full w-full',
          isIndeterminate && 'progress-circle-fills-animate'
        )}
      >
        <FillMask
          circleSize={circleSize}
          subMaskStyle={subMask1Style}
          isIndeterminate={isIndeterminate}
          className="rotate-180"
          fillColor={fillColor}
          subMaskClassName={clsx(
            isIndeterminate && 'progress-circle-fill-submask-1-animate'
          )}
        />
        <FillMask
          circleSize={circleSize}
          subMaskStyle={subMask2Style}
          isIndeterminate={isIndeterminate}
          fillColor={fillColor}
          subMaskClassName={clsx(
            isIndeterminate && 'progress-circle-fill-submask-2-animate'
          )}
        />
      </div>
    </div>
  );
});

interface FillMaskProps {
  className?: string;
  circleSize?: string;
  subMaskStyle: CSSProperties;
  subMaskClassName: string;
  isIndeterminate?: boolean;
  fillColor?: string;
}
function FillMask({
  subMaskStyle,
  subMaskClassName,
  className,
  circleSize,
  isIndeterminate,
  fillColor,
}: FillMaskProps) {
  return (
    <div
      className={clsx(
        'absolute h-full w-1/2 origin-[100%] overflow-hidden',
        className
      )}
    >
      <div
        className={clsx(
          'h-full w-full origin-[100%] rotate-180 overflow-hidden',
          !isIndeterminate && 'transition-transform duration-100',
          subMaskClassName
        )}
        style={subMaskStyle}
      >
        <div className={clsx(circleSize, fillColor, 'rounded-full border-4')} />
      </div>
    </div>
  );
}

function getCircleStyle(size: ProgressCircleProps['size']) {
  switch (size) {
    case 'xs':
      return 'w-20 h-20';
    case 'sm':
      return 'w-24 h-24';
    case 'md':
      return 'w-32 h-32';
    case 'lg':
      return 'w-42 h-42';
    default:
      return size;
  }
}
