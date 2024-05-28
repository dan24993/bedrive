<?php

namespace App\Services\Entries;

use App\Models\FileEntry;
use App\Models\RootFolder;
use Common\Database\Datasource\Datasource;
use Common\Database\Datasource\DatasourceFilters;
use Common\Workspaces\ActiveWorkspace;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;

class DriveEntriesLoader
{
    protected DatasourceFilters $filters;
    protected Builder $builder;
    protected SetPermissionsOnEntry $setPermissionsOnEntry;
    protected int $userId;
    protected int $workspaceId;

    public function __construct(protected array $params)
    {
        $this->setPermissionsOnEntry = app(SetPermissionsOnEntry::class);
        $this->filters = new DatasourceFilters($params['filters'] ?? null);
        $this->userId = (int) $this->params['userId'];
        $this->workspaceId = app(ActiveWorkspace::class)->id ?? 0;
        $this->params['perPage'] ??= 50;
        $this->params['section'] = $this->params['section'] ?? 'home';

        // folders should always be first
        $this->builder = FileEntry::where('public', false)
            ->orderBy(DB::raw('type = "folder"'), 'desc')
            ->with(['users', 'tags']);

        // load entries with ids matching [entryIds], but only if their parent id is not in [entryIds]
        if ($entryIds = Arr::get($this->params, 'entryIds')) {
            $entryIds = explode(',', $entryIds);
            $this->builder
                ->whereIn('file_entries.id', $entryIds)
                ->whereDoesntHave('parent', function ($query) use ($entryIds) {
                    $query->whereIn('file_entries.id', $entryIds);
                });
        }
    }

    public function load(): array
    {
        switch ($this->params['section']) {
            case 'home':
                return $this->home();
            case 'folder':
                return $this->folder();
            case 'recent':
                return $this->recent();
            case 'trash':
                return $this->trash();
            case 'starred':
                return $this->starred();
            case 'sharedByMe':
                return $this->sharedByMe();
            case 'sharedWithMe':
                return $this->sharedWithMe();
            case 'search':
                return $this->search();
            case 'offline':
                return $this->offline();
            case 'allChildren':
                return $this->allChildren();
        }
    }

    protected function home(): array
    {
        $this->builder->whereNull('parent_id');

        $this->builder->where('workspace_id', $this->workspaceId);
        if ($this->workspaceId) {
            $this->scopeToOwnerIfCantViewWorkspaceFiles();
        } else {
            $this->builder->whereOwner($this->userId);
        }

        $results = $this->loadEntries();
        $results['folder'] = $this->setPermissionsOnEntry->execute(
            new RootFolder(),
        );
        return $results;
    }

    protected function search(): array
    {
        // apply "trash" filter
        if ($this->filters->getAndRemove('deleted_at')) {
            $this->builder->onlyTrashed()->whereRootOrParentNotTrashed();
        }

        if ($sharedByMe = $this->filters->getAndRemove('sharedByMe')) {
            $checkOwnerId = !$this->workspaceId;
            $this->builder->sharedByUser($this->userId, $checkOwnerId);
        }

        if ($folderId = Arr::get($this->params, 'folderId')) {
            $folder = FileEntry::byIdOrHash($folderId)->first();
            if ($folder) {
                $this->builder->where(
                    'path',
                    'like',
                    $folder->getRawOriginal('path') . '/%',
                );
            }
        }

        $this->builder->where('workspace_id', $this->workspaceId);
        if ($this->workspaceId) {
            $this->scopeToOwnerIfCantViewWorkspaceFiles();
        } else {
            // if "sharedByMe" filter is present, show entries shared by user, otherwise
            // scope search to entries owned by user and entries shared with user
            if (!$sharedByMe) {
                $this->builder->whereUser($this->userId, true);
            }
        }

        return $this->loadEntries();
    }

    protected function folder(): array
    {
        $folder = FileEntry::with('users')
            ->byIdOrHash($this->params['folderId'])
            ->firstOrFail();
        $this->builder->where('parent_id', $folder->id);

        if ($this->workspaceId) {
            $this->scopeToOwnerIfCantViewWorkspaceFiles();
        } else {
            $this->builder->whereUser($this->userId);
        }

        $results = $this->loadEntries();
        $results['folder'] = $this->setPermissionsOnEntry->execute($folder);
        return $results;
    }

    protected function recent(): array
    {
        // only show files in recent section
        $this->builder->where('type', '!=', 'folder');

        $this->builder->where('workspace_id', $this->workspaceId);
        if ($this->workspaceId) {
            $this->scopeToOwnerIfCantViewWorkspaceFiles();
        } else {
            $this->builder->whereOwner($this->userId);
        }

        return $this->loadEntries();
    }

    protected function trash(): array
    {
        $this->builder->onlyTrashed()->whereRootOrParentNotTrashed();

        $this->builder->where('workspace_id', $this->workspaceId);
        if ($this->workspaceId) {
            $this->scopeToOwnerIfCantViewWorkspaceFiles();
        } else {
            $this->builder->whereOwner($this->userId);
        }

        return $this->loadEntries();
    }

    protected function starred(): array
    {
        $this->builder->onlyStarred();

        $this->builder->where('workspace_id', $this->workspaceId);
        if ($this->workspaceId) {
            $this->scopeToOwnerIfCantViewWorkspaceFiles();
        } else {
            $this->builder->whereOwner($this->userId);
        }

        return $this->loadEntries();
    }

    protected function sharedByMe(): array
    {
        if ($this->workspaceId) {
            $this->builder->where('workspace_id', $this->workspaceId);
        }

        $this->builder->sharedByUser($this->userId);
        return $this->loadEntries();
    }

    protected function sharedWithMe(): array
    {
        if ($this->workspaceId) {
            $this->builder->where('workspace_id', $this->workspaceId);
        }

        $this->builder->sharedWithUserOnly($this->userId);
        return $this->loadEntries();
    }

    protected function scopeToOwnerIfCantViewWorkspaceFiles(): void
    {
        if ($this->workspaceId) {
            $canViewAllFiles = app(ActiveWorkspace::class)
                ->member($this->userId)
                ->hasPermission('files.view');
            if (!$canViewAllFiles) {
                $this->builder->whereOwner($this->userId);
            }
        }
    }

    protected function offline(): array
    {
        $this->builder->where('workspace_id', $this->workspaceId);
        if ($this->workspaceId) {
            $this->scopeToOwnerIfCantViewWorkspaceFiles();
        } else {
            $this->builder->whereOwner($this->userId);
        }

        return $this->loadEntries();
    }

    protected function allChildren(): array
    {
        $folderId = Arr::get($this->params, 'folderId');
        $folder = FileEntry::byIdOrHash($folderId)->firstOrFail();

        $this->builder->where(
            'path',
            'like',
            $folder->getRawOriginal('path') . '/%',
        );

        $this->builder->where('workspace_id', $this->workspaceId);
        if ($this->workspaceId) {
            $this->scopeToOwnerIfCantViewWorkspaceFiles();
        } else {
            $this->builder->whereUser($this->userId);
        }

        $this->params['perPage'] = 500;
        return $this->loadEntries();
    }

    protected function loadEntries(): array
    {
        $datasource = (new Datasource(
            $this->builder,
            // prevent filtering by user id or workspace, it will be done here already
            Arr::except($this->params, ['userId', 'workspaceId']),
            $this->filters,
        ))->buildQuery();

        // order by name in case updated_at date is the same
        $orderCol = $this->builder->getQuery()->orders[0]['column'] ?? null;
        if (!is_string($orderCol) || $orderCol != 'name') {
            $this->builder->orderBy('name', 'asc');
        }

        $results = $datasource->paginate()->toArray();
        $results['data'] = array_map(
            fn($result) => $this->setPermissionsOnEntry->execute($result),
            $results['data'],
        );

        return $results;
    }
}
