<?php

namespace Common\Core\Rendering;

use Common\Core\AppUrl;
use Common\Core\Bootstrap\BootstrapData;
use Common\SSR\RenderPageWithNode;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Vite;

trait RendersClientSideApp
{
    protected function renderClientSideApp(array $options = [])
    {
        $bootstrapData = app(BootstrapData::class)->init();
        $pageData = Arr::get($options, 'pageData', []);
        // so "PageMetaTags" can know whether default meta tags should be rendered
        $pageData['set_seo'] = isset($options['seoTagsView']);

        if (isset($pageData['loader'])) {
            $loader = $pageData['loader'];
            $bootstrapData->set("loaders.$loader", $pageData);
        }
        $ssrContent =
            isset($options['pageName']) && !Arr::get($options, 'noSSR')
                ? app(RenderPageWithNode::class)->execute($bootstrapData->get())
                : null;
        $bootstrapData->set('rendered_ssr', !is_null($ssrContent));

        $view = view('app')
            ->with('pageData', $pageData)
            ->with('devCssPath', $this->getDevCssPath())
            ->with('seoTagsView', $options['seoTagsView'] ?? null)
            ->with('ssrContent', $ssrContent)
            ->with('bootstrapData', $bootstrapData)
            ->with('htmlBaseUri', app(AppUrl::class)->htmlBaseUri)
            ->with(
                'customHtmlPath',
                public_path('storage/custom-code/custom-html.html'),
            )
            ->with(
                'customCssPath',
                public_path('storage/custom-code/custom-styles.css'),
            );

        if (isset($data['seo'])) {
            $view->with('meta', $data['seo']);
        }

        return response($view);
    }

    protected function getDevCssPath(): string|null
    {
        if (
            config('app.env') !== 'local' ||
            !config('common.site.ssr_enabled') ||
            !Vite::isRunningHot()
        ) {
            return null;
        }

        $manifestPath = public_path('build/manifest.json');
        if (!file_exists($manifestPath)) {
            return null;
        }

        $manifest = json_decode(file_get_contents($manifestPath), true);
        $cssPath = 'build/' . $manifest['resources/client/main.css']['file'];

        if (file_exists(public_path($cssPath))) {
            return $cssPath;
        }

        return null;
    }
}
