import React, {ComponentPropsWithoutRef, ReactNode, useId} from 'react';
import clsx from 'clsx';
import {useController} from 'react-hook-form';
import {mergeProps, useObjectRef} from '@react-aria/utils';
import {InputSize} from '../input-field/input-size';
import {getInputFieldClassNames} from '../input-field/get-input-field-class-names';
import {AutoFocusProps, useAutoFocus} from '../../focus/use-auto-focus';

interface SwitchProps
  extends AutoFocusProps,
    Omit<ComponentPropsWithoutRef<'input'>, 'size'> {
  size?: InputSize;
  className?: string;
  description?: ReactNode;
  invalid?: boolean;
  errorMessage?: string;
  iconRight?: ReactNode;
}
export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  (props, ref) => {
    const {
      children,
      size = 'sm',
      description,
      className,
      invalid,
      autoFocus,
      errorMessage,
      iconRight,
      ...domProps
    } = props;

    const inputRef = useObjectRef(ref);
    useAutoFocus({autoFocus}, inputRef);

    const style = getSizeClassName(size);
    const fieldClassNames = getInputFieldClassNames(props);

    const descriptionId = useId();

    return (
      <div className={clsx(className, 'isolate')}>
        <label className="flex select-none items-center">
          <input
            {...domProps}
            type="checkbox"
            role="switch"
            aria-invalid={invalid || undefined}
            aria-describedby={description ? descriptionId : undefined}
            ref={inputRef}
            aria-checked={domProps.checked}
            className={clsx(
              style,
              !invalid &&
                'checked:border-primary checked:bg-primary dark:checked:border-primary-dark dark:checked:bg-primary-dark',
              invalid && 'checked:border-danger checked:bg-danger',
              'relative flex flex-shrink-0 cursor-pointer appearance-none items-center overflow-hidden rounded-3xl border border-chip bg-chip p-0 outline-none transition-colors checked:border-primary checked:bg-primary',
              'before:z-10 before:block before:translate-x-2 before:rounded-3xl before:border before:bg-white before:transition-transform',
              'checked:before:border-white',
              'focus-visible:ring',
              props.disabled && 'cursor-not-allowed opacity-80',
            )}
          />
          {children && (
            <span
              className={clsx(
                fieldClassNames.size.font,
                'ml-12',
                invalid && 'text-danger',
                props.disabled && 'text-disabled',
              )}
            >
              {children}
            </span>
          )}
          {iconRight}
        </label>
        {description && !errorMessage && (
          <div id={descriptionId} className={fieldClassNames.description}>
            {description}
          </div>
        )}
        {errorMessage && (
          <div id={descriptionId} className={fieldClassNames.error}>
            {errorMessage}
          </div>
        )}
      </div>
    );
  },
);

interface FormSwitchProps extends SwitchProps {
  name: string;
}
export function FormSwitch(props: FormSwitchProps) {
  const {
    field: {onChange, onBlur, value = false, ref},
    fieldState: {invalid, error},
  } = useController({
    name: props.name,
  });

  const formProps: Partial<SwitchProps> = {
    onChange: e => {
      if (e.target.value && e.target.value !== 'on') {
        onChange(e.target.checked ? e.target.value : false);
      } else {
        onChange(e);
      }
    },
    onBlur,
    checked: !!value,
    invalid,
    errorMessage: error?.message,
    name: props.name,
  };

  return <Switch ref={ref} {...mergeProps(props, formProps)} />;
}

function getSizeClassName(size: InputSize): string {
  switch (size) {
    case 'xl':
      return 'w-68 h-36 before:w-28 before:h-28 checked:before:translate-x-36';
    case 'lg':
      return 'w-56 h-30 before:w-22 before:h-22 checked:before:translate-x-30';
    case 'md':
      return 'w-46 h-24 before:w-18 before:h-18 checked:before:translate-x-24';
    case 'xs':
      return 'w-30 h-18 before:w-12 before:h-12 checked:before:translate-x-14';
    default:
      return 'w-38 h-20 before:w-14 before:h-14 checked:before:translate-x-20';
  }
}
