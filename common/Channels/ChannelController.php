<?php

namespace Common\Channels;

use App\Http\Resources\ChannelResource;
use App\Models\Channel;
use App\Services\GenerateDefaultChannels;
use Common\Core\BaseController;
use Common\Core\Prerender\Actions\ReplacePlaceholders;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Symfony\Component\HttpFoundation\Response;

class ChannelController extends BaseController
{
    public function index(): Response
    {
        $this->authorize('index', [
            Channel::class,
            request('userId'),
            request('type'),
        ]);

        $pagination = app(PaginateChannels::class)->execute(request()->all());

        return $this->success(['pagination' => $pagination]);
    }

    public function show(Channel $channel)
    {
        $this->authorize('show', $channel);

        $loader = request('loader', 'channelPage');

        $params = request()->all();
        if ($loader === 'editUserListPage') {
            $params['normalizeContent'] = true;
        } elseif ($loader === 'editChannelPage') {
            $params['normalizeContent'] = true;
            $params['perPage'] = 200;
        }

        $channel->loadContent($params);
        if (
            $loader === 'channelPage' &&
            $channel->shouldRestrictContent() &&
            !$channel->restriction
        ) {
            abort(404);
        }

        $channel =
            $loader === 'channelPage' && class_exists(ChannelResource::class)
                ? new ChannelResource($channel)
                : $channel;

        // return only content for pagination
        if (request()->get('returnContentOnly')) {
            return [
                'pagination' => $channel->toArray(request())['content'],
            ];
        }

        $data = [
            'channel' => $channel,
            'loader' => $loader,
        ];

        if ($loader === 'channelPage') {
            // used as default value during SSR in layout selector button
            $channel->config = array_merge($channel->config, [
                'selectedLayout' => Arr::get(
                    $_COOKIE,
                    "channel-layout-{$channel->config['contentModel']}",
                    false,
                ),
                'seoTitle' => isset($channel->config['seoTitle'])
                    ? app(ReplacePlaceholders::class)->execute(
                        $channel->config['seoTitle'],
                        $data,
                    )
                    : $channel->name,
                'seoDescription' => isset($channel->config['seoDescription'])
                    ? app(ReplacePlaceholders::class)->execute(
                        $channel->config['seoDescription'],
                        $data,
                    )
                    : $channel->description ?? $channel->name,
            ]);
        }

        return $this->renderClientOrApi([
            'pageName' => $loader === 'channelPage' ? 'channel-page' : null,
            'data' => [
                'channel' => $channel,
                'loader' => $loader,
            ],
        ]);
    }

    public function store(CrupdateChannelRequest $request): Response
    {
        $this->authorize('store', [Channel::class, request('type', 'channel')]);

        $channel = app(CrupdateChannel::class)->execute(
            $request->validationData(),
        );

        return $this->success(['channel' => $channel]);
    }

    public function update(
        Channel $channel,
        CrupdateChannelRequest $request,
    ): Response {
        $this->authorize('update', $channel);

        $channel = app(CrupdateChannel::class)->execute(
            $request->validationData(),
            $channel,
        );

        return $this->success(['channel' => $channel]);
    }

    public function destroy(string $ids): Response
    {
        $ids = explode(',', $ids);
        $channels = Channel::whereIn('id', $ids)->get();

        $this->authorize('destroy', [Channel::class, $channels]);

        app(DeleteChannels::class)->execute($channels);

        return $this->success();
    }

    public function updateContent(Channel $channel): Response
    {
        $this->authorize('update', $channel);

        if ($newConfig = request('channelConfig')) {
            $config = $channel->config;
            foreach ($newConfig as $key => $value) {
                $config[$key] = $value;
            }
            $channel->fill(['config' => $config])->save();
        }

        $channel->updateContentFromExternal();
        $channel->loadContent(request()->all());

        return $this->success([
            'channel' => $channel,
        ]);
    }

    public function searchForAddableContent(): Response
    {
        $namespace = modelTypeToNamespace(request('modelType'));
        $this->authorize('index', $namespace);

        $builder = app($namespace);

        if (request('query')) {
            $builder = $builder->mysqlSearch(request('query'));
        }

        $results = $builder
            ->take(20)
            ->get()
            ->filter(function ($result) {
                if (request('modelType') === 'channel') {
                    // exclude user lists
                    return $result->type === 'channel';
                }
                return true;
            })
            ->map(fn($result) => $result->toNormalizedArray())
            ->slice(0, request('limit', 5))
            ->values();

        return $this->success(['results' => $results]);
    }

    public function resetToDefault()
    {
        $this->authorize('destroy', Channel::class);

        $ids = Channel::where('type', 'channel')->pluck('id');
        DB::table('channelables')
            ->whereIn('channel_id', $ids)
            ->delete();
        Channel::whereIn('id', $ids)->delete();

        (new GenerateDefaultChannels())->execute();

        return $this->success();
    }
}
