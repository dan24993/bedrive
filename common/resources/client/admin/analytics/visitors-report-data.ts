import {DatasetItem, LocationDatasetItem, ReportMetric} from './report-metric';

export interface VisitorsReportData {
  browsers: ReportMetric<DatasetItem>;
  platforms: ReportMetric<DatasetItem>;
  devices: ReportMetric<DatasetItem>;
  locations: ReportMetric<LocationDatasetItem>;
  pageViews: ReportMetric<DatasetItem>;
}
