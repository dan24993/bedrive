<?php

namespace Common\Auth\Actions;

use App\Models\User;
use Common\Database\Datasource\Datasource;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Pagination\AbstractPaginator;
use Illuminate\Support\Arr;

class PaginateUsers
{
    public function execute(array $params): AbstractPaginator
    {
        $query = User::with(['roles', 'permissions']);

        if ($roleId = Arr::get($params, 'roleId')) {
            $relation = $query->getModel()->roles();
            $query
                ->leftJoin(
                    $relation->getTable(),
                    $relation->getQualifiedParentKeyName(),
                    '=',
                    $relation->getQualifiedForeignPivotKeyName(),
                )
                ->where(
                    $relation->getQualifiedRelatedPivotKeyName(),
                    '=',
                    $roleId,
                );
            $query->select(['users.*', 'user_role.created_at as created_at']);
        }

        if ($roleName = Arr::get($params, 'roleName')) {
            $query->whereHas(
                'roles',
                fn(Builder $q) => $q->where('roles.name', $roleName),
            );
        }

        if ($permission = Arr::get($params, 'permission')) {
            $query
                ->whereHas(
                    'permissions',
                    fn(Builder $query) => $query
                        ->where('name', $permission)
                        ->orWhere('name', 'admin'),
                )
                ->orWhereHas(
                    'roles',
                    fn(Builder $query) => $query->whereHas(
                        'permissions',
                        fn(Builder $query) => $query
                            ->where('name', $permission)
                            ->orWhere('name', 'admin'),
                    ),
                );
        }

        return (new Datasource($query, $params))->paginate();
    }
}
