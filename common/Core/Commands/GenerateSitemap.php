<?php

namespace Common\Core\Commands;

use Common\Admin\Sitemap\BaseSitemapGenerator;
use Illuminate\Console\Command;

class GenerateSitemap extends Command
{
    protected $signature = 'sitemap:generate';

    public function handle()
    {
        $sitemap = class_exists('App\Services\SitemapGenerator')
            ? app('App\Services\SitemapGenerator')
            : app(BaseSitemapGenerator::class);
        $sitemap->generate();
        $this->info('Sitemap generated successfully');
    }
}
