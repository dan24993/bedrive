<?php

namespace Common\Billing\Invoices;

use Common\Billing\Subscription;
use Common\Core\AppUrl;
use Common\Core\BaseController;
use Common\Settings\Settings;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class InvoiceController extends BaseController
{
    public function __construct(
        protected Request $request,
        protected Invoice $invoice,
    ) {
    }

    public function index(): Response|JsonResponse
    {
        $userId = $this->request->get('userId');
        $this->authorize('index', [Invoice::class, $userId]);

        if ($userId) {
            $subscription = Subscription::where(
                'user_id',
                $userId,
            )->firstOrFail();
            $invoices = $subscription->invoices()->with(
                'subscription.product',
                'subscription.price',
            )->get();
        } else {
            $invoices = $this->invoice
                ->with('subscription.product', 'subscription.price')
                ->limit(50)
                ->get();
        }

        return $this->success(['invoices' => $invoices]);
    }

    public function show(string $uuid)
    {
        $invoice = $this->invoice
            ->where('uuid', $uuid)
            ->with(
                'subscription.product',
                'subscription.user',
                'subscription.price',
            )
            ->firstOrFail();

        $this->authorize('show', $invoice);

        return view('common::billing/invoice')
            ->with('invoice', $invoice)
            ->with('htmlBaseUri', app(AppUrl::class)->htmlBaseUri)
            ->with('user', $invoice->subscription->user)
            ->with('settings', app(Settings::class));
    }
}
