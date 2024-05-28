@php
    use Illuminate\Support\Js;
    use Sentry\Laravel\Integration;
@endphp

<!DOCTYPE html>
<html
    lang="{{ $bootstrapData->get('language') }}"
    style="{{ $bootstrapData->getSelectedTheme()->getCssVariables() }}"
    @class(['dark' => $bootstrapData->getSelectedTheme('is_dark')])
>
    <head>
        <base href="{{ $htmlBaseUri }}" />

        @if (isset($seoTagsView))
            @include($seoTagsView, $pageData)
        @elseif (isset($meta))
            @include('common::prerender.meta-tags')
        @else
            <title>{{ settings('branding.site_name') }}</title>
        @endif

        <meta
            name="viewport"
            content="width=device-width, initial-scale=1, maximum-scale=5"
            data-keep="true"
        />
        <link
            rel="icon"
            type="image/x-icon"
            href="favicon/icon-144x144.png"
            data-keep="true"
        />
        <link
            rel="apple-touch-icon"
            href="favicon/icon-192x192.png"
            data-keep="true"
        />
        <link rel="manifest" href="manifest.json" data-keep="true" />
        <meta
            name="theme-color"
            content="rgb({{ $bootstrapData->getSelectedTheme()->getHtmlThemeColor() }})"
            data-keep="true"
        />

        @if ($fontFamily = $bootstrapData->getSelectedTheme()->getFontFamily())
            @if($bootstrapData->getSelectedTheme()->isGoogleFont())
                <link rel="preconnect" href="https://fonts.googleapis.com">
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                <link href="https://fonts.googleapis.com/css2?family={{$fontFamily}}:wght@400;500;600;700&display=swap" rel="stylesheet">
            @endif
        @endif

        <script>
            window.bootstrapData = {!! json_encode($bootstrapData->get()) !!};
        </script>

        @if (isset($devCssPath))
            <link rel="stylesheet" href="{{ $devCssPath }}" />
        @endif

        @viteReactRefresh
        @vite('resources/client/main.tsx')

        @if (file_exists($customCssPath))
            @if ($content = file_get_contents($customCssPath))
                <style>
                    {!! $content !!}
                </style>
            @endif
        @endif

        @if (file_exists($customHtmlPath))
            @if ($content = file_get_contents($customHtmlPath))
                {!! $content !!}
            @endif
        @endif

        @if ($code = settings('analytics.tracking_code'))
            <!-- Google tag (gtag.js) -->
            <script
                async
                src="https://www.googletagmanager.com/gtag/js?id={{ settings('analytics.tracking_code') }}"
            ></script>
            <script>
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', "{{ settings('analytics.tracking_code') }}");
            </script>
        @endif

        @yield('head-end')
    </head>

    <body>
        <div id="root">{!! $ssrContent ?? '' !!}</div>

        @if (! isset($ssrContent))
            <noscript>
                You need to have javascript enabled in order to use
                <strong>{{ config('app.name') }}</strong>
                .
            </noscript>
        @endif

        @yield('body-end')
    </body>
</html>
