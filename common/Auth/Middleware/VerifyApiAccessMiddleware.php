<?php

namespace Common\Auth\Middleware;

use Closure;
use Illuminate\Http\Request;

class VerifyApiAccessMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        $model = $request->user() ?: app('guestRole');

        if (!requestIsFromFrontend() && !$model->hasPermission('api.access')) {
            abort(401);
        }

        return $next($request);
    }
}
