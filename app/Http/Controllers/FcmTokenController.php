<?php

namespace App\Http\Controllers;

use Common\Core\BaseController;
use Illuminate\Support\Facades\Auth;

class FcmTokenController extends BaseController
{
    public function store()
    {
        $data = $this->validate(request(), [
            'token' => 'required|string',
            'deviceId' => 'required|string',
        ]);

        Auth::user()
            ->fcmTokens()
            ->where(['device_id' => $data['deviceId']])
            ->delete();

        $model = Auth::user()
            ->fcmTokens()
            ->create([
                'token' => $data['token'],
                'device_id' => $data['deviceId'],
            ]);

        return $this->success(['token' => $data['token']]);
    }
}
