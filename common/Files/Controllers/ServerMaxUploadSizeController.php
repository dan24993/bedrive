<?php

namespace Common\Files\Controllers;

use Common\Core\BaseController;
use Common\Files\Actions\GetServerMaxUploadSize;

class ServerMaxUploadSizeController extends BaseController
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    public function index()
    {
        return $this->success([
            'maxSize' => app(GetServerMaxUploadSize::class)->execute()[
                'original'
            ],
        ]);
    }
}
