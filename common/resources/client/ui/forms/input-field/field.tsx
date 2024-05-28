import React, {ComponentPropsWithoutRef, ReactElement, ReactNode} from 'react';
import {Adornment} from './adornment';
import {InputFieldStyle} from './get-input-field-class-names';
import {BaseFieldProps} from './base-field-props';
import {removeEmptyValuesFromObject} from '@common/utils/objects/remove-empty-values-from-object';
import clsx from 'clsx';

export interface FieldProps extends BaseFieldProps {
  children: ReactNode;
  wrapperProps?: ComponentPropsWithoutRef<'div'>;
  labelProps?: ComponentPropsWithoutRef<'label' | 'span'>;
  descriptionProps?: ComponentPropsWithoutRef<'div'>;
  errorMessageProps?: ComponentPropsWithoutRef<'div'>;
  fieldClassNames: InputFieldStyle;
}
export const Field = React.forwardRef<HTMLDivElement, FieldProps>(
  (props, ref) => {
    const {
      children,
      // Not every component that uses <Field> supports help text.
      description,
      errorMessage,
      descriptionProps = {},
      errorMessageProps = {},
      startAdornment,
      endAdornment,
      adornmentPosition,
      startAppend,
      endAppend,
      fieldClassNames,
      disabled,
      wrapperProps,
    } = props;

    return (
      <div className={fieldClassNames.wrapper} ref={ref} {...wrapperProps}>
        <Label {...props} />
        <div className={fieldClassNames.inputWrapper}>
          <Adornment
            direction="start"
            className={fieldClassNames.adornment}
            position={adornmentPosition}
          >
            {startAdornment}
          </Adornment>
          {startAppend && (
            <Append style={fieldClassNames.append} disabled={disabled}>
              {startAppend}
            </Append>
          )}
          {children}
          {endAppend && (
            <Append style={fieldClassNames.append} disabled={disabled}>
              {endAppend}
            </Append>
          )}
          <Adornment
            direction="end"
            className={fieldClassNames.adornment}
            position={adornmentPosition}
          >
            {endAdornment}
          </Adornment>
        </div>
        {description && !errorMessage && (
          <div className={fieldClassNames.description} {...descriptionProps}>
            {description}
          </div>
        )}
        {errorMessage && (
          <div className={fieldClassNames.error} {...errorMessageProps}>
            {errorMessage}
          </div>
        )}
      </div>
    );
  },
);

function Label({
  labelElementType,
  fieldClassNames,
  labelProps,
  label,
  labelSuffix,
  labelSuffixPosition = 'spaced',
  required,
}: Omit<FieldProps, 'children'>) {
  if (!label) {
    return null;
  }

  const ElementType = labelElementType || 'label';
  const labelNode = (
    <ElementType className={fieldClassNames.label} {...labelProps}>
      {label}
      {required && <span className="text-danger"> *</span>}
    </ElementType>
  );

  if (labelSuffix) {
    return (
      <div
        className={clsx(
          'mb-4 flex w-full gap-4',
          labelSuffixPosition === 'spaced' ? 'items-end' : 'items-center',
        )}
      >
        {labelNode}
        <div
          className={clsx(
            'text-xs text-muted',
            labelSuffixPosition === 'spaced' ? 'ml-auto' : '',
          )}
        >
          {labelSuffix}
        </div>
      </div>
    );
  }

  return labelNode;
}

interface AppendProps {
  children: ReactElement;
  style: InputFieldStyle['append'];
  disabled?: boolean;
}
function Append({children, style, disabled}: AppendProps) {
  return React.cloneElement(children, {
    ...children.props,
    disabled: children.props.disabled || disabled,
    // make sure append styles are not overwritten with empty values
    ...removeEmptyValuesFromObject(style),
  });
}
