import React, {ReactElement, Ref, RefObject} from 'react';
import clsx from 'clsx';
import {useController} from 'react-hook-form';
import {mergeProps} from '@react-aria/utils';
import {getInputFieldClassNames} from '../input-field/get-input-field-class-names';
import {Field} from '../input-field/field';
import {BaseFieldPropsWithDom} from '../input-field/base-field-props';
import {useListbox} from '../listbox/use-listbox';
import {useField} from '../input-field/use-field';
import {Item} from '../listbox/item';
import {Section} from '../listbox/section';
import {Listbox} from '../listbox/listbox';
import {Trans} from '@common/i18n/trans';
import {useListboxKeyboardNavigation} from '../listbox/use-listbox-keyboard-navigation';
import {useTypeSelect} from '../listbox/use-type-select';
import {ListBoxChildren, ListboxProps} from '../listbox/types';
import {useIsMobileMediaQuery} from '@common/utils/hooks/is-mobile-media-query';
import {TextField} from '@common/ui/forms/input-field/text-field/text-field';
import {SearchIcon} from '@common/icons/material/Search';
import {ComboboxEndAdornment} from '@common/ui/forms/combobox/combobox-end-adornment';

export type SelectProps<T extends object> = Omit<
  BaseFieldPropsWithDom<HTMLButtonElement>,
  'value'
> &
  ListboxProps &
  ListBoxChildren<T> & {
    hideCaret?: boolean;
    selectionMode: 'single';
    minWidth?: string;
    searchPlaceholder?: string;
    showSearchField?: boolean;
    valueClassName?: string;
  };
function Select<T extends object>(
  props: SelectProps<T>,
  ref: Ref<HTMLButtonElement>,
) {
  const isMobile = useIsMobileMediaQuery();
  const {
    hideCaret,
    placeholder = <Trans message="Select an option..." />,
    selectedValue,
    onItemSelected,
    onOpenChange,
    onInputValueChange,
    onSelectionChange,
    selectionMode,
    minWidth = 'min-w-128',
    children,
    searchPlaceholder,
    showEmptyMessage,
    showSearchField,
    defaultInputValue,
    inputValue: userInputValue,
    isLoading,
    isAsync,
    valueClassName,
    floatingWidth = isMobile ? 'auto' : 'matchTrigger',
    ...inputFieldProps
  } = props;

  const listbox = useListbox(
    {
      ...props,
      clearInputOnItemSelection: true,
      showEmptyMessage: showEmptyMessage || showSearchField,
      floatingWidth,
      selectionMode: 'single',
      role: 'listbox',
      virtualFocus: showSearchField,
    },
    ref,
  );
  const {
    state: {
      selectedValues,
      isOpen,
      setIsOpen,
      activeIndex,
      setSelectedIndex,
      inputValue,
      setInputValue,
    },
    collections,
    focusItem,
    listboxId,
    reference,
    refs,
    listContent,
    onInputChange,
  } = listbox;

  const {fieldProps, inputProps} = useField({
    ...inputFieldProps,
    focusRef: refs.reference as RefObject<HTMLButtonElement>,
  });

  const selectedOption = collections.collection.get(selectedValues[0]);
  const content = selectedOption ? (
    <span className="flex items-center gap-10">
      {selectedOption.element.props.startIcon}
      <span
        className={clsx(
          'overflow-hidden overflow-ellipsis whitespace-nowrap',
          valueClassName,
        )}
      >
        {selectedOption.element.props.children}
      </span>
    </span>
  ) : (
    <span className="italic">{placeholder}</span>
  );

  const fieldClassNames = getInputFieldClassNames({
    ...props,
    endAdornment: true,
  });

  const {
    handleTriggerKeyDown,
    handleListboxKeyboardNavigation,
    handleListboxSearchFieldKeydown,
  } = useListboxKeyboardNavigation(listbox);

  const {findMatchingItem} = useTypeSelect();

  // focus matching item when user types, if dropdown is open
  const handleListboxTypeSelect = (e: React.KeyboardEvent) => {
    if (!isOpen) return;
    const i = findMatchingItem(e, listContent, activeIndex);
    if (i != null) {
      focusItem('increment', i);
    }
  };

  // select matching item when user types, if dropdown is closed
  const handleTriggerTypeSelect = (e: React.KeyboardEvent) => {
    if (isOpen) return undefined;
    const i = findMatchingItem(e, listContent, activeIndex);
    if (i != null) {
      setSelectedIndex(i);
    }
  };

  return (
    <Listbox
      listbox={listbox}
      onKeyDownCapture={!showSearchField ? handleListboxTypeSelect : undefined}
      onKeyDown={handleListboxKeyboardNavigation}
      onClose={showSearchField ? () => setInputValue('') : undefined}
      isLoading={isLoading}
      searchField={
        showSearchField && (
          <TextField
            size={props.size === 'xs' || props.size === 'sm' ? 'xs' : 'sm'}
            placeholder={searchPlaceholder}
            startAdornment={<SearchIcon />}
            className="flex-shrink-0 px-8 pb-8 pt-4"
            autoFocus
            aria-expanded={isOpen ? 'true' : 'false'}
            aria-haspopup="listbox"
            aria-controls={isOpen ? listboxId : undefined}
            aria-autocomplete="list"
            autoComplete="off"
            autoCorrect="off"
            spellCheck="false"
            value={inputValue}
            onChange={onInputChange}
            onKeyDown={e => {
              handleListboxSearchFieldKeydown(e);
            }}
          />
        )
      }
    >
      <Field
        fieldClassNames={fieldClassNames}
        {...fieldProps}
        endAdornment={
          !hideCaret && <ComboboxEndAdornment isLoading={isLoading} />
        }
      >
        <button
          {...inputProps}
          type="button"
          data-selected-value={selectedOption?.value}
          aria-expanded={isOpen ? 'true' : 'false'}
          aria-haspopup="listbox"
          aria-controls={isOpen ? listboxId : undefined}
          ref={reference}
          onKeyDown={handleTriggerKeyDown}
          onKeyDownCapture={
            !showSearchField ? handleTriggerTypeSelect : undefined
          }
          disabled={inputFieldProps.disabled}
          onClick={() => {
            setIsOpen(!isOpen);
          }}
          className={clsx(
            fieldClassNames.input,
            !fieldProps.unstyled && minWidth,
          )}
        >
          {content}
        </button>
      </Field>
    </Listbox>
  );
}

const SelectForwardRef = React.forwardRef(Select) as <T extends object>(
  props: SelectProps<T> & {ref?: Ref<HTMLButtonElement>},
) => ReactElement;
export {SelectForwardRef as Select};

export type FormSelectProps<T extends object> = SelectProps<T> & {
  name: string;
};
export function FormSelect<T extends object>({
  children,
  ...props
}: FormSelectProps<T>) {
  const {
    field: {onChange, onBlur, value = null, ref},
    fieldState: {invalid, error},
  } = useController({
    name: props.name,
  });

  const formProps: Partial<SelectProps<T>> = {
    onSelectionChange: onChange,
    onBlur,
    selectedValue: value,
    invalid,
    errorMessage: error?.message,
    name: props.name,
  };

  // make sure error message is not overridden by undefined or null
  const errorMessage = props.errorMessage || error?.message;
  return (
    <SelectForwardRef
      ref={ref}
      {...mergeProps(formProps, props, {errorMessage})}
    >
      {children}
    </SelectForwardRef>
  );
}

export {Item as Option};
export {Section as OptionGroup};
