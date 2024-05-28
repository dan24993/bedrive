import {message} from '@common/i18n/message';
import {DateRangeValue} from '@common/ui/forms/input-field/date/date-range-picker/date-range-value';
import {MessageDescriptor} from '@common/i18n/message-descriptor';

export interface DateRangeComparePreset {
  key: number;
  label: MessageDescriptor;
  getRangeValue: (range: DateRangeValue) => DateRangeValue;
}

export const DateRangeComparePresets: DateRangeComparePreset[] = [
  {
    key: 0,
    label: message('Preceding period'),
    getRangeValue: (range: DateRangeValue) => {
      const startDate = range.start;
      const endDate = range.end;

      const diffInMilliseconds =
        endDate.toDate().getTime() - startDate.toDate().getTime();
      const diffInMinutes = diffInMilliseconds / (1000 * 60);
      const newStart = startDate.subtract({minutes: diffInMinutes});
      return {
        preset: 0,
        start: newStart,
        end: startDate,
      };
    },
  },
  {
    key: 1,
    label: message('Same period last year'),
    getRangeValue: (range: DateRangeValue) => {
      return {
        start: range.start.subtract({years: 1}),
        end: range.end.subtract({years: 1}),
        preset: 1,
      };
    },
  },
  {
    key: 2,
    label: message('Custom'),
    getRangeValue: (range: DateRangeValue) => {
      return {
        start: range.start.subtract({weeks: 1}),
        end: range.end.subtract({weeks: 1}),
        preset: 2,
      };
    },
  },
];
