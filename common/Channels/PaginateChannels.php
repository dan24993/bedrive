<?php

namespace Common\Channels;

use App\Models\Channel;
use Common\Database\Datasource\Datasource;
use Illuminate\Pagination\AbstractPaginator;
use Illuminate\Support\Arr;

class PaginateChannels
{
    public function execute(
        array $params,
        mixed $builder = null,
    ): AbstractPaginator {
        if (!$builder) {
            $builder = Channel::query();
        }

        if ($channelIds = Arr::get($params, 'channelIds')) {
            $builder->whereIn('id', explode(',', $channelIds));
        }

        if ($userId = Arr::get($params, 'userId')) {
            $builder->where('user_id', $userId);
        }

        if (Arr::get($params, 'hideInternal')) {
            $builder->where('internal', false);
        }

        if ($type = Arr::get($params, 'type')) {
            $builder->where('type', $type);
        }

        $paginator = new Datasource($builder, $params);

        $pagination = $paginator->paginate();

        if (Arr::get($params, 'loadItemsCount')) {
            $pagination->loadCount('items');
        }

        if (Arr::get($params, 'loadFirstItems')) {
            $pagination->load([
                'items' => fn($query) => $query
                    ->orderBy('order')
                    ->where('order', '<=', 4)
                    ->compact(),
            ]);
        }

        return $pagination;
    }
}
