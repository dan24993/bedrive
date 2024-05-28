<?php namespace Common\Auth\Controllers;

use App\Models\User;
use Auth;
use Common\Core\BaseController;

class EmailVerificationController extends BaseController
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function validateOtp()
    {
        $code = request('code');
        $user = Auth::user();

        if (!$code || !$user->emailVerificationOtpIsValid($code)) {
            $msg = __(
                'The security code you entered is invalid or has expired',
            );
            return $this->error($msg, [
                'code' => $msg,
            ]);
        }

        $user->markEmailAsVerified();

        return $this->success();
    }

    public function resendVerificationEmail()
    {
        $data = $this->validate(request(), ['email' => 'required|email']);

        $user = User::where('email', $data['email'])->firstOrFail();

        $this->authorize('update', $user);

        $user->sendEmailVerificationNotification();

        return $this->success();
    }
}
