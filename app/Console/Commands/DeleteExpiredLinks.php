<?php

namespace App\Console\Commands;

use App\Models\ShareableLink;
use Carbon\Carbon;
use Illuminate\Console\Command;

class DeleteExpiredLinks extends Command
{
    protected $signature = 'links:delete_expired';
    protected $description = 'Delete expired shareable links for files and folders';

    public function handle(): int
    {
        $count = ShareableLink::where(
            'expires_at',
            '<',
            Carbon::now(),
        )->count();
        ShareableLink::where('expires_at', '<', Carbon::now())->delete();

        $this->info("Deleted $count expired links");

        return Command::SUCCESS;
    }
}
