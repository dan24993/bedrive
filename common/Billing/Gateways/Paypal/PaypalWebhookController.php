<?php namespace Common\Billing\Gateways\Paypal;

use Common\Billing\GatewayException;
use Common\Billing\Notifications\PaymentFailed;
use Common\Billing\Subscription;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Arr;
use Symfony\Component\HttpFoundation\Response;

class PaypalWebhookController extends Controller
{
    use InteractsWithPaypalRestApi;

    public function __construct(
        protected Subscription $subscription,
        protected Paypal $paypal,
    ) {
    }

    public function handleWebhook(Request $request): Response
    {
        $payload = $request->all();

        if (
            config('common.site.verify_paypal_webhook') &&
            !$this->webhookIsValid()
        ) {
            return response('Webhook validation failed', 422);
        }

        return match ($payload['event_type']) {
            'BILLING.SUBSCRIPTION.PAYMENT.FAILED'
                => $this->handleInvoicePaymentFailed($payload),
            'BILLING.SUBSCRIPTION.ACTIVATED',
            'BILLING.SUBSCRIPTION.CANCELLED',
            'BILLING.SUBSCRIPTION.EXPIRED',
            'BILLING.SUBSCRIPTION.SUSPENDED'
                => $this->handleSubscriptionStateChanged($payload),
            'PAYMENT.SALE.COMPLETED' => $this->handleSaleCompleted($payload),
            default => response('Webhook Handled', 200),
        };
    }

    protected function handleInvoicePaymentFailed(array $payload): Response
    {
        $paypalSubscriptionId = Arr::get(
            $payload,
            'resource.billing_agreement_id',
        );

        $subscription = $this->subscription
            ->where('gateway_id', $paypalSubscriptionId)
            ->first();
        $subscription?->user->notify(new PaymentFailed($subscription));

        return response('Webhook handled', 200);
    }

    protected function handleSaleCompleted(array $payload): Response
    {
        $this->paypal->subscriptions->sync(
            $payload['resource']['billing_agreement_id'],
        );

        return response('Webhook Handled', 200);
    }

    protected function handleSubscriptionStateChanged(array $payload): Response
    {
        $this->paypal->subscriptions->sync($payload['resource']['id']);

        return response('Webhook Handled', 200);
    }

    protected function webhookIsValid(): bool
    {
        $payload = [
            'auth_algo' => request()->header('PAYPAL-AUTH-ALGO'),
            'cert_url' => request()->header('PAYPAL-CERT-URL'),
            'transmission_id' => request()->header('PAYPAL-TRANSMISSION-ID'),
            'transmission_sig' => request()->header('PAYPAL-TRANSMISSION-SIG'),
            'transmission_time' => request()->header(
                'PAYPAL-TRANSMISSION-TIME',
            ),
            'webhook_id' => config('services.paypal.webhook_id'),
            'webhook_event' => request()->all(),
        ];

        $response = $this->paypal()->post(
            'notifications/verify-webhook-signature',
            $payload,
        );

        if (!$response->successful()) {
            throw new GatewayException(
                "Could not validate paypal webhook: {$response->body()}",
            );
        }

        return $response['verification_status'] === 'SUCCESS';
    }
}
