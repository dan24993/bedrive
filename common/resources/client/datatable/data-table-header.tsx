import React, {ComponentPropsWithoutRef, ReactNode} from 'react';
import {BackendFilter} from './filters/backend-filter';
import {useTrans} from '../i18n/use-trans';
import {TextField} from '../ui/forms/input-field/text-field/text-field';
import {SearchIcon} from '../icons/material/Search';
import {AddFilterButton} from './filters/add-filter-button';
import {MessageDescriptor} from '@common/i18n/message-descriptor';
import {message} from '@common/i18n/message';

interface Props {
  actions?: ReactNode;
  filters?: BackendFilter[];
  filtersLoading?: boolean;
  searchPlaceholder?: MessageDescriptor;
  searchValue?: string;
  onSearchChange: (value: string) => void;
}
export function DataTableHeader({
  actions,
  filters,
  filtersLoading,
  searchPlaceholder = message('Type to search...'),
  searchValue = '',
  onSearchChange,
}: Props) {
  const {trans} = useTrans();
  return (
    <HeaderLayout>
      <TextField
        size="sm"
        className="mr-auto min-w-180 max-w-440 flex-auto"
        inputWrapperClassName="mr-24 md:mr-0"
        placeholder={trans(searchPlaceholder)}
        startAdornment={<SearchIcon size="sm" />}
        value={searchValue}
        onChange={e => {
          onSearchChange(e.target.value);
        }}
      />
      {filters && (
        <AddFilterButton filters={filters} disabled={filtersLoading} />
      )}
      {actions}
    </HeaderLayout>
  );
}

interface AnimatedHeaderProps extends ComponentPropsWithoutRef<'div'> {
  children: ReactNode;
}
export function HeaderLayout({children, ...domProps}: AnimatedHeaderProps) {
  return (
    <div
      className="hidden-scrollbar relative mb-24 flex h-42 items-center gap-8 overflow-x-auto text-muted md:gap-12"
      {...domProps}
    >
      {children}
    </div>
  );
}
