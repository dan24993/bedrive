export interface ScheduleLogItem {
  id: number;
  command: string;
  output: string;
  ran_at: string;
  duration: number;
  count_in_last_hour: number;
  exit_code: number;
}
