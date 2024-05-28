<?php

namespace Common\Auth\Fortify;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Laravel\Fortify\Fortify;
use Laravel\Fortify\LoginRateLimiter;

class ValidateLoginCredentials
{
    public function execute(Request $request): ?User
    {
        $user = User::where('email', $request->email)->first();

        if (!FortifyRegisterUser::emailIsValid($request->email)) {
            $this->throwFailedAuthenticationException(
                $request,
                __('This domain is blacklisted.'),
            );
        }

        if ($user?->isBanned()) {
            $comment = $user->bans()->first()->comment;
            $this->throwFailedAuthenticationException(
                $request,
                $comment
                    ? __('Banned: :reason', ['reason' => $comment])
                    : __('This user is banned.'),
            );
        }

        if ($user && Hash::check($request->password, $user->password)) {
            return $user;
        }

        return null;
    }

    public function throwFailedAuthenticationException(
        Request $request,
        string $message,
    ) {
        app(LoginRateLimiter::class)->increment($request);

        throw ValidationException::withMessages([
            Fortify::username() => [$message],
        ]);
    }
}
