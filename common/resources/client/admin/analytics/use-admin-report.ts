import {keepPreviousData, useQuery} from '@tanstack/react-query';
import {BackendResponse} from '../../http/backend-response/backend-response';
import {apiClient} from '../../http/query-client';
import {VisitorsReportData} from './visitors-report-data';
import {IconTree} from '../../icons/create-svg-icon';
import {DateRangeValue} from '@common/ui/forms/input-field/date/date-range-picker/date-range-value';
import {ReactElement} from 'react';
import {SvgIconProps} from '@common/icons/svg-icon';

const Endpoint = 'admin/reports';

export interface HeaderDatum {
  icon: IconTree[] | ReactElement<SvgIconProps>;
  name: string;
  type?: 'number' | 'fileSize' | 'percentage';
  currentValue: number;
  previousValue?: number;
  percentageChange?: number;
}

interface FetchAnalyticsReportResponse extends BackendResponse {
  visitorsReport: VisitorsReportData;
  headerReport: HeaderDatum[];
}

interface Payload {
  types?: ('visitors' | 'header')[];
  dateRange?: DateRangeValue;
}
export function useAdminReport(payload: Payload = {}) {
  return useQuery({
    queryKey: [Endpoint, payload],
    queryFn: () => fetchAnalyticsReport(payload),
    placeholderData: keepPreviousData,
  });
}

function fetchAnalyticsReport({
  types,
  dateRange,
}: Payload): Promise<FetchAnalyticsReportResponse> {
  const params: Record<string, any> = {};
  if (types) {
    params.types = types.join(',');
  }
  if (dateRange) {
    params.startDate = dateRange.start.toAbsoluteString();
    params.endDate = dateRange.end.toAbsoluteString();
    params.timezone = dateRange.start.timeZone;
  }
  return apiClient.get(Endpoint, {params}).then(response => response.data);
}
