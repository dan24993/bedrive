<?php namespace Common\Core\Policies;

use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class SettingPolicy
{
    use HandlesAuthorization;

    public function index(User $user)
    {
        return $user->hasPermission('settings.view');
    }

    public function update(User $user)
    {
        return $user->hasPermission('settings.update');
    }
}
