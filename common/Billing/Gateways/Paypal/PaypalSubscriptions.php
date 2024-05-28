<?php namespace Common\Billing\Gateways\Paypal;

use App\Models\User;
use Common\Billing\Invoices\CreateInvoice;
use Common\Billing\Invoices\Invoice;
use Common\Billing\Models\Price;
use Common\Billing\Models\Product;
use Common\Billing\Subscription;
use Illuminate\Support\Carbon;

class PaypalSubscriptions
{
    use InteractsWithPaypalRestApi;

    public function isIncomplete(Subscription $subscription): bool
    {
        return $subscription->gateway_status === 'APPROVAL_PENDING' ||
            $subscription->gateway_status === 'APPROVED';
    }

    public function isPastDue(Subscription $subscription): bool
    {
        // no way to check this via PayPal API
        return false;
    }

    public function sync(
        string $paypalSubscriptionId,
        ?int $userId = null,
    ): void {
        $response = $this->paypal()->get(
            "billing/subscriptions/$paypalSubscriptionId",
        );

        $price = Price::where('paypal_id', $response['plan_id'])->firstOrFail();

        if ($userId != null) {
            $user = User::where('id', $userId)->firstOrFail();
            $user->update(['paypal_id' => $response['subscriber']['payer_id']]);
        } else {
            $user = User::where(
                'paypal_id',
                $response['subscriber']['payer_id'],
            )->firstOrFail();
        }

        $subscription = $user->subscriptions()->firstOrNew([
            'gateway_name' => 'paypal',
            'gateway_id' => $response['id'],
        ]);

        if (
            in_array($response['status'], ['CANCELLED', 'EXPIRED', 'SUSPENDED'])
        ) {
            $subscription->markAsCancelled();
        }

        $data = [
            'price_id' => $price->id,
            'product_id' => $price->product_id,
            'gateway_name' => 'paypal',
            'gateway_id' => $paypalSubscriptionId,
            'gateway_status' => $response['status'],
            'renews_at' =>
                $response['status'] === 'ACTIVE' &&
                isset($response['billing_info']['next_billing_time'])
                    ? Carbon::parse(
                        $response['billing_info']['next_billing_time'],
                    )
                    : null,
        ];

        if ($response['status'] === 'ACTIVE') {
            $data['ends_at'] = null;
        }

        $subscription->fill($data)->save();

        $this->createOrUpdateInvoice($subscription, $response->json());
    }

    public function createOrUpdateInvoice(
        Subscription $subscription,
        array $paypalSubscription,
    ): void {
        // subscription is no longer active, no need to update invoice
        if (!isset($paypalSubscription['billing_info']['next_billing_time'])) {
            return;
        }

        $startTime = Carbon::parse($paypalSubscription['start_time']);
        $renewsAt = Carbon::parse(
            $paypalSubscription['billing_info']['next_billing_time'],
        );
        $isPaid = $paypalSubscription['status'] === 'ACTIVE';

        $existing = Invoice::whereBetween('created_at', [
            $startTime,
            $renewsAt,
        ])->first();
        if ($existing) {
            // paid invoices should never be set to unpaid
            if (!$existing->paid) {
                $existing->update(['paid' => $isPaid]);
            }
        } else {
            (new CreateInvoice())->execute([
                'subscription_id' => $subscription->id,
                'paid' => $isPaid,
            ]);
        }
    }

    public function changePlan(
        Subscription $subscription,
        Product $newProduct,
        Price $newPrice,
    ): bool {
        $this->paypal()->post(
            "billing/subscriptions/$subscription->gateway_id/revise",
            [
                'plan_id' => $newPrice->paypal_id,
            ],
        );

        $this->sync($subscription->gateway_id);

        return true;
    }

    public function cancel(
        Subscription $subscription,
        $atPeriodEnd = true,
    ): bool {
        if ($atPeriodEnd) {
            $this->paypal()->post(
                "billing/subscriptions/$subscription->gateway_id/suspend",
                ['reason' => 'User requested cancellation.'],
            );
        } else {
            $this->paypal()->post(
                "billing/subscriptions/$subscription->gateway_id/cancel",
                ['reason' => 'Subscription deleted locally.'],
            );
        }

        $this->sync($subscription->gateway_id);

        return true;
    }

    public function resume(Subscription $subscription, array $params): bool
    {
        $this->paypal()->post(
            "billing/subscriptions/$subscription->gateway_id/activate",
            ['reason' => 'Subscription resumed by user.'],
        );

        $this->sync($subscription->gateway_id);

        return true;
    }
}
