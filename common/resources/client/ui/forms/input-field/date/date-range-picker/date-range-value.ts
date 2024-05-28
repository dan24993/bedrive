import {ZonedDateTime} from '@internationalized/date';

export type DateRangeValue = {
  start: ZonedDateTime;
  end: ZonedDateTime;
  preset?: number;
  compareStart?: ZonedDateTime;
  compareEnd?: ZonedDateTime;
  comparePreset?: number;
};

export function dateRangeValueToPayload(value: {
  dateRange?: DateRangeValue;
  [key: string]: any;
}) {
  const payload = {
    ...value,
  };
  if (payload.dateRange) {
    payload.startDate = payload.dateRange.start.toAbsoluteString();
    payload.endDate = payload.dateRange.end.toAbsoluteString();
    payload.compareStartDate =
      payload.dateRange.compareStart?.toAbsoluteString();
    payload.compareEndDate = payload.dateRange.compareEnd?.toAbsoluteString();
    payload.timezone = payload.dateRange.start.timeZone;
    delete payload.dateRange;
  }
  return payload;
}
