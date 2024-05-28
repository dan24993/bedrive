<?php namespace Common\Auth\Controllers;

use App\Models\User;
use Common\Auth\Oauth;
use Common\Core\BaseController;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Session;

class SocialAuthController extends BaseController
{
    public function __construct(protected Oauth $oauth)
    {
        $this->middleware('auth', [
            'only' => ['connect', 'disconnect'],
        ]);
        $this->middleware('guest', [
            'only' => ['login'],
        ]);
    }

    /**
     * Connect specified social account to currently logged-in user.
     */
    public function connect(string $provider)
    {
        if (!settings("social.$provider.enable")) {
            abort(403);
        }
        return $this->oauth->redirect($provider);
    }

    /**
     * Handles case where user is trying to log in with social account whose email
     * already exists in database. Request password for local account in that case.
     */
    public function connectWithPassword(): JsonResponse
    {
        // get data for this social login persisted in session
        $data = $this->oauth->getPersistedData();

        if (!$data) {
            return $this->error(__('There was an issue. Please try again.'));
        }

        if (
            !request()->has('password') ||
            !Auth::validate([
                'email' => $data['profile']->email,
                'password' => request('password'),
            ])
        ) {
            return $this->error(__('Specified credentials are not valid'), [
                'password' => __('This password is not correct.'),
            ]);
        }

        return $this->success($this->oauth->createUserFromOAuthData($data));
    }

    public function retrieveProfile(string $providerName)
    {
        return $this->oauth->retrieveProfileOnly($providerName);
    }

    /**
     * Disconnect specified social account from currently logged-in user.
     */
    public function disconnect(string $provider)
    {
        $this->oauth->disconnect($provider);
        return $this->success();
    }

    /**
     * Login with specified social provider.
     */
    public function login(string $provider)
    {
        if (!settings("social.$provider.enable")) {
            abort(403);
        }

        return $this->oauth->loginWith($provider);
    }

    public function loginCallback(string $provider)
    {
        if ($handler = Session::get(Oauth::OAUTH_CALLBACK_HANDLER_KEY)) {
            return app($handler)->execute($provider);
        }

        $externalProfile = null;
        try {
            $externalProfile = $this->oauth->socializeWith(
                $provider,
                request('tokenFromApi'),
                request('secretFromApi'),
            );
        } catch (Exception $e) {
            Log::error($e);
        }

        if (!$externalProfile) {
            return $this->oauth->getErrorResponse(
                __('Could not retrieve social sign in account.'),
            );
        }

        // TODO: use new "OAUTH_CALLBACK_HANDLER_KEY" functionality to handle this, remove "tokenFromApi" stuff from this handler
        if (Session::get(Oauth::RETRIEVE_PROFILE_ONLY_KEY)) {
            Session::forget(Oauth::RETRIEVE_PROFILE_ONLY_KEY);
            return $this->oauth->returnProfileData($externalProfile);
        }

        $existingProfile = $this->oauth->getExistingProfile($externalProfile);

        // if user is already logged in, attach returned social account to logged-in user
        if (Auth::check()) {
            return $this->oauth->attachProfileToExistingUser(
                Auth::user(),
                $externalProfile,
                $provider,
            );
        }

        // if we have already created a user for this social account, log user in
        if ($existingProfile?->user) {
            $this->oauth->updateSocialProfileData(
                $existingProfile,
                $provider,
                $externalProfile,
            );
            return $this->oauth->logUserIn($existingProfile->user, $provider);
        }

        // if user is trying to log in with envato and does not have any valid purchases, bail
        if (
            $provider === 'envato' &&
            empty($externalProfile->user['purchases'])
        ) {
            return $this->oauth->getErrorResponse(
                'You do not have any supported purchases.',
            );
        }

        // need to request password from user in order to connect accounts
        $user = User::where('email', $externalProfile->email)->first();
        if ($user?->password) {
            $this->oauth->persistSocialProfileData([
                'service' => $provider,
                'profile' => $externalProfile,
            ]);

            return $this->oauth->getPopupResponse('REQUEST_PASSWORD');
        }

        // if we have email and didn't create an account for this profile yet, do it now
        return $this->oauth->createUserFromOAuthData([
            'profile' => $externalProfile,
            'service' => $provider,
        ]);
    }
}
