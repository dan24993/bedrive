<?php

namespace Common\SSR;

use Illuminate\Console\Command;
use Symfony\Component\Process\Process;

class StartSsr extends Command
{
    protected $name = 'ssr:start';
    protected $description = 'Start the SSR server';

    public function handle(): int
    {
        if (!config('common.site.ssr_enabled', true)) {
            $this->error('SSR is not enabled.');
            return self::FAILURE;
        }

        $this->callSilently('ssr:stop');

        $port = parse_url(config('common.site.ssr_url'), PHP_URL_PORT);
        $process = new Process(
            ['node', base_path('bootstrap/ssr/server-entry.mjs'), "port=$port"],
            null,
            [
                'NODE_ENV' => 'production',
            ],
        );
        $process->setTimeout(null);
        $process->start();

        if (extension_loaded('pcntl')) {
            $stop = function () use ($process) {
                $process->stop();
            };
            pcntl_async_signals(true);
            pcntl_signal(SIGINT, $stop);
            pcntl_signal(SIGQUIT, $stop);
            pcntl_signal(SIGTERM, $stop);
        }

        foreach ($process as $type => $data) {
            if ($process::OUT === $type) {
                $this->info(trim($data));
            } else {
                $this->error(trim($data));
                report(new SsrException($data));
            }
        }

        return self::SUCCESS;
    }
}
