<?php

namespace Common\Channels;

use App\Models\Channel;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class CrupdateChannel
{
    public function execute($params, Channel $initialChannel = null): Channel
    {
        // can either specify channel model or namespace from which to instantiate
        if (!$initialChannel) {
            $channel = app(Channel::class)->newInstance([
                'user_id' => Auth::id(),
            ]);
        } else {
            $channel = $initialChannel;
        }

        $attributes = [
            'name' => $params['name'],
            'public' => $params['public'] ?? true,
            'internal' => $params['internal'] ?? false,
            'type' => $params['type'] ?? $channel->type ?? 'channel',
            'description' => $params['description'] ?? null,
            // merge old config so config that is not in crupdate channel form is not lost
            'config' => array_merge(
                $initialChannel['config'] ?? [],
                $params['config'],
            ),
        ];

        if ($attributes['type'] !== 'list') {
            $attributes['slug'] = $params['slug'] ?? slugify($params['name']);
        }

        $channel
            ->fill(
                array_merge($attributes, [
                    // make sure updated_at is always changed, event if model is
                    // not dirty otherwise channel cache will not be cleared
                    'updated_at' => now(),
                ]),
            )
            ->save();

        if (
            $channel->config['contentType'] === 'manual' &&
            ($channelContent = Arr::get($params, 'content.data'))
        ) {
            // detach old channelables
            DB::table('channelables')
                ->where('channel_id', $channel->id)
                ->delete();

            $pivots = collect($channelContent)
                ->map(function ($item, $i) use ($channel) {
                    return [
                        'channel_id' => $channel->id,
                        'channelable_id' => $item['id'],
                        'channelable_type' => $item['model_type'],
                        'created_at' => $item['created_at'] ?? now(),
                        'order' => $i,
                    ];
                })
                ->filter(function ($item) use ($channel) {
                    // channels should not be attached to themselves
                    return $item['channelable_type'] !== Channel::MODEL_TYPE ||
                        $item['channelable_id'] !== $channel->id;
                });
            DB::table('channelables')->insert($pivots->toArray());
        }

        return $channel;
    }
}
