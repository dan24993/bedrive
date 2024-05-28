import {useDateRangePickerState} from '@common/ui/forms/input-field/date/date-range-picker/use-date-range-picker-state';
import {DialogTrigger} from '@common/ui/overlays/dialog/dialog-trigger';
import {Button} from '@common/ui/buttons/button';
import {DateRangeIcon} from '@common/icons/material/DateRange';
import {FormattedDateTimeRange} from '@common/i18n/formatted-date-time-range';
import {DateRangeDialog} from '@common/ui/forms/input-field/date/date-range-picker/dialog/date-range-dialog';
import React from 'react';
import {DateRangeValue} from '@common/ui/forms/input-field/date/date-range-picker/date-range-value';
import {useIsMobileMediaQuery} from '@common/utils/hooks/is-mobile-media-query';
import {DateFormatPresets} from '@common/i18n/formatted-date';
import {DateRangeComparePresets} from '@common/ui/forms/input-field/date/date-range-picker/dialog/date-range-compare-presets';
import {Granularity} from '@common/ui/forms/input-field/date/date-picker/use-date-picker-state';

const monthDayFormat: Intl.DateTimeFormatOptions = {
  month: 'short',
  day: '2-digit',
};

interface ReportDataSelectorProps {
  value: DateRangeValue;
  disabled?: boolean;
  onChange: (value: DateRangeValue) => void;
  compactOnMobile?: boolean;
  enableCompare?: boolean;
  granularity?: Granularity;
}
export function ReportDateSelector({
  value,
  onChange,
  disabled,
  compactOnMobile = true,
  enableCompare = false,
  granularity = 'minute',
}: ReportDataSelectorProps) {
  const isMobile = useIsMobileMediaQuery();
  return (
    <DialogTrigger
      type="popover"
      onClose={value => {
        if (value) {
          onChange(value);
        }
      }}
    >
      <Button
        variant="outline"
        color="chip"
        endIcon={<DateRangeIcon />}
        disabled={disabled}
      >
        <FormattedDateTimeRange
          start={value.start}
          end={value.end}
          options={
            isMobile && compactOnMobile
              ? monthDayFormat
              : DateFormatPresets.short
          }
        />
      </Button>
      <DateSelectorDialog
        value={value}
        enableCompare={enableCompare}
        granularity={granularity}
      />
    </DialogTrigger>
  );
}

interface DateSelectorDialogProps {
  value: DateRangeValue;
  enableCompare: boolean;
  granularity: Granularity;
}
function DateSelectorDialog({
  value,
  enableCompare,
  granularity,
}: DateSelectorDialogProps) {
  const isMobile = useIsMobileMediaQuery();
  const state = useDateRangePickerState({
    granularity,
    defaultValue: {
      start: value.start,
      end: value.end,
      preset: value.preset,
    },
    closeDialogOnSelection: false,
  });
  const compareHasInitialValue = !!value.compareStart && !!value.compareEnd;
  const compareState = useDateRangePickerState({
    granularity,
    defaultValue: compareHasInitialValue
      ? {
          start: value.compareStart,
          end: value.compareEnd,
          preset: value.comparePreset,
        }
      : DateRangeComparePresets[0].getRangeValue(state.selectedValue),
  });
  return (
    <DateRangeDialog
      state={state}
      compareState={enableCompare ? compareState : undefined}
      compareVisibleDefault={compareHasInitialValue}
      showInlineDatePickerField={!isMobile}
    />
  );
}
