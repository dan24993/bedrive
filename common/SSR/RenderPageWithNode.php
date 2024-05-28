<?php

namespace Common\SSR;

use Common\ServerTiming\ServerTiming;
use Exception;
use Illuminate\Support\Facades\Http;

class RenderPageWithNode
{
    public function execute(array $bootstrapData): ?string
    {
        if (
            !config('common.site.ssr_enabled') ||
            request('appearanceEditor') === 'true'
        ) {
            return null;
        }

        $serverUrl = config('common.site.ssr_url') . '/render';

        try {
            app(ServerTiming::class)->start('SSR');
            $response = Http::withHeaders([
                'Accept-encoding' => 'gzip',
            ])
                ->post($serverUrl, [
                    'bootstrapData' => $bootstrapData,
                    'url' => request()->getRequestUri(),
                ])
                ->throw()
                ->body();
            app(ServerTiming::class)->stop('SSR');
        } catch (Exception $e) {
            return null;
        }

        if (is_null($response)) {
            return null;
        }

        return $response;
    }
}
