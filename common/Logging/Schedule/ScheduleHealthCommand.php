<?php

namespace Common\Logging\Schedule;

use Illuminate\Console\Command;

class ScheduleHealthCommand extends Command
{
    protected $signature = 'schedule:be-health';

    public function handle(): int
    {
        $this->info('CRON schedule is running properly.');

        return Command::SUCCESS;
    }
}
