<?php

namespace Common\Core\Install;

use Illuminate\Console\Command;

class UpdateActionsCommand extends Command
{
    protected $signature = 'update:run';

    public function handle(): int
    {
        (new UpdateActions())->execute();

        $this->info('Update complete');

        return Command::SUCCESS;
    }
}
