<?php

namespace Common\Domains\Validation;

use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Http;

class ValidateLinkWithGoogleSafeBrowsing
{
    public function execute(string $url): bool
    {
        $key = settings('links.google_safe_browsing_key');
        if (!$key) {
            return true;
        }

        $response = Http::withHeaders([
            'Referer' => config('app.url'),
        ])
            ->post(
                "https://safebrowsing.googleapis.com/v4/threatMatches:find?key=$key",
                [
                    'client' => [
                        'clientId' => config('app.name'),
                        'clientVersion' => config('common.site.version'),
                    ],
                    'threatInfo' => [
                        'threatTypes' => [
                            'MALWARE',
                            'SOCIAL_ENGINEERING',
                            'THREAT_TYPE_UNSPECIFIED',
                        ],
                        'platformTypes' => ['ANY_PLATFORM'],
                        'threatEntryTypes' => ['URL'],
                        'threatEntries' => [['url' => $url]],
                    ],
                ],
            )
            ->throw();

        return Arr::get($response, 'matches.0.threatType') === null;
    }
}
