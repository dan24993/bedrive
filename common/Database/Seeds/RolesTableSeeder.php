<?php namespace Common\Database\Seeds;

use App\Models\User;
use Common\Auth\Permissions\Permission;
use Common\Auth\Permissions\Traits\SyncsPermissions;
use Common\Auth\Roles\Role;
use Illuminate\Database\Seeder;
use Illuminate\Filesystem\Filesystem;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class RolesTableSeeder extends Seeder
{
    use SyncsPermissions;

    private array $commonConfig = [];
    private array $appConfig = [];

    public function __construct(
        protected Role $role,
        protected User $user,
        protected Permission $permission,
        protected Filesystem $fs,
    ) {
    }

    public function run(): void
    {
        $this->commonConfig = File::getRequire(
            app('path.common') . '/resources/defaults/permissions.php',
        );
        $this->appConfig = File::getRequire(
            resource_path('defaults/permissions.php'),
        );

        foreach ($this->appConfig['roles'] as $appRole) {
            if ($commonRoleName = Arr::get($appRole, 'extends')) {
                $commonRole = $this->findRoleConfig($commonRoleName);
                $appRole = array_merge($commonRole, $appRole);
                $appRole['permissions'] = array_merge(
                    $commonRole['permissions'],
                    $appRole['permissions'],
                );
            }

            // skip billing permissions if billing is not integrated
            $appRole['permissions'] = array_filter(
                $appRole['permissions'],
                function ($permission) {
                    if (is_array($permission)) {
                        $permission = $permission['name'];
                    }
                    return config('common.site.billing_integrated') ||
                        !Str::contains($permission, ['invoice.', 'plans.']);
                },
            );

            $this->createOrUpdateRole($appRole);
        }
    }

    private function findRoleConfig(string $roleName): array
    {
        $roleConfig = Arr::first($this->commonConfig['roles'], function (
            $role,
        ) use ($roleName) {
            return $role['name'] === $roleName;
        });
        if (!$roleConfig) {
            $roleConfig = Arr::first($this->appConfig['roles'], function (
                $role,
            ) use ($roleName) {
                return $role['name'] === $roleName;
            });
        }
        return $roleConfig;
    }

    private function createOrUpdateRole(array $appRole): Role
    {
        $defaultPermissions = collect($appRole['permissions'])->map(
            fn($permission) => is_string($permission)
                ? ['name' => $permission]
                : $permission,
        );

        $dbPermissions = Permission::whereIn(
            'name',
            $defaultPermissions->pluck('name'),
        )->get();
        $dbPermissions->map(function (Permission $permission) use (
            $defaultPermissions,
        ) {
            $defaultPermission = $defaultPermissions
                ->where('name', $permission['name'])
                ->first();
            $permission['restrictions'] =
                Arr::get($defaultPermission, 'restrictions') ?: [];
            return $permission;
        });

        if (Arr::get($appRole, 'default')) {
            $attributes = ['default' => true];
            Role::where('name', $appRole['name'])->update(['default' => true]);
        } elseif (Arr::get($appRole, 'guests')) {
            $attributes = ['guests' => true];
            Role::where('name', $appRole['name'])->update(['guests' => true]);
        } else {
            $attributes = ['name' => $appRole['name']];
        }

        if ($role = Role::where($attributes)->first()) {
            return $role;
        } else {
            $role = $this->role->create(
                Arr::except($appRole, ['permissions', 'extends']),
            );
            $this->syncPermissions(
                $role,
                $role->permissions->concat($dbPermissions),
            );
            $role->save();

            return $role;
        }
    }
}
