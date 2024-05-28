<?php

namespace Common\Logging;

use Common\Logging\Mail\OutgoingEmailLogItem;
use Common\Logging\Schedule\ScheduleLogItem;
use Illuminate\Console\Command;

class CleanLogTables extends Command
{
    protected $signature = 'app-logs:clean';
    protected $description = 'Delete old log entries from the database.';

    public function handle()
    {
        ScheduleLogItem::where('ran_at', '<', now()->subDays(30))->delete();
        OutgoingEmailLogItem::where(
            'created_at',
            '<',
            now()->subDays(7),
        )->delete();

        $this->info('Old log entries have been deleted.');

        return self::SUCCESS;
    }
}
