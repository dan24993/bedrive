<?php

namespace Common\Auth\Actions;

use App\Models\User;
use Common\Auth\Events\UserCreated;
use Common\Auth\Permissions\Traits\SyncsPermissions;
use Common\Auth\Roles\Role;
use Illuminate\Support\Arr;

class CreateUser
{
    use SyncsPermissions;

    public function execute(array $params): User
    {
        if (
            !settings('require_email_confirmation') &&
            !array_key_exists('email_verified_at', $params)
        ) {
            $params['email_verified_at'] = now();
        }

        $geoData = geoip(getIp());
        $params['language'] = $params['language'] ?? config('app.locale');
        $params['country'] =
            $params['country'] ?? ($geoData['iso_code'] ?? null);
        $params['timezone'] =
            $params['timezone'] ?? ($geoData['timezone'] ?? null);

        $user = User::create(Arr::except($params, ['roles', 'permissions']));

        if (array_key_exists('roles', $params)) {
            $user->roles()->attach($params['roles']);
        }

        // if no roles were attached, assign default role
        if ($user->roles()->count() === 0) {
            $defaultRole = app(Role::class)->getDefaultRole();
            if ($defaultRole) {
                $user->roles()->attach($defaultRole->id);
            }
        }

        if (array_key_exists('permissions', $params)) {
            $this->syncPermissions($user, $params['permissions']);
        }

        event(new UserCreated($user, $params));

        return $user;
    }
}
