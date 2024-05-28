<?php

namespace Common\Core;

use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\Request as SymfonyRequest;

class AppUrl
{
    /**
     * If host in .env file and current request did not match, but
     * we were able to find a matching custom domain in database.
     */
    public ?object $matchedCustomDomain = null;

    /**
     * Url "app.url" config item was changed to dynamically.
     */
    public ?string $newAppUrl = null;

    /**
     * Whether hosts from APP_URL in .env file and current request match.
     * This will strip "www" and schemes from both and only compare hosts.
     */
    public bool $envAndCurrentHostsAreEqual;

    public string $htmlBaseUri;

    public string $originalAppUrl;

    public function init(): static
    {
        $this->originalAppUrl = config('app.url');
        if (
            config('common.site.dynamic_app_url') ||
            !config('common.site.installed')
        ) {
            $this->maybeDynamicallyUpdate();
        } else {
            $this->envAndCurrentHostsAreEqual = true;
        }
        $this->registerHtmlBaseUri();
        return $this;
    }

    private function maybeDynamicallyUpdate(): void
    {
        $request = app('request');
        $requestHost = $request->getHost();

        $envParts = parse_url(config('app.url'));

        $requestScheme = in_array($request->header('x-forwarded-proto'), [
            'https',
            'on',
            'ssl',
            '1',
        ])
            ? 'https'
            : $request->getScheme();

        $schemeIsDifferent = $requestScheme !== Arr::get($envParts, 'scheme');
        $this->envAndCurrentHostsAreEqual =
            $this->getHostFrom($requestHost) ===
            $this->getHostFrom(Arr::get($envParts, 'host'));
        $hostsWithWwwAreEqual = $requestHost === Arr::get($envParts, 'host');
        $customDomainsEnabled = config('common.site.enable_custom_domains');
        $endsWithSlash = Str::endsWith(Arr::get($envParts, 'path'), '/');

        // update app.url if not installed yet, or if only scheme, slash or www is different
        if (
            ($this->envAndCurrentHostsAreEqual ||
                !config('common.site.installed')) &&
            ($schemeIsDifferent || $endsWithSlash || !$hostsWithWwwAreEqual)
        ) {
            if (!config('common.site.installed')) {
                $this->handleInstallationAppUrl();
                return;
            }

            $this->newAppUrl =
                $request->getSchemeAndHttpHost() .
                rtrim(Arr::get($envParts, 'path'), '/');
            config(['app.url' => $this->newAppUrl]);
            // update social auth urls as well
            foreach (config('services') as $serviceName => $serviceConfig) {
                if (isset($serviceConfig['redirect'])) {
                    config(
                        "services.$serviceName.redirect",
                        "$this->newAppUrl/secure/auth/social/$serviceName/callback",
                    );
                }
            }
        } elseif (!$this->envAndCurrentHostsAreEqual && $customDomainsEnabled) {
            $this->matchedCustomDomain = DB::table('custom_domains')
                ->where('host', $requestHost)
                ->orWhere('host', $request->getSchemeAndHttpHost())
                // if there are multiple domains with same host, get the one that has resource attached to it first
                ->orderBy('resource_id', 'desc')
                ->first();
            if ($this->matchedCustomDomain) {
                $this->newAppUrl = $request->getSchemeAndHttpHost();
                config(['app.url' => $this->newAppUrl]);
            }
        }
    }

    protected function handleInstallationAppUrl(): void
    {
        // create new request so main laravel request is not instantiated yet,
        // and "normalizeRequestUri" on CommonProvider works properly
        $request = SymfonyRequest::createFromGlobals();

        $pathParts = [
            ...explode('/', $request->getBaseUrl()),
            ...explode('/', $request->getPathInfo()),
        ];

        $pathParts = array_values(
            array_filter($pathParts, fn($part) => $part !== ''),
        );

        // get path parts up to "install" segment (if it exists), in case site is not installed at root domain
        $domainParts = [];
        foreach ($pathParts as $key => $part) {
            if ($part !== 'install') {
                $domainParts[] = $part;
            } else {
                break;
            }
        }

        $this->newAppUrl = request()->getSchemeAndHttpHost();

        if (!empty($pathParts)) {
            $this->newAppUrl .= '/' . implode('/', $domainParts);
        }

        config(['app.url' => $this->newAppUrl]);
    }

    protected function registerHtmlBaseUri(): void
    {
        $htmlBaseUri = '/';

        //get uri for html "base" tag
        if (substr_count(config('app.url'), '/') > 2) {
            $htmlBaseUri = parse_url(config('app.url'))['path'] . '/';
        }

        $this->htmlBaseUri = $htmlBaseUri;
    }

    public function getRequestHost(): string
    {
        return $this->getHostFrom(app('request')->getHost());
    }

    public function requestHostMatches(
        $hostOrUrl,
        $subdomainMatch = false,
    ): bool {
        $hostOrUrl = $this->getHostFrom($hostOrUrl);
        $requestHost = $this->getRequestHost();
        return $hostOrUrl === $requestHost ||
            ($subdomainMatch && Str::endsWith($requestHost, $hostOrUrl));
    }

    /*
     * Extract host from full or partial url.
     * This will remove scheme, port, "www", path and query params.
     */
    public function getHostFrom($hostOrUrl)
    {
        // if there's no scheme, add // so it's parsed properly
        if (!preg_match('/^([a-z][a-z0-9\-\.\+]*:)|(\/)/', $hostOrUrl)) {
            $hostOrUrl = '//' . $hostOrUrl;
        }

        $parts = parse_url($hostOrUrl);
        return preg_replace('/^www\./i', '', $parts['host']);
    }
}
