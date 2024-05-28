<?php namespace Common\Core\Policies;

use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class ReportPolicy
{
    use HandlesAuthorization;

    public function index(User $user)
    {
        return $user->hasPermission('admin.access');
    }
}
