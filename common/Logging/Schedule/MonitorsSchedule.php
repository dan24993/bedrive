<?php

namespace Common\Logging\Schedule;

use Illuminate\Console\Scheduling\Event;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Stringable;
use Symfony\Component\Stopwatch\Stopwatch;

trait MonitorsSchedule
{
    protected function monitorSchedule(Schedule $schedule): void
    {
        collect($schedule->events())->each(function (Event $event) {
            $logItem = new ScheduleLogItem();
            $stopwatch = new Stopwatch(true);

            $event->before(function () use ($event, $stopwatch, $logItem) {
                $logItem->ran_at = now();
                $stopwatch->start($event->command);
            });

            $event->after(function (Stringable $output) use (
                $event,
                $stopwatch,
                $logItem,
            ) {
                $stopwatch->stop($event->command);
                $commandParts = collect(explode(' ', $event->command));
                $artisanIndex = $commandParts->search(
                    fn($str) => trim($str, '\'"') === 'artisan',
                );
                $signature = $commandParts->get($artisanIndex + 1);

                $namespace = get_class(Artisan::all()[$signature]);

                // check if command already ran with the same signature and exit code in the last hour
                $lastLogItem = ScheduleLogItem::query()
                    ->where('command', $namespace)
                    ->when(
                        // only keep one log item of ScheduleHealthCommand
                        $namespace !== ScheduleHealthCommand::class,
                        function ($query) use ($event) {
                            $query
                                ->where('exit_code', $event->exitCode)
                                ->where('ran_at', '>=', now()->subHour());
                        },
                    )
                    ->first();

                $data = [
                    'command' => $namespace,
                    'output' => trim($output->limit(1000)->toString(), "\n"),
                    'exit_code' => $event->exitCode,
                    'duration' => $stopwatch
                        ->getEvent($event->command)
                        ->getDuration(),
                ];

                if ($lastLogItem) {
                    $lastLogItem
                        ->fill([
                            ...$data,
                            'ran_at' => $logItem->ran_at,
                            'count_in_last_hour' =>
                                $lastLogItem->count_in_last_hour + 1,
                        ])
                        ->save();
                } else {
                    $logItem->fill($data)->save();
                }
            });
        });
    }
}
