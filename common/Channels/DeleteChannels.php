<?php

namespace Common\Channels;

use App\Models\Channel;
use Carbon\Carbon;
use Illuminate\Support\Arr;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class DeleteChannels
{
    public function execute(Collection $channels): void
    {
        $channelIds = $channels
            ->filter(
                fn(Channel $channel) => !Arr::get(
                    $channel->config,
                    'preventDeletion',
                ),
            )
            ->pluck('id');

        // touch all channels that have channels we're deleting
        // nested so cache for them is cleared properly
        $parentChannelIds = DB::table('channelables')
            ->where('channelable_type', Channel::MODEL_TYPE)
            ->whereIn('channelable_id', $channelIds)
            ->pluck('channel_id');
        Channel::whereIn('id', $parentChannelIds)->update([
            'updated_at' => Carbon::now(),
        ]);

        DB::table('channelables')
            ->whereIn('channel_id', $channelIds)
            ->delete();
        Channel::whereIn('id', $channelIds)->delete();
    }
}
