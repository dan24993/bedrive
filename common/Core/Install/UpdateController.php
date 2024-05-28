<?php namespace Common\Core\Install;

use Common\Core\BaseController;
use Common\Settings\DotEnvEditor;
use Exception;

class UpdateController extends BaseController
{
    public function __construct()
    {
        if (
            !config('common.site.disable_update_auth') &&
            version_compare(
                config('common.site.version'),
                $this->getAppVersion(),
            ) === 0
        ) {
            $this->middleware('isAdmin');
        }
    }

    public function show()
    {
        $data = (new CheckSiteHealth())->execute();
        return view('common::install/update')->with($data);
    }

    public function performUpdate()
    {
        (new UpdateActions())->execute();

        return view('common::install/update-complete');
    }

    private function getAppVersion(): string
    {
        try {
            return (new DotEnvEditor('env.example'))->load()['app_version'];
        } catch (Exception $e) {
            return config('common.site.version');
        }
    }
}
