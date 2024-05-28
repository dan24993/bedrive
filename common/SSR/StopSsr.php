<?php

namespace Common\SSR;

use Illuminate\Console\Command;

class StopSsr extends Command
{
    protected $name = 'ssr:stop';
    protected $description = 'Stop the SSR server';

    public function handle(): int
    {
        $serverUrl = config('common.site.ssr_url') . '/shutdown';

        $ch = curl_init($serverUrl);
        curl_exec($ch);

        if (
            curl_error($ch) !== '' &&
            curl_error($ch) !== 'Empty reply from server'
        ) {
            $this->error('Unable to connect to SSR server.');

            return self::FAILURE;
        }

        $this->info('SSR server stopped.');

        curl_close($ch);

        return self::SUCCESS;
    }
}
