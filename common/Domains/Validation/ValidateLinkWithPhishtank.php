<?php

namespace Common\Domains\Validation;

use Common\Core\HttpClient;
use Illuminate\Support\Arr;

class ValidateLinkWithPhishtank
{
    public function execute(string $url): bool
    {
        $key = settings('links.phishtank_key');
        if (!$key) {
            return true;
        }

        $appName = config('app.name');
        $response = HttpClient::post(
            'https://checkurl.phishtank.com/checkurl/',
            [
                'headers' => ['User-Agent' => "phishtank/$appName"],
                'form_params' => [
                    'format' => 'json',
                    'app_key' => $key,
                    'url' => $url,
                ],
            ],
        );

        return Arr::get($response, 'results.valid', false);
    }
}
