<?php

namespace Common\Channels;

use App\Models\Channel;
use Illuminate\Support\Arr;

class ChannelLoader
{
    public function __construct(protected Channel $channel)
    {
    }

    public function loadData(?string $loader)
    {
        if (!$loader) {
            $loader = 'channelPage';
        }

        $this->channel->loadContent(request()->all());

        // used as default value during SSR in layout selector button
        $this->channel->config = array_merge(
            [
                'selectedLayout' => Arr::get(
                    $_COOKIE,
                    "channel-layout-{$this->channel->config['contentModel']}",
                    false,
                ),
            ],
            $this->channel->config,
        );

        if ($loader === 'editChannelPage') {
            return [
                'channel' => $this->channel->toArray(),
                'loader' => 'channelPage',
            ];
        }

        $data = request()->get('returnContentOnly')
            ? ['pagination' => $channel->content]
            : [
                'channel' => $channel->toArray(),
                'loader' => 'channelPage',
            ];
    }
}
