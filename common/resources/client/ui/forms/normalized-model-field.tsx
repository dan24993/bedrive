import React, {ReactNode, useRef, useState} from 'react';
import {useTrans} from '../../i18n/use-trans';
import {Trans} from '../../i18n/trans';
import {Avatar} from '../images/avatar';
import {Tooltip} from '../tooltip/tooltip';
import {IconButton} from '../buttons/icon-button';
import {EditIcon} from '../../icons/material/Edit';
import {message} from '../../i18n/message';
import {Item} from './listbox/item';
import {useController, useFormContext} from 'react-hook-form';
import {useControlledState} from '@react-stately/utils';
import {getInputFieldClassNames} from './input-field/get-input-field-class-names';
import clsx from 'clsx';
import {Skeleton} from '../skeleton/skeleton';
import {useNormalizedModels} from '../../users/queries/use-normalized-models';
import {useNormalizedModel} from '../../users/queries/use-normalized-model';
import {AnimatePresence, m} from 'framer-motion';
import {opacityAnimation} from '../animation/opacity-animation';
import {Select} from '@common/ui/forms/select/select';
import {MessageDescriptor} from '@common/i18n/message-descriptor';
import {BaseFieldProps} from '@common/ui/forms/input-field/base-field-props';

interface NormalizedModelFieldProps {
  label?: ReactNode;
  className?: string;
  background?: BaseFieldProps['background'];
  value?: string | number;
  placeholder?: MessageDescriptor;
  searchPlaceholder?: MessageDescriptor;
  defaultValue?: string | number;
  onChange?: (value: string | number) => void;
  invalid?: boolean;
  errorMessage?: string;
  description?: ReactNode;
  autoFocus?: boolean;
  queryParams?: Record<string, string>;
  endpoint: string;
  disabled?: boolean;
  required?: boolean;
}
export function NormalizedModelField({
  label,
  className,
  background,
  value,
  defaultValue = '',
  placeholder = message('Select item...'),
  searchPlaceholder = message('Find an item...'),
  onChange,
  description,
  errorMessage,
  invalid,
  autoFocus,
  queryParams,
  endpoint,
  disabled,
  required,
}: NormalizedModelFieldProps) {
  const inputRef = useRef<HTMLButtonElement>(null);
  const [inputValue, setInputValue] = useState('');
  const [selectedValue, setSelectedValue] = useControlledState(
    value,
    defaultValue,
    onChange,
  );
  const query = useNormalizedModels(endpoint, {
    query: inputValue,
    ...queryParams,
  });
  const {trans} = useTrans();

  const fieldClassNames = getInputFieldClassNames({size: 'md'});

  if (selectedValue) {
    return (
      <div className={className}>
        <div className={fieldClassNames.label}>{label}</div>
        <div
          className={clsx(
            'rounded-input border p-8',
            background,
            invalid && 'border-danger',
          )}
        >
          <AnimatePresence initial={false} mode="wait">
            <SelectedModelPreview
              disabled={disabled}
              endpoint={endpoint}
              modelId={selectedValue}
              queryParams={queryParams}
              onEditClick={() => {
                setSelectedValue('');
                setInputValue('');
                requestAnimationFrame(() => {
                  inputRef.current?.focus();
                  inputRef.current?.click();
                });
              }}
            />
          </AnimatePresence>
        </div>
        {description && !errorMessage && (
          <div className={fieldClassNames.description}>{description}</div>
        )}
        {errorMessage && (
          <div className={fieldClassNames.error}>{errorMessage}</div>
        )}
      </div>
    );
  }

  return (
    <Select
      className={className}
      showSearchField
      invalid={invalid}
      errorMessage={errorMessage}
      description={description}
      color="white"
      isAsync
      background={background}
      placeholder={trans(placeholder)}
      searchPlaceholder={trans(searchPlaceholder)}
      label={label}
      isLoading={query.isFetching}
      items={query.data?.results}
      inputValue={inputValue}
      onInputValueChange={setInputValue}
      selectionMode="single"
      selectedValue={selectedValue}
      onSelectionChange={setSelectedValue}
      ref={inputRef}
      autoFocus={autoFocus}
      disabled={disabled}
      required={required}
    >
      {model => (
        <Item
          value={model.id}
          key={model.id}
          description={model.description}
          startIcon={<Avatar src={model.image} />}
        >
          {model.name}
        </Item>
      )}
    </Select>
  );
}

interface SelectedModelPreviewProps {
  modelId: string | number;
  selectedValue?: number | string;
  onEditClick?: () => void;
  endpoint?: string;
  disabled?: boolean;
  queryParams?: NormalizedModelFieldProps['queryParams'];
}
function SelectedModelPreview({
  modelId,
  onEditClick,
  endpoint,
  disabled,
  queryParams,
}: SelectedModelPreviewProps) {
  const {data, isLoading} = useNormalizedModel(
    `${endpoint}/${modelId}`,
    queryParams,
  );

  if (isLoading || !data?.model) {
    return <LoadingSkeleton key="skeleton" />;
  }

  return (
    <m.div
      className={clsx(
        'flex items-center gap-10',
        disabled && 'pointer-events-none cursor-not-allowed text-disabled',
      )}
      key="preview"
      {...opacityAnimation}
    >
      {data.model.image && <Avatar src={data.model.image} />}
      <div>
        <div className="text-sm leading-4">{data.model.name}</div>
        <div className="text-xs text-muted">{data.model.description}</div>
      </div>
      <Tooltip label={<Trans message="Change item" />}>
        <IconButton
          className="ml-auto text-muted"
          size="sm"
          onClick={onEditClick}
          disabled={disabled}
        >
          <EditIcon />
        </IconButton>
      </Tooltip>
    </m.div>
  );
}

function LoadingSkeleton() {
  return (
    <m.div className="flex items-center gap-10" {...opacityAnimation}>
      <Skeleton variant="rect" size="w-32 h-32" />
      <div className="max-h-[36px] flex-auto">
        <Skeleton className="text-xs" />
        <Skeleton className="max-h-8 text-xs" />
      </div>
      <Skeleton variant="icon" size="w-24 h-24" />
    </m.div>
  );
}

interface FormNormalizedModelFieldProps extends NormalizedModelFieldProps {
  name: string;
}
export function FormNormalizedModelField({
  name,
  ...fieldProps
}: FormNormalizedModelFieldProps) {
  const {clearErrors} = useFormContext();
  const {
    field: {onChange, value = ''},
    fieldState: {invalid, error},
  } = useController({
    name,
  });

  return (
    <NormalizedModelField
      value={value}
      onChange={value => {
        onChange(value);
        clearErrors(name);
      }}
      invalid={invalid}
      errorMessage={error?.message}
      {...fieldProps}
    />
  );
}
