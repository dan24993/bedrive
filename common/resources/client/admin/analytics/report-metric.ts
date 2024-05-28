export type RangedDatasetGranularity =
  | 'minute'
  | 'hour'
  | 'day'
  | 'week'
  | 'month'
  | 'year';

export interface ReportMetric<T = unknown, E = unknown> {
  labels?: string[];
  granularity?: RangedDatasetGranularity;
  total?: number;
  datasets: ({label: string; data: T[]} & E)[];
}

export interface DatasetItem {
  label?: string;
  value: number;
  date?: string;
  endDate?: string;
}

export interface LocationDatasetItem extends DatasetItem {
  percentage: number;
  code: string;
}
