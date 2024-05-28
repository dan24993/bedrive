<?php namespace Common\Auth\Controllers;

use App\Models\User;
use Auth;
use Common\Core\BaseController;

class UserFollowersController extends BaseController
{
    public function __construct()
    {
        $this->middleware('auth')->except(['index']);
    }

    public function index(User $user)
    {
        $this->authorize('show', $user);

        $pagination = $user
            ->followers()
            ->withCount(['followers'])
            ->simplePaginate(request('perPage') ?? 20);

        return $this->success(['pagination' => $pagination]);
    }

    public function follow(User $userToFollow)
    {
        if ($userToFollow->id !== Auth::user()->id) {
            Auth::user()
                ->followedUsers()
                ->sync([$userToFollow->id], false);
        }

        return $this->success();
    }

    public function unfollow(User $userToFollow)
    {
        if ($userToFollow->id != Auth::user()->id) {
            Auth::user()
                ->followedUsers()
                ->detach($userToFollow->id);
        }

        return $this->success();
    }
}
