<?php

namespace Common\Auth\Controllers;

use App\Models\User;
use Common\Core\BaseController;

class UserFollowedUsersController extends BaseController
{
    public function index(User $user)
    {
        $this->authorize('show', $user);

        $pagination = $user
            ->followedUsers()
            ->withCount(['followers'])
            ->paginate(request('perPage', 20));

        return $this->success(['pagination' => $pagination]);
    }

    public function ids(User $user)
    {
        $this->authorize('show', $user);

        $ids = $user->followedUsers()->pluck('id');

        return $this->success(['ids' => $ids]);
    }
}
