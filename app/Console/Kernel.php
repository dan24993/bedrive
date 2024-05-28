<?php

namespace App\Console;

use App\Console\Commands\CleanDemoSite;
use App\Console\Commands\CreateDemoAccounts;
use App\Console\Commands\DeleteExpiredLinks;
use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    protected $commands = [DeleteExpiredLinks::class];

    protected function schedule(Schedule $schedule)
    {
        $schedule->command(DeleteExpiredLinks::class)->everyMinute();

        if (config('common.site.demo')) {
            $schedule->command(CleanDemoSite::class)->daily();
        }
    }

    protected function commands()
    {
        if (config('common.site.demo')) {
            $this->registerCommand(app(CreateDemoAccounts::class));
            $this->registerCommand(app(CleanDemoSite::class));
        }

        require base_path('routes/console.php');
    }
}
