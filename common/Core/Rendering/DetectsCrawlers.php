<?php

namespace Common\Core\Rendering;

use Illuminate\Support\Str;

trait DetectsCrawlers
{
    protected array $crawlerUserAgents = [
        'Yahoo! Slurp',
        'bingbot',
        'yandex',
        'baiduspider',
        'facebookexternalhit',
        'twitterbot',
        'rogerbot',
        'linkedinbot',
        'embedly',
        'quora link preview',
        'showyoubot',
        'outbrain',
        'pinterest/0.',
        'slackbot',
        'vkShare',
        'W3C_Validator',
        'redditbot',
        'Applebot',
        'WhatsApp',
        'flipboard',
        'tumblr',
        'bitlybot',
        'SkypeUriPreview',
        'nuzzel',
        'Discordbot',
        'Qwantify',
        'pinterestbot',
        'Bitrix link preview',
        'XING-contenttabreceiver',
        'developers.google.com/+/web/snippet',
    ];

    protected function isCrawler(): bool
    {
        $userAgent = strtolower(request()->server->get('HTTP_USER_AGENT'));
        $bufferAgent = request()->server->get('X-BUFFERBOT');

        $shouldPrerender = false;

        if (!$userAgent) {
            return false;
        }
        if (!request()->isMethod('GET')) {
            return false;
        }

        // prerender if _escaped_fragment_ is in the query string
        if (request()->query->has('_escaped_fragment_')) {
            $shouldPrerender = true;
        }

        // prerender if a crawler is detected
        foreach ($this->crawlerUserAgents as $crawlerUserAgent) {
            if (Str::contains($userAgent, strtolower($crawlerUserAgent))) {
                $shouldPrerender = true;
            }
        }

        if ($bufferAgent) {
            $shouldPrerender = true;
        }

        return $shouldPrerender;
    }
}
