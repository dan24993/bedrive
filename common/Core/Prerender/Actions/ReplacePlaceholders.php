<?php

namespace Common\Core\Prerender\Actions;

use Common\Core\Contracts\AppUrlGenerator;
use Illuminate\Pagination\AbstractPaginator;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;

class ReplacePlaceholders
{
    private array $allData;

    public function __construct(protected AppUrlGenerator $urls)
    {
    }

    public function execute(array|string $config, array $data): array|string
    {
        $this->allData = $data;
        return $this->replace($config);
    }

    private function replace(array|string $config): array|string
    {
        if (is_array($config)) {
            if (array_key_exists('_ifNotNull', $config)) {
                if (is_null(Arr::get($this->allData, $config['_ifNotNull']))) {
                    return [];
                }
                unset($config['_ifExists']);
            }

            if (Arr::get($config, '_type') === 'loop') {
                return $this->replaceLoop($config);
            } else {
                return array_map(function ($item) {
                    return $this->replace($item);
                }, $config);
            }
        } else {
            return $this->replaceString($config, $this->allData);
        }
    }

    private function replaceLoop(array $config): array
    {
        $dataSelector = strtolower($config['dataSelector']);
        $loopData = Arr::get($this->allData, $dataSelector);

        // won't be able to access paginator data via dot notation
        // selector (items.data), need to extract it manually
        if ($loopData instanceof AbstractPaginator) {
            $loopData = $loopData->items();
        }
        $loopData = collect($loopData);

        // apply filter (if provided), filter will specify which array
        // prop of loop item should match what value. For example:
        // ['key' => 'pivot.department', 'value' => 'cast' will get
        // only cast from movie credits array instead of full credits
        if ($filter = Arr::get($config, 'filter')) {
            $loopData = $loopData->filter(function ($loopItem) use ($filter) {
                return Arr::get($loopItem, $filter['key']) === $filter['value'];
            });
        }

        if ($limit = Arr::get($config, 'limit')) {
            $loopData = $loopData->slice(0, $limit);
        }

        // if _type is "nested" we only need to return the first item so instead
        // of nested [['name' => 'foo'], ['name' => 'bar']] only ['name' => 'foo']
        if ($returnFirstOnly = Arr::get($config, 'returnFirstOnly')) {
            $loopData->slice(0, 1);
        }

        $generated = collect($loopData)->map(function ($loopItem) use (
            $config,
        ) {
            // make sure template can access data via dot notation (TAG.NAME)
            // so instead of passing just tag, pass ['tag' => $tag]
            $model = is_array($loopItem)
                ? modelTypeToNamespace($loopItem['model_type'])
                : $loopItem;
            $name = strtolower(class_basename($model));
            return $this->replaceString($config['template'], [
                $name => $loopItem,
            ]);
        });

        return $returnFirstOnly
            ? $generated->first()
            : $generated->values()->toArray();
    }

    private function replaceString(mixed $template, array $originalData): mixed
    {
        $data = [];
        foreach ($originalData as $key => $value) {
            $data[Str::lower($key)] = $value;
        }

        return preg_replace_callback(
            '/{{([\w\.\-\?\:]+?)}}/',
            function ($matches) use ($data) {
                if (!isset($matches[1])) {
                    return $matches[0];
                }

                $placeholder = $matches[1];

                // replace site name
                if ($placeholder === 'site_name') {
                    return config('app.name');
                }

                // replace base url
                if ($placeholder === 'url.base') {
                    return url('');
                }

                // replace by url generator url
                if (Str::startsWith($placeholder, 'url.')) {
                    // "url.movie" => "movie"
                    $resource = str_replace('url.', '', $placeholder);
                    // "new_releases" => "newReleases"
                    $method = Str::camel($resource);
                    return $this->urls->$method(
                        Arr::get($data, $resource) ?: $data, $data,
                    );
                }

                // replace placeholder with actual value.
                // supports dot notation: 'artist.bio.text' as well as ?:
                $replacement = $this->findUsingDotNotation($data, $placeholder);

                // prefix relative image urls with base site url
                if ($replacement && Str::startsWith($replacement, 'storage/')) {
                    $replacement = config('app.url') . "/$replacement";
                    url();
                }

                // return null if we could not replace placeholder
                if (!$replacement) {
                    return null;
                }

                return Str::limit(
                    strip_tags(
                        $this->replaceString($replacement, $data),
                        '<br>',
                    ),
                    400,
                );
            },
            $template,
        );
    }

    private function findUsingDotNotation(array $data, string $item)
    {
        foreach (explode('?:', $item) as $itemVariant) {
            if ($value = Arr::get($data, $itemVariant)) {
                return $value;
            }
        }
    }
}
