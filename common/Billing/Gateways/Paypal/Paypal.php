<?php namespace Common\Billing\Gateways\Paypal;

use Common\Billing\Gateways\Contracts\CommonSubscriptionGatewayActions;
use Common\Billing\Models\Price;
use Common\Billing\Models\Product;
use Common\Billing\Subscription;
use Common\Settings\Settings;

class Paypal implements CommonSubscriptionGatewayActions
{
    use InteractsWithPaypalRestApi;

    public function __construct(
        protected Settings $settings,
        protected PaypalPlans $plans,
        public PaypalSubscriptions $subscriptions,
    ) {
    }

    public function isSubscriptionIncomplete(Subscription $subscription): bool
    {
        return $this->subscriptions->isIncomplete($subscription);
    }

    public function isSubscriptionPastDue(Subscription $subscription): bool
    {
        return $this->subscriptions->isPastDue($subscription);
    }

    public function isEnabled(): bool
    {
        return (bool) app(Settings::class)->get('billing.paypal.enable');
    }

    public function syncPlan(Product $product): bool
    {
        return $this->plans->sync($product);
    }

    public function deletePlan(Product $product): bool
    {
        return $this->plans->delete($product);
    }

    public function changePlan(
        Subscription $subscription,
        Product $newProduct,
        Price $newPrice,
    ): bool {
        return $this->subscriptions->changePlan(
            $subscription,
            $newProduct,
            $newPrice,
        );
    }

    public function cancelSubscription(
        Subscription $subscription,
        bool $atPeriodEnd = true,
    ): bool {
        return $this->subscriptions->cancel($subscription, $atPeriodEnd);
    }

    public function resumeSubscription(
        Subscription $subscription,
        array $gatewayParams = [],
    ): bool {
        return $this->subscriptions->resume($subscription, $gatewayParams);
    }
}
