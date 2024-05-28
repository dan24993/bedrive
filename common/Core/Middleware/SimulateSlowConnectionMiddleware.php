<?php

namespace Common\Core\Middleware;

use Closure;
use Illuminate\Http\Request;

class SimulateSlowConnectionMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        if ($speed = config('common.site.simulated_connection')) {
            if ($speed === 'medium') {
                // 200ms
                usleep(200000);
            } elseif ($speed === 'slow') {
                // 1s
               sleep(1);
            }
        }
        return $next($request);
    }
}
