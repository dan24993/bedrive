<?php

namespace Common\Workspaces\Policies;

use App\Models\User;
use Common\Core\Policies\BasePolicy;
use Common\Workspaces\ActiveWorkspace;
use Illuminate\Auth\Access\Response;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

abstract class WorkspacedResourcePolicy extends BasePolicy
{
    protected string $resource;

    const NO_PERMISSION = 1;
    const NO_WORKSPACE_PERMISSION = 2;

    public function index(User $currentUser, int $userId = null)
    {
        $userId = $userId ?? (int) $this->request->get('userId');

        [, $permission] = $this->parseNamespace($this->resource, 'view');

        // filtering resources by user id
        if ($userId) {
            return $currentUser->id === $userId;

            // if we're requesting resources for a particular workspace,let user view the resources
            // as long as they are a member, even without explicit "resource.view" permission
        } elseif ($this->userIsWorkspaceMember($currentUser)) {
            return true;
        } else {
            return $this->userHasPermission($currentUser, $permission);
        }
    }

    public function show(User $currentUser, Model $resource)
    {
        [, $permission] = $this->parseNamespace($this->resource, 'view');

        if ($resource->user_id === $currentUser->id) {
            return true;
            // if we're requesting resources for a particular workspace,let user view the resources
            // as long as they are a member, event without explicit "resource.view" permission
        } elseif ($this->userIsWorkspaceMember($currentUser)) {
            return true;
        } else {
            return $this->userHasPermission($currentUser, $permission);
        }
    }

    public function store(User $currentUser)
    {
        return $this->storeWithCountRestriction($currentUser, $this->resource);
    }

    public function update(User $currentUser, Model $resource)
    {
        [, $permission] = $this->parseNamespace($this->resource, 'update');

        if ($resource->user_id === $currentUser->id) {
            return true;
        } else {
            return $this->userHasPermission($currentUser, $permission);
        }
    }

    public function destroy(User $currentUser, $resourceIds = null)
    {
        [, $permission] = $this->parseNamespace($this->resource, 'delete');

        $response = $this->userHasPermission($currentUser, $permission);

        if ($response->allowed()) {
            return $response;
        } elseif ($resourceIds) {
            $dbCount = app($this->resource)
                ->whereIn('id', $resourceIds)
                ->where('user_id', $currentUser->id)
                ->count();
            return $dbCount === count($resourceIds);
        } else {
            return $response;
        }
    }

    protected function userHasPermission(
        User $user,
        string $permission,
    ): Response {
        $permission = Str::snake($permission);

        $activeWorkspace = app(ActiveWorkspace::class);
        $userOwnsWorkspace =
            $activeWorkspace->isPersonal() ||
            !$activeWorkspace->workspace() ||
            $user->id === $activeWorkspace->workspace()->owner_id;

        // check if user has permission when they own workspace or no workspace at all
        if ($userOwnsWorkspace && !parent::hasPermission($user, $permission)) {
            return Response::deny('No permission', self::NO_PERMISSION);
        }

        // check if user has this permission for the workspace as well if they are not the owner
        elseif (!$userOwnsWorkspace) {
            $workspaceUser = $activeWorkspace->member($user->id);
            if (!$workspaceUser?->hasPermission($permission)) {
                return Response::deny(
                    'No permission',
                    self::NO_WORKSPACE_PERMISSION,
                );
            }
        }

        return Response::allow();
    }

    protected function userIsWorkspaceMember(User $user): bool
    {
        return !is_null(app(ActiveWorkspace::class)->member($user->id));
    }
}
