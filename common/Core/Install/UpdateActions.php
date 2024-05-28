<?php

namespace Common\Core\Install;

use Common\Database\MigrateAndSeed;
use Common\Settings\DotEnvEditor;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Schema;

class UpdateActions
{
    public function execute(): void
    {
        @ini_set('memory_limit', '-1');
        @set_time_limit(0);

        //fix "index is too long" issue on MariaDB and older mysql versions
        Schema::defaultStringLength(191);

        app(MigrateAndSeed::class)->execute();

        if (
            file_exists(base_path('env.example')) &&
            file_exists(base_path('.env'))
        ) {
            $envExampleValues = (new DotEnvEditor('env.example'))->load(
                'env.example',
            );
            $currentEnvValues = (new DotEnvEditor())->load();
            $envValuesToWrite = array_diff_key(
                $envExampleValues,
                $currentEnvValues,
            );
            $envValuesToWrite['app_version'] = $envExampleValues['app_version'];
            $envValuesToWrite['installed'] = true;

            // mark mail as setup if app was installed before this setting was added.
            if (!isset($currentEnvValues['mail_setup'])) {
                $envValuesToWrite['mail_setup'] = true;
            }

            if (
                isset($currentEnvValues['scout_driver']) &&
                $currentEnvValues['scout_driver'] === 'mysql-like'
            ) {
                $envValuesToWrite['scout_driver'] = 'mysql';
            }

            (new DotEnvEditor())->write($envValuesToWrite);
        }

        Cache::flush();

        // clear cached views
        $path = config('view.compiled');
        foreach (File::glob("{$path}/*") as $view) {
            File::delete($view);
        }
    }
}
