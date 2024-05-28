<?php

use Cocur\Slugify\Slugify;
use Common\Comments\Comment;
use Common\Core\Contracts\AppUrlGenerator;
use Common\Core\Middleware\EnsureFrontendRequestsAreStateful;
use Common\Settings\Settings;
use Common\Tags\Tag;
use Common\Workspaces\Workspace;
use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Support\Str;

if (!function_exists('slugify')) {
    function slugify(string $title, string $separator = '-'): string
    {
        $slugified = (new Slugify())->slugify($title, $separator);
        // $slugified = Str::slug($title, $separator);

        if (!$slugified) {
            $slugified = strtolower(
                preg_replace('/[\s_]+/', $separator, $title),
            );
        }

        return $slugified;
    }
}

if (!function_exists('castToBoolean')) {
    function castToBoolean(mixed $string): bool|null|string
    {
        return match ($string) {
            true, 'true' => true,
            false, 'false' => false,
            'null', null => null,
            default => (string) $string,
        };
    }
}

if (!function_exists('modelTypeToNamespace')) {
    function modelTypeToNamespace(string $modelType): string
    {
        if (Str::contains($modelType, ['App', 'Common'])) {
            return $modelType;
        }

        // resolve models from common
        if ($modelType === 'workspace') {
            return Workspace::class;
        }
        if ($modelType === 'comment') {
            return Comment::class;
        }
        if ($modelType === 'tag' && !class_exists('App\Models\Tag')) {
            return Tag::class;
        }

        if ($namespace = Relation::getMorphedModel($modelType)) {
            return $namespace;
        }

        $modelName = Str::of($modelType)
            ->camel()
            ->singular()
            ->ucfirst();

        return "App\\Models\\$modelName";
    }
}

if (!function_exists('getIp')) {
    function getIp(): string
    {
        foreach (
            [
                'HTTP_CLIENT_IP',
                'HTTP_X_FORWARDED_FOR',
                'HTTP_X_FORWARDED',
                'HTTP_X_CLUSTER_CLIENT_IP',
                'HTTP_FORWARDED_FOR',
                'HTTP_FORWARDED',
                'REMOTE_ADDR',
            ]
            as $key
        ) {
            if (array_key_exists($key, $_SERVER) === true) {
                foreach (explode(',', $_SERVER[$key]) as $ip) {
                    $ip = trim($ip); // just to be safe
                    if (
                        filter_var(
                            $ip,
                            FILTER_VALIDATE_IP,
                            FILTER_FLAG_NO_PRIV_RANGE |
                                FILTER_FLAG_NO_RES_RANGE,
                        ) !== false
                    ) {
                        return $ip;
                    }
                }
            }
        }
        return request()->ip();
    }
}

if (!function_exists('requestIsFromFrontend')) {
    function requestIsFromFrontend(): bool
    {
        return EnsureFrontendRequestsAreStateful::fromFrontend(request()) ||
            !isApiRequest();
    }
}

if (!function_exists('settings')) {
    function settings(string|null $key = null, mixed $default = null)
    {
        if (empty(func_get_args())) {
            return app(Settings::class);
        }

        return app(Settings::class)->get($key, $default);
    }
}

if (!function_exists('urls')) {
    function urls()
    {
        return app(AppUrlGenerator::class);
    }
}

if (!function_exists('isApiRequest')) {
    function isApiRequest(): bool
    {
        return request()->route() &&
            in_array('api', request()->route()->computedMiddleware);
    }
}
