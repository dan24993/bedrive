import {useEffect, useRef, useState} from 'react';
import {loadStripe, Stripe, StripeElements} from '@stripe/stripe-js';
import {apiClient} from '@common/http/query-client';
import {useSelectedLocale} from '@common/i18n/selected-locale';
import {useAuth} from '@common/auth/use-auth';
import {useIsDarkMode} from '@common/ui/themes/use-is-dark-mode';
import {useSettings} from '@common/core/settings/use-settings';

interface UseStripeProps {
  type: 'setupIntent' | 'subscription';
  productId?: string | number;
  priceId?: string | number;
}
export function useStripe({type, productId, priceId}: UseStripeProps) {
  const {user} = useAuth();
  const isDarkMode = useIsDarkMode();
  const isInitiatedRef = useRef<boolean>(false);
  const paymentElementRef = useRef<HTMLDivElement>(null);
  const {localeCode} = useSelectedLocale();
  const [stripe, setStripe] = useState<Stripe | null>(null);
  const [elements, setElements] = useState<StripeElements | null>(null);
  const {
    branding: {site_name},
    billing: {
      stripe_public_key,
      stripe: {enable},
    },
  } = useSettings();

  useEffect(() => {
    if (!enable || !stripe_public_key || isInitiatedRef.current) return;

    Promise.all([
      // load stripe js library
      loadStripe(stripe_public_key, {
        apiVersion: '2022-08-01',
        locale: localeCode as any,
      }),
      // create partial subscription for clientSecret
      type === 'setupIntent'
        ? createSetupIntent()
        : createSubscription(productId!, priceId),
    ]).then(([stripe, {clientSecret}]) => {
      if (stripe && paymentElementRef.current) {
        const elements = stripe.elements({
          clientSecret,
          appearance: {
            theme: isDarkMode ? 'night' : 'stripe',
          },
        });

        // Create and mount the Payment Element
        const paymentElement = elements.create('payment', {
          business: {name: site_name},
          terms: {card: 'never'},
          fields: {
            billingDetails: {
              address: 'auto',
            },
          },
          defaultValues: {
            billingDetails: {
              email: user?.email,
            },
          },
        });
        paymentElement.mount(paymentElementRef.current);

        setStripe(stripe);
        setElements(elements);
      }
    });

    isInitiatedRef.current = true;
  }, [
    productId,
    stripe_public_key,
    enable,
    isDarkMode,
    localeCode,
    site_name,
    type,
    user?.email,
  ]);

  return {
    stripe,
    elements,
    paymentElementRef,
    stripeIsEnabled: stripe_public_key != null && enable,
  };
}

function createSetupIntent(): Promise<{clientSecret: string}> {
  return apiClient.post('billing/stripe/create-setup-intent').then(r => r.data);
}

function createSubscription(
  productId: number | string,
  priceId?: number | string
): Promise<{clientSecret: string}> {
  return apiClient
    .post('billing/stripe/create-partial-subscription', {
      product_id: productId,
      price_id: priceId,
    })
    .then(r => r.data);
}
