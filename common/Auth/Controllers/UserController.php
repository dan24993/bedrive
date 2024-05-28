<?php namespace Common\Auth\Controllers;

use App\Models\User;
use Auth;
use Common\Auth\Actions\CreateUser;
use Common\Auth\Actions\DeleteUsers;
use Common\Auth\Actions\PaginateUsers;
use Common\Auth\Actions\UpdateUser;
use Common\Auth\Requests\CrupdateUserRequest;
use Common\Core\BaseController;

class UserController extends BaseController
{
    public function __construct()
    {
        $this->middleware('auth', ['except' => ['show']]);
    }

    public function index()
    {
        $this->authorize('index', User::class);

        $pagination = (new PaginateUsers())->execute(request()->all());

        return $this->success(['pagination' => $pagination]);
    }

    public function show(User $user)
    {
        $relations = array_filter(explode(',', request('with', '')));
        $relations = array_merge(['roles', 'social_profiles'], $relations);

        if (settings('envato.enable')) {
            $relations[] = 'purchase_codes';
        }

        if (Auth::id() === $user->id) {
            $relations[] = 'tokens';
            $user->makeVisible([
                'two_factor_confirmed_at',
                'two_factor_recovery_codes',
            ]);
            if ($user->two_factor_confirmed_at) {
                $user->two_factor_recovery_codes = $user->recoveryCodes();
                $user->syncOriginal();
            }
        }

        $user->load($relations);

        $this->authorize('show', $user);

        return $this->success(['user' => $user]);
    }

    public function store(CrupdateUserRequest $request)
    {
        $this->authorize('store', User::class);

        $user = (new CreateUser())->execute($request->validated());

        return $this->success(['user' => $user], 201);
    }

    public function update(User $user, CrupdateUserRequest $request)
    {
        $this->authorize('update', $user);

        $user = (new UpdateUser())->execute($user, $request->validated());

        return $this->success(['user' => $user]);
    }

    public function destroy(string $ids)
    {
        $userIds = explode(',', $ids);
        $shouldDeleteCurrentUser = request('deleteCurrentUser');
        $this->authorize('destroy', [User::class, $userIds]);

        $users = User::whereIn('id', $userIds)->get();

        // guard against current user or admin user deletion
        foreach ($users as $user) {
            if (!$shouldDeleteCurrentUser && $user->id === Auth::id()) {
                return $this->error(
                    __('Could not delete currently logged in user: :email', [
                        'email' => $user->email,
                    ]),
                );
            }

            if ($user->hasPermission('admin')) {
                return $this->error(
                    __('Could not delete admin user: :email', [
                        'email' => $user->email,
                    ]),
                );
            }
        }

        (new DeleteUsers())->execute($users->pluck('id')->toArray());

        return $this->success();
    }
}
