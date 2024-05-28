<?php

namespace Common\Billing;

use Common\Billing\Models\Product;
use Common\Core\BaseController;

class PricingPageController extends BaseController
{
    public function __invoke()
    {
        $data = [
            'loader' => 'pricingPage',
            'products' => Product::with(['permissions', 'prices'])
                ->limit(15)
                ->orderBy('position', 'asc')
                ->get(),
        ];

        return $this->renderClientOrApi([
            'data' => $data,
        ]);
    }
}
