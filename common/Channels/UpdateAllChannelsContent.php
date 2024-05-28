<?php

namespace Common\Channels;

use App\Models\Channel;
use Illuminate\Console\Command;

class UpdateAllChannelsContent extends Command
{
    protected $signature = 'channels:update';

    public function handle(): void
    {
        $this->info('Updating channels content...');

        $channels = app(Channel::class)
            ->where('type', 'channel')
            ->limit(20)
            ->get();

        $this->withProgressBar($channels, function (Channel $channel) {
            $channel->updateContentFromExternal();
        });
    }
}
