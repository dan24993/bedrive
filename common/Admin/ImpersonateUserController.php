<?php

namespace Common\Admin;

use App\Models\User;
use Common\Core\BaseController;
use Illuminate\Contracts\Auth\StatefulGuard;
use Laravel\Fortify\LoginRateLimiter;

class ImpersonateUserController extends BaseController
{
    public function __construct(
        protected StatefulGuard $guard,
        protected LoginRateLimiter $limiter,
    ) {
        $this->middleware('isAdmin');
    }

    public function impersonate(int $userId)
    {
        $impersonated = User::findOrFail($userId);
        
        if ($impersonated->id === $this->guard->id()) {
            return $this->error(__('You are already logged in as this user.'));
        }

        $impersonatorId = $this->guard->id();

        $this->logout();

        $this->guard->login($impersonated, true);
        request()
            ->session()
            ->regenerate();
        $this->limiter->clear(request());

        session()->put('impersonator_id', $impersonatorId);

        return $this->success([
            'user' => $impersonated,
        ]);
    }

    public function stopImpersonating()
    {
        $this->logout();
        session()->forget('impersonator_id');

        return $this->success();
    }

    protected function logout(): void
    {
        $this->guard->logout();
        if (request()->hasSession()) {
            request()
                ->session()
                ->invalidate();
            request()
                ->session()
                ->regenerateToken();
        }
    }
}
