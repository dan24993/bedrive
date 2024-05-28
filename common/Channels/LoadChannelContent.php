<?php

namespace Common\Channels;

use App\Models\Channel;
use BadMethodCallException;
use Common\Core\Prerender\Actions\ReplacePlaceholders;
use Common\Database\Datasource\Datasource;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Pagination\AbstractPaginator;
use Illuminate\Pagination\Paginator;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

class LoadChannelContent
{
    public function execute(
        Channel $channel,
        array $params = [],
        Channel $parent = null,
    ): ?AbstractPaginator {
        $params['perPage'] = $params['perPage'] ?? 50;
        if (!isset($params['orderBy']) && !isset($params['order'])) {
            $params['order'] = Arr::get($channel->config, 'contentOrder');
        }

        if (
            $channel->shouldRestrictContent() &&
            Arr::get($params, 'loader') !== 'editChannelPage'
        ) {
            $this->applyRestriction($channel, $params, $parent);
            // If restriction could not be loaded bail. This is used to cancel content loading and return 404,
            // if, for example, loading genre channel, but specified genre does not exist.
            if (!$channel->restriction) {
                return new Paginator([], 15);
            }
        }

        $contentType = Arr::get($channel->config, 'contentType');

        if ($contentType === 'listAll') {
            return $this->paginateAllContentFromDatabase(
                $channel,
                $params,
                $parent,
            );
        } else {
            // only cache channels that have other nested channels as content
            $shouldCache =
                Arr::get($channel->config, 'contentModel') ===
                Channel::MODEL_TYPE;
            if (!$shouldCache) {
                return $this->loadCuratedContent($channel, $params);
            } else {
                $paramsKey = json_encode($params);
                return Cache::remember(
                    // use "updated at" so channel changes from admin area will automatically
                    // cause new cache item, without having to clear cache manually
                    "channels.$channel->id.$channel->updated_at.$paramsKey",
                    now()->addHours(24),
                    fn() => $this->loadCuratedContent($channel, $params),
                );
            }
        }
    }

    private function paginateAllContentFromDatabase(
        Channel $channel,
        array $params,
        Channel $parent = null,
    ): AbstractPaginator {
        $contentModel = Arr::get($channel->config, 'contentModel');
        $methodName = sprintf('all%s', ucfirst(Str::plural($contentModel)));
        // if channel specifies a method to load this model, use that
        if (method_exists($channel, $methodName)) {
            return $channel->{$methodName}($params, null, $parent);
            // otherwise do a basic pagination for the model
        } else {
            $namespace = modelTypeToNamespace($contentModel);
            $datasource = new Datasource(app($namespace)::query(), $params);
            return $datasource->paginate();
        }
    }

    private function loadCuratedContent(
        Channel $channel,
        array $params,
    ): AbstractPaginator {
        $contentModel = Arr::get($channel, 'config.contentModel');
        $methodName = sprintf('all%s', ucfirst(Str::plural($contentModel)));
        $builder = $channel->{Str::plural($contentModel)}();

        // if channel specifies a method to load this model, use that
        if (method_exists($channel, $methodName)) {
            $pagination = $channel->{$methodName}($params, $builder);
        } else {
            $datasource = new Datasource($builder, $params);
            $order = $datasource->getOrder();

            // get only column name, in case it's prefixed with table name
            if (last(explode('.', $order['col'])) === 'popularity') {
                $datasource->order = false;
                try {
                    $builder->orderByPopularity($order['dir']);
                } catch (BadMethodCallException $e) {
                    //
                }
            }
            $pagination = $datasource->paginate();
        }

        $pagination
            ->filter(fn($model) => $model->pivot)
            ->transform(function (Model $model) use ($channel, $params) {
                $model['channelable_id'] = $model->pivot->id;
                $model['channelable_order'] = $model->pivot->order;
                if ($model instanceof Channel) {
                    $model->loadContent(
                        array_merge($params, [
                            // clear parent channel pagination params and only load 12 items per nested channel
                            'perPage' => 12,
                            'page' => 1,
                            'paginate' => 'simple',
                            // clear this so nested channel always uses sorting order set in that channel's config
                            'order' => null,
                        ]),
                        $channel,
                    );
                }
                return $model;
            });
        return $pagination;
    }

    private function applyRestriction(
        Channel $channel,
        array $params = [],
        Channel $parent = null,
    ): void {
        $urlParam = Arr::get($params, 'restriction');
        $restriction =
            $parent->restriction ?? $channel->loadRestrictionModel($urlParam);
        if ($restriction) {
            $channel->setAttribute('restriction', $restriction);
            $channel->name =
                app(ReplacePlaceholders::class)->execute($channel->name, [
                    'channel' => $channel,
                ]) ?:
                $channel->name;
        }
    }
}
