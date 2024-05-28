<?php

namespace Common\Auth\Actions;

use App\Models\User;
use Common\Auth\Permissions\Traits\SyncsPermissions;
use Illuminate\Support\Arr;

class UpdateUser
{
    use SyncsPermissions;

    public function execute(User $user, array $params): User
    {
        $user->fill(Arr::except($params, ['roles', 'permissions']))->save();

        // make sure roles and permission are not removed
        // if they are not specified at all in params
        if (array_key_exists('roles', $params)) {
            $user->roles()->sync($params['roles']);
        }
        if (array_key_exists('permissions', $params)) {
            $this->syncPermissions($user, Arr::get($params, 'permissions'));
        }

        return $user->load(['roles', 'permissions']);
    }
}
