<?php

namespace Common\Core\Install;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class RedirectIfNotInstalledMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        if (
            !config('common.site.installed') &&
            !Str::contains($request->path(), 'install')
        ) {
            return redirect()->route('install');
        }

        return $next($request);
    }
}
