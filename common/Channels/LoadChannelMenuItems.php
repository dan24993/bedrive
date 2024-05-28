<?php

namespace Common\Channels;

use App\Models\Channel;
use Illuminate\Support\Collection;

class LoadChannelMenuItems
{
    public function execute(): Collection
    {
        return Channel::limit(40)
            ->where('type', 'channel')
            ->get()
            ->map(
                fn(Channel $channel) => [
                    'label' => $channel->name,
                    'action' => '/' . $channel->slug,
                    'type' => 'route',
                    'model_id' => $channel->id,
                    'id' => $channel->id,
                ],
            );
    }
}
