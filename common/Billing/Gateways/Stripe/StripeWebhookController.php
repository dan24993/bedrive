<?php namespace Common\Billing\Gateways\Stripe;

use App\Models\User;
use Common\Billing\Notifications\PaymentFailed;
use Common\Billing\Subscription;
use Exception;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\Routing\ResponseFactory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Routing\Controller;
use Stripe\Invoice as StripeInvoice;
use Stripe\Subscription as StripeSubscription;
use Stripe\Webhook;

class StripeWebhookController extends Controller
{
    public function __construct(
        protected Stripe $stripe,
        protected Subscription $subscription,
    ) {
    }

    public function handleWebhook(Request $request): Response|JsonResponse
    {
        $webhookSecret = config('services.stripe.webhook_secret');
        if ($webhookSecret) {
            try {
                $event = Webhook::constructEvent(
                    $request->getContent(),
                    $request->header('stripe-signature'),
                    $webhookSecret,
                )->toArray();
            } catch (Exception $e) {
                return response()->json(['message' => $e->getMessage()], 403);
            }
        } else {
            $event = $request->all();
        }

        return match ($event['type']) {
            'invoice.paid' => $this->handleInvoicePaid($event),
            // sync user payment methods with local database
            'customer.updated' => $this->handleCustomerUpdated($event),
            // user subscription ended and can't be resumed
            'customer.subscription.deleted' => $this->deleteSubscription(
                $event,
            ),
            // automatic subscription renewal failed on stripe
            'invoice.payment_failed' => $this->handleInvoicePaymentFailed(
                $event,
            ),
            'customer.subscription.created',
            'customer.subscription.updated'
                => $this->handleSubscriptionCreatedAndUpdated($event),
            default => response('Webhook handled', 200),
        };
    }

    protected function handleInvoicePaid(
        array $payload,
    ): Response|Application|ResponseFactory {
        $stripeInvoice = $payload['data']['object'];
        $stripeSubscriptionId = $stripeInvoice['subscription'];

        $subscription = Subscription::where(
            'gateway_id',
            $stripeSubscriptionId,
        )->first();

        if ($subscription) {
            $this->stripe->subscriptions->createOrUpdateInvoice(
                $subscription,
                $stripeInvoice['id'],
                true,
            );
        }

        return response('Webhook Handled', 200);
    }

    protected function handleCustomerUpdated(
        array $payload,
    ): Response|Application|ResponseFactory {
        $stripeCustomer = $payload['data']['object'];
        $user = User::where('stripe_id', $stripeCustomer['id'])->firstOrFail();

        $stripePaymentMethods = $this->stripe->client->customers
            ->allPaymentMethods($stripeCustomer['id'], ['type' => 'card'])
            ->toArray()['data'];

        if (!empty($stripePaymentMethods)) {
            $card = $stripePaymentMethods[0]['card'];
            $this->stripe->storeCardDetailsLocally($user, $card);
        }

        return response('Webhook Handled', 200);
    }

    protected function handleInvoicePaymentFailed(array $payload): Response
    {
        $stripeUserId = $payload['data']['object']['customer'];
        $user = User::where('stripe_id', $stripeUserId)->first();

        $reason = $payload['data']['object']['billing_reason'];
        $shouldNotify =
            $reason === StripeInvoice::BILLING_REASON_SUBSCRIPTION_CYCLE ||
            $reason === StripeInvoice::BILLING_REASON_SUBSCRIPTION_THRESHOLD;

        if ($user && $shouldNotify) {
            $stripeSubscription = $user
                ->subscriptions()
                ->where('gateway_name', 'stripe')
                ->first();
            if ($stripeSubscription) {
                $user->notify(new PaymentFailed($stripeSubscription));
            }
        }

        return response('Webhook handled', 200);
    }

    protected function handleSubscriptionCreatedAndUpdated(array $payload)
    {
        $stripeSubscriptions = $payload['data']['object'];

        // initial payment failed and 24 hours passed, subscription can't be renewed anymore
        if (
            $stripeSubscriptions['status'] ===
            StripeSubscription::STATUS_INCOMPLETE_EXPIRED
        ) {
            $this->deleteSubscription($payload);
            // sync subscription with latest data on stripe, regardless of event type
        } else {
            $this->stripe->subscriptions->sync($stripeSubscriptions['id']);
        }

        return response('Webhook Handled', 200);
    }

    protected function deleteSubscription(array $payload)
    {
        $subscription = Subscription::where(
            'gateway_id',
            $payload['data']['object']['id'],
        )->first();

        $subscription?->cancelAndDelete();

        return response('Webhook handled', 200);
    }
}
