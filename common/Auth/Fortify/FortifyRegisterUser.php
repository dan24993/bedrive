<?php

namespace Common\Auth\Fortify;

use App\Models\User;
use Closure;
use Common\Auth\Actions\CreateUser;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class FortifyRegisterUser implements CreatesNewUsers
{
    use PasswordValidationRules;

    public function create(array $input): User
    {
        if (settings('registration.disable')) {
            abort(404);
        }

        $appRules = config('common.registration-rules') ?? [];
        $commonRules = [
            'email' => [
                'required',
                'string',
                'email',
                'max:255',
                Rule::unique(User::class),
                function (string $attribute, mixed $value, Closure $fail) {
                    if (!self::emailIsValid($value)) {
                        $fail(__('This domain is blacklisted.'));
                    }
                },
            ],
            'password' => $this->passwordRules(),
            'token_name' => 'string|min:3|max:50',
        ];

        foreach ($appRules as $key => $rules) {
            $commonRules[$key] = array_map(function ($rule) {
                if (str_contains($rule, '\\')) {
                    $namespace = "\\$rule";
                    return new $namespace();
                }
                return $rule;
            }, $rules);
        }

        $data = Validator::make($input, $commonRules)->validate();

        return (new CreateUser())->execute($data);
    }

    public static function emailIsValid(string $email): bool
    {
        $blacklistedDomains = explode(
            ',',
            settings('auth.domain_blacklist', ''),
        );
        if ($blacklistedDomains) {
            $domain = explode('@', $email)[1] ?? null;
            if ($domain && in_array($domain, $blacklistedDomains)) {
                return false;
            }
        }

        return true;
    }
}
