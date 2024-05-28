<?php

namespace Common\Logging\Error;

use Common\Core\BaseController;
use Opcodes\LogViewer\Facades\LogViewer;

class ErrorLogController extends BaseController
{
    public function __construct()
    {
        $this->middleware('isAdmin');
    }

    public function index()
    {
        $files = LogViewer::getFiles()
            ->sortByLatestFirst()
            ->values();

        $perPage = request('perPage', 20);

        if ($files->isEmpty()) {
            $pagination = $this->emptyPagination();
        } else {
            $file = request('file')
                ? $files->firstWhere('identifier', request('file'))
                : $files->first();
            if (!$file) {
                $pagination = $this->emptyPagination();
            } else {
                $logQuery = $file->logs();

                if (request('query')) {
                    $logQuery->search(request('query'));
                }

                $pagination = $logQuery
                    ->reverse()
                    ->scan()
                    ->paginate($perPage);

                $pagination->through(
                    fn($log) => [
                        'id' => $log->index,
                        'index' => $log->index,
                        'level' => strtolower($log->level),
                        'datetime' => $log->datetime,
                        'message' => $log->message,
                        'exception' => $log->context['exception'] ?? null,
                    ],
                );
            }
        }

        return $this->success([
            'selectedFile' => $files->first()?->identifier,
            'files' => $files->map(
                fn($file) => [
                    'name' => $file->name,
                    'identifier' => $file->identifier,
                    'size' => $file->size(),
                ],
            ),
            'pagination' => $pagination,
        ]);
    }

    public function download(string $identifier)
    {
        $file = LogViewer::getFile($identifier);

        return $file->download();
    }

    public function downloadLatest()
    {
        $file = LogViewer::getFiles()
            ->sortByLatestFirst()
            ->first();

        return $file->download();
    }

    public function destroy(string $fileIdentifier)
    {
        $file = LogViewer::getFile($fileIdentifier);

        if (!is_null($file)) {
            $file->delete();
        }

        return $this->success([]);
    }

    protected function emptyPagination(): array
    {
        return [
            'current_page' => 1,
            'data' => [],
            'from' => 1,
            'last_page' => 1,
            'path' => null,
            'per_page' => (int) request('perPage', 20),
            'to' => 0,
            'total' => 0,
        ];
    }
}
