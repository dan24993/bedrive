<?php namespace Common\Auth;

use App\Models\User;
use Carbon\Carbon;
use Common\Auth\Actions\CreateUser;
use Common\Auth\Events\SocialConnected;
use Common\Auth\Events\SocialLogin;
use Common\Core\Bootstrap\BootstrapData;
use Common\Core\Bootstrap\MobileBootstrapData;
use Illuminate\Contracts\View\View as ViewContract;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\View;
use Laravel\Socialite\Facades\Socialite;
use Laravel\Socialite\One\User as OneUser;
use Laravel\Socialite\Two\User as TwoUser;

class Oauth
{
    const OAUTH_CALLBACK_HANDLER_KEY = 'oauthCallbackHandler';
    const RETRIEVE_PROFILE_ONLY_KEY = 'retrieveProfileOnly';

    private array $validProviders = ['google', 'facebook', 'twitter', 'envato'];

    public function loginWith(string $provider)
    {
        if (Auth::user()) {
            return View::make('common::oauth/popup')->with(
                'status',
                'ALREADY_LOGGED_IN',
            );
        }

        return $this->redirect($provider);
    }

    public function redirect(string $providerName)
    {
        $this->validateProvider($providerName);

        return Socialite::driver($providerName)->redirect();
    }

    /**
     * Retrieve user details from specified social account without logging user in or connecting accounts.
     */
    public function retrieveProfileOnly(string $providerName)
    {
        $this->validateProvider($providerName);

        Session::put([Oauth::RETRIEVE_PROFILE_ONLY_KEY => true]);

        $driver = Socialite::driver($providerName);

        // get user profile url from facebook
        if ($providerName === 'facebook') {
            $driver->scopes(['user_link']);
        }

        return $driver->redirect();
    }

    /**
     * Disconnect specified social account from currently logged-in user.
     */
    public function disconnect(string $provider): void
    {
        $this->validateProvider($provider);

        Auth::user()
            ->social_profiles()
            ->where('service_name', $provider)
            ->delete();
    }

    /**
     * Get user profile from specified social provider or throw 404 if it's invalid.
     */
    public function socializeWith(
        string $provider,
        ?string $token,
        ?string $secret,
    ) {
        $this->validateProvider($provider);

        if ($token && $secret) {
            $user = Socialite::driver($provider)->userFromTokenAndSecret(
                $token,
                $secret,
            );
        } elseif ($token) {
            $user = Socialite::driver($provider)->userFromToken($token);
        } else {
            $user = Socialite::with($provider)->user();
        }

        return $user;
    }

    /**
     * Return existing social profile from database for specified external social profile.
     */
    public function getExistingProfile(mixed $profile): ?SocialProfile
    {
        if (!$profile) {
            return null;
        }

        return SocialProfile::where(
            'user_service_id',
            $this->getUsersIdentifierOnService($profile),
        )
            ->with('user')
            ->first();
    }

    /**
     * Create a new user from given social profile and log him in.
     */
    public function createUserFromOAuthData(array $data)
    {
        $profile = $data['profile'];
        $service = $data['service'];

        $user = User::where('email', $profile->email)->first();

        //create a new user if one does not exist with specified email
        if (!$user) {
            $img = str_replace('http://', 'https://', $profile->avatar);
            $user = (new CreateUser())->execute([
                'email' => $profile->email,
                'avatar' => $img,
                'email_verified_at' => now(),
            ]);
        }

        //save this social profile data, so we can log in the user easily next time
        $user
            ->social_profiles()
            ->create(
                $this->transformSocialProfileData(
                    $service,
                    $profile,
                    $user->id,
                ),
            );

        return $this->logUserIn($user, $service);
    }

    public function updateSocialProfileData(
        SocialProfile $profile,
        string $service,
        $data,
        User|null $user = null,
    ): void {
        $data = $this->transformSocialProfileData(
            $service,
            $data,
            $user->id ?? $profile->user_id,
        );

        $profile->fill($data)->save();
    }

    public function attachProfileToExistingUser(
        User $user,
        mixed $profile,
        string $service,
    ) {
        $payload = $this->transformSocialProfileData(
            $service,
            $profile,
            $user->id,
        );

        //if this social account is already attached to some user
        //we will re-attach it to specified user
        if ($existing = $this->getExistingProfile($profile)) {
            $this->updateSocialProfileData(
                $existing,
                $service,
                $profile,
                $user,
            );

            //if social account is not attached to any user, we will
            //create a model for it and attach it to specified user
        } else {
            $user->social_profiles()->create($payload);
        }

        $response = [
            'bootstrapData' => app(BootstrapData::class)
                ->init()
                ->getEncoded(),
        ];

        event(new SocialConnected($user, $service));

        return request()->expectsJson()
            ? $response
            : $this->getPopupResponse('SUCCESS', $response);
    }

    private function transformSocialProfileData(
        string $service,
        TwoUser|OneUser $data,
        int $userId,
    ): array {
        return [
            'service_name' => $service,
            'user_service_id' => $this->getUsersIdentifierOnService($data),
            'user_id' => $userId,
            'username' => $data->name,
            'access_token' => $data->token ?? null,
            'refresh_token' => $data->refreshToken ?? null,
            'access_expires_at' =>
                isset($data->expiresIn) && $data->expiresIn
                    ? Carbon::now()->addSeconds($data->expiresIn)
                    : null,
        ];
    }

    public function returnProfileData($externalProfile)
    {
        $normalizedProfile = [
            'id' => $externalProfile->id,
            'name' => $externalProfile->name,
            'email' => $externalProfile->email,
            'avatar' => $externalProfile->avatar,
            'profileUrl' => $externalProfile->profileUrl,
        ];

        if (request()->expectsJson()) {
            return ['profile' => $normalizedProfile];
        } else {
            return $this->getPopupResponse('SUCCESS_PROFILE_RETRIEVE', [
                'profile' => $normalizedProfile,
            ]);
        }
    }

    /**
     * Log given user into the app and return
     * a view to close popup in front end.
     */
    public function logUserIn(User $user, string $serviceName)
    {
        Auth::loginUsingId($user->id, true);
        if (request('tokenForDevice')) {
            $response = app(MobileBootstrapData::class)
                ->init()
                ->refreshToken(request('tokenForDevice'))
                ->get();
        } else {
            $response = [
                'bootstrapData' => app(BootstrapData::class)
                    ->init()
                    ->getEncoded(),
            ];
        }

        event(new SocialLogin($user, $serviceName));

        if (request()->expectsJson()) {
            return $response;
        } else {
            return $this->getPopupResponse('SUCCESS', $response);
        }
    }

    public function getErrorResponse(string $message)
    {
        if (request()->wantsJson()) {
            return response()->json(['message' => $message], 500);
        } else {
            return $this->getPopupResponse('ERROR', [
                'errorMessage' => $message,
            ]);
        }
    }

    /**
     * Get oauth data persisted in current session.
     *
     * @param string $key
     * @return mixed
     */
    public function getPersistedData($key = null)
    {
        //test session when not logged, what if multiple users log in at same time etc

        $data = Session::get('social_profile');

        if (!$key) {
            return $data;
        }

        if ($key && isset($data[$key])) {
            return $data[$key];
        }
    }

    /**
     * Store specified social profile information in the session
     * for use in subsequent social login process steps.
     */
    public function persistSocialProfileData(array $data): void
    {
        foreach ($data as $key => $value) {
            Session::put("social_profile.$key", $value);
        }
    }

    /**
     * Check if provider user want to login with is valid, if not throw 404
     */
    private function validateProvider(string $provider): void
    {
        if (!in_array($provider, $this->validProviders)) {
            abort(404);
        }
    }

    /**
     * Get users unique identifier on social service from given profile.
     */
    private function getUsersIdentifierOnService(mixed $profile): int|string
    {
        return $profile->id ?? $profile->email;
    }

    public function getPopupResponse(string $status, $data = null): ViewContract
    {
        $view = View::make('common::oauth/popup')->with('status', $status);

        if ($data) {
            $view->with('data', json_encode($data));
        }

        return $view;
    }
}
