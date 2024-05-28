<?php

namespace Common\Core\Exceptions;

use ErrorException;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Foundation\Exceptions\Handler;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Sentry\Laravel\Integration;
use Sentry\State\Scope;
use Spatie\Ignition\Ignition;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Throwable;
use function Sentry\configureScope;

class BaseExceptionHandler extends Handler
{
    public function render($request, Throwable $e)
    {
        $isAuthException =
            $e instanceof AuthorizationException ||
            ($e instanceof HttpException && $e->getStatusCode() === 403);

        if (
            $isAuthException &&
            (requestIsFromFrontend() &&
                !$request->expectsJson() &&
                !Auth::check())
        ) {
            return redirect('/login');
        }

        return parent::render($request, $e);
    }

    public function register()
    {
        if (config('app.env') !== 'production') {
            return;
        }

        $this->renderable(function (ErrorException $e) {
            if (
                Str::contains($e->getMessage(), [
                    'failed to open stream: Permission denied',
                    'mkdir(): Permission denied',
                ])
            ) {
                return $this->filePermissionResponse($e);
            }
        });

        configureScope(function (Scope $scope): void {
            $scope->setContext('app_name', ['value' => config('app.name')]);
            // todo: move this to a middleware same as in sentry docs, or commonserviceprovider and test php artisan with env set to production
            if (app()->isBooted() && ($user = Auth::user())) {
                $scope->setUser(['email' => $user->email, 'id' => $user->id]);
            }
        });

        $this->reportable(function (Throwable $e) {
            Integration::captureUnhandledException($e);
        });
    }

    protected function convertExceptionToArray(Throwable $e): array
    {
        $previous = $e->getPrevious();
        $isExceptionWithAction =
            $previous &&
            method_exists($previous, 'response') &&
            $previous->response() &&
            property_exists($previous->response(), 'action');

        if (config('app.debug') && !config('common.site.demo')) {
            $array = $this->ignitionReportFromThrowable($e);
        } else {
            $array = parent::convertExceptionToArray($e);
        }

        if ($isExceptionWithAction) {
            $array['action'] = $e->getPrevious()->response()->action;
        }

        if ($array['message'] === 'Server Error') {
            $array['message'] = __(
                'There was an issue. Please try again later.',
            );
        }

        if ($array['message'] === 'This action is unauthorized.') {
            $array['message'] = __(
                "You don't have required permissions for this action.",
            );
        }

        return $array;
    }

    protected function filePermissionResponse(ErrorException $e)
    {
        if (request()->expectsJson()) {
            return response()->json(['message' => 'test']);
        } else {
            preg_match('/\((.+?)\):/', $e->getMessage(), $matches);
            $path = $matches[1] ?? null;
            // should not return a view here, in case laravel views folder is not readable as well
            return response(
                "<div style='text-align:center'><h1>Could not access a file or folder</h1> <br> Location: <b>$path</b><br>" .
                    '<p>See the article here for possible solutions: <a target="_blank" href="https://support.vebto.com/hc/articles/21/25/207/changing-file-permissions">https://support.vebto.com/help-center/articles/207/changing-file-permissions</a></p></div>',
            );
        }
    }

    protected function ignitionReportFromThrowable(Throwable $e): array
    {
        $report = app(Ignition::class)
            ->shouldDisplayException(false)
            ->handleException($e)
            ->toArray();

        $trace = array_map(function ($item) {
            $path = Str::of($item['class'] ?? $item['file'])
                ->replace([base_path(), 'vendor/laravel/framework/src/'], '')
                ->replace('\\', '/')
                ->trim('/')
                ->explode('/');
            return [
                'applicationFrame' => $item['application_frame'],
                'codeSnippet' => $item['code_snippet'],
                'path' => $path,
                'lineNumber' => $item['line_number'],
                'method' => $item['method'],
            ];
        }, $report['stacktrace']);

        $flatIndex = 0;
        $totalVendorGroups = 0;
        $groupedTrace = array_reduce(
            $trace,
            function ($carry, $item) use (&$flatIndex, &$totalVendorGroups) {
                $item['flatIndex'] = $flatIndex;
                if ($item['applicationFrame']) {
                    $carry[] = $item;
                } else {
                    if (Arr::get(Arr::last($carry), 'vendorGroup')) {
                        $carry[count($carry) - 1]['items'][] = $item;
                    } else {
                        $totalVendorGroups++;
                        $carry[] = [
                            'vendorGroup' => true,
                            'items' => [$item],
                        ];
                    }
                }
                $flatIndex++;
                return $carry;
            },
            [],
        );

        return [
            'ignitionTrace' => true,
            'message' => $report['message'],
            'exception' => $report['exception_class'],
            'file' => $report['stacktrace'][0]['file'],
            'line' => $report['stacktrace'][0]['line_number'],
            'trace' => $groupedTrace,
            'totalVendorGroups' => $totalVendorGroups,
            'phpVersion' => $report['language_version'],
            'appVersion' => config('common.site.version'),
        ];
    }
}
