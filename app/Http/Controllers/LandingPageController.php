<?php

namespace App\Http\Controllers;

use Common\Billing\Models\Product;
use Common\Core\BaseController;

class LandingPageController extends BaseController
{
    public function __invoke()
    {
        return $this->renderClientOrApi([
            'pageName' => 'landing-page',
            'data' => [
                'loader' => 'landingPage',
                'products' => Product::with(['permissions', 'prices'])
                    ->limit(15)
                    ->orderBy('position', 'asc')
                    ->get(),
            ],
        ]);
    }
}
