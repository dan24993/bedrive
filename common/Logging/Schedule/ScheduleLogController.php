<?php

namespace Common\Logging\Schedule;

use Common\Core\BaseController;
use Common\Database\Datasource\Datasource;
use Illuminate\Support\Facades\Artisan;

class ScheduleLogController extends BaseController
{
    public function __construct()
    {
        $this->middleware('isAdmin');
    }

    public function index(): mixed
    {
        $params = request()->all();
        if (!isset($params['orderBy'])) {
            $params['orderBy'] = 'ran_at';
        }

        $pagination = (new Datasource(
            ScheduleLogItem::query(),
            $params,
        ))->paginate();

        return $this->success([
            'pagination' => $pagination,
        ]);
    }

    public function download()
    {
        $log = json_encode(
            ScheduleLogItem::limit(1000)->get(),
            JSON_PRETTY_PRINT,
        );

        return response($log)
            ->header('Content-Type', 'application/json')
            ->header(
                'Content-Disposition',
                'attachment; filename="schedule-log.json"',
            );
    }

    public function rerun(int $id): mixed
    {
        $logItem = ScheduleLogItem::findOrFail($id);

        Artisan::call($logItem->command);

        $logItem->increment('count_in_last_hour');

        return $this->success();
    }
}
