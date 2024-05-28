<?php

namespace Common\Admin;

use Common\Core\BaseController;
use Common\Logging\Schedule\ScheduleLogItem;

class AdminSetupAlertsController extends BaseController
{
    public function __construct()
    {
        $this->middleware('isAdmin');
    }

    public function index()
    {
        $alerts = [];

        if (!ScheduleLogItem::scheduleRanInLast30Minutes()) {
            $alerts[] = [
                'id' => 'cronNotSetup',
                'title' => 'There is an issue with CRON schedule',
                'description' =>
                    'The CRON schedule has not run in the last 30 minutes. If you did not set it up yet, see the documentation <a class="underline font-semibold" target="_blank" href="https://support.vebto.com/hc/articles/21/23/169/automated-tasks-cron-jobs">here</a>.',
            ];
        }

        return $this->success([
            'alerts' => $alerts,
        ]);
    }
}
