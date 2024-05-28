<?php

namespace App\Services\Entries;

use App\Models\FileEntry;
use App\Models\User;
use App\Policies\DriveFileEntryPolicy;
use Common\Workspaces\ActiveWorkspace;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Auth;

/**
 * The "execute" method will be called a few hundred or more times per request
 * so it needs to be as fast as possible and cache as much stuff as possible.
 */
class SetPermissionsOnEntry
{
    private ActiveWorkspace $activeWorkspace;
    private array|null $workspacePermissions = null;
    private User|null $user;
    private DriveFileEntryPolicy $policy;

    private array $directPermissions = [];

    private array $permissionToCheck = [
        'files.update',
        'files.create',
        'files.download',
        'files.delete',
    ];

    public function __construct()
    {
        $this->user = Auth::user();
        $this->policy = app(DriveFileEntryPolicy::class);
        $this->activeWorkspace = app(ActiveWorkspace::class);
    }

    /**
     * if no entry is provided return permissions for "root" folder $entry
     */
    public function execute($entry = null): array|FileEntry|null
    {
        if ($this->user === null && $entry) {
            $entry['permissions'] = [];
            return $entry;
        }

        $entryPermissions = [];
        $entryUser = Arr::first(
            $entry['users'] ?? [],
            fn($entryUser) => $entryUser['id'] === $this->user->id,
        );

        foreach ($this->permissionToCheck as $permission) {
            $entryPermissions[$permission] =
                $this->hasDirectPermission($permission) ||
                $this->policy->userOwnsEntryOrWasGrantedPermission(
                    $entryUser,
                    $permission,
                ) ||
                $this->userHasPermissionViaWorkspace($permission);
        }

        $entry['permissions'] = $entryPermissions;
        return $entry;
    }

    protected function hasDirectPermission(string $permission): bool
    {
        // user always has "files.create" permission, ignore it
        if ($permission === 'files.create') {
            return false;
        }

        if (empty($this->directPermissions)) {
            foreach ($this->permissionToCheck as $permissionToCheck) {
                $this->directPermissions[
                    $permissionToCheck
                ] = $this->user->hasPermission($permissionToCheck);
            }
        }

        return $this->directPermissions[$permission];
    }

    protected function userHasPermissionViaWorkspace(string $permission): bool
    {
        if ($this->activeWorkspace->isPersonal()) {
            return false;
        }

        if (!$this->workspacePermissions) {
            $this->workspacePermissions =
                $this->activeWorkspace
                    ->member($this->user->id)
                    ?->permissions->pluck('name')
                    ->toArray() ?? [];
        }

        return in_array($permission, $this->workspacePermissions);
    }
}
